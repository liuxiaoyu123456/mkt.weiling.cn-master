<template>
  <div class="min-app" v-loading="loading">
    <div class="callback flex-row cross-center">
      <span class="flex-row cross-center pointer" @click="callback"
        ><el-icon><wl-svg type="arrowTipLeft" /></el-icon>退出</span
      >
    </div>
    <div class="top-xiaowei flex-row flex-center">
      <img
        src="https://wlmvp-cos.weiling.cn/worktable-erp/bigPic/home_xiaowei.png?v=000"
        alt=""
      />
      <div style="width: 754px">
        <div class="xiaowei-msg">
          <p>{{ progressTilteList[step].text }}</p>
          <p v-bind:innerHTML="progressTilteListMsg[step].text"></p>
        </div>
      </div>
    </div>
    <div class="bottom-config">
      <div class="config-add flex-col">
        <div class="top-step">
          <ProgressBar
            v-show="step < 4"
            :step="step"
            :list="progressTilteList"
          />
        </div>
        <div class="config-step">
          <!-- 每一步的显示 -->
          <!-- 公众号信息 -->
          <OfficialAccountInformation
            v-show="step == 0"
            v-model:toAuthorization="toAuthorization"
          />
          <!-- 公众号授权 -->
          <OfficialAccountAuthorization v-show="step == 1" />
          <!-- 小程序授权 -->
          <AppletAuthorization v-show="step == 2" />
          <!-- 小程序信息 -->
          <AppletInformation v-show="step == 3" v-model:mediaId="mediaId" />
        </div>
      </div>
      <!-- 按钮显示上一步和下一步 -->
      <div class="button-list flex-row">
        <el-button v-if="step != 0" @click="backStep">
          <span class="flex-center">上一步</span>
        </el-button>
        <!-- 如果以上三步都走完了那么显示完成 -->
        <el-button type="primary" @click="nextStep()">
          <span class="flex-center">{{ step == 3 ? "完成" : "下一步" }}</span>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import OfficialAccountInformation from "./components/OfficialAccountInformation.vue";
import OfficialAccountAuthorization from "./components/OfficialAccountAuthorization.vue";
import AppletInformation from "./components/AppletInformation.vue";
import AppletAuthorization from "./components/AppletAuthorization.vue";
import { useMiniappStore } from "@/stores";
import { jktCheckAuth, completeInformation, jktPushAudit } from "@/api";
import { ElMessage } from "element-plus";

const store = useMiniappStore();
const router = useRouter();
const route = useRoute();
const callback = () => {
  store.$reset();
  router.push({
    name: "MiniAppDefault",
  });
};

const step = ref(0);
const progressTilteList = ref([
  { text: "公众号信息" },
  { text: "公众号授权" },
  { text: "小程序授权" },
  { text: "小程序信息" },
]); // 进度条上的title
const progressTilteListMsg = ref([
  {
    text: "1.小程序在创建之前需要绑定关联公众号，请选择一个企业认证主体的公众号，并将公众号开发者ID填入下方输入框<br />2.公众号名称会根据填入的开发者ID自动判断，确认无误之后点击“下一步”即可",
  },
  {
    text: "点击下方“去授权”打开授权界面，并使用公众号管理员的个人微信扫码授权，授权完成后返回本页面，并点击“下一步”",
  },
  {
    text: "点击下方“去授权”打开授权界面，并使用小程序管理员的个人微信扫码授权，授权完成后返回本页面，并点击“下一步”",
  },
  { text: "按照下方提示填写小程序信息" },
]);
const backStep = () => {
  step.value--;
};

const toAuthorization = ref(false); // 授权请求
const mediaId = ref("");

