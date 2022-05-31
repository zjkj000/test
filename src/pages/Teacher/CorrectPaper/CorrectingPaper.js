import { Text, View,ScrollView,Image,StyleSheet,TouchableOpacity, Alert} from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { Button,Layout, ViewPager } from '@ui-kitten/components'
import { useNavigation } from "@react-navigation/native";
import http from '../../../utils/http/request'
import PaperContent from './PaperContent'
import  Toast  from '../../../utils/Toast/Toast';
import Loading  from '../../../utils/loading/Loading';
import CorrectSubmitContainer from './CorrectSubmit';
import {WaitLoading,Waiting} from '../../../utils/WaitLoading/WaitLoading'
var Allquestion = [];
export default function CorrectingPaper(props) {
    const navigation = useNavigation();
    const CorrectAllQuestion = props.route.params.CorrectAllQuestion
    const taskId = props.route.params.taskId
    const userName = props.route.params.userName
    const userCn = props.route.params.userCn
    const type = props.route.params.type

    const [data,setData] = useState([]);
    const [success,setSuccess]= useState(false);
    const [selectedIndex, setSelectedIndex] = useState();
    const shouldLoadComponent = (index) => index === selectedIndex;
    const [CorrectResultList,setCorrectResultList] = useState([])    // 批改结果  只自己用
    useEffect(()=>{
      props.route.params.CorrectResultList?setCorrectResultList(props.route.params.CorrectResultList):setCorrectResultList([])
      getData()
      navigation.setOptions({title:props.route.params.userCn,
        // headerRight:()=>(<Menu getselectedindex={setSelectedIndex} learnPlanId={props.route.params.learnId}/>)
      })
      setSelectedIndex(props.route.params.selectedindex)
  
    },[props.route.params.selectedindex])
    
    function getData(){
      const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_correctingHomeWork.do";
      const params = {
            taskId:taskId,  //作业id或者导学案id
            type:type,          //  paper,表示作业；learnPlan表示导学案
            userName:userName,          //  学生ID         
          };
      if(!success){
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          //判断是否批改全部试题展示  是否显示全部试题
          //先遍历，把试题分数 学生得分  拼接成一个  批改结果 的数组  自己用
          //如果是 保存批改结果  跳回来的  那这个批改结果数组长度就不是0   不需要再拼接了
          if(CorrectResultList.length==0){
            var List = [];
            resJson.data.handList.map(function(item,index){
              List.push(
                {
                order:item.order,
                questionID:item.questionID,
                stuscore:item.stuscore,
                questionScore:item.questionScore,
                status:item.status,
                stuAnswer:item.stuAnswer,
                hand:0}
              )
            })
            Allquestion=List
            setCorrectResultList(List)
          }

          //根据模式来  指定在批改页面要展示的试题顺序     只有在第一次进入批改页面的时候 并且 模式是只显示需要手工批改的题目才会执行，其余的情况每次进来都是模式为所有试题
          if(!props.route.params.CorrectAllQuestion){
            Allquestion =resJson.data.handList;//这里是为了记录 返回的数据，当跳出这个页面的时候  就需要把全部试题设置到这里面了
            var NoAllQuestionList =[];
            resJson.data.handList.map(function(item,index){
              if(item.status=='4'){
                NoAllQuestionList.push(item)
              }
            })
            setData(NoAllQuestionList)
          }else{
            setData(resJson.data.handList)
          }

          setSuccess(resJson.success)


        // 如果autoMark值为yes  则跳转到结果页面，也给他批改结果数组
        if(resJson.data.autoMark=='yes'){
          setData(Allquestion)
          setSelectedIndex(CorrectResultList.length)
         }
          
          });                                                   
        }
    }

    //上一题
    function Thepreviousquestion(index){
        if(index<0){
          Toast.showSuccessToast('已经是第一题了',1000)
        }else{
          setSelectedIndex(index)
        }
    }

    //下一题
    function Nextquestion(index){
      if(index>(data.length-1)){
        if(data.length==Allquestion.length){
          setSelectedIndex(index)
        }else{
          setData(Allquestion)
          Alert.alert('','所有题目已批改',[{},
            {text:'ok',onPress:()=>setSelectedIndex(Allquestion.length)}
          ])
        }
      }else{
        setSelectedIndex(index)
      }
    }
    

    function loading(success){
      if(!success){
          return(
            <Layout style={styles.tab} level='2'>
              <Loading show='true' color='#59B9E0'/>
            </Layout> )
        }else{ return '' }
      }

    function lodaingSubmitPager(success){
      if(success){
        return(
          <Layout style={styles.tab} level='2'>
            <CorrectSubmitContainer CorrectResultList={CorrectResultList} setSelectedIndex={setSelectedIndex}/>
          </Layout> )
      }else{ return '' }
    }
    

    function loadingButton(ststus){
      if(ststus){
              if(selectedIndex==data.length){
                return(
                  <View style={{flexDirection:'row',
                              position:'relative',
                              alignItems:'center',
                              backgroundColor:'#FFFFFF',
                              borderTopColor:'#000000',
                              height:60,
                              paddingTop:5,
                              borderTopWidth:0.5,
                              justifyContent:'space-around'}}>
                      <Button style={{width:'80%'}} onPress={()=>{submit_correctResult()}}>保存批阅结果</Button>
                  </View>
            )}else{
                return(
                  <View style={{flexDirection:'row',
                              position:'relative',
                              alignItems:'center',
                              backgroundColor:'#FFFFFF',
                              borderTopColor:'#000000',
                              height:60,
                              paddingTop:5,
                              borderTopWidth:0.5,
                              justifyContent:'space-around'}}>
                      <Button style={{width:'40%',backgroundColor:selectedIndex==0?'#A9A9A9':'#62C3E4'}} 
                                onPress={()=>{Thepreviousquestion(selectedIndex-1)}}>上一题</Button>
        
                      <Button  style={{width:'40%'}}
                                  onPress={()=>{Nextquestion(selectedIndex+1)}}>下一题</Button>
                  </View>
            )
              }
      }else{return(<View style={{backgroundColor:'#FFFFFF',height:80}}></View>)
      }
      
    }


    function submit_correctResult(){
      WaitLoading.show('保存结果中...',-1)
      let newsonStr =[];
      let newscoreCount=0
      let newstuScoreCount=0
      CorrectResultList.map((item,index)=>{
        newscoreCount+=parseFloat(item.questionScore) 
        newstuScoreCount+=parseFloat(item.stuscore)
        newsonStr.push(
          {stuscore:item.stuscore+'',questionID:item.questionID}
        )
      })
      const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_saveHomeWorkCorrectResult.do";
      const params = {
            taskId:taskId,  //作业id或者导学案id
            type:type,             //  paper,表示作业；learnPlan表示导学案
            userName:global.constants.userName,             // 教师登录名
            teacherName:global.constants.userCn,          // 教师姓名
            stuUserName:userName,            // 学生登录名
            stuScoreCount:newstuScoreCount,
            scoreCount:newscoreCount,
            jsonStr:JSON.stringify(newsonStr),              // 格式如下    
          };
        console.log(JSON.stringify(newsonStr))
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          console.log(resJson)
          if(resJson.success){
            WaitLoading.dismiss()
              //提交完之后 跳转 PaperList  刷新页面
              navigation.navigate({
                  name:'CorrectPaperList',
                  params:{ 
                    taskId:taskId, 
                    type:type,
                    whohassubmit:userName
                      },
                  megre:true})
          }else{
            Toast.showInfoToast('保存失败,重新保存!')
          }
          });
        
    }

    return (
      <View>
        {/* 自定义导航栏 */}
        <View style={{height:50,flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF'}}>
         <TouchableOpacity style={{marginLeft:10,marginRight:10}} 
                                  onPress={()=>{navigation.goBack({
                                              name: 'CorrectPaperList',
                                              params:{ 
                                                  taskId:props.route.params.taskId,
                                                  type:props.route.params.type
                                                    }
                                          })
              }}>
                  <Image style={{width:30,height:30}} source={require('../../../assets/teacherLatestPage/goback.png')} ></Image>
          </TouchableOpacity>
          

          <View style={{flexDirection:'row',marginLeft:90}}>
              <Text style={{color:'#59B9E0',fontSize:20}}>{userCn}</Text>
          </View>
          {(selectedIndex!=Allquestion.length)?(<TouchableOpacity style={{position:'absolute',right:16,top:13}}
                            onPress={()=>{
                              if(data.length==CorrectResultList.length){
                                setSelectedIndex(data.length)
                              }else{
                                setData(Allquestion)
                                // setSelectedIndex(Allquestion.length)
                                Alert.alert('','确定跳转保存结果页面？',[{},
                                  {text:'ok',onPress:()=>{setSelectedIndex(Allquestion.length)}}
                                ])
                              }
                              }}>
            <Image source={require('../../../assets/image3/look.png')}></Image>
          </TouchableOpacity>):(<></>)}
          
          
        </View>
        <Waiting/>
        <ViewPager 
            style={{backgroundColor:'#FFFFFF',borderTopColor:'#000000',borderTopWidth:0.5,height:'85%'}} 
            shouldLoadComponent={shouldLoadComponent}
            selectedIndex={selectedIndex} 
            onSelect={index => setSelectedIndex(index)}
             // 关闭左右滑动
            swipeEnabled ={false}
            > 
            {/* 加载loading */}
            {loading(success)}
            
            {/* 获取数据成功&&执行 加载题目页面 */}
            {success&&data.map(function(item,index){
                      return(
                        <Layout key={index} style={styles.tab}>
                          <ScrollView>
                            <PaperContent userCn={userCn} 
                                          userName={userName} 
                                          type={type} 
                                          taskId={taskId}
                                          CorrectAllQuestion={CorrectAllQuestion}
                                          data={item}
                                          CorrectResultList={CorrectResultList}    //批改 结果 数据
                                          setCorrected={setCorrectResultList}      //修改  结果  函数
                                          navigation={navigation}/>
                          </ScrollView>
                        </Layout>
                      )
            })
            }

            {/* 提交页面 */}
            {lodaingSubmitPager(success)}
        </ViewPager>

          {/* 加载按钮区域 */}
          {loadingButton(data.length>0)}
      </View>
    )
  }

  const styles = StyleSheet.create({
    tab: {
      height: "100%",
      backgroundColor:'#FFFFFF'
    },
    Titletext:{
      fontWeight:'bold',
      color:	'#000000',
      fontSize: 20,
      marginTop:5,
      marginBottom:10
    }
  })