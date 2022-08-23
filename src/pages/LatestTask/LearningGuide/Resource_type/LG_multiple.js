import { Text, StyleSheet, View, ScrollView ,TouchableOpacity,Image,Dimensions} from 'react-native'
import React, { Component, useState } from 'react'
import Checkbox from '../../DoWork/Utils/Checkbox'
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";
import { screenHeight } from '../../../../utils/Screen/GetSize';

export default function LG_multipleContainer(props) {
    const navigation = useNavigation();
    const learnPlanId= props.learnPlanId
    const submit_status=props.LG_submit_status
    const startdate=props.startdate
    const papername = props.papername
    const sum=props.sum
    const num=props.num 
    const datasource=props.datasource
    const oldLG_Answer_data=props.oldLG_Answer_data
    const[ischange,setLG_ischange] = useState()
    props.getLG_ischange(ischange)
    const[Stu_answer,setStu_LG_answer] = useState()
    props.getStu_LG_answer(Stu_answer)

    return (<LG_multiple  navigation={navigation}
                         
                              papername = {papername}
                              submit_status={submit_status}  
                              startdate={startdate}
                              learnPlanId={learnPlanId} 
                              getLG_ischange={setLG_ischange}   
                              getStu_LG_answer={setStu_LG_answer}  
                              sum={sum} 
                              num={num} 
                              isallObj={props.isallObj}
                              datasource={datasource} 
                              oldAnswer_data={oldLG_Answer_data}   />)
}


// 多选题 模板页面
//  使用时 需要传入参数：   sum   总题目数量：                 选传 不传默认总数题   会显示1/1题
//                         num   这是第几个题目               选传 不传默认num  0   会显示1/1题 
//                         datasource                        必须传  试题的内容
//                         learnPlanId                           必须传  用于提交作业时候用到
//                         oldAnswer_data                    选择传递   是否有历史作答记录  一般是通过api获取的历史答案。否则不建议传
//                         getischange={setischange}         传递一个函数  用于向做作业的页面传递 是否改变了答案，便于判断是否要提交  setischange函数要自己写在做作业页面
//                         getStu_answer={setStu_answer_i}   传递一个函数  用于获得阅读题得到的作答结果  setStu_answer_i函数要自己写在做作业页面 代表设置第几道题的答案。
class LG_multiple extends Component {
  constructor(props) {
    super(props)
    this.stuAnswer=this.stuAnswer.bind(this);
    this.state = {
            numid:'',
            resourceName:'多选题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'',  //题目选项
            question:'',   //题目内容
            answer:'',
            stu_answer:'',
            oldStuAnswer:''     //学生历史作答记录
    }
 }  

  //用于将本道题写的答案  传给 Todo页面，用于提交
  stuAnswer(str){
     this.setState({stu_answer:str})
     this.props.getStu_LG_answer(str)
     this.props.getLG_ischange(true);
  }


 UNSAFE_componentWillMount(){
     this.setState({
       stu_answer:this.props.oldAnswer_data?this.props.oldAnswer_data:'',
       oldStuAnswer:this.props.oldAnswer_data,
       numid:this.props.num?this.props.num:0,
       ...this.props.datasource});
    }


  render() {
    const HTML = this.state.question;
    const questionChoiceList =this.state.questionChoiceList;
    const  width = Dimensions.get('window').width;
    return (
      <View style={{backgroundColor:'#FFFFFF',borderTopColor:'#000000',borderTopWidth:0.5,height:'100%'}}  >
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text style={{fontWeight:'600',color:	'#000000',fontSize:17,width:'65%'}}>{this.state.resourceName}</Text>
            </View>
            
            {/* 题目展示区域 */}
            <ScrollView style={styles.answer_area}>
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
    answer_title:{padding:10,paddingLeft:30,flexDirection:'row',height:40},
    answer_area:{padding:20,paddingTop:0},
    answer_result:{borderTopWidth:0.8,borderTopColor:'#000000',paddingLeft:30,height:80,paddingRight:30,flexDirection:'row',justifyContent:'space-around'}
})