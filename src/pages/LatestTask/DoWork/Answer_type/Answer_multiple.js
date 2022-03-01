import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import Checkbox from '../Utils/Checkbox'
import HTMLView from 'react-native-htmlview';

// 答题页面
export default class Answer_single extends Component {
  constructor(props) {
    super(props)
    this.state = {
            numid:'',
            questionTypeName:'多选题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'A',  //题目选项
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
          {/* 答案区域 */}
            <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>
            <View style={styles.answer_result}>
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