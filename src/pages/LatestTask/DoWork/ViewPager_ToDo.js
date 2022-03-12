import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet,View,Image,Alert,Text,TouchableOpacity} from 'react-native';
import { Layout, ViewPager } from '@ui-kitten/components';
import Answer_single from './Answer_type/Answer_single';
import Answer_read from './Answer_type/Answer_read';
import Answer_judgement from './Answer_type/Answer_judgment';
import Answer_subjective from './Answer_type/Answer_subjective';
import Answer_multiple from './Answer_type/Answer_multiple';
import http from '../../../utils/http/request'
import Loading from '../../../utils/loading/Loading'
import { useNavigation } from "@react-navigation/native";

//这个页面是 获取题目的页面
export default function ViewPager_ToDo(props) {

  const navigation = useNavigation();
  const [ischange,setischange] = useState(false)

  const [Stu_answer_i,setStu_answer_i] = useState([]);

  const [Stu_answer,setStu_answer] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const shouldLoadComponent = (index) => index === selectedIndex;
  const [success, setSuccess] = useState(false);
  const [oldStuAnswer_success, setoldStuAnswer_success] = useState(false);
  const [oldAnswerdata, setoldAnswerdata] = useState([]);  //学生历史缓存答案的结果
  const [data, setData] = useState([]);
  const [dataNum,setDataNum] = useState(0);
  const [learnPlanId,setlearnPlanId] = useState(props.navigation.getState().routes[2].params.learnId);
  const [status,setstatus] = useState(props.navigation.getState().routes[2].params.status);
  const [startdate,setstartdate]=useState('');   //记录总用时
  const [start_date,setstart_date]=useState(''); //记录每道题目用时
  const [date_arr,setdate_arr]=useState([]);
  const [end_date,setend_date]=useState();

    //当learnPlanId改变时候，就要重新加载getData
    useEffect(() => {
      setSelectedIndex(props.route.params.selectedindex)
      getData();
      var date = getDate()
      setstartdate(date)  // 记录总的开始时间
      setstart_date(date) //记录每道题的开始时间
    },[props.route.params.selectedindex]);
     
    // 获取时间返回 00::00:00
    function getDate() {
      var date = new Date();
      var hour =  date.getHours().toString();
      var minute = date.getMinutes().toString();
      var seconds = date.getSeconds();
      return hour+':'+minute+':'+seconds
  };
    

    //getData()函数是为了获取试题资源，和学生之前可能作答的结果   得到之后设置状态success 是否成功  data 具体试题数据  dataNum题目总数  
     function  getData() {
      const data_url = 
        "http://"+
        "www.cn901.net" +
        ":8111" +
        "/AppServer/ajax/studentApp_getJobDetails.do"
      const data_params ={
        learnPlanId : props.navigation.getState().routes[2].params.learnId,
        userName : 'ming6051'
      }
      if(!success){
        http.get(data_url,data_params).then((resStr)=>{
            let data_resJson = JSON.parse(resStr);
                setData(data_resJson.data);
                setDataNum(data_resJson.data.length);
                setSuccess(data_resJson.success)
          })
      }
      //获取历史答案记录
      const oldAnswer_url = 
        "http://"+
        "www.cn901.net" +
        ":8111" +
        "/AppServer/ajax/studentApp_getStudentAnswerList.do"
      const oldAnswer_params ={
          
          paperId : props.navigation.getState().routes[2].params.learnId,
          userName : 'ming6051'
        }
      if(!oldStuAnswer_success){
          http.get(oldAnswer_url,oldAnswer_params).then((resStr)=>{
                let oldAnswer_resJson = JSON.parse(resStr);
                
                if(oldAnswer_resJson.success)
                {   //如果获取到数据！设置历史作答记录
                  var oldAnswerList=[];
                  oldAnswer_resJson.data.forEach(function(item){
                    oldAnswerList.push(
                      item.stuAnswer
                    )
                  })
                  setoldAnswerdata(oldAnswerList);
                  setoldStuAnswer_success(true);
                }
            })
          }
    }
    

    //根据data里面的数据类型展示题目。
    function getTiMu(Item,index){
      switch(Item.baseTypeId){
        //在调用题目  模板时，需要传入  sum代表总题数，   num代表当前题目索引，  datasource 代表该题数据
        //                            sum  选择传不传     num 选择传不传     datasource  必须传
        case'101': return <Answer_single          paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}  />;
        case'102': return <Answer_multiple        paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
        case'103': return <Answer_judgement       paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
        case'104': return <Answer_subjective      paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
        case'106': return <Answer_subjective      paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
        case'108': return <Answer_read            paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
        default  : return '';}
    }
    

    // 这个函数是为了判断是否有数据，要是没有数据的话显示loading页面，有数据的话显示的是试题+ 最后的提交作业页面
    function loading(success){
    if(!success){
        return(
          <Layout style={styles.tab} level='2'>
            <Loading show='true' color='#59B9E0'/>
          </Layout> )
      }else{ return '' }
    }


    // 这个函数是为了提交学生的答案，  会先判断答案是否改变了  
    function Submit_Stu_answer(newindex,selectedIndex){
      var answerdate = 0;
      var nowdate = getDate();
      var startdatearr = start_date.split(':')
      var nowdatearr = nowdate.split(':')
      if(nowdatearr[0]<startdatearr[0])nowdatearr[0]+=24
      
      var answerdate_minute =  ((nowdatearr[0]-startdatearr[0]))*60 + (nowdatearr[1]-startdatearr[1]) ; 
      if(nowdatearr[2]<startdatearr[2])answerdate_minute -=1
      //有时候会是-1 解决一下bug   这个跟 导航返回 机制有关系
      answerdate_minute<0?0:answerdate_minute
      if(nowdatearr[2]<startdatearr[2]) nowdatearr[2]+=60
      var answerdate_seconds = (nowdatearr[2]-startdatearr[2]);
      answerdate  = answerdate_minute+':'+ answerdate_seconds 
      var newdate_arr = date_arr;
      newdate_arr[selectedIndex] = answerdate;
      setdate_arr(newdate_arr)
      // 且重置下一道题目 start_date
      
      //判断oldAnswerdata[selectedIndex]  是否和 Stu_answer[selectedIndex] 一样，相等的话就不提交 不同的话在提交
      const answerlist = Stu_answer;
      if(ischange){
        answerlist[selectedIndex] = Stu_answer_i;
        setStu_answer(answerlist)
      }
      
      if(answerlist[selectedIndex]!=oldAnswerdata[selectedIndex]&&ischange){
        console.log('题目序号：',selectedIndex+1,'题目用时',answerdate,'提交的答案:',Stu_answer[selectedIndex])
        // const submit_url = 
        //   "http://"+
        //   "www.cn901.net" +
        //   ":8111" +
        //   "/AppServer/ajax/studentApp_getJobDetails.do"
        // const submit_params ={
        //   learnPlanId :learnPlanId,
        //   stuId : 'ming6051',
        //   questionId:data[selectedIndex].questionId ,
        //   answer:Stu_answer[selectedIndex],
        //   answerTime: answerdate,
        // }
        // http.get(submit_url,submit_params).then((resStr)=>{
        //   let submit_resJson = JSON.parse(resStr);
        // })

        //提交完之后把历史答案改了
        var newoldAnswerdata = oldAnswerdata;
        newoldAnswerdata[selectedIndex]=answerlist[selectedIndex];
        setoldAnswerdata(newoldAnswerdata);
        setischange(false);
      }else{
        setischange(false);
        setstart_date(getDate())
        console.log('题目序号:',selectedIndex+1,'作答结果没有改变')
      }
      //都要翻页
      setstart_date(getDate())
      setSelectedIndex(newindex)
    }


  return (
    // shouldLoadComponent={shouldLoadComponent}
    <ViewPager   selectedIndex={selectedIndex} 
                  onSelect={index => Submit_Stu_answer(index,selectedIndex)}>  
  
          {/* 根据这套题的data使用map遍历加载 */}
          {
            success&&data.map(function(item,index){
              return (
                // 每个题目都是一页，都需要一个layout
                // 每一个layout里面都是有左右两张图片，绝对定位悬浮在页面上面，getTimu函数是加载题目数据。
                <Layout key={index} style={styles.tab} level='2'>
                  <TouchableOpacity   style={{position:'absolute',left:10,top:"45%",zIndex:99}}   onPress={()=>{
              
                      const newindex =selectedIndex-1;
                      if(newindex==-1){
                          alert('已经是第一题');
                          //提交一下答案
                          Submit_Stu_answer(selectedIndex,selectedIndex);
                        }else{ 
                          Submit_Stu_answer(newindex,selectedIndex);
                        }
                        
                  }}>
                    <Image source={require('../../../assets/image3/zuo_03.png')}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity  style={{position:'absolute',right:10,top:"45%",zIndex:99}} onPress={()=>{
                      const newindex =selectedIndex+1;
                      if(newindex==dataNum){
                        //alert('已经是最后一题'); 需要跳转到答题页面
                        Submit_Stu_answer(selectedIndex,selectedIndex);
                        navigation.navigate('SubmitPaper',{paperId:learnPlanId,submit_status:status,startdate:startdate})
                      }else{
                        Submit_Stu_answer(newindex,selectedIndex);
                      }
                  }}>
                    <Image source={require('../../../assets/image3/you_03.png')}></Image>
                  </TouchableOpacity>

                  {oldStuAnswer_success&&getTiMu(item,index)}
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