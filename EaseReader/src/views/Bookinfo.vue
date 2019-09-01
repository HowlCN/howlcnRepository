<template>
  <div id="bookinfo" ref="a">
    <div id="topHead" ref="topHead">
      <mt-header title="书籍详情" fixed>
        <router-link to="/sort" slot="left">
          <mt-button icon="back" @click="changeShow"></mt-button>
        </router-link>
      </mt-header>
    </div>
    <!-- 图书抬头 -->
    <div class="bookHeader">
      <img id="bookPhoto" :src="'http://statics.zhuishushenqi.com'+bookinfo.cover" />
      <div id="headRight">
        <p>{{bookinfo.title}}</p>
        <p id="author">{{bookinfo.author}}</p>
        <p>{{wordCount}}字 {{bookinfo.chaptersCount}}章</p>
      </div>
    </div>
    <!-- 图书简介 -->
    <div id="longIntro" class="active" ref="longIntro_r" @click="open">
      <div style="width: 100%;height:100%;overflow:hidden;">
        <P id="longIntro_p">{{bookinfo.longIntro}}</P>
      </div>
    </div>
    <div id="new">
      <span>最新章节</span>
      <span id="last">{{bookinfo.lastChapter}}</span>
    </div>
    <div id="comment" ref="comment">
      <van-swipe
        style="height: 200px;"
        :autoplay="4000"
        :loop="true"
        :duration="500"
        :show-indicators="false"
        vertical
      >
        <van-swipe-item v-for="(item,idx) in comment" :key="idx">
          <img :src="'http://statics.zhuishushenqi.com'+item.author.avatar" />
          <span id="nickname">{{item.author.nickname}}:</span>
          <br />
          <span class="content">{{item.content}}</span>
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="recommends">
      <div>{{this.recommendsShow?'同类型推荐':'本书暂无同类推荐'}}</div>
      <div class="recommend" v-if="recommendsShow" v-show="commendShow">
        <div class="rebook" v-for="(item,idx) in bookinfore" :key="idx">
          <div class="reImg">
            <div>
              <img
                :src="'http://statics.zhuishushenqi.com'+item.cover"
                alt="未找到"
                @click="toBookInfo(item._id)"
              />
            </div>
          </div>
          <span>{{item.title | Superfluous}}</span>
        </div>
      </div>
      <div id="replaces" v-if="recommendsShow" @click="replacebook">
        <span>换一批</span>
      </div>
    </div>
    <mt-tabbar>
      <mt-tab-item>
        <span @click="doBookrack" class="tab1" v-show="!inbookrack">加入书架</span>
        <span @click="doBookrack" class="tab1" v-show="inbookrack">移除书架</span>
      </mt-tab-item>
      <mt-tab-item id="tab2">
        <span id="nth2" @click="readThis">开始阅读</span>
      </mt-tab-item>
      <mt-tab-item>
        <span class="tab1">购买本书</span>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import { getRecommendInfo } from "@/request.js";
