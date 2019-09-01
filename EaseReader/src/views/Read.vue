<template>
  <div id="read" ref="read" :style="{'color': color}">
    <transition name="h">
      <header id="header" v-show="show" :style="{'background-color':themeColor}">
        <div class="header-left">
          <button @click="back()" :style="{'backgroundColor':themeColor,'color': color}">
            <i class="mint-toast-icon mintui mintui-back"></i>
          </button>
        </div>
        <div class="header-right"></div>
      </header>
    </transition>
    <div class="reader" ref="reader" :style="{'background-color':backgroundColor}">
      <div class="chapterName">{{chapterContent.title}}</div>
      <div class="content" @click="contentClick($event)" ref="content">
        <h3 class="chapterTitle">{{chapterContent.title}}</h3>
        <div
          class="chapterText"
          ref="chapterText"
          :class="['fontSize-'+fontSize,'fontStyle-'+fontStyle]"
        >
          <p v-for="(item,i) in chapterContent.body" :key="i">{{item}}</p>
        </div>
      </div>
      <div class="chapterMsg"></div>
    </div>
    <transition name="n">
      <nav class="nav" v-show="show" :style="{'backgroundColor':themeColor}">
        <div class="drawer_btn" @click="[nav_tab=nav_tab=='drawer'?'':'drawer',show=!show]"></div>
        <div class="progress_btn" @click="nav_tab=nav_tab=='progress'?'':'progress'"></div>
        <div class="theme_btn" @click="nav_tab=nav_tab=='theme'?'':'theme'"></div>
        <div class="music_btn" @click="nav_tab=nav_tab=='music'?'':'music'">
          <div id="musicAnimate">
            <div :class="play?'A':''"></div>
            <div :class="play?'B':''"></div>
            <div :class="play?'C':''"></div>
            <div :class="play?'D':''"></div>
          </div>
        </div>
      </nav>
    </transition>
    <transition name="t_d" mode="out-in">
      <!-- 抽屉 -->
      <div class="tab drawer" key="drawer" v-if="nav_tab==='drawer'">
        <div class="drawer_inner1" :style="{'backgroundColor':themeColor}">
          <div class="drawer_top">
            <div class="top_img">
              <img :src="'http://statics.zhuishushenqi.com'+curBook.cover" alt />
            </div>
            <div class="top_detail">
              <div>
                <div class="top_bookName">{{curBook.bookName}}</div>
                <div class="top_bookAuthor">{{curBook.author}}</div>
              </div>
              <div class="top_bookNum">共23章 已读 1.2%</div>
            </div>
          </div>
          <div class="drawer_item" v-for="(item,i) in list" :key="i">
            <div class="item_name" @click="readThis(i)">{{item.title}}</div>
          </div>
        </div>
        <div class="drawer_inner2" @click="nav_tab=''"></div>
      </div>
    </transition>
    <transition name="t" mode="out-in">
      <!-- 进度控制 -->
      <div
        class="tab progress"
        key="progress"
        v-show="show && nav_tab==='progress'"
        :style="{'backgroundColor':themeColor}"
      >
        <!-- 进度条 -->
        <div class="progress_item progressLine">
          <div class="progress_left" @click="textPre">《</div>
          <div class="progress_mid" ref="progress_mid">
            <mt-range v-model="curChapterIdx" :min="1" :max="list.length" :step="1" :bar-height="2"></mt-range>
          </div>
          <div class="progress_right" @click="textNext">》</div>
        </div>
        <!-- 显示当前章节名 -->
        <div class="progress_item curSections">
          第
          <input class="search_section" type="text" v-model="curChapterIdx" />章&nbsp;
          <span>{{chapterContent.title | getTitleName}}</span>
        </div>
      </div>
    </transition>
    <transition name="t" mode="out-in">
      <!-- 主题 -->
      <div
        class="tab theme"
        key="theme"
        v-show="show && nav_tab==='theme'"
        :style="{'backgroundColor':themeColor}"
      >
        <div class="theme_item light">
          <div>亮度:</div>
          <div class="light_controller">
            <mt-range v-model="light" :min="1" :max="100" :step="1" :bar-height="2"></mt-range>
          </div>
        </div>
        <div class="theme_item color">
          <div>背景:</div>
          <div class="color-inner">
            <div
              :class="bcgBtnIdx==0?'color_item color1 active':'color_item color1'"
              @click="[backgroundColor='#f7f7f9',themeColor='#fcfcfc',bcgBtnIdx=0,color='#000000']"
            ></div>
            <div
              :class="bcgBtnIdx==1?'color_item color2 active':'color_item color2'"
              @click="[backgroundColor='#f6eed9',themeColor='#fdf4e3',bcgBtnIdx=1,color='#000000']"
            ></div>
            <div
              :class="bcgBtnIdx==2?'color_item color3 active':'color_item color3'"
              @click="[backgroundColor='#c0edc6',themeColor='#caefcd',bcgBtnIdx=2,color='#000000']"
            ></div>
            <div
              :class="bcgBtnIdx==3?'color_item color4 active':'color_item color4'"
              @click="[backgroundColor='#010101',themeColor='#1b1b1b',bcgBtnIdx=3,color='#aeaeae']"
            ></div>
          </div>
        </div>
        <div class="theme_item fontsize">
          <div>字号:</div>
          <div class="fontsize-inner">
            <mt-range v-model="fontSize" :min="1" :max="5" :step="1" :bar-height="2"></mt-range>
          </div>
        </div>
        <div class="theme_item fontFam">
          <div>字体:</div>
            <div class="fontFam-inner">
              <div v-show="fontShow" @click="fontShow=false">{{fontStyle | toChinese}}></div>
              <div class="font-more" v-show="!fontShow">
                <div @click="fontShow=true;fontStyle='yahei'" :class="fontStyle=='yahei'?'active':''">微软雅黑</div>
                <div @click="fontShow=true;fontStyle='kaiti'" :class="fontStyle=='kaiti'?'active':''">楷体</div>
                <div @click="fontShow=true;fontStyle='songti'" :class="fontStyle=='songti'?'active':''">宋体</div>
              </div>
            </div>
        </div>
        <!-- <div class="flip">
          <div>翻页:</div>
          <div class="flip-inner">
            <div>仿真</div>
            <div>覆盖</div>
            <div>无</div>
          </div>
        </div> -->
      </div>
    </transition>
    <transition name="t" mode="out-in">
      <!-- 音乐 -->
      <div
        class="tab music"
        key="music"
        v-show="show && nav_tab==='music'"
        :style="{'backgroundColor':themeColor}"
      >
        <div class="music_inner">
          <div class="music_detail">
            <div class="music_cover">
              <div :class="['cover_inner',play?'active':'']">
                <img :src="musicCover" style="width: 100%; height: 100%;" />
              </div>
            </div>
            <div class="music_msg">
              <div class="music_name">{{musicName}}</div>
              <div class="music_author">{{musicAuthor}}</div>
            </div>
          </div>
          <div class="music_progress">
            <div class="music_progress_inner">
              <mt-range
                v-model="musicTimeNow"
                :min="1"
                :max="musicTime"
                :step="1"
                :bar-height="2"
                @change="setcurTime($event)"
              ></mt-range>
            </div>
          </div>
          <div class="music_controller">
            <div>
              <div class="music_per" @click="musicPre"></div>
              <div :class="['music_play',play?'pause':'play']" @click="isplay();changePlay()"></div>
              <div class="music_next" @click="musicNext"></div>
            </div>
          </div>
        </div>
        <audio ref="audio"></audio>
      </div>
    </transition>
  </div>
