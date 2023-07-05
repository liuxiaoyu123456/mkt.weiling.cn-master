/**
 * 用于文件上传
 */
import { getCosToken, getVideoThumbnailLogo } from "@/api";
import CosJSSDK from "cos-js-sdk-v5";
import { judgeFileType } from "@/utils/utils";

interface VResponse {
  code?: number; //消息状态码
  data?: object; //返回的数据
  msg?: string; //错误/消息类型
  TmpSecretId?: string; //获取回来的临时密钥的 TmpSecretId
  TmpSecretKey?: string; //获取回来的临时密钥的 TmpSecretKey
  SecurityToken?: string; //获取回来的临时密钥的 sessionToken，对应 header 的 x-cos-security-token 字段
  StartTime?: number; //密钥获取的开始时间
  ExpiredTime?: number; //获取回来的临时密钥的 expiredTime
  Bucket?: string; //存储桶的名称，命名格式为 BucketName-APPID，此处填写的存储桶名称必须为此格式
  Region?: string; //存储桶所在地域
  Key?: string; //对象键（Object 的名称），对象在存储桶中的唯一标识
  StorageClass?: string; //'STANDARD'
  Body?: File; //文件的File
  ETag?: string; //cos后台用做协商缓存的参数
  Location?: string; //cos文件地址
  UploadId?: string; //上传后返回的id
  statusCode?: number; //状态码
  screen?: string; // 图片地址
}
let cos: any = null;
const uploadParams: VResponse = {
  Bucket: "",
  Region: "",
  Key: "",
  StorageClass: "STANDARD",
  Body: undefined,
};
//生成随机数
const getRandomSecret = (num: number) => {
  let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < num; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
};

//获取十位的时间戳
const getTimeStamp = (date: any) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

//获取密钥
const getSDKToken = (file: File) => {
  return new Promise((resolve, reject) => {
    getCosToken({}).then(
      (res: any) => {
        const {
          accessSecretId,
          accessSecretKey,
          expiration,
          securityToken,
          config,
        } = res.data;
        const { bucket, region, tenantId } = config;
        const fileType = file.name.split(".").pop();
        const ExpiredTime = getTimeStamp(expiration);
        const StartTime = getTimeStamp(new Date());
        const random = getRandomSecret(7);
        uploadParams.Bucket = bucket;
        uploadParams.Region = region;
        //文件名是13位时间戳和7位随机数
        uploadParams.Key = `${tenantId}/${StartTime}${random}.${fileType}`;
        const cosInitParams: VResponse = {
          TmpSecretId: accessSecretId,
          TmpSecretKey: accessSecretKey,
          SecurityToken: securityToken,
          StartTime,
          ExpiredTime,
        };
        resolve(cosInitParams);
      },
      () => {
        reject({});
      }
    );
  });
};

//配置sdk
const configSDK = (params: VResponse) => {
  cos = new CosJSSDK({
    getAuthorization: (options: any, callback: any) => callback(params),
    FileParallelLimit: 10,
    ChunkParallelLimit: 10,
  });
};

//上传文件
const onUpload = (
  file: File,
  getPercentage: Function,
  getCosInfo: Function
) => {
  return new Promise((resolve) => {
    uploadParams.Body = file;
    cos.sliceUploadFile(
      {
        ...uploadParams,
        onTaskReady: function (taskId: any) {
          /* 非必须 */
          getCosInfo({
            Bucket: uploadParams.Bucket /* 必须 */,
            Region: uploadParams.Region /* 存储桶所在地域，必须字段 */,
            Key: uploadParams.Key /* 必须 */,
            taskId: taskId,
          });
        },
        onHashProgress: function (progressData: any) {
          /* 非必须 */
        },
        onProgress: function (progressData: any) {
          /* 非必须 */
          getPercentage(progressData.percent);
        },
      },
      (err: any, data: any) => {
        resolve(err || data);
      }
    );
  });
};
//终止分块上传
const cancelUpload = (cancelUploadParams: any) => {
  return new Promise((resolve, reject) => {
    // cos.multipartAbort(
    //   {
    //     ...cancelUploadParams,
    //   },
    //   (err, data) => {
    //     resolve(err || data);
    //   }
    // );
    cos.cancelTask(cancelUploadParams.taskId);
    resolve(`成功`);
  });
};
//获取当前第一帧视频图片
const getVideoScreen = (videoUrl: string) => {
  return `${videoUrl}?ci-process=snapshot&time=1&format=jpg`;
};

//获取带播放按钮的图片
const getThumbnailLogo = (screen_url: string, screen_name: string) => {
  return new Promise((resolve) => {
    getVideoThumbnailLogo({
      screen_url,
      screen_name,
    }).then((res: any) => {
      resolve(res.data);
    });
  });
};

//处理cos返回的参数
const handleParams = (location: string, file: File) => {
  //将location数据进行替换
  const cos_file_name = file.name;
  const cos_file_size = file.size;
  const cos_file_type = file.type;
  const cos_url = `https://${location.replace(
    "1304040775.cos.ap-shanghai.myqcloud.com",
    "cos.weiling.cn"
  )}`;

  return {
    cos_file_name,
    cos_file_size,
    cos_file_type,
    cos_url,
  };
};

//初始化cos
const onCosUpload = async (
  file: File,
  getPercentage: Function,
  getCosInfo: Function
) => {
  const sdkParams = await getSDKToken(file);
  return new Promise((resolve, reject) => {
    configSDK(sdkParams as VResponse);
    onUpload(file, getPercentage, getCosInfo).then(
      (res: any) => {
        const params = handleParams(res.Location, file);
        const { cos_url, cos_file_name } = params;
        //如果是视频的话需要额外传视频首祯图和视频封面
        if (judgeFileType(cos_url) === "video") {
          const screen = getVideoScreen(cos_url);
          getThumbnailLogo(screen, cos_file_name).then((res: any) => {
            const { screen: logo } = res.data as VResponse;
            resolve({
              ...params,
              cos_video_file_screen: screen,
              cos_video_thumbnail_logo: logo,
            });
          });
        } else {
          resolve(params);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export default {
  onCosUpload,
  cancelUpload,
};
