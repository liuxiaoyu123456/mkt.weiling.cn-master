<template>
  <div>
    <div class="card_title">
      <p class="main_title">欢迎语</p>
      <p class="sub_title">
        客户第一时间收到以下欢迎语和附件，充分利用“黄金五分钟”
      </p>
    </div>
    <div
      class="welcome_wrap"
      :class="isMarketEnv ? 'welcome_wrap_market' : 'welcome_wrap_default'"
    >
      <ul class="welcome_wrap_con" style="padding-left: 0">
        <li class="welcome_wrap_text flex-row">
          <img
            class="def_avatar"
            :src="computedAvatar"
            alt=""
            v-if="!isMarketEnv"
          />
          <!--  -->
          <div class="text_wrap" v-clickOutside="handelClickOutside">
            <div
              :key="state.key"
              class="flex-row"
              :class="isMarketEnv ? '' : 'triangle_l'"
              v-show="state.welcome_html"
              @click.stop
            >
              <div>
                <div
                  :class="[
                    { empty: !state.welcome_text },
                    isMarketEnv ? 'text_inp_market' : 'text_inp_default',
                  ]"
                  ref="contentDom"
                  class="text_inp welcome_text"
                  v-html="state.welcome_html"
                  @input="onContentInputMethod"
                  @click.stop="onContentKeyUpMethod"
                  @focus="state.showInsertText = true"
                  contenteditable="true"
                ></div>
              </div>
              <div class="opt flex-column main-center cross-center">
                <div class="icon-del" @click.stop="onRemoveText">
                  <el-icon class="opt_item" style="color: #ff4545">
                    <wl-svg type="trash" />
                  </el-icon>
                </div>
              </div>
            </div>
            <a
              href="javascript: ;"
              v-show="state.showInsertText"
              class="wildcard flex-row cross-center"
            >
              <li
                class="flex-center"
                @click.stop="onWildCustomerName($event, '客户昵称')"
              >
                <img
                  :src="formatCosUrl('/worktable-erp/code/plus.png')"
                  alt=""
                />
                客户昵称
              </li>
              <li
                class="flex-center"
                @click.stop="onWildCustomerName($event, '员工名称')"
              >
                <img
                  :src="formatCosUrl('/worktable-erp/code/plus.png')"
                  alt=""
                />
                员工名称
              </li>
            </a>
            <div
              v-show="!state.welcome_html"
              class="add_btn_wrap flex-row cross-center"
            >
              <div class="add_btn flex-center" @click.stop="onAddText">
                <el-icon class="opt_item" style="color: #ffffff">
                  <wl-svg type="add" />
                </el-icon>
                添加文本
              </div>
            </div>
          </div>
        </li>
        <template v-if="state.attachments.length">
          <draggable
            :list="state.attachments"
            filter=".forbid"
            animation="300"
            handle=".mover"
            item-key="id"
            @end="onDraggableDed"
          >
            <template #item="{ element, index }">
              <li
                class="welcome_data_item flex-row"
                :class="{ forbid: state.attachments.length == 1 }"
                :key="element.id"
              >
                <img
                  class="def_avatar"
                  :src="computedAvatar"
                  alt=""
                  v-if="!isMarketEnv"
                />
                <div class="file_wrap">
                  <div class="flex-row cross-center">
                    <div
                      v-if="element.link && element.link.url"
                      class="welcome_data_item_info flex-row cross-center"
                    >
                      <div class="data_info flex1 flex-column">
                        <p class="material_name">{{ element.link.title }}</p>
                        <p v-if="element.link.desc" class="dec">
                          {{ element.link.desc }}
                        </p>
                      </div>
                      <img
                        class="welcome_data_item_img flex0"
                        :src="element.link.picurl"
                        alt=""
                      />
                    </div>
                    <div
                      class="welcome_data_item_image"
                      v-if="element.image && element.image.pic_url"
                    >
                      <img :src="element.image.pic_url" alt="" />
                    </div>
                    <div class="opt flex-column main-center cross-center">
                      <div class="icon-del" @click.stop="onDelFile(index)">
                        <el-icon class="opt_item" style="color: #ff4545"
                          ><wl-svg type="trash"
                        /></el-icon>
                      </div>
                      <img
                        v-if="state.attachments.length > 1"
                        class="opt_item mover"
                        :src="formatCosUrl('/worktable-erp/code/opt.png')"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </li>
            </template>
          </draggable>
        </template>
        <!-- :class="{ sss: info.attachment.length }" -->
        <li
          class="welcome_data_item flex-row"
          v-if="state.attachments.length < 9"
        >
          <img
            class="def_avatar"
            :src="computedAvatar"
            alt=""
            v-if="!isMarketEnv"
          />
          <div class="add_btn_wrap flex-row cross-center">
            <div
              class="add_btn flex-center"
              @click.stop="state.showDataCom = true"
            >
              <el-icon class="opt_item" style="color: #ffffff">
                <wl-svg type="add" />
              </el-icon>
              添加附件
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p class="sub_title_msg">点击上方文本框或附件可进行编辑</p>
    <DateRecommend
      v-model:value="state.showDataCom"
      :checked-data="state.attachments"
      @onUploadChange="onUploadChange"
      @onCheckData="onCheckData"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from "vue";
