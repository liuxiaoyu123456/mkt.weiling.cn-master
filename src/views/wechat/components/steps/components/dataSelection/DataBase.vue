<template>
  <div>
    <CWDrawer
      v-model:value="drawer"
      :size="600"
      :append-to-body="true"
      title="资料库"
      direction="rtl"
    >
      <div class="data_wrap flex-column">
        <div class="search">
          <DataSearch @onHandleSearch="onHandleSearch" />
        </div>
        <nav>
          <ul class="data_nav flex-row">
            <li
              v-for="item in navList"
              @click.stop="onNavClick(item)"
              :key="item.id"
              :class="{ active: item.id == form.type }"
            >
              {{ item.label }}
            </li>
          </ul>
        </nav>
        <div class="flex-row flex1 content">
          <div class="group_wrap">
            <DataGroup
              ref="dataGroup"
              :type="form.type"
              @onHandleGroupChange="onHandleGroupChange"
            />
          </div>
          <main
            class="flex1"
            v-infinite-scroll="getMoreFileInfo"
            :infinite-scroll-disabled="fileInfoArr.length >= count"
            :infinite-scroll-delay="300"
            :infinite-scroll-distance="20"
          >
            <ul>
              <li
                v-for="item in fileInfoArr"
                :key="item.material.id"
                class="data_info"
              >
                <DataItem
                  :data="item"
                  :disabled="onCheckedFile(item.material)"
                  @onCheckData="onCheckData"
                  @onPreviewMaterial="onPreviewMaterial"
                />
              </li>
              <div v-if="fileInfoArr.length < count" class="more-file-div">
                <!-- @click="getMoreFileInfo" -->
                <div class="more-file flex flex-center-y">
                  <!-- 更多文件
                  <i class="ri-arrow-drop-down-line more-file-icon"></i> -->
                  加载中...
                </div>
              </div>
              <div v-if="fileInfoArr.length >= count" class="more-file-div">
                <div class="more-file flex flex-center-y">没有更多了</div>
              </div>
            </ul>
          </main>
        </div>
      </div>
      <DataPreview
        v-model:value="previewMaterialUrl"
        @onClose="previewMaterialUrl = ''"
      />
    </CWDrawer>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
} from "vue";
import CWDrawer from "./CommonDrawer.vue";
import { formatCosUrl } from "@/utils/utils";
import DataItem from "./components/DataItem.vue";
import DataPreview from "./components/DataPreview.vue";
import DataSearch from "./components/DataSearch.vue";
import DataGroup from "./components/DataGroup.vue";
import { useMaterial } from "@/stores";

import { userMaterialList, corpMaterialList } from "@/api";

