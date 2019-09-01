<template>
  <div id="bookshelf">
    <div id="shelfHeader" :style="{backgroundColor:watchMode?'#ffffff':'#f5f5f5'}">
      <div>
        <div class="top_titie">书架</div>
        <div class="search">
          <img src="../assets/search.png" @click="searchShow=!searchShow" v-show="searchShow" />
          <div class="shelfHeader-search" v-show="!searchShow">
            <input id="Ssearch" ref="Ssearch" type="text" @blur="cancelAnimate" v-model="inputData" />
            <img src="../assets/search.png" />
          </div>
          <ul class="result" id="result" v-show="!searchShow">
            <li v-for="(item,i) in searchResult" :key="i" @click="readThis(item.bookId)">{{item.name}}</li>
          </ul>
        </div>
        <div class="tabList" @click="watchMode = !watchMode">
          <img v-show="watchMode" src="../assets/list.png" />
          <img v-show="!watchMode" src="../assets/nolist.png" />
        </div>
      </div>
    </div>
    <div id="listdisplay" :style="{backgroundColor:watchMode?'#ffffff':'#f5f5f5'}">
      <div id="listMode" key="list" v-if="watchMode">
        <div class="list">
          <book-item v-for="(item,i) in myBooks" :idx="i" :key="i" :comBook="item"></book-item>
        </div>
      </div>
      <div id="nolistMode" v-else>
        <book-swiper :books="myBooks"></book-swiper>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { getUserById, booksMsg } from "../request.js";
export default {
  data: function() {
    return {
      //显示模式 列表 或 卡片
      watchMode: true,
      searchShow: true,
      //搜索结果
      searchResult: [],
      //输入框内容
      inputData: "",
      myBooks: []
    };
  },
  components: {
    bookSwiper: require("../components/bookSwiper.vue").default,
    bookItem: require("../components/BookItem.vue").default
  },
  watch: {
    searchShow: function() {
      const self = this;
      if (!self.searchShow) {
        $("#Ssearch").animate({ width: "100%" }, 500, function() {
          self.$refs.Ssearch.focus();
        });
      }
    },
    inputData: function(n, o) {
      this.search(n);
    },
    //监听搜索结果
    searchResult: function(n, o) {
      if (n.length > 0) {
        //在数据重新渲染后执行
        this.$nextTick(() => {
          $("#result").slideDown(500);
        });
      } else {
        $("#result").slideUp(500);
      }
    }
  },
  created() {
    this.getBookList(this.$store.state.userId);
  },
  methods: {
    readThis(id) {
      this.$store.commit("setCurBookId",id);
      this.$store.commit("reverseShow");
    },
    cancelAnimate() {
      const self = this;
      $("#Ssearch").animate({ width: "10%" }, 500, function() {
        self.searchShow = true;
      });
    },
    search(data) {
      this.searchResult = [];
      for (var i = 0; i < this.myBooks.length; i++) {
        var temp = this.myBooks[i];
        if (data != "" && temp.name.search(data) != -1) {
          this.searchResult.push(temp);
        }
      }
    },
    //获取书架书籍列表
    getBookList(userId) {
      if (userId == "") {
        console.log("未登录");
        return;
      }
      getUserById(userId).then(({msg}) => {
        this.myBooks = msg.bookshelf;
      });
    }
  }
};
</script>

<style scoped>
#bookshelf {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
}

#shelfHeader {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

#shelfHeader > div {
  width: 90%;
  height: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#shelfHeader .top_titie {
  width: 4rem;
  font-size: 1.8rem;
  font-weight: 600;
  font-family: "STKaiti";
}

#shelfHeader .search {
  flex: 1;
  height: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#shelfHeader .shelfHeader-search {
  height: 60%;
  width: 100%;
  position: relative;
}
#shelfHeader .result {
  display: none;
  width: 80%;
  border: 1px solid #505050;
  box-shadow: 0px 0px 2px 4px #d0d0d0;
  border-radius: 1rem;
  background-color: #fff;
  list-style: none;
  position: absolute;
  top: 3rem;
  left: 50%;
  transform: translate(-48%, 0%);
  z-index: 9;
}
#shelfHeader .result > li:not(:last-child) {
  border-bottom: 1px solid #d0d0d0;
}
#shelfHeader .result > li {
  height: result;
  line-height: 2rem;
  margin: 0rem 1rem;
}

#shelfHeader .shelfHeader-search #Ssearch {
  height: 100%;
  width: 10%;
  border: 1px solid #2c2c2c;
  float: right;
  border-radius: 2rem 2rem 2rem 2rem;
  padding-left: 1rem;
  outline: none;
}
#shelfHeader .shelfHeader-search > img {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0%, -50%);
}
/* #shelfHeader .top_right {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#shelfHeader .top_right div {
  width: 1.5rem;
  height: 100%;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
}*/
#shelfHeader img {
  width: 1.5rem;
  height: 1.5rem;
}

#shelfHeader .tabList {
  height: 100%;
  display: flex;
  align-items: center;
}
#listdisplay {
  flex: 1;
  overflow: hidden;
}

#listMode {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#nolistMode {
  width: 100%;
  height: 100%;
  display: flex;
}

.list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
</style>


