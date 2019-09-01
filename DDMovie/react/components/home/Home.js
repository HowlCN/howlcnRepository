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
  Animated,
  StatusBar
} from "react-native";

//新片榜
import { getXPRank } from '../../request.js'

import Swiper from 'react-native-swiper'


import StarRating from 'react-native-star-rating'


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //分页起始下标
      pageIdx: 0,
      //电影数据
      movies: [],
      text: "Search",
      lunbo: {
        name: "行星",
        type: "宇宙/自然"
      },
      left_Anim: new Animated.Value(-200),
      left_Anim2: new Animated.Value(-200),
    }
  }
  componentDidMount() {
    this.getNewMovies();
    this.pzAnimate()
  }
  render() {
    return <View style={styles.wrapper}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor="rgba(0, 0, 0, 0)"
      />
      <View>
        <View style={styles.topzujian}></View>
        <View style={styles.search}>
          <View style={{flexDirection:"row",flexWrap:"nowrap"}}>
            <Image
              style={styles.tubiao}
              source={require("../../assets/images/Search.png")}
            />
            <TextInput
              style={styles.zuozujian}
              onChangeText={(text) => this.setState({ text })}
              placeholder={'搜索'}
            ></TextInput>
            <View style={styles.youzujian}>
              <Image
                style={styles.tubiao2}
                source={require("../../assets/images/JiLu.png")}
              />
              <Image
                style={styles.tubiao3}
                source={require("../../assets/images/DownLoad.png")}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.swiper}>
        <Swiper
          style={styles.wrapper}
          //循环
          loop={true}
          //自动播放
          autoplay={true}
          //设置页面原点样式
          paginationStyle={{ bottom: 7 }}
          //原点被选状态的样式
          activeDot={<View style={{ backgroundColor: "#f9f9f9", width: 30, height: 2 }} />}
          //原点样式
          dot={<View style={{ backgroundColor: "#ccc", width: 30, height: 2 }} />}
          //自动播放时间隔时间
          autoplayTimeout={4}
          onIndexChanged={(index) => { this.pzAnimate(index) }}
        >
          <TouchableHighlight style={styles.slide}>
            <Image
              style={styles.swiperImage}
              source={require('../../assets/images/haibao1.jpg')}
            ></Image>
          </TouchableHighlight>
          <TouchableHighlight style={styles.slide}>
            <Image
              style={styles.swiperImage}
              source={require('../../assets/images/haibao2.jpg')}
            />
          </TouchableHighlight>
          <TouchableHighlight style={styles.slide}>
            <Image
              style={styles.swiperImage}
              source={require('../../assets/images/haibao3.jpg')}
            />
          </TouchableHighlight>
        </Swiper>

      </View>
      <View><Text style={styles.biaoti}>新片榜</Text></View>

      <FlatList
        data={this.state.movies}
        //解决key问题
        keyExtractor={(item, i) => i}
        //是否设置为水平布局
        horizontal={false}
        //每一行排列的item的数量
        numColumns={3}
        //整个FlastList的样式
        columnWrapperStyle={styles.columnStyle}
        //调用方法去渲染每一项
        renderItem={({ item }) => (
          <View style={styles.touch}>
            <TouchableHighlight onPress={() => { this.goDetailMovie(item.id) }}>
              <Image
                style={styles.image}
                source={{ uri: item.images.small }}
              />
            </TouchableHighlight>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.pingfeng}>
              <StarRating
                //星星是否能被点击
                disabled={false}
                //最多几个星
                maxStars={5}
                //星星大小
                starSize={10}
                //星星空着时候的样子
                emptyStarColor="#fff"
                //星星的宽度
                containerStyle={{ width: 15 }}
                //星星填充的颜色
                fullStarColor="orange"
                //要填的星星评分
                rating={item.rating.stars / 10}
              />
              <Text style={styles.pingfengnum}>{item.rating.average}分</Text>
            </View>

          </View>
        )}
        ListEmptyComponent={<ActivityIndicator size={'small'} animating={true}></ActivityIndicator>}
      />
    </View>

  }
  //获取电影信息
  getNewMovies() {
    if (this.state.pageIdx > 12) return;
    getXPRank().then(data => {
      this.setState(state => {
        return {
          movies: data.subjects,
        };
      });
    });
  };
  //路由跳转页面
  goDetailMovie = id => {
    Actions.detailMovie({ id: id });
  };
  //根据每次轮播图页面切换的index修改内容
  pzChange = (index) => {
    if (index == 0) {
      this.setState(state => {
        return {
          lunbo: {
            name: "行星",
            type: "宇宙/自然"
          }
        };
      })
    }
    else if (index == 1) {
      this.setState(state => {
        return {
          lunbo: {
            name: "哪吒之魔童降世",
            type: "喜剧/动画"
          }
        };
      })
    } else if (index == 2) {
      this.setState(state => {
        return {
          lunbo: {
            name: "使徒行者2",
            type: "剧情/动作/犯罪"
          }
        };
      })
    }
  }

  //轮播切换动画
  tabSwiper() {
    Animated.timing(this.state.left_Anim, {
      toValue: -200,
      duration: 600,
    }).start(() => {
      Animated.timing(
        this.state.left_Anim,
        {
          toValue: 0,
          duration: 300,
        }
      ).start();
    })
  }

  tabSwiper2() {
    Animated.timing(this.state.left_Anim2, {
      toValue: -200,
      duration: 400,
    }).start(() => {
      Animated.timing(
        this.state.left_Anim2,
        {
          toValue: 0,
          duration: 500,
        }
      ).start();
    })
  }

  pzAnimate = (index) => {
    this.tabSwiper();
    this.tabSwiper2();
    this.pzChange(index);

  }
}

