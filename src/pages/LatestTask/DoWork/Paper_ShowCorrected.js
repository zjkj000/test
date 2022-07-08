import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet,View,Image,Alert,Text,TouchableOpacity,ScrollView} from 'react-native';
import { Layout, ViewPager } from '@ui-kitten/components';
import http from '../../../utils/http/request'
import Loading from '../../../utils/loading/Loading'
import { useNavigation } from "@react-navigation/native";
import RenderHTML from 'react-native-render-html';
import Toast from '../../../utils/Toast/Toast'

export default function Paper_ShowCorrected(props) {
    const navigation = useNavigation();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const shouldLoadComponent = (index) => index === selectedIndex;
    const [message, setmessage] = useState('');
    const [data, setData] = useState([]);
    const [dataNum,setDataNum] = useState(1);
    const [success,setsuccess]=useState(false)
    
    useEffect(() => {
        getData();
        navigation.setOptions({title:props.route.params.papername})
      },selectedIndex)
      
      //getData()函数是为了获取试题资源，和学生之前可能作答的结果   得到之后设置状态success 是否成功  data 具体试题数据  dataNum题目总数  
     function  getData() {
        const data_url = global.constants.baseUrl+"studentApp_getMarkedJob.do"
        const data_params ={
          learnPlanId :props.route.params.learnId,
          userName : global.constants.userName,
          learnPlanType :props.route.params.learnPlanType?props.route.params.learnPlanType:'paper',
        }
        if(!success){
            http.get(data_url,data_params).then((resStr)=>{
                  let data_resJson = JSON.parse(resStr);
                      setData(data_resJson.data)
                      setDataNum(data_resJson.data.length)
                      setmessage(data_resJson.message)
                      setsuccess(data_resJson.success)
                })
          }
          
      }
      
      function loading(success){
        if(!success){
            return(
              <Layout style={styles.tab} level='2'>
                <Loading show='true' color='#59B9E0'/>
              </Layout> )
          }else{ return '' }
        }
         

    return (
      <ViewPager  style={{backgroundColor:'#fff',borderTopColor:'#000000',borderTopWidth:0.5}}
              shouldLoadComponent={shouldLoadComponent} selectedIndex={selectedIndex} 
              onSelect={index => setSelectedIndex(index)}>
            
            {/* 根据这套题的data使用map遍历加载 */}
            {
              (success)&&data.map(function(Item,index){
                return (
                  // 每个题目都是一页，都需要一个layout
                  // 每一个layout里面都是有左右两张图片，绝对定位悬浮在页面上面，getTimu函数是加载题目数据。
                  <Layout key={index} style={styles.tab} level='2'>
                  
                   {/* 左滑图片 */}
                    <TouchableOpacity   style={{position:'absolute',left:10,top:"45%",zIndex:99}}   onPress={()=>{
                        const newindex =selectedIndex-1;
                        if(newindex==-1){
                          Toast.showInfoToast('已经是第一题',1000)
                          }
                          else{
                            setSelectedIndex(newindex)
                          }
                    }}>
                      <Image source={require('../../../assets/image3/zuo_03.png')}></Image>
                    </TouchableOpacity>
                  
                   {/* 右滑图片 */}
                    <TouchableOpacity  style={{position:'absolute',right:10,top:"45%",zIndex:99}} onPress={()=>{
                        const newindex =selectedIndex+1;
                        if(newindex==dataNum){
                          Toast.showInfoToast('已经是最后一题',1000);}
                        else{
                          setSelectedIndex(newindex)
                        }
                    }}>
                      <Image source={require('../../../assets/image3/you_03.png')}></Image>
                    </TouchableOpacity>
                    {/* 题目内容 */}
                    <ScrollView  style={{paddingLeft:15,backgroundColor:'#fff'}}>
                        {/* 题目名称 */}
                        <View style={{backgroundColor:'#fff'}}>
                            <Text style={styles.Titletext}>[{Item.typeName}]</Text>
                            <View style={{position:'absolute',right:20,top:10,flexDirection:'row'}}>
                              <Text style={{color:'#59B9E0',fontSize:15}}> {selectedIndex+1}</Text>  
                              <Text style={{fontSize:15}}> / {dataNum}</Text>
                            </View>
                        </View>
                        <RenderHTML source={{html:Item.tiMian}} 
                                    tagsStyles={{
                                                img:{
                                                    flexDirection:'row'
                                                },
                                                p:{
                                                    flexDirection:'row'
                                                }
                                            }}
                                    />
                        <Text style={styles.Titletext}>[参考答案]</Text>
                        {Item.standardAnswer==''?(<Text>略</Text>):(<RenderHTML source={{html:Item.standardAnswer}}></RenderHTML>)}
                        <Text style={styles.Titletext}>[解析]</Text>
                        {Item.analysis==''?(<Text >略</Text>):(<RenderHTML source={{html:Item.analysis}}></RenderHTML>)}
                        <Text style={styles.Titletext}>[你的答案]</Text>
                        {Item.stuAnswer==''?(<Text >未答</Text>):(<RenderHTML source={{html:Item.stuAnswer}}></RenderHTML>)}
                        {(Item.standardAnswer!='******'&&Item.analysis!='******')?(
                          <View style={{flexDirection:'row',marginTop:20}}>
                            <View style={{flexDirection:'row'}}>
                              <Image source={require('../../../assets/stuImg/score.png')}></Image>
                              <Text style={{fontSize:20}}>满分:{Item.fullScore}</Text>
                            </View>
                            <View style={{flexDirection:'row',marginLeft:30}}>
                              <Image source={require('../../../assets/stuImg/avr.png')}></Image>
                              <Text style={{fontSize:20}}>得分:{Item.score}</Text>
                            </View>
                            <View style={{flexDirection:'row',marginLeft:30}}>
                              {Item.statusImage=='right.png'?(<Image source={require('../../../assets/stuImg/right.png')}></Image>):
                                Item.statusImage=='errorright.png'?(<Image source={require('../../../assets/stuImg/errorright.png')}></Image>):
                                Item.statusImage=='error.png'?(<Image source={require('../../../assets/stuImg/error.png')}></Image>):<></>}
                            </View>
                        </View>
                        ):(<></>)}
                        

                        <View style={{height:50}}></View>

                    </ScrollView>
                  </Layout>
                )
              }
              )
            }
            {/* 每道题都有提交页面 ，当没有题目的时候显示加载页面*/}
            {loading(success)}
      </ViewPager>);
  };
const styles = StyleSheet.create({
  tab: {
    height: "100%",
  },
  Titletext:{
    fontWeight:'bold',
    color:	'#000000',
    fontSize: 20,
    marginTop:10,
    marginBottom:10
  },
  text:{
    color:	'#003030',
  }
  
});