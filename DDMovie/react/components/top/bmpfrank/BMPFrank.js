import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ActivityIndicator
} from "react-native";

// top250 口碑榜 北美票房榜
import { getBMPFRank } from "../../../request.js";
export default class BMPFRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "BMPFrank",
      //电影数据
      movies: []
    };
  }
  componentWillMount() {
    this.getMovies();
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.title}>
          <View style={styles.titleInner}>
            <View style={styles.titleLine} />
            <Text style={styles.titleText}>INTRODUCE</Text>
          </View>
        </View>
        <FlatList
          data={this.state.movies}
          keyExtractor={(item, i) => i}
          horizontal={false}
          numColumns={3}
          columnWrapperStyle={styles.columnStyle}
          renderItem={({ item }) => (
            <TouchableHighlight style={styles.touch} onPress={()=>{this.goDetailMovie(item.subject.id)}}>
              <Image
                style={styles.image}
                source={{ uri: item.subject.images.small }}
              />
            </TouchableHighlight>
          )}
          ListEmptyComponent={<ActivityIndicator size={'small'} animating={true}></ActivityIndicator>}
        />
      </View>
    );
  }

  //方法区

  //前往电影详情页
  goDetailMovie = id => {
    Actions.detailMovie({id:id});
  };
  //获取电影数据
  getMovies() {
    if (this.state.pageIdx > 12) return;
    this.setState({
      loadIcon: true
    });
    getBMPFRank(this.state.pageIdx).then(res => {
      this.setState(state => {
        return {
          movies: state.movies.concat(res.subjects),
          loadIcon: false
        };
      });
    });
  }
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
  titleInner: {},
  titleLine: {},
  movieItem: {
    width: "33%",
    height: 100
  },
  image: {
    width: "100%",
    height: "100%"
  },
  touch:{
    width: "26%",
    height: 120
  },
  columnStyle: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
