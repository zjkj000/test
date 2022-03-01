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
export default function ViewPager_ToDo() {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState([]);
  const [dataNum,setDataNum] = useState(0);
  useEffect(() => {
    getData();
  });
     //    getData()函数是为了获取试题资源，得到之后设置状态success 是否成功  data 具体试题数据  dataNum题目总数  
async function  getData() {
      // try {
      //   // 注意这里的await语句，其所在的函数必须有async关键字声明
      //   let response = await fetch("http://www.cn901.net:8111/AppServer/ajax/studentApp_getJobDetails.do?learnPlanId=0a4d30ee-27f7-4e0c-97d5-e28275af5853&userName=ming5059&callback=ha");
      //   const responseJson = await response.text();
      //   setSuccess(eval("("+responseJson.substring(2)+")").success);
      //   if(!success){
      //   setData(eval("("+responseJson.substring(2)+")").data);
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
              learnPlanId : '1d1f265f-c89f-4ed1-b380-b9de3fdc1690',
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
        case'101': return <Answer_single sum={dataNum} num={index} datasource={Item}/>;
        case'102': return <Answer_multiple sum={dataNum} num={index} datasource={Item}/>;
        case'103': return <Answer_judgement sum={dataNum} num={index} datasource={Item}/>;
        case'104': return <Answer_subjective sum={dataNum} num={index} datasource={Item}/>;
        case'106': return <Answer_subjective sum={dataNum} num={index} datasource={Item}/>;
        case'108': return <Answer_read sum={dataNum} num={index} datasource={Item} />;
        default  : return '';}
    }
function loading(success){
    if(success!=false){
      return(
        <Layout style={styles.tab} level='2'>
            <Submit/>
          </Layout>  
        )
    }else{
      return(
        <Layout style={styles.tab} level='2'>
          <Loading show={true}/>
        </Layout>  )
    }
}
  return (
    <ViewPager selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)}>  
      {/* 根据这套题的数据自己加载 */}
          {
            data.map(function(item,index){
              return (
                <Layout style={styles.tab} level='1'>
                  <Image style={{position:'absolute',left:5,top:"45%"}} onPress={()=>alert('11')} source={require('../../../assets/image3/zuo_03.png')}></Image>
                  <Image style={{position:'absolute',right:5,top:"45%"}} source={require('../../../assets/image3/you_03.png')}></Image>
                  {getTiMu(item,index)}
                </Layout>
              )
            }
            )
          }
      {/* 每道题都有提交页面 */}
          {loading(success)}
      </ViewPager>
    
  );
};

const styles = StyleSheet.create({
  tab: {
    height: "100%",
  },
});