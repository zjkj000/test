import React, {Component} from 'react';
import {
  View, 
  Dimensions, 
  Image, 
  Text, 
  Slider, 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  Button, 
  StyleSheet
} from 'react-native';
//import Slider from '@react-native-community/slider';  //进度图标需要拉动
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import { useNavigation  , useRoute } from "@react-navigation/native";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";

export default function VoiceContainer(props) {
  const navigation = useNavigation();
  console.log('============video=================',props.route.params.resource.resourceName)
  navigation.setOptions({title: props.route.params.resource.resourceName})
  //将navigation传给TodoList组件，防止路由出错
  return (
      <Voice
          navigation={navigation}
      ></Voice>
  );
}

function formatTime(second) {
  let h = 0, i = 0, s = parseInt(second);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
  }
  // 补零
  let zero = function (v) {
    return (v >> 0) < 10 ? "0" + v : v;
  };
  return [zero(h), zero(i), zero(s)].join(":");
}

class Voice extends Component {
  
  static navigationOptions = {
    headerTitle: '测试视频播放'
  };
  
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: "http://124.129.157.208:8810/SD/2017qingdao/xiaoxueEnglish/grade3/b/1.mp4",
      //videoCover: "http://124.129.157.208:8889/data/uploads/kecheng/2018/01/18/5a600b2c99836.png@0o_0l_220w.png",
      videoCover: '',
      videoWidth: screenWidth,
      videoHeight: screenWidth * 9/16, // 默认16：9的宽高比
      showVideoCover: true,    // 是否显示视频封面
      showVideoControl: false, // 是否显示视频控制组件
      isPlaying: false,        // 视频是否正在播放
      currentTime: 0,        // 视频当前播放的时间
      duration: 0,           // 视频的总时长
      isFullScreen: false,     // 当前是否全屏显示
      playFromBeginning: false, // 是否从头开始播放

