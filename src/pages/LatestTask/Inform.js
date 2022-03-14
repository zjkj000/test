import React from 'react';
import {StyleSheet,
    View,
    Button,
    Text,
    Image,
} from "react-native";
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import '../../utils/global/constants';


export default class Inform extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  //http://192.168.1.57:8080/AppServer/ajax/studentApp_readNotice.do?userName=UN97221&type=3&classTimeId=13033&callback=ha

  //修改通知或公告的状态
  updateStatus =  (status , todoType , learnId) => {
        const token = global.constants.token;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl
        const url = ip + "studentApp_readNotice.do";
        const params ={
            userName: userId,
            type: todoType,    //type=3表示通知，4表示公告
            classTimeId: learnId, 
        }
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            console.log('resStr' , resStr);
            console.log('此通知或公告状态已修改为已读');
            return ;
        })
  };
  
  render() {
    console.log('route' , this.props.navigation.getState().routes[2].params);
    const paramsData = this.props.navigation.getState().routes[2].params;
    const bottomTitle = paramsData.bottomTitle;
    const createrName = paramsData.createrName;
    const time = paramsData.time;
    const courseName = paramsData.courseName;
    const learnId = paramsData.learnId;  //通知或公告标识
    const status = paramsData.status;   //status=4表示已读的通知或公告，5表示未读
    const type = paramsData.type;       //type=3表示通知，4表示公告
    return (
        <View>
            {/**未读的通知或公告将调用Api修改状态 */}
            {(status == 5)? (this.updateStatus(status , type , learnId)) : null}
            <View>
                <Text style={styles.title}>{bottomTitle}</Text>
                <Flex style={styles.flexContent}>
                    <Flex.Item style={styles.createrNameImg}>
                        <Image source={require('../../assets/LatestTaskImages/teName.png')} />
                    </Flex.Item>
                    <Flex.Item style={styles.createrNameText}>
                        <Text>{createrName}</Text>
                    </Flex.Item>
                    <Flex.Item style={styles.timeImg}>
                        <Image source={require('../../assets/LatestTaskImages/timeClock.png')} />
                    </Flex.Item>
                    <Flex.Item style={styles.timeText}>
                        <Text>{time}</Text>
                    </Flex.Item>
                </Flex>
                <Text style={styles.content}>{courseName}</Text>
            </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 20,
    },
    flexContent: {
      paddingLeft: screenWidth*0.25,
      paddingRight: screenWidth*0.25,
      marginBottom: 20,
    },
    createrNameImg: {
      flex:1,
    },
    createrNameText: {
      flex:2,
    },
    timeImg: {
      flex:1,
    },
    timeText: {
      flex:2,
    },
    content: {
      fontSize: 16,
      paddingLeft: 10,
      paddingRight: 10,
    },
});