<template>
  <div class="item_wrap" @click.stop="onCheckData" :class="{ disabled }">
    <div class="item_con">
      <div class="item_info flex-row cross-center">
        <div class="view_btn" @click.stop="onPreviewMaterial">预览</div>
        <div class="item_info_img">
          <img :src="formatMaterial.picurl" alt="" />
          <div class="flex-center"><span>已选择</span></div>
        </div>
        <div class="item_info_text flex1">
          <p class="title">{{ formatMaterial.title }}</p>
          <p>{{ formatMaterial.desc }}</p>
        </div>
      </div>
      <div v-if="statis" class="item_view_num flex-row cross-center">
        <img
          class="def_avatar"
          :src="formatCosUrl('/worktable-erp/code/eye_view.png')"
          alt=""
        />
        浏览次数 <span>{{ statis.viewCount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  computed,
} from "vue";
import { formatCosUrl, sizeTostr, splicingMonitorFile } from "@/utils/utils";

export default defineComponent({
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const state = reactive<{}>({});
    const Computed = {
      user: computed(() => {
        return props.data?.user;
      }),
      statis: computed(() => {
        return props.data?.statis;
      }),
      formatMaterial: computed(() => {
        let { material } = props.data;
        return {
          id: material.id,
          title: material.materialName,
          desc:
            material.materialType == 1
              ? material.materialSubtitle
              : sizeTostr(material.materialSize),
          picurl: material.materialLogo,
          url: splicingMonitorFile(
            material.id,
            material.materialScope == 1 ? "user" : "corp"
          ),
        };
      }),
    };
    const Methods = {
      formatCosUrl(url: any) {
        return formatCosUrl(url);
      },
      onCheckData() {
        emit("onCheckData", Computed.formatMaterial.value);
      },
      onPreviewMaterial() {
        emit("onPreviewMaterial", Computed.formatMaterial.value.url);
      },
    };

    return {
      ...toRefs(state),
      ...Methods,
      ...Computed,
    };
  },
});
</script>

<style lang="scss" scoped>
.item_con {
  padding-bottom: 10px;
  border-bottom: 1px solid #eeeeee;
}
.item_wrap {
  padding: 0 0 0 7px;

  .item_info {
    position: relative;
    background: var(--wl-primary-color-lightest);
    border-radius: 8px;
    height: 74px;
    padding: 10px 8px;
    .view_btn {
      cursor: pointer;
      display: none;
      position: absolute;
      width: 53px;
      height: 20px;
      right: 0;
      top: 0;
      background: var(--wl-primary-color);
      backdrop-filter: blur(4px);
      font-size: 12px;
      color: #ffffff;
      text-align: center;
      line-height: 20px;
      border-radius: 0 8px 0 8px;
    }
    &_img {
      width: 54px;
      height: 54px;
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: center;
      }
      div {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        color: #ffffff;
        font-size: 13px;
        background-color: rgba(0, 0, 0, 0.6);
      }
    }
    &_text {
      margin-left: 8px;
      color: var(--wl-text-color-secondary-2);
      p {
        margin-bottom: 2px;
        @extend %ov1;
        &:last-child {
          margin-bottom: 0;
        }
        &.title {
          color: #0e0e0e;
          font-weight: 500;
          font-size: 16px;
        }
      }
    }
  }
  &:hover {
    background: var(--wl-primary-color-light);
    box-shadow: 0px 0px 12px rgba(0, 99, 171, 0.12);
    border-radius: 8px;
    .item_con {
      border-color: transparent;
    }
    .item_info {
      background: inherit;
    }
    .view_btn {
      display: block;
    }
  }
  .item_view_num {
    margin-top: 6px;
    color: var(--wl-text-color-secondary-2);
    font-size: 12px;
    img {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 4px;
    }
    span {
      color: var(--wl-text-color-title-1);
      margin-left: 6px;
    }
  }
  &.disabled {
    background: #ffffff;
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
    .item_info_img div {
      opacity: 1;
    }
    .title {
      color: var(--wl-text-color-secondary-2);
    }
  }
}
</style>
