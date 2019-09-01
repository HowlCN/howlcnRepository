const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/shanyue", {
  useNewUrlParser: true
});

var userSchema = new mongoose.Schema({
  //唯一标识  【唯一】
  _id: mongoose.Schema.Types.ObjectId,
  //用户名  【唯一】
  username: {
    type: String,
    minlength: 2,
    maxlength: 10,
    require: [true, "姓名不能为空"]
  },
  //密码
  password: {
    type: Number,
    min: 6,
    maxlength: 20,
    require: [true, "密码不能为空"]
  },
  //用户头像
  usercover: {
    type: String
  },
  //用户性别
  gender: {
    type: Number,
    //0保密  1女 2男
    enum: [0, 1, 2],
    default: 0,
    require: [true, "性别不能为空"]
  },
  //用户个性签名
  motto: {
    type: String,
    maxlength: 25
  },
  //用户书架
  bookshelf: [Object]
});
//添加用户
userSchema.statics.addUser = function(newUser, callback) {
  newUser.save().then(
    function() {
      console.log("新增用户 【 " + newUser.username + " 】");
      callback();
    },
    function(err) {
      console.log("添加用户失败: ", err);
    }
  );
};

//通过_id 删除用户
userSchema.statics.deleteUserById = function(id, callback) {
  this.remove({ _id: id }).then(data => {
    if (data) {
      console.log("通过_id 【 " + id + " 】成功删除用户");
    } else {
      console.log("通过username 【 " + username + " 】查找用户失败");
    }
  });
};

//通过username 查找用户
userSchema.statics.findByUsername = function(username, callback) {
  this.findOne({ username: username }).then(function(data) {
    if (data) {
      console.log("通过username 【 " + username + " 】查找用户成功");
    } else {
      console.log("通过username 【 " + username + " 】查找用户失败");
    }
    callback(data);
  });
};
//通过_id 查找用户
userSchema.statics.findById = function(id, callback) {
  this.findOne({ _id: id }).then(function(data) {
    if (data) {
      console.log("通过id 【 " + id + " 】查找用户成功");
    } else {
      console.log("通过id 【 " + id + " 】查找用户失败");
    }
    callback(data);
  });
};

//通过username 更新用户信息
userSchema.statics.updateUserByUsername = function(
  username,
  userObj,
  callback
) {
  this.findOneAndUpdate(
    { username: username },
    userObj,
    { new: true },
    function() {
      console.log("通过username 【 " + username + " 】 更新用户信息成功");
    }
  );
};

//通过_id 更新用户信息
userSchema.statics.updateUserById = function(id, obj, callback) {
  this.findByIdAndUpdate(id, obj, { new: true }, function(data) {
    if (data) {
      console.log("通过id 【 " + data._id + " 】 更新用户信息成功");
    }
    callback(data);
  });
};
var User = new mongoose.model("myuser", userSchema);
module.exports = User;
