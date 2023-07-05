<template>
  <!-- 头部小微 start -->
  <div class="home-msg flex-row card">
    <img
      class="xiaowei"
      src="https://wlmvp-cos.weiling.cn/worktable-erp/bigPic/home_xiaowei.png?v=000"
      alt="小微"
    />
    <!-- <ul
      v-if="!accountState.haveMiniApp"
      class="flex-1 info-group flex-col-reverse"
    >
      <li
        class="info flex-col justify-center flex-none"
        v-for="(val, key) in count"
        :key="key"
      >
        <p class="info-counts">
          昨日集客通为您带来了<span class="primary">{{ 11 }}</span
          >条加微，累计加微<span class="primary">{{ 111 }}</span
          >条
        </p>
        <p class="info-guide">
          正式使用集客通您只需要做{{ 2 }}步操作
          <span
            >「<el-link :underline="false" type="primary">充值</el-link>」</span
          ><span
            >「<el-link :underline="false" type="primary">配置小程序</el-link
            >」</span
          >
        </p>
      </li>
      <li class="load-trigger" ref="loadTrigger"></li>
    </ul> -->
    <div
      v-if="accountState.haveSolution"
      class="info flex-col justify-center flex-1"
    >
      <p class="info-counts">
        昨日集客通为您带来了<span class="primary">{{
          accountState.yesterDayAdd
        }}</span
        >条加微<span
          v-if="
            accountState.status === 1 &&
            accountState.haveMiniApp &&
            accountState.haveSolution
          "
          >{{ accountState.yesterDayAdd ? "，快去看看吧！" : "" }}</span
        ><span v-else
          >，累计加微<span class="primary">{{ accountState.allAdd }}</span
          >条</span
        >
      </p>
      <!-- 如果不平衡或者没有创建小程序则需要进行几步操作 -->
      <p
        class="info-guide"
        v-if="!accountState.balance || !accountState.haveMiniApp"
      >
        正式使用集客通您只需要做{{
          +!accountState.haveMiniApp + +!accountState.balance
        }}步操作
        <span v-if="!accountState.balance"
          >「<el-link
            :underline="false"
            type="primary"
            @click="router.push({ name: 'Charge' })"
            >充值</el-link
          >」</span
        ><span v-if="!accountState.haveMiniApp"
          >「<el-link
            :underline="false"
            type="primary"
            @click="router.push({ name: 'MinappAdd' })"
            >配置小程序</el-link
          >」</span
        >
      </p>
    </div>
    <div v-else-if="accountState.status === -1" class="flex-1"></div>
    <div v-else class="info flex-col justify-center flex-1">
      <p class="info-tip">
        您还没有创建过微信方案哦，只需四步轻松get
        百度加微获客方案，大幅提升加微率！
      </p>
      <p class="info-link">
        <el-link
          @click="router.push({ name: 'WeChatDefault' })"
          :underline="false"
          type="primary"
          >立即新建&nbsp;<el-icon><wl-svg type="arrowRight" /></el-icon
        ></el-link>
      </p>
    </div>
    <div v-if="accountState.status !== 1" class="counts-card">
      <p class="counts-card-title">试用版到期时间(天)</p>
      <p class="counts-card-num primary">
        {{ timeLeft }}
      </p>
    </div>
    <div class="counts-card">
      <p class="counts-card-title">余额(元)</p>
      <p class="counts-card-num primary">
        {{ accountState.balance }}
      </p>
    </div>
    <div class="operation">
      <!-- 点击路由跳转 -->
      <el-button size="small" @click="router.push({ name: 'ChargeDetail' })"
        >订单详情</el-button
      >
      <br />
      <br />
      <el-button
        size="small"
        type="primary"
        @click="router.push({ name: 'Charge' })"
        >余额充值</el-button
      >
    </div>
  </div>
  <!-- 头部小微 end -->
  <div class="home-dashboard flex-row">
    <div class="home-dashboard-charts card">
      <div class="filter">
        <div class="filter-title">数据看板</div>
        <!-- 过滤数据，选择日期和创建人的组件，样式设置为内联样式，间距设置为12个单位 -->
        <WlForm
          class="flex-1"
          :inline="true"
          :list="chartFormList"
          :model="chartModel"
          :field-space="12"
        ></WlForm>
      </div>
      <!-- 三个统计start -->
      <div class="counts flex-row">
        <div
          class="counts-item flex-row items-center justify-around flex-wrap flex-1"
        >
          <div class="counts-item-des">
            <img
              src="@/assets/images/icon_click_count.png"
              alt="icon"
              class="counts-item-des-icon"
            />点击数
          </div>
          <div class="counts-item-num">{{ counts.clickCount || 0 }}</div>
        </div>
        <div
          class="counts-item flex-row items-center justify-around flex-wrap flex-1"
        >
          <div class="counts-item-des">
            <img
              src="@/assets/images/icon_wechat_count.png"
              alt="icon"
              class="counts-item-des-icon"
            />加微数
          </div>
          <div class="counts-item-num">{{ counts.totalCount || 0 }}</div>
        </div>
        <div
          class="counts-item flex-row items-center justify-around flex-wrap flex-1"
        >
          <div class="counts-item-des">
            <img
              src="@/assets/images/icon_wechat_rate.png"
              alt="icon"
              class="counts-item-des-icon"
            />加微率<el-tooltip placement="top"
              ><el-icon class="pointer"
                ><wl-svg type="explain"></wl-svg></el-icon
              ><template #content>
                <div>
                  加微率=扫码加微数/按钮点击数
                  <!-- <br />钮点击数 ≈ 加微页面展现数 -->
                </div>
              </template></el-tooltip
            >
          </div>
          <div class="counts-item-num">{{ counts.totalRate }}%</div>
        </div>
      </div>
      <!-- 三个统计end,这里是引入的组件 -->
      <Echarts :option="option" />
    </div>
    <!-- 排行榜start -->
    <div class="home-dashboard-ranks card flex-col">
      <div class="title">方案排行</div>
      <!-- 引入的组件 -->
      <RankList :finished="true" :empty="!rankList?.length">
        <RankListItem
          v-for="(item, index) in rankList"
          :item="item"
          :index="index"
          :key="item.codeChannelId || index"
        />
      </RankList>
    </div>
    <!-- 排行榜end -->
  </div>
  <!-- 带筛选的表格start -->
  <div class="home-table card" v-loading="loading">
    <div class="home-table-filter flex-row items-center">
      <span class="title">客户列表</span
      >
      <WlForm
        class="flex-1"
        :inline="true"
        :list="tableFormList"
        :model="model"
        :field-space="12"
      ></WlForm>
    </div>
    <!-- 客户列表数据 -->
    <!-- 两个自定义事件change和cellClick -->
    <SurelyTable
      :loading="loading"
      :data="data"
      :columns="columns"
      height="calc(100vh - 264px)"
      rowKey="uniId"
      @change="handleSortChange"
      @cellClick="handleCellClick"
    />
    <!-- 分页组件 -->
    <div class="flex-center home-table-pager">
      <Pagination :total="total" v-model:limit="limit" v-model:page="page" />
    </div>
  </div>
  <!-- 带筛选的表格end -->
  <!-- 小微提醒弹窗start -->
  <HomeDialog
    @route="router.push({ name: $event })"
    v-model="showHomeDialog"
    :type="dialogType"
    :timeLeft="timeLeft"
    :expired="+accountState.lastDay <= Date.now()"
  />
  <!-- 小微提醒弹窗end -->
  <!-- 表格添加人弹窗start -->
  <Dialog
    v-model:value="showFriendsDetail"
    append-to-body
    destroy-on-close
    title="添加好友"
    :showFooter="false"
    custom-class="friends-detail-dialog"
  >
    <FriendZone
      :customer="friendsExternalUser"
      :friendsList="friendsList"
      :isEnd="friendsListEnd"
      :loadFn="friendsListLoad"
    />
  </Dialog>
  <!-- 表格添加人弹窗end -->
  <!-- 余额预警start -->
  <BalanceDialog
    :force-hidden="showHomeDialog"
    @confirm="router.push({ name: 'Charge' })"
  />
  <!-- 余额预警end -->
  <!-- <SaveUrl v-model="showFavorites" /> -->
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { Search } from "@element-plus/icons-vue";
import { computed, ref, shallowRef, watch } from "vue";
import { useRouter } from "vue-router";
import { useSessionStorage } from "@vueuse/core";
import Echarts from "@/components/Echarts/Echarts.vue";
import RankList from "./components/RankList.vue";
import RankListItem from "./components/RankListItem.vue";
import HomeDialog from "./components/HomeDialog.vue";
// import SaveUrl from "./components/SaveUrl.vue";
import FriendZone from "@/views/components/FriendZone.vue";
import BalanceDialog from "./components/BalanceDialog.vue";
import { useAccountState } from "@/stores";
import { useLineChart } from ".";
import {
  useFilterTable,
  useForm,
  // useTimeInterval,
  type ApiFnType,
} from "@/hooks";
import type { FormItemType } from "wltech-ui";
import { storeToRefs } from "pinia";
import {
  customerList,
  planStatis,
  planRank,
  customerMutualFriendList,
  userPickerDept,
  corpUserPicker,
  payChangeStatus,
} from "@/api";
import OpenData from "@/components/OpenData.vue";

