import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import Checkbox from '../Utils/Checkbox'
import HTMLView from 'react-native-htmlview';

// 多选题 模板页面
// 使用时 需要传入三个参数：  sum   num  datasource
// 需要传的参数有三个，第一个是共多少题，第二个是当前是第index题 这里用了的（index+1）显示第几题。 第三个是试题数据。
export default class Answer_single extends Component {
  constructor(props) {
    super(props)
    this.state = {
            numid:'',
            questionTypeName:'多选题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'',  //题目选项
            questionContent:'',   //题目内容
            answer:''
    }
 }  
 UNSAFE_componentWillMount(){
     this.setState({numid:this.props.num,...this.props.datasource});
    }
  render() {
    const HTML = this.state.questionContent;
    const questionChoiceList =this.state.questionChoiceList;
    return (
      <View>
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text>{this.state.numid+1}/{this.props.sum}题 </Text>
                <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
            </View>
            
            {/* 题目展示区域 */}
            <ScrollView style={styles.answer_area}>
              <HTMLView value={HTML}/>
            </ScrollView>
            
            {/* 分割线 */}
            <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>

            {/* 答案区域 */}
            <View style={styles.answer_result}>
                {/* 调用了复选框组件，使用的时候需要传进去选项列表 */}
                <Checkbox ChoiceList={questionChoiceList}/>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    answer_title:{padding:10,paddingLeft:30,flexDirection:'row'},
    answer_area:{height:"85%",padding:20},
    answer_result:{paddingLeft:30,paddingTop:5,paddingBottom:5,paddingRight:30,flexDirection:'row',justifyContent:'space-around'}
})