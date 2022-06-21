import { Button } from '@ui-kitten/components'
import http from '../../../utils/http/request'
import { Text, View ,TouchableOpacity,ScrollView,Image} from 'react-native'
import React, { Component } from 'react'

export default class CorrectSubmit extends Component {
    constructor(props){
        super(props)
        this.state={
          CorrectResultList:[],
          scoreCount:'0', //作业总分
          stuScoreCount:'0',  //学生得分
            }
     }
     
    UNSAFE_componentWillMount(){
      var question_sumScore = 0.0;
      var stu_sumScore = 0.0;
      this.props.CorrectResultList.map((item)=>{
        question_sumScore+=parseFloat(item.questionScore);
        stu_sumScore  += parseFloat(item.stuscore) ;
      })
      this.setState({
        scoreCount:question_sumScore,
        stuScoreCount:stu_sumScore,
        CorrectResultList:this.props.CorrectResultList,
      }) 
    }

    

  render(){
    const navigation =this.props.navigation
    const CorrectResultList =this.state.CorrectResultList
    const taskId = this.state.taskId
    const userCn = this.state.userCn
    const userName = this.state.userName           
    const type = this.state.type
    
    var result =[];
  
    //拼接分数还有问题
    for (let result_Item = 0; result_Item < CorrectResultList.length; result_Item++){
        //hand这个属性是自己添加的  用来记录作业是否被手动修改过分数 0是默认   1表示手工修改
        if(CorrectResultList[result_Item].hand==1){
          //手工批阅的情况   正确 半对  错误  未阅
          if(parseFloat(CorrectResultList[result_Item].stuscore)==10||parseFloat(CorrectResultList[result_Item].stuscore==CorrectResultList[result_Item].questionScore)){
                result.push(
                  <TouchableOpacity 
                    key={result_Item}    
                    onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                      <View style={{margin:15}}>
                        <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct1Yue.png')}></Image>
                        <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                      </View>
                  </TouchableOpacity>)
          }else if(parseFloat(CorrectResultList[result_Item].stuscore)==0){
              if(CorrectResultList[result_Item].stuAnswer==''){
                result.push(
                  <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                      <View style={{margin:15}}>
                        <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct2noAnsYue.png')}></Image>
                        <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                      </View>
                  </TouchableOpacity>)
              }else{
                result.push(
                  <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                      <View style={{margin:15}}>
                        <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct2Yue.png')}></Image>
                        <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                      </View>
                  </TouchableOpacity>)
              }
          }else if(parseFloat(CorrectResultList[result_Item].stuscore)>0&&parseFloat(CorrectResultList[result_Item].stuscore)<10){
            result.push(
              <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                  <View style={{margin:15}}>
                    <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct3Yue.png')}></Image>
                    <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                  </View>
              </TouchableOpacity>)
          }else if(CorrectResultList[result_Item].status==4){
            if(CorrectResultList[result_Item].stuAnswer==''){
              result.push(
                <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                        <View style={{margin:15}}>
                          <Image  style={{position:'absolute',width:45,height:45}} source={      
                            CorrectResultList[result_Item].stuAnswer==''?require('../../../assets/teacherLatestPage/correct4noAnsYue.png')
                                              :require('../../../assets/teacherLatestPage/correct4Yue.png')}></Image>
                          <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                        </View>
                    </TouchableOpacity>)
            }else{
              result.push(
                <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                        <View style={{margin:15}}>
                          <Image  style={{position:'absolute',width:45,height:45}} source={      
                            CorrectResultList[result_Item].stuAnswer==''?require('../../../assets/teacherLatestPage/correct4Yue.png')
                                              :require('../../../assets/teacherLatestPage/correct4Yue.png')}></Image>
                          <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                        </View>
                    </TouchableOpacity>)
            }
            
          }else{return(<View></View>)}
        }else{
          //自动批阅过的  正确  错误  半对 hand==0
          if(parseFloat(CorrectResultList[result_Item].stuscore)==10||parseFloat(CorrectResultList[result_Item].stuscore==CorrectResultList[result_Item].questionScore)){
            result.push(
              <TouchableOpacity 
                key={result_Item}    
                onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                  <View style={{margin:15}}>
                    <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct1.png')}></Image>
                    <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                  </View>
              </TouchableOpacity>)
          }else if(CorrectResultList[result_Item].status==4){
            if(CorrectResultList[result_Item].stuAnswer==''){
              result.push(
                <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                    <View style={{margin:15}}>
                      <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct4noAns.png')}></Image>
                      <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                    </View>
                </TouchableOpacity>)
            }else{
              result.push(
                <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                    <View style={{margin:15}}>
                      <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct4.png')}></Image>
                      <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                    </View>
                </TouchableOpacity>)
            }
            
          }else if(parseFloat(CorrectResultList[result_Item].stuscore)==0){
            if(CorrectResultList[result_Item].stuAnswer==''){
              result.push(
                <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                    <View style={{margin:15}}>
                      <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct2noAns.png')}></Image>
                      <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                    </View>
                </TouchableOpacity>)
            }else{
              result.push(
                <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                    <View style={{margin:15}}>
                      <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct2.png')}></Image>
                      <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                    </View>
                </TouchableOpacity>)
            }
            
          }else if(parseFloat(CorrectResultList[result_Item].stuscore)>0&&parseFloat(CorrectResultList[result_Item].stuscore)<10){
            result.push(
              <TouchableOpacity  key={result_Item} onPress={()=>{this.props.setSelectedIndex(result_Item)}}> 
                  <View style={{margin:15}}>
                    <Image  style={{position:'absolute',width:45,height:45}} source={require('../../../assets/teacherLatestPage/correct3.png')}></Image>
                    <Text style={{marginTop:12,marginLeft:18,fontWeight:'bold',fontSize:17,color:'#fff'}}>{result_Item+1}</Text>
                  </View>
              </TouchableOpacity>)
          }else{return(<View></View>)}
        }
    }

    return(
      <View style={{width:'100%'}}>
          <View style={{flexDirection:'row',width:'100%',paddingTop:10,paddingBottom:10,paddingLeft:15}}>
                      <Text style={{fontSize:20}}>学生得分:</Text>
                      <Text style={{fontSize:20,marginRight:20}}>{this.state.stuScoreCount}</Text>
                      <Text style={{fontSize:20}}>满分:</Text>
                      <Text style={{fontSize:20}}>{this.state.scoreCount}</Text>
          </View>

            <View style={{flexDirection:'row',paddingTop:5,padding:20,alignItems:'baseline'}}>
                <Image style={{height:15,width:15}} source={require('../../../assets/teacherLatestPage/correct1.png')}></Image>
                <Text  style={{marginRight:10}}>正确</Text>
                <Image style={{height:15,width:15}} source={require('../../../assets/teacherLatestPage/correct2.png')}></Image>
                <Text  style={{marginRight:10}}>错误</Text>
                <Image style={{height:15,width:15}} source={require('../../../assets/teacherLatestPage/correct3.png')}></Image>
                <Text  style={{marginRight:10}}>部分答对</Text>
                <Image style={{height:15,width:15}} source={require('../../../assets/teacherLatestPage/correct4.png')}></Image>
                <Text  >未阅</Text>
            </View>
            <ScrollView style={{height:'78%',paddingLeft:30,paddingRight:20,width:'95%'}}>
                {/* 显示批改部分 */}
                {/* 一位数  两位数 有所不同 记得判断 */}
                {/* 判断题号》10   
                     判断题目状态   */}
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                  {result}
                </View>

            </ScrollView>
      </View>
    )
  }}
