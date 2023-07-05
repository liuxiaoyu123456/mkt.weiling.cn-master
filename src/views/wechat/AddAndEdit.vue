<script lang="ts" setup>
import { ref } from "vue";
import AddChatConfig from "./components/steps/AddChatConfig.vue";
import StepControl from "./components/steps/StepControl.vue";
import SmartCodeConfig from "./components/steps/SmartCodeConfig.vue";
import BaseConfig from "./components/steps/BaseConfig.vue";
import FinalPage from "./components/steps/FinalPage.vue";
import mobilFrame from "./components/mobilFrame/Index.vue";
import MiniApp from "./components/mobilFrame/pages/MiniApp.vue";
// import BasicInfo from "./components/mobilFrame/pages/BasicInfo.vue"
import ChatInterface from "./components/mobilFrame/pages/ChatInterface.vue";
import { useRoute } from "vue-router";
// import { useUserStore } from "@/stores";

import useWechatEdit from "@/hooks/wechat/useWechatEdit";

const route = useRoute();
// const store: any = useUserStore();
const loaded = ref(route.query?.type == "add" ? true : false);
const pageIndex = ref(0);
const progressList = ref([
  { text: "加微页面" },
  { text: "二维码" },
  { text: "基础信息" },
]);

const pageList = ref([
  { page: MiniApp },
  { page: MiniApp, isOverlayShow: true },
  { page: ChatInterface },
]);

const { step, form, addWechat, queryDetail, editWechat, loading } = useWechatEdit();

const addChatConfigRef: any = ref(null);
const smartCodeConfigRef: any = ref(null);
const baseConfigRef: any = ref(null);
// 计算属性
const stepChange = (num: number) => {
  if (num > 0) {
    if (step.value === 0) {
      addChatConfigRef.value
        .vertify()
        .then((valid: boolean) => {
          // 调用验证函数进行验证,如果验证通过则进入下一步
          if (valid) {
            pageIndex.value++;
            step.value++;
          }
        })
        .catch();
    } else if (step.value === 1) {
      smartCodeConfigRef.value.vertify().then((valid: boolean) => {
        if (valid) {
          step.value++;
        }
      });
    } else if (step.value === 2) {
      // step.value ++
      baseConfigRef.value.vertify().then((valid: boolean) => {
        if (valid) {
          if (route.query.type === "edit") {
            editWechat(route.query.id);
          } else {
            addWechat();
          }
        }
      });
    }
  } else {
    if (step.value === 1) {
      pageIndex.value = 0;
    } else if (step.value === 2) {
      pageIndex.value = 1;
    }
    step.value--;
  }
};

const configChange = (i: number) => {
  pageIndex.value = i;
};
const init = () => {
  let p: any = route.query;
  if (p.type === "edit") {
    queryDetail(p.id).then(() => {
      loaded.value = true;
    });
  }
  // else{
  //     form.value.channel.user_list = [
  //         {
  //             id:store.userInfo.id,
  //             headImgUrl:store.userInfo.headImgUrl,
  //             nickName:store.userInfo.nickName
  //         }
  //     ]
  // }
};
init();
</script>

<template>
  <div class="add-edit">
    <!-- 导航栏 -->
    <Navbar text="方案列表" path="/wechat" />
    <div class="add-edit-container">
      <div class="left-wrap card">
        <div class="process-box">
          <!-- 当配置过程中显示配置的步骤界面 -->
          <ProgressBar :list="progressList" :step="step" v-if="step < 3" />
          <!-- 如果配置的流程都走完了则显示配置完成 -->
          <div class="config-ok" v-else>
            <el-icon class="logo">
              <wl-svg type="successFill" />
            </el-icon>
            <span>配置完成</span>
          </div>
        </div>
        <div class="steps-wrap">
          <!-- 当step=0时会显示AddChatConfig组件 -->
          <AddChatConfig
            v-if="step === 0 && loaded"
            v-model:form="form.channel"
            ref="addChatConfigRef"
          />
          <!-- 当step=1时会显示SmartCodeConfig组件 -->
          <SmartCodeConfig
            v-else-if="step === 1 && loaded"
            v-model:form="form.channel"
            @change="configChange"
            ref="smartCodeConfigRef"
          />
          <!-- step=2显示组件 -->
          <BaseConfig
            v-else-if="step === 2 && loaded"
            v-model:form="form.button"
            ref="baseConfigRef"
          />
          <!-- step=3显示组件 -->
          <FinalPage v-else-if="step === 3 && loaded" :form="form" />
        </div>
        <div class="bottom-wrap">
          <!-- 控制下一步上一步的组件 -->
          <StepControl :step="step" @step-change="stepChange" :loading="loading"/>
        </div>
      </div>
      <div class="right-wrap card">
        <div class="view-title">预览</div>
        <!-- 预览右侧的手机预览页面 -->
        <mobilFrame
          :type="step > 1 ? 'view' : 'edit'"
          :page-list="pageList"
          :form="form"
          v-model:pageIndex="pageIndex"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope>
.add-edit {
  &-container {
    padding-top: 12px;
    display: flex;
    height: 788px;
    min-height: calc(100vh - 152px);
    .left-wrap {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .process-box {
        padding: 4px 80px 24px;
        display: flex;
        justify-content: center;
        .config-ok {
          display: flex;
          align-items: center;
          color: var(--wl-primary-color);
          font-size: 16px;
          font-weight: 600;
          .logo {
            font-size: 24px;
            margin-right: 6px;
          }
        }
      }
      .steps-wrap {
        flex: 1;
      }
    }
    .right-wrap {
      width: 460px;
      margin-left: 10px;
      height: 100%;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      .view-title {
        font-size: 18px;
        color: var(--wl-text-color-title-1);
      }
    }
  }
}
</style>
