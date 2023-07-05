<template>
  <div>
    <div class="img-wrap pointer" @click="visible = true">
      <!-- <img :src="transparentBackground" alt="" /> -->
      <el-button v-if="!iconUrl">添加头像</el-button>
      <img v-else :src="iconUrl ? iconUrl : iconDefaultUrl" alt="" />
      <!-- <div class="mask">
        <span>编辑</span>
      </div> -->
    </div>

    <el-drawer
      title="编辑图标"
      v-model="visible"
      direction="rtl"
      :with-header="false"
      :size="492"
      append-to-body
    >
      <EditImgCom
        @onClickConfirm="handleClickConfirm"
        :sizeBox="item?.sizeBox"
        :maxSize="item?.maxSize"
        :smartCollection="item?.smartCollection"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import EditImgCom from "./EditImg.vue";

interface Props {
  formValue?: string;
  item?: any;
}
const props = withDefaults(defineProps<Props>(), {
  formValue: "",
  item: {},
});

const visible = ref(false);
const iconUrl = ref("");
const iconDefaultUrl = ref(
  "https://wlmvp-cos.weiling.cn/worktable-erp/lxx-icon/upload_empty.png"
);

const emit = defineEmits(["update:formValue"]);
const handleClickConfirm = (val: any) => {
  visible.value = false;
  iconUrl.value = val;
  emit("update:formValue", val);
};
watch(
  () => props.formValue,
  (val: any) => {
    iconUrl.value = val;
  },
  {
    immediate: true,
  }
);
</script>
<style scoped>
.img-wrap {
  width: 152px;
  height: 152px;
  position: relative;
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  position: absolute;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.img-wrap .mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: var(--wl-img-wrap-height);
  /* line-height: 44px; */
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  cursor: pointer;
}
/* .img-wrap:hover .mask {
  display: block;
} */
.el-button {
  border: 1px dashed #cccccc;
}
</style>
