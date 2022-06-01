import {Text, View,Image,ScrollView,TouchableOpacity,Modal, Alert } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { Button, List } from '@ui-kitten/components'
import { useNavigation } from "@react-navigation/native";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import { TextInput } from 'react-native-gesture-handler';
import PicturesWorkContent from './PicturesWorkContent'
import http from '../../../utils/http/request';
import res from 'antd-mobile-icons/es/AaOutline';
import Toast from '../../../utils/Toast/Toast';
import { Waiting, WaitLoading } from "../../../utils/WaitLoading/WaitLoading";
var TiMuTypeList = []
export default function EditWorkContioner(props) {
  const navigation=useNavigation()
  const channelCode      =props.route.params.channelCode?props.route.params.channelCode:''
  const subjectCode      =props.route.params.subjectCode?props.route.params.subjectCode:''
  const textBookCode     =props.route.params.textBookCode?props.route.params.textBookCode:''
  const gradeLevelCode   =props.route.params.gradeLevelCode?props.route.params.gradeLevelCode:''
  const pointCode        =props.route.params.pointCode?props.route.params.pointCode:''
  const channelName      =props.route.params.channelName?props.route.params.channelName:''
  const subjectName      =props.route.params.subjectName?props.route.params.subjectName:''
  const textBookName     =props.route.params.textBookName?props.route.params.textBookName:''
  const gradeLevelName   =props.route.params.gradeLevelName?props.route.params.gradeLevelName:''
  const pointName        =props.route.params.paperName?props.route.params.paperName:''
  const paperName        =props.route.params.paperName?props.route.params.paperName:''
  const type             =props.route.params.type?props.route.params.type:''
  const paperId          =props.route.params.paperId?props.route.params.paperId:''

  useEffect(()=>{
    getTimuType()
      }
    ,[]) 
  
    function getTimuType(){
      const url =
        "http://" +
        "www.cn901.net" +
        ":8111" +
        "/AppServer/ajax/teacherApp_phoneGetQueType.do";
      const params = {
            token:     global.constants.token,
            subjectId: subjectCode,                  // 学科编码
          };
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          TiMuTypeList=resJson.data
        })

  }

  return (<EditWork navigation={navigation} 
                    channelCode={channelCode}       //学段id
                    subjectCode={subjectCode}       //学科id
                    textBookCode={textBookCode}     //版本id
                    gradeLevelCode={gradeLevelCode} //教材id
                    pointCode={pointCode}           //知识点id
                    channelName={channelName}       //学段name
                    subjectName={subjectName}       //学科name
                    textBookName={textBookName}     //版本name
                    gradeLevelName={gradeLevelName} //教材name
                    pointName={pointName}           //知识点name
                    paperName={paperName} 
                    type={type}                     //新建还是修改
                    paperId={paperId}
                    />)
}