// import { debounce } from "lodash-es";

// const count = ref([]);
// const addCount = debounce(() => {
//   console.log("addCount");
//   count.value.push(1, 1, 1, 1, 1);
// }, 300);
// const loadTrigger = ref();
// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       addCount();
//     }
//   });
// });
// onMounted(() => {
//   observer.observe(loadTrigger.value);
// });
// onBeforeUnmount(() => {
//   observer.disconnect();
// });
const router = useRouter();
const store = useAccountState();
const { accountState } = storeToRefs(store);
const firstLogin = useSessionStorage("firstLogin", true);
const getTimeDiff = (stamp: number) =>
  Math.max(dayjs(stamp).diff(dayjs(), "d"), 0);
const timeLeft = computed(() => getTimeDiff(+accountState.value.lastDay));
// const stop = useTimeInterval(() => {
//   timeLeft.value = getTimeDiff(+accountState.value.lastDay);
//   if (timeLeft.value == 0) {
//     stop();
//   }
// });

const chartFormList = shallowRef<FormItemType[]>([
  {
    type: "daterange",
    key: "time",
    props: {
      clearable: false,
      style: {
        width: "230px",
      },
    },
  },
  {
    label: "",
    type: "staffSelect",
    key: "users",
    options: async () => {
      const { data } = await corpUserPicker({ filter: { status: 5 } });
      return data?.dataList || [];
    },
    setting: {
      nameRender: (staff) => {
        return (
          <>
            <OpenData openid={staff.name} />
            {staff.status == 5 && <span>（已离职）</span>}
          </>
        );
      },
      searchAble: false,
    },
    props: {
      placeholder: "创建人筛选",
      clearable: true,
    },
  },
]);