import { setTimeout } from "timers";
import Vue from "vue";
import { Header } from "mint-ui";
import { Button } from "mint-ui";
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
import {
  goGetBookinfo,
  getCommentInfo,
  getCommentImgUrl,
  isInBookshlef,
  addBook,
  removeBook
} from "@/request.js";
export default {
  data() {
    return {
      bookinfore: [],
      degs: 180,
      setTime: true,
      commendShow: true,
      scrollNum: 0,
      triangleShow: true,
      show: false,
      bookinfo: {},
      comment: [],
      commentImgUrl: {},
      //是否可以加入书架
      inbookrack: false,
      //是否显示同类推荐
      recommendsShow: true
    };
  },
  created() {
    this.getComment();
    this.getBookinfo();
    this.whatBookrack();
    console.log("xxxx");
    this.$store.commit("setNavShow", false);
    this.getRecommend();
  },
  filters: {
    //大于5个字的时候过滤掉后面的字，用...表示
    Superfluous: function(title) {
      if (title.length > 4) {
        title = title.slice(0, 5) + "...";
      }
      return title;
    }
  },
  methods: {
    readThis() {
      this.$store.commit("reverseShow");
    },
    getRecommend() {
      console.log(this.$store.state.chapterIdx,'getRecommend');
      let self = this;
      getRecommendInfo(self.$store.state.curBookId).then(data => {
        if (data.ok) {
          if (data.books.length > 6) {
            self.bookinfore = self.getRandomArrayElements(data.books, 6);
          } else if (data.books.length == 0) {
            this.recommendsShow = false;
          } else {
            self.bookinfore = data.books;
          }
        }
      });
    },
    replacebook() {
      console.log(this.$store.state.chapterIdx,'replacebook');
      if (this.setTime) {
        this.commendShow = false;
        setTimeout(() => {
          this.commendShow = !this.commendShow;
        }, 200);
        this.getRecommend();
        this.setTime = false;
        setTimeout(data => {
          this.setTime = !this.setTime;
        }, 2000);
      }
    },
    toBookInfo(id) {
      this.$store.commit("setCurBookId", id);
      this.getComment();
      this.getBookinfo();
    },
    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },

    /******** */

    getBookinfo() {
      console.log(this.$store.state.chapterIdx,'getBookinfo');
      let self = this;
      goGetBookinfo(self.$store.state.curBookId).then(data => {
        self.bookinfo = data;
        const longIntro_p = data.longIntro.length;
        if (longIntro_p < 100) {
          self.triangleShow = false;
        }
      });
    },
    changeShow() {
      this.$store.commit("setNavShow", true);
      this.$router.go(-1);
    },
    open() {
      //如果简介字数太短，那么点击下拉则不执行
      if (this.triangleShow == false) {
        return;
      }
      //点击下拉显示全部简介
      this.infoShow = !this.infoShow;
      const triangleCss = this.$refs.triangle;
      if (this.infoShow == false) {
        this.$refs.longIntro_r.className = "active";
      } else {
        this.$refs.longIntro_r.className = "active2";
      }
    },
    getComment() {
      console.log(this.$store.state.chapterIdx,'getComment');
      let self = this;
      getCommentInfo(self.$store.state.curBookId).then(data => {
        if (data.total != 0 && data.total != 1 && data.total != 2) {
          self.comment = data.reviews;
        } else {
          const noComment = self.$refs.comment;
          noComment.style.height = 2 + "rem";
          noComment.style.fontSize = 1 + "rem";
          noComment.innerHTML =
            "<div style='text-align:center'>" + "本书暂无评论哦" + "</div>";
        }
      });
    },
    //判断书是否已经在书架中
    whatBookrack() {
      console.log(this.$store.state.chapterIdx,'whatBookrack1');
      let self = this;
      console.log();
      isInBookshlef(self.$store.state.userId, self.$store.state.curBookId).then(
        data => {
          if (data.ok) {
            self.$store.commit("setBook", data.chaptersCount, data.chapterIdx);
            this.inbookrack = true;
          } else {
            self.$store.commit("setBook", data.chaptersCount, 0);
            this.inbookrack = false;
          }
        }
      );
      console.log(this.$store.state.chapterIdx,'whatBookrack2');
    },
    //点击事件，若在，页面显示"移除书架"，点击会移除，若不在，页面显示"加入书架"，点击会加入
    doBookrack() {
      // 在书架中
      let self = this;
      if (this.inbookrack) {
        removeBook(this.$store.state.userId, this.$store.state.curBookId).then(
          data => {
            self.whatBookrack();
          }
        );
      }
      //添加入书架
      else {
        console.log(this.$store.state.chapterIdx, "xxxxxxx");
        addBook(
          this.$store.state.userId,
          this.$store.state.curBookId,
          this.bookinfo.cover,
          this.bookinfo.title,
          this.bookinfo.author,
          this.$store.state.length,
          this.$store.state.chapterIdx
        ).then(data => {
          self.whatBookrack();
        });
      }
    }
  },
  computed: {
    wordCount() {
      return this.bookinfo.wordCount > 1000
        ? parseInt(this.bookinfo.wordCount / 10000) + "万"
        : this.bookinfo.wordCount;
    }
  },
  components: {
    // Recommend 修改
  }
};
</script>

<style scoped>
#bookinfo {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(240, 240, 240);
}
#topHead img {
  position: absolute;
  top: 0.6rem;
  right: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
}
#topHead #bookTitle {
  text-align: center;
  width: 60%;
  position: absolute;
  top: 1rem;
  left: 4.5rem;
  font-size: 1rem;
  z-index: 4;
  overflow: hidden;
}
.mint-header {
  color: black;
  background-color: rgb(247, 239, 239);
  height: 3rem;
}
.mint-tabbar {
  background-color: #fff;
  line-height: 1.8rem;
}
.mint-tab-item {
  height: 1.8rem;
  background-color: #fff !important;
}

