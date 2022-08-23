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
  ScrollView
} from 'react-native';
import { useNavigation  , useRoute } from "@react-navigation/native";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";

import { WebView } from 'react-native-webview';

export default function WordContainer(props) {
  const navigation = useNavigation();
  console.log('============video=================',props.route.params.resource.resourceName)
  navigation.setOptions({title: props.route.params.resource.resourceName})
  //将navigation传给TodoList组件，防止路由出错
  return (
      <Word
          navigation={navigation}
      ></Word>
  );
}

class Word extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: '', //api请求的数据data
    };
  }

  UNSAFE_componentWillMount(){  //初始挂载执行一遍
      //oldtype = this.props.resourceType;
      const paramsData = this.props.navigation.getState().routes[3].params;
      //console.log(this.props.navigation.getState().routes);
      // const id = paramsData.id;
      // const type = paramsData.type;
      // const deviceType = paramsData.deviceType;
      // this.fetchData(id , type , deviceType);
      this.setState({ 
          resource: paramsData.resource , 
      });
  }

  //"http://www.cn901.net:8111/AppServer/ajax/studentApp_lookMineFloderFile.do?id=8bc75fef-e4c0-4106-a68f-d15bd6fac164&type=resource&deviceType=PAD&callback=ha"
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
            let url = resJson.data.url;
            this.setState({ 
              resource: resJson.data , 
            });
        })
  }


  //渲染详情页
  showContent = () => {
    const {resource} = this.state;
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
        return(
            <View style={styles.area}>
                {console.log('------url---------',this.state.resource.url , typeof(this.state.resource.url))}
                <WebView  
                  source={{ uri: this.state.resource.url}} 
                  // scalesPageToFit={Platform.OS === 'ios'? true : false}
                />
            </View>
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
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  pptImage: {
    width: screenWidth,
    height: 300,
  },
  area:{
      // height: screenHeight,
      flex:1
  }
});