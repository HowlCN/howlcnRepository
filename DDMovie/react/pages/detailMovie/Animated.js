import React, { Component } from "react"
import {
  Animated,
} from "react-native";

//动画组件1s执行完
export class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0.2),  // 透明度初始值设为0
    topAnim: new Animated.Value(15),
  }

  componentDidMount() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.topAnim,            // 动画中的变量值
          {
            toValue: 0,
            duration: 1000,
          }),
        Animated.timing(this.state.fadeAnim,            // 动画中的变量值
          {
            toValue: 1,                   // 透明度最终变为1，即完全不透明
            duration: 1000,              // 让动画持续一段时间
          })
      ])
    ]).start();
  }

  render() {
    let { topAnim, fadeAnim } = this.state;

    return (
      <Animated.View                 // 使用专门的可动画化的View组件
        style={{
          ...this.props.style,
          top: topAnim,
          opacity: fadeAnim
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

//动画2秒执行完
//动画组件
export class FadeInView2 extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0.2),  // 透明度初始值设为0
    topAnim: new Animated.Value(20),
  }

  componentDidMount() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.topAnim,            // 动画中的变量值
          {
            toValue: 0,
            duration: 1200,
          }),
        Animated.timing(this.state.fadeAnim,            // 动画中的变量值
          {
            toValue: 1,                   // 透明度最终变为1，即完全不透明
            duration: 1200,              // 让动画持续一段时间
          })
      ])
    ]).start();
  }

  render() {
    let { topAnim, fadeAnim } = this.state;

    return (
      <Animated.View                 // 使用专门的可动画化的View组件
        style={{
          ...this.props.style,
          top: topAnim,
          opacity: fadeAnim
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export class FadeInView3 extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // 透明度初始值设为0
    topAnim: new Animated.Value(30),
  }

  componentDidMount() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.topAnim,            // 动画中的变量值
          {
            toValue: 0,
            duration: 1600,
          }),
        Animated.timing(this.state.fadeAnim,            // 动画中的变量值
          {
            toValue: 1,                   // 透明度最终变为1，即完全不透明
            duration: 1600,              // 让动画持续一段时间
          })
      ])
    ]).start();
  }

  render() {
    let { topAnim, fadeAnim } = this.state;

    return (
      <Animated.View                 // 使用专门的可动画化的View组件
        style={{
          ...this.props.style,
          top: topAnim,
          opacity: fadeAnim
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

//图片扩张动画


//toumingdu
export class FadeInView4 extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // 透明度初始值设为0
  }

  componentDidMount() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.fadeAnim,            // 动画中的变量值
          {
            toValue: 1,                   // 透明度最终变为1，即完全不透明
            duration: 1000,              // 让动画持续一段时间
          })
      ])
    ]).start();
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // 使用专门的可动画化的View组件
        style={{
          ...this.props.style,
          opacity: fadeAnim
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}