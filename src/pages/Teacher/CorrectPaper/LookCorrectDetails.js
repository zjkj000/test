import { Button, Text, View,Image, ScrollView,TouchableOpacity, Alert } from 'react-native'
import React, { Component } from 'react'
import http from '../../../utils/http/request'
import { useNavigation } from '@react-navigation/native'
import Toast from '../../../utils/Toast/Toast'
import { ScreenHeight } from 'react-native-elements/dist/helpers'
import { screenWidth } from '../../../utils/Screen/GetSize'


export default function LookCorrectDetails(props) {
  const taskId=props.route.params.taskId
  const type = props.route.params.type
  const navigation = useNavigation()
  return (<LookCorrectDetailsContent navigation={navigation} taskId={taskId} type={type}/>)
}

class LookCorrectDetailsContent extends Component {
    constructor(props){
        super(props)
        this.state={
          taskId:'',
          type:'',
          selectItem:'',
          data:'',
          success:false,
            }
     }
    
    UNSAFE_componentWillMount(){
      this.setState({
        taskId:this.props.taskId, 
        type:this.props.type
      })
      console.log(this.props.type,this.props.taskId)
      const url = global.constants.baseUrl+"teacherApp_lookPresentation.do";
      const params = {
            taskId:this.props.taskId,           //作业id或者导学案id
            type:this.props.type,               //  paper；learnPlan
            userName:global.constants.userName,              //  老师登录名
          };
      if(!this.state.success){
        http.get(url, params).then((resStr) => {
          
          console.log(resStr)
          let resJson = JSON.parse(resStr);
          this.setState({
                data:resJson.data,
                success:resJson.success
              })
          });
        }
        
    }

