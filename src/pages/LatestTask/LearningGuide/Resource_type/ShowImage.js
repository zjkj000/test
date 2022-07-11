import { Text, StyleSheet, View, ScrollView,Image,TouchableOpacity,Alert,Dimensions } from 'react-native'
import React, { Component, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
//这个是展示导学案里面资源为图片类型的数据
export default function ShowImageContainer(props) {
    const navigation = useNavigation();
    const learnPlanId= props.learnPlanId
    const submit_status=props.submit_status
    const startdate=props.startdate
    const papername = props.papername
    const sum=props.sum
    const num=props.num 
    const datasource=props.datasource
 
    return (
    <ShowImage     
    navigation={navigation}  
                    papername = {papername}
                    submit_status={submit_status}  
                    startdate={startdate}
                    learnPlanId={learnPlanId}  
                    sum={sum} 
                    num={num} 
                    isallObj={props.isallObj}
                    datasource={datasource}  />
  )
}
//  ShowImage展示 模板页面
 class ShowImage extends Component {
     constructor(props) {
        super(props)
        
        this.state = {
                numid:'',
                resourceName:'',
                resourceId:'',
                baseTypeId:'',
                questionName:'',        //题目名称
                questionChoiceList:'',  //题目选项
                question:'',            //题目内容
                answer:'',
                stu_answer:'',
                oldStuAnswer:'',
                uri:''
        }
     }  
   
     //用于将本道题写的答案  传给 Todo页面，用于提交
   


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
      <View style={{backgroundColor:'#FFFFFF',borderTopColor:'#000000',borderTopWidth:0.5}}>
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.title}>  
                <Text style={{fontWeight:'600',color:	'#000000',fontSize:17,width:'65%'}} >{this.state.resourceName}</Text>
            </View>
            
            {/* 展示ShowImage就行 */}
            
            <View style={styles.area}>
                <Text style={{fontSize:18,marginBottom:10}}>{this.state.resourceName}</Text>
                <Image style={{width:'90%',height:250}} source={{uri:this.state.uri}}></Image>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    title:{padding:10,paddingLeft:30,flexDirection:'row',},
    area:{alignItems:'center',height:'100%',paddingTop:'35%'}
})