import React from 'react';
import {StyleSheet,
    View,
    Button,
    Text,
    Image,
} from "react-native";
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";
import Video from "react-native-video";
import '../../../utils/global/constants';


export default class VideoOrVoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
       resource: '', 
    };
  }

  UNSAFE_componentWillMount(){  //初始挂载执行一遍
      //oldtype = this.props.resourceType;
      const paramsData = this.props.navigation.getState().routes[3].params;
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
            <View style={styles.image}>
              <Image 
                  source={require("../../../assets/LatestTaskImages/null.jpg")}  
              />
            </View>
        );
      }else{
          console.log('获取到视频url');
          let mp3Ormp4 = URL[URL.length - 1];
          return( //"http://www.cn901.com/res/91Content/resource/2021/01/22/video/46c31428-3fa2-47d2-ae51-be58a3f8aba0_mp4.mp4"
              <View style={styles.contentView}>
                {/* <View><Text style={styles.textName}>{resourceName}</Text></View> */}
                <Video 
                    source={{uri: URL}}
                    onError={this.videoError}
                    resizeMode="stretch"
                    controls={true}
                    repeat={true}
                    style={mp3Ormp4 == 4 ? styles.video : styles.music}
                />
              </View> 
          );
      }
  }


  //加载出错回调函数
  videoError = () => {
      return(
          <Text>视频音频加载错误!!!</Text>
      );
  }
  
  
  render() {
    return (
      <View>
          {this.showContent()}   
      </View>
    );
  }
}

const styles = StyleSheet.create({
   image: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: screenHeight*0.2,
      paddingBottom: screenHeight*0.2,
   },
   contentView: {
      

   },
   textName: {
      position: 'absolute',
      lineHeight: screenHeight*0.35,
      //paddingStart: screenWidth*0.1,
      //paddingRight: screenWidth*0.1,
      //textAlign: 'center',
      //paddingTop: screenHeight*0.15,
      //paddingBottom: screenHeight*0.15,
      fontSize: 20,
   },
   video: {
      //height: '100%',
      //width: '100%',
      //justifyContent: "center",
      //alignItems: "center",
      padding: screenHeight*0.2,
      marginTop: screenHeight*0.2,
      backgroundColor: 'black',
   },
   music: {
      padding: screenHeight*0.15,
      marginTop: screenHeight*0.2,
      backgroundColor: 'black',
 },
});