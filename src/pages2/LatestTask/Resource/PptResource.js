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

export default function PPTContainer(props) {
  const navigation = useNavigation();
  console.log('============video=================',props.route.params.resource.resourceName)
  navigation.setOptions({title: props.route.params.resource.resourceName})
  //将navigation传给TodoList组件，防止路由出错
  return (
      <PPT
          navigation={navigation}
      ></PPT>
  );
}


class PPT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: '', //api请求的数据data

      uri:'',
      pptList:[],
      selectedindex:0    //记录当前选中的是哪张ppt
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
          pptList: paramsData.pptList ,
          uri: paramsData.uri
      },()=>{
          
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
              pptList: resJson.data.pptList ,
              uri: resJson.data.pptList[0]
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
        //const pptList = this.state.resource.pptList;
        const resourceName = this.state.resource.resourceName;
        return(
            <View>
                {/* <View style={{alignItems: "center"}}>
                  <Text style={{
                      top: screenHeight*0.25,
                      fontSize: 20,
                      fontWeight:'600',
                    }}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                  >
                      {resourceName}
                  </Text>
                </View> */}
                <View style={styles.area}>
                    <Text style={{fontSize:18,marginBottom:10}}>{this.state.resourceName}</Text>
                    <Image style={{width:'90%',height:250}} source={{uri: this.state.uri}}></Image>
                    <ScrollView horizontal={true} style={{marginTop:80}}>
                        {this.getPPT(this.state.pptList)}
                    </ScrollView>
                </View>
            </View> 
        );
    }
  }

  //底部水平显示PPT内容
  getPPT(pptList){
      var pptItems=[];
      for(let ppt_i=0;ppt_i<pptList.length;ppt_i++){
          pptItems.push(
              <TouchableOpacity 
                onPress={() => this.setState({selectedindex: ppt_i, uri: pptList[ppt_i]})}>
                      <Image source={{uri:pptList[ppt_i]}} 
                        style={this.state.selectedindex == ppt_i ? styles.checked : styles.little_image} />
              </TouchableOpacity>
              
          )
      }
      return pptItems;
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
    alignItems:'center',
    height:'100%',
    paddingTop:'35%'
  },
  little_image:{
    height:50,
    width:80,
    marginLeft:5
  },
  checked:{
    height:50,
    width:80,
    marginLeft:5,
    borderColor:'#FFA500',
    borderWidth:2
  }
});