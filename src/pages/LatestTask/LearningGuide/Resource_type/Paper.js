import { Text, StyleSheet, View, ScrollView,Image,TouchableOpacity,Alert,Dimensions } from 'react-native'
import React, { Component, useState } from 'react'
import RadioList from '../../DoWork/Utils/RadioList';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";
import { WebView } from 'react-native-webview';
export default function PaperContainer(props) {
    const navigation = useNavigation();
    const learnPlanId= props.learnPlanId
    const submit_status=props.submit_status
    const startdate=props.startdate
    const papername = props.papername
    const sum=props.sum
    const num=props.num 
    const datasource=props.datasource
   
    return (
    <Paper  navigation={navigation}  
                    papername = {papername}
                    submit_status={submit_status}  
                    startdate={startdate}
                    learnPlanId={learnPlanId}  
                    sum={sum} 
                    num={num} 
                    isallObj={props.isallObj}
                    datasource={datasource}   />
  )
}
//  Paper 模板页面

 class Paper extends Component {
     constructor(props) {
        super(props)
      
        this.state = {
                numid:'',
                resourceName:'单选题',
                resourceId:'',
                baseTypeId:'',
                questionName:'',        //题目名称
                questionChoiceList:'',  //题目选项
                question:'',   //题目内容
              
                uri:''
        }
     }  
   
   


     UNSAFE_componentWillMount(){

         //请求到之后  就要把答案 设置到oldstuanswer
         this.setState({
             uri:this.props.datasource.url,
           
             numid:this.props.num?this.props.num:0,
             ...this.props.datasource});
        }   


     render() {
        const  width = Dimensions.get('window').width;
    return (  
      <View style={{backgroundColor:'#FFFFFF',borderTopColor:'#000000',borderTopWidth:0.5}}  >
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.title}>  
                <Text style={{fontWeight:'600',color:'#000000',fontSize:17,width:'65%'}} >{this.state.resourceName}</Text>
            </View>
            
            {/* 展示Paper就行 */}
            
            <View style={styles.area}>
                <WebView 
                        key={this.state.resourceId}
                        scalesPageToFit={Platform.OS === 'ios'? true : false} source={{ uri:this.state.uri}} />
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    title:{padding:10,paddingLeft:30,flexDirection:'row',},
    area:{height:'100%'}
})