class EditWork extends Component{
  constructor(props){
    super(props)
    this.getorderCount=this.getorderCount.bind(this)
    this.setLookAnswerAndAnalysisStatusItemOrder=this.setLookAnswerAndAnalysisStatusItemOrder.bind(this)
    this.deleteTimu=this.deleteTimu.bind(this)
    this.shangyiTimu=this.shangyiTimu.bind(this)
    this.xiayiTimu=this.xiayiTimu.bind(this)
    this.showaddTimuSetModal=this.showaddTimuSetModal.bind(this)
    this.setContentList=this.setContentList.bind(this)
    this.updateupdateFlag =this.updateupdateFlag.bind(this)
    this.setanswerNum     = this.setanswerNum.bind(this)
    this.state={
        updateFlag:0,   //记录保存后是否继续修改   0 代表未修改  1代表修改
        paperName:'',
        paperId:'-1',    //保存之后就会获取到这个paperID  
        subjectName:'',
        data:[],
        qusetionTypeList:[{"baseTypeId": "101", "score": "2", "typeId": "60000001","typeName": "单项选择题"}, 
                          {"baseTypeId": "102", "score": "2","typeId": "60000002", "typeName": "多项选择题"},
                          {"baseTypeId": "103", "score": "2", "typeId": "60000003", "typeName": "判断题"},
                          {"baseTypeId": "104", "score": "2", "typeId": "60000004", "typeName": "填空题"},
                          {"baseTypeId": "106", "score": "10", "typeId": "60000200", "typeName": "解答题"}
                        ],
        modalVisible:false,
        success:false,
        baseTypeId:'',                                 //记录题目基本类型
        typeId:'',                                    //记录题目类型
        questionName:'',                              // 记录题目名称
        questionScore:'0',                             //记录题目分值
        EnglishReadTimuNum:'5',                         //英语阅读小题数量
        EnglishReadTimuScore:'2',                      //英语小题分数

        LookAnswerAndAnalysisStatusItemOrder:'1',      //记录查看答案和解析状态   用数字代替   只能有一个试题能看 其余全都是折叠
        isupdateExistTimuOrder:'new'                     //记录是否是在修改题目的名称和分值  new代表是新创建  order代表是修改的第几题
    }
  }
  componentWillUnmount(){
    console.log('组件卸载了')
  }
  //走的是编辑试卷的接口  只有编辑的时候才走这个接口
  EditData(paperId,paperName){
    const url =
        "http://" +
        "www.cn901.net" +
        ":8111" +
        "/AppServer/ajax/teacherApp_phoneEditZY.do";
    const params = {
            userName:global.constants.userName,
            paperId: paperId,                      // 传过来的paperID
          };
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          console.log('接收到的数据',resJson)
          var newdata = []
          resJson.data.map((item=>{
            newdata.push(
              {
                answerNum:item.answerNum,  //默认单选多选都是4个选项
                typeId:item.typeId, 
                questionScore:item.score,
                baseTypeId:item.baseTypeId,
                questionName:item.typeName,
                questionId:item.questionId,
                subjectName:this.props.subjectName,
                TimuContentList:new Array(item.shitiShow),
                AnswerContentList:new Array(item.shitiAnswer),
                AnalysisContentList:new Array(item.shitiAnalysis)
                //用这三个也可以
                // "shitiShowList": ["</p>"],
                // "shitiAnswerList": [],
                // "shitiAnalysisList": ["略<\\/p>"],
              }
            )
          }))
          this.setState({data:newdata,
                          paperId:paperId,
                          paperName:paperName})
        })
  }

  UNSAFE_componentWillMount(){
    //根据 type参数判断，如果是编辑进来的 进入EditData函数
    if(this.props.type=='update'){
      this.EditData(this.props.paperId,this.props.paperName)
    }else{
      this.setState({paperName:this.props.paperName,subjectName:this.props.subjectName})
    }
     
  }

  updateupdateFlag(){
    this.setState({updateFlag:1})
  }
  //添加试题，（包括传参数--修改题目的情况）
  addTimu(typeId,typeName,baseTypeId,score){
    if(this.state.typeId==''){
      Toast.showInfoToast('请选择题目类型',1000)
    }else if(this.state.questionScore==''){
      Toast.showInfoToast('请设置试题分值',1000)
    }else{
          this.setState({modalVisible:false})
          var newdata = this.state.data
          if(this.state.isupdateExistTimuOrder!='new'){
                newdata[(this.state.isupdateExistTimuOrder-1)].typeId=this.state.typeId
                newdata[(this.state.isupdateExistTimuOrder-1)].baseTypeId=this.state.baseTypeId
                newdata[(this.state.isupdateExistTimuOrder-1)].questionName=this.state.questionName
                newdata[(this.state.isupdateExistTimuOrder-1)].questionScore=this.state.questionScore
                this.setState({modalVisible:false,
                  updateFlag:0,
                  data:newdata,
                  typeId:'',
                  questionName:'',
                  baseTypeId:'',
                  questionScore:'',
                  LookAnswerAndAnalysisStatusItemOrder:this.state.isupdateExistTimuOrder,
                  isupdateExistTimuOrder:'new'
              })
          }else{
              const url =
                "http://" +
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/teacherApp_phoneAddQuestion.do";
              const params = {
                    token:     global.constants.token,
                    userName:		global.constants.userName,
                    channelCode:this.props.channelCode,
                    subjectCode:this.props.subjectCode,
                    textBookCode:this.props.textBookCode,
                    gradeLevelCode:this.props.gradeLevelCode,
                    pointCode:this.props.pointCode,
                    channelName:this.props.channelName,
                    subjectName:this.props.subjectName,
                    textBookName:this.props.textBookName,
                    gradeLevelName:this.props.gradeLevelName,
                    pointName:this.props.pointName,
                    typeId:typeId,
                    typeName:typeName,
                    baseTypeId:baseTypeId,
                    score:score,
                  };
              http.get(url, params).then((resStr) => {
                let resJson = JSON.parse(resStr);
                if(resJson.success){
                  newdata.push({ 
                    answerNum:4,  //默认单选多选都是4个选项
                    typeId:this.state.typeId, 
                    questionScore:this.state.questionScore,
                    baseTypeId:this.state.baseTypeId,
                    questionName:this.state.questionName,
                    subjectName:this.props.subjectName,
                    questionId:resJson.data,
                    TimuContentList:[],
                    AnswerContentList:[],
                    AnalysisContentList:[]})
                  this.setState({
                    updateFlag:0,
                    data:newdata,
                    typeId:'',
                    baseTypeId:'',
                    questionName:'',
                    questionScore:'',
                    LookAnswerAndAnalysisStatusItemOrder:this.state.data.length,
                    isupdateExistTimuOrder:'new'
                  })
                  this.updateupdateFlag()
                }
              })
              this._scrollView_paper.scrollToEnd()
          }
    }

  }
  
  //针对类型为 单选 多选 修改答案数量的
  setanswerNum(index,changeNum){
    //changeNum  +1    -1 两个值
    var newdata =this.state.data
    newdata[parseInt(index)-1].answerNum += changeNum;
    this.setState({data:newdata})
  }

  //展示添加试题的弹窗，（包括传参数--修改 标题 和 分值 的情况）
  showaddTimuSetModal(typeId,typeName,baseTypeId,score,order){
    if(order!=null&&score!=null&&typeName!=null&&typeId!=null&&baseTypeId!=null){
      this.setState(
        {
          modalVisible:true,
          baseTypeId:baseTypeId,
          typeId:typeId,
          questionName:typeName,
          questionScore:score,
          isupdateExistTimuOrder:order
        }
      )
    }else{
      this.setState({modalVisible:true})
    }
    
  }

  showTimuTypeSelect(lsit){
    var List = []
    lsit.map((item,index)=>{
      List.push(
                  <TouchableOpacity key={index} onPress={
                    ()=>{
                      if(item.typeName=='阅读理解题'||item.typeName=='七选五'){
                        this.setState({typeId:item.typeId,
                          questionName:item.typeName,
                          baseTypeId:item.baseTypeId,
                          questionScore:item.score,
                          EnglishReadTimuNum:'5',
                          EnglishReadTimuScore:'2',
                        })
                      }else if(item.typeName=='完形填空题'){
                        this.setState({typeId:item.typeId,
                          questionName:item.typeName,
                          baseTypeId:item.baseTypeId,
                          questionScore:item.score,
                          EnglishReadTimuNum:'10',
                          EnglishReadTimuScore:'2',
                        })
                      }else{
                        this.setState({typeId:item.typeId,
                          questionName:item.typeName,
                          baseTypeId:item.baseTypeId,
                          questionScore:item.score})
                      }
                    }
                  }>
                    <View key={index} style={{backgroundColor:'#D3D3D3',
                                    height:35,margin:8,borderColor:'red',padding:5,paddingLeft:10,paddingRight:10,
                                    borderWidth:this.state.typeId==item.typeId?1:0
                                    }}>
                            <Text style={{fontSize:16}}>{item.typeName}</Text>
                    </View>
                  </TouchableOpacity>
                    
        )
    })
    return List
  }

  shangyiTimu(Timuindex){
    this.updateupdateFlag()
    var newTimudata  = []
    if( parseInt(Timuindex)>1){
      var changeTimudata1 = this.state.data[Timuindex-2]
      var changeTimudata2 = this.state.data[Timuindex-1]
      this.state.data.map((item,index)=>{
        if(index==(Timuindex-2)){
          newTimudata.push(changeTimudata2)
        }else if(index==(Timuindex-1)){
          newTimudata.push(changeTimudata1)
        }else{
          newTimudata.push(item)
        }
      });
      this.setState({data:newTimudata,LookAnswerAndAnalysisStatusItemOrder:(Timuindex-1)})
    }
  }

  xiayiTimu(Timuindex){
    this.updateupdateFlag()
    var newTimudata  = []
    if(parseInt(Timuindex)<(this.state.data.length)){
      var changeTimudata1 = this.state.data[Timuindex-1]
      var changeTimudata2 = this.state.data[Timuindex]
  
      this.state.data.map((item,index)=>{
        if(index==(Timuindex-1)){
          newTimudata.push(changeTimudata2)
        }else if(index==(Timuindex)){
          newTimudata.push(changeTimudata1)
        }else{
          newTimudata.push(item)
        }
      });
      this.setState({data:newTimudata,LookAnswerAndAnalysisStatusItemOrder:(Timuindex+1)})
    }
    
  }

  deleteTimu(Timuindex,questionId){
    this.updateupdateFlag()
    const url =
      "http://" +
      "www.cn901.net" +
      ":8111" +
      "/AppServer/ajax/teacherApp_phoneDeleteQuestion.do";
    const params = {
          token:global.constants.token,
          questionId: questionId,                           // 学科编码
        };
      http.get(url, params).then((resStr) => {
        let resJson = JSON.parse(resStr);
        if(resJson.success){
          var newTimudata =[]
          this.state.data.map((item,index)=>{
            if(index!=(Timuindex-1)){
              newTimudata.push(item)
            }
          });
          this.setState({data:newTimudata,updateFlag:0,})
        }else{
            Toast.showInfoToast('再试一下',500)
        }

      })


    
  }

  //设置第几个题目的答案和解析不折叠
  setLookAnswerAndAnalysisStatusItemOrder(str){
    this.setState({LookAnswerAndAnalysisStatusItemOrder:str})
  }

  //获取试题的总数
  getorderCount(){
    return(this.state.data.length)
  }

  //设置试题的题面、答案、解析的内容list
  setContentList(order,type,List){
    this.updateupdateFlag()
    var newdataList = this.state.data
    if(type=='Show'){
      newdataList[parseInt(order)-1].TimuContentList     =  List
      this.setState({data:newdataList})
    }else if(type=='Answer'){
      newdataList[parseInt(order)-1].AnswerContentList   = List
    }else if(type=='Analysis'){
      newdataList[parseInt(order)-1].AnalysisContentList = List
    }
    this.setState({data:newdataList})
    
  }

  //渲染试题
  getShiTi(data){
    if(data.length>0){
      var List= [];
      data.map((item,index)=>{
        List.push(<PicturesWorkContent questionName={item.questionName} 
                                       typeId={item.typeId}
                                       baseTypeId={item.baseTypeId}
                                       subjectName={this.state.subjectName}
                                       EnglishReadTimuNum={this.state.EnglishReadTimuNum}
                                       EnglishReadTimuScore={this.state.EnglishReadTimuScore}
                                       questionScore={item.questionScore} 
                                       questionId={this.state.data[index].questionId}  //传过去试题ID
                                       TimuContentList={this.state.data[index].TimuContentList}
                                       AnswerContentList={this.state.data[index].AnswerContentList}
                                       AnalysisContentList={this.state.data[index].AnalysisContentList}
                                       addContentList={this.setContentList}
                                       LookAnswerAndAnalysisStatusItemOrder={this.state.LookAnswerAndAnalysisStatusItemOrder}
                                       setLookAnswerAndAnalysisStatus={this.setLookAnswerAndAnalysisStatusItemOrder}
                                       order={index+1}                                   //记录索引
                                       orderCount={data.length}                          //试题的总数，获取编辑页面的  data.length
                                       shangyi={this.shangyiTimu}                       //上移题目用的函数
                                       xiayi={this.xiayiTimu}                           // 下移题目用的函数
                                       deleteTimu={this.deleteTimu}                     //删除题目用的函数
                                       showaddTimuSetModal={this.showaddTimuSetModal}   //修改题目用的函数
                                       updateupdateFlag={this.updateupdateFlag}         //记录是否修改了试卷
                                       setanswerNum={this.setanswerNum}                  //用于101  102  修改答案数量的
                                       />)
      })
      return List;
    }else{
      return(
        <View style={{alignItems:'center',alignContent:'center',height:'100%'}}>
          <Image style={{width:200,height:250,marginTop:100}} source={require('../../../assets/TakePicturesAndAssignWork/beijing.png')}></Image>
        </View>
      )
    }
    
  }

  //变RN的Text Image 为<p> </p>   <p> <img src='' </p>
  listchangeToStr(list,baseTypeId,subjectName){
    if(baseTypeId=='108'&&subjectName=='英语'){
      var Str =''
      list.map((item)=>{
        Str+=(','+item)
       })
      return Str.substring(1)
    }else{
      var Str =''
      list.map((item)=>{
        Str+=item
       })
      return Str
    }
    
  }

  checkTimuAndAnswerisnull(data1,data2){
    return (data1.length>0&&data2.length>0)
  }

  //保存试题
  savepaper(Assign){
    var isnull = true;
    this.state.data.map((item,index)=>{
      console.log(index,this.checkTimuAndAnswerisnull(item.TimuContentList,item.AnswerContentList))
      isnull = isnull&&this.checkTimuAndAnswerisnull(item.TimuContentList,item.AnswerContentList)
      if(!this.checkTimuAndAnswerisnull(item.TimuContentList,item.AnswerContentList)){
        if(item.TimuContentList.length==0){
          const str= '请设置第'+(index+1)+'题题面'
          Alert.alert(str)
          Toast.showWarningToast(str,1000)
        }else{
          const str= '请设置第'+(index+1)+'题答案'
          Alert.alert(str)
          Toast.showWarningToast(str,1000)
        }
      }
    })
    console.log('保存参数之前','paperId：',this.state.paperId,'isnull：',isnull,'Assign:',Assign)
    //如果都不为空  保存或者提交
    if(isnull&&this.state.paperId=='-1'){
      WaitLoading.show('保存中...',-1)
          var SubAnswerStr = []
          this.state.data.map((item,index)=>{
            SubAnswerStr.push({
              "questionId":item.questionId,
              "shitiShow":this.listchangeToStr(item.TimuContentList),
              "shitiAnswer":this.listchangeToStr(item.AnswerContentList,item.baseTypeId,item.subjectName),
              "shitiAnalysis":(item.AnalysisContentList.length==0)?'略':this.listchangeToStr(item.AnalysisContentList),
              "baseTypeId":item.baseTypeId,
              "typeId" :item.typeId,
              "typeName" :item.questionName,
              "score" :item.questionScore,
              "order" :index+1,
              "answerNum":item.baseTypeId=='101'?item.answerNum:item.baseTypeId=='102'?item.answerNum:"-1",    //101   102 存选项个数       否则-1
              "smallQueNum":item.baseTypeId=='108'?item.AnswerContentList.length:"-1"                    // 108   英语  存小题个数   否则-1
            })})
            var newjsonstr=''
            SubAnswerStr.map(item=>{
              newjsonstr+=','+JSON.stringify(item)
            })
            newjsonstr =newjsonstr.substring(1)
            console.log('提交要保存的数据是:',newjsonstr)

          //2.调用接口，同时页面进行loadding，并提示“试题正在保存中...”
            const url =
              "http://" +
              "www.cn901.net" +
              ":8111" +
              "/AppServer/ajax/teacherApp_phoneSaveQuestionAndPaper.do";
            const params = {
                  token:     global.constants.token,
                  userName: global.constants.userName,                  // 学科编码
                  paperName:this.state.paperName,
                  paperId:this.state.paperId,
                  jsonStr:'['+newjsonstr+']',                                      //封装的试题信息
                  channelCode:this.props.channelCode,              //学段id
                  subjectCode:this.props.subjectCode,              //学科id
                  textBookCode:this.props.textBookCode,            //版本id
                  gradeLevelCode:this.props.gradeLevelCode,        //教材id
                  pointCode:this.props.pointCode,                  //知识点id
                  channelName:this.props.channelName,              //学段Name
                  subjectName:this.props.subjectName,              //学科Name
                  textBookName:this.props.textBookName,            //版本Name
                  gradeLevelName:this.props.gradeLevelName,        //教材Name
                  pointName:this.props.pointName,                  //知识点Name
                };
            // console.log('提交了.....')
              http.get(url, params).then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('保存接口：',resJson)
                //根据接口返回值，直接提示message
                if(resJson.success){
                  // console.log('请求了试卷id',resJson)
                  this.setState({paperId:resJson.data,updateFlag:1,})
                  if(Assign){
                    WaitLoading.dismiss()
                    this.props.navigation.navigate({
                      name:'AssignPicturePaperWork',
                      params:{
                        paperName:this.state.paperName,
                        paperId:resJson.data,
                      }
                    })
                  }else{
                    WaitLoading.show_success('保存成功！',1000)
                  }
                }else{
                  WaitLoading.show_false()
                  console.log('保存失败！')
                  Toast.showDangerToast('保存失败！',1000)
                }
              })
    }else if(!Assign&&this.state.paperId!='-1'){
      Alert.alert('试卷已经保存！')
      Toast.showSuccessToast('试卷已经保存！',2000)
    }
    if(Assign){
      this.props.navigation.navigate({
        name:'AssignPicturePaperWork',
        params:{
            paperId:this.state.paperId,
            paperName:this.state.paperName
        }
    })
    }

  }

  render() {
    const data =this.state.data
    const navigation = this.props.navigation
      return (
      <>
                <Modal        animationType="none"
                              transparent={true}
                              visible={this.state.modalVisible}
                              onRequestClose={()=>{
                                this.setState({modalVisible:false})
                                }}
                            >
                  <View style={{height:'100%'}}>
                    <View style={{justifyContent:'center',backgroundColor:'#FFFFFF',marginTop:'30%',margin:10,alignItems:'center'}}>
                        <View style={{margin:20}}>
                          <Text style={{fontSize:20}}>请选择题型</Text>
                        </View>
                        
                          <View style={{flexDirection:'row',marginBottom:40,width:'100%',flexWrap:'wrap',paddingLeft:10,paddingRight:10}}>
                              {TiMuTypeList.length>0?this.showTimuTypeSelect(TiMuTypeList)
                                                    :this.showTimuTypeSelect(this.state.qusetionTypeList)}
                          </View>
                        
                                
                        {/* 选中题目才可以显示 */}
                        {this.state.typeId!=''&&this.state.baseTypeId!='108'?(
                          <View style={{width:'60%',borderBottomWidth:1,paddingLeft:20,flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                              <Text style={{marginRight:30}}>分值</Text>
                              <TextInput placeholder='请输入分数' 
                                        value={this.state.questionScore}
                                        onChangeText={(text)=>{
                                          this.setState({questionScore:text.replace(/[^\d]+/, '')})
                                          }}
                              ></TextInput>
                          </View>
                        ):this.state.typeId!=''&&this.props.subjectName=='英语'&&this.state.baseTypeId=='108'?(
                          <>
                          <View style={{width:'70%',borderBottomWidth:1,paddingLeft:20,flexDirection:'row',alignItems:'center'}}>
                              <Text style={{marginRight:30}}>每道子题目预设分值</Text>
                              <TextInput placeholder='请输入小题分数' 
                                        value={this.state.EnglishReadTimuScore}
                                        onChangeText={(text)=>{
                                          this.setState({EnglishReadTimuScore:parseInt(text.replace(/[^\d]+/, '')),questionScore:parseInt(text.replace(/[^\d]+/, ''))*this.state.EnglishReadTimuNum})
                                          }}
                              ></TextInput>
                          </View>
                          <View style={{width:'70%',borderBottomWidth:1,paddingLeft:20,flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                              <Text style={{marginRight:100}}>子题数量</Text>
                              <TextInput placeholder='请输入小题数量' 
                                        value={this.state.EnglishReadTimuNum}
                                        onChangeText={(text)=>{
                                          this.setState({EnglishReadTimuNum:text.replace(/[^\d]+/, '')})
                                          }}
                              ></TextInput>
                          </View>
                          </>
                          
                        ):(<View></View>)}
                        

                        <View style={{flexDirection:'row',width:'30%',justifyContent:'space-between',marginBottom:20}}>
                            <TouchableOpacity onPress={()=>{
                              this.setState({ modalVisible:false,
                                              typeId:'',
                                              baseTypeId:'',
                                              questionName:'',
                                              questionScore:'',
                                              isupdateExistTimuOrder:'new'})
                            }}><Text style={{color:'#59B9E0'}}>取消</Text></TouchableOpacity>

                            <TouchableOpacity onPress={()=>{
                              this.addTimu(
                                this.state.typeId,
                                this.state.questionName,
                                this.state.baseTypeId,
                                this.state.questionScore)
                            }}>
                              <Text style={{color:'#59B9E0'}}>确定</Text></TouchableOpacity>
                        </View>
                    </View>
                  </View>
                  
                
                </Modal>
        
        <View style={{backgroundColor:'#FFFFFF',opacity:this.state.modalVisible?0.2:1,}}>
          <View style={{height:60,flexDirection:'row',justifyContent:'space-between',zIndex:0,
          alignItems:'center',paddingRight:10,paddingLeft:8,borderBottomWidth:0.5}}>
            <TouchableOpacity onPress={()=>{
                  navigation.goBack({
                    name: 'CreatePicturePaperWork',
                })
            }}>
                <Image style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/goback.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{

              this.showaddTimuSetModal()

            }}>
                <Image  source={require('../../../assets/TakePicturesAndAssignWork/addtitle.png')}></Image>  
            </TouchableOpacity>
          </View>



          <ScrollView style={{height:'85%',}}
              ref={ref => this._scrollView_paper = ref}
              >
                <Waiting/>

            {/* 试题为空 显示图片 */}
            {this.getShiTi(data)}

          </ScrollView>

          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <Button onPress={()=>{
                    if(this.state.data.length==0){
                      Alert.alert('请先添加试题！')
                      Toast.showWarningToast('请先添加试题！',1000)
                    }else{
                    
                      this.savepaper(false)
                    }
                  }
                } style={{width:'40%',backgroundColor:'#1E90FF'}}>保存</Button>
              <Button onPress={()=>{
                if(this.state.data.length==0){
                  Alert.alert('请先添加试题！')
                  Toast.showWarningToast('请先添加试题！',1000)
                }else{
                  if(this.state.updateFlag=='0'){
                    navigation.navigate({
                      name:'AssignPicturePaperWork',
                      params:{
                        paperName:this.state.paperName,
                        paperId:this.state.paperId
                      }
                    })
                  }else{
                    this.savepaper(true)
                  }
                }
                
              }}
                  style={{width:'40%',backgroundColor:'#1E90FF'}}>布置</Button>
          </View>
      </View>
      </>
      
    )
  }
}



