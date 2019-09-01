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
  Animated,
  Easing
} from "react-native";
//引入轮播图组件
import Swiper from "react-native-swiper";
//引入顶部滚动导航栏
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

// top250 口碑榜 北美票房榜
import Top250 from "./top250/Top250.js";
import KBrank from "./kbrank/KBrank.js";
import BMPFrank from "./bmpfrank/BMPFrank.js";
export default class Top extends Component {
  constructor(props) {
    super(props);
    this.doAnimate = this.doAnimate.bind(this);
    this.state = {
      title: "Top",
      //是否显示遮盖层
      isShowLayer: false,
      //////////////
      //Animate相关值
      animateImg: '',
      //遮盖层的img的top
      A_imgTop: new Animated.Value(0),
      //遮盖层的img的left
      A_imgLeft: new Animated.Value(0),
      //遮盖层的透明度
      A_layerOpacity: new Animated.Value(0)
    };
  }

  render() {
    return (
      <View style={styles.root}>
        <Animated.View style={{width: '100%',height:'100%',display:'none',backgroundColor: '#fff',opacity:this.state.A_layerOpacity,position:'absolute',top:0,left:0,zIndex: this.state.isShowLayer?5:0}}>
          <Animated.View style={{position:'absolute',top:this.state.A_imgTop, left: this.state.A_imgLeft}} ref='img'><Image style={{width: '100%',height: '100%'}} source={{uri: this.state.animateImg}}></Image></Animated.View>
        </Animated.View>
        <View style={styles.swiper}>
          <Swiper
            style={styles.wrapper}
            loop={true}
            autoplay={true}
            paginationStyle={{ bottom: 7 }}
            activeDot={<View style={{ backgroundColor: "#f9f9f9", width: 30, height: 2 }} />}
            dot={<View style={{ backgroundColor: "#ccc", width: 30, height: 2 }} />}
            autoplayTimeout={5}
          >
            <TouchableHighlight style={{ flex: 1 }}>
              <Image
                style={styles.swiperImage}
                source={require('../../assets/images/swiper_1.jpg')}
              />
            </TouchableHighlight>
            <TouchableHighlight style={{ flex: 1 }}>
              <Image
                style={styles.swiperImage}
                source={require('../../assets/images/swiper_2.jpg')}
              />
            </TouchableHighlight>
            <TouchableHighlight style={{ flex: 1 }}>
              <Image
                style={styles.swiperImage}
                source={require('../../assets/images/swiper_3.jpg')}
              />
            </TouchableHighlight>
          </Swiper>
        </View>
        <View style={styles.rankShow}>
          <ScrollableTabView
            style={{ height: 0 }}
            tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
            initialPage={0}
            renderTabBar={() => <ScrollableTabBar style={{ height: 50 }} />}
          >
            <Top250 tabLabel="综合排行榜" doAnimate={this.doAnimate} />
            <KBrank tabLabel="口碑榜" />
            <BMPFrank tabLabel="北美票房" />
          </ScrollableTabView>
        </View>
      </View>
    );
  }
  goDetailMovie(id) {
    Actions.detailMovie({id:id});
  }
  doAnimate(movieId, imgUrl,imgWidth, imgHeight, left, top, endLeft) {
    this.setState(()=>{return{
      isShowLayer: true,
      animateImg: imgUrl,
      A_imgTop: new Animated.Value(top),
      A_imgLeft: new Animated.Value(left)
    }},()=>{
      this.refs.img.setNativeProps({
        style: { width: imgWidth,height:imgHeight},
      });
      Animated.parallel([
        Animated.timing(this.state.A_imgTop, {
          toValue: 20,
          easing: Easing.back(),
          duration: 400
        }),
        Animated.timing(this.state.A_imgLeft, {
          toValue: endLeft,
          duration: 300
        }),
        Animated.timing(this.state.A_layerOpacity, {
          toValue: 1,
          duration: 100
        })
      ]).start(()=>{
        Animated.timing(this.state.A_layerOpacity, {
          toValue: 0,
          duration: 0
        }).start();
        this.setState(()=>{return{
          isShowLayer: false
        }});
        this.goDetailMovie(movieId);
      });
    });
  }
}

//在此处写样式
const styles = StyleSheet.create({
  //组件根样式
  root: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    position:'relative'
  },
  image: {
    height: 25,
    width: 25
  },
  swiperImage: {
    width: '100%',
    height: '100%'
  },
  tabBarUnderlineStyle: {
    backgroundColor: "#F9BC01"
  },
  swiper: {
    height: 200
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  rankShow: {
    flex: 1
  }
});
