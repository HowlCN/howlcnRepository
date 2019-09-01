import React, { Component } from 'react'
import { Router, Stack, Scene } from 'react-native-router-flux'

import App from './pages/app/App.js'
import DetailMovie from './pages/detailMovie/DetailMovie.js'
import DetailActhor from './pages/detailActor/DetailActor.js'

export default class Main extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    // componentWillReceiveProps(nextprops){

    // }
    render() {
        return <Router sceneStyle={{ backgroundColor: 'white' }}>
          <Stack key="root" headerLayoutPreset="center">
            <Scene key="app" component={App} navTransparent={true} hideNavBar={true} navigationBarStyle={{height: 30}} navBarButtonColor={"rgba(255,255,255,0.9)"}/>
            <Scene key="detailMovie" component={DetailMovie} navTransparent={true} navigationBarStyle={{height: 30}} navBarButtonColor={"rgba(255,255,255,0.9)"}/>
            <Scene key="detailActhor" component={DetailActhor} navTransparent={true} navigationBarStyle={{height: 30}} navBarButtonColor={"rgba(255,255,255,0.9)"}/>
          </Stack>
        </Router>
      }
}