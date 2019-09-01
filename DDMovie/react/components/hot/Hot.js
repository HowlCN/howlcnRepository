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
  NativeAppEventEmitter,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  Animated,
  Picker,
  Alert
} from "react-native";

//使用 正在热映接口
import { getZZRY, getDYXX } from '../../request.js'

import AMapLocation from 'react-native-smart-amap-location'

export default class Hot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      city: "北京市",
      test: false,
      title: "HOT",
      isloading: true,
      movies: [],
      count: 5,
      pages: 1,
      ids: [],
      isRefreshing: false,
      fadeAnim: new Animated.Value(-40)
    };
  }

  render() {
    if (this.state.isloading) {
      return <ActivityIndicator size="large"></ActivityIndicator>
    }
    return (
      <View style={styles.br}>
        <View style={styles.pickers}>
          <Text style={{ width: '100%', height: '100%' }}>{this.state.city} </Text>
          <Picker
            selectedValue={this.state.city}
            onValueChange={(sel) => this.changeCity(sel)}
            itemStyle={styles.itempicker}
            mode="dropdown"
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
          >
            <Picker.Item label="北京市" value="北京市" />
            <Picker.Item label="上海市" value="上海市" />
            <Picker.Item label="无锡市" value="无锡市" />
            <Picker.Item label="南京市" value="南京市" />
            <Picker.Item label="深圳市" value="深圳市" />
          </Picker>
        </View>

        <View style={styles.tops}>
          <Text style={styles.texts}>{this.state.title}</Text>
          <Image style={styles.glass} source={require('../../assets/icon/images/glass.png')} />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff0000"
              title="Loading..."
              colors={['#F9BC01']}
            />
          }>
          <FlatList
            data={this.state.movies}
            keyExtractor={(item, i) => i.toString()} // 解决 key 问题
            renderItem={({ item }) => this.renderItem(item)} // 调用方法，去渲染每一项
          />
        </ScrollView>
      </View>
    );
  }
  componentWillMount(){
    AMapLocation.init(null); //使用默认定位配置
    NativeAppEventEmitter.addListener('amap.location.onLocationResult', this._onLocationResult);
  }

  componentDidMount() {
    this.getMovieIds();
    this._showReGeocode();
  }
  componentWillUnmount() {
    //停止并销毁定位服务
    AMapLocation.cleanUp()
  }
