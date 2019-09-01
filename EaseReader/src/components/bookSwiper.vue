<template>
  <swiper id="mySwiper" class="swiper-container" :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="(item,i) in books" :key="i">
      <div class="lunboBook" @click="readThis(item.id)">
        <div class="bookCover">
          <img :src="'http://statics.zhuishushenqi.com'+item.cover" />
        </div>
        <div class="bookMsg">
          <div class="bookName">{{item.bookName}}</div>
          <div class="bookAuthor">{{item.author}}</div>
        </div>
        <div class="bookProgress">
          <mt-progress :value="parseInt(item.progress)" :bar-height="5"></mt-progress>
        </div>
      </div>
    </swiper-slide>
    <!-- Optional controls -->
    <div class="swiper-scrollbar" slot="scrollbar"></div>
  </swiper>
</template>
<script>
//引入swiper
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import Vue from "vue";
import { Progress } from "mint-ui";
Vue.component(Progress.name, Progress);

export default {
  data: function() {
    const self = this;
    return {
      swiperOption: {
        // width: window.innerWidth,
        direction: "horizontal",
        slidesPerView: "auto",
        centeredSlides: true,
        watchSlidesProgress: true,
        scrollbar: {
          el: ".swiper-scrollbar"
        },
        // 设定初始化时slide的索引
        initialSlide: 0,
        //获取滑动进度
        watchSlidesProgress: true,
        on: {
          //获取progress
          progress: function(progress) {
            self.progress = progress;
          },
          setTransition: function(transiton) {
            self.transiton = transiton;
          }
        }
      },
      progress: 0
    };
  },
  props: ["books"],
  components: {
    swiper,
    swiperSlide
  },
  created(){
  },
  watch: {
    progress: function(n, o) {
      var a = this.swiper;
      var b, c, d, es, scale;
      for (b = 0; b < a.slides.length; b++) {
        c = a.slides[b];
        d = c.progress;
        scale = 1 - Math.min(Math.abs(0.2 * d), 1);
        es = c.style;
        es.opacity = 1 - Math.min(Math.abs(d / 2), 1);
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform =
          "translate3d(0px,0px," + -Math.abs(150 * d) + "px)";
      }
    },
    transiton: function(n, o) {
      var es;
      for (var i = 0; i < this.swiper.slides.length; i++) {
        es = this.swiper.slides[i].style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration =
          n + "ms";
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    readThis(id) {
      this.$store.commit("reverseShow");
    }
  }
};
</script>
<style>
#mySwiper .mt-progress-progress {
  background-color: #ff5f18;
}
#mySwiper {
  width: 100%;
  -webkit-perspective: 1200px;
  -moz-perspective: 1200px;
  -ms-perspective: 1200px;
  perspective: 1200px;
}

#mySwiper > .swiper-scrollbar {
  position: absolute;
  left: 50%;
  bottom: 2rem;
  height: 5px;
  width: 30%;
  transform: translate(-50%,0%);
}

#mySwiper .swiper-wrapper {
  margin-top: 30px;
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

#mySwiper .swiper-slide {
  width: 80% !important;
  height: 85% !important;
  /* box-sizing: border-box; */
  border: 0px !important;
}
#mySwiper .swiper-slide:first-child {
  transform: translate3d(0px, 0px, 0px);
}

#mySwiper .swiper-slide:nth-child(2) {
  opacity: 0.5;
  transform: translate3d(0px, 0px, -150px);
}

#mySwiper .swiper-slide .lunboBook {
  width: 90%;
  height: 100%;
  border-radius: 10px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
#mySwiper .swiper-slide .bookCover {
  width: 9rem;
  height: 14rem;
}

#mySwiper .swiper-slide .bookCover > img {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
}

#mySwiper .swiper-slide .bookMsg {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#mySwiper .swiper-slide .bookName {
  font-size: 2rem;
  padding: 0.6rem 0rem;
}
.lunboBook {
  background-color: #fff;
}

#mySwiper .mt-progress-runway,
.mt-progress-progress {
  border-radius: 2px 2px 2px 2px;
}
#mySwiper .swiper-slide .bookProgress {
  width: 75%;
}
</style>


