import Vue from "vue";
import Router from "vue-router";
import Bookshelf from "./views/Bookshelf.vue";
import Bookstores from "./views/Bookstores.vue";
import Bookrank from "./views/Bookrank.vue";
import Account from "./views/Account.vue";
import Bookinfo from "./views/Bookinfo.vue";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: Bookshelf
    },
    //书架
    {
      path: "/bookshelf",
      component: Bookshelf
    },
    //书城
    {
      path: "/bookstores",
      component: Bookstores
    },
    //排行榜
    {
      path: "/bookrank",
      component: Bookrank
    },
    //账户
    {
      path: "/account",
      component: Account
    },
    //书籍详情
    {
      path: "/bookinfo",
      name: "bookinfo",
      component: Bookinfo
    }
  ]
});
