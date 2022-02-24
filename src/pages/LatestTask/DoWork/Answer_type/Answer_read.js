import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import CircleList from '../Utils/CircleList'


// 答题页面
export default class Answer_single extends Component {
  render() {
    return (
      <View>
          {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text>1/3题 </Text>
                <Text style={{marginLeft:20}}>阅读</Text>
            </View>
          {/* 题目展示区域 */}
            <ScrollView style={styles.answer_area}>
                <Text>
                        The flexWrap property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed.
                </Text>
                <Text>
                        The flexWrap property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed.
                </Text>
                <Text>
                        The flexWrap property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed.
                </Text>
            </ScrollView>
          {/* 答案区域 */}
          <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>
            <ScrollView style={{paddingBottom:30}}>
                <View style={styles.answer_result}>
                  
                    <CircleList/>
                    <CircleList/>
                    <CircleList/>
                    <CircleList/>
                    <CircleList/>
                    <CircleList/>
                    <CircleList/>
                    <CircleList/>
                    <CircleList/>
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