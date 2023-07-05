<template>
  <div class="card title">账户中心</div>
  <div class="card">
    <div class="border-title">
      绑定的手机号及密码
      <!-- <el-link
        class="mr-3"
        :underline="false"
        type="primary"
        @click="
          dialogType = DialogType.PASSWDCHANGE;
          showDialog = true;
        "
        >修改</el-link
      > -->
    </div>
    <Fields class="user-info" :columns="accountCol" :data="accountData">
      <template #cell="{ column, cell }">
        <span v-if="column?.prop === 'username' && cell.username">{{
          resolvePhone(cell.username)
        }}</span>
        <span v-else-if="column?.prop === 'password' && cell.password">{{
          resolvepasswd(cell.password)
        }}</span>
        <span v-else>--</span>
      </template>
      <template #header="{ column }">
        <span v-if="column?.prop === 'password'"
          >{{ column.name
          }}<el-icon class="pointer" @click="showPasswd = !showPasswd"
            ><wl-svg type="invisual" /></el-icon
        ></span>
      </template>
    </Fields>
  </div>
  <div class="card">
    <div class="title">
      已授权百度账户<el-link
        v-if="advertisersData?.length"
        class="mr-3"
        :underline="false"
        type="primary"
        @click="
          dialogType = DialogType.ADVERTISERCHANGEM;
          showDialog = true;
        "
        >修改</el-link
      >
    </div>
    <Fields
      v-if="advertisersData?.length"
      class="accounts"
      :columns="advertisersCol"
      :data="advertisersData"
    ></Fields>
    <br v-else />
    <el-button
      class="px-4"
      size="small"
      type="primary"
      @click="handleAccountAdd"
      >新增授权账号</el-button
    >
  </div>
  <div class="card">
    <div class="border-title mb-6">
      使用员工<el-link
        class="mr-3"
        :underline="false"
        type="primary"
        :href="helpHref"
        target="_blank"
        >新增</el-link
      >
      <p class="desc">
        如果客户需要添加某个员工的企业微信号，请确保该员工在集客通已绑定手机号，并且在百度侧配置对应的企业微信号。
      </p>
    </div>
    <ul
      v-infinite-scroll="getUserList"
      :infinite-scroll-disabled="userListFinished || userListLoading"
      class="flex-row flex-wrap users"
    >
      <li
        v-for="item in userList"
        class="flex-row flex-none items-center users-item"
        :key="item.id"
      >
        <Avatar :src="item.headImgUrl" />
        <div class="users-item-info flex-1 flex-col items-start">
          <OpenData class="name text-l1" :openid="item.nickName" />
          <el-input
            v-if="item.editing"
            v-model="tempPhone"
            :ref="(el) => (inputRef = el)"
            size="small"
            @keyup.enter="
              () => {
                inputRef && inputRef.blur();
              }
            "
            @blur="handleChangePhone(item)"
          />
          <el-tag
            disable-transitions
            v-else-if="item.mobile"
            @click="handlePhoneEdit(item)"
            >{{ item.mobile }}</el-tag
          >
          <el-tag
            disable-transitions
            v-else
            type="info"
            @click="handlePhoneEdit(item)"
            >添加手机号</el-tag
          >
        </div>
      </li>
    </ul>
  </div>
  <el-dialog
    v-model="showDialog"
    append-to-body
    class="account-change-dialog"
    :width="dialogWidth"
    alignCenter
  >
    <div v-if="dialogType === DialogType.PASSWDSHOW && !validated">
      <p class="dialog-title">验证手机号以查看密码</p>
      <WlForm :list="passwdShowList" :model="passwdShowModel"></WlForm>
      <el-button>确认</el-button>
    </div>
    <div
      class="dialog-title"
      v-else-if="dialogType === DialogType.PASSWDSHOW && validated"
    >
      <p>您的手机号和对应的密码为</p>
      <el-button>一键复制密码</el-button>
    </div>
    <div
      class="dialog-title"
      v-else-if="dialogType === DialogType.PASSWDCHANGE"
    >
      <p>编辑手机号及密码</p>
      <el-button>保存 </el-button>
    </div>
    <div v-else-if="dialogType === DialogType.ADVERTISERCHANGEM">
      <p class="dialog-title">百度账户授权</p>
      <Fields
        class="accounts max-h-80"
        :columns="advertisersDialogCol"
        :data="advertisersData"
        ><template #cell="{ column, cell }">
          <el-link
            v-if="column?.prop === 'operation'"
            type="primary"
            :underline="false"
            @click="handleAccountEdit(cell)"
            >停止授权</el-link
          >
        </template>
      </Fields>
    </div>
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref, computed, watch, getCurrentInstance } from "vue";
import Fields from "./components/Fields.vue";
import Avatar from "@/components/Avatar.vue";
import dayjs from "dayjs";
// import { getQueryVariable } from "@/utils";
import {
  accountDetail,
  JktUserList,
  accountStatus,
  JktEditMobile,
} from "@/api";
import type { FormItemType } from "wltech-ui";
import { ElMessage } from "element-plus";
import { WlMessageBox } from "wltech-ui";
import { WarningFilled } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

