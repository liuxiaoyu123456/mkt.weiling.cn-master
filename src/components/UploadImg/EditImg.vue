<template>
  <div class="container">
    <div class="flex-col container-wrap">
      <div class="flex-row cross-center title">
        <div />
        <span>编辑</span>
      </div>
      <div class="flex-col content">
        <div class="tabs-shell">
          <el-tabs v-model="activeName">
            <el-tab-pane label="上传图标" name="uploadIcon"></el-tab-pane>
          </el-tabs>
        </div>

        <!-- 上传图标 -->
        <div v-show="activeName == 'uploadIcon'">
          <div
            class="flex-row main-start clip-wrap"
            :class="{ round: preViewRound }"
          >
            <!-- 上传裁剪组件 -->
            <PictureCropper
              @save="getFileInfo"
              :sizeBox="sizeBox"
              :maxSize="maxSize"
            />
            <!-- 上传进度条 -->
            <Uploader
              v-show="false"
              @onUploadAfter="initFileInfo"
              @onUploadError="onUploadError"
              :file="file"
              :accept="accept"
              :autoUpload="autoUpload"
              ref="uploader"
            />
          </div>
          <span v-if="smartCollection" class="prompt"
            >* 支持300 kb以内的图片大小，png jpg jpeg格式图片</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Uploader from "../Uploader.vue";
import PictureCropper from "@/components/PictureCropper/index.vue";
interface Props {
  preViewRound?: boolean; // 圆的
  sizeBox?: number; // 裁剪盒子的比例
  maxSize?: number; // 最大尺寸
  smartCollection?: boolean; // 图片限制提示
}
const props = withDefaults(defineProps<Props>(), {
  preViewRound: false,
  sizeBox: 0,
  maxSize: 2,
  smartCollection: false,
});
const activeName = ref("uploadIcon");
const file = ref(undefined);
// const uploadImgInfo = ref({})
const accept = ref(`image/png,image/gif,image/jpg,image/jpeg,image/bmp`);
const autoUpload = ref(false);
const uploader = ref(null);
const sizeBox = ref(props.sizeBox);

const emit = defineEmits(["onClickConfirm"]);
const getFileInfo = (f: any) => {
  file.value = f;
  handleClickConfirm();
};
/**
 * 确认照片事件，回传当前选中的照片
 */
const handleClickConfirm = () => {
  autoUpload.value = true; //开启上传事件
};
/**上传事件的回调函数 */
const initFileInfo = (val: any) => {
  autoUpload.value = false;
  // uploadImgInfo.value = val;
  emit("onClickConfirm", val?.cos_url);
};
const onUploadError = () => {
  autoUpload.value = false;
};
</script>

<style lang="scss" scoped>
.title {
  margin-top: 20px;
  margin-left: 12px;
  div {
    width: 3px;
    height: 22px;
    background: var(--wl-primary-color);
    border-radius: 4px;
  }
  span {
    font-size: 20px;
    font-weight: 600;
    margin-left: 5px;
  }
}
.content {
  margin-left: 6px;
  margin-top: 20px;
}
.preview-shell {
  margin-left: 40px;
  span {
    text-align: center;
    color: #c8c8c8;
  }
}
.preview {
  width: 88px;
  height: 88px;
}
.tabs-shell {
  width: 80%;
}
.img-item {
  position: relative;
  margin-right: 20px;
  margin-bottom: 20px;
}
.avatar {
  width: 88px;
  height: 88px;
  // border-radius: 50%;
}
.checkbox {
  position: absolute;
  z-index: 10;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  background: var(--wl-primary-color);
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #eeeeee;
  img {
    width: 10px;
    height: 7px;
    flex-shrink: 0;
    object-fit: cover;
  }
}
.title-second {
  color: #c8c8c8;
}
.bottom-gap {
  margin-bottom: 20px;
}

:deep(.container-wrap) {
  .clip-wrap {
    margin-top: 20px;
  }
  .clip-wrap.round {
    .preview,
    .container {
      border-radius: 50%;
    }
  }
  .el-button {
    width: 100px;
    border-radius: 8px;
  }
  .el-button--default {
    margin-right: 8px;
    border: 1px solid #d8d8d8;
  }
}
.prompt {
  font-size: 12px;
  line-height: 20px;
  font-weight: 400;
  color: var(--wl-text-color-placeholder);
}
</style>
