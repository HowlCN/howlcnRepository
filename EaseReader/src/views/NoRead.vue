<template>
  <div id="noRead">
    <!-- 切换框 -->
    <div id="board" @click="test">
      <router-view></router-view>
    </div>
    <!-- 导航 -->
    <div id="nav" v-show="this.$store.state.navShow">
      <mt-tabbar v-model="selected">
        <mt-tab-item id="tab1">
          <router-link tag="div" to="/bookshelf" class="book_nav book_nav1">
            <img src="../assets/bookshelf.png" />
            <div>书架</div>
          </router-link>
        </mt-tab-item>
        <mt-tab-item id="tab2">
          <router-link tag="div" to="/bookstores" class="book_nav book_nav2">
            <img src="../assets/bookstore.png" />
            <div>书城</div>
          </router-link>
        </mt-tab-item>
        <mt-tab-item id="tab3">
          <router-link tag="div" to="/bookrank" class="book_nav book_nav3">
            <img src="../assets/rank.png" />
            <div>榜单</div>
          </router-link>
        </mt-tab-item>
        <mt-tab-item id="tab4">
          <router-link tag="div" to="/account" class="book_nav book_nav4">
            <img src="../assets/count.png" />
            <div>我的</div>
          </router-link>
        </mt-tab-item>
      </mt-tabbar>
    </div>
    <!-- 登录 -->
    <login v-if="this.$store.state.showLogin"></login>
    <!-- 资料编辑 -->
    <edit v-if="this.$store.state.showEdit"></edit>
  </div>
</template>

<script>
//按需导入tarbar

import { Tabbar, TabItem } from "mint-ui";
import Vue from "vue";
import axios from "axios";
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);

export default {
  data: function() {
    return {
      selected: ""
    };
  },
  props: ["tName"],
  methods: {
    test() {
      this.isBack = !this.isBack;
    }
  },
  components: {
    login: require("../views/Login.vue").default,
    edit: require("../views/Edit.vue").default
  },
  watch: {
    isBack: function() {
      this.isBack = !this.isBack;
    }
  }
};
</script>

<style scoped>
#noRead {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
/* 展示板样式 开始 */
#board {
  flex: 1;
  overflow: hidden;
}

/* 展示板样式 结束 */

/* 底部导航 开始 */
#nav {
  width: 100%;
  height: 3.2rem;
  display: flex;
}
#nav .book_nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#nav .book_nav > div {
  font-size: 0.6rem;
}

#nav .book_nav > img {
  height: 1.8rem;
  width: 1.8rem;
}
</style>