//单次定位并返回逆地理编码信息
  _showReGeocode = () => {
    AMapLocation.getReGeocode();
  }
  _onLocationResult = (result) => {
    Alert.alert(`您当前城市为${result.city}`)
    this.setState(()=>{return{
      city: result.city
    }});
  }
  
  _onRefresh = () => {
    this.setState(() => {
      return {
        ids: [],
        movies: [],
        isloading: true,
        isRefreshing: false,
        fadeAnim: new Animated.Value(-40),
      }
    });
    this.getMovieIds();
    this.downs();
  }
  //获得热门电影详情的方法
  getMovieIds = () => {
    // const ids = [];
    const newCount = 10;
    getZZRY(newCount, this.state.city).then(data => {
      for (var i = 0; i < data.subjects.length; i++) {
        this.setState((state) => {
          return {
            ids: state.ids.concat(data.subjects[i].id)
          }
        }, () => {
          if (i == newCount - 1) {
            (this.state.ids).forEach((item, j) => {
              getDYXX(item, j).then(data => {
                this.setState((state) => {
                  return {
                    movies: state.movies.concat(data),
                  }
                }, () => {
                  if (j == newCount - 1) {
                    this.setState(() => {
                      return {
                        isloading: false,
                      }
                    })
                    this.downs();
                  }
                })
              })
            })
          }
        })
      }
    })
  }
  downs = () => {
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        // friction: 3,
        // tension: 50,
        duration: 800,
      }
      )
    ]
    ).start();
  }
  changeCity = (sel) => {
    this.setState(() => {
      return {
        ids: [],
        movies: [],
        isloading: true,
        isRefreshing: false,
        fadeAnim: new Animated.Value(-40),
        city: sel
      }
    });
    this.getMovieIds();
    this.downs();
  }
  goDetailMovie(id) {
    Actions.detailMovie({ id: id });
  }
  rename(averages) {
    var newaverage = averages.toString().split('.');
    if (!newaverage[1] && averages != 0) {
      return [newaverage, 0]
    }
    else if (averages != 0) {
      return newaverage;
    }
    else {
      return [6, 8]
    }
  }
  renderItem = (item) => {
    return <TouchableHighlight underlayColor="#fff" onPress={() => { this.goDetailMovie(item.id) }}>
      <View style={styles.items}>
        <View style={{ width: "100%", height: 220, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: item.photos[0].thumb }} style={styles.images}></Image>
          <Image style={styles.play} source={require('../../assets/icon/images/play.png')} />
        </View>
        <View>
          <Text style={styles.textOne}>{item.title}</Text>
          <Text style={styles.textTwo}>#{item.genres[0]}   #{item.tags[1]}   #{item.tags[2]}</Text>
          <Animated.Image
            style={[styles.count, { top: this.state.fadeAnim }]}
            source={require('../../assets/icon/images/count.png')} />
          <Animated.View style={[styles.textCountOnes, { top: this.state.fadeAnim }]}>
            <Text style={styles.textCountOne}>{this.rename(item.rating.average)[0]}</Text>
            <Text style={styles.textCountTwo}>{"." + this.rename(item.rating.average)[1]}</Text>
          </Animated.View>
          <Text style={styles.textThree} numberOfLines={2}><Text >{item.summary}</Text></Text>
        </View>
      </View>
    </TouchableHighlight>
  }

}
//渲染每一条数据的方法


//在此处写样式
const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
  },
  pickers: {
    width: 70,
    height: 30,
    marginLeft: 10,
    position: "absolute",
    left: 0,
    top: 21,
    zIndex: 10
  },
  itempicker: {
    paddingLeft: 30,
  },
  //组件根样式
  root: {
    // flex: 1,
    backgroundColor: "orange"
  },
  tops: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    textAlign: 'center',
  },
  glass: {
    width: 19,
    height: 19,
    position: "absolute",
    top: 26,
    right: 18,
  },
  texts: {
    lineHeight: 60,
  },
  images: {
    width: "100%",
    height: "100%",
    resizeMode: 'stretch',
    position: 'absolute',
    zIndex: -1
  },
  br: {
    backgroundColor: "#E9E9EA",
    marginBottom: 35,
  },
  items: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    flexDirection: 'column',
    paddingBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 3,
    marginTop: 2,
  },
  textOne: {
    fontSize: 14,
    // fontWeight:'bold',
    paddingLeft: 10,
    paddingTop: 5,
  },
  textTwo: {
    fontSize: 10,
    color: "gray",
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },
  textThree: {
    // fontWeight:"300",
    color: "#2E2D2D",
    fontSize: 10,
    paddingLeft: 10,
    paddingRight: 5,
    paddingBottom: 3,
  },
  play: {
    width: 45,
    height: 45
  },
  count: {
    width: 35,
    height: 43,
    zIndex: -2,
    position: "absolute",
    top: -40,
    right: 18,
    zIndex: -999,
  },
  textCountOne: {
    fontSize: 20,
    fontWeight: "bold",
    zIndex: -9,
    position: "absolute",
    top: 3,
    right: 32,
  },
  textCountOnes: {
    fontSize: 20,
    fontWeight: "bold",
    zIndex: -9,
    position: "absolute",
    top: 3,
    right: 2,
  },
  textCountTwo: {
    fontSize: 12,
    fontWeight: "bold",
    zIndex: -9,
    position: "absolute",
    top: 11,
    right: 20,
  },
});
