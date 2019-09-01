<template>
  <div id="bookstores">
    <div class="searchbar">
      <div class="searchbar-inner">
        <input
          v-model="searchValue"
          class="search-input"
          type="search"
          placeholder="搜索"
          @focus="()=>{showsearch()}"
        />
      </div>
      <div class="searchcancel" style="display: none" @click="()=>{cancel()}">取消</div>

      <div class="search-list">
        <div class="hotRank" v-show="showHot">
          <span>热搜榜</span>
          <transition-group>
            <li
              class="search-li"
              v-for="(item,i) in hotword"
              :key="item.book"
              @click="()=>{toBookInfo(item.book)}"
            >
              <div class="idx">{{i+1}}</div>
              <div class="word">{{item.word}}</div>
            </li>
          </transition-group>
        </div>
        <div class="search-result" v-show="!showHot">
          <li
            class="result-li"
            v-for="(item) in searchComplete"
            :key="item.book"
            @click="()=>{search(item)}"
          >{{item}}</li>
        </div>
      </div>
    </div>
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="item in storeSwipeImg" :key="item.id">
        <img :src="item.img" />
      </mt-swipe-item>
    </mt-swipe>

    <div class="nav">
      <div class="sort">
        <div>
          <img style="width: 50%;height: 50%" src="../assets/male.svg" />
        </div>
        <span>男生</span>
      </div>
      <div class="bargain">
        <div>
          <img style="width: 50%;height: 50%" src="../assets/womale.svg" />
        </div>
        <span>女生</span>
      </div>
      <div class="free">
        <div>
          <img style="width: 50%;height: 50%" src="../assets/press.svg" />
        </div>
        <span>出版</span>
      </div>
      <div class="press">
        <div>
          <img style="width: 50%;height: 50%" src="../assets/photo.svg" />
        </div>
        <span>漫画</span>
      </div>
    </div>
    <div style="padding: 0rem 0.8rem;">
      <store-item :books="free.books" :title="free.title">
        <div class="title" slot="title">限时优惠</div>
      </store-item>
      <store-item :books="gechang.books" :title="gechang.title">
        <div class="title" slot="title">歌唱祖国</div>
      </store-item>
      <store-item :books="xuexi.books" :title="xuexi.title">
        <div class="title" slot="title">学习祖国</div>
      </store-item>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { Swipe, SwipeItem } from "mint-ui";

import Vue from "vue";
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

import {
  getRecommendPageSlide,
  getSortdetail,
  getGCZG,
  getXXZG,
  getHotSearch,
  searchCom,
  searchByBookname
} from "../request.js";
import { getMsg } from "../request.js";

