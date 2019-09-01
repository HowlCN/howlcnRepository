
const apikey="0b2bdeda43b5688921839c8ecb20399b";

//首页Home 请求
//口碑榜   
export function getKBRank() {
    return fetch( `https://api.douban.com/v2/movie/weekly?apikey=${apikey}`).then(res=>res.json())
  }
//北美票房榜
export function getBMPFRank() {
    return fetch( `https://api.douban.com/v2/movie/us_box?&apikey=${apikey}`).then(res=>res.json())
}
//新片榜
export function getXPRank() {
    return fetch( `https://api.douban.com/v2/movie/new_movies?apikey=${apikey}`).then(res=>res.json())
}
//即将上映
export function getJJSY() {
    return fetch( `https://api.douban.com/v2/movie/coming_soon?apikey=${apikey}`).then(res=>res.json())
}
//正在热映
export function getZZRY(count,city) {
    count = count || 5;
    city = city || '北京';
    return fetch( `https://api.douban.com/v2/movie/in_theaters?count=${count}&city=${city}&apikey=${apikey}`).then(res=>res.json())
}
//Top250
export function getTop250(pageIdx) {
    let start = pageIdx*21 || 0;
    return fetch( `https://api.douban.com/v2/movie/top250?start=${start}&count=21&apikey=${apikey}`).then(res=>res.json())
}

/////////////////
//电影条目相关接口

//测试用电影id：1764796

// 1、电影条目信息  传入电影id
export function getDYXX(id) {
    return fetch( `https://api.douban.com/v2/movie/subject/${id}?apikey=${apikey}`).then(res=>res.json())
}
// 2、电影条目剧照  传入电影id
export function getDYJZ(id) {
    return fetch( `https://api.douban.com/v2/movie/subject/${id}/photos?apikey=${apikey}`).then(res=>res.json())
}
// 3、电影条目长评  传入电影id
export function getDYCP(id) {
    return fetch( `https://api.douban.com/v2/movie/subject/${id}/reviews?apikey=${apikey}`).then(res=>res.json())
}
// 4、电影条目短评  传入电影id
export function getDYDP(id) {
    return fetch( `https://api.douban.com/v2/movie/subject/${id}/comments?apikey=${apikey}`).then(res=>res.json())
}

/////////////////
//演员条目相关接口

//测试用演员id：1054395

// 1、演员条目信息
export function getYYXX(id) {
    return fetch( `https://api.douban.com/v2/movie/celebrity/${id}?apikey=${apikey}`).then(res=>res.json())
}
// 2、演员剧照
export function getYYJZ(id,count) {
    count = count || 21;
    return fetch( `https://api.douban.com/v2/movie/celebrity/${id}/photos?count=${count}&apikey=${apikey}`).then(res=>res.json())
}
// 3、演员作品
export function getYYZP(id,pageIdx) {
    let start = pageIdx*21 || 0;
    return fetch( `https://api.douban.com/v2/movie/celebrity/${id}/works?start=${start}&count=21&apikey=${apikey}`).then(res=>res.json())
}

/////////////////
//搜索相关接口
export function getDYSS(keyword) {
    return fetch( `https://api.douban.com/v2/movie/search?q=${keyword}&apikey=${apikey}`).then(res=>res.json())
}
