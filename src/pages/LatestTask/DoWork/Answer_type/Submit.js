import { Button, ScrollView, Text, View,StyleSheet,Alert } from 'react-native'
import React, { Component } from 'react'

    
    // 提交作业页面
export default class Submit extends Component {
  render() {
    return (
      <View>
        {/* 答案预览区域 */}
        <ScrollView style={styles.preview_area}>
            {/* 题目展示内容：序号 + 答案 */}

                {/* 第1题答案展示 */}
                <View style={styles.result}>
                    <Text>(1):</Text>
                    <Text>A</Text>
                </View>
                {/* 第2题答案展示 */}
                <View style={styles.result}>
                    <Text>(2):</Text>
                    <Text>A</Text>
                </View>
                {/* 第3题答案展示 */}
                <View style={styles.result}>
                    <Text>(3):</Text>
                    <Text>A</Text>
                </View>
                {/* 第4题答案展示 */}
                <View style={styles.result}>
                    <Text>(4):</Text>
                    <Text>A</Text>
                </View>
                {/* 第5题答案展示 */}
                <View style={styles.result}>
                    <Text>(5):</Text>
                    <Text>本文档总结对比了 React Native 中现有的几个导航组件。如果你刚开始接触，那么直接选择React Navigation就好。 React Navigation 提供了简单易用的跨平台导航方案，在 iOS 和 Android 上都可以进行翻页式、tab 选项卡式和抽屉式的导航布局。</Text>
                </View>
                {/* 第6题答案展示 */}
                <View style={styles.result}>
                    <Text>(6):</Text>
                    <Text>A</Text>
                </View>
                {/* 第7题答案展示 */}
                <View style={styles.result}>
                    <Text>(7):</Text>
                    <Text>A</Text>
                </View>
                {/* 第8题答案展示 */}
                <View style={styles.result}>
                    <Text>(1):</Text>
                    <Text>A</Text>
                </View>
                {/* 第9题答案展示 */}
                <View style={styles.result}>
                    <Text>(2):</Text>
                    <Text>A</Text>
                </View>
                {/* 第10题答案展示 */}
                <View style={styles.result}>
                    <Text>(7):</Text>
                    <Text>本文档总结对比了 React Native 中现有的几个导航组件。如果你刚开始接触，那么直接选择React Navigation就好。 React Navigation 提供了简单易用的跨平台导航方案，在 iOS 和 Android 上都可以进行翻页式、tab 选项卡式和抽屉式的导航布局。</Text>
                </View>
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