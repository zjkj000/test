import React,{useState,useEffect} from 'react';
import { StyleSheet,View,Image,Alert,Text,TouchableOpacity} from 'react-native';
import { Layout, ViewPager } from '@ui-kitten/components';
import Answer_single from './Answer_type/Answer_single';
import Answer_read from './Answer_type/Answer_read';
import Answer_judgement from './Answer_type/Answer_judgment';
import Answer_subjective from './Answer_type/Answer_subjective';
import Answer_multiple from './Answer_type/Answer_multiple';
import Submit from './Answer_type/Submit';
import http from '../../../utils/http/request'
import Loading from '../../../utils/loading/Loading'



//这个页面是 获取题目的页面
export default function ViewPager_ToDo() {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState([]);
  const [dataNum,setDataNum] = useState(0);
  const [learnPlanId,setlearnPlanId] = useState('d58b793d-103e-43b3-880d-61217aee6fc0');
  useEffect(() => {
    getData();
  });
     //    getData()函数是为了获取试题资源，得到之后设置状态success 是否成功  data 具体试题数据  dataNum题目总数  
function  getData() {
      // try {
      //   // 注意这里的await语句，其所在的函数必须有async关键字声明
      //   let response = await fetch("http://www.cn901.net:8111/AppServer/ajax/studentApp_getJobDetails.do?learnPlanId=1b2a59d2-8990-4672-a97b-124a96a7f8c8&userName=ming5059&callback=ha");
      //   const responseJson = await response.text();
      //   setSuccess(eval("("+responseJson.substring(2)+")").success);
      //   if(!success){
      //   setData(eval("("+responseJson.substring(2)+")").data);
      //   setDataNum(eval("("+responseJson.substring(2)+")").data.length);
      //   }
      //    return responseJson;
      // } catch(error) {
      //   console.error(error);
      // }
      const url = 
            "http://"+
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/studentApp_getJobDetails.do"
      const params ={
              learnPlanId : '1b2a59d2-8990-4672-a97b-124a96a7f8c8',
              userName : 'ming5059'
            }
      if(success!=true){
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            setSuccess(resJson.success);
            setData(resJson.data);
            setDataNum(resJson.data.length);
          })
        } 
    }

function getTiMu(Item,index){
      switch(Item.baseTypeId){
        //在调用题目  模板时，需要传入  sum代表总题数，   num代表当前题目索引，  datasource 代表该题数据
        case'101': return <Answer_single  sum={dataNum} num={index} datasource={Item}/>;
        case'102': return <Answer_multiple  sum={dataNum} num={index} datasource={Item}/>;
        case'103': return <Answer_judgement   sum={dataNum} num={index} datasource={Item}/>;
        case'104': return <Answer_subjective  sum={dataNum} num={index} datasource={Item}/>;
        case'106': return <Answer_subjective  sum={dataNum} num={index} datasource={Item}/>;
        case'108': return <Answer_read sum={dataNum} num={index} datasource={Item}  />;
        default  : return '';}
    }
    // 这个函数是为了判断是否有数据，要是没有数据的话显示loading页面，有数据的话显示的是试题+ 最后的提交作业页面
function loading(success){
    if(success!=false){
      return(
        <Layout style={styles.tab} level='2'>
            <Submit paperId={learnPlanId}/>
          </Layout>  
        )
    }else{
      return(
        <Layout style={styles.tab} level='2'>
          <Loading show='true' color='#59B9E0'/>
        </Layout>  )
    }
}
  return (
    <ViewPager selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)}>  
          {/* 根据这套题的data使用map遍历加载 */}
          {
            data.map(function(item,index){
              return (
                // 每个题目都是一页，都需要一个layout
                // 每一个layout里面都是有左右两张图片，绝对定位悬浮在页面上面，getTimu函数是加载题目数据。
                <Layout key={index} style={styles.tab} level='1'>
                  <Image style={{position:'absolute',left:5,top:"45%"}} onPress={()=>alert('11')} source={require('../../../assets/image3/zuo_03.png')}></Image>
                  <Image style={{position:'absolute',right:5,top:"45%"}} source={require('../../../assets/image3/you_03.png')}></Image>
                  {getTiMu(item,index)}
                </Layout>
              )
            }
            )
          }
          {/* 每道题都有提交页面 ，当没有题目的时候显示加载页面*/}
          {loading(success)}
      </ViewPager>
    
  );
};

const styles = StyleSheet.create({
  tab: {
    height: "100%",
  },
});