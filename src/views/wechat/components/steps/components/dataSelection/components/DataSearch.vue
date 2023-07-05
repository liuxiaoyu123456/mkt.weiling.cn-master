<!-- 资料推荐 -->
<template>
  <!-- <div class="data_search">
    <el-input
      placeholder="请输入内容"
      v-model="keyword"
      class="input-with-select"
      @input="onHandelSearch"
    >
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
      <el-select
        v-model="materialType"
        slot="prepend"
        placeholder="请选择"
        @change="getTypeChange"
      >
        <el-option label="全部" value=""></el-option>
        <el-option label="链接" value="1"></el-option>
        <el-option label="文件" value="2"></el-option>
      </el-select>
    </el-input>
  </div> -->
  <div class="data_search">
    <el-input
      placeholder="请输入内容"
      v-model="keyword"
      clearable
      class="input-with-select"
      @input="onHandelSearch"
    >
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
      <template #prepend>
        <el-select
          v-model="materialType"
          placeholder="请选择"
          @change="getTypeChange"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="链接" value="1"></el-option>
          <el-option label="文件" value="2"></el-option>
        </el-select>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, type SetupContext, toRefs } from "vue";
import { formatCosUrl } from "@/utils/utils";
import { debounce } from "lodash-es";
import { Search } from "@element-plus/icons-vue";

export default defineComponent({
  components: { Search },
  setup(props: any, { emit }: SetupContext) {
    const state = reactive<{
      keyword: string;
      materialType: any;
    }>({
      keyword: "",
      materialType: "",
    });
    const Methods = {
      formatCosUrl(url: any) {
        return formatCosUrl(url);
      },
      onclose() {
        emit("onClose");
      },
      getTypeChange() {
        emit("onHandleSearch", {
          keyword: state.keyword,
          materialType: state.materialType,
        });
      },
      onHandelSearch: debounce((res: any) => {
        emit("onHandleSearch", {
          keyword: state.keyword,
          materialType: state.materialType,
        });
      }, 300),
    };
    return {
      ...toRefs(state),
      ...Methods,
    };
  },
});
</script>

<style scoped lang="scss">
// ::v-deep {
//   .el-select .el-input {
//     width: 96px;
//     color: #494b4d;
//   }
//   .el-select .el-input .el-select__caret {
//     color: #616466;
//   }
//   .el-icon-arrow-up:before {
//     content: "\e78f";
//   }
//   .input-with-select {
//     .el-input-group__prepend {
//       background-color: #fff;
//     }
//     .el-input__inner {
//       border-radius: 0 6px 6px 0 !important;
//     }
//   }
// }
:deep() {
  .el-input {
    color: #494b4d;
  }
  .el-input__wrapper {
    width: 96px;
  }
  .el-input .el-select__caret {
    color: #616466;
  }
  .el-icon-arrow-up:before {
    content: "\e78f";
  }
  .input-with-select {
    .el-input-group__prepend {
      background-color: #fff;
    }
    .el-input__inner {
      border-radius: 0 6px 6px 0 !important;
    }
  }
}
</style>
