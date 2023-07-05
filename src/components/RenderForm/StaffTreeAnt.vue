<!-- 员工按部门选择 -->
<template>
  <div class="content flex-column main-between">
    <div class="flex-row flex1">
      <div class="content_item flex1">
        <!--  v-if="!store.getters.getter_try_version" -->
        <!-- <el-input
          class="m-b-s flex0"
          :placeholder="placeholder"
          v-model="filterText"
         
        >
        </el-input> -->
        <div class="tree_con flex1" :class="multipleLimit ? 'limit-total' : ''">
          <div style="text-align: center" v-if="!filter_dept_list.length">
            加载中...
          </div>
          <Tree
            v-else
            :height="treeSize > 300 ? 367 : undefined"
            checkable
            :selectable="false"
            v-model:checkedKeys="checkedKeys"
            v-model:expandedKeys="expandedKeys"
            :treeData="filter_dept_list"
            @check="onHandleCheck"
            :fieldNames="{
              key: 'nodeId',
              title: 'nickName',
            }"
          >
            <template #title="data">
              <div class="custom_tree_node">
                <div class="custom_tree_node_label flex">
                  <img
                    v-if="data?.leafType == '2'"
                    :src="data?.headImgUrl || defaultAvatar"
                    alt="avatar"
                  />
                  <!-- <span class="custom_tree_node_text">{{
                    data.deptName || data.nickName
                  }}</span> -->
                  <OpenData
                    class="custom_tree_node_text"
                    :openid="data.deptName || data.nickName"
                  />
                  <!-- <VName
                    class="custom_tree_node_text"
                    :name="data.deptName"
                    v-if="data.deptName"
                    type="departmentName"
                  />
                  <VName
                    class="custom_tree_node_text"
                    :name="data.deptName"
                    v-if="data.deptName"
                  /> -->
                  <span v-if="data.leafType == '1'">({{ data.userNum }})</span>
                </div>
              </div>
            </template>
          </Tree>
        </div>
      </div>
      <div class="content_item checked_user flex1">
        <div class="flex-row main-between cross-center" style="height: 40px">
          <span v-if="multipleLimit"
            >可选
            <span
              :class="
                checkedData.length > multipleLimit ? 'error-flush-text' : ''
              "
            >
              {{ checkedData.length }} / {{ multipleLimit }}</span
            >
          </span>
          <span v-else> 已选{{ checkedData.length }}人 </span>

          <a class="hyperlink" @click="onResetChecked">清除</a>
        </div>
        <v-list
          class="ul"
          :height="367"
          :data="checkedData"
          itemKey="id"
          v-show="checkedData.length"
        >
          <template v-slot="data">
            <div class="li">
              <div class="flex-row cross-center">
                <img :src="data?.headImgUrl || defaultAvatar" alt="Avatar" />
                <!-- <VName :name="data?.nickName" /> -->
                <OpenData :openid="data?.nickName" />
                <!-- <span>{{ data?.nickName }}</span> -->
                <el-icon
                  @click="onUnChecked(data)"
                  style="color: #b9b9b9; cursor: pointer; vertical-align: -4px"
                >
                  <Close />
                </el-icon>
              </div>
            </div>
          </template>
        </v-list>
      </div>
    </div>
    <footer class="flex-center">
      <el-button @click="$emit('onClose')" class="btn">取 消</el-button>
      <el-tooltip
        effect="dark"
        content="添加员工超过上限"
        placement="top"
        :disabled="!multipleLimit || checkedData.length <= multipleLimit"
      >
        <span>
          <el-button
            :disabled="!!multipleLimit && checkedData.length > multipleLimit"
            type="primary"
            class="m-l-l btn"
            @click="onSub"
          >
            确 定
          </el-button>
        </span>
      </el-tooltip>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, onMounted } from "vue";
import { useUserStore } from "@/stores";
import { defaultAvatar } from "@/utils";
import { Close } from "@element-plus/icons-vue";
import { Tree } from "ant-design-vue";
import { cloneDeep, debounce } from "lodash-es";
import "ant-design-vue/es/tree/style/css";