</template>

<script>
//引入mint-ui组件
import { Range } from "mint-ui";
import Vue from "vue";
Vue.component(Range.name, Range);
import $ from 'jquery'
import "../store.js";
import {
  getBookChapters,
  getBookChaptersList,
  booksMsg,
  booksATOC,
  booksBTOC,
  bookContent,
  musicData,
  musicListDetail,
  musicDetail,
  musicUrl,
  setBookProgress
} from "../request.js";
export default {
  data: function() {
    return {
      //上下导航栏现视控制
      show: false,
      //下导航栏菜单控制
      nav_tab: "",
      //亮度
      light: 0,
      //背景色按钮激活设置
      bcgBtnIdx: 0,
      //阅读界面背景色控制
      backgroundColor: "#ffffff",
      // 文字颜色
      color: "#000",
      //字体大小
      fontSize: 3,
      //字体风格
      fontStyle: "yahei",
      //是否显示字体选择项
      fontShow: true,
      //章节大纲
      list: [],
      //当前在读书籍
      curBook: {},
      //章节内容
      chapterContent: {},
      //当前章节序号
      curChapterIdx: 1,
      //亮度
      light: 0,
      //主题颜色
      themeColor: "#fff",
      //界面大小
      screenSize: {},
      //音乐是否播放
      play: false,
      //音乐列表
      musicList: [],
      //当前歌曲索引
      musicIdx: 1,
      // 当前音乐封面url
      musicCover: "",
      //音乐名
      musicName: "",
      //音乐作者
      musicAuthor: "",
      //歌曲时长
      musicTime: 0,
      //已播放时间
      musicTimeNow: 0
    };
  },
  props: ["isBack"],
  components: {},
  created() {
    this.getBookMsg();
    this.getChapters();
    this.getMusic();
  },
  mounted() {
    this.screenSize.width = this.$refs.read.offsetWidth;
    this.screenSize.height = this.$refs.read.offsetHeight;
    this.musicPlayedTime = this.$refs.audio.duration;
    //监听进度条 获取已播放时长
    this.addEventListeners();
  },
  beforeDestroyed() {
    this.removeEventListeners();
  },
  filters: {
    // 过滤器 去除 '第x章'
    getTitleName(title = "") {
      return title.split(" ")[1];
    },
    toChinese(fontStyle) {
      if (fontStyle == "yahei") return "微软雅黑";
      else if (fontStyle == "kaiti") return "楷体";
      else if (fontStyle == "songti") return "宋体";
    }
  },
  watch: {
    curChapterIdx: function(nval, oval) {
      this.readThis(nval);
    },
    //监听音乐列表
    musicList: function() {
      this.playMusic(this.musicIdx);
      this.getMusicTime(this.musicIdx);
    },
    musicIdx: function() {
      this.playMusic(this.musicIdx);
    },
    //监听播放状态
    play: function(nval, oval) {
      if (nval) {
        this.setplay();
        //给播放按钮添加样式
        this.ClassForMB('add');
      } else {
        this.setpause();
        this.ClassForMB('remove');
      }
    },
    //每当封面改变时，则将进度条置零
    musicCover: function() {
      this.musicTimeNow = 0;
    }
  },
  methods: {
    setcurTime(e) {
      this.$refs.audio.currentTime = e;
    },
    ClassForMB(type){
      if(type == 'add'){
        $('.music_inner .mt-range-thumb').addClass('active');
      }else{
        $('.music_inner .mt-range-thumb').removeClass('active');
      }
    },
    //点击文章判断：显示控制栏 或 上一章 或 下一章
    contentClick(e) {
      if (e.x <= this.screenSize.width / 3) {
        this.textPre();
        return;
      } else if (e.x > (this.screenSize.width / 3) * 2) {
        this.textNext();
        return;
      } else {
        this.show = !this.show;
        this.nav_tab = this.nav_tab == "" ? this.nav_tab : "";
      }
    },
    back() {
      setBookProgress(this.$store.state.userId,this.$store.state.curBookId,this.list.length,this.curChapterIdx).then((data)=>{
        console.log(data);
      });
      this.$store.commit('setBook',this.list.length,this.curChapterIdx);
      this.$store.commit("reverseShow");
    },
    // 获取书籍信息
    getBookMsg() {
      booksMsg(this.$store.state.curBookId).then(data => {
        this.curBook.id = data.title;
        this.curBook.bookName = data.title;
        this.curBook.author = data.author;
        this.curBook.cover = data.cover;
      });
    },
    // 根据当前书籍id加载书籍内容
    getChapters() {
      booksBTOC(this.$store.state.curBookId).then(data => {
        if (data.length > 0) {
          getBookChaptersList(data[0]._id, "btoc").then(({ chapters }) => {
            this.list = chapters;
            this.curChapterIdx = Math.floor(this.$store.state.progress/100*this.list.length);
            this.readThis(this.curChapterIdx);
          });
        } else {
          booksATOC(this.$store.state.curBookId).then(data => {
            if (data.length > this.curChapterIdx) {
              getBookChaptersList(data[0]._id, "atoc").then(data => {
                this.list = chapters;
                this.curChapterIdx = Math.floor(this.$store.state.progress/100*this.list.length);
                this.readThis(this.curChapterIdx);
              });
            } else {
              console.log("没有数据");
            }
          });
        }
      });
    },
    //根据当前章节序号获取章节内容
    readThis(i) {
      this.curChapterIdx = i;
      bookContent(this.list[i].link).then(data => {
        if (data.ok) {
          this.chapterContent.title = data.chapter.title;
          if (data.chapter.isVip) {
            this.chapterContent.body = "VIP章节，请氪金！";
          } else {
            this.chapterContent.body = data.chapter.cpContent.split("\r\n");
          }
          //强制刷新页面，使其重新渲染
          this.$forceUpdate();
        }
      });
    },
    //文章换页
    textPre() {
      if (this.curChapterIdx > 0) {
        this.curChapterIdx--;
        this.readThis(this.curChapterIdx);
        this.$refs.content.scrollTop = 0;
      }
    },
    textNext() {
      if (this.curChapterIdx < this.list.length - 1) {
        this.curChapterIdx++;
        this.readThis(this.curChapterIdx);
        this.$refs.content.scrollTop = 0;
      }
    },
    //获取音乐资源
    getMusic() {
      musicData().then(({ playlists }) => {
        var idx = Math.floor(Math.random() * 10);
        musicListDetail(playlists[idx].id).then(data => {
          this.musicList = data.playlist.tracks;
        });
      });
    },
    // 通过idx 获取当前歌曲时长
    getMusicTime(idx) {
      musicDetail(this.musicList[idx].id).then(({ songs }) => {
        this.musicTime = parseInt(songs[0].dt / 1000);
      });
    },
    //改变播放状态
    changePlay() {
      this.play = !this.play;
    },
    //播放 与 暂停
    setplay() {
      this.$refs.audio.play();
    },
    setpause() {
      this.$refs.audio.pause();
    },
    isplay() {
      this.play ? this.setplay() : this.setpause();
    },
    // 通过id控制播放歌曲 改变audio的url 进而触发监听事件
    playMusic(idx) {
      musicUrl(this.musicList[idx].id).then(data => {
        this.musicCover = this.musicList[idx].al.picUrl;
        this.musicAuthor = this.musicList[idx].ar[0].name;
        this.musicName = this.musicList[idx].name;
        if (data.code == 200) {
          this.$refs.audio.src = data.data[0].url;
          this.$nextTick(() => {
            this.isplay();
          });
        }
      });
    },
    //音乐切换
    musicPre() {
      if (this.musicIdx > 0) {
        this.musicIdx--;
      } else {
        this.musicIdx = this.musicList.length - 1;
      }
    },
    musicNext() {
      if (this.musicIdx < this.musicList.length - 1) {
        this.musicIdx++;
      } else {
        this.musicIdx = 0;
      }
    },
    addEventListeners: function() {
      const self = this;
      self.$refs.audio.addEventListener("timeupdate", self._currentTime);
    },
    removeEventListeners: function() {
      const self = this;
      self.$refs.audio.removeEventListener("timeupdate", self._currentTime);
    },
    //获取已播放时长
    _currentTime: function() {
      const self = this;
      self.musicTimeNow = parseInt(self.$refs.audio.currentTime);
    }
  }
};
</script>

