<template>
  <div>
    <div class="card_title">
      <p class="main_title required_behind">使用人员</p>
      <p class="sub_title">客户扫码后将自动添加好友</p>
    </div>
    <div class="flex-row flex-wrap card_info">
      <WlForm ref="formRef" :model="model" :list="list" />
    </div>
    <p class="tip pointer self-start" @click="handleHelp">
      如何为更多员工开启集客通使用权限<el-icon><QuestionFilled /></el-icon>
    </p>
    <transition name="el-zoom-in-top">
      <div class="error-wrap" v-if="state.validating">
        <div class="el-form-item__error">
          {{ state.failedMsg }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="tsx" setup>
import { reactive, watch, ref, onMounted } from "vue";
import { userPickerDept } from "@/api";
import { useUserStore } from "@/stores";
import type { FormItemType } from "wltech-ui";
import OpenData from "@/components/OpenData.vue";
import { QuestionFilled } from "@element-plus/icons-vue";
import { onUpdated } from "vue";
import { nextTick } from "vue";

const props = defineProps<{
  userList: any;
}>();

const emit = defineEmits<{
  (e: "onCkeckStaffChange", val: any): void;
}>();
const store = useUserStore();
const state = reactive<{
  validating: boolean;
  failedMsg: string;
  staffList: any;
  role_types: any;
  originData: any[];
}>({
  validating: false,
  failedMsg: "请选择使用员工",
  staffList: [], //员工列表
  role_types: store.getter_role_type_arr,
  originData: [],
});
const model = ref({});
const list = ref<FormItemType[]>([
  {
    label: "",
    key: "user_ids",
    type: "staffTree",
    props: {
      style: {
        width: "160px",
      },
      placeholder: "选择添加员工",
      multiple: true,
      innerLabel: "添加员工",
      clearable: true,
      maxEchoCount: 2,
    },
    setting: {
      nameRender: (staff) => {
        return <OpenData openid={staff.name} />;
      },
      searchAble: false,
      echoType: "tag",
      showType: "dialog",
      // treeType: "tile",
    },
    options: () =>
      userPickerDept({
        filter: { statusSet: [1], status: 5, subscribeStatus: 2 },
      }).then((res) => {
        state.originData =
          res.data?.dataList?.map((item: any) => ({
            ...item,
            disableCheckbox: item.pid == "-1" || item.id == "-1",
          })) || [];
        return state.originData;
      }),
  },
]);
const hasInvalidUser = () => {
  return (
    state.originData.filter(
      (item: any) =>
        model.value.user_ids?.includes(item.id) && item.disableCheckbox
    ).length > 0
  );
};
watch(
  () => props.userList,
  (res) => {
    model.value.user_ids = (res || []).map((item) => item.id);
    res.length &&
      setTimeout(() => {
        document
          .querySelectorAll(".el-form .wl-tag")
          .forEach((item: any, index: number) => {
            res[index]?.disableCheckbox || res[index]?.liveCodeValid === false
              ? item.classList.add("invalid")
              : item.classList.remove("invalid");
          });
      }, 300);
  },
  {
    immediate: true,
  }
);
watch(
  () => model.value.user_ids,
  (res) => {
    emit(
      "onCkeckStaffChange",
      state.originData.filter((item: any) => res.includes(item.id))
    );
    valid();
  }
);
function clearValidate() {
  state.validating = false;
}
const formRef = ref();
async function valid() {
  // 是否为空
  const hasUser = model.value.user_ids?.length;
  // 是否有无效用户，如离职用户
  if (!hasUser) {
    state.failedMsg = "请选择使用员工";
    state.validating = true;
    return false;
  } else if (hasInvalidUser()) {
    state.failedMsg = "存在离职员工";
    state.validating = true;
    return false;
  }
  // 后端验证是否有重复时间片段
  // const params = {
  //   user_ids:state.staffList.map((item: any)=>item.id),
  //   schedule_user_list: [],
  //   time_cut_flag: false
  // };
  // const {code,msg} = await onVerifyLiveCode(params);

  // if(code === 200){
  //   state.failedMsg = ''
  // } else {
  //   state.failedMsg = msg
  //   state.validating = true;
  //   return false
  // }

  state.validating = false;
  return true;
}
const handleHelp = () => {
  open(`https://${location.host}/help?type=add-staff`);
};
onMounted(() => {
  state.validating = false;
});
// onUpdated(()=>{
//   nextTick(()=>{
//     document.querySelectorAll('.el-form .wl-tag').forEach((item: any,index:number)=>{
//     state.originData.find(item=>model.value.user_ids[index]==item.id&&item.disableCheckbox)?item.classList.add('invalid'):item.classList.remove('invalid')
//   })
//   })
// })
defineExpose({
  valid,
  clearValidate,
});
</script>

<style lang="scss" scoped>
.error-wrap {
  position: relative;
}

.staff-btn {
  width: 72px;
  height: 30px;
  margin-top: 10px;
  background: var(--wl-btn-dashed-bg);
  border-radius: 6px;
  box-sizing: border-box;
  border: 1px dashed var(--wl-line-color-dark);
  cursor: pointer;
  &.tag_btn {
    border-radius: 100px;
  }
  span {
    margin-left: 6px;
    color: var(--wl-text-color-primary-2);
  }
  img {
    width: 14px;
    height: auto;
  }
}
.checked_user {
  padding: 0 6px;
  background: var(--wl-btn-dashed-bg);
  border-radius: 4px;
  color: var(--wl-text-color-primary-2);
  margin-top: 10px;
  margin-left: 16px;
  &.checked_tag {
    border-radius: 100px;
    background: #f4f5f6;
    color: #4c4c4c;
    &.crop_tag {
      color: #193591;
      background: var(--wl-primary-color-light);
    }
    span {
      font-weight: 500;
    }
  }
  img {
    width: 24px;
    height: 24px;
    -o-object-fit: cover;
    object-fit: cover;
    border-radius: 50%;
    vertical-align: middle;
  }
  span {
    margin: 0 6px;
    vertical-align: middle;
  }
}
.required_behind {
  &::after {
    content: "*";
    margin-left: 6px;
    font-weight: 500;
    font-size: 18px;
    line-height: 25px;

    color: var(--wl-error-color);
  }
}

.card_title {
  .main_title {
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
    color: #000000;
    position: relative;
    &.required_behind {
      &::after {
        position: absolute;
        left: -17px;
        top: 1.5px;
        content: "*";
        margin-left: 6px;
        font-weight: 500;
        font-size: 18px;
        color: var(--wl-error-color);
      }
    }
  }
  .sub_title {
    margin: 6px 0 16px;
    line-height: 20px;
    color: var(--wl-text-color-secondary-2);
  }
}
.tip {
  margin-top: -16px;
  width: max-content;
  position: relative;
  color: var(--wl-primary-color);
  font-size: 12px;
  .el-icon {
    vertical-align: -1px;
  }
}
</style>
