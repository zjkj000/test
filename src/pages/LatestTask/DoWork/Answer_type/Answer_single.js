import { Text, StyleSheet, View, ScrollView,Image} from 'react-native'
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
                <Text style={{marginLeft:20}}>单项选择</Text>
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
                <Text>
                        The flexWrap property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed.
                </Text>
                <Text>
                        The flexWrap property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed.
                </Text>
                <Text>
                        The flexWrap property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed.
                </Text>
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
            <View style={styles.answer_result}>
                <CircleList/>
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