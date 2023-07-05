<template>
  <div class="card">
    <el-form :model="form" label-width="120px" style="width: 640px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" className2="123" />
      </el-form-item>
      <el-form-item label="时区">
        <el-select v-model="form.region" placeholder="请选择时区">
          <el-option label="上海" value="shanghai" />
          <el-option label="北京" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date1"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            :prefix-icon="dateIcon"
          />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker
            v-model="form.date2"
            placeholder="选择时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="开关">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="活动类型">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="线上活动" name="type" />
          <el-checkbox label="促销活动" name="type" />
          <el-checkbox label="线下活动" name="type" />
          <el-checkbox label="品牌曝光" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="赞助" />
          <el-radio label="场地" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动内容">
        <el-input v-model="form.desc" type="textarea" rows="3" />
      </el-form-item>
      <el-form-item>
        <el-button @click="$message('保存中')">Message</el-button>
        <el-button type="primary" @click="$message('保存中')">保存</el-button>
        <el-button
          type="success"
          @click="
            $message({ type: 'success', message: '保存中', showClose: false })
          "
          >保存</el-button
        >
        <el-button
          type="danger"
          @click="$message({ type: 'error', message: '保存中' })"
          >保存</el-button
        >
        <el-button
          type="warning"
          @click="$message({ type: 'warning', message: '保存中' })"
          >保存</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit" disabled>保存</el-button>
        <el-button type="primary" @click="onSubmit" disabled>保存</el-button>
        <el-button type="success" @click="onSubmit" disabled>保存</el-button>
        <el-button type="danger" @click="onSubmit" disabled>保存</el-button>
        <el-button type="warning" @click="onSubmit" disabled>保存</el-button>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="confirm('', '')">Dialog</el-button>
        <el-button type="primary" plain @click="confirm('info')"
          >取消</el-button
        >
        <el-button type="success" plain @click="confirm('success')"
          >取消</el-button
        >
        <el-button type="danger" plain @click="confirm('error')"
          >取消</el-button
        >
        <el-button type="warning" plain @click="confirm('warning')"
          >取消</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button plain disabled>取消 plain</el-button>
        <el-button type="primary" plain disabled>取消</el-button>
        <el-button type="success" plain disabled>取消</el-button>
        <el-button type="danger" plain disabled>取消</el-button>
        <el-button type="warning" plain disabled>取消</el-button>
      </el-form-item>
      <el-form-item>
        <el-button text>文本 text</el-button>
        <el-button type="primary" text>文本</el-button>
        <el-button type="success" text>文本</el-button>
        <el-button type="danger" text>文本</el-button>
        <el-button type="warning" text>文本</el-button>
      </el-form-item>
      <el-form-item>
        <el-button text disabled>文本 text</el-button>
        <el-button type="primary" text disabled>文本</el-button>
        <el-button type="success" text disabled>文本</el-button>
        <el-button type="danger" text disabled>文本</el-button>
        <el-button type="warning" text disabled>文本</el-button>
      </el-form-item>
      <el-form-item>
        <el-button link>链接 link</el-button>
        <el-button type="primary" link>链接</el-button>
        <el-button type="success" link>链接</el-button>
        <el-button type="danger" link>链接</el-button>
        <el-button type="warning" link>链接</el-button>
      </el-form-item>
      <el-form-item>
        <el-button link disabled>链接 link</el-button>
        <el-button type="primary" link disabled>链接</el-button>
        <el-button type="success" link disabled>链接</el-button>
        <el-button type="danger" link disabled>链接</el-button>
        <el-button type="warning" link disabled>链接</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="confirm('info', 'small')"
          >small</el-button
        >
        <el-button type="primary" size="" @click="confirm('info')"
          >default</el-button
        >
        <el-button type="primary" size="large" @click="confirm('info', 'large')"
          >large</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, getCurrentInstance, shallowRef, h } from "vue";
import WlSvg from "@wltech/svg";
const { proxy } = getCurrentInstance() as any;
const $message = proxy.$message;
const $confirm = proxy.$confirm;

// import { Message, ElLoading, MessageBox } from "element-plus";
// import "element-plus/es/components/message/style/css";
// import "element-plus/theme-chalk/el-loading.css";
// import "element-plus/theme-chalk/el-message-box.css";
const dateIcon = shallowRef({
  render() {
    return h(WlSvg, { type: "date", style: "transform: scale(1.1);" });
  },
});
// do not use same name with ref
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

function confirm(type: string, size?: string) {
  $confirm(
    "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内",
    "标题",
    {
      type: type,
      size: size,
    }
  )
    .then((data: any) => {
      console.log("then", data);
    })
    .catch((e: any) => {
      console.log("catch", e);
    });
}

const onSubmit = () => {
  console.log("submit!");
};
</script>