<style>
/* 进度条公共样式 */
.mt-range {
  width: 100%;
}
.mt-range-content {
  margin-right: 0rem !important;
  position: relative;
}

.mt-range-runway {
  right: 0 !important;
}
.mt-range-progress {
  background-color: #ff5f18 !important;
}
.mt-range-thumb {
  width: 0.8rem !important;
  height: 0.8rem !important;
  top: 50% !important;
  transform: translate(0%, -50%);
}

#read {
  width: 100%;
  height: 100%;
}

#header {
  width: 100%;
  height: 2.5rem;
  display: flex;
  border-bottom: 1px solid #999;
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 1;
  top: 0;
}
#read > .reader {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
#read > .reader .chapterName {
  /* width: 100%; */
  height: 2rem;
  padding-left: 1rem;
  line-height: 2rem;
  font-size: 0.8rem;
}
#read > .reader .content {
  flex: 1;
  padding: 1rem;
  box-sizing: border-box;
  overflow: scroll;
}

#read .content .chapterTitle {
  width: 100%;
  height: 5rem;
  line-height: 5rem;
  font-size: 1.5rem;
}

/* 字体大小预设样式 */
#read .fontSize-1 {
  font-size: 0.6rem;
  text-indent: 2em;
  letter-spacing: 0.2rem;
  line-height: 1.2rem;
}

