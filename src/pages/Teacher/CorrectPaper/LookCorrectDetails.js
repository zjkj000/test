import { Button, Text, View,Image, ScrollView,TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import http from '../../../utils/http/request'

export default class LookCorrectDetails extends Component {
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
        taskId:this.props.route.params.taskId, 
        type:this.props.route.params.type
      })
      const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_lookPresentation.do";
      const params = {
            taskId:this.props.route.params.taskId,           //作业id或者导学案id
            type:this.props.route.params.type,               //  paper；learnPlan
            userName:global.constants.userName,              //  老师登录名
          };
      if(!this.state.success){
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          this.setState({
                data:resJson.data,
                success:resJson.success
              })
          });
        }
        
    }


    render() {
    return (
        <ScrollView>

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
              ?(<View style={{flexDirection:'row',padding:15,flexWrap:'wrap',}}>
                {this.state.data.maxList.map(function(item){
                          return(
                            <View style={{width:80}}>
                              <View style={{margin:10,padding:8,backgroundColor:'#C0C0C0'}}>
                                  <Text>{item}</Text>
                              </View> 
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
              ?(<View style={{flexDirection:'row',padding:15,flexWrap:'wrap'}}>
                      {this.state.data.minList.map(function(item){
                          return(
                            <View style={{width:80}}>
                              <View style={{margin:10,padding:8,backgroundColor:'#C0C0C0'}}>
                                  <Text>{item}</Text>
                              </View> 
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
              ?(<View style={{flexDirection:'row',padding:15,flexWrap:'wrap'}}>
            
                     {this.state.data.correctingList.map(function(item){
                          return(
                            <View style={{width:80}}>
                              <View style={{margin:10,padding:8,backgroundColor:'#C0C0C0'}}>
                                  <Text>{item}</Text>
                              </View>
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
              ?(<View style={{flexDirection:'row',padding:15,flexWrap:'wrap'}}>
                    {this.state.data.noCorrectingList.map(function(item){
                          return(
                            <View style={{width:80}}>
                              <View style={{margin:10,padding:8,backgroundColor:'#C0C0C0'}}>
                                  <Text>{item}</Text>
                              </View> 
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
              ?(<View style={{flexDirection:'row',padding:15,flexWrap:'wrap',}}>
                    {this.state.data.noSubmitList.map(function(item){
                          return(
                            <View style={{width:80}}>
                              <View style={{margin:10,padding:8,backgroundColor:'#C0C0C0'}}>
                                  <Text>{item}</Text>
                              </View> 
                            </View>
                          )
                })}
                </View>)
              :(<View></View>)}

          </View>

        </ScrollView>
     
    )
  }
}