export default {
  data: function() {
    return {
      value: "搜索到的结果",
      storeSwipeImg: [],
      //书城限时免费
      free: {},
      //书城歌唱祖国
      gechang: {},
      //学习祖国
      xuexi: {},
      title: "",
      //搜索
      searchValue: "",
      //热门搜索
      hotword: [],
      //搜索界面是否显示热么搜索
      showHot: true,
      //搜索补齐结果
      searchComplete: []
    };
  },
  created() {
    this.getSlide();
    this.getFree();
    this.GCZG();
    this.XXZG();
  },
  mounted() {
    this.init();
  },
  components: {
    storeItem: require("../components/storeItem.vue").default
  },
  watch: {
    searchValue: function(nval, oval) {
      this.showHot = false;
      searchCom(nval).then(data => {
        // console.log(data);
        if (data.ok) {
          this.searchComplete = [];
          this.searchComplete = data.keywords;
        }
      });
    }
  },
  methods: {
    init() {
      $(".search-list").css("height", $(window).height() + "px");
      this.hotSearch();
    },
    //显示搜索界面
    showsearch() {
      this.showHot = true;
      this.$nextTick(() => {
        $(".searchcancel").show(100);
        $(".searchbar-inner").animate({ width: "80%" }, 100, function() {
          $(".search-list").slideDown(300);
        });
      });
    },
    //取消搜索
    cancel() {
      this.searchValue = "";
      $(".searchcancel").hide(100);
      $(".searchbar-inner").animate({ width: "100%" }, 100, function() {
        $(".search-list").slideUp(300);
      });
    },
    //搜索
    search(keyWord) {
      searchByBookname(keyWord).then(data => {
        if (data.ok) {
          this.toBookInfo(data.books[0]._id);
        } else {
          console.log("未找到该书");
        }
      });
    },
    //热门搜索
    hotSearch() {
      getHotSearch().then(({ newHotWords }) => {
        this.hotword = newHotWords;
      });
    },
    toBookInfo(id) {
      this.$store.commit("setCurBookId", id);
      this.$router.push("bookinfo");
    },
    //获取书城轮播图
    getSlide() {
      getRecommendPageSlide().then(data => {
        if (data.ok === true) {
          this.storeSwipeImg = data.data;
        }
      });
    },
    //获取限时优惠
    getFree() {
      getSortdetail("male", "都市").then(data => {
        this.free.title = "限时免费";
        data.books.forEach(item => {
          item.cover = "//statics.zhuishushenqi.com" + item.cover;
        });
        this.free.books = data.books;
      });
    },
    //获取歌唱祖国
    GCZG() {
      getGCZG().then(({ data }) => {
        this.gechang.title = data.title;
        this.gechang.books = data.books;
      });
    },
    //获取 学习祖国
    XXZG() {
      getXXZG().then(({ data }) => {
        this.xuexi.title = data.title;
        this.xuexi.books = data.books;
      });
    }
  }
};
</script>

<style scoped>
#bookstores {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}
#bookstores::-webkit-scrollbar {
  width: 0 !important;
}
#bookstores > div {
  flex-shrink: 0;
}

#bookstores .nav > div > div {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: linear-gradient(to right,#ffae00,#ff5f18);
}

.mint-swipe {
  margin: 3.5rem 0.6rem 0rem;
  height: 7.6rem;
}
.mint-swipe .mint-swipe-items-wrap {
  display: none;
}

.mint-swipe img {
  width: 100%;
  height: 100%;
}
.mint-swipe-indicator {
  background-color: #fff;
}
.searchbar {
  width: 100%;
  height: 3.5rem;
  display: flex;
  align-items: center;
  background-color: #fff;
  position: fixed;
  z-index: 2;
}
.searchbar-inner {
  margin: 0rem 0.8rem;
  box-sizing: border-box;
  width: 100%;
  height: 2.5rem;
  display: flex;
}

.search-input {
  width: 100%;
  height: 100%;
  padding: 0rem 1rem;
  background-color: #eee;
  border-radius: 0.5rem;
}
.searchcancel {
  flex: 1;
}
.search-list {
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;
  display: none;
  position: absolute;
  background-color: #fff;
  top: 3.4rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.search-list li {
  list-style: none;
  height: 3rem;
  display: flex;
  overflow: hidden;
  line-height: 3rem;
}

.search-list li:first-child .idx {
  color: red;
}

.search-list li:nth-child(2) .idx {
  color: orange;
}

.search-list li:nth-child(3) .idx {
  color: hotpink;
}

.search-list li .idx {
  width: 2rem;
  height: 3rem;
}
.search-list li .word {
  flex: 1;
  font-size: 1.1rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav {
  width: 100%;
  height: 8rem;
  display: flex;
}
.nav > div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.nav > div > div {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.book-item {
  width: 100%;
  height: 14rem;
  padding: 2rem 0rem;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eee;
}
.book-item .title {
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
}

.book-item .title .left {
  font-size: 1.5rem;
  font-weight: bold;
}

.book-item .books {
  width: 100%;
  flex: 1;
  overflow: auto;
  display: flex;
}

.book-item .books .book {
  width: 8rem;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.book-item .book .book-cover {
  width: 6rem;
  height: 9rem;
  border-radius: 0.5rem;
  background-color: skyblue;
}
</style>


