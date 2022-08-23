import { Text, View,StyleSheet,Image,TouchableOpacity,Alert,Dimensions,Modal} from 'react-native'
import React, { Component } from 'react'
import RenderHTML from 'react-native-render-html'
import SelectScore from './SelectScore'
import { Button } from '@ui-kitten/components';
import { screenHeight, screenWidth } from '../../../utils/Screen/GetSize';
import { CheckBox } from '@ui-kitten/components';
export default class PaperContent extends Component {
    constructor(props){
        super(props)
        this.setscore=this.setscore.bind(this)
        this.state={
            CorretcImg_Visibility:false,   //批改图片的弹窗 是否显示
            CorretcImg_url:'',
            CorrectResultList:[],
            sourceselectedIndex:'5',                            //记录批改的评分选项索引
            data:[],
            selectedScore:'', 

            CorrectAllQuestion:'',
      
            userCn:'',
        
            taskId:'',
            // 暂时未用到
            questionScore: 0,                                   //试题分数
            questionType: '',                                //试题的类型，如果是101,102,103按照客观题展示，其余按照主观题展示
            questionTypeName:'',
            questionID: '',                                  //试题id
            status: '',                                        //状态1正确；2错误；3部分答对；4手工未阅 
            type: "",
            correctingstatus:'',

            paperId:'',                                  //试卷id
            userName: '',                                 //学生登录名
            //用到的
            typeName: "",
            order: '',                                         //试题的顺序号
            orderCount: 0,                                     //试题的总题数
            stuscore: 0,                                       //学生得分    初始得分    要根据这个选中得分选项的                    				
            shitiShow:'',                                        //试题题面
            stuAnswer: '',                                      //学生答案，如果为空，表示学生未作答
            shitiAnswer: '' ,                                    //试题答案
            shitiAnalysis:'',

            halfistrue:false,                                   //用来记录  0.5分是否选中
           
            }
     }
    
    setscore(stuscore){
      var newscoreList = this.state.CorrectResultList
      newscoreList[parseInt(this.state.data.order)-1].stuscore=stuscore+(this.state.halfistrue&&stuscore!=newscoreList[this.state.data.order-1].questionScore?0.5:0)
      newscoreList[parseInt(this.state.data.order)-1].hand= 1
      this.props.setCorrected(newscoreList)
      this.setState({
        CorrectResultList:newscoreList,
        halfistrue:stuscore==newscoreList[this.state.data.order-1].questionScore?false:this.state.halfistrue
      })
    }

    UNSAFE_componentWillMount(){
      var i =this.props.data.order-1
      this.setState({data:this.props.data,
        CorrectAllQuestion:this.props.CorrectAllQuestion,
        taskId:this.props.taskId,
        userName:this.props.userName,
        userCn:this.props.userCn,
        type:this.props.type,
        correctingstatus:this.props.correctingstatus,
        CorrectResultList:this.props.CorrectResultList,
        halfistrue:this.props.CorrectResultList[i].stuscore==Math.floor(this.props.CorrectResultList[i].stuscore)?false:true
      })
    }
    //对学生的答案HTML代码进行展示
    showStuAnswer=()=>{
      const {Correct_Img_url,Correct_Img_Visable} =this.props
      var imgarr = this.AnalysisAnswerImgUrl(
        this.state.data.stuAnswer ? this.state.data.stuAnswer : ""
      ).imgarr;
      var urlarr = this.AnalysisAnswerImgUrl(
        this.state.data.stuAnswer ? this.state.data.stuAnswer : ""
      ).urlarr;
      var str = this.state.data.stuAnswer;
      var showhtmlarr = [];
      if (imgarr == null) {
          //不存在图片的情况;
          showhtmlarr.push(<Text>{this.state.data.stuAnswer}</Text>);
      } else {
          // 存在照片，在数组中遍历  替换成RN表示的类型
          imgarr.map(function (item, index) {
              var newstr = "has1imageistruehas1image";
              str = str.replace(item, newstr);
          });
          var htmlarr = str.split("has1image");
          var imgnum = 0;
          htmlarr.forEach(function (item, index) {
              if (item == "istrue") {
                  let nowimage = 0;
                  nowimage = imgnum;
                  showhtmlarr.push(
                      <View>
                          <TouchableOpacity key={index} onPress={()=>{
                              let src =urlarr[nowimage]
                              Alert.alert('','是否批改这张作业图片？',[{text:'取消',onPress:()=>{}},{},{text:'确定',onPress:()=>{
                                Correct_Img_Visable(src)
                              }}])
                          }
                            
                          }>
                          <Image
                              style={{ width: screenWidth*0.3,height:screenWidth*0.3 }}
                              source={{ uri: urlarr[imgnum] }}
                          />
                          </TouchableOpacity>
                      </View>
                  );
                  imgnum += 1;
              } else {
                  showhtmlarr.push(
                      <View>
                          <Text multiline={true}>{item}</Text>
                      </View>
                  );
              }
          });
      }
      return showhtmlarr;
  }