import draggable from "zhyswan-vuedraggable";
import useRichText from "@/hooks/wechat/useRichText";
import DateRecommend from "./dataSelection/DataRecommend.vue";
import { ClickOutside as vClickOutside } from "element-plus";

const props = withDefaults(
  defineProps<{
    welcomeMsgInfo: any;
    currentUser: any;
    isMarketEnv: boolean;
  }>(),
  {
    welcomeMsgInfo: {},
    currentUser: {},
    isMarketEnv: false,
  }
);

const emit = defineEmits<{
  (e: "onWelcomeChange", val: any): void;
}>();
const { initWelcomeText, onContentInput, onContentKeyUp, onInset } =
  useRichText();
const state = reactive<{
  welcome_html: any;
  welcome_text: string;
  contentDom: any;
  showInsertText: boolean;
  showDataCom: boolean;
  attachments: any;
  key: number;
  activeNames: any;
}>({
  welcome_html: "",
  welcome_text: "",
  contentDom: null,
  showInsertText: false,
  attachments: [],
  showDataCom: false,
  key: 1,
  activeNames: ["1"],
});
const emitInfo = computed(() => {
  return {
    text: {
      content: state.welcome_text,
    },
    attachments: state.attachments,
  };
});
const computedAvatar = computed(() => {
  return (
    props.currentUser?.head_img_url ||
    `https://wlmvp-cos.weiling.cn/worktable-h5/icon/default_avatar.png`
  );
});
const onDraggableDed = () => {
  emit("onWelcomeChange", emitInfo.value);
};
const handelClickOutside = () => {
  if (state.showInsertText) {
    state.showInsertText = false;
    emit("onWelcomeChange", emitInfo.value);
    state.key++;
  }
};
const formatCosUrl = (url: string) => {
  return `https://wlmvp-cos.weiling.cn${url}`;
};
const onContentInputMethod = (e: any) => {
  state.welcome_text = onContentInput(e);
};
const onContentKeyUpMethod = () => {
  onContentKeyUp(["客户昵称", "员工名称"]);
  // emit("onWelcomeChange", Computed.emitInfo.value);
};
const onWildCustomerName = (e: any, text: string) => {
  e.preventDefault();
  onInset(text, state.contentDom);
  state.welcome_text = state.contentDom.innerText;
};
// 添加文本
const onAddText = () => {
  state.welcome_text =
    "[客户昵称] 您好，我是[员工名称]。很高兴认识您！您可以先看看下面的资料，如果有任何问题，我都会在第一时间为您解答～";
  state.welcome_html = initWelcomeText(state.welcome_text, [
    "客户昵称",
    "员工名称",
  ]);
};
// 删除附件
const onDelFile = (i: any) => {
  state.attachments.splice(i, 1);
  emit("onWelcomeChange", emitInfo.value);
};
const onUploadChange = (url: any) => {
  state.attachments.push({
    msgtype: "image",
    image: {
      pic_url: url,
    },
  });
  emit("onWelcomeChange", emitInfo.value);
};
const onCheckData = (link: any) => {
  state.attachments.push({ msgtype: "link", link });
  emit("onWelcomeChange", emitInfo.value);
};
const onRemoveText = () => {
  state.welcome_html = "";
  state.welcome_text = "";
  state.showInsertText = false;
  emit("onWelcomeChange", emitInfo.value);
};

