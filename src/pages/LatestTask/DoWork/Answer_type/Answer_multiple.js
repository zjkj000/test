import { Text, StyleSheet, View, ScrollView ,TouchableOpacity,Image,Dimensions} from 'react-native'
import React, { Component, useState } from 'react'
import Checkbox from '../Utils/Checkbox'
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";

export default function Answer_multipleContainer(props) {
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

    return (<Answer_multiple  navigation={navigation}  
                              papername = {papername}
                              submit_status={submit_status}  
                              startdate={startdate}
                              paperId={paperId} 
                              getischange={setischange}   
                              getStu_answer={setStu_answer}  
                              sum={sum} 
                              num={num} 
                              datasource={datasource} 
                              oldAnswer_data={oldAnswer_data}   />)
}


// 多选题 模板页面
//  使用时 需要传入参数：   sum   总题目数量：                 选传 不传默认总数题   会显示1/1题
//                         num   这是第几个题目               选传 不传默认num  0   会显示1/1题 
//                         datasource                        必须传  试题的内容
//                         paperId                           必须传  用于提交作业时候用到
//                         oldAnswer_data                    选择传递   是否有历史作答记录  一般是通过api获取的历史答案。否则不建议传
//                         getischange={setischange}         传递一个函数  用于向做作业的页面传递 是否改变了答案，便于判断是否要提交  setischange函数要自己写在做作业页面
//                         getStu_answer={setStu_answer_i}   传递一个函数  用于获得阅读题得到的作答结果  setStu_answer_i函数要自己写在做作业页面 代表设置第几道题的答案。
class Answer_multiple extends Component {
  constructor(props) {
    super(props)
    this.stuAnswer=this.stuAnswer.bind(this);
    this.state = {
            numid:'',
            questionTypeName:'多选题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'',  //题目选项
            questionContent:'',   //题目内容
            answer:'',
            stu_answer:'',
            oldStuAnswer:''     //学生历史作答记录
    }
 }  

  //用于将本道题写的答案  传给 Todo页面，用于提交
  stuAnswer(str){
     this.setState({stu_answer:str})
     this.props.getStu_answer(str)
     this.props.getischange(true);
  }


 UNSAFE_componentWillMount(){
     this.setState({
       stu_answer:this.props.oldAnswer_data?this.props.oldAnswer_data:'',
       oldStuAnswer:this.props.oldAnswer_data,
       numid:this.props.num?this.props.num:0,
       ...this.props.datasource});
    }


  render() {
    const HTML = this.state.questionContent;
    const questionChoiceList =this.state.questionChoiceList;
    const  width = Dimensions.get('window').width;
    return (
      <View>
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text>{(this.state.numid?this.state.numid:0)+1}/{this.props.sum?this.props.sum:1}题 </Text>
                <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
                <TouchableOpacity  style={{position:'absolute',right:20}}
                                  onPress={
                                    ()=>{
                                        //导航跳转
                                        this.props.navigation.navigate('SubmitPaper',
                                        {   paperId:this.props.paperId,
                                            submit_status:this.props.submit_status,
                                            startdate:this.props.startdate,
                                            papername:this.props.papername})
                                    }
                                }
                >
                    <Image source={require('../../../../assets/image3/look.png')}></Image>
                </TouchableOpacity>
            </View>
            
            {/* 题目展示区域 */}
            <ScrollView style={styles.answer_area}>
              <RenderHtml contentWidth={width}  source={{html:HTML}}/>
            </ScrollView>
            
           
            {/* 答案区域 */}
            <View style={styles.answer_result}>
                {/* 调用了复选框组件，使用的时候需要传进去选项列表 */}
                <Checkbox checkedlist={this.state.stu_answer} ChoiceList={questionChoiceList} getstuanswer={this.stuAnswer}/>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    answer_title:{padding:10,paddingLeft:30,flexDirection:'row'},
    answer_area:{height:"85%",padding:20},
    answer_result:{borderTopWidth:1,borderTopColor:'#000000',paddingLeft:30,paddingTop:5,paddingBottom:5,paddingRight:30,flexDirection:'row',justifyContent:'space-around'}
})