      AnalysisAnswerImgUrl(str) {
        // 先把返回的＂转义 \"
        var str = str.replace('"', '"');
        //1，匹配出图片img标签（即匹配出所有图片），过滤其他不需要的字符
        //2.从匹配出来的结果（img标签中）循环匹配出图片地址（即src属性）
        var imgReg = /<img.*?(?:>|\/>)/gi;
        //匹配src属性
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = [];
        arr = str.match(imgReg);
        if (arr != null) {
            var newsrcarr = [];
            for (var i = 0; i < arr.length; i++) {
                let srcarr = [];
                srcarr = arr[i].match(srcReg);
                newsrcarr.push(srcarr[1]);
            }
            return {
                imgarr: arr,
                urlarr: newsrcarr,
            };
        } else
            return {
                imgarr: arr,
                urlarr: [],
            };
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
    }else if(this.state.data.questionType=='102'){
      for(var m=0;m<=parseInt(CorrectResultList[i].questionScore);m++){
        selectScore.push(m)
      }
    }else{
      for(var m=0;m<=parseInt(CorrectResultList[i].questionScore);m++){
        selectScore.push(m)
      }
      // selectScore=[0,1,2,3,4,5,6,7,8,9,10]
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

                <RenderHTML contentWidth={width} source={{html:this.state.data.shitiShow}} 
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
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={styles.Titletext}>[得分]   {this.state.data.status==4&&CorrectResultList[i].hand==0?'':this.state.CorrectResultList[i].stuscore}</Text>
                  {/* //多选和主观题  加上0.5 分值选项 */}
                  {((this.props.data.questionType=='102'||this.props.data.questionType=='104'||this.props.data.questionType=='106')&&(this.props.correctingstatus!='5'))?(
                    <View style={{position:'absolute',left:screenWidth*0.4}}>
                          <CheckBox  checked={this.state.halfistrue} onChange={()=>{
                              if(this.state.halfistrue){
                                var newCorrectResultList=this.state.CorrectResultList
                                newCorrectResultList[parseInt(this.state.data.order)-1].hand= 1
                                this.props.setCorrected(newCorrectResultList)
                                newCorrectResultList[i].stuscore=(newCorrectResultList[i].stuscore-0.5)<0?0:(newCorrectResultList[i].stuscore-0.5)
                                this.setState({
                                    halfistrue:false,
                                    CorrectResultList:newCorrectResultList
                                  })
                              }else{
                                if(this.state.CorrectResultList[i].stuscore==selectScore[selectScore.length-1]){
                                  Alert.alert('','该题目已经满分',[{},{text:'确定',onPress:()=>{}}])
                                }else{
                                  var newCorrectResultList=this.state.CorrectResultList
                                  newCorrectResultList[parseInt(this.state.data.order)-1].hand= 1
                                  this.props.setCorrected(newCorrectResultList)
                                  newCorrectResultList[i].stuscore=(newCorrectResultList[i].stuscore+0.5)>selectScore[selectScore.length-1]?selectScore[selectScore.length-1]:(parseFloat(newCorrectResultList[i].stuscore)+0.5)
                                  this.setState({
                                    halfistrue:true,
                                    CorrectResultList:newCorrectResultList
                                  })
                                }
                              }
                            }}><Text style={{fontSize:20}}>0.5</Text> </CheckBox>
                    </View>
                  ):(<></>)}
                  
                </View>
                
                 
                 {/* 选择得了几分的区域 */}
                {this.state.correctingstatus=='5'?(<></>):( 
                <View style={{flexDirection:'row',flexWrap:'wrap',width:'100%'}}> 
                    <SelectScore getscore={this.setscore} scoreList={selectScore}  selectedScore={newSelectedScore}></SelectScore>
                </View>)}
               
               
                
                <Text style={styles.Titletext}>[学生答案]</Text>

                {this.state.data.stuAnswer==''
                    ?<Text style={{fontSize:20,marginBottom:10}}>未答</Text>
                    :
                    this.showStuAnswer()
                    // <WebView
                    //                 javaScriptEnabled={true}
                    //                 scalesPageToFit={Platform.OS === 'ios'? true : false}
                    //                 // style={{height: screenHeight , width : screenWidth}}
                    //                 source={{ html: this.deal_Stu_AnswerImageHtml( this.state.data.stuAnswer )}}
                    // >
                    // </WebView>
                    // <RenderHTML contentWidth={width} source={{html:this.state.data.stuAnswer}} 
                    //                 tagsStyles={{
                    //                             img:{flexDirection:'row'},
                    //                             p:{flexDirection:'row'}}}/>
                  }

                <Text style={styles.Titletext}>[标准答案]</Text>
      
                {this.state.data.shitiAnswer==''?<Text style={{fontSize:20,marginBottom:10}}>略</Text>:<RenderHTML contentWidth={width} source={{html:this.state.data.shitiAnswer}} 
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
                                    /> } 

                <Text style={styles.Titletext}>[解析]</Text>
                {this.state.data.shitiAnalysis==''?<Text style={{fontSize:20,marginBottom:10}}>略</Text>:<RenderHTML contentWidth={width} source={{html:this.state.data.shitiAnalysis}} 
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
                                    />}
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