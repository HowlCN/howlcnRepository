<template>
  <div id="app">
    <transition :name="transitionName">
      <read v-if="$store.state.show"  :isBack.sync="isBack"></read>
      <noread v-else :tName="transitionName"></noread>
    </transition>
  </div>
</template>

<script>
import "./store.js";
import Read from "./views/Read.vue";

export default {
  data: function() {
    return {
      //动画切换方式
      transitionName: "slide-left",
      // 是否是返回按钮
      isBack: false
    };
  },
  components: {
    noread: require("./views/NoRead.vue").default,
    read: require("./views/Read.vue").default
  },
  watch: {
    $route(to, from) {
      // 不执行动画的路由
      var excludeArr = [
        "/",
        "/bookshelf",
        "/bookstores",
        "/bookrank",
        "/account"
      ];
      // console.log(to,from)
      // to  from 是路由对象 包括元数据等
      if (this.isBack) {
        this.transitionName = "slide-right";
      } else {
        if (excludeArr.includes(to.path) && excludeArr.includes(from.path)) {
          this.transitionName = "";
        } else {
          this.transitionName = "slide-left";
        }
      }
    }
    // "$route.path": function(newVal, oldVal) {
    //   // console.log(newVal, oldVal);
    // }
  }
};
</script>


<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