      resource: '', //api请求的数据data
    };
  }

  UNSAFE_componentWillMount(){  //初始挂载执行一遍
      //oldtype = this.props.resourceType;
      const paramsData = this.props.navigation.getState().routes[3].params;
      console.log(this.props.navigation.getState().routes);
      // const id = paramsData.id;
      // const type = paramsData.type;
      // const deviceType = paramsData.deviceType;
      // this.fetchData(id , type , deviceType);
      this.setState({
          resource: paramsData.resource , 
          videoUrl: paramsData.videoUrl
      })
  }

  fetchData = (id , type , deviceType) => {
      const ip = global.constants.baseUrl;  
      const url = ip + "studentApp_lookMineFloderFile.do";
      const params = {
            id: id,
            type: type,
            deviceType: deviceType,
        }
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            // console.log('resJson' , resJson.data);
            let url = resJson.data.url;
            this.setState({ resource: resJson.data , videoUrl: url });
        })
  }


  //渲染详情页
  showContent = () => {
    const {resource} = this.state;
    const URL = resource.url;
    const resourceName = resource.resourceName;
    if(resource.length <= 0){
        return(
          <Loading show={true}/> 
        );
    }else if(resource.url == "预览文件不存在"){
      return(
          <View style={styles.imageNull}>
            <Image 
                source={require("../../../assets/LatestTaskImages/null.jpg")}  
            />
          </View>
      );
    }else{
        return( //"http://www.cn901.com/res/91Content/resource/2021/01/22/video/46c31428-3fa2-47d2-ae51-be58a3f8aba0_mp4.mp4"
              <View style={styles.container}>
                  {/* <View style={{alignItems: "center"}}>
                    <Text style={{
                        top: screenHeight*0.3,
                        fontSize: 20,
                        fontWeight:'600',
                      }}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                    >
                        {resourceName}
                    </Text>
                  </View> */}
                  <View style={{top: screenHeight*0.3 ,width: this.state.videoWidth, height: 50, backgroundColor:'#000000' }}>
                    <Video
                      ref={(ref) => this.videoPlayer = ref}
                      source={{uri: this.state.videoUrl}}
                      rate={1.0}
                      volume={1.0}
                      muted={false}
                      paused={!this.state.isPlaying}
                      resizeMode={'contain'}
                      playWhenInactive={false}
                      playInBackground={false}
                      ignoreSilentSwitch={'ignore'}
                      progressUpdateInterval={250.0}  //通知频率
                      onLoadStart={this._onLoadStart}
                      onLoad={this._onLoaded}
                      onProgress={this._onProgressChanged}  //播放进度通知
                      onEnd={this._onPlayEnd}
                      onError={this._onPlayError}
                      onBuffer={this._onBuffering}
                      style={{width: this.state.videoWidth, height: 50}}
                    />
                    {
                        <View style={[styles.control, {width: this.state.videoWidth}]}>
                          {/**播放器工具栏 播放暂停图标onControlPlayPress() */}
                          <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlPlayPress() }}>
                            <Image
                              style={styles.playControl}
                              source={this.state.isPlaying ? require('../../../assets/LatestTaskImages/continue.png') : require('../../../assets/LatestTaskImages/pause.png')}
                            />
                          </TouchableOpacity>
                          <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                          {/**进度条 */}
                          <Slider
                            style={{flex: 1}}
                            maximumTrackTintColor={'#999999'}
                            minimumTrackTintColor={'#00c06d'}
                            thumbImage={require('../../../assets/LatestTaskImages/jindu.png')}
                            value={this.state.currentTime}
                            minimumValue={0}
                            maximumValue={this.state.duration}
                            onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}
                          />
                          <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                        </View>
                    }
                  </View>
            </View>
        );
    }
  }
  
  render() {
    return (
        this.showContent()
    )
  }
  
  /// -------Video组件回调事件-------
  
  _onLoadStart = () => {
    console.log('视频开始加载');
  };
  
  _onBuffering = () => {
    console.log('视频缓冲中...')
  };
  
  _onLoaded = (data) => {
    console.log('视频加载完成');
    this.setState({
      duration: data.duration,
    });
  };
  
  _onProgressChanged = (data) => {
    console.log('视频进度更新');
    if (this.state.isPlaying) {
      this.setState({
        currentTime: data.currentTime,
      })
    }
  };
  
  _onPlayEnd = () => {
    console.log('视频播放结束');
    this.setState({
      currentTime: 0,
      isPlaying: false,
      playFromBeginning: true
    });
  };
  
  _onPlayError = () => {
    console.log('视频播放失败');
  };
  
  ///-------控件点击事件-------
  
  
  /// 点击了播放器正中间的播放按钮
  onPressPlayButton() {
    let isPlay = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlay,
      showVideoCover: false
    });
    if (this.state.playFromBeginning) {
      this.videoPlayer.seek(0);
      this.setState({
        playFromBeginning: false,
      })
    }
  }
  
  /// 点击了工具栏上的播放按钮
  onControlPlayPress() {
    this.onPressPlayButton();
  }
  
  
  /// 进度条值改变
  onSliderValueChanged(currentTime) {
    this.videoPlayer.seek(currentTime);
    if (this.state.isPlaying) {
      this.setState({
        currentTime: currentTime
      })
    } else {
      this.setState({
        currentTime: currentTime,
        isPlaying: true,
        showVideoCover: false
      })
    }
  }
  
  
  /// -------外部调用事件方法-------
  
  ///播放视频，提供给外部调用
  playVideo() {
    this.setState({
      isPlaying: true,
      showVideoCover: false
    })
  }
  
  /// 暂停播放，提供给外部调用
  pauseVideo() {
    this.setState({
      isPlaying: false,
    })
  }
  
  
}

const styles = StyleSheet.create({
  imageNull: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: screenHeight*0.2,
      paddingBottom: screenHeight*0.2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  playButton: {
    width: 50,
    height: 50,
  },
  playControl: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  shrinkControl: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  time: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
    marginRight: 10
  },
  control: {
    flexDirection: 'row',
    height: 44,
    alignItems:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
});