/**
 * 用于文件上传
 * * 参数说明：
 * @param root - vue对象
 */
import CosOperation from "./useCosUpload";
import { ElMessage } from "element-plus";
import { judgeFileType } from "@/utils/utils";
const useUpload = (root?: any) => {
  const max: any = {
    image: 50,
    video: 200,
  };

  //获取文件最大大小
  const getMaxSize = (file: File): number => {
    const type = judgeFileType(file.name);
    return max[type] * 1024 * 1000;
  };

  //文件上传之前的检验
  const onFileBeforeRead = (file: File) => {
    const type = judgeFileType(file.name);
    if (type == "") return false;
    const maxSize = getMaxSize(file);
    if (file.size > maxSize) {
      ElMessage({
        message: `上传的文件不能超过${max[type]}M`,
        type: "error",
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  //上传之后的
  const onFileAfterRead = (
    data: any,
    getPercentage: Function,
    getCosInfo: Function
  ) => {
    return new Promise((resolve, reject) => {
      const type = judgeFileType(data.name);
      const maxSize = getMaxSize(data);
      if (type == "" || data.size > maxSize) {
        type == "" ? reject(`不支持该种类型的文件`) : ``;
        data.size > maxSize ? reject(`上传的文件不能超过${max[type]}M`) : ``;
      } else {
        CosOperation.onCosUpload(data.raw, getPercentage, getCosInfo)
          .then((res) => {
            ElMessage({
              message: `上传成功`,
              type: "success",
              duration: 3000,
            });
            resolve(res);
          })
          .catch((err) => {
            reject(`上传失败`);
          });
      }
    });
  };
  //上传之后的
  const onMacFileAfterRead = (
    data: any,
    getPercentage: Function,
    getCosInfo: Function
  ) => {
    return new Promise((resolve, reject) => {
      CosOperation.onCosUpload(data, getPercentage, getCosInfo)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  //上传之后的
  const onCancelRead = (cancelUploadParams: any) => {
    return new Promise((resolve, reject) => {
      CosOperation.cancelUpload(cancelUploadParams)
        .then((res) => {
          ElMessage({
            message: `取消上传成功`,
            type: "success",
            duration: 3000,
          });
          resolve(res);
        })
        .catch((err) => {
          reject(`取消上传失败`);
        });
    });
  };
  return {
    onFileBeforeRead,
    onFileAfterRead,
    onCancelRead,
    onMacFileAfterRead,
  };
};
export default useUpload;