//在此处写样式
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  swiperImage: {
    width: '100%',
    height: '100%'
  },
  slide: {
    flex: 1
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  swiper: {
    height: 160
  },
  biaoti: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10
  },
  columnStyle: {
    width: "100%",
    height: 165,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  touch: {
    width: "26%",
    height: 155,
    paddingBottom: 25
  },
  image: {
    width: "100%",
    height: "100%"
  },
  title: {
    textAlign: "center",
    overflow: "hidden",
    height: 20
  },
  search: {
    width: "100%",
    height: 60,
    backgroundColor: "#000",
    position: "relative"
  },
  tubiao: {
    width: 25,
    height: 25,
    position: "absolute",
    left: 30,
    top: 20,
    zIndex: 10
  },
  topzujian:{
    width:"100%",
    height:20,
    backgroundColor:"#000",
  },
  zuozujian: {
    flex: 1,
    marginLeft:20,
    marginTop:10,
    backgroundColor: "#d8d9d7",
    height:40,
    borderRadius:20,
    color:"white",
    paddingLeft:40,
  },
  youzujian: {
    width: 90,
    height: 60,
    position: "relative"
  },
  tubiao2: {
    width: 25,
    height: 25,
    position: "absolute",
    right: 45,
    top: 20,
    zIndex: 10
  },
  tubiao3: {
    width: 25,
    height: 25,
    position: "absolute",
    right: 10,
    top: 20,
    zIndex: 10
  },
  name: {
    position: "relative",
  },
  namebg: {
    width: "45%",
    height: 30,
    position: "absolute",
    top: -70,
    left: 0,
    zIndex: 10
  },
  namezi: {
    width: "45%",
    height: 30,
    textAlign: "center",
    position: "absolute",
    top: -65,
    left: 0,
    zIndex: 20
  },
  type: {
    position: "relative",
  },
  typebg: {
    width: "35%",
    height: 25,
    position: "absolute",
    top: -35,
    left: 0,
    zIndex: 10
  },
  typezi: {
    width: "35%",
    height: 25,
    textAlign: "center",
    position: "absolute",
    top: -32,
    left: 0,
    zIndex: 20
  },
  pingfeng: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: 2,
    justifyContent: "space-between"
  },
  pingfengnum: {
    fontSize: 10,
  },
});
