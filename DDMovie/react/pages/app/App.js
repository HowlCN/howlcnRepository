/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image
} from "react-native";

import Home from "../../components/home/Home.js";
import Hot from "../../components/hot/Hot.js";
import Top from "../../components/top/Top.js";

import TabNavigator from "react-native-tab-navigator";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "home"
    };
  }
  render() {
    return (
        <TabNavigator
          tabBarStyle={{ height: 50, overflow: "hidden"}}
          sceneStyle={{paddingBottom: 50}}
          style={styles.nav}
        >
          <TabNavigator.Item
            selected={this.state.selectedTab === "home"}
            renderIcon={() => <Image style={styles.image} source={require('./../../assets/icon/unselected/home.png')} />}
            renderSelectedIcon={() => <Image style={styles.image} source={require('./../../assets/icon/selected/home.png')} />}
            onPress={() => this.setState({ selectedTab: "home" })}
          >
            <Home styles={styles.home}></Home>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === "hot"}
            renderIcon={() => <Image style={styles.image} source={require('./../../assets/icon/unselected/hot.png')} />}
            renderSelectedIcon={() => <Image style={styles.image} source={require('./../../assets/icon/selected/hot.png')} />}
            onPress={() => this.setState({ selectedTab: "hot" })}
          >
            <Hot></Hot>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === "top"}
            renderIcon={() => <Image style={styles.image} source={require('./../../assets/icon/unselected/top.png')} />}
            renderSelectedIcon={() => <Image style={styles.image} source={require('./../../assets/icon/selected/top.png')} />}
            onPress={() => this.setState({ selectedTab: "top" })}
          >
            <Top></Top>
          </TabNavigator.Item>
        </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  //组件根样式
  root: {
    flex: 1,
    backgroundColor: "red"
  },
  nav:{
    backgroundColor: 'red'
  },
  image:{
    height: 25,
    width: 25
  },
  exhibit: {
    flex: 1,
    backgroundColor: "orange"
  },
  nav: {
    height: 50
  },
  home:{
    height:'100%'
  }
});