.mint-tab-item:nth-child(2) {
  color: white;
}
.mint-tab-item .tab1 {
  color: black;
  font-size: 16px;
  line-height: 2rem;
  padding: 0.5rem 1.6rem;
}
div .mint-tab-item #nth2 {
  border-radius: 1rem;
  background-color: rgb(198, 85, 82);
  font-size: 16px;
  line-height: 2rem;
  padding: 0.5rem 1.6rem;
}
.bookHeader {
  width: 100%;
  height: 10rem;
  position: relative;
  margin-top: 3rem;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  background-color: rgb(247, 239, 239);
}
.bookHeader #headRight {
  margin-left: 2rem;
}
.bookHeader #headRight p:nth-child(1) {
  font-size: 1rem;
  margin: 1rem 0rem;
  color: black;
}
.bookHeader #headRight p:nth-child(2) {
  font-size: 14px;
  margin: 1.2rem 0rem;
  color: #ff5f18;
}
.bookHeader #headRight p:nth-child(3) {
  font-size: 16px;
  margin: 1rem 0rem;
  color: gray;
}
.bookHeader #bookPhoto {
  width: 6rem;
  border-radius: 10%;
  height: 8rem;
}
#longIntro {
  margin-top: 0.6rem;
  padding: 0.6rem 1rem;
  position: relative;
  box-sizing: border-box;
  transition: all 1s;
  background-color: #fff;
}
#longIntro p {
  color: black;
}
.active {
  overflow: hidden;
  width: 100%;
  height: 5.2rem;
}
.active2 {
  overflow: hidden;
  width: 100%;
  height: auto;
}

#longIntro img {
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4) inset;
}
#longIntro img {
  border-radius: 50%;
  position: absolute;
  width: 1.6rem;
  height: 1.6rem;
  transition: all 0.3s;
  right: 1rem;
  bottom: 0.2rem;
}
#new span {
  font-size: 1rem;
}
#new {
  margin-top: 0.6rem;
  padding: 0rem 1rem;
  overflow: hidden;
  height: 2.5rem;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
}
#new #last {
  margin-left: 1rem;
  font-size: 0.9rem;
  color: gray;
}
#new #lasttwo {
  font-size: 0.9rem;
  color: black;
}

#new img {
  margin: auto 1rem;
  width: 1rem;
  height: 1rem;
}
.uls li {
  text-align: center;
  width: 33%;
  list-style: none;
  float: left;
}
.uls li .change {
  color: black;
  text-align: center;
  font-size: 1.2rem;
}
#comment {
  margin-top: 0.6rem;
  padding: 0.6rem 0;
  overflow: hidden;
  width: 100%;
  height: 7rem;
  background-color: #fff;
}
#comment img {
  float: left;
  margin: 1rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
}
#comment #nickname {
  color: #ff5f18;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}
#comment span {
  font-family: "小篆";
  font-size: 0.8rem;
}
#comment .content {
  height: 6rem;
  padding-right: 1rem;
  display: block;
  overflow: hidden;
}
.all {
  color: rgb(198, 85, 82);
  line-height: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 0.8rem;
}

/*******/

.my-enter-active {
  animation: flipInX 2.5s ease;
}
@keyframes flipInX {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  to {
    transform: perspective(400px);
    transform: perspective(400px);
  }
}

.recommends {
  margin: 0.6rem 0rem 4rem 0rem;
  position: relative;
  padding: 0.6rem 1rem;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
}
.recommends>div {
  text-align: center;
}
.recommend {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  width: 100%;
  height: 16rem;
}
.rebook {
  text-align: center;
  margin: 0.1rem 0.3rem 0rem 0.2rem;
  display: inline-block;
  width: 31%;
  height: 48%;
}
.rebook img {
  margin: 0.4rem auto 0.5rem auto;
  width: 4rem;
  height: 5rem;
}

#replaces {
  display: flex;
  justify-content: center;
}
#replaces img {
  position: absolute;
  left: 3.3rem;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  z-index: 5;
}
</style>