#read .fontSize-2 {
  font-size: 0.8rem;
  text-indent: 2em;
  letter-spacing: 0.2rem;
  line-height: 1.8rem;
}

#read .fontSize-3 {
  font-size: 1rem;
  text-indent: 2em;
  letter-spacing: 0.2rem;
  line-height: 1.8rem;
}

#read .fontSize-4 {
  font-size: 1.2rem;
  text-indent: 2em;
  letter-spacing: 0.2rem;
  line-height: 1.8rem;
}

#read .fontSize-5 {
  font-size: 1.4rem;
  text-indent: 2em;
  letter-spacing: 0.2rem;
  line-height: 1.9rem;
}
/* 字体预设样式 */
#read .fontStyle-yahei {
  font-family: "微软雅黑";
}
#read .fontStyle-kaiti {
  font-family: "楷体";
}

#read .fontStyle-songti {
  font-family: "宋体";
}

#read .chapterText > p {
  margin-bottom: 0.3rem;
}
#controller {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
}
#controller .controller-mid {
  flex: 1;
  display: flex;
}

#controller .controller-mid > div {
  flex: 1;
}

body > div > header > div {
  flex: 1;
  height: 100%;
}

#read .nav {
  width: 100%;
  height: 2.5rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  display: flex;
  border-top: 1px solid #999;
  justify-content: space-around;
  z-index: 1;
}
#read .nav > div {
  width: 2rem;
  display: flex;
  align-items: center;
}