let getListData = (data: any, config: any) => {
  let newData = data.map((res: any) => {
    let obj = {
      ...res,
    };
    if (res.leafType == "1") {
      Object.assign(obj, res.deptInfo);
      delete obj.deptInfo;
    } else if (res.leafType == "2") {
      Object.assign(obj, res.staffInfo);
      delete obj.staffInfo;
    }
    return obj;
  });
  let id = config.id || "id";
  let pid = config.pid || "pid";
  let children = config.children || "children";
  let idMap: any = {};
  let jsonTree: any = [];
  newData.forEach(function (v: any) {
    idMap[v[id]] = v;
  });
  newData.forEach(function (v: any) {
    let parent = idMap[v[pid]];
    let newN = v;
    if (parent) {
      !parent[children] && (parent[children] = []);
      if (newN.leafType == "2") {
        newN.nodeId = newN.deptId + newN.id;
      } else {
        newN.nodeId = newN.id + "D";
      }
      parent[children].push(newN);
    } else {
      newN.nodeId = newN.id;
      jsonTree.push(newN);
    }
  });
  return jsonTree.reverse();
};
export default defineComponent({
  name: "tempStaffTree",
  components: { Close, Tree },
  props: {
    staffTotal: {
      type: Number,
    },
    staffUnChecked: {
      type: Object,
      default() {
        return {};
      },
    },
    staffChecked: {
      type: Array,
      default() {
        return [];
      },
    },
    originalData: {
      //从接口取得的原始数据
      type: Array,
      default() {
        return [];
      },
    },
    multipleLimit: {
      // 限制选中数量
      type: Number,
    },
    ruleType: {
      type: Number,
      default() {
        return 0;
      },
    },
    // 是不是单选
    isSingle: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const store: any = useUserStore();
    const state = reactive({
      filterText: "",
      checkedKeys: [],
      checkedData: [],
      nodeMap: null, //nodeMap: <key:id,value:NodeList>
      nodeMapDep: null,
      dept_list: [],
      filter_dept_list: [],
      default_expanded_keys: [],
      expandedKeys: [],
      treeSize: 0,
      searching: false,
      placeholder: "搜索员工", // 搜索框的回显
    });
    const Methods = {
      // onSelect(checkedKeys, { selected, selectedNodes, node: val, event }) {
      //   if (val.leafType == 2) {
      //     // let checked = true;
      //     // let checkedNodes = [...state.checkedData];
      //     // //如果是取消
      //     // if (isChooedDataInCheckData(val)) {
      //     //   checked = false;
      //     //   checkedNodes = checkedNodes.filter((node) => node.id != val.id);
      //     // } else {
      //     //   checkedNodes.push(val);
      //     // }
      //     // Methods.onHandleCheck(null, {
      //     //   checked: checked,
      //     //   checkedNodes,
      //     //   node: val,
      //     // });
      //   } else {
      //   }
      // },
      /**
       * @overview 选择框点击事件，根据 getCheckedNodes 得到的当前选中的节点
       * 与 checkData 对比 得到当前的操作是 新增还是删除 在进行相对应的操作
       */
      onHandleCheck(
        checkedKeys: any,
        { checked, checkedNodes: res, node: val, event }: any
      ) {
        // let res = checkedKeys// state.tree.getCheckedNodes(true);
        //如果选中的节点是员工
        if (val.leafType == "2") {
          // 如果是取消选中
          if (!checked) {
            // if (isChooedDataInCheckData(val)) {
            //如果当前选中的节点已经被选中了，表示当前的事件为取消选择事件
            //得到取消后需要设置的数组
            let dataListWaitForSeted = state.checkedData.filter(
              (element: any) => {
                return element.id != val.id;
              }
            );
            state.checkedData = deDupCheckedData(dataListWaitForSeted);
          } else {
            //当前事件为新增事件
            if (props.isSingle) {
              state.checkedData = res && [res[res.length - 1]];
            } else {
              state.checkedData = deDupCheckedData([
                ...res,
                ...state.checkedData,
              ]);
            }
          }
        } else {
          //当前选中的是部门
          if (checked) {
            // if (!isChooedNodeInCheckData(val)) {
            //如果是新增的操作
            //当前事件为新增事件
            if (props.isSingle) {
              state.checkedData = res && [res[res.length - 1]];
            } else {
              state.checkedData = deDupCheckedData([
                ...res,
                ...state.checkedData,
              ]);
            }
          } else {
            //如果是删除
            //得到取消后需要设置的数组
            let dataListWaitForDelet = getStaffList(val); //需要删除的员工组成的数组
            let map = new Map(); //将ckeckData传入map
            state.checkedData.forEach((value: any) => {
              map.set(value.id, value);
            });
            //删除map中 包含dataListWaitForDelet数组中元素 的元素
            dataListWaitForDelet.forEach((staff: any) => {
              map.delete(staff.id);
            });
            let res222 = Array.from(map.values());
            state.checkedData = deDupCheckedData(res222);
          }
        }
      },
      // 清除所有
      onResetChecked() {
        state.checkedData = [];
      },
      // 取消选中某个员工（取消所有id匹配的员工）
      onUnChecked(data: any) {
        state.checkedData = state.checkedData.filter(
          (res: any) => res.id != data.id
        );
      },
      onSub() {
        if (
          props.multipleLimit &&
          state.checkedData.length > props.multipleLimit
        ) {
          return;
        }
        emit("onCheckedUser", state.checkedData);
      },

      // 搜索的placeholder回显判断
      rulePlaceholder() {
        if (props.ruleType == 0) {
          state.placeholder = "搜索员工";
        } else if (props.ruleType == 1) {
          state.placeholder = "搜索好友";
        }
      },
    };

    function initOriginalData() {
      if (
        !props.originalData ||
        !props.originalData.length ||
        state.dept_list.length
      ) {
        return;
      }
      state.treeSize = props.originalData.length;
      state.dept_list = getListData(props.originalData, {
        id: "id",
        pid: "parentId",
        children: "children",
      });
      state.filter_dept_list = state.dept_list;
      state.expandedKeys = state.default_expanded_keys = [
        state.dept_list[0].nodeId,
      ];
      state.nodeMap = getNodeMap(
        props.originalData.filter((res: any) => res.leafType == 2)
      ); //将叶子节点输入nodeMap
      // state.nodeMapDep = getNodeMapDep(props.originalData);
      if (props.staffChecked.length != 0) {
        state.checkedData = props.staffChecked;
      }
      state.checkedData.forEach((value, index) => {
        state.checkedData[index]["leafType"] = 2;
      });
    }
    function initCheckedData() {
      if (state.nodeMap) {
        //将checkData数组转化成nodeId 数组
        let nodeKeyList = matchNodeKeyList(state.checkedData, state.nodeMap);
        // 改变左边的tree的节点显示
        state.checkedKeys = nodeKeyList;
      }
    }
    onMounted(() => {
      Methods.rulePlaceholder();
      initOriginalData();
      initCheckedData();
    });

    function getFilterList(search: any, list: any) {
      if (!search.trim().length) {
        state.searching = false;
        state.expandedKeys = state.default_expanded_keys;
        return list;
      }
      const cList = cloneDeep(list);
      if (!state.searching) {
        state.default_expanded_keys = state.expandedKeys;
        state.searching = true;
      }
      state.expandedKeys = [];
      return (function f(plist) {
        return plist.filter((item: any) => {
          if (
            item.leafType == 2 &&
            item.nickName &&
            item.nickName.toLowerCase().indexOf(search.trim().toLowerCase()) !==
              -1
          ) {
            return true;
          } else if (item.leafType == 1) {
            item.children = f(item.children || []);
            const result = !!item.children.length;
            if (result) {
              state.expandedKeys.push(item.nodeId);
            }
            return result;
          }
        });
      })(cList);
    }

    watch(
      () => state.filterText,
      debounce((val) => {
        state.filter_dept_list = getFilterList(val, state.dept_list);
      }, 500)
    );
    //外部传入要取消的人
    watch(
      () => props.staffUnChecked,
      () => {
        Methods.onUnChecked(props.staffUnChecked);
      }
    );
    //初始化事件
    watch(
      () => props.originalData,
      () => {
        initOriginalData();
        initCheckedData();
      }
    );
    watch(
      () => props.staffChecked,
      (list) => {
        state.checkedData = list;
      }
    );
    watch(
      () => state.checkedData,
      () => {
        initCheckedData();
      }
    );

    //得到nodeMap<key:id,value:NodeList>
    const getNodeMap = (dataList: any) => {
      let nodeMap = new Map();
      dataList.forEach((node: any) => {
        let nodeId = node.staffInfo.id + node.staffInfo.deptId; //拼出nodeid作为唯一的标识符
        node["nodeId"] = nodeId;
        if (nodeMap.has(node.staffInfo.id)) {
          let valueList = nodeMap.get(node.staffInfo.id); //当前的value数组
          valueList.push(node); //将当前的node推入数组
          nodeMap.set(node.staffInfo.id, valueList); //设置当前的valuelist
        } else {
          let valueList = [node];
          nodeMap.set(node.staffInfo.id, valueList);
        }
      });
      return nodeMap;
    };
    //得到nodeMapDep<key:dep_id,value:nodeList>
    // const getNodeMapDep = (dataList) => {
    //   let nodeMapDep = new Map();
    //   dataList.forEach((element) => {
    //     //如果map中没有存储当前员工的部门，就存储下来，并将当前的员工的当做value
    //     if (!nodeMapDep.has(element.parent_id)) {
    //       nodeMapDep.set(element.parent_id, [element]);
    //     } else {
    //       //map中已经存在过存储过当前员工的部门
    //       let nodeList = nodeMapDep.get(element.parent_id);
    //       nodeList.push(element);
    //       nodeMapDep.set(element.parent_id, nodeList);
    //     }
    //   });
    //   return nodeMapDep;
    // };
    //根据传入的id List 匹配出 Nodeid List
    const matchNodeKeyList = (staffChecked: any, nodeMap: any) => {
      let nodeKeyList: any = [];
      staffChecked.forEach((staff: any, index: any) => {
        let valueList = nodeMap.get(staff.id);
        if (!valueList) return; //如果有无效员工
        let keyList: any = [];
        valueList.forEach((element: any) => {
          keyList.push(element.staffInfo.deptId + element.staffInfo.id);
        });
        nodeKeyList.push.apply(nodeKeyList, keyList);
        //nodeKeyList.push(...keyList)
      });
      return nodeKeyList;
    };

    //选择的节点为子节点时，判断当前操作 为 新增还是 删除
    // const isChooedDataInCheckData = (choosedData) => {
    //   // let checkDataMap = new Map();
    //   // state.checkedData.forEach(element => {
    //   //   if (!checkDataMap.has(element.id)) {
    //   //     checkDataMap.set(element.id, element);
    //   //   }
    //   // });
    //   // return checkDataMap.has(choosedData.id);

    //   return state.checkedData.some((element) => element.id === choosedData.id);
    // };
    //选择的节点为父节点时，判断当前操作 为 新增还是 删除
    // const isChooedNodeInCheckData = (choosedNode) => {
    //   let staffList = getStaffList(choosedNode.id);
    //   let staffMap = new Map();
    //   let isAnyElementNotInCheckData = true; //是否在staffList中有任何元素不在checkData里面
    //   state.checkedData.forEach((value) => {
    //     if (!staffMap.has(value.id)) {
    //       staffMap.set(value.id, value);
    //     }
    //   });
    //   staffList.forEach((value) => {
    //     if (!staffMap.has(value.staff_info.id)) {
    //       isAnyElementNotInCheckData = false;
    //     }
    //   });
    //   //false 为新增 true 为删除
    //   return isAnyElementNotInCheckData;
    // };
    /**
     * @overview 根据 部门id 得到所有的 staffId
     * @param dep_id 部门id
     * @param tempArr 递归的查询到所有该部门下的所有员工的List
     */
    // const getStaffList_old = (dep_id) => {
    //   let tempdep_id = dep_id;
    //   let staffList = state.nodeMapDep.get(tempdep_id); //初始化员工数组
    //   let resList = [];
    //   for (let i in staffList) {
    //     if (staffList[i].leafType == "2") {
    //       resList.push(staffList[i]);
    //     } else {
    //       resList = resList.concat(getStaffList(staffList[i].id));
    //     }
    //   }
    //   return resList;
    // };

    const getStaffList = (depNode: any) => {
      let staffList = depNode.children || [];
      let resList: any = [];
      for (let i in staffList) {
        if (staffList[i].leafType == "2") {
          resList.push(staffList[i]);
        } else {
          resList = resList.concat(getStaffList(staffList[i]));
        }
      }
      return resList;
    };

    const deDupCheckedData = (dataList: any) => {
      let resMap = new Map();
      let resDataList = dataList.filter((staff: any) => {
        //去重，每个id只有一个人
        if (!resMap.has(staff.id)) {
          resMap.set(staff.id, staff);
          return staff.leafType == "2";
        }
      });

      return resDataList;
    };
    return {
      store,
      ...toRefs(state),
      ...Methods,
      defaultAvatar,
    };
  },
});
</script>

