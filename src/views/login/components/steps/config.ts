export const identityMap = {
  ADVERTISERS: 1, //广告主
  AGENT: 2, //代理商
};
// 身份文案
export const identityConfig = {
  [identityMap.ADVERTISERS]: {
    WeComJudgeTitle: "您是否有企业微信？",
    WeComJudgeDes: "企业微信号用于添加用户，形成私域流量池",
    DownCodeTitle: "用手机扫码下载企业微信，并根据企业微信的引导注册一个企业",
    DownCodeDes: "企业微信号用于添加用户，形成私域流量池",
    InstallCodeTitle:
      "用企微扫码并根据扫码后的指引在企微上安装集客通，安装成功后回到本页面，并点击右下角“去登录”",
    LoginPageTitle: "现在，用企微扫码登录集客通，开始正式试用！",
    LoginPageDes: "企业微信号用于添加用户，形成私域流量池",
  },
  [identityMap.AGENT]: {
    WeComJudgeTitle: "联系您服务的广告主，并询问他是否有企业微信？",
    WeComJudgeDes: "企业微信号用于添加用户，形成私域流量池",
    DownCodeTitle:
      "下载二维码发给广告主，告诉他用手机扫码下载企业微信，并根据企业微信的引导注册一个企业",
    DownCodeDes: "企业微信号用于添加用户，形成私域流量池",
    InstallCodeTitle:
      "下载二维码发给广告主，告诉他用企微扫码并根据扫码后的指引在企微上安装集客通，安装成功后回到本页面，并点击右下角“去登录”",
    LoginPageTitle:
      "现在，下载二维码发给广告主，告诉他用企微扫码登录集客通，开始正式试用！",
    LoginPageDes: "企业微信号用于添加用户，形成私域流量池",
  },
};
