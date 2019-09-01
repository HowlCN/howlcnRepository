import React, { Component } from "react";

import { Actions, Router, Scene } from "react-native-router-flux";
import Home from './pages/home/Home.js'
import Hot from './pages/home/Hot.js'
import Top from './pages/home/Top.js'
import Search from './pages/home/Search.js'
import DetailMovie from './pages/detailMovie/DetailMovie.js'
import DetailActor from './pages/detailActor/DetailActor.js'

export default class myRouter extends Component{
    render(){
        return <Router>
        <Stack key="root">
          <Scene key="home" component={Home} title="Home"/>
          <Scene key="Hot" component={Hot} title="Hot"/>
          <Scene key="Top" component={Top} title="Top"/>
          <Scene key="Search" component={Search} title="Search"/>
          <Scene key="DetailMovie" component={DetailMovie} title="DetailMovie"/>
          <Scene key="DetailActor" component={DetailActor} title="DetailActor"/>
        </Stack>
      </Router>
    }
}