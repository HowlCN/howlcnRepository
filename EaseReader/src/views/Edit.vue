<template>
  <div id="edit">
    <div class="countHead">
      <div class="head">
        <div class="back" @click="back">
          <i class="mint-toast-icon mintui mintui-back"></i>
        </div>
      </div>
      <!-- <img :src="user.usercover" class="blur" /> -->
      <div class="blur" :style="'background:url('+usercover+') center center'"></div>
      <div class="headImg CRcenter">
        <img :src="usercover" />
      </div>
    </div>
    <!-- 座右铭 -->
    <div class="edit">
      <div class="name">
        <div class="left">用户名</div>
        <div class="right">
          <input type="text" v-model="username" />
        </div>
      </div>
      <div class="motto">
        <div class="left">个性签名</div>
        <div class="right">
          <input type="text" v-model="motto" />
        </div>
      </div>
      <div class="setPassword" @click="showSet">修改密码</div>
    </div>
    <div class="edit-password">
      <div class="password-head">
        <i class="mint-toast-icon mintui mintui-back" @click="backToEdit"></i>
      </div>
      <input
        type="text"
        ref="setOld"
        v-model="setOld"
        @focus="cleanStyle($event)"
        placeholder="旧密码"
      />
      <input
        type="text"
        ref="setNew"
        v-model="setNew"
        @focus="cleanStyle($event)"
        placeholder="新密码"
      />
      <input type="text" ref="setRe" v-model="setRe" @focus="cleanStyle($event)" placeholder="确认密码" />
      <div class="subm" @click="setPassword">确认修改</div>
    </div>
  </div>
</template>

<script scoped>
import $ from "jquery";
import { userMsg, edit } from "../request.js";
export default {
  data: function() {
    return {
      userId: this.$store.state.userId,
      usercover: "",
      username: "",
      password: "",
      gender: 0,
      motto: "",
      setOld: "",
      setNew: "",
      setRe: ""
    };
  },
  created() {
    this.getUserMsg();
  },
  mounted() {
    $("#edit").animate({ right: "0%" }, 500, function() {});
  },
  methods: {
    cleanStyle({ target }) {
      target.style.border = "1px solid #eee";
      target.style.color = "#000";
      target.value = "";
    },
    back() {
      const self = this;
      edit(
        self.userId,
        self.usercover,
        self.username,
        self.password,
        self.gender,
        self.motto
      ).then(data => {
        console.log(data);
      });
      $("#edit").animate({ right: "-100%" }, 500, function() {
        self.$store.commit("reverseShowEdit", false);
      });
    },
    backToEdit() {
      this.hideSet();
    },
    showSet() {
      $(".edit-password").animate({ bottom: "0%" }, 400, function() {
        console.log("动画完成");
      });
    },
    hideSet() {
      let self = this;
      $(".edit-password").animate({ bottom: "-100%" }, 400, function() {
        self.setOld = "";
        self.setNew = "";
        self.setRe = "";
      });
    },
    setPassword() {
      if (this.password != this.setOld) {
        this.$refs.setOld.style.border = "1px solid red";
        this.$refs.setOld.style.color = "red";
        this.$refs.setOld.value = "密码错误";

        return;
      }
      if (this.setNew != this.setRe) {
        this.$refs.setRe.style.border = "1px solid red";
        this.$refs.setRe.style.color = "red";
        this.$refs.setRe.value = "两次输入的密码不一致";
        return;
      }
      edit(
        this.userId,
        this.usercover,
        this.username,
        this.setNew,
        this.gender,
        this.motto
      ).then(data => {
        if (data.ok) {
          this.$store.commit("reverseShowEdit", false);
          this.$store.commit("setUserId", "");
          this.$store.commit("reverseShowLogin", true);
        }
      });
    },
    //获取用户信息
    getUserMsg() {
      let userId = this.$store.state.userId;
      if (userId) {
        userMsg(userId).then(({ msg }) => {
          console.log(msg);
          this.usercover = msg.usercover;
          this.username = msg.username;
          this.password = msg.password;
          this.gender = msg.gender;
          this.motto = msg.motto;
        });
      }
    }
  }
};
</script>


<style>
/* 预设高斯模糊 */
.blur {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  filter: blur(10px);
}
/* 预设对齐方式 */
/* 垂直 水平 居中 */
.CRcenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#edit {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
  right: -100%;
  z-index: 999;
  background-color: #fff;
  overflow: hidden;
}
.head {
  width: 100%;
  height: 3rem;
  float: left;
}

.back {
  width: 3rem;
  height: 3rem;
  line-height: 3rem;
  color: #fff;
}

.countHead {
  width: 100%;
  height: 25rem;
  background-size: contain;
  position: relative;
  overflow: hidden;
}
.headImg {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  overflow: hidden;
}

.edit {
  margin-top: 1.5rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  position: relative;
}
.edit > div {
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  margin-top: 0.5rem;
  display: flex;
}
.edit > div > .left {
  padding: 0rem 1rem 0rem 0.5rem;
  line-height: 3rem;
  text-align: right;
}
.edit > div > .right {
  flex: 1;
}
.edit > div > .right > input {
  width: 100%;
  height: 100%;
  text-align: right;
  line-height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
}

.edit .setPassword {
  width: 80%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  line-height: 3rem;
  border-radius: 0.5rem;
  background-color: #1989fa;
  color: #fff;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translate(-50%, 0);
}

#edit .edit-password {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  box-shadow: 0 0 1px 1px #eee;
  position: absolute;
  bottom: -100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#edit .edit-password input {
  display: block;
  width: 80%;
  height: 3rem;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-top: 1rem;
  padding: 0 1rem;
}
#edit .edit-password .subm {
  width: 80%;
  height: 3rem;
  border-radius: 5px;
  margin-top: 1rem;
  background-color: #1989fa;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 1rem;
}

.password-head {
  width: 100%;
  height: 3rem;
  float: left;
}

.password-head .mint-toast-icon {
  width: 3rem;
  height: 3rem;
  text-align: center;
  line-height: 3rem;
}
</style>


