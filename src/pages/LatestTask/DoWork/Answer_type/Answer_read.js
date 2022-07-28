import { Text, StyleSheet, View, ScrollView,Image,TouchableOpacity,Alert ,Dimensions} from 'react-native'
import React, { Component, useState } from 'react'
import RadioList from '../Utils/RadioList'
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";
import Toast from '../../../../utils/Toast/Toast'
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { screenWidth } from '../../../../utils/Screen/GetSize';
export default function Answer_readContainer(props) {
  const navigation = useNavigation();
  const paperId= props.paperId
  const submit_status=props.submit_status
  const startdate=props.startdate
  const papername = props.papername
  const sum=props.sum
  const num=props.num 
  const datasource=props.datasource
  const oldAnswer_data=props.oldAnswer_data
  const[ischange,setischange] = useState()
  props.getischange(ischange)
  const[Stu_answer,setStu_answer] = useState()
  props.getStu_answer(Stu_answer)
  
  if(datasource.questionTypeName=='七选五'){
    return (
      <Answer_7S5  navigation={navigation}  
                      papername = {papername}
                      submit_status={submit_status}  
                      startdate={startdate}
                      paperId={paperId} 
                      getischange={setischange}   
                      getStu_answer={setStu_answer}  
                      sum={sum} 
                      num={num} 
                      isallObj={props.isallObj}
                      datasource={datasource} 
                      oldAnswer_data={oldAnswer_data}   />
    )
  }else{
    return (
      <Answer_read  navigation={navigation}  
                      papername = {papername}
                      submit_status={submit_status}  
                      startdate={startdate}
                      paperId={paperId} 
                      getischange={setischange}   
                      getStu_answer={setStu_answer}  
                      sum={sum} 
                      num={num} 
                      isallObj={props.isallObj}
                      datasource={datasource} 
                      oldAnswer_data={oldAnswer_data}   />
    )
  }


  
}
//  阅读题 模板页面
//  使用时 需要传入参数：   sum   总题目数量：                 选传 不传默认总数题   会显示1/1题
//                         num   这是第几个题目               选传 不传默认num  0   会显示1/1题 
//                         datasource                        必须传  试题的内容
//                         paperId                           必须传  用于提交作业时候用到
//                         oldAnswer_data                    选择传递   是否有历史作答记录  一般是通过api获取的历史答案。否则不建议传
//                         getischange={setischange}         传递一个函数  用于向做作业的页面传递 是否改变了答案，便于判断是否要提交  setischange函数要自己写在做作业页面
//                         getStu_answer={setStu_answer_i}   传递一个函数  用于获得阅读题得到的作答结果  setStu_answer_i函数要自己写在做作业页面 代表设置第几道题的答案。


class Answer_read extends Component {
  constructor(props) {
    super(props)
    this.stuAnswer=this.stuAnswer.bind(this);
    this.stuAnswer_single=this.stuAnswer_single.bind(this)
    this.state = {
            closeopenstate:true,
            numid:'',
            questionTypeName:'阅读题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            nowSelectedIndex:1,    //记录折叠模式下选中的题
            questionChoiceList:0,  //选项个数
            questionContent:'',   //题目内容
            answer:'',
            stu_answer:'',
            oldStuAnswer:'',
            questionList:'A,B,C,D',
    }
 } 
   
 //用于将作答结果传给TODO界面
    //答案处理
    stuAnswer(TimuIndex,str){
      // console.log(this.state.numid+1,'题，第',TimuIndex+1,'小题选了什么',str)
      var newAnswer =  new Array();
              //阅读是要拼接未答,未答
              if(this.state.stu_answer!=''){
                newAnswer=this.state.stu_answer.split(',');
              }else{
                for(var i=0;i<this.state.questionChoiceList;i++)
                newAnswer[i] = '未答'
              }
    
      newAnswer[TimuIndex]=str;
      this.setState({stu_answer:newAnswer.toString()});
      this.props.getStu_answer(newAnswer.toString());
      
      this.props.getischange(true);
     }

    UNSAFE_componentWillMount(){
      this.setState({
        stu_answer:this.props.oldAnswer_data?this.props.oldAnswer_data:'',
        oldStuAnswer:this.props.oldAnswer_data,
        numid:this.props.num?this.props.num:0,
        ...this.props.datasource});}

