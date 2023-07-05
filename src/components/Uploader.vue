<template>
  <div>
    <el-upload
      action=""
      :before-upload="onFileBeforeRead"
      :on-change="onUploadAfterRead"
      :show-file-list="false"
      :auto-upload="false"
      :accept="accept"
      :drag="drag"
    >
      <slot />
    </el-upload>
    <el-dialog
      v-if="showDialog && centerDialogVisible"
      width="267px"
      height="287px"
      class="dialog-upload-file"
      center
      :close-on-click-modal="false"
      v-model="centerDialogVisible"
      :destroy-on-close="true"
      :show-close="false"
      append-to-body
    >
      <div class="dialog-upload">
        <div class="circle">
          <el-progress
            type="circle"
            :percentage="percent"
            :width="72"
            :stroke-width="3"
          >
          </el-progress>
        </div>
        <div class="tips">{{ titleParams[accept] }}</div>
        <el-button type="primary" @click="onCancelUpload">取消上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import useUpload from "@/hooks/useUpload";
import { ElMessage } from "element-plus";
import { useMiniappStore } from "@/stores";
import { ref, watch } from "vue";
const store = useMiniappStore();
interface Props {
  accept?: string;
  userOrCorp?: string;
  showDialog?: boolean;
  drag?: boolean;
  file?: File;
  autoUpload?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  accept: "",
  userOrCorp: "",
  showDialog: true,
  drag: false,
  file: undefined,
  autoUpload: false,
});
const emit = defineEmits(["onUploadAfter", "onUploadError"]);
const { onFileBeforeRead, onFileAfterRead, onCancelRead } = useUpload();
const percent = ref(0);
const centerDialogVisible = ref(false);
const CosInfo = ref("");
const titleParams = ref<any>({
  "image/png,image/gif,image/jpg,image/jpeg,image/bmp": `图片上传中…`,
  "application/pdf": `PDF上传中…`,
  "video/*": `视频上传中…`,
});
// const fileList = ref([])

const onUploadAfterRead = (data: any) => {
  onFileAfterRead(data, getPercentage, getCosInfo)
    .then((res: any) => {
      centerDialogVisible.value = false;
      emit("onUploadAfter", res);
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
        duration: 3000,
      });
      emit("onUploadError", `error`);
    });
};
const getPercentage = (per: any) => {
  centerDialogVisible.value = true;
  percent.value = Math.round(per * 100);
};
const getCosInfo = (cos: any) => {
  CosInfo.value = cos;
};
const onCancelUpload = () => {
  onCancelRead(CosInfo.value).then((res: any) => {
    centerDialogVisible.value = false;
  });
};
watch(
  () => [props.file, props.autoUpload],
  (res: any) => {
    if (props.autoUpload && res[0]) {
      store.setFile(res[0]);
      let files = {
        type: res[0]?.type,
        size: res[0]?.size,
        name: res[0]?.name,
        raw: props.file,
      };
      onUploadAfterRead(files);
    }
  }
);
</script>

<style lang="scss" scoped>
.dialog-upload {
  display: flex;
  align-items: center;
  flex-direction: column;
  // width: 267px;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6.66667px);
  border-radius: 13.3333px;
  justify-content: center;
  .circle {
    height: 80px;
    border-radius: 50%;
    :deep(.el-upload-dragger) {
      width: 450px;
      height: 180px;
      border-radius: 15px;
      margin-left: 58px;
      img {
        margin-top: 34px;
        width: 82px;
        height: 72px;
      }
    }
    :deep(.el-progress__text) {
      color: var(--wl-primary-color);
      font-size: 18px !important;
    }
    :deep(.el-upload-list) {
      margin-left: 58px;
      width: 450px;
    }
  }
  .tips {
    font-size: 16px;
    color: #b7b7b7;
    margin-top: 8px;
  }

  :deep(.el-button) {
    margin-top: 30px;
    width: 110px;
    height: 42px;
    font-weight: 500;
    font-size: 18px;
    background: var(--wl-primary-color);
    border-radius: 8px;
    color: #ffffff;
  }
}
</style>

<style lang="scss">
.dialog-upload-file {
  border-radius: 13px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0px;
    margin: 0px;
    height: 0px;
  }
  .el-dialog__body {
    padding: 0px;
    margin: 0px;
    // width: 227px;
    height: 227px;
  }
}
</style>
