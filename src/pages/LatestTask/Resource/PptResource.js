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

import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";



export default class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: '', //api请求的数据data
    };
  }

  UNSAFE_componentWillMount(){  //初始挂载执行一遍
      //oldtype = this.props.resourceType;
      const paramsData = this.props.navigation.getState().routes[3].params;
      console.log(this.props.navigation.getState().routes);
      const id = paramsData.id;
      const type = paramsData.type;
      const deviceType = paramsData.deviceType;
      this.fetchData(id , type , deviceType);
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
            this.setState({ resource: resJson.data });
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
        const pptList = this.state.resource.pptList;
        return(
            <View>
                {/* <Text>下载地址：{this.state.resource.path}</Text>
                <Text>URL地址：{this.state.resource.url}</Text> */}
                {console.log(this.state.resource.url)}
                <ScrollView>
                    {
                        pptList.map((ppt,index)=>{
                            return <Image source={{uri: pptList[index]}} style={styles.pptImage} />
                        })
                    }
                </ScrollView>
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
});