const loading = ref(false);
// 获取mediaId
const getmediaId = () => {
  if (store.getters_file) {
    let formDate = new FormData();
    formDate.append("component_app_id", import.meta.env.VITE_APP_PLATFORM_ID);
    formDate.append("authorized_app_id", store.getters_miniapp_id);
    formDate.append("file", store.getters_file);
    fetch(`${import.meta.env.VITE_APP_API}/wxopen_component/upload_media`, {
      method: "POST",
      body: formDate,
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return Promise.reject(res.json());
        }
      })
      .then((data) => {
        if (data.code == 200) {
          if (data.data.media_id) {
            improveInformation(data.data.media_id);
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    ElMessage({
      type: "error",
      message: "头像未上传",
    });
  }
};
// 完善小程序信息
const improveInformation = (mId?: string) => {
  loading.value = true;
  completeInformation({
    componentAppId: import.meta.env.VITE_APP_PLATFORM_ID,
    authorizedAppId: store.getters_miniapp_id, // 小程序id
    type: [1, 2, 3, 4, 5, 6, 7],
    miniAppDto: {
      signature: "小工具结合",
      categories: [
        {
          first: 287,
          second: 298,
        },
      ],
      nickName: {
        nickName: store.getters_miniapp_name,
        license: "",
      },
      wechatId: "",
      headImg: {
        img: mId,
      },
      privacySetting: {
        ownerSetting: {
          contactEmail: "longchengyang@weiling.cn",
          noticeMethod: "小程序弹窗",
          storeExpireTimestamp: "",
        },
        settingList: [
          {
            privacyText: "保存联系人",
            privacyKey: "Location",
          },
        ],
        privacyVer: 2,
      },
      auditMessage: {
        itemList: [
          {
            firstClass: "工具",
            secondClass: "办公",
            firstId: 287,
            secondId: 298,
          },
        ],
        previewInfo: {
          picIdList: [],
        },
        versionDesc: "",
        feedbackInfo: "",
        feedbackStuff: "",
      },
      domain: {
        action: "set",
        requestDomains: [import.meta.env.VITE_APP_DOMAIN],
        uploadDomains: [import.meta.env.VITE_APP_DOMAIN],
        downloadDomains: [import.meta.env.VITE_APP_DOMAIN],
        tcpdomain: [""],
        udpdomain: [""],
        wsrequestdomain: [""],
      },
      webViewDomain: {
        action: "set",
        domainList: [import.meta.env.VITE_APP_DOMAIN],
      },
    },
  }).then((res: any) => {
    loading.value = false;
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: "配置完成",
      });
      router.push({ name: "MiniAppDefault" });
      store.setDialog(true);
      step.value = 0;
    } else {
      ElMessage({
        type: "error",
        message: "小程序名称有误",
        duration: 6000,
      });
    }
    jktPushAudit({
      appId: store.getters_miniapp_id,
      componentAppId: import.meta.env.VITE_APP_PLATFORM_ID,
    });
  });
};
const nextStep = async () => {
  if (step.value == 3) {
    if (!store.getters_miniapp_name) {
      return ElMessage({
        type: "error",
        message: "请填写小程序名称",
      });
    } else {
      getmediaId();
    }
  }
  if (step.value < 3) {
    if (!store.getters_authorized_id) {
      return ElMessage({
        type: "error",
        message: "请填写公众号ID",
      });
    }
    if (!store.getters_authorized_name) {
      return ElMessage({
        type: "error",
        message: "请填写公众号名称",
      });
    }
    if (step.value == 1) {
      store.setMiniappKeey("querying", "official");
      // 验证公众号是否授权成功
      let data: any = await jktCheckAuth({
        appId: store.getters_authorized_id,
      });
      if (data.data) {
        store.setMiniappKeey("success", "official");
      } else {
        store.setMiniappKeey("warnning", "official");
        return;
      }
    }
    if (step.value == 2 && !store.getters_miniapp_id) return;
    step.value++;
    // step.value == 0 ? step.value++ :
    // 	setTimeout(()=>{
    // 		step.value++
    // 	}, 1000)
  }
};
watch(
  () => route.path,
  () => {
    if (route.path == "/add") {
      store.$reset();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style scoped>
.min-app .callback {
  padding: 13px 27px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 11px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.min-app .callback .el-icon {
  font-size: 24px;
}
.min-app .callback span:hover {
  color: var(--wl-primary-color);
}

.min-app .top-xiaowei {
  width: 100%;
  height: 200px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
}

.min-app .top-xiaowei img {
  width: 157px;
  height: 144px;
  margin-top: 60px;
}

.min-app .top-xiaowei .xiaowei-msg {
  /* height: 120px; */
  width: 90%;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--wl-body-color);
  margin: 30px 0 0 50px;
}

.min-app .top-xiaowei .xiaowei-msg p:first-child {
  line-height: 30px;
}

.min-app .top-xiaowei .xiaowei-msg p {
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  margin-top: 2px;
  color: var(--wl-text-color-title-2);
}

.min-app .bottom-config {
  min-height: calc(100vh - 386px);
  background-color: #fff;
  border-radius: 12px;
  box-sizing: border-box;
  margin-top: 16px;
  overflow: hidden;
  position: relative;
}

.min-app .bottom-config .button-list {
  position: absolute;
  left: 24px;
  bottom: 24px;
}

.min-app .bottom-config .button-list .el-button {
  width: 96px;
  height: 40px;
}
.config-add {
  height: 100%;
}
.config-add .top-step {
  padding: 20px 30px;
}
.config-add .config-step {
  padding: 0 30px 30px;
}
</style>