const { model: chartModel } = useForm(
  {
    time: [0, 0, "thisWeek"],
    users: "",
  },
  {
    immediate: true,
    debounce: 100,
    action: (val: any) => {
      const params = {
        start: val.time?.[0],
        end: Math.min(val.time?.[1], dayjs().endOf("d").valueOf()),
        createUserId: val.users,
      };
      planStatis({ ...params, timeType: "day" })
        .then(({ data }) => {
          chartData.value = data.userStatisVos;
          delete data.userStatisVos;
          counts.value = data;
        })
        .catch(() => {
          chartData.value = [];
          counts.value = defaultCounts();
        });
      planRank(params)
        .then(({ data }) => {
          rankList.value = data.codeList;
        })
        .catch(() => {
          rankList.value = [];
        });
    },
  }
);
const rankList = ref<any[]>([]);
const chartData = ref([]);
const defaultCounts = () => ({
  clickCount: 0,
  totalCount: 0,
  totalRate: 0,
});
const counts = ref(defaultCounts());
const option = computed(() =>
  useLineChart({
    data: chartData.value,
  })
);
const handleCellClick = ({ row, prop, column }: any) => {
  switch (prop) {
    case "friendList":
      showFriendsDetail.value = true;
      friendsExternalUser.value = row;
      break;
    case "customer":
      break;
    case "componentName":
      break;
    case "createTime":
      break;
    case "lostState":
      break;
    default:
  }
};
const tableFormList = shallowRef<FormItemType[]>([
  {
    type: "daterange",
    key: "time",
    props: {
      clearable: false,
      style: {
        width: "230px",
        // marginRight: "8px",
      },
    },
  },
  {
    label: "",
    type: "select",
    key: "lostState",
    props: {
      placeholder: "流失状态",
      clearable: true,
      style: {
        width: "128px",
      },
    },
    options: [
      {
        label: "未流失",
        value: 0,
      },
      {
        label: "已流失",
        value: 1,
      },
    ],
  },
  {
    label: "",
    key: "user_ids",
    type: "staffTree",
    props: {
      // style: {
      //   width: "128px",
      // },
      placeholder: "选择添加员工",
      multiple: true,
      innerLabel: "添加员工",
      clearable: true,
      maxEchoCount: 2,
    },
    setting: {
      nameRender: (staff) => {
        return <OpenData openid={staff.name} />;
      },
      searchAble: false,
    },
    options: () =>
      userPickerDept({ filter: { status: 5 } }).then((res) => {
        return res.data?.dataList || [];
      }),
  },
  {
    label: "",
    type: "input",
    key: "keyword",
    props: {
      placeholder: "搜索",
      prefixIcon: Search,
      style: {
        width: "160px",
      },
    },
  },
]);
const apiFn: ApiFnType = async ({ page: pageCount, limit, model, sort }) => {
  const params = {
    keyword: model.keyword || "",
    sortParam: {
      pageCount,
      limit,
      sort: sort,
    },
    start: model.time?.[0] || "",
    end: Math.min(model.time?.[1], dayjs().endOf("d").valueOf()) || "",
    lostState: model.lostState,
    user_ids: model.user_ids,
  };
  const res = await customerList(params);
  return [
    res.data?.dataList.map((item: any) => ({
      ...item,
      customer: {
        id: item.id,
        nickName: item.nickName,
        headImgUrl: item.headImgUrl,
      },
      uniId: item.id + item.userId,
    })),
    res.data?.count,
  ];
};
const { model, loading, data, columns, handleSortChange, page, limit, total } =
  useFilterTable(apiFn, {
    defaultModel: {
      time: [0, 0, "thisWeek"],
      keyword: "",
      lostState: "",
    },
    getColumns: (_: any) => [
      {
        title: "微信昵称",
        prop: "customer",
        type: "user",
        width: 240,
        fixed: "left",
      },
      {
        title: "来源方案",
        prop: "componentName",
        width: 280,
        type: "twoLine",
      },
      // {
      //   title: "来源落地页",
      //   prop: "plPageId",
      //   width: 280,
      //   type: "link",
      //   clickable: true,
      // },
      {
        title: "添加人",
        prop: "friendList",
        type: "userGroup",
        clickable: true,
        width: 160,
      },
      {
        title: "首次添加时间",
        prop: "createTime",
        sortable: true,
        type: "date",
        width: 200,
      },
      {
        title: "流失状态",
        prop: "lostState",
      },
    ],
  });

