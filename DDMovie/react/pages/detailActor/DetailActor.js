import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  Platfrom,
  ActivityIndicator,
  TouchableHighlight,
  FlatList,
  PanResponder,
  Dimensions,
  Animated,
  
  RefreshControl,
  TouchableWithoutFeedback
} from "react-native";

import Swiper from "react-native-swiper";

//演员详情 接收演员id  例子ID：1054395
import { getYYXX, getYYJZ, getYYZP } from "../../request.js";
export default class DetailActor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //屏幕宽度
      windowWidth: Dimensions.get('window').width,
      //页面标题
      title: "DetailActor",
      //演员中文姓名
      actorNameCN: "",
      //演员英文姓名
      actorNameEN: "",
      //演员照片
      actorImage: "",
      //演员简介:
      actorIntro: "",
      //演员作品
      works: [],
      //演员剧照
      photos: [],
      //是否显示全部演员介绍
      textActive: false,
      //是否显示正在加载图标
      loadIcon: true,
      //ScrollView加载控制
      isRefreshing: false,
      //演员生平文本显示行数
      textLine: 4,
      //演员作品分页处理
      pageIdx: 0,
      //是否进入查看演员剧照模式
      photoMode: false,
      //是否开始拖动
      isMove: false,
      //两边的空隙
      sideWidth: 20,
      //行内空隙宽度
      spaceWidth: 25,
      //行与行之间的空隙高度
      rowSpace: 20,
      //图的宽高比
      scale: 7 / 5,
      //每行图片个数
      imgNum: 3,
      //图的宽度
      imgWidth: 0,
      //图的高度
      imgHeight: 0,
      //图片渲染信息
      imgPos: [],
      //滚动距离
      scrollOffset: 0,
      //////////////
      //Animate相关值
      //英文名left
      A_nameENLeft: new Animated.Value(-100),
      //中文名left
      A_nameCNLeft: new Animated.Value(-100),
      //图片圆角
      A_imgRadius: new Animated.Value(125),
      //图片大小
      A_imgHeight: new Animated.Value(60),
      A_imgWidth: new Animated.Value(60),
      //三角高度
      A_triangle: new Animated.Value(48),
      //swiper透明度
      A_swiperOpacity: new Animated.Value(0)
    };
  }
  //////////////////
  //方法区

  /**Animate相关方法 */

  //演员标题入场动画
  A$nameEnter() {
    let self = this;
    Animated.timing(this.state.A_nameENLeft, {
      toValue: 0,
      duration: 400,
    }).start();

    setTimeout(() => {
      Animated.timing(self.state.A_nameCNLeft, {
        toValue: 0,
        duration: 300
      }).start();
    }, 50);
  }

  //演员标题离场动画
  A$nameLeave() {
    let self = this;
    Animated.timing(this.state.A_nameCNLeft, {
      toValue: -200,
      duration: 200
    }).start();
    setTimeout(() => {
      Animated.timing(self.state.A_nameENLeft, {
        toValue: -200,
        duration: 300,
      }).start()
    }, 50);

  }

  //三角进场动画
  A$triangleEnter() {
    Animated.timing(this.state.A_triangle, {
      toValue: 48,
      duration: 400,
    }).start();
  }
  //三角离场动画
  A$triangleLeave(callback) {
    Animated.timing(this.state.A_triangle, {
      toValue: 0,
      duration: 400,
    }).start(callback);
  }
  //swiper进场动画
  A$swiperEnter() {
    Animated.timing(this.state.A_swiperOpacity, {
      toValue: 1,
      duration: 1000,
    }).start();
  }
  //swiper出场动画
  A$swiperLeave(callback) {
    Animated.timing(this.state.A_swiperOpacity, {
      toValue: 0,
      duration: 1000,
    }).start(callback);
  }


  //获取演员基本信息
  actorBaseMsg() {
    getYYXX(this.props.id).then(res => {
      this.setState(() => {
        return {
          actorNameCN: res.name,
          actorNameEN: res.name_en,
          actorImage: res.avatars.large,
          actorIntro: res.summary
        };
      }, () => {
        //获取到数据之后，执行入场动画
        this.A$nameEnter();
        this.initAnimate();
      });
    });
  }
  //获取演员作品
  actorWorks() {
    getYYZP(this.props.id, this.state.pageIdx).then(res => {
      this.setState(state => {
        return {
          works: state.works.concat(res.works),
          isRefreshing: false,
          loadIcon: false
        };
      }, () => {
        this.init();
      });
    });
  }
  //获取演员剧照
  actorPhoto() {
    getYYJZ(this.props.id, 9).then(res => {
      this.setState(state => {
        return {
          photos: state.photos.concat(res.photos)
        };
      });
    });
  }

  //改变演员介绍文字样式
  clickActorIntro() {
    this.setState(state => ({
      textLine: state.textLine == 4 ? 999 : 4
    }));
  }

  //ScrollView中处理触底加载新数据
  handleScrollEnd = event => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;

    const isEndReached = scrollOffset + scrollViewHeight >= contentHeight; // 是否滑动到底部
    const isContentFillPage = contentHeight >= scrollViewHeight; // 内容高度是否大于列表高度

    if (isContentFillPage && isEndReached) {
      this.loadMoreWorks();
    }
  };

  //加载新数据
  loadMoreWorks = () => {
    this.setState(
      state => ({
        pageIdx: state.pageIdx + 1,
        loadIcon: true
      }),
      () => {
        this.actorWorks();
      }
    );
  };

  _onRefresh = () => {
    this.setState(()=>{return{
      pageIdx: 0,
        isRefreshing: true,
        works: [],
        imgPos: []
    }},()=>{
      this.init();
      this.actorWorks();
    })
    
  }

  //判断是否显示加载图标
  isShowLoad = () => {
    if (this.state.loadIcon) {
      return (
        <View>
          <ActivityIndicator size={"small"} animating={true} />
        </View>
      );
    } else {
      return <View />;
    }
  };
  goDetailMovie = id => {
    Actions.detailMovie({ id: id });
  };
  //切换是否显示剧照模式
  changePhotoMode() {

    if (!this.state.photoMode) {
      this.A$nameLeave();
      this.A$triangleLeave(() => {
        this.setState(state => ({
          photoMode: !state.photoMode
        }), () => {
          this.A$swiperEnter();
        });
      });

    } else {
      this.A$swiperLeave(() => {
        this.setState(state => ({
          photoMode: !state.photoMode
        }), () => {
          this.A$nameEnter();
          this.A$triangleEnter();
        });
      });
    }

  }
  //初始化 图片信息的方法
  init() {
    //获取设备宽度
    let { height, width } = Dimensions.get('window');
    //每排显示三张图 图之间留有空隙 共有四个空袭
    const imgWidth = Math.floor((width - this.state.sideWidth * 2 - this.state.spaceWidth * (this.state.imgNum - 1)) / this.state.imgNum);
    const imgHeight = Math.floor(imgWidth * this.state.scale);
    let arrPos = [];
    this.state.works.forEach((item, i) => {
      let curTop = Math.floor(i / this.state.imgNum) * (this.state.rowSpace + imgHeight);
      let curLeft = (i % this.state.imgNum) * (imgWidth + this.state.spaceWidth) + this.state.sideWidth;
      arrPos.push({ top: curTop, left: curLeft });
    });
    this.setState(() => {
      return {
        imgPos: arrPos,
        imgWidth: imgWidth,
        imgHeight: imgHeight
      }
    })
  }
  //根据手指当前位置获取对应元素DOM
  getDOMByPosition(pageX, pageY) {
    let x = pageX - this.state.sideWidth;
    let y = pageY - 253 + this.state.scrollOffset;
    //点击了哪一行
    let rowN = Math.floor(y / (this.state.imgHeight + this.state.rowSpace));
    //点击了哪一列
    let columnN = Math.floor(x / (this.state.imgWidth + this.state.spaceWidth));
    return rowN * 3 + columnN;
  }
  //ScrollView中处理触底加载新数据
  handleScrollEnd = event => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    this.setState(() => {
      return {
        scrollOffset: scrollOffset
      }
    });
    const isEndReached = scrollOffset + scrollViewHeight >= contentHeight - 1; // 是否滑动到底部
    const isContentFillPage = contentHeight >= scrollViewHeight; // 内容高度是否大于列表高度
    if (isContentFillPage && isEndReached) {
      this.loadMoreWorks();
    }
  };

  //动画相关方法
  initAnimate() {
    Animated.parallel([
      Animated.timing(this.state.A_imgRadius, {
        toValue: 0,
        duration: 500
      }),
      Animated.timing(this.state.A_imgHeight, {
        toValue: 250,
        duration: 500
      }),
      Animated.timing(this.state.A_imgWidth, {
        toValue: this.state.windowWidth,
        duration: 500
      })
    ]).start();
  }


  //方法区
  //////////////////

  componentWillMount() {
    this.actorBaseMsg();
    this.actorWorks();
    this.actorPhoto();
    /////////////
    //手势系统创建
    let self = this;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        //当长按1秒之后使得isMove为真，onPanResponderMove内的函数得以执行
        window.homeTimer = setTimeout(() => {
          self.setState((state) => {
            return {
              isMove: true
            }
          });
        }, 1000);
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { pageX, pageY, locationY, locationX } = evt.nativeEvent;  // pageY是相对于根节点的位置，locationY是相对于元素自己
        this.index = this.getDOMByPosition(pageX, pageY);
        let ref = 'works' + this.index;
        this.item = self.refs[ref];
        this.preY = pageY - locationY;   // 保存当前正确点击item的位置，为了后面移动item
        this.preX = pageX - locationX;   // 保存当前正确点击item的位置，为了后面移动item

        //多图片渲染

      },
      onPanResponderMove: (evt, gestureState) => {
        if (self.state.isMove) {
          let top = this.preY + gestureState.dy - 253;
          let left = this.preX + gestureState.dx;
          this.item.setNativeProps({
            style: { top: top, left: left, zIndex: 999 }
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        clearTimeout(window.homeTimer);
        self.setState((state) => {
          return {
            isMove: false
          }
        });
        this.item.setNativeProps({
          style: { zIndex: 1 }
        });
      },
      //////////////////
      //解决滑动之后的BUG
      //////////////////
      onPanResponderTerminate: (evt, gestureState) => {
        clearTimeout(window.homeTimer);
        self.setState((state) => {
          return {
            isMove: false
          }
        });
      }
    });
    //手势系统创建
    /////////////
  }
  componentDidMount() {
  }
  render() {
    let scrollViewHeight = (this.state.imgHeight + this.state.rowSpace) * (Math.floor(this.state.imgPos.length / 3));
    return <View style={styles.root}>
      <View style={styles.actorImage} >
        {this.state.actorImage ? (
          <Animated.Image
            style={[styles.image, { width: this.state.A_imgWidth, height: this.state.A_imgHeight, borderRadius: this.state.A_imgRadius }]}
            source={{ uri: this.state.actorImage }}
          ></Animated.Image>
        ) : (
            <ActivityIndicator size={"small"} animating={true} />
          )}
      </View>
      <ScrollView
        onScrollEndDrag={this.handleScrollEnd}
        style={styles.actorMsgOuter}
        onScrollEndDrag={this.handleScrollEnd}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#ff0000"
            colors={['#F9BC01']}
          />
        }>
        <Animated.View
          style={{
            opacity: this.state.A_swiperOpacity,
            backgroundColor: 'red', width: "100%", height: 250, display: this.state.photoMode ? "flex" : "none"
          }}
        >
          <Swiper
            style={{
              width: "100%",
              height: '100%'
            }}
            showsPagination={false}
            loop={false}
          >
            {this.state.photos.map((item, index) => {
              return (
                <TouchableHighlight
                  key={index}
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.changePhotoMode();
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: item.thumb }}
                  />
                </TouchableHighlight>
              );
            })}
          </Swiper>
        </Animated.View>
        <TouchableWithoutFeedback onPress={() => { this.changePhotoMode(); }}>
          <View style={{ width: "100%", height: 200, position: "relative", display: this.state.photoMode ? "none" : "flex" }}>
            <Animated.View style={{ height: 25, position: "absolute", bottom: 30, left: this.state.A_nameENLeft }} >
              <Image
                style={[
                  styles.image,
                  { position: "absolute", top: 0, left: 0 }
                ]}
                source={require("../../assets/images/nameBg_1.png")}
              />
              <View
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontStyle: "italic",
                    fontWeight: "bold"
                  }}
                >
                  {this.state.actorNameEN}
                </Text>
              </View>
            </Animated.View>
            <Animated.View style={{ height: 20, position: "absolute", bottom: 10, left: this.state.A_nameCNLeft }}>
              <Image
                style={[
                  styles.image,
                  { position: "absolute", top: 0, left: 0 }
                ]}
                source={require("../../assets/images/nameBg_2.png")}
              />
              <View
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 10, fontStyle: "italic" }}>
                  {this.state.actorNameCN}
                </Text>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{
              display: this.state.photoMode ? "none" : "flex",
              height: 48,
              position: "relative"}}>
          <Animated.View
            style={{
              width: "100%",
              position: 'absolute',
              bottom: 0,
              height: this.state.A_triangle
            }}

          >
            <Image
              style={styles.image}
              source={require("../../assets/images/bg.png")}
            />
            <Text
              style={{
                position: "absolute",
                right: 25,
                bottom: 0,
                color: "#131717",
                fontSize: 22,
                fontStyle: "italic"
              }}
            >
              86
            </Text>
            <Text
              style={{
                position: "absolute",
                right: 15,
                bottom: 3,
                color: "#999",
                fontSize: 15,
                fontStyle: "italic"
              }}
            >
              A
            </Text>
          </Animated.View>
        </View>

        <View style={styles.actorMsg}>
          <TouchableHighlight
            underlayColor="#fff"
            style={{ paddingLeft: 15, paddingRight: 15, marginBottom: 20 }}
            onPress={() => {
              this.clickActorIntro();
            }}
          >
            <Text
              numberOfLines={this.state.textLine}
              style={{ fontSize: 12, lineHeight: 20, overflow: "hidden" }}
            >
              {this.state.actorIntro}
            </Text>
          </TouchableHighlight>

          <View style={{ height: scrollViewHeight }}>
            {this.state.imgPos.map((item, i) => {
              return (
                <TouchableHighlight key={i} {...this._panResponder.panHandlers} style={{ position: 'absolute', width: this.state.imgWidth, height: this.state.imgHeight, top: item.top, left: item.left }} onPress={() => { this.goDetailMovie(this.state.works[i].subject.id) }}>
                  <Image
                    style={styles.image}
                    source={{ uri: this.state.works[i].subject.images.small }}
                  />
                </TouchableHighlight>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  }
}

//////////////////
//样式区
const styles = StyleSheet.create({
  //组件根样式
  root: {
    flex: 1,
    position: "relative"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  actorImage: {
    width: "100%",
    height: 250,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actorMsgOuter: {
    flex: 1
  },
  actorMsg: {
    backgroundColor: "#fff",
    paddingTop: 10
  },
  columnStyle: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  touch: {
    width: "26%",
    height: 120
  }
});
//样式区
//////////////////
