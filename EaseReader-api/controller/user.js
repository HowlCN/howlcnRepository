const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("../model/user.js");

const app = express();
const Router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

//测试接口
Router.get("/test", (req, res) => {
  console.log("req", req);
  res.send("ok");
});

//需要传入用户名 和 密码   【username】
Router.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findByUsername(username, function(data) {
    if (data) {
      if (data.password == password) {
        console.log("【 " + username + " 】登录成功");
        res.send({ ok: true, msg: "", _id: data._id });
      } else {
        res.send({ ok: false, msg: "密码错误", _id: "" });
      }
    } else {
      res.send({ ok: false, msg: "该用户不存在", _id: "" });
    }
  });
});

//注册
Router.post("/register", (req, res) => {
  let username = req.body.username;
  User.findByUsername(username, function(data) {
    if (data) {
      res.send({ ok: false, msg: "用户名已存在", _id: "" });
    } else {
      req.body._id = mongoose.Types.ObjectId();
      let obj = new User();
      Object.assign(obj, req.body);
      User.addUser(obj, () => {});
      res.send({ ok: true, msg: "", _id: "" });
    }
  });
});

//更新用户书籍progress 【_id】
Router.post("/updateProgress", (req, res) => {
  let userId = req.body.userId;
  let bookId = req.body.bookId;
  let progress = req.body.progress;
  User.findById(userId, function(data) {
    if (data) {
      let bookshelf = data.bookshelf;
      for (let i = 0; i < bookshelf.length; i++) {
        if (bookshelf[i].bookId == bookId) {
          bookshelf[i].progress = progress;
          break;
        }
      }
      User.updateUserById(userId, { bookshelf: bookshelf }, function(data) {
        res.send({ ok: true, msg: "", _id: "" });
      });
    } else {
      res.send({ ok: false, msg: "未找到该用户", _id: "" });
    }
  });
});
//修改用户所有信息
Router.post("/userMsg", (req, res) => {
  let userId = req.body.userId;
  console.log(req.body);
  User.updateUserById(userId, req.body, function(data) {
    if (data) {
      res.send({ ok: true, msg: data, _id: data._id });
    } else {
      res.send({ ok: false, msg: "未找到该用户", _id: "" });
    }
  });
});

//获取用户所有信息
Router.get("/userMsg/:userId", (req, res) => {
  let userId = req.params.userId;
  console.log(userId);
  User.findById(userId, function(data) {
    if (data) {
      res.send({ ok: true, msg: data, _id: data._id });
    } else {
      res.send({ ok: false, msg: "未找到该用户", _id: "" });
    }
  });
});

//判断该书籍是否在用户书架中
Router.get("/isinbookshlef/:userId/:bookId", (req, res) => {
  let userId = req.params.userId;
  let bookId = req.params.bookId;
  User.findById(userId, function(data) {
    if (data) {
      let bookshelf = data.bookshelf;
      for (let i = 0; i < bookshelf.length; i++) {
        if (bookshelf[i].bookId == bookId) {
          res.send({ ok: true, msg: "书架中已存在", _id: "" });
          return;
        }
      }
      res.send({ ok: false, msg: "书架中无此书", _id: "" });
    } else {
      res.send({ ok: false, msg: "用户不存在", _id: "" });
    }
  });
});

//添加书籍 传入用户id 和book对象
Router.post("/addBook", (req, res) => {
  let userId = req.body.userId;
  let book = req.body.book;
  let bookId = book.bookId;
  User.findById(userId, function(data) {
    if (data) {
      let bookshelf = data.bookshelf;
      for (let i = 0; i < bookshelf.length; i++) {
        if (bookshelf[i].bookId == bookId) {
          res.send({ ok: false, msg: "不可添加该书籍", _id: "" });
          return;
        }
      }
      bookshelf.push(book);
      User.updateUserById(userId, { bookshelf: bookshelf }, function(data) {
        res.send({ ok: true, msg: "", _id: "" });
      });
    } else {
      res.send({ ok: false, msg: "用户不存在", _id: "" });
    }
  });
});

//移除书籍  传入用户id  和书籍id
Router.post("/addBook", (req, res) => {
  let userId = req.body.userId;
  let book = req.body.bookId;
  User.findById(userId, function(data) {
    if (data) {
      let bookshelf = data.bookshelf;
      for (let i = 0; i < bookshelf.length; i++) {
        if (bookshelf[i].bookId == bookId) {
          bookshelf.splice(i,1);
          break;
        }
      }
      User.updateUserById(userId, { bookshelf: bookshelf }, function(data) {
        res.send({ ok: true, msg: "移除成功", _id: "" });
      });
    } else {
      res.send({ ok: false, msg: "用户不存在", _id: "" });
    }
  });
});

module.exports = Router;
