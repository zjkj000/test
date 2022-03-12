import { Text, StyleSheet, View, ScrollView,TouchableOpacity,Image,Dimensions} from 'react-native'
import React, { Component } from 'react'
import RadioList from '../Utils/RadioList'
import RenderHtml from 'react-native-render-html';

// 判断题 模板页面
//  使用时 需要传入参数：   sum   总题目数量：                 选传 不传默认总数题   会显示1/1题
//                         num   这是第几个题目               选传 不传默认num  0   会显示1/1题 
//                         datasource                        必须传  试题的内容
//                         paperId                           必须传  用于提交作业时候用到
//                         oldAnswer_data                    选择传递   是否有历史作答记录  一般是通过api获取的历史答案。否则不建议传
//                         getischange={setischange}         传递一个函数  用于向做作业的页面传递 是否改变了答案，便于判断是否要提交  setischange函数要自己写在做作业页面
//                         getStu_answer={setStu_answer_i}   传递一个函数  用于获得阅读题得到的作答结果  setStu_answer_i函数要自己写在做作业页面 代表设置第几道题的答案。
export default class Answer_single extends Component {
  constructor(props) {
    super(props)
    this.stuAnswer=this.stuAnswer.bind(this);
    this.state = {
            numid:'',
            questionTypeName:'判断题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'',  //题目选项
            questionContent:'',   //题目内容
            answer:'',
            stu_answer:'',
            oldStuAnswer:''
    }
 }  
 stuAnswer(str){
   console.log('判断题',str)
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
      const questionChoiceList = this.state.questionChoiceList;
      const  width = Dimensions.get('window').width;
  return (  
    <View>
        {/* 第一行显示 第几题  题目类型 */}
          <View  style={styles.answer_title}>
              <Text>{(this.state.numid?this.state.numid:0)+1}/{this.props.sum?this.props.sum:1}题 </Text>
              <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
              <TouchableOpacity style={{position:'absolute',right:20}}
                    // 小眼睛 先提交本题目，在跳转到提交页面
                >
                    <Image source={require('../../../../assets/image3/look.png')}></Image>
                </TouchableOpacity>
          </View>

        {/* 题目展示区域 */}
          <ScrollView style={styles.answer_area}>  
              <RenderHtml contentWidth={width}  source={{html:HTML}}/>
              <Text style={{height:50}}></Text>
          </ScrollView>

        {/* 答案区域 */}
          <View style={styles.answer_result}>
              <RadioList checkedindexID={this.state.stu_answer} ChoiceList={questionChoiceList} getstuanswer={this.stuAnswer}/>
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