const { proxy } = getCurrentInstance() as any;
// const $message = proxy.$message;
const $confirm = proxy.$confirm;
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const accountCol = [
  {
    name: "手机号",
    prop: "username",
    style: {
      width: "328px",
    },
  },
  {
    name: "密码",
    prop: "password",
  },
];
const accountData = ref<any[]>([]);
const getAccountDetail = async () => {
  const { data } = await accountDetail({});
  accountData.value = data?.account ? [data.account] : [{}];
  advertisersData.value = data.advertisers.map((i: any) => ({
    ...i.account,
    createTime: dayjs(+i.account.createTime).format("YYYY年MM月DD日 HH:mm"),
    rowKey: i.account?.id,
  }));
};

const advertisersCol = [
  {
    name: "账户",
    prop: "accountName",
    style: {
      width: "328px",
    },
  },
  {
    name: "授权时间",
    prop: "createTime",
  },
];
const advertisersDialogCol = [
  {
    name: "账户",
    prop: "accountName",
    style: {
      width: "328px",
    },
  },
  {
    name: "操作",
    prop: "operation",
  },
];
const advertisersData = ref([]);
const oAuthUrl = `https://u.baidu.com/oauth/page/index?platformId=4960345965958561794&appId=${
  import.meta.env.VITE_BAIDU_APPID
}&scope=74,75,1001788,1001789,1001455,1001790,1001791,1002829,1004606,1002161,73,71,72,67,68,69,70,65,66&state=${
  userInfo.value?.corp?.corpId || ""
}&callback=${import.meta.env.VITE_APP_DOMAIN}/auth-result`;
const resolvePhone = (phoneNum: string) => {
  const numArr = phoneNum.split("");
  numArr.splice(3, 4, " ", "*", "*", "*", "*", " ");
  return numArr.join("");
};
const showPasswd = ref(false);
const resolvepasswd = (passwd: string) => {
  return showPasswd.value ? passwd : "********";
};
const handleAccountAdd = () => {
  window.open(oAuthUrl, "_blank");
};
const handleAccountEdit = (cell: any) => {
  $confirm(
    "如果取消授权，当原小程序无法使用时，卫瓴集客通将“无法为您自动切换在百度后台配置的小程序”，从而导致客户无法正常加微",
    "请您再次确认是否取消授权！",
    {
      type: "danger",
      size: "",
    }
  )
    .then((data: any) => {
      console.log("then", data);
      accountStatus({
        id: cell.id,
        status: accountStatus.Status.DISABLED,
      }).then(() => {
        getAccountDetail();
      });
    })
    .catch((e: any) => {
      console.log("catch", e);
    });
};

const showDialog = ref(false);
const enum DialogType {
  PASSWDSHOW = 1,
  PASSWDCHANGE,
  ADVERTISERCHANGEM,
}
const validated = ref(false);
const dialogType = ref<DialogType>(-1);
const dialogWidth = computed(() => {
  return dialogType.value == DialogType.ADVERTISERCHANGEM ? 502 : 336;
});

