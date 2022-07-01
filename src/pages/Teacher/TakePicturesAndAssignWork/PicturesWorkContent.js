import { Text, View,Image, TextInput, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { Radio, RadioGroup,Button,CheckBox} from '@ui-kitten/components';
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImageHandler from "../../../utils/Camera/Camera";
import http from "../../../utils/http/request";
import Toast from '../../../utils/Toast/Toast';
import RenderHTML from 'react-native-render-html';
import screenWidth from '../../../utils/Screen/GetSize'
import Read from './AnswerUtils/Read'
import{WaitLoading,Waiting}from '../../../utils/WaitLoading/WaitLoading'
export default class PicturesWorkContent extends Component {
    constructor(props){
      super(props)
      this.setReadAnswer=this.setReadAnswer.bind(this)
      this.state={
          data:'',
          success:false,
          typeId:'',
          baseTypeId:'',
          subjectName:'',                      //用于记录是不是英语  
          questionName:'',                     //记录试题题目名称
          questionId:'',
          order:'',                            //记录试题序号
          orderCount:'',
          questionScore:'',                    //记录题目分值
          TimuContentList:'',                  //记录题目编辑的内容
          TimuContentStatus:false,             //记录题目编辑的内容的状态用于选择展示三个图片的位置
          TimuContentTextInput:'',             //记录题目的TextInput输入的内容
          TimuContentTextInputStatus:false,
          
          LookAnswerAndAnalysisStatus:false,    //记录查看答案和解析状态


          AnswerContentList:'',                //记录答案编辑的内容
          AnswerContentStatus:false,           //记录答案编辑的内容的状态用于选择展示三个图片的位置
          AnswerContentTextInput:'',           //记录答案的TextInput输入的内容
          AnswerContentTextInputStatus:false,

          AnalysisContentList:'',              //记录解析编辑的内容
          AnalysisContentStatus:false,         //记录解析编辑的内容的状态用于选择展示三个图片的位置
          AnalysisContentTextInput:'',        //记录解析的TextInput输入的内容
          AnalysisContentTextInputStatus:false,


          SingleList:['A','B','C','D'],                    //单选列表
          SingleSelectedIndex:-1,                          //单选答案选中 的index
          multipleList:['A','B','C','D'],                 //多选列表
          multipleSelectedIndex:[false,false,false,false,false,false,false],   //多选选中答案
          judgementList:['正确','错误'],                   //判断选项列表
          judgementSelectedIndex:-1,                        //判断选中的index

          ReadSelectList:['A','B','C','D'],                //阅读题题选项列表    
          ReadTimuNumber:5,                                //阅读题小题个数      
          ReadSelectedList:['*','*','*','*','*'],              //阅读题小题答案设置 

          WanxingSelectList:['A','B','C','D'],                //          完形填空也用这个
          WanxingTimuNumber:10,                                //         完形填空也用这个
          WanxingSelectedList:['*','*','*','*','*','*','*','*','*','*'],  //完形填空也用这个

          Read7_5_SelectList:['A','B','C','D','E','F','G'],      //七选五选项列表
          Read7_5_TimuNumber:5,                              //七选五小题个数   默认五个
          Read7_5_SelectedList:['*','*','*','*','*'],                  //七选五小题答案设置
      } 
    }

    setReadAnswer(type,list){
      this.props.addContentList(this.state.order,'Answer',list)
      if(type=='read'&&this.questionName=='阅读理解题'){
        this.setState({ReadSelectedList:list})
      }else if(type=='read'&&this.questionName=='完形填空题'){
        this.setState({WanxingSelectedList:list})
      }
      else{
        this.setState({Read7_5_SelectedList:list})
      }

    }

    UNSAFE_componentWillMount(){
      var newLookAnswerAndAnalysisStatus = false
      if(this.props.LookAnswerAndAnalysisStatusItemOrder!=this.props.order){
        newLookAnswerAndAnalysisStatus=true
      }
      const count = this.props.orderCount
      // console.log('答案',this.props.AnswerContentList,'题目',this.props.TimuContentList)
      //如果有题目 和 答案，说明是要回显 
      if(this.props.AnswerContentList!=''&&this.props.TimuContentList!=''){
        var newSingleSelectedIndex = -1
        var newmultipleSelectedIndex =[false,false,false,false,false,false,false]
        var newjudgementSelectedIndex = -1
        var newReadSelectedList=['*','*','*','*','*']
        var newReadTimuNumber = 5
        var newWanxingSelectedList=['*','*','*','*','*','*','*','*','*','*']
        var newWanxingTimuNumber=10
        var newRead7_5_SelectedList=['*','*','*','*','*']
        var newRead7_5_TimuNumber=5
        if(this.props.baseTypeId=='101'){
          if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='A'){
            newSingleSelectedIndex=0
          }else if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='B'){
            newSingleSelectedIndex=1
          }else if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='C'){
            newSingleSelectedIndex=2
          }else if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='D'){
            newSingleSelectedIndex=3
          }else if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='E'){
            newSingleSelectedIndex=4
          }else if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='F'){
            newSingleSelectedIndex=5
          }else if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='G'){
            newSingleSelectedIndex=6
          }else{
            newSingleSelectedIndex = -1
          }
          // console.log('-----101',this.props.AnswerContentList[0].replace('<p>','').replace('</p>',''),'newSingleSelectedIndex',newSingleSelectedIndex)
        }else if(this.props.baseTypeId=='102'){
          this.props.AnswerContentList[0].replace('<p>','').replace('</p>','').split('').map((item,index)=>{
            if(item=='A'){
              newmultipleSelectedIndex[index]=true
            }else if(item=='B'){
              newmultipleSelectedIndex[index]=true
            }else if(item=='C'){
              newmultipleSelectedIndex[index]=true
            }else if(item=='D'){
              newmultipleSelectedIndex[index]=true
            }else if(item=='E'){
              newmultipleSelectedIndex[index]=true
            }else if(item=='F'){
              newmultipleSelectedIndex[index]=true
            }else if(item=='G'){
              newmultipleSelectedIndex[index]=true
            }
          })
          // console.log('----102',newmultipleSelectedIndex)
        }else if(this.props.baseTypeId=='103'){
          if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='对'){
            newjudgementSelectedIndex=0
          }else if(this.props.AnswerContentList[0].replace('<p>','').replace('</p>','')=='错'){
            newjudgementSelectedIndex=1
          }else{
            newjudgementSelectedIndex=-1
          }
          // console.log('----103',newjudgementSelectedIndex)
        }else if(this.props.baseTypeId=='108'){
          if(this.props.questionName=='七选五'){
            newRead7_5_TimuNumber=this.props.AnswerContentList[0].replace('<p>','').replace('</p>','').split(',').length
            this.props.AnswerContentList[0].replace('<p>','').replace('</p>','').split(',').map((item,index)=>{
              newRead7_5_SelectedList[index]=item
            })
          }else if(this.props.questionName=='完形填空题'){
            newWanxingTimuNumber=this.props.AnswerContentList[0].replace('<p>','').replace('</p>','').split(',').length
            this.props.AnswerContentList[0].replace('<p>','').replace('</p>','').split(',').map((item,index)=>{
              newWanxingSelectedList[index]=item
            })
          }else{
            newReadTimuNumber=this.props.AnswerContentList[0].replace('<p>','').replace('</p>','').split(',').length
            this.props.AnswerContentList[0].replace('<p>','').replace('</p>','').split(',').map((item,index)=>{
              newReadSelectedList[index]=item
            })
          }
        }
        this.setState({
          LookAnswerAndAnalysisStatus:newLookAnswerAndAnalysisStatus,
          orderCount:count,
          questionId:this.props.questionId,
          order:this.props.order,
          typeId:this.props.typeId,
          baseTypeId:this.props.baseTypeId,
          questionName:this.props.questionName,
          questionScore:this.props.questionScore,
          TimuContentList:this.props.TimuContentList,
          AnswerContentList:this.props.AnswerContentList,
          AnalysisContentList:this.props.AnalysisContentList,
          judgementSelectedIndex:newjudgementSelectedIndex,
          SingleSelectedIndex:newSingleSelectedIndex,
          multipleSelectedIndex:newmultipleSelectedIndex,
          ReadSelectedList:newReadSelectedList,
          ReadTimuNumber :newReadTimuNumber,
          WanxingSelectedList:newWanxingSelectedList,
          WanxingTimuNumber:newWanxingTimuNumber,
          Read7_5_SelectedList:newRead7_5_SelectedList,
          Read7_5_TimuNumber:newRead7_5_TimuNumber
          })
      }
      //没题目和答案 就是  初始化
      else{this.setState({
        LookAnswerAndAnalysisStatus:newLookAnswerAndAnalysisStatus,
        orderCount:count,
        questionId:this.props.questionId,
        order:this.props.order,
        typeId:this.props.typeId,
        baseTypeId:this.props.baseTypeId,
        questionName:this.props.questionName,
        questionScore:this.props.questionScore,
        TimuContentList:this.props.TimuContentList,
        AnswerContentList:this.props.AnswerContentList,
        AnalysisContentList:this.props.AnalysisContentList,
        })
        if((this.props.questionName=='阅读理解题'||this.props.questionName=='阅读题(选择形式)')){
          var list=[]
          for(let i=0;i<this.props.EnglishReadTimuNum;i++){
            list.push('*')
          }
          this.setState({ReadTimuNumber:this.props.EnglishReadTimuNum,ReadSelectedList:list})
        }else if(this.props.questionName=='七选五'){
          var list=[]
          for(let i=0;i<this.props.EnglishReadTimuNum;i++){
            list.push('*')
          }
          this.setState({Read7_5_TimuNumber:this.props.EnglishReadTimuNum,Read7_5_SelectedList:list})
        }
        else if(this.props.questionName=='完形填空题'){
          var list=[]
          for(let i=0;i<this.props.EnglishReadTimuNum;i++){
            list.push('*')
          }
          this.setState({WanxingTimuNumber:this.props.EnglishReadTimuNum,WanxingSelectedList:list})
        }


      }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
      var newLookAnswerAndAnalysisStatus = false
      if(nextProps.LookAnswerAndAnalysisStatusItemOrder!=nextProps.order){
        newLookAnswerAndAnalysisStatus=true
      }
      this.setState({
        order:nextProps.order,
        questionId:nextProps.questionId,
        typeId:nextProps.typeId,
        baseTypeId:nextProps.baseTypeId,
        questionName:nextProps.questionName,
        questionScore:nextProps.questionScore,
        orderCount:nextProps.orderCount,
        LookAnswerAndAnalysisStatus:newLookAnswerAndAnalysisStatus,
        TimuContentList:nextProps.TimuContentList,
        AnswerContentList:nextProps.AnswerContentList,
        AnalysisContentList:nextProps.AnalysisContentList,
      })
    }
    
    //拍照调用的函数
    handleCamera(type){
      ImageHandler.handleCamera().then((res) => {
          if (res!=null) {
                  WaitLoading.show('提交中...',-1)
                  const url = global.constants.baseUrl+"teacherApp_saveBase64Image.do";
                  const params = {
                      baseCode: res.base64,
                      questionId: this.state.questionId,
                      type:type,
                      userName: global.constants.userName}; 
                         
                  http.post(url,params,false).then((resStr)=>{
                      let resJson = resStr;
                      if(resJson.success){
                          WaitLoading.dismiss()
                          if(type=='Show'){
                            var newTimuContentList= this.state.TimuContentList
                            newTimuContentList.push('<p><img style=\"max-width:100%\" src="'+resJson.data+'"></p>')
                            this.props.addContentList(this.state.order,'Show',newTimuContentList)
                            this._scrollView_Timu.scrollToEnd()
                          }else if(type=='Answer'){
                            var newAnswerContentList= this.state.AnswerContentList
                            newAnswerContentList.push('<p><img style=\"max-width:100%\" src="'+resJson.data+'"></p>')
                            this.props.addContentList(this.state.order,'Answer',newAnswerContentList)
                            this._scrollView_Answer.scrollToEnd()
                          }else if(type=='Analysis'){
                            var newAnalysisContentList= this.state.AnalysisContentList
                            newAnalysisContentList.push('<p><img style=\"max-width:100%\" src="'+resJson.data+'"></p>')
                            this.props.addContentList(this.state.order,'Analysis',newAnalysisContentList)
                            this._scrollView_Analysis.scrollToEnd()
                          }
                      }else{
                        Toast.showWarningToast('照片提交失败！重新添加！',1000)
                      }
                  })
          }
      });
  };


  //从本地选择照片需要的函数
    handleLibrary(type){
        ImageHandler.handleLibrary().then((res) => {
            if (res!=null) {
              WaitLoading.show('提交中...',-1)
              const url = global.constants.baseUrl+"teacherApp_saveBase64Image.do";
              const params = {
                  baseCode: res.base64,
                  questionId: this.state.questionId,
                  type:type,
                  userName: global.constants.userName};   
                http.post(url,params,false).then((resStr)=>{
                    let resJson = resStr;
                    if(resJson.success){
                      WaitLoading.dismiss()
                        if(type=='Show'){
                          var newTimuContentList= this.state.TimuContentList
                          newTimuContentList.push('<p><img style=\"max-width:100%\" src="'+resJson.data+'"></p>')
                          this.props.addContentList(this.state.order,'Show',newTimuContentList)
                          this._scrollView_Timu.scrollToEnd()
                        }else if(type=='Answer'){
                          var newAnswerContentList= this.state.AnswerContentList
                          newAnswerContentList.push('<p><img style=\"max-width:100%\" src="'+resJson.data+'"></p>')

                          this.props.addContentList(this.state.order,'Answer',newAnswerContentList)
                          this._scrollView_Answer.scrollToEnd()
                        }else if(type=='Analysis'){
                          var newAnalysisContentList= this.state.AnalysisContentList
                          newAnalysisContentList.push('<p><img style=\"max-width:100%\" src="'+resJson.data+'"></p>')
                          this.props.addContentList(this.state.order,'Analysis',newAnalysisContentList)
                          this._scrollView_Analysis.scrollToEnd()
                        }
                    }else{
                      Toast.showWarningToast('照片提交失败！重新添加！',1000)
                    }
                })
            }
        });
    };

    // 根据List加载文本或者图片
    getContent(list){
      var HTML = ''
      //把传递过来的内容list拼接成HTML格式
      list.map(item=>HTML+=item)

      //使用RenderHTML组件展示内容
      return(
        <View style={{paddingLeft:15}}>
            <RenderHTML contentWidth={screenWidth} source={{html:HTML}}/>
        </View>
      ) ;
    }

    //通过编辑页面传递过来的函数
    addTextContent(order,type){
      var newList = this.state.TimuContentList
      if(this.state.TimuContentTextInput==''){
          if(newList.length<1){
            this.setState({
              TimuContentStatus:false,
              TimuContentTextInputStatus:false
            })
          }else{
            this.setState({TimuContentTextInputStatus:false})
          }
        }else{
          newList.push('<p>'+this.state.TimuContentTextInput+'</p>')
            this.props.addContentList(order,'Show',newList)
            this.setState({
              TimuContentTextInput:'',
              TimuContentTextInputStatus:false
            })
        }
      this._scrollView_Timu.scrollToEnd()
    }

    loadingTiMu(){
      return( 
        <View style={{justifyContent:'center'}}>  
                    <View style={{flexDirection:'row',padding:20,paddingBottom:0,paddingTop:10,justifyContent:'space-between',alignItems:'center'}}> 
                      <View style={{height:30,justifyContent:'center',alignItems:'center',paddingBottom:5}}>
                        <Text style={{fontSize:20}}>题目</Text>
                      </View>
                      {(this.state.TimuContentStatus||(this.state.TimuContentList.length>0)?(
                      <View style={{flexDirection:'row',position:'absolute',width:'35%',justifyContent:'space-between',right:20,alignItems:'center'}}> 
                          <TouchableOpacity onPress={()=>{
                            this.props.setLookAnswerAndAnalysisStatus(this.state.order)
                            this.handleLibrary('Show')
                            this.setState({TimuContentStatus:true})
                          }}>
                              <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/xiangcesuo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.props.setLookAnswerAndAnalysisStatus(this.state.order)
                            this.handleCamera('Show')
                            this.setState({TimuContentStatus:true})
                        }}>
                              <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/paizhaosuo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                          this.props.setLookAnswerAndAnalysisStatus(this.state.order)
                          this.setState({TimuContentTextInputStatus:true}) 
                          this._scrollView_Timu.scrollToEnd()
                           }}>
                              <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/lurusuo.png')}></Image>
                        </TouchableOpacity>
                      </View>
                      ):(<View></View>))}
                    </View>

                    {/* 要根据试题的类型来动态显示加载什么样的题目编辑区域 */}
                    <View style={{borderWidth:0.8,borderColor:'#000000',height:150,margin:20,marginTop:10,marginBottom:0}}> 
                    <ScrollView style={{paddingTop:10}} 
                                ref={ref => this._scrollView_Timu = ref}
                                nestedScrollEnabled={true}>
                    {((!this.state.TimuContentStatus)&&(!this.state.TimuContentList.length>0))?(
                          <View style={{flexDirection:'row',alignItems:'center',height:130,justifyContent:'space-around',paddingLeft:40,paddingRight:40}}>
                                <TouchableOpacity onPress={()=>{
                                                  this.handleLibrary('Show')
                                                  this.props.setLookAnswerAndAnalysisStatus(this.state.order)
                                                  this.setState({TimuContentStatus:true})}}
                                >
                                    <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/xiangcetu.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={()=>{
                                                  this.handleCamera('Show')
                                                  this.props.setLookAnswerAndAnalysisStatus(this.state.order)
                                                  this.setState({TimuContentStatus:true})
                                                }}
                                  >
                                    <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/paizhaotu.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                                  this.props.setLookAnswerAndAnalysisStatus(this.state.order)
                                                  this.setState({TimuContentTextInputStatus:true,
                                                    TimuContentStatus:true})
                                                }} 
                                >
                                    <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/luru.png')}></Image>
                                </TouchableOpacity>
                          </View>):(this.getContent(this.state.TimuContentList))}

                          {this.state.TimuContentTextInputStatus?(<TextInput
                                style={{borderWidth:1,margin:10,height:40,width:250}}
                                onLayout={event=>{this.layout_Timu = event.nativeEvent.layout}}
                                onChangeText={(text)=>{this.setState({TimuContentTextInput:text})}}
                                value={this.state.TimuContentTextInput}
                                onBlur={()=>{
                                 this.addTextContent(this.state.order,'Show')
                                }}
                            >
                            </TextInput>):(<View></View>)

                              }
                    </ScrollView>
                    </View>
        </View>)
    }

    setmultiple = (index,nextChecked) => {
      var statuslist =this.state.multipleSelectedIndex
      statuslist[index]= nextChecked
      this.setState({multipleSelectedIndex:statuslist})
    }

    loadingAnswer(baseTypeId){
      let setmultiple = (index,nextChecked) => {
        var statuslist =this.state.multipleSelectedIndex
        statuslist[index]= nextChecked
        var newAnswer=''
        statuslist.map((item,index)=>{
          if(index==0&&item){
            newAnswer+='A'
          }else if(index==1&&item){
            newAnswer+='B'
          }else if(index==2&&item){
            newAnswer+='C'
          }else if(index==3&&item){
            newAnswer+='D'
          }else if(index==4&&item){
            newAnswer+='E'
          }else if(index==5&&item){
            newAnswer+='F'
          }else if(index==5&&item){
            newAnswer+='G'
          }
        })
        var newAnswerContentList=[]
        newAnswerContentList.push(newAnswer)
        this.props.addContentList(this.state.order,'Answer',newAnswerContentList)
        this.setState({multipleSelectedIndex:statuslist})
      }

      let status =this.state.multipleSelectedIndex
      if(baseTypeId=='101'){
        return(
          <>
          <View style={{padding:20,paddingBottom:0,paddingTop:10}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontSize:20}}>答案</Text>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Button onPress={()=>{
                    if(this.state.SingleList.length>2){
                      var list = this.state.SingleList
                      list.slice(0,-1)
                      this.props.updateupdateFlag
                      this.props.setanswerNum(this.state.order,-1)
                      this.setState({SingleList:list.slice(0,-1)})
                    }else{
                      Toast.showInfoToast('至少有2个选项',1000)
                    }
                  }} appearance='ghost' style={{borderRadius:10,borderWidth:1}}>—</Button>
                  <Text>{this.state.SingleList.length}</Text>
                  <Button onPress={()=>{
                    if(this.state.SingleList.length<7){
                      var list = this.state.SingleList
                      list.push(this.state.SingleList.length==2?'C':this.state.SingleList.length==3?'D':this.state.SingleList.length==4?'E':this.state.SingleList.length==5?'F':'G')
                      this.props.updateupdateFlag
                      this.props.setanswerNum(this.state.order,1)
                      this.setState({SingleList:list})
                    }else{
                      Toast.showSuccessToast('至多有7个选项',1000)
                    }
                  }}  appearance='ghost' style={{borderRadius:10,borderWidth:1}}>+</Button>
                </View>
              </View>
              <View style={{margin:10}}>
                    <React.Fragment>
                        <RadioGroup style={{flexWrap:'wrap',flexDirection:'row',}}
                            selectedIndex={this.state.SingleSelectedIndex}
                            onChange={index => 
                              {
                                var newAnswerContentList=[]
                                newAnswerContentList.push(index==0?'A':index==1?'B':index==2?'C':index==3?'D':index==4?'E':index==5?'F':index==6?'G':'')
                                this.props.addContentList(this.state.order,'Answer',newAnswerContentList)
                                this.setState({SingleSelectedIndex:index})
                              }
                            }
                            >
                            {this.state.SingleList.map(function(item,index){
                                    return(<Radio key={index}>{item}</Radio>)
                                })
                            }  
                        </RadioGroup>      
                    </React.Fragment>   
                    </View>
              </View>
          </>)
      }else if(baseTypeId=='102'){
        return(
          <>
          <View style={{padding:20,paddingBottom:0,paddingTop:10}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontSize:20}}>答案</Text>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Button onPress={()=>{
                    if(this.state.multipleList.length>2){
                      var list = this.state.multipleList
                      list.slice(0,-1)
                      this.props.updateupdateFlag
                      this.props.setanswerNum(this.state.order,-1)
                      this.setState({multipleList:list.slice(0,-1)})
                    }else{
                      Toast.showInfoToast('至少有2个选项',1000)
                    }
                  }} appearance='ghost' style={{borderRadius:10,borderWidth:1}}>—</Button>
                  <Text>{this.state.multipleList.length}</Text>
                  <Button onPress={()=>{
                    if(this.state.multipleList.length<7){
                      var list = this.state.multipleList
                      list.push(this.state.multipleList.length==2?'C':this.state.multipleList.length==3?'D':this.state.multipleList.length==4?'E':this.state.multipleList.length==5?'F':'G')
                      this.props.updateupdateFlag
                      this.props.setanswerNum(this.state.order,1)
                      this.setState({multipleList:list})
                    }else{
                      Toast.showSuccessToast('至多有7个选项',1000)
                    }
                  }} appearance='ghost' style={{borderRadius:10,borderWidth:1}}>+</Button>
                </View>
              </View>
              <View style={{margin:10,flexDirection:'row'}}>
                            {this.state.multipleList.map(function(item,index){
                                return(<CheckBox key={index} 
                                  checked={status[index]} 
                                  onChange={nextChecked =>{
                                    
                                    setmultiple(index,nextChecked)
                                  }}
                                  >
                                    {item}
                                  </CheckBox>)
                                })
                            }
                    
                    </View>
              </View>
          </>)
      }else if(baseTypeId=='103'){
        return(
          <>
          <View style={{padding:20,paddingBottom:0,paddingTop:10}}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{fontSize:20,marginTop:10}}>答案</Text>
              </View>
              <View style={{margin:10}}>
                    <React.Fragment>
                        <RadioGroup style={{flexWrap:'wrap',flexDirection:'row',}}
                             selectedIndex={this.state.judgementSelectedIndex}
                             onChange={index =>
                              {
                                var newAnswerContentList=[]
                                newAnswerContentList.push(index==0?'对':index==1?'错':'')
                                this.props.addContentList(this.state.order,'Answer',newAnswerContentList)
                                this.setState({judgementSelectedIndex:index})}
                              }
                            >
                            {this.state.judgementList.map(function(item,index){
                                    return(<Radio key={index}>{item}</Radio>)
                                })
                            }  
                        </RadioGroup>      
                    </React.Fragment>   
                    </View>
              </View>
          </>)
      }else if(baseTypeId=='108'){
        if(this.state.questionName=='阅读理解题'||this.state.questionName=='阅读题(选择形式)'){
          return(
            <>
            <View style={{padding:10,paddingBottom:0,paddingTop:10}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={{fontSize:20,marginLeft:10}}>答案</Text>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Button onPress={()=>{
                      if(this.state.ReadTimuNumber>1){
                        var list = this.state.ReadSelectedList
                        list.pop()
                        this.props.updateupdateFlag
                        this.setState({ReadSelectedList:list,ReadTimuNumber:(parseInt(this.state.ReadTimuNumber)-1)})
                      }else{
                        Toast.showInfoToast('至少有1个小题',1000)
                      }
                    }} appearance='ghost' style={{borderRadius:10,borderWidth:1}}>—</Button>
                    <Text>{this.state.ReadTimuNumber}</Text>
                    <Button onPress={()=>{
                        var list = this.state.ReadSelectedList
                        list.push('*')
                        this.props.updateupdateFlag
                        this.setState({ReadSelectedList:list,ReadTimuNumber:parseInt(this.state.ReadTimuNumber)+1})
                    }}  appearance='ghost' style={{borderRadius:10,borderWidth:1}}>+</Button>
                  </View>
                </View>
                <View style={{margin:10,marginTop:0,marginLeft:30}}>
                  <Read setReadAnswer={this.setReadAnswer} SelectedList={this.state.ReadSelectList} Answer={this.state.ReadSelectedList}></Read>
                </View>
                </View>
            </>
          )
        }else if(this.state.questionName=='完形填空题'){
          return(
            <>
            <View style={{padding:10,paddingBottom:0,paddingTop:10}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={{fontSize:20,marginLeft:10}}>答案</Text>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Button onPress={()=>{
                      if(this.state.WanxingTimuNumber>1){
                        var list = this.state.WanxingSelectedList
                        list.pop()
                        this.props.updateupdateFlag
                        this.setState({WanxingSelectedList:list,WanxingTimuNumber:parseInt(this.state.WanxingTimuNumber)-1})
                      }else{
                        Toast.showInfoToast('至少有1个小题',1000)
                      }
                    }} appearance='ghost' style={{borderRadius:10,borderWidth:1}}>—</Button>
                    <Text>{this.state.WanxingTimuNumber}</Text>
                    <Button onPress={()=>{
                        var list = this.state.WanxingSelectedList
                        list.push('*')
                        this.props.updateupdateFlag
                        this.setState({WanxingSelectedList:list,WanxingTimuNumber:parseInt(this.state.WanxingTimuNumber)+1})
                    }}  appearance='ghost' style={{borderRadius:10,borderWidth:1}}>+</Button>
                  </View>
                </View>
                <View style={{margin:10,marginLeft:30}}>
                  <Read setReadAnswer={this.setReadAnswer} SelectedList={this.state.WanxingSelectList} Answer={this.state.WanxingSelectedList}></Read>
                </View>
                </View>
            </>
          )
        }else if(this.state.questionName=='七选五'){
          return(
          <>
          <View style={{padding:10,paddingBottom:0,paddingTop:10}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                <Text style={{fontSize:20,marginLeft:10}}>答案</Text>
              </View>
              <View style={{margin:10,marginTop:0,marginLeft:20}}>
                  <Read setReadAnswer={this.setReadAnswer} SelectedList={this.state.Read7_5_SelectList} Answer={this.state.Read7_5_SelectedList}></Read>  
              </View>
              </View>
          </>
          )
        }else{
          return(<View></View>)
        }
      }else{
        // 一律主观题格式
        return(
          <>
                      <View style={{flexDirection:'row',padding:20,paddingBottom:0,paddingTop:10,justifyContent:'space-between',alignItems:'center'}}> 
                        <View style={{height:30,alignItems:'center',justifyContent:'center',paddingBottom:5}}>
                            <Text style={{fontSize:20}}>答案</Text>
                        </View>
                        
                        {(this.state.AnswerContentStatus||(this.state.AnswerContentList.length>0)?(
                        <View style={{flexDirection:'row',position:'absolute',width:'35%',justifyContent:'space-between',right:20,alignItems:'center'}}> 
                            <TouchableOpacity onPress={()=>{
                              this.handleLibrary('Answer')
                            }}>
                                <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/xiangcesuo.png')}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{
                              this.handleCamera('Answer')
                          }}>
                                <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/paizhaosuo.png')}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{
                            this.setState({AnswerContentTextInputStatus:true}) 
                            this._scrollView_Answer.scrollToEnd()
                             }}>
                                <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/lurusuo.png')}></Image>
                          </TouchableOpacity>
                        </View>
                        ):(<View></View>))}
                      </View>

                      {/* 要根据试题的类型来动态显示加载什么样的答案编辑区域 */}
                      <View style={{borderWidth:0.8,borderColor:'#000000',height:150,margin:20,marginTop:10,marginBottom:0}}> 
                      <ScrollView style={{paddingTop:10}} 
                                  ref={ref => this._scrollView_Answer = ref}
                                  nestedScrollEnabled={true}>

                      {/* 方框中的三张图片是否显示出来 */}
                      {((!this.state.AnswerContentStatus)&&(!this.state.AnswerContentList.length>0))?(
                            <View style={{flexDirection:'row',alignItems:'center',height:130,justifyContent:'space-around',paddingLeft:40,paddingRight:40}}>
                                  <TouchableOpacity onPress={()=>{
                                                    this.handleLibrary('Answer')
                                                    this.setState({AnswerContentStatus:true})
                                                  }}
                                  >
                                      <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/xiangcetu.png')}></Image>
                                  </TouchableOpacity>
                                  <TouchableOpacity  onPress={()=>{
                                                    this.handleCamera('Answer')
                                                    this.setState({AnswerContentStatus:true})
                                                  }}
                                    >
                                      <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/paizhaotu.png')}></Image>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={()=>{
                                                    this.setState({AnswerContentTextInputStatus:true,
                                                                    AnswerContentStatus:true})
                                                  }} 
                                  >
                                      <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/luru.png')}></Image>
                                  </TouchableOpacity>
                            </View>)
                            // 图片不显示就去加载答案内容
                            :(this.getContent(this.state.AnswerContentList))}
                      
                      {/* 添加答案的文本输入框是否显示 */}
                      {this.state.AnswerContentTextInputStatus?
                              (
                              <TextInput
                                  style={{borderWidth:1,margin:10,height:40,width:250}}
                                  onLayout={event=>{this.layout_Answer = event.nativeEvent.layout}}
                                  onChangeText={(text)=>{this.setState({AnswerContentTextInput:text})}}
                                  onBlur={()=>{
                                    var newAnswerContentList = this.state.AnswerContentList
                                    if(this.state.AnswerContentTextInput==''){
                                      if(newAnswerContentList.length<1){
                                        this.setState({
                                          AnswerContentStatus:false,
                                          AnswerContentTextInputStatus:false
                                        })
                                      }
                                    }else{
                                      newAnswerContentList.push('<p>'+this.state.AnswerContentTextInput+'</p>')
                                      this.props.addContentList(this.state.order,'Answer',newAnswerContentList)
                                      this.setState({
                                        AnswerContentTextInput:'',
                                        AnswerContentTextInputStatus:false
                                      })
                                    }
                                  
                                  }}
                              >
                              </TextInput>):(<View></View>)
                        }
                      </ScrollView>
                      
                            
                      </View>
          </>)
      }
    }

    loadingAnalysis(){
      return(
        <>
                    <View style={{flexDirection:'row',padding:20,paddingBottom:0,paddingTop:10,justifyContent:'space-between',alignItems:'center'}}> 
                      <View style={{height:30,justifyContent:'center',alignItems:'center',paddingBottom:5}}>
                        <Text style={{fontSize:20}}>解析</Text>
                      </View>
                      {(this.state.AnalysisContentStatus||(this.state.AnalysisContentList.length>0)?(
                      <View style={{flexDirection:'row',position:'absolute',width:'35%',justifyContent:'space-between',right:20,alignItems:'center'}}> 
                          <TouchableOpacity onPress={()=>{
                            this.handleLibrary('Analysis')
                          }}>
                              <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/xiangcesuo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.handleCamera('Analysis')
                        }}>
                              <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/paizhaosuo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                          this.setState({AnalysisContentTextInputStatus:true}) 
                          this._scrollView_Analysis.scrollToEnd()
                           }}>
                              <Image  style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/lurusuo.png')}></Image>
                        </TouchableOpacity>
                      </View>
                      ):(<View></View>))}
                    </View>

                    {/* 要根据试题的类型来动态显示加载什么样的答案编辑区域 */}
                    <View style={{borderWidth:0.8,borderColor:'#000000',height:150,margin:20,marginTop:10,marginBottom:0}}> 
                    <ScrollView style={{paddingTop:10}} 
                                ref={ref => this._scrollView_Analysis = ref}
                                nestedScrollEnabled={true}>
                    {((!this.state.AnalysisContentStatus)&&(!this.state.AnalysisContentList.length>0))?(
                          <View style={{flexDirection:'row',alignItems:'center',height:130,justifyContent:'space-around',paddingLeft:40,paddingRight:40}}>
                                <TouchableOpacity onPress={()=>{
                                                  this.handleLibrary('Analysis')
                                                  this.setState({AnalysisContentStatus:true})
                                                }}
                                >
                                    <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/xiangcetu.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={()=>{
                                                  this.handleCamera('Analysis')
                                                  this.setState({AnswerContentStatus:true})
                                                }}
                                  >
                                    <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/paizhaotu.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                                  this.setState({AnalysisContentTextInputStatus:true,
                                                                  AnalysisContentStatus:true})
                                                }} 
                                >
                                    <Image  style={{width:50,height:70}} source={require('../../../assets/TakePicturesAndAssignWork/luru.png')}></Image>
                                </TouchableOpacity>
                          </View>):(this.getContent(this.state.AnalysisContentList))}

                    {this.state.AnalysisContentTextInputStatus?
                            (
                            <TextInput
                                style={{borderWidth:1,margin:10,height:40,width:250}}
                                onLayout={event=>{this.layout_Analysis = event.nativeEvent.layout}}
                                onChangeText={(text)=>{this.setState({AnalysisContentTextInput:text})}}
                                onBlur={()=>{
                                  var newAnalysisContentList = this.state.AnalysisContentList
                                  if(this.state.AnalysisContentTextInput==''){
                                    if(newAnalysisContentList.length<1){
                                      this.setState({
                                        AnalysisContentStatus:false,
                                        AnalysisContentTextInputStatus:false
                                      })
                                    }
                                  }else{
                                    newAnalysisContentList.push('<p>'+this.state.AnalysisContentTextInput+'</p>')
                                    this.props.addContentList(this.state.order,'Analysis',newAnalysisContentList)
                                    this.setState({
                                      AnalysisContentTextInput:'',
                                      AnalysisContentTextInputStatus:false
                                    })
                                  }
                                
                                }}
                            >
                            </TextInput>):(<View></View>)
                      }
                    </ScrollView>
                    </View>
        </>)
    }
  
  
    loadingLookAnswerAndAnalysis(LookAnswerAndAnalysisStatus){
      if(LookAnswerAndAnalysisStatus){
        return(
          <View >
            <TouchableOpacity onPress={()=>{
              this.props.setLookAnswerAndAnalysisStatus(this.state.order)
            }}
                      style={{flexDirection:'row',justifyContent:'center',marginTop:15}}>
                <Text style={{color:'#59B9E0',fontSize:15}}>查看答案和解析</Text>
                <Image style={{width:20,height:20,marginLeft:10}} source={require('../../../assets/TakePicturesAndAssignWork/bot.png')}></Image>
            </TouchableOpacity>
            
          </View>
        )
      }else{
        return(
                  <View >
                      {this.loadingAnswer(this.state.baseTypeId)}
                      {this.loadingAnalysis()}
                  </View>
        )
      }
    }
  
    render(){
      const LookAnswerAndAnalysisStatus =this.state.LookAnswerAndAnalysisStatus
      return(
        <View style={{width:'100%',paddingBottom:20,borderTopWidth:0.5}}>
          {/* 题目名称 第一行 */}
          <Waiting/>
          <View style={{flexDirection:'row',paddingLeft:20,height:50,alignItems:'center',backgroundColor:'#DCDCDC'}}>
            <Text style={{fontSize:15,color:'#59B9E0'}}>{this.state.order}</Text>
            <Text style={{fontSize:15}}>/</Text>
            <Text style={{fontSize:15}}>{this.state.orderCount}</Text>
            <Text style={{fontSize:18}}>{this.state.questionName}</Text>
            <Text style={{fontSize:15}}> (</Text>
            <Text style={{fontSize:15}}>{this.state.questionScore}</Text>
            <Text style={{fontSize:15}}>分) </Text>
            <TouchableOpacity onPress={()=>{
                  this.props.setLookAnswerAndAnalysisStatus(this.state.order)
                  this.props.showaddTimuSetModal(
                    this.state.typeId,
                    this.state.questionName,
                    this.state.baseTypeId,
                    this.state.questionScore,
                    this.state.order,
                    )
                }}>
                  <Image style={{marginLeft:10}} source={require('../../../assets/TakePicturesAndAssignWork/changetitle.png')}></Image>
            </TouchableOpacity>
            <View style={{flexDirection:'row',position:'absolute',width:'35%',justifyContent:'space-between',right:20,top:10}}>
                <TouchableOpacity onPress={()=>{
                  this.props.shangyi(this.state.order)
                }}>
                      <Image style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/shangyi.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  this.props.xiayi(this.state.order)
                }}>
                      <Image style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/xiayi.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  this.props.deleteTimu(this.state.order,this.state.questionId)
                }}>
                      <Image style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/shanchu.png')}></Image>
                </TouchableOpacity>
            </View>
            
          </View>
          {this.loadingTiMu()}

          
  
          {/* 根据查看答案和解析状态判断展示哪个？ */}
          {this.loadingLookAnswerAndAnalysis(LookAnswerAndAnalysisStatus)}
  
          
          
          
  
        </View>
      )  
    }
  
  }