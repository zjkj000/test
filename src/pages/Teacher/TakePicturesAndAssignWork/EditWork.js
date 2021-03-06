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
  const pointName        =props.route.params.pointName?props.route.params.pointName:''
  const paperName        =props.route.params.paperName?props.route.params.paperName:''
  const type             =props.route.params.type?props.route.params.type:''
  const paperId          =props.route.params.paperId?props.route.params.paperId:''
  useEffect(()=>{
    getTimuType()
      }
    ,[]) 
  
    function getTimuType(){
      const url = global.constants.baseUrl+"teacherApp_phoneGetQueType.do";
      const params = {
            token:     global.constants.token,
            subjectId: subjectCode,                  // ????????????
          };
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          TiMuTypeList=resJson.data
        })

  }

  return (<EditWork navigation={navigation} 
                    channelCode={channelCode}       //??????id
                    subjectCode={subjectCode}       //??????id
                    textBookCode={textBookCode}     //??????id
                    gradeLevelCode={gradeLevelCode} //??????id
                    pointCode={pointCode}           //?????????id
                    channelName={channelName}       //??????name
                    subjectName={subjectName}       //??????name
                    textBookName={textBookName}     //??????name
                    gradeLevelName={gradeLevelName} //??????name
                    pointName={pointName}           //?????????name
                    paperName={paperName} 
                    type={type}                     //??????????????????
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
        updateFlag:'0',   //?????????????????????????????????   0 ???????????????    1???????????????
        paperName:'',
        paperId:'-1',    //?????????????????????????????????paperID  
        subjectName:'',
        data:[],
        qusetionTypeList:[{"baseTypeId": "101", "score": "2", "typeId": "60000001","typeName": "???????????????"}, 
                          {"baseTypeId": "102", "score": "2","typeId": "60000002", "typeName": "???????????????"},
                          {"baseTypeId": "103", "score": "2", "typeId": "60000003", "typeName": "?????????"},
                          {"baseTypeId": "104", "score": "2", "typeId": "60000004", "typeName": "?????????"},
                          {"baseTypeId": "106", "score": "10", "typeId": "60000200", "typeName": "?????????"}
                        ],
        modalVisible:false,
        success:false,
        baseTypeId:'',                                 //????????????????????????
        typeId:'',                                    //??????????????????
        questionName:'',                              // ??????????????????
        questionScore:'0',                             //??????????????????
        EnglishReadTimuNum:'5',                         //????????????????????????
        EnglishReadTimuScore:'2',                      //??????????????????

        LookAnswerAndAnalysisStatusItemOrder:'1',      //?????????????????????????????????   ???????????????   ??????????????????????????? ?????????????????????
        isupdateExistTimuOrder:'new'                     //????????????????????????????????????????????????  new??????????????????  order???????????????????????????
    }
  }
  
  //??????????????????????????????  ???????????????????????????????????????
  EditData(paperId,paperName){
    const url = global.constants.baseUrl+"teacherApp_phoneEditZY.do";
    const params = {
            userName:global.constants.userName,
            paperId: paperId,                      // ????????????paperID
          };
        http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          var newdata = []
          resJson.data.map((item=>{
            newdata.push(
              {
                answerNum:item.answerNum,  //????????????????????????4?????????
                typeId:item.typeId, 
                questionScore:item.score,
                baseTypeId:item.baseTypeId,
                questionName:item.typeName,
                questionId:item.questionId,
                subjectName:this.props.subjectName,
                TimuContentList:new Array(item.shitiShow),
                AnswerContentList:new Array(item.shitiAnswer),
                AnalysisContentList:new Array(item.shitiAnalysis)
                //?????????????????????
                // "shitiShowList": ["</p>"],
                // "shitiAnswerList": [],
                // "shitiAnalysisList": ["???<\\/p>"],
              }
            )
          }))
          this.setState({data:newdata,
                          paperId:paperId,
                          paperName:paperName})
        })
  }

  UNSAFE_componentWillMount(){
    //?????? type??????????????????????????????????????? ??????EditData??????
    if(this.props.type=='update'){
      this.EditData(this.props.paperId,this.props.paperName)
    }else{
      this.setState({paperName:this.props.paperName,subjectName:this.props.subjectName})
    }
     
  }

  updateupdateFlag(){
    this.setState({updateFlag:'1'})
  }
  //?????????????????????????????????--????????????????????????
  addTimu(typeId,typeName,baseTypeId,score){
    if(this.state.typeId==''){
      Toast.showInfoToast('?????????????????????',1000)
    }else if(this.state.questionScore==''){
      Toast.showInfoToast('?????????????????????',1000)
    }else{
          this.setState({modalVisible:false})
          var newdata = this.state.data
          if(this.state.isupdateExistTimuOrder!='new'){
                newdata[(this.state.isupdateExistTimuOrder-1)].typeId=this.state.typeId
                newdata[(this.state.isupdateExistTimuOrder-1)].baseTypeId=this.state.baseTypeId
                newdata[(this.state.isupdateExistTimuOrder-1)].questionName=this.state.questionName
                newdata[(this.state.isupdateExistTimuOrder-1)].questionScore=this.state.questionScore
                this.setState({modalVisible:false,
                  updateFlag:'1',
                  data:newdata,
                  typeId:'',
                  questionName:'',
                  baseTypeId:'',
                  questionScore:'',
                  LookAnswerAndAnalysisStatusItemOrder:this.state.isupdateExistTimuOrder,
                  isupdateExistTimuOrder:'new'
              })
          }else{
              const url = global.constants.baseUrl+"teacherApp_phoneAddQuestion.do";
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
                    answerNum:4,  //????????????????????????4?????????
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
                    updateFlag:'1',
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
  
  //??????????????? ?????? ?????? ?????????????????????
  setanswerNum(index,changeNum){
    //changeNum  +1    -1 ?????????
    var newdata =this.state.data
    newdata[parseInt(index)-1].answerNum += changeNum;
    this.setState({data:newdata})
  }

  //????????????????????????????????????????????????--?????? ?????? ??? ?????? ????????????
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
                      if(item.typeName=='???????????????'){
                        this.setState({typeId:item.typeId,
                          questionName:item.typeName,
                          baseTypeId:item.baseTypeId,
                          questionScore:item.score,
                          EnglishReadTimuNum:'5',
                          EnglishReadTimuScore:'2',
                        })
                      }else if(item.typeName=='???????????????'){
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
                    <View key={index} style={{backgroundColor:'#D3D3D3',borderRadius:5,
                                    width:screenWidth*0.25,alignItems:'center',
                                    height:32,margin:8,borderColor:'red',padding:5,paddingLeft:0,paddingRight:0,
                                    borderWidth:this.state.typeId==item.typeId?1:0
                                    }}>
                            <Text style={{fontSize:15}}>{String(item.typeName).length>5?(String(item.typeName).substring(0,5)+'..'):item.typeName}</Text>
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
    const url = global.constants.baseUrl+"teacherApp_phoneDeleteQuestion.do";
    const params = {
          token:global.constants.token,
          questionId: questionId,                           // ????????????
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
          this.setState({data:newTimudata,updateFlag:'1',})
        }else{
            Toast.showInfoToast('????????????',500)
        }

      })


    
  }

  //????????????????????????????????????????????????
  setLookAnswerAndAnalysisStatusItemOrder(str){
    this.setState({LookAnswerAndAnalysisStatusItemOrder:str})
  }

  //?????????????????????
  getorderCount(){
    return(this.state.data.length)
  }

  //????????????????????????????????????????????????list
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

  //????????????
  getShiTi(data){
    if(data.length>0){
      var List= [];
      data.map((item,index)=>{
        List.push(<PicturesWorkContent key={index}
                                       questionName={item.questionName} 
                                       typeId={item.typeId}
                                       baseTypeId={item.baseTypeId}
                                       subjectName={this.state.subjectName}
                                       EnglishReadTimuNum={this.state.EnglishReadTimuNum}
                                       EnglishReadTimuScore={this.state.EnglishReadTimuScore}
                                       questionScore={item.questionScore} 
                                       questionId={this.state.data[index].questionId}  //???????????????ID
                                       TimuContentList={this.state.data[index].TimuContentList}
                                       AnswerContentList={this.state.data[index].AnswerContentList}
                                       AnalysisContentList={this.state.data[index].AnalysisContentList}
                                       addContentList={this.setContentList}
                                       LookAnswerAndAnalysisStatusItemOrder={this.state.LookAnswerAndAnalysisStatusItemOrder}
                                       setLookAnswerAndAnalysisStatus={this.setLookAnswerAndAnalysisStatusItemOrder}
                                       order={index+1}                                   //????????????
                                       orderCount={data.length}                          //???????????????????????????????????????  data.length
                                       shangyi={this.shangyiTimu}                       //????????????????????????
                                       xiayi={this.xiayiTimu}                           // ????????????????????????
                                       deleteTimu={this.deleteTimu}                     //????????????????????????
                                       showaddTimuSetModal={this.showaddTimuSetModal}   //????????????????????????
                                       updateupdateFlag={this.updateupdateFlag}         //???????????????????????????
                                       setanswerNum={this.setanswerNum}                  //??????101  102  ?????????????????????
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

  //???RN???Text Image ???<p> </p>   <p> <img src='' </p>
  listchangeToStr(list,baseTypeId,subjectName){
    if(baseTypeId=='108'&&subjectName=='??????'){
      var Str =''
      list.map((item)=>{
        Str+=(item)
       })
      return Str
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

  //????????????
  savepaper(Assign){
    var isnull = true;
    this.state.data.map((item,index)=>{
      isnull = isnull&&this.checkTimuAndAnswerisnull(item.TimuContentList,item.AnswerContentList)   //true?????????????????????  false?????????????????????
      //if???????????? ???????????? ?????????????????????
      if(!this.checkTimuAndAnswerisnull(item.TimuContentList,item.AnswerContentList)){
        if(item.TimuContentList.length==0){
          const str= '????????????'+(index+1)+'?????????'
          Alert.alert('',str,[{},{text:'??????',onPress:()=>{}}])
          Toast.showWarningToast(str,1000)
        }else{
          const str= '????????????'+(index+1)+'?????????'
          Alert.alert('',str,[{},{text:'??????',onPress:()=>{}}])
          Toast.showWarningToast(str,1000)
        }
        //else ???????????????  ??????  ??????????????????
      }
    })

    // console.log('??????????????????','paperId???',this.state.paperId,'isnull???',isnull,'Assign:',Assign)
    //??????????????????  ??????????????????
    //true??????????????? && paperid??????           ||     ?????????????????? ??????????????????
    if(isnull&&(this.state.paperId=='-1'||this.state.updateFlag=='1')){
                  // console.log('???????????????',this.state.data)
                      var SubAnswerStr = []
                      this.state.data.map((item,index)=>{
                        SubAnswerStr.push({
                          "questionId":item.questionId,
                          "shitiShow":this.listchangeToStr(item.TimuContentList),
                          "shitiAnswer":this.listchangeToStr(item.AnswerContentList,item.baseTypeId,item.subjectName),
                          "shitiAnalysis":(item.AnalysisContentList.length==0)?'???':this.listchangeToStr(item.AnalysisContentList),
                          "baseTypeId":item.baseTypeId,
                          "typeId" :item.typeId,
                          "typeName" :item.questionName,
                          "score" :item.questionScore,
                          "order" :index+1,
                          "answerNum":item.baseTypeId=='101'?item.answerNum:item.baseTypeId=='102'?item.answerNum:"-1",    //101   102 ???????????????       ??????-1
                          "smallQueNum":item.baseTypeId=='108'?item.AnswerContentList.length:"-1"                    // 108   ??????  ???????????????   ??????-1
                        })})
                        var newjsonstr=''
                        SubAnswerStr.map(item=>{
                          newjsonstr+=','+JSON.stringify(item)
                        })
                        newjsonstr =newjsonstr.substring(1)
                        // console.log('???????????????????????????:',newjsonstr)
                        console.log('????????????????????????',newjsonstr)
                      //2.?????????????????????????????????loadding????????????????????????????????????...???
                        const url = global.constants.baseUrl+"teacherApp_phoneSaveQuestionAndPaper.do";
                        const params = {
                              token:     global.constants.token,
                              userName: global.constants.userName,                  // ????????????
                              paperName:this.state.paperName,
                              paperId:this.state.paperId,
                              jsonStr:'['+newjsonstr+']',                                      //?????????????????????
                              channelCode:this.props.channelCode,              //??????id
                              subjectCode:this.props.subjectCode,              //??????id
                              textBookCode:this.props.textBookCode,            //??????id
                              gradeLevelCode:this.props.gradeLevelCode,        //??????id
                              pointCode:this.props.pointCode,                  //?????????id
                              channelName:this.props.channelName,              //??????Name
                              subjectName:this.props.subjectName,              //??????Name
                              textBookName:this.props.textBookName,            //??????Name
                              gradeLevelName:this.props.gradeLevelName,        //??????Name
                              pointName:this.props.pointName,                  //?????????Name
                            };
                          WaitLoading.show('?????????...',-1)
                          http.get(url, params).then((resStr) => {
                            let resJson = JSON.parse(resStr);
                            // console.log('???????????????',resJson)
                            //????????????????????????????????????message
                            if(resJson.success){
                              // console.log('???????????????id',resJson)
                              this.setState({paperId:resJson.data,updateFlag:'0',})
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
                                WaitLoading.show_success('???????????????',1000)
                              }
                            }else{
                              WaitLoading.show_false()
                              console.log('???????????????')
                              Toast.showDangerToast('???????????????',1000)
                            }
                          })
    }else if(!Assign&&this.state.paperId!='-1'&&this.state.updateFlag=='0'){//???????????????????????????
        Toast.showSuccessToast('?????????????????????',2000)
    }

    if(isnull&&Assign){
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
                          <Text style={{fontSize:20}}>???????????????</Text>
                        </View>
                        
                          <View style={{flexDirection:'row',marginBottom:40,width:'100%',flexWrap:'wrap',paddingLeft:10,paddingRight:10}}>
                              {TiMuTypeList.length>0?this.showTimuTypeSelect(TiMuTypeList)
                                                    :this.showTimuTypeSelect(this.state.qusetionTypeList)}
                          </View>
                        
                                
                        {/* ??????????????????????????? */}
                        {this.state.typeId!=''&&this.state.baseTypeId!='108'?(
                          <View style={{width:'60%',borderBottomWidth:1,paddingLeft:20,flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                              <Text style={{marginRight:30}}>??????</Text>
                              <TextInput placeholder='???????????????' 
                                        value={this.state.questionScore}
                                        onChangeText={(text)=>{
                                          this.setState({questionScore:text.replace(/[^\d]+/, '')})
                                          }}
                              ></TextInput>
                          </View>
                        ):this.state.typeId!=''&&this.props.subjectName=='??????'&&this.state.baseTypeId=='108'&&this.state.questionName!='?????????'?(
                          <>
                          <View style={{width:'70%',borderBottomWidth:1,paddingLeft:20,flexDirection:'row',alignItems:'center'}}>
                              <Text style={{marginRight:30}}>???????????????????????????</Text>
                              <TextInput placeholder='?????????????????????' 
                                        value={this.state.EnglishReadTimuScore}
                                        onChangeText={(text)=>{
                                          this.setState({EnglishReadTimuScore:parseInt(text.replace(/[^\d]+/, '')),questionScore:parseInt(text.replace(/[^\d]+/, ''))*this.state.EnglishReadTimuNum})
                                          }}
                              ></TextInput>
                          </View>
                          <View style={{width:'70%',borderBottomWidth:1,paddingLeft:20,flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                              <Text style={{marginRight:100}}>????????????</Text>
                              <TextInput placeholder='?????????????????????' 
                                        value={this.state.EnglishReadTimuNum}
                                        onChangeText={(text)=>{
                                          this.setState({EnglishReadTimuNum:text.replace(/[^\d]+/, '')})
                                          }}
                              ></TextInput>
                          </View>
                          </>
                          
                        ):this.state.typeId!=''&&this.state.baseTypeId=='108'?(
                          <View style={{width:'60%',borderBottomWidth:1,paddingLeft:20,flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                              <Text style={{marginRight:30}}>??????</Text>
                              <TextInput placeholder='???????????????' 
                                        value={this.state.questionScore}
                                        onChangeText={(text)=>{
                                          this.setState({questionScore:text.replace(/[^\d]+/, '')})
                                          }}
                              ></TextInput>
                          </View>
                        ):(<View></View>)}
                        

                        <View style={{flexDirection:'row',width:'30%',justifyContent:'space-between',marginBottom:20}}>
                            <TouchableOpacity onPress={()=>{
                              this.setState({ modalVisible:false,
                                              typeId:'',
                                              baseTypeId:'',
                                              questionName:'',
                                              questionScore:'',
                                              isupdateExistTimuOrder:'new'})
                            }}><Text style={{color:'#59B9E0'}}>??????</Text></TouchableOpacity>

                            <TouchableOpacity onPress={()=>{

                              // ????????????????????????????????????
                              
                                if(this.state.questionName=='?????????'){
                                  if(parseInt(this.state.questionScore)%5==0&&parseInt(this.state.questionScore)>0){
                                    TiMuTypeList.map((item,index)=>{
                                      if(item.typeId==this.state.typeId){
                                        item.score=this.state.questionScore
                                      }
                                    })
                                    this.addTimu(
                                      this.state.typeId,
                                      this.state.questionName,
                                      this.state.baseTypeId,
                                      this.state.questionScore)
                                  }else{
                                    Alert.alert('','???????????????5?????????!',[{},{text:'??????',onPress:()=>{}}])
                                  }
                                }else{
                                  TiMuTypeList.map((item,index)=>{
                                    if(item.typeId==this.state.typeId){
                                      item.score=this.state.questionScore
                                    }
                                  })
                                  this.addTimu(
                                    this.state.typeId,
                                    this.state.questionName,
                                    this.state.baseTypeId,
                                    this.state.questionScore)
                                }
                              

                              
                            }}>
                              <Text style={{color:'#59B9E0'}}>??????</Text></TouchableOpacity>
                        </View>
                    </View>
                  </View>
                  
                
                </Modal>
        
        <View style={{backgroundColor:'#FFFFFF',opacity:this.state.modalVisible?0.2:1,}}>
          <View style={{height:50,flexDirection:'row',justifyContent:'space-between',zIndex:0,
          alignItems:'center',paddingRight:10,paddingLeft:8,borderBottomWidth:0.8}}>
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
                <Image style={{height:28,width:100}}  source={require('../../../assets/TakePicturesAndAssignWork/addtitle.png')}></Image>  
            </TouchableOpacity>
          </View>



          <ScrollView style={{height:'87%',}}
              ref={ref => this._scrollView_paper = ref}
              >
                <Waiting/>
            {/* ???????????? ???????????? */}
            {this.getShiTi(data)}

          </ScrollView>

          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <Button onPress={()=>{
                    if(this.state.data.length==0){
                      Alert.alert('','?????????????????????',[{},{text:'??????',onPress:()=>{}}])
                      Toast.showWarningToast('?????????????????????',1000)
                    }else{
                      this.savepaper(false)
                    }
                  }
                } style={{width:'40%',backgroundColor:'#1E90FF'}}>??????</Button>
              <Button onPress={()=>{
                if(this.state.data.length==0){
                  Alert.alert('','?????????????????????',[{},{text:'??????',onPress:()=>{}}])
                  Toast.showWarningToast('?????????????????????',1000)
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
                  style={{width:'40%',backgroundColor:'#1E90FF'}}>??????</Button>
          </View>
      </View>
      </>
      
    )
  }
}



