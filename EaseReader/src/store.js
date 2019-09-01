import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [createPersistedState()],

  state: {
    //是否显示阅读页面
    show: false,
    //是否是返回按钮
    isBack: false,
    //当前阅读的书籍id
    curBookId: '',
    //当前书籍章节数
    length: 0,
    //当前阅读章节号
    chapterIdx: 0,
    //当前用户id
    userId: '5d3efbaec0c7a60d1c542266',
    //是否显示nav
    navShow: true,
    //是否显示登录界面
    showLogin: false,
    //是否显示编辑界面
    showEdit: false
  },
  mutations: {
    //控制显示是否显示阅读界面
    reverseShow(state){ 
      state.show = !state.show;
    },
    reverseIsBack(state){
      state.isBack = !state.isBack;
    },
    reverseShowLogin(state,bool){
      state.showLogin = bool;
    },
    reverseShowEdit(state,bool){
      state.showEdit = bool;
    },
    //设置当前书籍进度
    setBook(state,length,chapterIdx){
      state.length = length;
      state.chapterIdx = chapterIdx;
    },
    //设置用户id
    setUserId(state,id){
      state.userId = id;
    },
    //设置当前书籍id
    setCurBookId(state,id){
      state.curBookId = id;
    },
    // 设置是否显示导航栏
    setNavShow(state, bool){
      state.navShow = bool;
    },
  },
  actions: {
    
  }
})
