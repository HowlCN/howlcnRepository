<template>
  <div class="store-item">
    <div class="head">
      <slot name="title"></slot>
      <!-- <div class="more">更多 ></div> -->
    </div>
    <div class="body">
      <swiper id="swiper" class="swiper-container" :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="(item,i) in books" :key="i">
          <div class="book" @click="toBookinfo(item._id)">
            <div class="book-cover">
              <img :src="'http:'+item.cover"/>
            </div>
            <span class="book-name">{{item.title}}</span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  data: function() {
    return {
      swiperOption: {
        // width: window.innerWidth,
        direction: "horizontal",
        slidesPerView: "auto",
        // 设定初始化时slide的索引
        initialSlide: 0,
        on: {}
      }
    };
  },
  components: {
    swiper,
    swiperSlide
  },
  props: ["books", "title"],
  created() {},
  methods: {
    toBookinfo(id) {
      this.$store.commit("setCurBookId", id);
      this.$router.push("bookinfo");
    }
  }
};
</script>

<style>


.store-item {
  box-sizing: border-box;
  width: 100%;
  height: 16rem;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.store-item .head {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.store-item .head .title {
  flex: 1;
  font-size: 1.2rem;
  font-weight: bold;
}

.store-item .head .more {
  width: 3rem;
  font-size: 0.8rem;
  color: #505050;
  text-align: end;
}
.store-item .body {
  flex: 1;
  position: relative;
}

.store-item .swiper-container {
  width: 100%;
  height: 100%;
}
.store-item .swiper-wrapper {
  width: 8rem;
  height: 100%;
}
.store-item .swiper-slide {
  width: 100%;
  height: 100% !important;
  display: flex;
  align-items: center;
}
.store-item .swiper-slide:first-child {
  transform: translate3d(0px, 0px, 0px);
}

.store-item .swiper-slide:nth-child(2) {
  transform: translate3d(0px, 0px, 0px);
}
.store-item .book {
  width: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.store-item .book-cover {
  width: 6rem;
  height: 8rem;
  border-radius: 4px;
  overflow: hidden;
}

.store-item .book-name {
  margin-top: 0.6rem;
  font-size: 0.8rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
}
</style>



