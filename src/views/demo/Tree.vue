<template>
  <div class="card" style="min-height: 600px">
    <!-- <div style="display: flex">
      <div style="flex: 1">
        <wl-tree
          :data="treeData2"
          dataType="staff"
          :height="400"
          v-model:checkedKeys="checkedKeys"
          :fieldNames="{
            title: 'name',
            key: 'id',
            parentKey: 'pid',
            image: 'avatar',
            count: 'count',
            isLeaf: (node) => node.type === 2,
          }"
        >
        </wl-tree>
      </div>
      <div style="flex: 1">
        {{ checkedKeys }}
      </div>
    </div> -->
  </div>
</template>
<script setup lang="ts">
// import { ref } from "vue";
// import { get, post } from "@/utils";

// const treeData2 = post("/api/corp/user_picker/dept", {
//   filter: { only_leader: false, role_types: [1, 2, 3, 6] },
// }).then((res) => {
//   if (res.code === 200) {
//     return res.data.dataList;
//   }
//   return [];
// });

// const treeData1: any = [
//   {
//     title: "parent 1",
//     key: "0-0",
//     children: [
//       {
//         title: "parent 1-0",
//         key: "0-0-0",
//         // disabled: true,
//         // disableCheckbox: true,
//         children: [
//           { title: "leaf", key: "0-0-0-0", disableCheckbox: true },
//           { title: "leaf", key: "0-0-0-1" },
//         ],
//       },
//       {
//         title: "parent 1-1",
//         key: "0-0-1",
//         children: [
//           { key: "0-0-1-0", title: "sss", style: "display:none" },
//           { key: "0-0-1-1", title: "ss2s" },
//         ],
//       },
//     ],
//   },
// ];
// const expandedKeys = ref<string[]>(["0-0", "0-0-0", "0-0-1"]);
// const selectedKeys = ref<string[]>(["0-0-0", "0-0-1"]);
// const checkedKeys = ref<string[]>(['1443151761077592064_1428561651745054720']);
</script>
