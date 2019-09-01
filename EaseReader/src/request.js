import { mAxios } from "../tools/mAxios.js";

//mongoDB相关

//登录
export function login(username, password) {
  return mAxios({
    method: "POST",
    url: "/mongoDB/login",
    params: {
      username: username,
      password: password
    }
  });
}

//注册
export function register(usercover, username, password, gender, motto) {
  let img = '';
  if(gender == 0) img='http://bpic.588ku.com/element_origin_min_pic/17/01/13/25f2d03be89dd4c62731253714f66484.jpg';
  else if(gender == 1) img='http://b-ssl.duitang.com/uploads/item/201804/23/20180423140815_dmtya.jpeg';
  else img='http://b-ssl.duitang.com/uploads/item/201708/11/20170811120355_czMLQ.thumb.700_0.jpeg';
  return mAxios({
    method: "POST",
    url: "/mongoDB/register",
    params: {
      usercover: usercover || img,
      username: username,
      password: password,
      gender: gender,
      motto: motto,
      bookshelf: []
    }
  });
}

//编辑用户信息
export function edit(userId, usercover, username, password, gender, motto) {
  return mAxios({
    method: "POST",
    url: "/mongoDB/userMsg",
    params: {
      userId: userId,
      usercover: usercover,
      username: username,
      password: password,
      gender: gender,
      motto: motto
    }
  });
}
//获取用户信息
export function userMsg(userId) {
  return mAxios({
    method: "GET",
    url: `/mongoDB/userMsg/${userId}`
  });
}

//判断当前书籍是否在我的书架中
export function isInBookshlef(userId,bookId) {
  return mAxios({
    method: "GET",
    url: `/mongoDB/isinbookshlef/${userId}/${bookId}`
  });
}

//修改书籍progress
export function setBookProgress(userId,bookId,length,chapterIdx) {
  return mAxios({
    method: "POST",
    url: `/mongoDB/updateProgress`,
    params: {
      userId: userId,
      bookId: bookId,
      length: length,
      chapterIdx: chapterIdx
    }
  });
}
//获取数据库中书籍信息
export function getBookMsg(userId,bookId) {
  return mAxios({
    method: "GET",
    url: `/mongoDB/getBookMsg`,
    params: {
      userId: userId,
      bookId: bookId
    }
  });
}


//添加书籍 传入用户id 和书籍对象
export function addBook(userId,bookId,cover,name,author,length,chapterIdx) {
  console.log(chapterIdx);
  return mAxios({
    method: "POST",
    url: `/mongoDB/addBook`,
    params: {
      userId: userId,
      bookId: bookId,
      cover: cover,
      name: name,
      author: author,
      length: length,
      chapterIdx: chapterIdx
    }
  });
}

//移除书籍 传入用户id  和书籍id
export function removeBook(userId,bookId) {
  return mAxios({
    method: "POST",
    url: `/mongoDB/removeBook`,
    params: {
      userId: userId,
      bookId: bookId
    }
  });
}

//mongoDB相关结束

//获取首页图片轮播
export function getRecommendPageSlide() {
  return mAxios({
    method: "GET",
    url: "/api/recommendPage/node/spread/575f74f27a4a60dc78a435a3?pl=ios"
  });
}

//获取大分类
export function getSortListBooks() {
  return mAxios({
    method: "GET",
    url: `/api/cats/lv2`
  });
}

//获取小分类


//获取排行榜
export function getRank() {
  return mAxios({
    method: "GET",
    url: `/api/ranking/gender`
  });
}

//获取分类详情书籍
export function getSortdetail(gender, major) {
  return mAxios({
    method: "GET",
    url: `/api/book/by-categories?gender=${gender}&type=hot&major=${major}&minor=&start=0&limit=20`
  });
}
//歌唱祖国优秀作品
export function getGCZG() {
  return mAxios({
    method: "GET",
    url:
      "https://b.zhuishushenqi.com/category/info?node=84e299f3db0340c2b98f24e56afa138f&size=40&type=&packageName=null"
  });
}

//阅读进步 学习祖国
export function getXXZG() {
  return mAxios({
    method: "GET",
    url:
      "https://b.zhuishushenqi.com/category/info?node=94674402a1fd48ca9bf921e50ea489f7&size=40&type=&packageName=null"
  });
}

// 根据书籍ID 书籍信息
export function booksMsg(id) {
  return mAxios({
    method: "GET",
    url: `/api/book/${id}`
  });
}

//根据书籍ID 获取A源
export function booksATOC(id) {
  return mAxios({
    method: "GET",
    url: `/api/atoc/?view=summary&book=${id}`
  });
}
//根据书籍ID 获取A源
export function booksBTOC(id) {
  return mAxios({
    method: "GET",
    url: `/api/btoc/?view=summary&book=${id}`
  });
}

//根据A源或B源ID 获取书籍章节
export function getBookChaptersList(id, AOB) {
  //AOB 取值为atoc  或者  btoc
  return mAxios({
    method: "GET",
    url: `/api/${AOB}/${id}?view=chapters&channel=mweb`
  });
}

// 获取章节内容
export function bookContent(link) {
  return mAxios({
    method: "GET",
    url: `/content/chapter/${link}`
  });
}

//获取音乐歌单
export function musicData() {
  return mAxios({
    method: "GET",
    url: "/music/top/playlist?tag=学习"
  });
}
// 通过歌单id 获取歌单详情
export function musicListDetail(id) {
  return mAxios({
    method: "GET",
    url: `/music/playlist/detail?id=${id}`
  });
}
// 通过歌曲id 获取歌曲详情
export function musicDetail(id) {
  return mAxios({
    method: "GET",
    url: `/music/song/detail?ids=${id}`
  });
}

// 通过歌曲id 获取歌曲url
export function musicUrl(id) {
  return mAxios({
    method: "GET",
    url: `/music/song/url?id=${id}`
  });
}

//获取书架书籍列表
export function getUserById(userId) {
  return mAxios({
    method: "GET",
    url: `/mongoDB/userMsg/${userId}`
  });
}

//书籍详情
export function getRecommendInfo(bookId) {
  return mAxios({
    method: "GET",
    url: `/b/book/${bookId}/recommend`
  });
}

export function goGetBookinfo(bookId) {
  return mAxios({
    method: "GET",
    url: `/api/book/${bookId}`
  });
}

//获取书籍评论
export function getCommentInfo(bookId) {
  return mAxios({
    method: "GET",
    url: `/api/post/review/best-by-book?book=${bookId}&limit=5`
  });
}

//热门搜索
export function getHotSearch() {
  return mAxios({
    method: "GET",
    url: "/api/book/hot-word"
  });
}

//搜索补齐
export function searchCom(kw) {
  return mAxios({
    method: "GET",
    url: `/api/book/auto-complete?query=${kw}`
  });
}

//按书名搜索
export function searchByBookname(kw) {
  return mAxios({
    method: "GET",
    url: `/api/book/fuzzy-search?query=${kw}`
  });
}
