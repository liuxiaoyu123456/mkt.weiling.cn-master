/**
 * 用于获取基本配置的corp_id，agent_id
 * 如果缓存里有的话直接取缓存的值
 * 如果缓存没有的话就重新从URL上取值并放到缓存中
 * * 参数说明：
 * @param corp_id - 企业对应的id
 * @param agent_id - 企业微信中该应用对应的id
 * @param material_id - 物料ID
 */
import { getQueryVariable } from "./../utils/utils";
//获取授权回调的参数并保存在本地
const useGetIdsFromUrl = () => {
  const sid: string = getQueryVariable("sid");
  const corp_id: string = getQueryVariable("corp_id");
  const agent_id: string = getQueryVariable("agent_id");
  const material_id: string = getQueryVariable("material_id");
  return { corp_id, agent_id, material_id, sid };
};
export default useGetIdsFromUrl;
