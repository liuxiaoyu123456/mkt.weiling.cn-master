<!-- 资料推荐 -->
<template>
  <div class="data_group_wrap">
    <ul class="flex-column">
      <li
        v-if="materialGroup.count"
        :class="{ active: !curGroup.id }"
        @click.stop="onHandleClick({})"
      >
        <span>全部</span>
        <span>·{{ materialGroup.count }}</span>
      </li>
      <template v-if="materialGroup.data.length">
        <li
          v-for="item in materialGroup.data"
          :key="item.id"
          @click.stop="onHandleClick(item)"
          class="flex-row flex-wrap main-center"
          :class="{ active: curGroup.id == item.id && item.id }"
        >
          <p>
            {{ item.groupName }}<span>·{{ item.count }}</span>
          </p>
        </li>
      </template>
    </ul>
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
import { useMaterial } from "@/stores";
import { formatCosUrl } from "@/utils/utils";

export default defineComponent({
  props: {
    type: {
      type: String,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const { getters_material_group_by_type } = useMaterial();
    const state = reactive<{
      curGroup: any;
    }>({
      curGroup: {},
    });
    const Methods = {
      formatCosUrl(url: any) {
        return formatCosUrl(url);
      },
      onHandleClick(res: any) {
        // console.log(res, 987);
        state.curGroup = res;
        emit("onHandleGroupChange", res);
      },
    };
    const materialGroup: any = computed(() => {
      return getters_material_group_by_type(props.type);
    });
    return {
      ...toRefs(state),
      ...Methods,
      materialGroup,
    };
  },
});
</script>

<style scoped lang="scss">
.data_group_wrap {
  background: #f6f6f6;
  cursor: pointer;
  li {
    width: 90px;
    box-sizing: border-box;
    padding: 12px 8px;
    border-bottom: 1px solid #e3e3e3;
    color: #989898;
    text-align: center;
    &.active {
      background: #fff;
      color: #0e0e0e;
      border-bottom: 1px solid transparent;
      p,
      span {
        font-weight: 500;
      }
    }
  }
}
</style>
