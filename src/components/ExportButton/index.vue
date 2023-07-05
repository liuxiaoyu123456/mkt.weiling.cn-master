<template>
  <div
    class="export-button"
    :class="`${disabled ? 'disabled' : ''}`"
    :style="isBlue ? stylesBlue : stylesWhite"
    @click="onClick"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <el-icon
      class="icon-download"
      :class="{
        white: isBlue,
        blue: !isBlue && hover,
      }"
    >
      <wl-svg type="download" />
    </el-icon>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
// import { useStore } from 'vuex'

export default defineComponent({
  name: "ExportButton",
  props: {
    border_color: {
      type: String,
      default: "var(--wl-line-color)",
    },
    hover_border_color: {
      type: String,
      default: "var(--wl-primary-color-hover)",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#fff",
    },
    hover_color: {
      type: String,
      default: "#fff",
    },
    background_color_blue: {
      type: String,
      default: "var(--wl-primary-color)",
    },
    background_color_white: {
      type: String,
      default: "#fff",
    },
    hover_background_color: {
      type: String,
      default: "var(--wl-primary-color-hover)",
    },
    isBlue: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: any, { emit }) {
    // const store = useStore()
    // const tryVersion = computed(() => store.getters.getter_try_version)
    const hover = ref(false);
    const stylesBlue = computed(() => {
      return {
        color: hover.value ? props.hover_color : props.color,
        backgroundColor: hover.value
          ? props.hover_background_color
          : props.background_color_blue,
      };
    });
    const stylesWhite = computed(() => {
      return {
        color: hover.value ? props.hover_color : props.color,
        backgroundColor: props.background_color_white,
        borderColor: hover.value
          ? props.hover_border_color
          : props.border_color,
      };
    });
    const onClick = () => {
      if (!props.disabled) emit("onClick");
    };
    return {
      stylesBlue,
      stylesWhite,
      hover,
      onClick,
      // export_black,
      // export_blue,
      // export_white
    };
  },
});
</script>

<style lang="scss" scoped style>
.export-button {
  height: 36px;
  width: 36px;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 14px;
  line-height: 40px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eeeeee;
  &:hover {
    cursor: pointer;
  }
  .icon-download {
    font-size: 18px;
    color: #000;
  }
  .blue {
    color: var(--wl-primary-color-hover) !important;
  }
  .white {
    color: #fff !important;
  }
}
.disabled {
  color: #909399 !important;
  background-color: #f4f4f5 !important;
  border-color: #d3d4d6 !important;
}
</style>
