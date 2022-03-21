import { Text, StyleSheet, View, ScrollView,Image,TouchableOpacity,Alert,Dimensions } from 'react-native'
import React, { Component, useState } from 'react'
import RadioList from '../../DoWork/Utils/RadioList';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";

export default function PPTContainer(props) {
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
    return (
    <PPT            navigation={navigation}  
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
//  PPT展示 

 class PPT extends Component {
     constructor(props) {
        super(props)
        this.stuAnswer=this.stuAnswer.bind(this);
        this.state = {
                numid:'',
                resourceName:'',
                resourceId:'',
                baseTypeId:'',
                questionName:'',        //题目名称
                questionChoiceList:'',  //题目选项
                question:'',            //题目内容
                answer:'',
                stu_answer:'',
                oldStuAnswer:'',
                uri:'',
                pptList:'',
                selectedindex:0    //记录当前选中的是哪张ppt
        }
     }  
   
     //用于将本道题写的答案  传给 Todo页面，用于提交
     stuAnswer(str){
         this.setState({stu_answer:str})
         this.props.getStu_answer(str)
         this.props.getischange(true);
     }


     UNSAFE_componentWillMount(){
         //请求数据  需要  作业id  用户id   这道题的 numid
         //id有了 props.paperId   用户id有  
         //请求到之后  就要把答案 设置到oldstuanswer
         this.setState({
             uri:this.props.datasource.pptList[0],
             pptList: this.props.datasource.pptList,
             stu_answer:this.props.oldAnswer_data?this.props.oldAnswer_data:'',
             oldStuAnswer:this.props.oldAnswer_data,
             numid:this.props.num?this.props.num:0,
             ...this.props.datasource});
        }   

    getPPT(pptList){
        var pptItems=[];
        for(let ppt_i=0;ppt_i<pptList.length;ppt_i++){
            pptItems.push(
                <TouchableOpacity onPress={()=>this.setState({selectedindex:ppt_i,uri:pptList[ppt_i]})}>
                        <Image source={{uri:pptList[ppt_i]}} style={this.state.selectedindex==ppt_i?styles.checked:styles.little_image} />
                </TouchableOpacity>
                
            )
        }
        return pptItems;
    }
     render() {
        const  width = Dimensions.get('window').width;
    return (  
      <View>
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.title}>  
                <Text style={{fontWeight:'600',color:	'#000000',fontSize:17,width:'65%'}}>{this.state.resourceName}</Text>
                <View style={{position:'absolute',right:80,top:10,flexDirection:'row'}}>
                    <Text style={{color:'#59B9E0'}} >{(this.state.numid?this.state.numid:0)+1}</Text>
                    <Text >/{this.props.sum?this.props.sum:1} </Text>
                </View>
                <TouchableOpacity onPress={
                    ()=>{
                        //导航跳转
                        this.props.navigation.navigate('SubmitLearningGuide',
                        {   paperId:this.props.paperId,
                            submit_status:this.props.submit_status,
                            startdate:this.props.startdate,
                            papername:this.props.papername,
                            isallObj:this.props.isallObj})
                    }
                } style={{position:'absolute',right:20,top:10}}
                    
                    >
                        <Image source={require('../../../../assets/image3/look.png')}></Image>
                </TouchableOpacity>
            </View>
            
            {/* 展示PPT就行 */}
            
            <View style={styles.area}>
                <Text style={{fontSize:18,marginBottom:10}}>{this.state.resourceName}</Text>
                <Image style={{width:'90%',height:250}} source={{uri:this.state.uri}}></Image>
                <ScrollView horizontal={true} style={{marginTop:80}}>
                    {this.getPPT(this.state.pptList)}
                </ScrollView>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    title:{padding:10,paddingLeft:30,flexDirection:'row',},
    area:{alignItems:'center',height:'100%',paddingTop:'35%'},
    little_image:{height:50,width:80,marginLeft:5},
    checked:{height:50,width:80,marginLeft:5,borderColor:'#FFA500',borderWidth:2}
})