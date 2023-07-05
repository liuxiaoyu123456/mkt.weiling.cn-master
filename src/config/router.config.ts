import { UserLayout, BasicLayout, BlankLayout } from "@/layouts";

export const asyncRouterMap = [
  {
    path: "/",
    name: "Root", //不能为空
    component: BasicLayout,
    meta: { title: "" },
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "Index",
        component: BlankLayout,
        meta: {
          title: "首页",
        },
        children: [
          {
            path: "",
            name: "IndexDefault",
            component: () => import("@/views/index/Index.vue"),
            meta: {
              title: "首页",
              hideInMenu: true,
            },
          },
          {
            path: "edit",
            name: "IndexEdit",
            component: () => import("@/views/index/Edit.vue"),
            meta: {
              title: "编辑",
              hideInMenu: true,
            },
          },
        ],
      },
      {
        path: "/wechat",
        name: "WeChat",
        component: BlankLayout,
        meta: {
          title: "微信方案",
        },
        children: [
          {
            path: "",
            name: "WeChatDefault",
            component: () => import("@/views/wechat/Index.vue"),
            meta: {
              title: "微信方案",
              hideInMenu: true,
            },
          },
          {
            path: "/wechat/addandedit",
            name: "WeChatEdit",
            component: () => import("@/views/wechat/AddAndEdit.vue"),
            meta: {
              title: "微信方案",
              hideInMenu: true,
            },
          },
          {
            path: "/wechat/form-detail",
            name: "FormDetail",
            component: () => import("@/views/wechat/AddWxDetail.vue"),
            meta: {
              title: "微信方案加微详情",
              hideInMenu: true,
            },
          },
          {
            path: "/wechat/detail",
            name: "WechatDetail",
            component: () => import("@/views/wechat/Detail.vue"),
            meta: { title: "微信方案详情", hideInMenu: true },
          },
        ],
      },
      {
        path: "/miniapp",
        name: "MiniApp",
        component: BlankLayout,
        meta: {
          title: "小程序",
        },
        children: [
          {
            path: "",
            name: "MiniAppDefault",
            component: () => import("@/views/miniapp/Index.vue"),
            meta: {
              title: "小程序",
              hideInMenu: true,
            },
          },
          {
            path: "/add",
            name: "MinappAdd",
            component: () => import("@/views/miniapp/Add.vue"),
            meta: {
              title: "新增小程序",
              hideInMenu: true,
            },
          },
        ],
      },
      {
        path: "/account",
        name: "Account",
        component: () => import("@/views/account/Index.vue"),
        meta: {
          title: "账户中心",
          hideInMenu: true,
        },
      },
      {
        path: "/charge",
        name: "ChargeLayout",
        component: BlankLayout,
        meta: {
          title: "充值中心",
          hideInMenu: true,
        },
        children: [
          {
            path: "",
            name: "Charge",
            component: () => import("@/views/charge/Index.vue"),
            meta: {
              title: "充值中心",
              hideInMenu: true,
            },
          },
          {
            path: "detail",
            name: "ChargeDetail",
            component: () => import("@/views/charge/Detail.vue"),
            meta: {
              title: "充值中心",
              hideInMenu: true,
            },
          },
        ],
      },
      {
        path: "/help",
        name: "HelpCenter",
        component: () => import("@/views/help/Index.vue"),
        meta: {
          title: "帮助中心",
          hideInMenu: true,
        },
      },
      // {
      //   path: "/demo",
      //   name: "Demo",
      //   component: BlankLayout,
      //   meta: {
      //     title: "Demo", //hideInMenu:true
      //   },
      //   children:[
      //     {
      //       path: "style",
      //       name: "DemoCommonStyle",
      //       component: () => import("@/views/demo/Index.vue"),
      //       meta: {
      //         title: "表单样式",
      //       },
      //     },
      //     {
      //       path: "form",
      //       name: "DemoForm",
      //       component: () => import("@/views/demo/Form.vue"),
      //       meta: {
      //         title: "Form",
      //       },
      //     },
      //     {
      //       path: "tree",
      //       name: "DemoTree",
      //       component: () => import("@/views/demo/Tree.vue"),
      //       meta: {
      //         title: "Tree",
      //       },
      //     }
      //   ]
      // },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/exception/404.vue"),
    meta: { title: "404", hideInMenu: false },
  },
];
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home/Index.vue"),
    meta: { title: "首页" },
  },
  {
    path: "/user",
    name: "User",
    component: UserLayout,
    meta: { title: "用户" },
    redirect: "/user/login",
    hidden: true,
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/user/Login.vue"),
        meta: { title: "登录" },
      },
      {
        path: "login-to",
        name: "LoginTo",
        component: () => import("@/views/user/LoginTo.vue"),
        meta: { title: "登录" },
      },
      {
        path: "/install-login",
        name: "InstallLogin",
        component: () => import("@/views/login/Index.vue"),
        meta: { title: "登录" },
      },
    ],
  },
  {
    path: "/auth-result",
    name: "AuthResult",
    component: () => import("@/views/baiduAuth/Index.vue"),
    meta: { title: "百度授权" },
  },
  {
    path: "/agreement",
    name: "Agreement",
    component: () => import("@/views/login/components/Agreement.vue"),
    meta: { title: "用户协议" },
  },
];