const friendsExternalUser = ref<any>();
const friendsList = ref<any[]>([]);
const friendsListCount = ref(1);
const friendsListTotal = ref(1);
const friendsListEnd = computed(() => {
  return friendsList.value.length >= friendsListTotal.value;
});
const friendsListLoad = () => {
  customerMutualFriendList({
    externalUserid: friendsExternalUser.value.externalUserid || "",
    sortParam: {
      limit: 5,
      pageCount: friendsListCount.value,
      sort: [
        {
          prop: "createTime",
          order: 0,
        },
      ],
    },
  }).then(({ data }) => {
    friendsList.value.push(...(data.dataList || []));
    friendsListTotal.value = +data.count;
    friendsListCount.value++;
  });
};
watch(friendsExternalUser, () => {
  friendsList.value = [];
  friendsListCount.value = 1;
  friendsListTotal.value = 1;
});
const changeStatus = () => {
  payChangeStatus({ statusBit: 6 /* 这个枚举目前只有6有用 */ });
};
const showDialog = ref(true);
const showHomeDialog = computed({
  get() {
    return (
      showDialog.value &&
      accountState.value.status === 0 &&
      firstLogin.value &&
      (!accountState.value.loginFlag ||
        (timeLeft.value < 4 &&
          !(accountState.value.balance && accountState.value.haveMiniApp)))
    );
  },
  set(val) {
    if (!val) {
      changeStatus();
      showDialog.value = val;
      firstLogin.value = val;
    }
  },
});

