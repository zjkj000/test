import { Button, ScrollView, Text, View,StyleSheet,Alert } from 'react-native'
import React, { Component } from 'react'
import http from '../../../../utils/http/request'
import { color } from 'react-native-elements/dist/helpers'
    
    // 提交作业页面
export default class Submit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            paperId:'d58b793d-103e-43b3-880d-61217aee6fc0',
            success:'',
            data:[],
         }
    }
    
    UNSAFE_componentWillMount(){
        this.setState({paperId:this.props.paperId})
        const url = 
                  "http://"+
                  "www.cn901.net" +
                  ":8111" +
                  "/AppServer/ajax/studentApp_getStudentAnswerList.do"
            const params ={
                    paperId : this.state.paperId,
                    userName : 'ming6031'
                  }
              http.get(url,params).then((resStr)=>{
                  let resJson = JSON.parse(resStr);
                  this.setState({success:resJson.success});
                  this.setState({data:resJson.data});
                })
    }

  render() {
      
    //动态拼接已经作答的题目答案
      var result= [];
      for(var result_Item=0;result_Item<this.state.data.length;result_Item++){
          result.push(
            <View key={result_Item} style={styles.result}>
                <Text>({result_Item+1}):</Text>
                {this.state.data[result_Item].stuAnswer!=''
                  ? <Text>{this.state.data[result_Item].stuAnswer}</Text>
                  : <Text style={{fontStyle:{color:'#DC143C'}}}>未答</Text>
                }
                
            </View>)
      }
    return (
      <View>
        {/* 答案预览区域 */}
        <ScrollView style={styles.preview_area}>
                {/* 题目展示内容：序号 + 答案 */}
                {result}
        </ScrollView>

        {/* 提交作业按钮区域 */}
        <View style={styles.submit_area}>
            <Button onPress={()=>alert("提交了作业")} style={styles.bt_submit} title='交作业'></Button>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    preview_area:{height:"90%",padding:20,paddingBottom:50,paddingTop:10},
    result:{margin:20,flexDirection:'row'},
    bt_submit: { marginRight:20,},
    submit_area:{paddingLeft:30,paddingTop:20,paddingBottom:20,paddingRight:30},
  });