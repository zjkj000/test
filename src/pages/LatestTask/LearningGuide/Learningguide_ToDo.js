import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet,View,Image,Alert,Text,TouchableOpacity} from 'react-native';
import { Layout, ViewPager } from '@ui-kitten/components';
import LG_readContainer from './Resource_type/LG_read';
import LG_judgementContainer from './Resource_type/LG_judgment';
import LG_subjectiveContainer from './Resource_type/LG_subjective';
import LG_multipleContainer from './Resource_type/LG_multiple';
import http from '../../../utils/http/request'
import Loading from '../../../utils/loading/Loading'
import { useNavigation } from "@react-navigation/native";
import RightMenu from './Resource_type/RightMenu';
import LG_singleContainer from './Resource_type/LG_single';
import Toast from '../../../utils/Toast/Toast';
import PaperContainer from '../LearningGuide/Resource_type/Paper'
import MusicContainer from '../LearningGuide/Resource_type/Music'
import PPTContainer from '../LearningGuide/Resource_type/PPT'
import VideoContainer from '../LearningGuide/Resource_type/Video'
import ShowImageContainer from '../LearningGuide/Resource_type/ShowImage'
import WordContainer from '../LearningGuide/Resource_type/Word'

//这个页面是 获取题目的页面
export default function Paper_ToDo(props) {

  const navigation = useNavigation();
  const [ischange,setischange] = useState(false)
  const [Stu_answer_i,setStu_answer_i] = useState([]);
  const [Stu_answer,setStu_answer] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const shouldLoadComponent = (index) => index === selectedIndex;
  const [success, setSuccess] = useState(false);
  const [oldStuAnswer_success, setoldStuAnswer_success] = useState(false);
  const [oldAnswerdata, setoldAnswerdata] = useState([]);  //学生历史缓存答案的结果
  const [data, setData] = useState([]);
  const [dataNum,setDataNum] = useState(0);
  const [learnPlanId,setlearnPlanId] = useState(props.route.params.learnId);
  const [status,setstatus] = useState(props.route.params.status);
  const [startdate,setstartdate]=useState('');   //记录总用时
  const [start_date,setstart_date]=useState(''); //记录每道题目用时
  const [date_arr,setdate_arr]=useState([]);
  const [isallObj,setisallObj]= useState([])

    //当learnPlanId改变时候，就要重新加载getData
    useEffect(() => {
      navigation.setOptions({title:props.route.params.papername,
      headerRight:()=>(<RightMenu getselectedindex={setSelectedIndex} learnPlanId={props.route.params.learnId}/>)})
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
        "/AppServer/ajax/studentApp_getCatalog.do"
      const data_params ={
        learnPlanId:'f930226b-1f96-4794-8a13-73f3cf641b6b',//各种题型
        // learnPlanId:'cfc84392-8223-42a4-9126-77557be8e12b',
        // learnPlanId : props.route.params.learnId,
        // userName : 'ming6051', 不需要username
        deviceType:'PAD'
      }
      if(!success){
        http.get(data_url,data_params).then((resStr)=>{
            let data_resJson = JSON.parse(resStr);
            var LearningGuidedata = data;
            let getdatanum = 0;
            let isallObjective =[];
            //i是最外层的   遍历环节
            for(var i = 0; i<data_resJson.json.data.length;i++){
                //j是遍历  activityList  的
                for(var j =0;j < data_resJson.json.data[i].activityList.length;j++){
                    getdatanum+=data_resJson.json.data[i].activityList[j].resourceList.length
                    for(var k =0;k<data_resJson.json.data[i].activityList[j].resourceList.length;k++){
                      LearningGuidedata.push(data_resJson.json.data[i].activityList[j].resourceList[k])
                      if(data_resJson.json.data[i].activityList[j].resourceList[k].resourceType=='01'){
                        isallObjective.push(data_resJson.json.data[i].activityList[j].resourceList[k].baseTypeId)
                      }
                    }
                    
                }
            }
  
            setisallObj(isallObjective)
            setData(LearningGuidedata);
            setDataNum(getdatanum);
            setSuccess(data_resJson.json.success)
          })
      }
      
      // //获取历史答案记录
      // const oldAnswer_url = 
      //   "http://"+
      //   "www.cn901.net" +
      //   ":8111" +
      //   "/AppServer/ajax/studentApp_getstuAnswerLearnPlanList.do"
      // const oldAnswer_params ={
      //     learnPlanId : props.route.params.learnId,
      //     userName : 'ming6051'
      //   }
      // if(!oldStuAnswer_success){
      //     http.get(oldAnswer_url,oldAnswer_params).then((resStr)=>{
      //           let oldAnswer_resJson = JSON.parse(resStr);
      //           if(oldAnswer_resJson.success)
      //           {   //如果获取到数据！设置历史作答记录
      //             var oldAnswerList=[];
      //             oldAnswer_resJson.data.forEach(function(item){
      //               oldAnswerList.push(
      //                 item.stuAnswer
      //               )
      //             })
      //             setoldAnswerdata(oldAnswerList);
      //             setoldStuAnswer_success(true);
      //           }
      //       })
      //     }
    }
    

    //根据data里面的数据类型展示题目。
    function getTiMu(Item,index){
      //console.log(index,Item.resourceType)
      if(Item.resourceType=='01'){
        switch(Item.baseTypeId){
          //在调用题目  模板时，需要传入  sum代表总题数，   num代表当前题目索引，  datasource 代表该题数据
          //                            sum  选择传不传     num 选择传不传     datasource  必须传
          case'101': return <LG_singleContainer       isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}  />;
          case'102': return <LG_multipleContainer     isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
          case'103': return <LG_judgementContainer    isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
          case'104': return <LG_subjectiveContainer   isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
          case'106': return <LG_subjectiveContainer   isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
          case'108': return <LG_readContainer         isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]} />;
          default  : break ;}
      }else if(Item.resourceType=='02'){
            // return  <Text>这里是试卷类型{Item.resourceName}{Item.url}</Text>
                     return(<PaperContainer           isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}/>)
      }else{
          if(Item.resourceType=='03'&&Item.format=='ppt'){
                     return <PPTContainer             isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}/>
          }else if(Item.resourceType=='03'&&Item.format=='video'){
                     return <VideoContainer           isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}/>
          }else if(Item.resourceType=='03'&&Item.format=='image'){
                     return <ShowImageContainer       isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}/>
          }else if(Item.resourceType=='03'&&Item.format=='music'){
                     return <MusicContainer           isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}/>
          }else if(Item.resourceType=='03'&&Item.format=='word'){
                     return <WordContainer            isallObj={isallObj}          submit_status={status}  startdate={startdate} papername={props.route.params.papername}    paperId={learnPlanId} getischange={setischange}   getStu_answer={setStu_answer_i}  sum={dataNum} num={index} datasource={Item} oldAnswer_data={oldAnswerdata[index]}/>
          }
      }

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
    //导学案的提交需要判断类型。  所有类型都要提交作答时间，  只有01（试题）类型需要提交答案
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
        const submit_url = 
          "http://"+
          "www.cn901.net" +
          ":8111" +
          "/AppServer/ajax/studentApp_stuSaveLpAnswer.do?"
        const submit_params ={
          learnPlanId :learnPlanId,
          userName : 'ming6051',
          learnPlanName:props.route.params.papername,
          questionId:data[selectedIndex].questionId ,
          answer:Stu_answer[selectedIndex],
          // answerTime: answerdate,
        }
        // 提交答案
        console.log(submit_url,submit_params)
        // http.get(submit_url,submit_params).then((resStr)=>{
        //   let submit_resJson = JSON.parse(resStr);
        //   console.log('我是导学案TODO页面的提交函数，提交结果之后，接收到的服务器返回的是：',submit_resJson)
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

    //  console.log('正在测试',data)
  return (
    // 
    <ViewPager 
                  swipeEnabled ={false}
                  shouldLoadComponent={shouldLoadComponent} style={{color:'#FFFFFF',borderTopColor:'#000000',borderTopWidth:0.5}} shouldLoadComponent={shouldLoadComponent} selectedIndex={selectedIndex} 
                  onSelect={index => Submit_Stu_answer(index,selectedIndex)}>  

          {/* 根据这套题的data使用map遍历加载 */}
          {
            data.map(function(item,index){
                // console.log('正在测试',index,item)
              return (
                // 每个题目都是一页，都需要一个layout
                // 每一个layout里面都是有左右两张图片，绝对定位悬浮在页面上面，getTimu函数是加载题目数据。
                <Layout key={index} style={styles.tab} level='2'>
                  <TouchableOpacity   style={{position:'absolute',left:10,top:"45%",zIndex:99}}   onPress={()=>{
                      const newindex =selectedIndex-1;
                      if(newindex==-1){
                        Toast.showInfoToast('已经是第一题')
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
                        //Toast.showInfoToast('已经是最后一题') 需要跳转到答题页面
                        Submit_Stu_answer(selectedIndex,selectedIndex);
                        navigation.navigate(
                          {
                            name:"SubmitLearningGuide", 
                            params: {
                                      paperId:learnPlanId,
                                      submit_status:status,
                                      startdate:startdate,
                                      papername:props.route.params.papername,
                                      isallObj:isallObj
                                    },
                            megre:true
                          });
                      }else{
                        Submit_Stu_answer(newindex,selectedIndex);
                       
                      }
                  }}>
                    <Image source={require('../../../assets/image3/you_03.png')}></Image>
                  </TouchableOpacity>
                  
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