#read .tab {
  width: 100%;
  position: fixed;
  bottom: 2.5rem;
  left: 0;
}

.header-left > button {
  display: block;
  margin-left: 0.5rem;
  width: 2rem;
  height: 100%;
  background-color: #fff;
  line-height: 100%;
}

.drawer_btn {
  background: url(../assets/nav_A_01.svg) no-repeat center;
  background-size: cover;
}

.progress_btn {
  background: url(../assets/nav_A_02.svg) no-repeat center;
  background-size: cover;
}

.theme_btn {
  background: url(../assets/nav_A_03.svg) no-repeat center;
  background-size: cover;
}

.tab {
  box-shadow: 1px -1px 3px #999;
  box-sizing: border-box;
  background-color: #fff;
}

/* 抽屉 */
#read .drawer {
  height: 100%;
  width: 100%;
  box-shadow: none;
  bottom: 0;
  display: flex;
  background-color: transparent;
}

#read .drawer_inner1 {
  width: 80%;
  height: 100%;
  box-shadow: 1px 1px #999;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 0rem 1rem 1rem 0rem;
}

#read .drawer_inner2 {
  width: 20%;
  height: 100%;
}

#read .drawer .drawer_item {
  width: 100%;
  font-size: 1rem;
  font-family: "微软雅黑";
  display: flex;
}

