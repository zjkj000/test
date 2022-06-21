import { Text, View, StyleSheet, ScrollView, } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import http from '../../utils/http/request';
import Select_Subject_Details_Contont from './Select_Subject_Details'
export default function Select_SubjectContainer(props) {
  const type = props.route.params.type!=null?props.route.params.type:''
  const navigation = useNavigation();
  const [data,setdata] = useState([]);
  const [success,setsuccess] = useState(false);
  useEffect(()=>{
    getData()
  },[props.route.params.type])

  function getData(){
    setdata([])
    const url =
      "http://" +
      "www.cn901.net" +
      ":8111" +
      "/AppServer/ajax/studentApp_getSelectCourseTaskList.do"
      const params = {
        userId: global.constants.userName,
        unitId: '1101010010001'
      }
      http.get(url, params).then((resStr) => {
        let resJson = JSON.parse(resStr);
        setdata(resJson.data)
        setsuccess(resJson.success)
      })
  }
  return (
      <ScrollView>
        {data.length > 0 && data.map(function (item, index) {
          return (<Select_Subject_Details_Contont key={index} source={item} />)
        })
        }
      </ScrollView>
  )
  
  // <Select_Subject navigation={navigation}  type={type}/>

}




// class Select_Subject extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       data: [],
//       success: false,
//     }
//   }

//   UNSAFE_componentWillMount() {
    
//     if (!this.state.success||this.props.type=='Selectedsuccess'){
//       console.log('+++++++++++++++++++++++++')
      
//     }
//   }
  
//   render() {
//     const data = this.state.data
//     return (
//       <ScrollView>
//         {data.length > 0 && data.map(function (item, index) {
//           return (<Select_Subject_Details_Contont key={index} source={item} />)
//         })
//         }
//       </ScrollView>
//     )
//   }
// }


