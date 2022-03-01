import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import RadioList from '../Utils/RadioList'
import HTMLView from 'react-native-htmlview';

// 答题页面
export default class Answer_single extends Component {
  constructor(props) {
    super(props)
    this.state = {
              
            numid:'',
            questionTypeName:'阅读题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'A,B,C,D',  //题目选项
            questionContent:'',   //题目内容
            answer:''
    }
 }  
UNSAFE_componentWillMount(){
    this.setState({numid:this.props.num,...this.props.datasource});}
  render() {
    const HTML = this.state.questionContent;
    const questionChoiceList =this.state.questionChoiceList;
    return (
      <View>
          {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text> {this.state.numid+1}/{this.props.sum}题</Text>
                <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
            </View>
          {/* 题目展示区域 */}
            <ScrollView style={styles.answer_area}>
              <HTMLView value={HTML}/>
              <Text style={{height:50}}></Text>
            </ScrollView>
          {/* 答案区域 */}
          <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>
            <ScrollView style={{paddingBottom:30}}>
                <View style={styles.answer_result}>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                    <RadioList ChoiceList={questionChoiceList}/>
                </View>
                <View style={{width:"100%",height:200}}></View>
            </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    answer_title:{padding:10,paddingLeft:30,flexDirection:'row'},
    answer_area:{height:"60%",padding:20},
    answer_result:{height:"25%",paddingLeft:30,paddingTop:20,paddingRight:30,paddingBottom:30}
})