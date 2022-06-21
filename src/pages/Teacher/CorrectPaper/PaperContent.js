import { Text, View,StyleSheet,Image,TouchableOpacity,Alert,Dimensions} from 'react-native'
import React, { Component } from 'react'
import RenderHTML from 'react-native-render-html'
import SelectScore from './SelectScore'
export default class PaperContent extends Component {
    constructor(props){
        super(props)
        this.setscore=this.setscore.bind(this)
        this.state={
            CorrectResultList:[],
            sourceselectedIndex:'5',                            //记录批改的评分选项索引
            data:[],
            selectedScore:'', 

            CorrectAllQuestion:'',
      
            userCn:'',
        
            taskId:'',
            // 暂时未用到
            questionScore: 8,                                   //试题分数
            questionType: '104',                                //试题的类型，如果是101,102,103按照客观题展示，其余按照主观题展示
            questionTypeName:'11',
            questionID: 'PRQUI6000703359',                      //试题id
            status: '2',                                        //状态1正确；2错误；3部分答对；4手工未阅 
            type: "60000054",
            correctingstatus:'',

            paperId:'826c0915-2e9c-47bb-ab07-ac8f2f66b9ce',     //试卷id
            userName: 'UN97225',                                //学生登录名
            //用到的
            typeName: " 填空题",
            order: '',                                         //试题的顺序号
            orderCount: 13,                                     //试题的总题数
            stuscore: 0,                                          //学生得分    初始得分    要根据这个选中得分选项的                    				
            shitiShow:'填数。<br>（1）5+□=9<br>（2）2+□=7<br>（3）1+7-3=□<br>（4）8-2+3=□<br><br>',     //试题题面
            stuAnswer: '',                                      //学生答案，如果为空，表示学生未作答
            shitiAnswer: '' ,                                    //试题答案
            shitiAnalysis:'',
           
            }
     }
    
    setscore(stuscore){
      var newscoreList = this.state.CorrectResultList
      newscoreList[parseInt(this.state.data.order)-1].stuscore=stuscore
      newscoreList[parseInt(this.state.data.order)-1].hand= 1
      this.props.setCorrected(newscoreList)
      this.setState({CorrectResultList:newscoreList})
    }

    UNSAFE_componentWillMount(){
      this.setState({data:this.props.data,
        CorrectAllQuestion:this.props.CorrectAllQuestion,
        taskId:this.props.taskId,
        userName:this.props.userName,
        userCn:this.props.userCn,
        type:this.props.type,
        correctingstatus:this.props.correctingstatus,
        CorrectResultList:this.props.CorrectResultList})
    }
    
    render() {
    
    const CorrectResultList =this.state.CorrectResultList
   
    const  width = Dimensions.get('window').width;
    //创造 得分数组
    var selectScore = [];
    var i= parseInt(this.state.data.order)-1
    if(this.state.data.questionType=='101'||this.state.data.questionType=='103'){
      var maxscore = CorrectResultList[i].questionScore
      selectScore=[0,maxscore]
    }else{
      selectScore=[0,1,2,3,4,5,6,7,8,9,10]
    }
    if(this.state.data.status==4&&CorrectResultList[i].hand==0){
      var newSelectedScore='';
    }else{
      var newSelectedScore=CorrectResultList[i].stuscore
    }
    
    return (
              <View style={{padding:20,paddingTop:0}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={styles.Titletext}>[{this.state.data.typeName}]</Text>
                      <View style={{flexDirection:'row',marginTop:4}}>
                        <Text style={{color:'#59B9E0',fontSize:20}}>{this.state.data.order}</Text>
                        <Text style={{color:'#000000',fontSize:20}}>/{this.state.data.orderCount}</Text>
                      </View>
                  </View>

                <RenderHTML contentWidth={width} source={{html:this.state.data.shitiShow}}></RenderHTML>
                <Text style={styles.Titletext}>[得分]   {this.state.data.status==4&&CorrectResultList[i].hand==0?'':this.state.CorrectResultList[i].stuscore}</Text>
                 
                 {/* 选择得了几分的区域 */}
                {this.state.correctingstatus=='5'?(<></>):( 
                <View style={{flexDirection:'row',flexWrap:'wrap',width:'100%'}}> 
                    <SelectScore getscore={this.setscore} scoreList={selectScore}  selectedScore={newSelectedScore}></SelectScore>
                </View>)}
               
               
                
                <Text style={styles.Titletext}>[学生答案]</Text>

                {this.state.data.stuAnswer==''?<Text style={{fontSize:20,marginBottom:10}}>未答</Text>: <RenderHTML contentWidth={width} source={{html:this.state.data.stuAnswer}}></RenderHTML>}
               
                <Text style={styles.Titletext}>[标准答案]</Text>
      
                {this.state.data.shitiAnswer==''?<Text style={{fontSize:20,marginBottom:10}}>略</Text>:<RenderHTML contentWidth={width} source={{html:this.state.data.shitiAnswer}}></RenderHTML> } 

                <Text style={styles.Titletext}>[解析]</Text>
                {this.state.data.shitiAnalysis==''?<Text style={{fontSize:20,marginBottom:10}}>略</Text>: <RenderHTML contentWidth={width} source={{html:this.state.data.shitiAnalysis}}></RenderHTML>}
              </View>
    )
  }
}



const styles = StyleSheet.create(
  {
  tab: {
    height: "100%",
  },
  Titletext:{
    fontWeight:'bold',
    color:	'#000000',
    fontSize: 20,
    marginTop:5,
    marginBottom:10
  },
  viewstyle:{
    zIndex:1,
    margin:5,
    borderColor:'#62C3E4',
    borderWidth:1.5,
    width:35,
    height:40
  },
  text:{
    position:'absolute',
    marginLeft:8,
    marginTop:2,
    fontSize:22,
    color:'#62C3E4'
  },
  text_2:{
    position:'absolute',
    marginLeft:3,
    marginTop:2,
    fontSize:22,
    color:'#62C3E4'
  },
  selectedtext:{
    zIndex:10,
    position:'absolute',
    marginLeft:8,
    marginTop:2,
    fontSize:22,
    color:'#FFFFFF'
  },
  selectedtext_2:{
    zIndex:2,
    position:'absolute',
    marginLeft:3,
    marginTop:2,
    fontSize:22,
    color:'#FFFFFF'
  },

  
});