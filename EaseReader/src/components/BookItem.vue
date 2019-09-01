<template>
    <div class="list_book" @click="readThis(comBook.bookId)">
      <div class="bookCover" :style="{'backgroundImage':'url(http://statics.zhuishushenqi.com'+comBook.cover+')'}"></div>
      <div class="book_detail">
        <div class="book_msg">
          <div class="book_name" v-cloak>{{comBook.name}}</div>
          <div class="book_author" v-cloak>{{comBook.author}}</div>
        </div>
        <div class="book_progress">
          <div class="book_line">
            <div class="book_line_inner1"></div>
            <div :class="'bookItem-'+idx" class="book_line_inner2"></div>
          </div>
          <div class="book_num" v-cloak>已读 {{comBook.progress}}%</div>
        </div>
      </div>
    </div>
</template>

<script>
import $ from "jquery";
import { booksMsg } from "../request.js"
export default {
  data: function() {
    return {
    };
  },
  props: ["comBook","idx"],
  mounted(){
    //进度条动画
    this.progressAnimate();
  },
  methods: {
    readThis(id) {
      this.$store.commit("setCurBookId",id);
      this.$store.commit("reverseShow");
    },
    progressAnimate(){
      $('.bookItem-'+this.idx).animate({width:this.comBook.progress},1000,function(){})
    }
  }
};
</script>

<style scoped>
.list_book {
  width: 90%;
  height: 9rem;
  /* 当父亲设置flex时，子元素的flex-shrink默认为1 
    将其设置为0 解决元素高度失效的问题*/
  flex-shrink: 0;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #bbb;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.bookCover {
  width: 5rem;
  height: 7rem;
  border-radius: 0.3rem;
  background-size: 100% 100%;
}

.book_detail {
  flex: 1;
  height: 7rem;
  padding: 1rem 0rem 1.2rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book_name {
  font-size: 1.5rem;
  font-weight: bold;
}

.book_author {
  font-size: 1rem;
  color: #666;
}

.book_progress {
  width: 100%;
  height: 1rem;
  display: flex;
  align-items: center;
}

.book_progress .book_num {
  width: 5rem;
  height: 100%;
  color: #666;
  line-height: 100%;
  text-align: end;
}

.book_progress .book_line {
  flex: 1;
  height: 4px;
  position: relative;
}

.book_line .book_line_inner1 {
  width: 95%;
  height: 100%;
  border-radius: 2px 0px 2px 0px;
  background-color: #bbb;
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
}

.book_line .book_line_inner2 {
  height: 100%;
  border-radius: 2px 0px 2px 0px;
  background-color: #ff5f18;
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
}
</style>