    stuAnswer_single(str) {
      var newAnswer =  new Array();
              //阅读是要拼接未答,未答
              if(this.state.stu_answer!=''){
                newAnswer=this.state.stu_answer.split(',');
              }else{
                for(var i=0;i<this.state.questionChoiceList;i++)
                newAnswer[i] = '未答'
              }
    
      newAnswer[this.state.nowSelectedIndex-1]=str;
      this.setState({stu_answer:newAnswer.toString()});
      this.props.getStu_answer(newAnswer.toString());
      this.props.getischange(true);
      // console.log('阅读题的最终答案是_单选模式：',newAnswer.toString())
    }
    
    render() {
    const HTML = this.state.questionContent;
    const questionChoiceList =this.state.questionChoiceList;
    const  width = Dimensions.get('window').width;
    
    //为了动态加在选项个数  阅读题默认都是ABCD选项
    const stu_answer = this.state.stu_answer;
    var stu_answer_array = stu_answer.split(',');
    
    var items = [];

    for (var read_num_i = 0; read_num_i < questionChoiceList; read_num_i++) {
      items.push(
          <View key={read_num_i} style={styles.answer_result}>
            <Text style={{fontSize:20,width:25}}>{read_num_i+1}</Text>
            <RadioList TimuIndex={read_num_i} checkedindexID={stu_answer_array[read_num_i]} ChoiceList={this.state.questionList} getstuanswer={this.stuAnswer} type='read'/>
          </View>);
    }
    items.push(<View style={{height:30}}></View>)
    return (
      <View style={{backgroundColor:'#fff',borderTopColor:'#000000',borderTopWidth:0.5,height:'100%'}}  >
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text style={{color:'#59B9E0'}}>{(this.state.numid?this.state.numid:0)+1}</Text>
                <Text>/{this.props.sum?this.props.sum:1}题 </Text>
                <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
            </View>
            
            {/* 题目展示区域 */}
            <ScrollView  style={this.state.closeopenstate?styles.answer_area:styles.answer_area_open}>
              <RenderHtml contentWidth={width}  source={{html:HTML}} 
                                    tagsStyles={{
                                      img:{
                                          flexDirection:'row',
                                          flexWrap:'wrap'
                                      },
                                      p:{
                                          flexDirection:'row',
                                          flexWrap:'wrap'
                                      }
                                  }}
                                    />
              <Text style={{height:50}}></Text>
            </ScrollView>
            

            {/* 答案区域 */}
            <View  style={this.state.closeopenstate?styles.answer_result_area:styles.answer_result_area_open}>
                    {/* 答案改变选项高度部分 */}
                    <TouchableOpacity onPress={()=>{this.setState({closeopenstate:!this.state.closeopenstate})}}>
                        <Image style={{position:'relative',left:'40%',height:25}}  source={require('../../../../assets/image3/closeopen.png')}></Image>
                    </TouchableOpacity>
                    
                    {/* 答案滑动选择部分 */}
                    <ScrollView style={{borderTopWidth:0.5,borderTopColor:'#000000',}}>

                      {this.state.closeopenstate?(
                        <View style={{flexDirection:'row',height:60,borderTopWidth:0.5,justifyContent:'space-around',alignContent:"center"}}>
                          <TouchableOpacity style={{position:'absolute',left:10,top:12}} onPress={()=>{
                            if(this.state.nowSelectedIndex>1){
                              this.setState({nowSelectedIndex:this.state.nowSelectedIndex-1})
                            }else{
                              Toast.showInfoToast('已经是第一道小题',500)
                            }
                          }}>
                            <Image  source={require('../../../../assets/stuImg/lastquestion.png')}></Image>
                          </TouchableOpacity>
                          <View style={{width:ScreenWidth*0.7,flexDirection:'row'}}>
                            <Text style={{marginTop:15,fontSize:17,color:'#59B9E0'}}>{this.state.nowSelectedIndex}</Text>
                            <Text style={{marginTop:15,fontSize:17}}>/{this.state.questionChoiceList}</Text>
                            
                            <RadioList
                                      checkedindexID={this.state.stu_answer.split(',')[this.state.nowSelectedIndex-1]=='未答'?'':this.state.stu_answer.split(',')[this.state.nowSelectedIndex-1]}
                                      ChoiceList={this.state.questionList}
                                      getstuanswer={this.stuAnswer_single}
                                  />
                          </View>
                          <TouchableOpacity style={{position:'absolute',right:10,top:12}} onPress={()=>{
                            if(this.state.nowSelectedIndex<this.state.questionChoiceList){
                              this.setState({nowSelectedIndex:this.state.nowSelectedIndex+1})
                            }else{
                              Toast.showInfoToast('已经是最后一道小题',500)
                            }
                          }}>
                            <Image  source={require('../../../../assets/stuImg/nextquestion.png')}></Image>
                          </TouchableOpacity>
                          
                        </View>
                          
            
                        
                      ):(<>{items}</>)
                      }
                        
                    </ScrollView>
            </View>
      </View>
    )
  }
}