export default defineComponent({
  components: { CWDrawer, DataItem, DataPreview, DataSearch, DataGroup },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    "checked-data": {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: "资料库",
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const store = useMaterial();
    const state = reactive<{
      drawer: boolean;
      form: any;
      navList: any;
      page_count: any;
      count: any;
      fileInfoArr: any;
      previewMaterialUrl: string;
      dataGroup: any;
    }>({
      dataGroup: null,
      drawer: false,
      form: {
        material_type: "",
        keyword: "",
        type: "corp",
        group_id: "",
      },
      navList: [
        {
          label: "个人库",
          id: "user",
          index: 1,
        },
        {
          label: "企业库",
          id: "corp",
          index: 2,
        },
      ],
      page_count: 1,
      count: "",
      fileInfoArr: [],
      previewMaterialUrl: "",
    });
    const Computed = {
      requestInfo: computed(() => {
        let only_person = state.form.type == "user" ? true : false;
        return {
          sort_list: {
            page_count: state.page_count,
            limit: 10,
            sort: [],
            keyword: state.form.keyword,
          },
          group_id: state.form.group_id,
          material_type: state.form.material_type
            ? [state.form.material_type]
            : [],
          only_person: only_person,
        };
      }),
      requestGroupInfo: computed(() => {
        let only_person = state.form.type == "user" ? true : false;
        return {
          keyword: state.form.keyword,
          material_type: state.form.material_type
            ? [state.form.material_type]
            : [],
          only_person: only_person,
          ctxenv: 2,
        };
      }),
    };
    const getUserOrCorpFileInfo = () => {
      let api = state.form.type == "user" ? userMaterialList : corpMaterialList;
      api(Computed.requestInfo.value)
        .then((response: any) => {
          if (state.page_count == 1) state.fileInfoArr = [];
          state.page_count = state.page_count + 1;
          state.count = response.data.count;
          state.fileInfoArr = [
            ...(state.fileInfoArr || []),
            ...(response.data.materials || []),
          ];
        })
        .catch(function (error: any) {
          // 请求失败处理
          console.log(error);
        });
    };

    const Methods = {
      onCheckedFile(item: any): any {
        return Boolean(
          props.checkedData.find(
            (res: any) =>
              res?.link?.title == item?.materialName &&
              res?.link?.picurl == item?.materialLogo
          )
        );
      },
      onCheckData(res: any) {
        emit("onCheckData", res);
        state.drawer = false;
      },
      onNavClick(res: any) {
        state.dataGroup.curGroup = {};
        state.form.group_id = "";
        state.page_count = 1;
        state.form.type = res.id;
        getUserOrCorpFileInfo();
        store.onGetMaterialGroupList(Computed.requestGroupInfo.value);
      },
      getMoreFileInfo() {
        getUserOrCorpFileInfo();
      },
      getTypeChange() {
        state.page_count = 1;
        getUserOrCorpFileInfo();
      },
      onPreviewMaterial(url: any) {
        state.previewMaterialUrl = `${url}&need_auth=false`;
      },
      onHandleSearch(res: any) {
        state.dataGroup.curGroup = {};
        state.form.group_id = "";
        state.form.keyword = res.keyword;
        state.form.material_type = res.materialType;
        state.page_count = 1;
        getUserOrCorpFileInfo();
        store.onGetMaterialGroupList(Computed.requestGroupInfo.value);
      },
      onHandleGroupChange(res: any) {
        state.page_count = 1;
        state.form.group_id = res.id;
        getUserOrCorpFileInfo();
      },
    };
    getUserOrCorpFileInfo();
    watch(
      () => props.value,
      (bol) => {
        state.drawer = bol;
      }
    );
    watch(
      () => state.drawer,
      (bol) => {
        if (!bol) emit("onClose");
      }
    );
    store.onGetMaterialGroupList(Computed.requestGroupInfo.value);
    return {
      ...toRefs(state),
      ...Methods,
      ...Computed,
      formatCosUrl,
    };
  },
});
</script>

<style lang="scss" scoped>
.data_wrap {
  height: 100%;
  padding-top: 24px;
  .view_wrap {
    position: fixed;
    width: 374px;
    height: 80%;
    border-radius: 12px;
    right: 510px;
    top: 50%;
    transform: translateY(-50%);
    background: #ffffff;
    z-index: 80000;
    .del_view {
      cursor: pointer;
      position: absolute;
      box-sizing: border-box;
      right: 0;
      top: -38px;
      width: 68px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid #ffffff;
      border-radius: 100px;
      color: #ffffff;
      font-weight: 500;
    }
  }
}
.search {
  padding: 0 24px;
}
nav {
  padding: 0 24px;
  height: 34px;
  margin-top: 24px;

  border-bottom: 1px solid #eeeeee;
}
.group_wrap {
  height: 100%;
  width: 90px;
  overflow: auto;
  background: #f6f6f6;
}

main {
  overflow: auto;
  padding: 0 14px 0 18px;
}
.data_nav {
  padding: 0 12px;
  height: 100%;
  li {
    position: relative;
    font-size: 18px;
    color: #494b4d;
    cursor: pointer;
    margin-right: 44px;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      font-weight: 500;
      color: var(--wl-text-color-title-1);
      transition: 0.3s;
      &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 3px;
        background: var(--wl-primary-color);
      }
    }
  }
}
.data_info {
  padding: 16px 0 0;
}
.more-file-div {
  height: 48px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
  align-items: center;
  .more-file {
    cursor: pointer;
    color: #979797;
  }
  .more-file-icon {
    font-size: 24px;
  }
}
</style>