    PublishAnswer(){
      const url = global.constants.baseUrl+"teacherApp_publishZYPaperAnwer.do";
      const params = {
            paperId:this.props.taskId,           //作业id或者导学案id
            userName:global.constants.userName,              //  老师登录名
          };
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          if(resJson.success){
            Toast.showSuccessToast('答案公布成功！',1000)
          }
    })
  }


    render() {
    return (
        <View style={{height:'100%'}}>
          <View style={{height:50,flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',justifyContent:"center",borderBottomWidth:1}}>
              <TouchableOpacity style={{position:'absolute',left:10}} onPress={()=>{this.props.navigation.goBack()}}>
                  <Image style={{width:30,height:30}} source={require('../../../assets/teacherLatestPage/goback.png')}></Image>
              </TouchableOpacity>
              
            <Text style={{color:'#59B9E0',fontSize:20}}>查看报告</Text>
            <TouchableOpacity style={{position:"absolute",right:10}} onPress={()=>{
              if(this.state.data.status=='show'){
                Alert.alert('','答案已经公布',[{},{},{text:'确定',onPress:()=>{}}])
              }else{
                if(parseInt(this.state.data.noSubmit)/(parseInt(this.state.data.noCorrecting)+parseInt(this.state.data.correcting))<0.2){
                  this.PublishAnswer()
                }else{
                  Alert.alert('','提交率不足80%,确定要公布答案吗？',[{},{text:'取消',onPress:()=>{}},{text:'确定',onPress:()=>{
                    this.PublishAnswer()
                  }}])
                }
              }
             
            }}>
                <Image style={{width:30,height:30}} source={require('../../../assets/teacherLatestPage/set.png')}></Image>
            </TouchableOpacity>

            
          </View>
            <ScrollView style={{flex:1}}>

            {/* 平均分 */}
            <View style={{marginBottom:5,paddingTop:10,paddingBottom:10,paddingLeft:15,backgroundColor:'#FFFFFF'}}>
                <View style={{flexDirection:'row',width:'100%'}}>
                    <Text>平均分</Text>
                    <Text style={{position:'absolute',right:50,}}>{this.state.data.avg}</Text>
                </View>
            </View>

            {/* 最高分 */}
            <View style={{marginBottom:5,paddingTop:10,paddingBottom:10,paddingLeft:15,backgroundColor:'#FFFFFF'}}>
                
                <View style={{flexDirection:'row',width:'100%'}}>
                    <Text>最高分</Text>
                    <Text style={{position:'absolute',right:50,}}>{this.state.data.max}</Text>
                    <TouchableOpacity 
                            style={{position:'absolute',right:10}}
                            onPress={()=>{
                              this.state.selectItem=='最高分'?this.setState({selectItem:''}):this.setState({selectItem:'最高分'})}}>
                      <Image style={{width:25,height:20}} 
                            source={this.state.selectItem=='最高分'
                            ?require('../../../assets/teacherLatestPage/top.png')
                            :require('../../../assets/teacherLatestPage/bot.png')}></Image>
                    </TouchableOpacity>
                </View>
                
                {/* 根据小箭头状态判断加载不加载 */}
                {this.state.selectItem=='最高分'
                ?(<View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start',paddingBottom:20,paddingTop:10}}>
                  {this.state.data.maxList.map(function(item,index){
                            return(
                              <View key={index} style={{margin:8,height:35,alignItems:"center",backgroundColor:'#C0C0C0',width:screenWidth*0.18,justifyContent:"center"}}>
                                    <Text>{item}</Text>
                                </View>
                            )
                  })}
                    
                  </View>)
                :(<View></View>)}
                
            </View>


            {/* 最低分 */}
            <View style={{marginBottom:5,paddingTop:10,paddingBottom:10,paddingLeft:15,backgroundColor:'#FFFFFF'}}>
              
                <View style={{flexDirection:'row',width:'100%'}}>
                    <Text>最低分</Text>
                    <Text style={{position:'absolute',right:50,}}>{this.state.data.min}</Text>
                    <TouchableOpacity 
                            style={{position:'absolute',right:10}}
                            onPress={()=>{
                              this.state.selectItem=='最低分'?this.setState({selectItem:''}):this.setState({selectItem:'最低分'})}}>
                      <Image style={{width:25,height:20}}  
                            source={this.state.selectItem=='最低分'
                            ?require('../../../assets/teacherLatestPage/top.png')
                            :require('../../../assets/teacherLatestPage/bot.png')}></Image></TouchableOpacity>
                </View>
              
                {/* 根据小箭头判断加载不加载 */}
                {this.state.selectItem=='最低分'
                ?(<View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start',paddingBottom:20,paddingTop:10}}>
                        {this.state.data.minList.map(function(item,index){
                            return(
                              <View key={index} style={{margin:8,height:35,alignItems:"center",backgroundColor:'#C0C0C0',width:screenWidth*0.18,justifyContent:"center"}}>
                                    <Text>{item}</Text>
                                </View>
                            )
                  })}
                    
                  </View>)
                :(<View></View>)}
                
            </View>


            {/* 已批改 */}
            <View style={{marginBottom:5,paddingTop:10,paddingBottom:10,paddingLeft:15,backgroundColor:'#FFFFFF'}}>
                
                <View style={{flexDirection:'row',width:'100%'}}>
                    <Text>已批改</Text>
                    <Text style={{position:'absolute',right:50,}}>{this.state.data.correcting}</Text>
                    <TouchableOpacity 
                            style={{position:'absolute',right:10}}
                            onPress={()=>{
                              this.state.selectItem=='已批改'?this.setState({selectItem:''}):this.setState({selectItem:'已批改'})}}>
                      <Image style={{width:25,height:20}}  
                            source={this.state.selectItem=='已批改'
                            ?require('../../../assets/teacherLatestPage/top.png')
                            :require('../../../assets/teacherLatestPage/bot.png')}></Image></TouchableOpacity>
                  
                </View>
                
                {/* 根据小箭头判断加载不加载 */}
                {this.state.selectItem=='已批改'
                ?(<View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start',paddingBottom:20,paddingTop:10}}>
                      {this.state.data.correctingList.map(function(item,index){
                            return(
                              <View key={index}  style={{margin:8,height:35,alignItems:"center",backgroundColor:'#C0C0C0',width:screenWidth*0.18,justifyContent:"center"}}>
                                    <Text>{item}</Text>
                                </View>
                            )
                  })}
                    
                  </View>)
                :(<View></View>)}
                
            </View>


            {/* 未批改 */}
            <View style={{marginBottom:5,paddingTop:10,paddingBottom:10,paddingLeft:15,backgroundColor:'#FFFFFF'}}>
              
                <View style={{flexDirection:'row',width:'100%'}}>
                    <Text>未批改</Text>
                    <Text style={{position:'absolute',right:50,}}>{this.state.data.noCorrecting}</Text>
                    <TouchableOpacity 
                            style={{position:'absolute',right:10}}
                            onPress={()=>{
                              this.state.selectItem=='未批改'?this.setState({selectItem:''}):this.setState({selectItem:'未批改'})}}>
                      <Image style={{width:25,height:20}}  
                            source={this.state.selectItem=='未批改'
                            ?require('../../../assets/teacherLatestPage/top.png')
                            :require('../../../assets/teacherLatestPage/bot.png')}></Image></TouchableOpacity>
                </View>

                {/* 根据小箭头判断加载不加载 */}
                {this.state.selectItem=='未批改'
                ?(<View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start',paddingBottom:20,paddingTop:10}}>
                      {this.state.data.noCorrectingList.map(function(item,index){
                            return(
                              <View key={index} style={{margin:8,height:35,alignItems:"center",backgroundColor:'#C0C0C0',width:screenWidth*0.18,justifyContent:"center"}}>
                                    <Text>{item}</Text>
                                </View>
                            )
                  })}
                
                  </View>)
                :(<View></View>)}
                
            </View>


            {/* 未提交 */}
            <View style={{marginBottom:5,paddingTop:10,paddingBottom:10,paddingLeft:15,backgroundColor:'#FFFFFF'}}>
                
                <View style={{flexDirection:'row',width:'100%'}}>
                    <Text>未提交</Text>
                    <Text style={{position:'absolute',right:50,}}>{this.state.data.noSubmit}</Text>
                    <TouchableOpacity 
                            style={{position:'absolute',right:10}}
                            onPress={()=>{
                              this.state.selectItem=='未提交'?this.setState({selectItem:''}):this.setState({selectItem:'未提交'})}}>
                      <Image style={{width:25,height:20}}  
                          source={this.state.selectItem=='未提交'
                                ?require('../../../assets/teacherLatestPage/top.png')
                                :require('../../../assets/teacherLatestPage/bot.png')}></Image> 
                    </TouchableOpacity>
                </View>

                {/* 根据小箭头判断加载不加载 */}
                {this.state.selectItem=='未提交'
                ?(<View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start',paddingBottom:20,paddingTop:10}}>
                      {this.state.data.noSubmitList.map(function(item,index){
                            return(
                                <View key={index} style={{margin:8,height:35,alignItems:"center",backgroundColor:'#C0C0C0',width:screenWidth*0.18,justifyContent:"center"}}>
                                    <Text>{item}</Text>
                                </View>
                            )
                  })}
                  </View>)
                :(<View></View>)}

            </View>

            </ScrollView>
        </View>
        
     
    )
  }
}