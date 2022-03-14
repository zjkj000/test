import { Text, View } from 'react-native'
import React, { Component } from 'react'
import http from '../../../../utils/http/request';

export default class TextMenu extends Component {
constructor(props){
    super(props)
    this.state={
        numid:'',
        sum:'',
        success: false,
        learnPlanId:'',
    }
}
    UNSAFE_componentWillMount(){
       let sumn =  this.getDatanum()
        this.setState({
            sum:sumn,
            numid:this.props.selectedIndex?this.props.selectedIndex:0,
            learnPlanId:this.props.learnPlanId,
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({numid:nextProps.selectedIndex})
    }

     //getData()函数是为了获取试题资源，和学生之前可能作答的结果   得到之后设置状态success 是否成功  data 具体试题数据  dataNum题目总数  
    getDatanum() {
        const data_url = 
          "http://"+
          "www.cn901.net" +
          ":8111" +
          "/AppServer/ajax/studentApp_getMarkedJob.do"
        const data_params ={

          // ming6001
          // 0a4d30ee-27f7-4e0c-97d5-e28275af5853
          // 526e645b-67e7-47f5-b85a-f84ae60d7ae3
          // a51fc8e1-2448-4731-bab4-94c0b1400298
          // 555432f3-de4e-4242-a197-5952120f415b
          // 75b82788-37b3-48ec-9b66-2b8408a874c8
          // 11895efa-9f4f-48d1-8d3f-6d31953850c3
          // cd81138e-b440-4606-ad63-1b2449458e8d
        //   learnPlanId :this.props.learnPlanId,
          learnPlanId :'2434967b-57b2-4c92-a58f-67da07c15aa4', // props.route.params.learnId,
          userName : 'ming6005',
          learnPlanType :'paper',
        }
        var length = 0
        if(!this.state.success){
          console.log('+++---+++')
            http.get(data_url,data_params).then((resStr)=>{
                  let data_resJson = JSON.parse(resStr);
                  length = data_resJson.data.length
                      
                })
          }
          return length
      }

  render() {
      const {sum,numid} = this.state
    return (
      <View>
        <Text style={{marginRight:20}}>{sum==''?'':(numid+1/sum)}</Text>
      </View>
    )
  }
}