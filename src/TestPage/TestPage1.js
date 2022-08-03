import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { screenHeight } from '../utils/Screen/GetSize'
import StatisticalForm from '../pages/TeacherStatisticalForm/StatisticalForm'
import Buzhizuoye from '../pages/TeacherStatisticalForm/Buzhizuoye'
import Piyueshiti from '../pages/TeacherStatisticalForm/Piyueshiti'
import { ScrollView } from 'react-native-gesture-handler'
export default class TestPage1 extends Component {
  render() {
    return (
      <ScrollView style={{height:'100%'}}>
        <Buzhizuoye></Buzhizuoye>
        <Piyueshiti></Piyueshiti>
      </ScrollView>
    )
  }
}