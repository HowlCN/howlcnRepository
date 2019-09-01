<template>
  <div id="sort">
    <van-tabs v-model="active" sticky @change="changeTop($event)">
      <van-tab title="出版">
        <van-sidebar @change="changeTab($event)" v-model="activeKey">
          <van-sidebar-item
            v-for="item in booksortpress"
            :key="item._id"
            :title="item.major"
            change
          />
        </van-sidebar>
        <div class="sortdetail">
          <div class="sortscroll">
            <van-card
              v-for="item in bookinfo"
              :title="item.title"
              :bookId="item._id"
              :key="item._id"
              :desc="item.shortIntro"
              :thumb="'http://statics.zhuishushenqi.com'+item.cover"
              @click="toBookInfo(item._id)"
            />
          </div>
        </div>
      </van-tab>
      <van-tab title="男生">
        <van-sidebar v-model="activeKey" @change="changeTab($event)">
          <van-sidebar-item v-for="item in booksortmale" :key="item._id" :title="item.major" />
        </van-sidebar>
        <div class="sortdetail">
          <div class="sortscroll">
            <van-card
              v-for="item in bookinfo"
              :title="item.title"
              :bookId="item._id"
              :key="item._id"
              :desc="item.shortIntro"
              :thumb="'http://statics.zhuishushenqi.com'+item.cover"
              @click="toBookInfo(item._id)"
            />
          </div>
        </div>
      </van-tab>
      <van-tab title="女生">
        <van-sidebar v-model="activeKey" @change="changeTab($event)">
          <van-sidebar-item v-for="item in booksortfemale" :key="item._id" :title="item.major" />
        </van-sidebar>
        <div class="sortdetail">
          <div class="sortscroll">
            <van-card
              v-for="item in bookinfo"
              :title="item.title"
              :bookId="item._id"
              :key="item._id"
              :desc="item.shortIntro"
              :thumb="'http://statics.zhuishushenqi.com'+item.cover"
              @click="toBookInfo(item._id)"
            />
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getSortListBooks, getSortdetail } from "../request.js";
import { Tab, Tabs, Sidebar, SidebarItem } from "vant";
export default {
  data() {
    return {
      active: 0,
      activeKey: 0,
      booksortpress: [],
      booksortmale: [],
      booksortfemale: [],
      sortname: [],
      top: "press",
      tap: "",
      bookinfo: []
    };
  },
  created() {
    this.getSort();
  },

  methods: {
    toBookInfo(id) {
      this.$store.commit("setCurBookId", id);
      this.$router.push("bookinfo");
    },
    getSort() {
      getSortListBooks().then(data => {
        if (data.ok === true) {
          this.booksortpress = data.press;
          this.booksortmale = data.male;
          this.booksortfemale = data.female;
          this.changeTop(0);
          this.changeTab(0);
        }
      });
    },
    getsortpress() {
      getSortdetail("press", this.tap).then(data => {});
    },
    changeTop(e) {
      if (e == 0) {
        this.top = "press";
        this.tap = "出版小说";
        this.changeTab(0);
      } else if (e == 1) {
        this.top = "male";
        this.tap = "玄幻";
        this.changeTab(0);
      } else {
        this.top = "female";
        this.tap = "古代言情";
        this.changeTab(0);
      }
    },
    changeTab(e) {
      if (this.top == "press") {
        getSortdetail("press", this.booksortpress[e].major).then(data => {
          this.bookinfo = data.books;
        });
      } else if (this.top == "male") {
        this.tab = this.booksortmale[e].major;
        getSortdetail("male", this.booksortmale[e].major).then(data => {
          this.bookinfo = data.books;
        });
      } else {
        this.tab = this.booksortfemale[e].major;
        getSortdetail("female", this.booksortfemale[e].major).then(data => {
          this.bookinfo = data.books;
        });
      }
    }
  }
};
</script>

<style>
#sort {
  width: 100%;
  height: 100%;
}
#sort .van-tabs {
  display: flex;
  flex-direction: column;
}

#sort .van-tabs__content {
  flex: 1;
  height: 80%;
}
#sort .van-tabs,
.van-tab__pane {
  width: 100%;
  height: 100%;
  position: relative;
}

#sort .van-tabs .van-tab__pane > div {
  height: 100%;
}
#sort .van-sidebar-item--select {
  font-weight: 500;
  border-color: #ff5f18;
  background-color: #fff;
}
#sort .sortdetail {
  width: 18rem;
  box-sizing: border-box;
  margin: 0rem 0rem 3.2rem 5.4rem;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}
#sort .sortdetail .sortscroll {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
#sort .van-sidebar::-webkit-scrollbar {
  width: 0 !important;
}

van-card {
  display: inline-block;
}
#sort .van-sidebar {
  display: inline-block;
  overflow: auto;
}
#sort .van-tabs__line {
  background-image: linear-gradient(to right, #ff9704, #ff6119) !important;
}
#sort .van-sidebar-item--select {
  color: #323233;
  font-weight: 500;
  border-color: #ff6119 !important;
  background-color: #fff;
}
</style>