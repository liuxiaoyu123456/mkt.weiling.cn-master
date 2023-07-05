import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import WlSvg from "@wltech/svg";

import "@wltech/style";
import "@wltech/style/dist/ant-override.css";
import "@wltech/style/dist/ele-override.css";
import "./assets/main.css";
import "@/assets/scss/output.scss";

import { getCosImageUrl, initPlugin } from "./utils";
import plugins from "./utils/plugins";

const app = createApp(App);

app.config.globalProperties.getCosImageUrl = getCosImageUrl;
initPlugin(app);

app.use(createPinia());
app.use(router);
app.use(WlSvg, import.meta.env.VITE_APP_SUB);
app.use(plugins);

app.mount("#app");

import "./permission";

import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
dayjs.extend(quarterOfYear);