watch(
  () => props.welcomeMsgInfo,
  (val) => {
    state.welcome_html = initWelcomeText(val.text?.content, [
      "客户昵称",
      "员工名称",
    ]);
    state.welcome_text = val.text?.content;
    state.attachments = [...(val.attachments || [])];
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.welcome_wrap_default {
  padding: 34px 16px;
}
.welcome_wrap_market {
  padding: 16px;
}

.welcome_wrap {
  box-sizing: border-box;
  width: 400px;
  background: #f4f9fd;
  border-radius: 4px;
  &_con {
    position: relative;
  }
  &:hover .sss {
    display: flex !important;
  }
  &:hover .sss .def_avatar {
    opacity: 0;
  }
  .def_avatar {
    width: 34px;
    height: 34px;
    border-radius: 4px;
    margin-right: 15px;
  }
  .opt {
    display: none;
    margin-left: 12px;
    .opt_item {
      cursor: pointer;
      width: 24px;
      height: 24px;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  &_text {
    .text_inp_default {
      width: 249px;
    }
    .text_inp_market {
      width: 329px;
    }
    .text_inp {
      position: relative;
      word-break: break-all;
      white-space: pre-wrap;
      box-sizing: border-box;
      padding: 8px 10px;
      border-radius: 6px;
      background: #ffffff;
      color: var(--wl-text-color-title-1);
      line-height: 20px;
      &.empty::before {
        position: absolute;
        content: "请输入欢迎语";
        left: 8px;
        top: 8px;
        color: #c1c1c1;
      }
    }
    .market_text_inp {
      position: relative;
      word-break: break-all;
      white-space: pre-wrap;
      box-sizing: border-box;
      padding: 8px 10px;
      width: 329px;
      border-radius: 6px;
      border: 1px solid #e4e9ed;
      background: #ffffff;
      color: var(--wl-text-color-title-1);
      line-height: 20px;
      &.empty::before {
        position: absolute;
        content: "请输入欢迎语";
        left: 8px;
        top: 8px;
        color: #c1c1c1;
      }
    }

    .wildcard {
      user-select: none;
      margin-top: 10px;
      li {
        cursor: pointer;
        width: 84px;
        height: 24px;
        line-height: 24px;
        background: #ffffff;
        border-radius: 100px;
        color: var(--wl-primary-color);
        font-size: 12px;
        margin-right: 8px;
        img {
          width: 12px;
          height: 12px;
          margin-right: 8px;
        }
      }
    }
  }
  .welcome_data_item {
    margin-top: 12px;
    &_info {
      box-sizing: border-box;
      width: 249px;
      background: #ffffff;
      border-radius: 6px;
      padding: 8px;
      cursor: pointer;
    }
    &_image {
      width: 249px;
      img {
        cursor: pointer;
        width: 94px;
        height: 94px;
        border-radius: 8px;
        object-fit: cover;
        vertical-align: middle;
      }
    }
    .data_info {
      color: rgba(0, 0, 0, 0.85);
      .material_name {
        @extend %ov2;
      }
      .dec {
        color: #6d7278;
        font-size: 10px;
        margin-top: 8px;
        @extend %ov1;
      }
    }
    &_img {
      width: 44px;
      height: 44px;
      border-radius: 5px;
      margin-left: 12px;
      object-fit: cover;
    }
  }
  .add_btn_wrap {
    height: 34px;
    .add_btn {
      width: 98px;
      height: 28px;
      background: var(--wl-primary-color);
      border-radius: 100px;
      color: #ffffff;
      cursor: pointer;
      img {
        width: 12px;
        height: 12px;
        margin-right: 6px;
      }
    }
  }
  .welcome_data_item:hover .opt {
    display: flex;
  }
  .welcome_data_item .text_wrap:hover .welcome_data_item_info {
    background: #daefff;
  }
  .welcome_data_item .text_wrap:hover .opt,
  .welcome_wrap_text .text_wrap:hover .opt {
    display: flex;
  }
}
:deep() {
  .welcome_text {
    span.keyword {
      color: var(--wl-primary-color);
    }
  }
}
.welcome_data_item_info:hover {
  background: #daefff;
}
.triangle_l {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 16px solid #fff;
    border-bottom: 10px solid transparent;
    left: -8px;
    top: 8px;
  }
}
.icon-del {
  width: 24px;
  height: 24px;
  background-color: rgba(255, 69, 69, 0.1);
  border-radius: 50%;
  margin-bottom: 10px;
}
.el-icon {
  font-size: 18px;
}
.sub_title_msg {
  margin-top: 6px;
  line-height: 20px;
  color: var(--wl-text-color-secondary-2);
}

.info_card {
  box-sizing: border-box;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
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
</style>
