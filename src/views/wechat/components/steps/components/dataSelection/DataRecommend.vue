<template>
  <div>
    <CWDrawer
      v-model:value="drawer"
      :size="600"
      title="选择附件"
      direction="rtl"
    >
      <div class="choose_data flex-row">
        <div class="btn flex-center" @click.stop="drawerDateBase = true">
          <img
            class="def_avatar"
            :src="formatCosUrl('/worktable-erp/code/upload_file_icon.png')"
            alt=""
          />
          <span>从资料库选择</span>
        </div>

        <el-upload
          action=""
          :on-change="onHandleUploadImg"
          :show-file-list="false"
          :auto-upload="false"
          accept="image/png,image/jpg,image/jpeg"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="只能上传jpg/png文件, 且不超过2M"
            placement="top"
          >
            <div class="btn flex-center">
              <img
                class="def_avatar"
                :src="formatCosUrl('/worktable-erp/code/upload_icon.png')"
                alt=""
              />
              <span>从本地上传图片</span>
            </div>
          </el-tooltip>
        </el-upload>
      </div>
      <DataBase
        v-model:value="drawerDateBase"
        :checked-data="checkedData"
        @onCheckData="onCheckData"
        @onClose="drawerDateBase = false"
      />
    </CWDrawer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
} from "vue";
import CWDrawer from "./CommonDrawer.vue";
import DataBase from "./DataBase.vue";
import { formatCosUrl } from "@/utils/utils";
import { postWXmedia } from "@/api";

export default defineComponent({
  components: { CWDrawer, DataBase },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    checkedData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const state = reactive<{
      drawer: boolean;
      drawerDateBase: boolean;
    }>({
      drawer: false,
      drawerDateBase: false,
    });
    const Methods = {
      formatCosUrl(url: any) {
        return formatCosUrl(url);
      },
      onHandleUploadImg: async (file: any) => {
        const { data } = await postWXmedia({ file: file.raw });
        emit("onUploadChange", data.picUrl);
        emit("update:value", false);
      },
      onCheckData(res: any) {
        state.drawer = false;
        emit("onCheckData", res);
      },
    };
    watch(
      () => props.value,
      (bol) => {
        state.drawer = bol;
      }
    );
    watch(
      () => state.drawer,
      (bol) => {
        if (!bol) emit("update:value", false);
      }
    );
    return {
      ...toRefs(state),
      ...Methods,
    };
  },
});
</script>

<style lang="scss" scoped>
.choose_data {
  padding: 16px 14px;
  .btn {
    cursor: pointer;
    padding: 0 16px;
    height: 34px;
    border: 1px solid var(--wl-primary-color);
    border-radius: 4px;
    color: var(--wl-primary-color);
    margin-right: 10px;
    img {
      width: 20px;
      height: auto;
      margin-right: 4px;
    }
  }
}
</style>
