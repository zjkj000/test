import { Text, View ,StyleSheet,ScrollView,} from 'react-native'
import React, { Component } from 'react'
import { useNavigation } from "@react-navigation/native";
import http from '../../utils/http/request';
import Select_Subject_Details_Contont from './Select_Subject_Details'
export default function Select_SubjectContainer(props) {
  const navigation = useNavigation();
  return <Select_Subject navigation={navigation} />
}

class Select_Subject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:[],
      success:false,
     }
}

  UNSAFE_componentWillMount(){
    if(!this.state.success){
            const url = 
                    "http://"+
                    "www.cn901.net" +
                    ":8111" +
                    "/AppServer/ajax/studentApp_getSelectCourseTaskList.do"
            const params ={
                // userId:global.constants.userName,
                userId:'ming6001',
                unitId:'1101010010001'
                }
            http.get(url,params).then((resStr)=>{
                    let resJson = JSON.parse(resStr);
                    this.setState({
                      success:resJson.success,
                      data:resJson.data
                    })
                })
    }
  }

  render(){
    const data =this.state.data
    return (
      <ScrollView>
        {data.length>0&&data.map(function(item,index){
            return( <Select_Subject_Details_Contont key={index} source={item}/>)
          })   
        }
      </ScrollView>
    )
  }
}


  