const passwdShowModel = ref({});
const passwdShowList = ref<FormItemType[]>([
  {
    label: "手机号",
    type: "input",
    key: "mobile",
    props: {
      placeholder: "请输入手机号",
    },
  },
  {
    label: "验证码",
    type: "input",
    key: "smsCode",
    props: {
      placeholder: "请输入验证码",
    },
  },
]);

const userList = ref<any[]>([]);
const userListPage = ref(1);
const userCount = ref(1);
const userListLoading = ref(false);
const userListFinished = computed(() => {
  return userCount.value <= userList.value.length;
});
const helpHref = `https://${location.host}/help?type=add-staff`;
const getUserList = async () => {
  userListLoading.value = true;
  try {
    const { data } = await JktUserList({
      page: {
        pageCount: userListPage.value,
        limit: 18,
      },
    });
    data.dataList && userList.value.push(...data.dataList);
    userCount.value = +data.count;
    if (!userListFinished.value) {
      userListPage.value++;
    }
  } catch {
    userCount.value = -1;
  } finally {
    userListLoading.value = false;
  }
};
const tempPhone = ref("");
const inputRef = ref();
watch(inputRef, (val) => {
  val && val.focus();
});
const handleChangePhone = (item: any) => {
  if (tempPhone.value) {
    if (!/^1[3-9]\d{9}$/.test(tempPhone.value)) {
      ElMessage.error("手机号格式错误");
      item.editing = false;
    } else if (tempPhone.value !== item.mobile) {
      WlMessageBox.confirm(
        () => (
          <span style={{ fontSize: "16px", lineHeight: "1" }}>
            <el-icon
              style={{
                verticalAlign: "middle",
                marginRight: "8px",
                color: "var(--wl-warning-color)",
              }}
            >
              <WarningFilled />
            </el-icon>
            确定将 <OpenData openid={item.nickName} /> 的手机号修改为{" "}
            {tempPhone.value} 吗？
          </span>
        ),
        "",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          // type: "warning",
        }
      )
        .then(() => {
          return JktEditMobile({
            userId: item.id,
            mobile: tempPhone.value,
          });
        })
        .then(() => {
          item.mobile = tempPhone.value;
        })
        .finally(() => {
          item.editing = false;
        });
    } else {
      item.editing = false;
    }
  } else {
    item.editing = false;
  }
};
const handlePhoneEdit = (item: any) => {
  tempPhone.value = item.mobile || "";
  item.editing = true;
};
//init
getAccountDetail();
</script>
<style lang="scss" scoped>
.card:not(:first-child) {
  margin-top: 12px;
}
.mr-3 {
  margin-left: 12px;
}
.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}
.mb-6 {
  margin-bottom: 24px;
}
.max-h-80 {
  max-height: 320px;
}
.desc {
  color: var(--wl-error-color);
  // color: var(--wl-text-color-title-2);
  font-size: 14px;
  line-height: 2;
  font-weight: 400;
}
.title {
  font-size: 16px;
  color: var(--wl-text-color-title-1);
  &.card {
    padding: 16px 24px;
  }
}
.border-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--wl-text-color-title-2);
}
.user-info {
  &.fields {
    margin-top: 4px;
  }
  :deep(.fields-cell) {
    line-height: 34px;
    .el-icon {
      color: var(--wl-primary-color);
      margin-left: 16px;
      vertical-align: -3px;
    }
  }
}
.accounts {
  &.fields {
    margin-top: -4px;
    margin-bottom: 8px;
  }
  :deep(.fields-cell) {
    line-height: 50px;
  }
  .el-link {
    font-size: 18px;
  }
}
.dialog-title {
  color: var(--wl-text-color-title-2);
  font-size: 18px;
  margin-bottom: 16px;
}
:deep(.fields-cell) {
  font-size: 18px;
}
.avatar {
  font-size: 40px;
  margin-right: 12px;
}
.users {
  gap: 16px;
  // height: 128px;
  // overflow-y: auto;
  &-item {
    width: 156px;
    &-info {
      overflow: hidden;
      .el-input {
        --el-input-height: 24px;
        padding: 0 1px;
        width: min-content;
        min-width: 95px;
      }
      .name {
        color: var(--wl-text-color-title-2);
        max-width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.account-change-dialog {
  &.el-dialog {
    border-radius: 12px;
  }
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