const dialogType = computed(() =>
  !accountState.value.loginFlag
    ? "WeChatDefault"
    : accountState.value.balance
    ? "MinappAdd"
    : "Charge"
);
// watch(
//   () => accountState.value.loginFlag,
//   (flag) => {
//     showDialog.value = flag === 0;
//   }
// );
// const showFavorites = ref(false);
const showFriendsDetail = ref(false);
</script>
<style lang="scss" scoped>
.home {
  &-msg {
    height: 144px;
    margin: 16px 0;
    padding-left: 156px;
    position: relative;
    .xiaowei {
      width: 152px;
      position: absolute;
      left: -18px;
      bottom: -2px;
    }
    .info {
      gap: 20px;
      min-width: 0;
      height: 96px;
      &-group {
        margin: 0;
        overflow-y: auto;
      }
      &-tip,
      &-counts,
      &-guide {
        font-weight: 600;
        line-height: 1.3;
        font-size: 16px;
      }
      .el-link {
        font-weight: 600;
        font-size: 16px;
        line-height: 1.3;
        vertical-align: baseline;
      }
    }
    .counts-card {
      padding: 0 32px;
      position: relative;
      & + .counts-card::after {
        content: "";
        display: block;
        position: absolute;
        top: 25%;
        left: 0;
        bottom: 25%;
        width: 1px;
        background-color: var(--wl-line-color);
      }
      &-title {
        color: var(--wl-text-color-title-2);
      }
      &-num {
        text-align: end;
        color: var(--wl-primary-color);
        font-size: 40px;
      }
    }
    .operation {
      padding: 8px;
      margin-left: 16px;
      line-height: 16px;
      > .el-button {
        width: 88px;
      }
    }
  }
  &-dashboard {
    margin: 16px 0;
    gap: 16px;
    &-charts {
      flex: 17;
      width: 0;
      .filter {
        padding: 0 24px 16px;
        margin: 0 -24px;
        display: flex;
        gap: 24px;
        align-items: center;
        border-bottom: 1px solid var(--wl-line-color);
        &-title {
          color: var(--wl-text-color-title-1);
          font-size: 18px;
          font-weight: 500;
        }
      }
      .counts {
        &-item {
          padding: 24px 12px;
          position: relative;
          &-des {
            color: var(--wl-text-color-secondary-1);
            white-space: nowrap;
            font-size: 20px;
            margin-right: 4px;
            &-icon {
              width: 30px;
              height: 30px;
              object-fit: contain;
              vertical-align: bottom;
              margin-right: 4px;
            }
            .el-icon {
              margin-left: 6px;
              vertical-align: -3px;
            }
          }
          &-num {
            font-size: 36px;
            font-weight: 500;
          }
          & + .counts-item::after {
            content: "";
            display: block;
            position: absolute;
            top: 25%;
            left: 0;
            bottom: 25%;
            width: 1px;
            background-color: var(--wl-line-color);
          }
        }
      }
      :deep(.echart) {
        height: 300px;
      }
    }
    &-ranks {
      width: 0;
      flex: 7;
      .title {
        color: var(--wl-text-color-title-2);
        font-size: 18px;
        &::after {
          content: "";
          display: block;
          margin: 16px -24px 0;
          height: 0.5px;
          background-color: var(--wl-line-color);
        }
      }
      .rank-list {
        margin: 0 -24px -24px;
      }
    }
  }
  &-table {
    overflow: hidden;
    &-filter {
      padding: 0 0 12px 26px;
      .title {
        font-size: 18px;
        font-weight: 600;
        margin-right: 24px;
      }
    }
    &-pager {
      padding-top: 24px;
    }
  }
}
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
<style>
.friends-detail-dialog.el-dialog {
  border-radius: 12px;
}
</style>
