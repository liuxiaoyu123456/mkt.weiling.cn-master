<script lang="ts" setup>
withDefaults(
  defineProps<{
    options: any;
    info: any;
  }>(),
  {
    options: {},
    info: {},
  }
);
</script>

<template>
  <div class="wecom-judge">
    <div class="title">{{ info.WeComJudgeTitle }}</div>
    <div class="des">{{ info.WeComJudgeDes }}</div>

    <div class="radio-group">
      <el-radio-group v-model="options.wecom">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-radio
              :label="1"
              class="radio-item"
              :class="{ active: options.wecom == 1 }"
              >有企业微信</el-radio
            >
          </el-col>
          <el-col :span="12">
            <el-radio
              :label="2"
              class="radio-item"
              :class="{ active: options.wecom == 2 }"
              >没有企业微信</el-radio
            >
          </el-col>
        </el-row>
      </el-radio-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wecom-judge {
  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 8px;
    color: var(--wl-text-color-title-1);
  }
  .des {
    line-height: 22px;
    color: var(--wl-text-color-secondary-2);
  }
  .el-radio-group {
    width: 100%;
  }
  .el-row {
    width: 100%;
  }
  .radio-group {
    margin-top: 24px;
    .radio-item {
      width: 100%;
      height: 56px;
      margin-right: 0;
      margin-bottom: 12px;
      border: 1px solid var(--wl-line-color);
      display: flex;
      align-items: center;
      border-radius: 5px;
      padding-left: 24px;
      box-sizing: border-box;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        border: 1px solid var(--wl-primary-color);
      }
    }
    .active {
      border: 1px solid var(--wl-primary-color);
    }
  }
}
:deep() {
  .el-radio__input.is-checked + .el-radio__label {
    color: var(--wl-primary-color);
  }
}
</style>
