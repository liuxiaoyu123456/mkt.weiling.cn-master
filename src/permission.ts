import router from "@/router";
import { useUserStore } from "@/stores";
import { setDocumentTitle } from "@/utils";
import { isNavigationFailure } from "vue-router";
import { decamelize } from "humps";
import { useAccountState } from "@/stores";
import { ElMessage } from "element-plus";

const allowList = [
  "Home",
  "Login",
  "LoginTo",
  "AuthResult",
  "Agreement",
  "InstallLogin",
]; //, "HelpCenter"
const loginRoutePath = "/user/login";
const defaultRoutePath = "/";

let userStore: any;
let userInfo: any;

router.beforeEach((to, from, next) => {
  const accountStore = useAccountState();
  if (to.meta && typeof to.meta.title !== "undefined") {
    setDocumentTitle((to.meta.title as string) + " - 卫瓴 · 集客通");
  }

  if (allowList.includes(to.name as string)) {
    if (to.path === loginRoutePath && userInfo) {
      next({ path: defaultRoutePath });
    } else {
      next();
    }
  } else {
    if (!userInfo) {
      userStore = useUserStore();
      userStore.getCurrentUser().then((res: any) => {
        // 未登录
        if (res.code === 7004 || res.code == 4003 || !res.data.isJiketong) {
          if (import.meta.env.VITE_MODE === "dev-temp") {
            ElMessage({
              message: "请先登录",
              type: "error",
            });
          } else {
            res.code == 4003 &&
              ElMessage({
                message: "无权限",
                type: "error",
              });
            next({
              path: loginRoutePath,
              query: {
                redirect_url: encodeURIComponent(
                  import.meta.env.VITE_APP_DOMAIN + to.fullPath
                ),
              },
            });
          }
        } else {
          userInfo = userStore.userInfo;
          accountStore.updateAccountState();
          next();
        }
      });
    } else {
      next();
    }
  }
});

router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure)) {
    // console.log("failed navigation", failure);
    return;
  }
  // console.log(to)
  document.documentElement.setAttribute(
    "data-route-name",
    decamelize(to.name as string, { separator: "-" })
  );
});