.drawer_top {
  width: 100%;
  height: 8rem;
  display: flex;
  padding: 1rem 1rem;
  box-sizing: border-box;
}

.top_img {
  width: 4rem;
  height: 6rem;
}

.top_img > img {
  border-radius: 6px;
  width: 100%;
  height: 100%;
}

.top_detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 1rem;
}

.top_bookName {
  font-weight: bold;
}

.top_bookAuthor {
  font-size: 0.8rem;
}
.top_bookNum {
  font-size: 0.8rem;
}

.item_name {
  margin: 0rem 1rem;
  width: 100%;
  height: 2.75rem;
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 2rem;
  border-bottom: 1px solid #999;
  font-size: 0.9rem;
}

/* 进度控制 */
.progress {
  border-radius: 1rem 1rem 0 0;
  height: 4rem;
  display: flex;
  flex-direction: column;
}
.progress .progressLine {
  flex: 1;
  display: flex;
}

.progressLine .progress_left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progressLine .progress_mid {
  flex: 5;
  display: flex;
  align-items: center;
  position: relative;
}
.progressLine .progress_right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress .curSections {
  font-size: 0.9rem;
  font-family: "微软雅黑";
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress .curSections > input {
  width: 2rem;
  height: 1.2rem;
  margin: 0rem 0.2rem;
  border: 1px solid #999;
  border-radius: 5px;
  text-align: center;
}

/* 主题 */
.theme {
  height: 12rem;
  display: flex;
  font-size: 0.8rem;
  flex-direction: column;
  border-radius: 1rem 1rem 0 0;
}

.theme > div {
  flex: 1;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.light {
  display: flex;
}

.light_controller {
  width: 85%;
  position: relative;
}
.fontsize {
  display: flex;
  align-items: center;
}
.fontsize-inner {
  width: 85%;
}

.font_item {
  width: 18%;
  height: 80%;
  border-radius: 0.5rem;
  background-color: #fff;
  box-sizing: border-box;
  border: 1px dashed #333;
  color: #333;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.color {
  display: flex;
}
.color-inner {
  width: 85%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.color_item {
  width: 18%;
  height: 80%;
  border-radius: 0.5rem;
}

.color_item.active {
  border: 1px solid #666;
}

.color1 {
  background-color: #f7f7f9;
}

.color2 {
  background-color: #f6eed9;
}

.color3 {
  background-color: #c0edc6;
}

.color4 {
  background-color: #010101;
}
/* 字体 */
.fontFam-inner {
  width: 85%;
  display: flex;
  justify-content: flex-end;
}
.font-more {
  display: flex;
}

.font-more .active {
  border: 1px solid #ff5f18;
}

.font-more > div {
  border: 1px solid #707070;
  margin: 0px 5px;
  border-radius: 5px;
  padding: 0rem 0.5rem;
  text-align: center;
}
/* 翻页 */
/* .flip .flip-inner {
  display: flex;
}
.flip .flip-inner > div {
  width: 3rem;
  height: 80%;
  border: 1px solid #707070;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
} */
/* 音乐 */
.music {
  height: 7.5rem;
  display: flex;
  justify-content: center;
  border-radius: 1rem 1rem 0 0;
}

.music_inner {
  width: 80%;
  height: 100%;
}
/* 播放按钮动画样式 */
.music_inner .mt-range-content .active {
  animation: musicThumb 3s infinite linear;
}

@keyframes musicThumb {
  0% {
    box-shadow: 0px 0px 2px 0px #ffae00;
  }
  50% {
    box-shadow: 0px 0px 2px 2px #ffae00;
  }
  100% {
    box-shadow: 0px 0px 2px 0px #ffae00;
  }
}

.music_detail {
  height: 4rem;
  display: flex;
}

.music_cover {
  height: 4rem;
  width: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music_cover .active {
  animation: myAnimate 12s infinite linear;
  /* display: none; */
}

@keyframes myAnimate {
  0% {
    /* 可以同时对多个属性添加动画效果 */
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cover_inner {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #999;
}

.music_msg {
  flex: 1;
  overflow: hidden;
  padding: 1rem 1rem;
}

.music_name {
  width: 100%;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music_author {
  font-size: 0.8rem;
}

.music_progress {
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music_progress_inner {
  width: 100%;
  position: relative;
}

.music_controller {
  height: 2.5rem;
  display: flex;
  justify-content: center;
}

.music_controller > div {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.music_per {
  width: 2rem;
  height: 2rem;
  background: url(../assets/pre.png) center no-repeat;
  background-size: contain;
}

.music_play {
  width: 2rem;
  height: 2rem;
}

.music_controller .play {
  background: url(../assets/play.png) center no-repeat;
  background-size: contain;
}

.music_controller .pause {
  background: url(../assets/pause.png) center no-repeat;
  background-size: contain;
}

.music_next {
  width: 2rem;
  height: 2rem;
  background: url(../assets/next.png) center no-repeat;
  background-size: contain;
}

.h-enter,
.h-leave-to {
  transform: translateY(-3rem);
}

.h-enter-active,
.h-leave-active {
  transition: transform 0.4s ease;
}

.n-enter,
.n-leave-to {
  transform: translateY(3rem);
}

.n-enter-active,
.n-leave-active {
  transition: transform 0.4s ease;
}

.t-enter,
.t-leave-to {
  transform: translateY(10rem);
}

.t-enter-active {
  transition: transform 0.4s ease;
}
.t-leave-active {
  transition: transform 0.2s ease;
}

.t_d-enter,
.t_d-leave-to {
  transform: translateX(-20rem);
}

.t_d-enter-active {
  transition: transform 0.6s ease;
}
.t_d-leave-active {
  transition: transform 0.6s ease;
}

.f-enter,
.f-leave-to {
  transform: translatex(100%);
}

.f-enter-active,
.f-leave-active {
  transition: transform 0.4s ease;
}
#musicAnimate {
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

#musicAnimate > div {
  width: 10%;
  background-color: #707070;
}

#musicAnimate > div:nth-child(1) {
  height: 40%;
}
#musicAnimate > div:nth-child(2) {
  height: 100%;
}
#musicAnimate > div:nth-child(3) {
  height: 60%;
}
#musicAnimate > div:nth-child(4) {
  height: 80%;
}

#musicAnimate .A {
  animation: musicA 1s infinite linear;
}
#musicAnimate .B {
  animation: musicB 1s infinite linear;
}
#musicAnimate .C {
  animation: musicC 1s infinite linear;
}
#musicAnimate .D {
  animation: musicD 1s infinite linear;
}
@keyframes musicA {
  0% {
    height: 40%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 40%;
  }
}

@keyframes musicB {
  0% {
    height: 100%;
  }
  50% {
    height: 30%;
  }
  100% {
    height: 100%;
  }
}

@keyframes musicC {
  0% {
    height: 60%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 60%;
  }
}

@keyframes musicD {
  0% {
    height: 80%;
  }
  50% {
    height: 20%;
  }
  100% {
    height: 80%;
  }
}
</style>


