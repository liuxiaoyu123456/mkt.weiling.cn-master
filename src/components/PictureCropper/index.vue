<template>
  <main>
    <input
      type="file"
      ref="uploadInput"
      accept="image/png,image/gif,image/jpg,image/jpeg"
      v-show="false"
      @change="handleUploadSuccess"
    />

    <!-- 触发区域 -->
    <div
      v-if="!upLoadIconVisible"
      :style="{ width: boxStyleCom.width }"
      @dragleave="preventDefault"
      @dragover="preventDefault"
      @dragenter="preventDefault"
      @drop="handleUploadSuccess"
      @click.stop="handleUpload"
      ref="uploadPreViewDom"
    >
      <slot name="trigger">
        <div class="add-resource">
          <img
            :src="formatCosUrl('/worktable-erp/lxx-icon/upload_empty.png')"
            alt=""
          />
          <el-button type="primary" class="upload_button">点击上传</el-button>
          <div class="tips">或将图片拖拽至该区域内上传</div>
        </div>
      </slot>
    </div>

    <!-- 裁剪框 -->
    <div v-else>
      <VuePictureCropper
        :boxStyle="boxStyleCom"
        :img="pic"
        :options="optionsCom"
      />
      <div class="footer" :style="{ width: boxStyleCom.width }">
        <el-button v-if="isClear" @click="handleClear">清除</el-button>
        <el-button v-if="isReset" @click="handleReset">重置</el-button>
        <el-button @click="handleUpload">重新上传</el-button>
        <el-button type="primary" @click="getResult">确认</el-button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import VuePictureCropper, { cropper } from "vue-picture-cropper";
import { checkCompletePicture, formatCosUrl } from "@/utils/utils";
import { ElMessage } from "element-plus";

const emit = defineEmits(["save"]);

interface Props {
  options?: any;
  boxStyle?: any;
  maxSize?: number;
  isClear?: boolean;
  isReset?: boolean;
  sizeBox?: number;
}
const props = withDefaults(defineProps<Props>(), {
  /* options参数：https://github.com/fengyuanchen/cropperjs#options */
  options: () => {
    return {};
  },
  /* 展示盒子样式 */
  boxStyle: () => {
    return {};
  },
  /* 最大的size 默认是50兆 */
  maxSize: 50,
  /* 是否展示清除按钮 */
  isClear: false,
  /* 是否展示重置按钮 */
  isReset: false,
  /* 调整裁剪的比例 */
  sizeBox: 0,
});

/* VuePictureCropper参数 */
const optionsCom = computed(() => {
  const optionsObj = {
    /* 裁切框的活动范围 0：无限制  1：不超过画布大小 3, 4 */
    viewMode: 0,
    /* 裁剪器拖动模式 crop：创建新的裁剪框 move：移动画布 none：不执行任何操作 */
    dragMode: "crop",
    /* initialAspectRatio: 1 / 1,  初始裁剪比例 */
    /* 固定初始裁剪比例 */
    aspectRatio: props.sizeBox,
    /* 初始选中区域 0~1  1撑满 */
    autoCropArea: 1,
    /* 剩余空间是否黑色模式 */
    modal: true,
  };
  // aspectRatio 和 initialAspectRatio 同时存在时，initialAspectRatio失效
  if (props.options.initialAspectRatio && optionsObj.aspectRatio) {
    delete optionsObj.aspectRatio;
  }
  return Object.assign(optionsObj, props.options);
});
const boxStyleCom = computed(() => {
  const boxStyleObj = {
    width: "444px",
    height: "400px",
    backgroundColor: "#f8f8f8",
    margin: "auto",
  };
  return Object.assign(boxStyleObj, props.boxStyle);
});

/* 上传 */
const uploadInput = ref(null);
const pic = ref<string>("");
const upLoadIconVisible = ref<boolean>(false);
const handleUpload = () => {
  uploadInput.value.value = ""; // 清除，避免同一张图片无法触发上传
  uploadInput.value.click();
};
const preventDefault = (e: any) => {
  e.preventDefault();
  return false;
};
const handleUploadSuccess = async (e: any) => {
  e.preventDefault();
  pic.value = ""; // 重置掉裁剪目标的值，避免使用同一张图片无法触发watch
  let files = e.target.files || e.dataTransfer.files;
  if (!files) return;
  const file: File = files[0];
  if (!fileCheck(file)) return;

  // 检测图片是否破损
  const isCompletePicture = await checkCompletePicture(file);
  if (!isCompletePicture) {
    toastErrorMsg(`该图片已破损`);
    return false;
  }

  // 转换为base64传给裁切组件
  const reader: FileReader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (): void => {
    pic.value = String(reader.result);
    upLoadIconVisible.value = true;
    if (!uploadInput.value) return;
    uploadInput.value.value = ""; // 清空已选择的文件,避免下次上传同一张图片无法触发input的change事件
  };
};

/* 文件校验 */
const fileCheck = (file: File) => {
  const flieArr = file.name.split(".");
  const fileType = ["png", "jpg", "jpeg", "bmp"];
  const result = fileType.find((item) => item === flieArr[flieArr.length - 1]);
  if (!result) {
    toastErrorMsg(`该图片格式系统不支持`);
    return false;
  }
  if (file.size > props.maxSize * 1024 * 1000) {
    toastErrorMsg(`上传的文件不能超过${props.maxSize}M`);
    return false;
  }
  return true;
};

const toastErrorMsg = (msg: string) => {
  ElMessage({
    message: msg,
    type: "error",
    duration: 3000,
  });
};

/* 获取裁剪文件 */
const getResult = async (): Promise<void> => {
  // 获取生成的file文件信息
  const file = await cropper.getFile({
    imageSmoothingQuality: "high", // 导出像素为高
    fillColor: "transparent", // 将生成的背景改为透明
  });
  emit("save", file);
};

/* 清除裁切框 */
const handleClear = (): void => {
  cropper.clear();
};

/* 重置默认的裁切区域 */
const handleReset = (): void => {
  cropper.reset();
};
</script>

<style lang="scss" scoped>
.add-resource {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 444px;
  height: 400px;
  background: var(--wl-btn-dashed-bg);
  border: 1px dashed var(--wl-primary-color);
  border-radius: 10px;
  img {
    width: 110px;
    height: 85px;
    border-radius: 8px;
    object-fit: cover;
  }
  .upload_button {
    margin-top: 50px;
    width: 160px !important;
    height: 54px;
    font-size: 20px;
  }
  .tips {
    font-weight: 500;
    font-size: 18px;
    line-height: 25px;
    color: #41505b;
    margin-top: 62px;
  }
}
.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  :deep(.el-button) {
    margin: 12px 12px 0 0;
  }
}
</style>