class Answer_7S5 extends Component {
  constructor(props) {
    super(props)
    this.stuAnswer=this.stuAnswer.bind(this);
    this.state = {
            closeopenstate:true,
            numid:'',
            questionTypeName:'',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:0,  //选项个数
            questionContent:'',   //题目内容
            answer:'',
            stu_answer:'',
            oldStuAnswer:'',
            questionList:'A,B,C,D,E,F',
    }
 } 
   
 //用于将作答结果传给TODO界面
    //答案处理
    stuAnswer(TimuIndex,str){
      // console.log(this.state.numid+1,'题，第',TimuIndex+1,'小题选了什么',str)
      var newAnswer =  new Array();

              //阅读是要拼接未答,未答
              if(this.state.stu_answer!=''){
                newAnswer=this.state.stu_answer.split(',');
              }else{
                for(var i=0;i<this.state.questionChoiceList;i++)
                newAnswer[i] = '*'
              }
    
      newAnswer[TimuIndex]=str;
      this.setState({stu_answer:newAnswer.toString()});
      this.props.getStu_answer(newAnswer.toString());
      
      this.props.getischange(true);
      // console.log('7选5题的最终答案是：',newAnswer.toString())
     }

    UNSAFE_componentWillMount(){
      this.setState({
        stu_answer:this.props.oldAnswer_data?this.props.oldAnswer_data:'',
        oldStuAnswer:this.props.oldAnswer_data,
        numid:this.props.num?this.props.num:0,
        ...this.props.datasource});}
   
    
    render() {
    const HTML = this.state.questionContent;
    const questionChoiceList =this.state.questionChoiceList;
    const  width = Dimensions.get('window').width;
    
    //为了动态加在选项个数  阅读题默认都是ABCDEF选项
    const stu_answer = this.state.stu_answer;
    var stu_answer_array = stu_answer.split(',');
    
    var items = [];

    for (var read_num_i = 0; read_num_i < questionChoiceList; read_num_i++) {
      items.push(
          <View key={read_num_i} style={styles.answer_result}>
            <Text style={{fontSize:20,width:25}}>{read_num_i+1}</Text>
            <RadioList TimuIndex={read_num_i} checkedindexID={stu_answer_array[read_num_i]} ChoiceList={this.state.questionList} getstuanswer={this.stuAnswer} type='read'/>
          </View>);
    }
    return (
      <View style={{borderTopColor:'#000000',borderTopWidth:0.5,backgroundColor:'#FFFFFF',height:"100%"}}>
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text style={{color:'#59B9E0'}}>{(this.state.numid?this.state.numid:0)+1}</Text>
                <Text>/{this.props.sum?this.props.sum:1}题 </Text>
                <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
               
            </View>
            
            {/* 题目展示区域 */}
            <ScrollView  style={styles.answer_area_7S5}>
              <RenderHtml contentWidth={width}  source={{html:HTML}} 
                                    tagsStyles={{
                                      img:{
                                          flexDirection:'row',
                                          flexWrap:'wrap'
                                      },
                                      p:{
                                          flexDirection:'row',
                                          flexWrap:'wrap'
                                      }
                                  }}
                                    />
              <Text style={{height:50}}></Text>
            </ScrollView>
            

            {/* 答案区域 */}
            <View  style={styles.answer_result_area_7S5}>
                    
                    
                    {/* 答案滑动选择部分 */}
                    <View style={{borderTopWidth:0.5,borderTopColor:'#000000',}}>
                        {/* item是根据题目中小题个数，动态加载的 */}
                        {items}
                        {/* 下面这个view是为了解决选项在最低端加载显示不全的问题，写个空白的区域，将最下面的顶上来 */}
                        <View style={{height:30}}></View>
                    </View>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
    answer_title:{padding:10,paddingLeft:30,flexDirection:'row',height:40},

    answer_area:{padding:20,paddingTop:0},
    answer_result_area:{height:98,},

    answer_area_7S5:{padding:20,paddingTop:0},
    answer_result_area_7S5:{height:275},

    answer_area_open:{padding:20,paddingTop:0},
    answer_result_area_open:{height:300,paddingBottom:15,paddingLeft:screenWidth*0.05},

    answer_result:{flexDirection:'row',justifyContent:'center',paddingLeft:20,alignItems:'center'}
})