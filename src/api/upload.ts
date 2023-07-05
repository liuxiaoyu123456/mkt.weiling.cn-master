import { get, post } from "@/utils";

//获取sts临时token
export const getCosToken = (data = {}) => get("/api/cos/get_sts_token", data);

//获取视频截图
export const getVideoThumbnailLogo = (data = {}) =>
  get("/api/cos/get_video_screen", data);
