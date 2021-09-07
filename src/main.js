import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
// 封装的请求
import request from "./utils/request";
import storage from "./utils/storage";
import api from "./api/index";
console.log("环境变量=>", import.meta.env);

const app = createApp(App);
console.log(app, '<=app')
// 按钮权限判断指令
app.directive("has", {
  beforeMount: (el, binding) => {
    // 获取按钮权限
    const actionList = storage.getItem("actionList");
    // 湖区当前绑定的值
    let value = binding.value;
    let hasPermission = actionList.includes(value);
    if (!hasPermission) {
      el.style = "display:none;"
      setTimeout(() => {
        el.parentNode.removeChild(el)
      }, 0)
    }
  },
});
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
app.use(router).use(store).use(ElementPlus, { size: "small" }).mount("#app");
