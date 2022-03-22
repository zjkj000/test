import React, {Component} from 'react';
import {
    View, 
    Dimensions, 
    Image, 
    Text, 
    //Slider, 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    Button, 
    StyleSheet,
    Alert
} from 'react-native';

import { Slider } from 'react-native-elements';
import Sound from 'react-native-sound';

import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";

let music;
let totalTime;
let totalMin; //总分钟数
let totalSec; //总分钟秒数
let maximumValue; //滑块最大值(总时长)

export default class Voice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: 0.5,
      seconds: 0, //秒数
      nowMin: 0, //当前分钟
      nowSec: 0, //当前秒数

      resource: '', //api请求的数据data
    };
  }

  UNSAFE_componentWillMount(){  //初始挂载执行一遍
      //oldtype = this.props.resourceType;
      const paramsData = this.props.navigation.getState().routes[3].params;
      //console.log(this.props.navigation.getState().routes[3].params)

      const id = paramsData.id;
      const type = paramsData.type;
      const deviceType = paramsData.deviceType;
      this.fetchData(id , type , deviceType);
  }

  componentWillUnmount(){
      this.time && clearTimeout(this.time);
      music.release();
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
            //console.log('resJson' , resJson.data);           
            this.setState({ resource: resJson.data });
        })
  }

  //声音+
  _addVolume = (music) => {
      let volume = this.state.volume;
      volume += 0.1;
      volume = parseFloat(volume).toFixed(1) * 1;
      if(volume > 1){
          Alert.alert("目前已经是最大音量");
      }
      this.setState({ volume: volume });
      music.setVolume(volume);
  }

  //声音-
  _reduceVolume = (music) => {
      let volume = this.state.volume;
      volume -= 0.1;
      volume = parseFloat(volume).toFixed(1) * 1;
      if(volume < 0){
          Alert.alert("当前为静音");
      }
      this.setState({ volume: volume });
      music.setVolume(volume);
  }

  // 播放
	_play = (music) => {
      music.play();
      this.time = setInterval(() => {
        music.getCurrentTime(seconds => {
          seconds = Math.ceil(seconds);
          this._getNowTime(seconds);
        })
      },1000)
	}

  // 暂停
	_pause = (music) => {
      clearInterval(this.time);
      music.pause();
	}
  // 停止
  _stop = (music) => {
      clearInterval(this.time);
      this.setState({
          nowMin: 0,
          nowSec: 0,
          seconds: 0,
      })
      music.stop();
  }

  _getNowTime = (seconds) => {
      let nowMin = this.state.nowMin,
      nowSec = this.state.nowSec;
      if(seconds >= 60){
        nowMin = parseInt(seconds/60); //当前分钟数
        nowSec = seconds - nowMin * 60;
        nowSec = nowSec < 10 ? '0' + nowSec : nowSec;
      }else{
        nowSec = seconds < 10 ? '0' + seconds : seconds;
      }
      this.setState({
          nowMin: nowMin,
          nowSec: nowSec,
          seconds: seconds,
      })
	}

  //渲染详情页
  showContent = () => {
    const {resource} = this.state;
    const {nowMin , nowSec} = this.state;
    const URL = resource.url;
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
        music = new Sound(URL , null , (error)=>{
                        if(error){
                            //Alert.alert("播放失败");  
                            console.log('播放失败');
                            return;
                        }else{
                            totalTime = music.getDuration(); //音频总时长
                            totalTime = Math.ceil(totalTime);
                            console.log('totalTime' , totalTime);
                            maximumValue = totalTime;
                            Math.ceil(music.getDuration());
                            totalMin = parseInt(totalTime / 60); //总分钟数
                            console.log('totalMin' , totalMin);
                            totalSec = totalTime - totalMin * 60; //秒钟数并判断前缀是否 + '0'
                            totalSec = totalSec > 9 ? totalSec : '0' + totalSec;
                            console.log('totalSec' , totalSec);
                            //return;
                        }
                });
        //console.log(music.getDuration());
        if(totalTime != null){
            console.log(totalTime);
            console.log(totalMin);
            console.log(totalSec);
        }
        return( //"http://www.cn901.com/res/91Content/resource/2021/01/22/video/46c31428-3fa2-47d2-ae51-be58a3f8aba0_mp4.mp4"
            <View style={styles.container}>
                <Slider
                      // disabled //禁止滑动
                      maximumTrackTintColor={'#999999'} //右侧轨道的颜色
                      minimumTrackTintColor={'#00c06d'} //左侧轨道的颜色
                      maximumValue={maximumValue} //滑块最大值
                      minimumValue={0} //滑块最小值
                      value={this.state.seconds}					
                      onSlidingComplete={(value)=>{ //用户完成更改值时调用的回调（例如，当滑块被释放时）
                                              value = parseInt(value);
                                              this._getNowTime(value)
                                              // 设置播放时间
                                              music.setCurrentTime(value);
                                          }}
                />
                <Text>{nowMin}:{nowSec}/{totalMin}:{totalSec}</Text>
                <Text>当前音量: {this.state.volume}</Text>
                <Text  style={{color:'#4398ff',fontSize:20}} onPress={this._play(music)}>播放</Text>
                {/* <Text onPress={this._addVolume(music)}>声音+</Text>
                <Text onPress={this._reduceVolume(music)}>声音-</Text>
                <Text onPress={this._play(music)}>播放</Text>
                <Text onPress={this._pause(music)}>暂停</Text>
                <Text onPress={this._stop(music)}>停止</Text> */}
            </View>
            // <TouchableOpacity style={{marginTop:15}} onPress={()=>{music.play()}}>
            //         <Text style={{color:'#4398ff',fontSize:20}}>
            //              播放本地音乐
            //          </Text>
            // </TouchableOpacity>
        )
    }
  }
  
  render() {
    return (
        this.showContent()
    )
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
      backgroundColor: '#F5FCFF',
	},
});