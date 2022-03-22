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
    StyleSheet,
    Alert
} from 'react-native';
import Sound from 'react-native-sound';
import Orientation from 'react-native-orientation';

import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";


export default class Voice extends Component {
  
  static navigationOptions = {
    headerTitle: '测试视频播放'
  };
  
  constructor(props) {
    super(props);
    this.state = {
      
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
            console.log('resJson' , resJson.data);
            
            this.setState({ resource: resJson.data });
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
        let music = new Sound(URL , null , (error)=>{
                          if(error){
                              Alert.alert("播放失败");  
                          }
                    });
        return( //"http://www.cn901.com/res/91Content/resource/2021/01/22/video/46c31428-3fa2-47d2-ae51-be58a3f8aba0_mp4.mp4"
            // <View style={styles.container}>
            //     <TouchableOpacity style={{marginTop:15}} onPress={()=>{music.play()}}>
            //         <Text style={{color:'#4398ff',fontSize:20}}>
            //             播放本地音乐
            //         </Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity style={{marginTop:15}} onPress={()=>{music.pause()}}>
            //         <Text style={{color:'#4398ff',fontSize:20}}>
            //             暂停
            //         </Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity style={{marginTop:15}} onPress={()=>{music.stop(()=>{music.play()})}}>
            //         <Text style={{color:'#4398ff',fontSize:20}}>
            //             重新开始
            //         </Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity style={{marginTop:15}} onPress={()=>{music.stop(()=>{music.release()})}}>
            //         <Text style={{color:'#4398ff',fontSize:20}}>
            //             停止
            //         </Text>
            //     </TouchableOpacity>
            // </View>
            

        );
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
  container:{
      alignItems:'center',
  },
});