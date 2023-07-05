import { reactive, toRefs } from "vue";
import { jmyAdd, jmyGet, jmyEdit } from "@/api";
import { cloneDeep } from "lodash-es";
import { WlMessageBox } from "wltech-ui";
import { ElLink } from "element-plus";
const useWechat: any = () => {
  const state = reactive<{
    loading: boolean;
    step: number; //步骤数
    form: any; //表单信息
  }>({
    loading: false,
    step: 0,
    form: {
      button: {
        button_name: "",
        button_style: 1,
        button_text: "立即咨询",
        button_css: '{"background":"rgb(28,159,255)","color":"#FFFFFF"}',
        domain: "",
        icon_url: "",
        input_msg: "",
        jump_url: "https://ad.weiling.cn/worktable-erp-preview-page",
        useScence: "11001",
        website_name: "",
        website_type: "0",
        ocpc_type: 2,
      },
      channel: {
        miniprogram_welmsg: "立即获取更多产品详情",
        smart_type: 2,
        title: "加好友",
        state_view: true,
        user_ids: [],
        user_list: [],
        tagList: [],
        staffList: {
          schedule_user_list: [
            {
              default_user_flag: false,
              end_half_hour_index: 0,
              start_half_hour_index: 0,
              user_list: [],
              user_ids: [],
              weekday_index: [0, 1, 2, 3, 4, 5, 6],
            },
          ],
          time_cut_flag: false,
        },
        time_cut_flag: false,
        tag_ids: [],
        new_welcome_msg_info: {
          attachments: [],
          text: {
            content: "您好，我是您的专属客服，请问有什么可以帮到您的嘛？",
          },
        },
      },
    },
  });
  const errTip = (res: any) => {
    let errType = "";
    switch (+res.code) {
      case 84074:
        errType = "qrcode";
        break;
      case 60011:
        errType = "visible";
        break;
      default:
        errType = "";
    }
    if (errType) {
      WlMessageBox.alert(
        () => (
          <p>
            请&nbsp;
            <ElLink
              type="primary"
              underline={false}
              href={`https://${location.host}/help?type=${errType}`}
              target="_blank"
            >
              点击查看
            </ElLink>
            &nbsp;如何为员工开启
            {errType == "qrcode" ? "加微" : "集客通使用"}权限
            开启权限后回到本页面，并重新点击底部完成按钮，保存微信方案
          </p>
        ),
        `微信方案中有部分员工，没有${
          errType == "qrcode" ? "开通加微" : "集客通使用"
        }权限`,
        {
          type: "error",
          showConfirmButton: false,
        }
      );
    }
  };
  // 新增微信方案
  const addWechat = () => {
    if (state.loading) {
      return;
    }
    state.loading = true;
    const params = formatRequest();
    jmyAdd(params).then((res: any) => {
      state.loading = false;
      if (res.code == 200) {
        state.step++;
        state.form = {
          ...state.form,
          account: res.data?.account,
          jmyInfo: res.data?.jmyInfo,
        };
        // formatResponse(res.data);
      } else {
        errTip(res);
        // else {
        //   ElMessage({
        //     message: res.msg,
        //     type: "error",
        //     duration: 3000,
        //   });
        // }
      }
    });
  };
  // 编辑微信方案
  const editWechat = (id: any) => {
    if (state.loading) {
      return;
    }
    state.loading = true;
    const params = formatRequest();
    params.button.id = id;
    jmyEdit(params).then((res: any) => {
      state.loading = false;
      if (res.code == 200) {
        state.step++;
        formatResponse(res.data);
      } else {
        errTip(res);
      }
    });
  };

  // 查询
  const queryDetail = (id: string) => {
    return new Promise((reslove) => {
      jmyGet({ id }).then((res: any) => {
        formatResponse(res.data);
        reslove();
      });
    });
  };

  const formatRequest = () => {
    const params = cloneDeep(state.form);
    // params.channel.time_cut_flag = params.channel.staffList.time_cut_flag; // 是否分时间段
    // params.channel.user_ids =
    //   params.channel.staffList.schedule_user_list[0].userIds; //第一段时间的用户
    // params.channel.schedule_user_list =
    //   params.channel.staffList.schedule_user_list; //时间段
    // params.channel.tag_ids = params.channel.tagList.map((item: any) => {
    //   return item.tagId;
    // }); //标签
    params.channel.user_ids = params.channel.user_list.map((user: any) => {
      return user.id;
    });
    Reflect.deleteProperty(params.channel, "staffList");
    return params;
  };

  const formatResponse = (res: any) => {
    let schedule_user_list: any = [];
    if (res.channel.timeCutFlag) {
      schedule_user_list = res.channel.scheduleUserList?.map((item: any) => {
        return {
          default_user_flag: item.defaultUserFlag,
          end_half_hour_index: item.endHalfHourIndex,
          start_half_hour_index: item.startHalfHourIndex,
          user_list: item.userList,
          userIds: item.userList.map((t: any) => {
            return t.id;
          }),
          weekday_index: item.weekdayIndex,
        };
      });
    } else {
      schedule_user_list = [
        {
          default_user_flag: false,
          end_half_hour_index: 0,
          start_half_hour_index: 0,
          user_list: res.channel.userList,
          userIds: res.channel.userList?.map((item: any) => {
            return item.id;
          }),
          weekday_index: [0, 1, 2, 3, 4, 5, 6],
        },
      ];
    }

    const filter_arr = res.channel.tagGroups.map((group: any) => {
      return group.tagInfo.map((item: any) => {
        return {
          type: item.type,
          tagId: item.tagId,
          tagName: item.tagName,
          tagCreateTime: item.tagCreateTime,
          tagOrder: item.tagOrder,
          isSelf: item.isSelf,
          tag_user_id: item.tagUserId,
          groupId: group.groupId,
          groupName: group.groupName,
        };
      });
    });

    state.form = {
      button: {
        button_name: res.button.buttonName,
        button_style: res.button.buttonStyle,
        button_text: res.button.buttonText,
        button_css: res.button.buttonCss,
        domain: res.button.domain,
        icon_url: res.button.iconUrl,
        input_msg: res.button.inputMsg,
        jump_url: res.button.jumpUrl,
        useScence: res.button.useScence,
        website_name: res.button.websiteName,
        website_type: res.button.websiteType,
        ocpc_type: res.button.ocpcType,
      },
      channel: {
        id: res.channel?.id || "",
        miniprogram_welmsg: res.channel.miniprogramWelmsg,
        smart_type: res.channel.smartType,
        title: res.channel.title,
        state_view: res.channel.stateView,
        user_ids: res.channel.userIds || [],
        user_list: res.channel.userList,
        tagList: filter_arr[0],
        staffList: {
          schedule_user_list: schedule_user_list,
          time_cut_flag: res.channel.timeCutFlag,
        },
        time_cut_flag: res.channel.timeCutFlag,
        tag_ids: [],
        new_welcome_msg_info: res.channel.newWelcomeMsgInfo,
      },
      account: res.account,
      jmyInfo: res.jmyInfo,
    };
  };

  return {
    ...toRefs(state),
    addWechat,
    queryDetail,
    editWechat,
  };
};

export default useWechat;
