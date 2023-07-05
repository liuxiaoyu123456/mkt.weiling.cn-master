// 首次登录逻辑数据处理
import { watch, reactive, toRefs } from "vue";
import {
  accountAdd,
  checkBind,
  checkAuth,
  jmyAdd,
  smsValidate,
  accountDetail,
  accountEdit,
} from "@/api";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores";
const useWechat: any = () => {
  const { userInfo }: any = useUserStore();
  const state = reactive<{
    step: number; //步骤数
    form: any; //表单信息
    accountForm: any;
    loading: boolean;
    createprossList: any;
  }>({
    step: 0,
    form: {
      button: {
        button_name: "集客通微信方案",
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
        miniprogram_welmsg: "立即了解更多详情",
        smart_type: 2,
        title: "加好友",
        state_view: true,
        user_ids: [userInfo?.id],
        tagList: [],
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
    accountForm: {
      account_name: "",
      account_password: "",
      account_password2: "",
      vCode: "",
    },
    loading: false,
    createprossList: ["正在自动为您在百度营销通后台创建微信方案"],
  });

  const addAccount = () => {
    smsValidate({
      mobile: state.accountForm.account_name,
      sms_code: state.accountForm.vCode,
    })
      .then(async (ver: any) => {
        if (ver.code == 200) {
          let api = accountAdd;
          const accountRes = await accountDetail({});
          if (accountRes?.data?.account?.id) {
            api = accountEdit;
          }
          api({
            account_name: state.accountForm.account_name,
            account_password: state.accountForm.account_password,
          }).then((res: any) => {
            if (res.code == 200) {
              state.step++;
            } else {
              ElMessage({
                message: res.msg,
                type: "error",
              });
            }
          });
        } else {
          ElMessage({
            message: ver.msg,
            type: "error",
          });
        }
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: "error",
        });
      });
  };

  const isBind = () => {
    state.loading = true;
    checkBind({})
      .then((res: any) => {
        if (res?.data?.bindFlag) {
          state.step++;
        } else {
          ElMessage({
            message: "未查询到信息",
            type: "error",
          });
        }
        state.loading = false;
      })
      .catch((err: any) => {
        state.loading = false;
        ElMessage({
          message: err.msg,
          type: "error",
        });
      });
  };

  const isAuth = () => {
    const params = {
      uc_id: localStorage.getItem("uc_id") || "",
    };
    checkAuth(params)
      .then(async (res: any) => {
        if (res?.data?.authFlag) {
          state.step++;
          state.createprossList.push("微信方案创建中...");
          const addRes: any = await jmyAdd(state.form);
          if (addRes.code == 200) {
            state.createprossList.push("微信方案创建完成");
            setTimeout(() => {
              state.step++;
            }, 2000);
          } else {
            state.createprossList.push("微信方案创建失败");
          }
        } else {
          ElMessage({
            message: "未检测您授权的百度账号",
            type: "error",
          });
        }
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: "error",
        });
      });
  };

  // 初始化当前状态
  const load = async () => {
    let curStatus = 0;
    // 获取账户信息
    const accountRes = await accountDetail({});
    if (accountRes?.data?.account?.id) {
      state.accountForm.account_name = accountRes.data.account.username;
      state.accountForm.account_password = accountRes.data.account.password;
      curStatus = 4;
      // 获取绑定信息
      const bindRes = await checkBind({});
      if (bindRes?.data?.bindFlag) {
        curStatus = 5;
        state.step = curStatus;
        // // 获取授权信息
        // let authRes = await checkAuth({})
        // if(authRes?.data?.authFlag){
        //   curStatus = 6
        //   state.step = curStatus
        // }else{
        //   state.step = curStatus
        // }
      } else {
        state.step = curStatus;
        return;
      }
    } else {
      state.step = curStatus;
      return;
    }
  };

  return {
    ...toRefs(state),
    addAccount,
    isBind,
    isAuth,
    load,
  };
};

export default useWechat;