<style scoped lang="scss">
.content {
  box-sizing: border-box;
  height: 100%;
  .content_item {
    padding: 16px;
    &:first-child {
      border-right: 1px solid #eeeeee;
    }
    // &:last-child {
    //   padding-left: 16px;
    //   padding-right: 0;
    // }
    .tree_con {
      margin-top: 6px;
      height: 420px;
      height: calc(100% - 30px);
      overflow: auto;
    }
  }
}
.checked_user {
  :deep() .v-list .ant-tree-switcher {
    display: none;
  }
  .ul {
    height: 420px;
    height: calc(100% - 30px);
    overflow: auto;
    :deep(.ant-tree-switcher) {
      display: none;
    }
    .li {
      > div {
        display: inline-block;
        padding: 4px 6px;
        background: rgba(28, 159, 255, 0.08);
        border-radius: 4px;
        color: #000000;
        margin-bottom: 10px;
        line-height: 1.4;
      }
      img {
        width: 24px;
        height: 24px;
        object-fit: cover;
        border-radius: 50%;
        vertical-align: middle;
      }
      span {
        margin: 0 6px;
        vertical-align: middle;
      }
    }
  }
}
footer {
  padding: 15px 0;
  border-top: 1px solid #eeeeee;
}
:deep() {
  // .limit-total {
  //   .el-tree {
  //     // 不可全选样式
  //     .el-tree-node {
  //         .is-leaf + .el-checkbox {
  //           display: inline-block;
  //         }
  //         .el-checkbox {
  //           display: none;
  //         }
  //       }
  //   }
  // }
  .custom_tree_node {
    height: 36px;
  }

  .custom_tree_node_label {
    white-space: nowrap;
    img {
      width: 24px;
      height: 24px;
      object-fit: cover;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .custom_tree_node_text {
    font-size: 14px;
    color: #000000;
  }
  .el-tree-node__content {
    height: 36px;
  }
  .el-tree-node__expand-icon {
    color: #c1c1c1;
    font-size: 16px;
  }
  .btn {
    width: 108px;
    height: 40px;
    font-size: 18px;
    border-radius: 8px;
  }
  .el-tree-node__children {
    // width: fit-content;
  }
}
.m-l-l {
  margin-left: 12px;
}
</style>
