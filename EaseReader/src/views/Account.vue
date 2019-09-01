<template>
  <div id="account">
    <!-- <div class="header">
      <div class="countName">{{username}}</div>
    </div> -->
    <div class="count">
      <div class="countHead">
        <img src="https://i.loli.net/2019/07/21/5d3428f8549d162858.png" />
        <div class="headImg" @click="toLoginOrEdit">
          <img :src="usercover?usercover:'https://i.loli.net/2019/07/21/5d33def261bf087955.png'" />
        </div>
        <p class="introduce">爱天下可爱之人</p>
        <p class="motto">{{motto}}</p>
      </div>
      <div class="accountDetail">
        <div class="account-item">
          <div class="accountDetail-item">
            <div class="detailItem-left">
              <div class="left-inner">
                <img src="../assets/account.svg" />
                <span>账户</span>
              </div>
            </div>
            <div class="detailItem-right"></div>
          </div>
          <div class="accountDetail-item">
            <div class="detailItem-left">
              <div class="left-inner">
                <img src="../assets/money.svg" />
                <span>充值</span>
              </div>
            </div>
            <div class="detailItem-right"></div>
          </div>
        </div>

        <div class="account-item">
          <div class="accountDetail-item">
            <div class="detailItem-left">
              <div class="left-inner">
                <img src="../assets/book.svg" />
                <span>读过的书</span>
              </div>
            </div>
            <div class="detailItem-right"></div>
          </div>
          <div class="accountDetail-item">
            <div class="detailItem-left">
              <div class="left-inner">
                <img src="../assets/active.svg" />
                <span>我的活动</span>
              </div>
            </div>
            <div class="detailItem-right"></div>
          </div>
        </div>

        <div class="account-item">
          <div class="accountDetail-item">
            <div class="detailItem-left">
              <div class="left-inner">
                <img src="../assets/email.svg" />
                <span>意见反馈</span>
              </div>
            </div>
            <div class="detailItem-right"></div>
          </div>
          <div class="accountDetail-item">
            <div class="detailItem-left">
              <div class="left-inner">
                <img src="../assets/good.svg" />
                <span>给个好评</span>
              </div>
            </div>
            <div class="detailItem-right"></div>
          </div>
        </div>

        <div class="account-item">
          <div class="accountDetail-item">
            <div class="detailItem-left">
              <div class="left-inner">
                <img src="../assets/setting.svg" />
                <span>设置</span>
              </div>
            </div>
            <div class="detailItem-right"></div>
          </div>
        </div>

        <div class="accountDetail-item sign-out" @click="signOut">退出登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import { userMsg } from "../request.js";
export default {
  data: function() {
    return {
      usercover: "",
      username: "请登录",
      motto: "这个人很懒，没有座右铭"
    };
  },
  created() {
    this.getUserMsg();
  },
  computed:{
    listenUserId:function(){
      return this.$store.state.userId;
    }
  },
  watch:{
    listenUserId(nval,oval){
      if(nval!=''){
        this.getUserMsg()
      }
    }
  },
  methods: {
    toLoginOrEdit() {
      //若已登录 跳转至用户编辑界面
      if (this.$store.state.userId) {
        this.$store.commit("reverseShowEdit", true);
      } else {
        //否则显示 登录界面
        this.$store.commit("reverseShowLogin", true);
      }
    },
    //退出登录
    signOut() {
      this.$store.commit("setUserId", "");
      this.getUserMsg();
    },
    //获取用户信息
    getUserMsg() {
      let userId = this.$store.state.userId;
      if (userId) {
        userMsg(userId).then(({ msg }) => {
          this.usercover = msg.usercover;
          this.username = msg.username;
          this.motto = msg.motto;
        });
      } else {
        this.usercover = "";
        this.username = "请登录";
        this.motto = "这个人很懒，没有座右铭";
      }
    }
  }
};
</script>

<style scoped>
#account {
  width: 100%;
  height: 100%;
  /* padding: 0rem 0.8rem; */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
/* .header {
  width: 100%;
  height: 3rem;
  position: relative;
} */
/* .countName {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
} */
.setting {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
}
.count {
  flex: 1;
  overflow: auto;
}
.countHead {
  width: 100%;
  height: 12rem;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.countHead > img {
  position: absolute;
  z-index: -1;
}
.headImg {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 1px solid #eee;
  margin: 2rem;
  overflow: hidden;
  background-color: #eee;
}
.accountDetail {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
}
.account-item {
  margin-top: 0.6rem;
  width: 100%;
  background-color: #fff;
}
.accountDetail-item {
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  line-height: 4rem;
  display: flex;
}
.accountDetail-item .detailItem-right {
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  line-height: 4rem;
  display: flex;
}
.accountDetail-item .left-inner {
  width: 9rem;
  height: 4rem;
  display: flex;
  align-items: center;
}
.accountDetail-item .left-inner > img {
  width: 2rem;
  height: 2rem;
  margin-right: 0.6rem;
}

.accountDetail-item img {
  width: 100%;
  height: 100%;
}

.sign-out {
  display: inline-block;
  margin: 1.2rem auto;
  padding: 0;
  width: 95%;
  height: 3.2rem;
  border-radius: 10px;
  background-color: rgb(193, 41, 21);
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
  line-height: 3.2rem;
}
</style>


