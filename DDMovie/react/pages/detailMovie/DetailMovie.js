import React, { Component } from "react"
import { Actions } from "react-native-router-flux"
//电影条目信息
import { getDYXX, getDYJZ, getDYDP } from '../../request.js'
import Swiper from "react-native-swiper"
import StarRating from 'react-native-star-rating'
import { FadeInView, FadeInView2, FadeInView3, FadeInView4 } from './Animated.js'
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Button,
  Platfrom,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StatusBar
} from "react-native";


//电影详情  接收电影id
//     例子ID：1764796
export default class DetailMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //电影详情数据
      moviePho: {},
      firstUrl: '',
      secondUrl: '',
      thirdUrl: '',
      movieDet: {},
      coverImg: '',
      movieGenres: '',
      rating: {},
      firstWord: '',
      summary: '',
      actor: '',
      linesNum: 4,
      text: '',
      imgheight: new Animated.Value(0),  // 图片长度初始值0
      imgwidth: new Animated.Value(0),    // 图片宽度初始值0
      borderRadiusnum: new Animated.Value(0), //图片的border-radius
      height: 260,
      comments: ''    //电影短评
    }
  }
  componentWillMount() {
    //初始化值
    this.firstLineNum();
  }
  componentDidMount() {
    //请求电影条目剧照
    this.getMoviePhoto();
    //电影详情
    this.getMovieDetail();
    this.getMovieComments();

  }
  //获取电影剧照
  getMoviePhoto() {
    getDYJZ(this.props.id)
      .then(res => {
        this.setState(() => {
          return {
            moviePho: res,
            starCount: res.stars,
          }
        }, () => {
          Animated.parallel([
            Animated.timing(this.state.imgheight,            // 动画中的变量值
              {
                toValue: 360,                   // 透明度最终变为1，即完全不透明
                duration: 1000,              // 让动画持续一段时间
              }),
            Animated.timing(this.state.imgwidth,            // 动画中的变量值
              {
                toValue: 360,                   // 透明度最终变为1，即完全不透明
                duration: 1000,              // 让动画持续一段时间
              }),
            Animated.timing(this.state.borderRadiusnum,            // 动画中的变量值
              {
                toValue: 180,                   // 透明度最终变为1，即完全不透明
                duration: 1000,              // 让动画持续一段时间
              })
          ]).start(() => {
            this.setState(() => {
              return {
                height: 0,
                imgheight: 0,
              }
            })
          });
        })
        this.getPhotosUrl();
      })
  }
  //获取电影信息
  getMovieDetail() {
    getDYXX(this.props.id)
      .then(res => {
        this.setState(() => {
          return {
            movieDet: res,
            movieGenres: res.genres.join("·"),
            rating: res.rating,
            firstWord: res.summary[0],
            actor: res.casts,
            coverImg: res.images.small,
          };
        })
        this.sliceSummary();
      })
  }

  //获取电影短评
  getMovieComments() {
    getDYDP(this.props.id)
      .then(res => {
        this.setState(() => {
          return {
            comments: res.comments
          }
        })
      })
  }
  //获取轮播图的图片地址
  getPhotosUrl() {
    this.setState({
      firstUrl: this.state.moviePho.photos[0].thumb,
      secondUrl: this.state.moviePho.photos[1].thumb,
      thirdUrl: this.state.moviePho.photos[2].thumb
    })
  }

  //处理summary的值
  sliceSummary() {
    var a = this.state.movieDet.summary.length
    var summarya = this.state.movieDet.summary.slice(1, a)
    this.setState({
      summary: summarya
    })
  }
  //处理名字的格式
  rename(name) {
    var rename1 = name.split(" ");
    return rename1;
  }

  //改变简介行高
  changeLine() {
    if (this.state.linesNum == 4) {
      this.setState({
        linesNum: 20,
        text: 'close'
      })
    } else {
      this.setState({
        linesNum: 4,
        text: 'more'
      })
    }
  }
  //行高值初始化
  firstLineNum() {
    this.setState({
      linesNum: 4,
      text: 'more'
    })
  }



  render() {
    return (
      <View style={styles.root}>
        <ScrollView>
          <StatusBar
            barStyle={'light-content'}
            translucent
            backgroundColor="rgba(0, 0, 0, 0)"
          />
          <View style={styles.swiper}>
            <ImageBackground source={{ uri: this.state.coverImg }} style={{ width: '100%', height: this.state.height, zIndex: 1 }}>
              <View style={{ width: '100%', height: this.state.height, position: 'absolute', top: 0, left: 0, zIndex: 1, overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View
                  style={{
                    zIndex: 1,
                    overflow: 'hidden',
                    width: this.state.imgheight,
                    height: this.state.imgwidth,
                    borderRadius: this.state.borderRadiusnum
                  }}
                  source={{ uri: this.state.firstUrl }}
                >
                  <Image
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                    source={{ uri: this.state.firstUrl }}
                  ></Image>
                </Animated.View>
              </View>
            </ImageBackground>
            <Swiper
              style={styles.wrapper}
              loop={true}
              showsButtons={false}
              autoplay={false}
              paginationStyle={{ bottom: 7 }}
              activeDot={<View style={{ backgroundColor: "#f9f9f9", width: 30, height: 2 }} />}
              dot={<View style={{ backgroundColor: "#ccc", width: 30, height: 2 }} />}
              autoplayTimeout={5}
            >
              <TouchableHighlight style={styles.slide1}>
                <Image
                  style={styles.swiperImage}
                  source={{ uri: this.state.firstUrl }}
                />
              </TouchableHighlight>
              <TouchableHighlight style={styles.slide2}>
                <Image
                  style={styles.swiperImage}
                  source={{ uri: this.state.secondUrl }}
                />
              </TouchableHighlight>
              <TouchableHighlight style={styles.slide3}>
                <Image
                  style={styles.swiperImage}
                  source={{ uri: this.state.thirdUrl }}
                />
              </TouchableHighlight>
            </Swiper>
          </View>
          <View style={styles.message}>
            <View style={{ alignItems: 'center', width: 200, height: 80, position: 'relative' }}>
              <FadeInView style={{ alignItems: 'center', width: 200, height: 80, position: 'absolute', left: 0 }}>
                <Text style={styles.title}>{this.state.movieDet.title}</Text>
                <Text style={styles.moviemsg}>{this.state.movieGenres}</Text>
                <View style={{ flexWrap: 'nowrap', flexDirection: 'row' }}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={this.state.rating.average / 2}
                    // selectedStar={(rating) => this.onStarRatingPress(rating)}
                    fullStarColor={'#f9bd01'}
                    starSize={14}
                    emptyStarColor={'#d0d1d1'}
                  /><Text style={styles.average}>{this.state.rating.average}</Text>
                </View>
              </FadeInView>
            </View>
            <View style={{ width: '100%', position: 'relative' }}>
              <FadeInView2 style={styles.buttons}>
                <View style={styles.clickbutton}>
                  <TouchableOpacity>
                    <Image
                      style={styles.buttonimg}
                      source={require('../../assets/icon2/message.png')}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style={styles.clickbutton}>
                  <TouchableOpacity>
                    <Image
                      style={styles.buttonimg}
                      source={require('../../assets/icon2/like.png')}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style={styles.clickbutton}>
                  <TouchableOpacity>
                    <Image
                      style={styles.buttonimg}
                      source={require('../../assets/icon2/share.png')}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style={styles.clickbutton}>
                  <TouchableOpacity>
                    <Image
                      style={styles.buttonimg}
                      source={require('../../assets/icon2/download.png')}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </FadeInView2>
            </View>
          </View>
          <View style={styles.introduce}>
            <View style={{ width: '100%', height: 30 }}>
              <View style={{ width: "100%", height: 30, alignItems: 'center', position: 'relative' }}>
                <FadeInView style={{ width: "100%", height: 30, alignItems: 'center', position: 'absolute', left: 0 }}>
                  <Text style={{ fontSize: 18, marginTop: 15 }}>INTRODUCE</Text>
                  <View style={{ width: 32, height: 4, position: 'absolute', top: 26.5, left: '47%', backgroundColor: "#f6b100", zIndex: -1 }}></View>
                </FadeInView>
              </View>
            </View>
            <FadeInView4 style={{ width: '100%', marginTop: 10, alignItems: 'center' }}>
              <Text style={styles.summary} numberOfLines={4 && this.state.linesNum} textAlignVertical={'top'}>
                <Text style={styles.firstWord}>{this.state.firstWord}</Text>
                {this.state.summary}
              </Text>
              <TouchableOpacity onPress={() => { this.changeLine() }}>
                <Text style={{ fontSize: 12, marginLeft: "80%", color: '#f6b100' }}>{this.state.text} ></Text>
              </TouchableOpacity>
            </FadeInView4>
            <View style={{ width: "100%", height: 100, position: 'relative' }}>
              <FadeInView3 style={{ width: "100%", height: 100, position: 'absolute', left: 0 }}>
                <FlatList
                  horizontal={true}
                  data={this.state.actor}
                  renderItem={({ item }) => <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 20 }}>
                    <View style={{flex:1}}>
                    <TouchableOpacity onPress={() => { this.goDetailActor(item.id); }}>
                      <Image
                        style={styles.headpho}
                        source={{ uri: item.avatars.small }}
                      ></Image>
                    </TouchableOpacity>
                    <View
                      style={styles.name}>
                      <Text style={{ fontSize: 10, color: 'gray' }}>{this.rename(item.name_en)[0]}</Text>
                      <Text style={{ fontSize: 10, color: 'gray' }}>{this.rename(item.name_en)[1]}</Text>
                    </View>
                    </View>
                  </View>}
                />
              </FadeInView3>
            </View>
            <View style={{
              width: "100%", marginBottom: 10, borderTopLeftRadius: 10,marginTop: 3,borderTopRightRadius:10}}>
              <FlatList
                ListHeaderComponent={this._createListHeader}
                ItemSeparatorComponent={this._separator}
                data={this.state.comments}
                ListFooterComponent={this._createListFooter}
                renderItem={({ item }) => <View style={{ width: '100%', height: 85, marginTop: 10, borderBottomColor: '#000', display: 'flex', }}>
                  <View style={{ width: '100%', height: 40, position: 'relative' }}>
                    <Image
                      source={{ uri: item.author.avatar }}
                      style={{ width: 34, height: 34, borderRadius: 17, marginLeft: 15 }}
                    ></Image>
                    <Text style={{ position: 'absolute', top: 0, left: 55, fontSize: 14 }}>{item.author.name}</Text>
                    <View style={{ height: 18, width: 65, marginTop: 3, position: 'absolute', top: 19, left: 55 }}>
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={item.rating.value}
                        fullStarColor={'#f9bd01'}
                        starSize={12}
                        emptyStarColor={'#d0d1d1'}
                      />
                    </View>
                    <Text style={{ fontsize: 11, position: 'absolute', top: 19, left: 132 }}>{item.rating.value}.0</Text>
                  </View>
                  <Text numberOfLines={2} style={{ width: '90%', marginLeft: '5%', fontSize: 12, marginTop: 5 }}>{item.content}</Text>
                </View>}
              />
            </View>
          </View>
        </ScrollView>
      </View >
    );
  }
  //flatlist头部
  _createListHeader() {
    return <View style={{ height: 30,lineHeight:30, borderRadius: 40, marginBottom: 10 ,borderBottomLeftRadius:5,borderBottomRightRadius:5,backgroundColor:'#f1f3f4',paddingBottom:3}} >
      <Text style={{ fontSize: 18, paddingLeft: 16, paddingTop: 5 }}>短评</Text>
    </View>;
  }
  //分割线
  _separator() {
    return <View style={{ height: 5, width: '100%', backgroundColor: '#f1f3f4', opacity: 0.5 }} />;
  }
  //flatlist尾部
  _createListFooter = () => {
    return (
      <View style={{ height: 20, width: '100%', borderBottomLeftRadius:10,borderBottomRightRadius:10, paddingLeft: '5%',backgroundColor:'#f1f3f4' }}>
        <Text style={{ color: 'gray', fontSize: 12 }}>
          查看更多短评
        </Text>
      </View>
    )
  }
  //去演员详情
  goDetailActor(id){
    Actions.detailActhor({id:id});
  }
}

//在此处写样式
const styles = StyleSheet.create({
  //组件根样式
  root: {
    flex: 1,
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
    height: 260
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5"
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9"
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  rankShow: {
    flex: 1
  },
  message: {
    height: 150,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 3
  },
  moviemsg: {
    fontSize: 14,
    color: '#cfcfcf',
    marginBottom: 3
  },
  average: {
    fontSize: 14,
    color: '#cfcfcf',
    marginLeft: 3,
    marginTop: -3
  },
  buttons: {
    width: '100%',
    height: 70,
    marginTop: 5,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    position: 'absolute',
    left: 0,
  },
  clickbutton: {
    height: '70%',
    flex: 1,
    marginLeft: 10,
  },
  buttonimg: {
    width:40,
    height: 40,
    marginLeft: '15%'
  },
  introduce: {
    width: '100%',
  },
  firstWord: {
    fontSize: 28,
    width: 30,
    height: 40,
  },
  summary: {
    fontSize: 12,
    paddingLeft: 20,
    paddingRight: 20
  },
  headpho: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
    marginLeft: 11,
  },
  name: {
    width: 60,
    marginLeft: 5,
    marginTop: 5,
    alignItems: 'center',
  }
})
