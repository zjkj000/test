import { Text, StyleSheet, View, ScrollView,Image,TextInput,Button,Alert} from 'react-native'
import React, { Component } from 'react'
import HTMLView from 'react-native-htmlview';

// 答题页面
export default class Answer_single extends Component {
  constructor(props) {
    super(props)
    this.state = {    
            numid:'',
            questionTypeName:'主观题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'',  
            questionContent:'',   //题目内容
            answer:'',
            imgURL: "",
            value: "",
            hasAvatar: false,
            userName: "小明",
            selectedTitle: "No items selected",
            moduleVisible: false,
            msg:''
    }
 }  
componentDidMount(){
    this.setState({numid:this.props.num,...this.props.datasource});
    }

  render() {
    const HTML = this.state.questionContent;
    return (
      <View>
          {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text>{this.state.numid+1}/{this.props.sum}题</Text>
                <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
            </View>
          {/* 题目展示区域 */}
            <ScrollView style={styles.answer_area}>
                <HTMLView value={HTML}/>
                <Text style={{height:50}}></Text>
            </ScrollView>
            <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>
          {/* 答案预览区域 */}
            <ScrollView style={styles.answer_preview}> 
                <Text >{this.state.msg}</Text>
            </ScrollView>
          {/* 作答区域 */}
          <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>
            <View style={styles.content}>
              <Text onPress={()=>this.setState({msg:''})} style={{color:'#B68459'}}>删除</Text>
              <TextInput placeholder="请输入答案！" multiline style={{width:200,backgroundColor:'#FFFFFF',height:40}} value={this.state.msg} onChangeText={text=>this.setState({msg:text})}></TextInput>
              <Image style={{width:40,height:35}} source={require('../../../../assets/image3/camera.png')} ></Image>
              <Button title='保存' onPress={()=>alert('点了保存')} style={{width:100,height:35}}></Button>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    answer_title:{padding:10,paddingLeft:30,flexDirection:'row'},
    answer_area:{height:"65%",padding:20},
    answer_preview:{height:"21%",padding:20,backgroundColor:'#FFFFFF'},
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
},
    content:{width:"100%",flexDirection:'row',justifyContent:'space-around',backgroundColor:'#E6DDD6',padding:10,alignItems:'center'}
})