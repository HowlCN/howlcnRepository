import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions
} from "react-native";

// top250 口碑榜 北美票房榜
import { getTop250 } from "../../../request.js";

export default class Top250 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Top250",
      //分页起始下标
      pageIdx: 0,
      //电影数据
      movies: [],
      //是否有数据
      isData: false,
      //是否显示正在加载图标
      loadIcon: false,
      //refValue
      refV: 0,
      //滚动距离
      scrollOffset: 0
      // //图片宽度
      // imgWidth:0,
      // //图片高度
      // imgHeight: 0

    };
  }
  componentWillMount() {
    this.getMovies();
  }

  componentDidMount() {
  }

  // _onLayout(e){
  //   let width = e.nativeEvent.layout.width;
  //   let height = e.nativeEvent.layout.height
  //   this.setState(()=>{
  //     return{
  //       imgWidth: width,
  //       imgHeight: height
  //     }})
  // }
  //返回ref绑定值
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.title} ref='xxxxx'>
          <View style={styles.titleInner}>
            <View style={styles.titleLine} />
            <Text style={styles.titleText}>INTRODUCE</Text>
          </View>
        </View>
        <FlatList
          onScrollEndDrag={this.handleScrollEnd}
          data={this.state.movies}
          keyExtractor={(item, i) => i}
          horizontal={false}
          numColumns={3}
          columnWrapperStyle={styles.columnStyle}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.touch}
              onPress={(e) => {
                this.sendToFather(e,item.id, item.images.small);
              }}
            >
              <Image
                style={styles.image}
                source={{ uri: item.images.small }}
              />
            </TouchableHighlight>
          )}
          onEndReachedThreshold={0.5}
          onEndReached={this.loadMoreWorks}
          ListEmptyComponent={<ActivityIndicator size={'small'} animating={true}></ActivityIndicator>}
          ListFooterComponent={this.isShowLoad}

        ></FlatList>
      </View>
    );
  }

  //方法区

    //ScrollView中处理触底加载新数据
    handleScrollEnd = event => {
      const scrollOffset = event.nativeEvent.contentOffset.y;
      this.setState(()=>{return {
        scrollOffset: scrollOffset
      }});
    };

  sendToFather(e,id,imgUrl){
    let { height, width } = Dimensions.get('window');
    let x = e.nativeEvent.pageX;
    let y = e.nativeEvent.pageY-259.5+this.state.scrollOffset;
    //3 是一行的图片数  0.29=图片百分比+间隙百分比=0.25+0.04
    let left = Math.floor(x/(width/3))*(width/3)+width*0.04;
    //150 是一行的高度
    let top = Math.floor(y/150)*150-this.state.scrollOffset+259.5;
    this.props.doAnimate(id,imgUrl,width/4,120,left,top,(width-width*0.25)/2);
  }
  //获取电影数据
  getMovies() {
    if (this.state.pageIdx > 12) return;
    getTop250(this.state.pageIdx).then(res => {
      this.setState(state => {
        return {
          movies: state.movies.concat(res.subjects),
          isData: true,
          loadIcon: false
        };
      });
    });
  }

  //上拉加载新数据
  loadMoreWorks = () => {
    this.setState(
      state => ({
        pageIdx: state.pageIdx + 1,
        loadIcon: true
      }),
      () => {
        this.getMovies();
      }
    );
  };
  //判断是否显示加载图标
  isShowLoad = () => {
    if (!this.state.isData) return <View></View>;
    if (this.state.loadIcon) return <View>
      <ActivityIndicator size={"small"} animating={true} />
    </View>;
    return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text>上拉加载</Text>
    </View>;
  };
}

//在此处写样式
const styles = StyleSheet.create({
  //组件根样式
  root: {
    flex: 1,
    borderTopWidth: 8,
    borderTopColor: "#eee"
  },
  title: {
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 15
  },
  titleInner: {
    position: 'relative'
  },
  titleLine: {
    width: 60,
    height: 2,
    backgroundColor: "#F9BC01",
    position: 'absolute',
    top: 9,
    left: 10,
    zIndex: -1
  },
  movieItem: {
    width: "33%",
    height: 100
  },
  image: {
    width: "100%",
    height: "100%"
  },
  touch: {
    width: "25%",
    height: 120
  },
  columnStyle: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
