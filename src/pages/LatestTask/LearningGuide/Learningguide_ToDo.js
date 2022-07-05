import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    Image,
    Alert,
    Text,
    TouchableOpacity,BackHandler
} from "react-native";
import { Layout, ViewPager } from "@ui-kitten/components";
import LG_readContainer from "./Resource_type/LG_read";
import LG_judgementContainer from "./Resource_type/LG_judgment";
import LG_subjectiveContainer from "./Resource_type/LG_subjective";
import LG_multipleContainer from "./Resource_type/LG_multiple";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";
import { useNavigation } from "@react-navigation/native";
import RightMenu from "./Resource_type/RightMenu";
import LG_singleContainer from "./Resource_type/LG_single";
import Toast from "../../../utils/Toast/Toast";
import PaperContainer from "../LearningGuide/Resource_type/Paper";
import MusicContainer from "../LearningGuide/Resource_type/Music";
import PPTContainer from "../LearningGuide/Resource_type/PPT";
import VideoContainer from "../LearningGuide/Resource_type/Video";
import ShowImageContainer from "../LearningGuide/Resource_type/ShowImage";
import WordContainer from "../LearningGuide/Resource_type/Word";
import { screenHeight, screenWidth } from "../../../utils/Screen/GetSize";

//这个页面是 获取题目的页面
export default function Paper_ToDo(props) {
    const navigation = useNavigation();
    const [ischange, setLG_ischange] = useState(false);
    const [Stu_answer_i, setStu_LG_answer_i] = useState([]);
    const [Stu_answer, setStu_answer] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState();
    const shouldLoadComponent = (index) => index === selectedIndex;
    const [success, setSuccess] = useState(false);
    const [oldStuAnswer_success, setoldStuAnswer_success] = useState(false);
    const [oldAnswerdata, setoldAnswerdata] = useState([]); //学生历史缓存答案的结果
    const [data, setData] = useState([]);
    const [dataNum, setDataNum] = useState(0);
    const [learnPlanId, setlearnPlanId] = useState(props.route.params.learnId);
    const [status, setstatus] = useState(props.route.params.status);
    const [startdate, setstartdate] = useState(getDate()); //记录总用时  总用时的开始时间
    const [start_date, setstart_date] = useState(getDate()); //记录每道题目用时   每道题的开始时间
    const [date_arr, setdate_arr] = useState([]); //记录每道题目 用时    时间数组
    const [isallObj, setisallObj] = useState([]);

    //当learnPlanId改变时候，就要重新加载getData
    useEffect(() => {
        setSelectedIndex(props.route.params.selectedindex);
        getData();
      return ()=>{
        changestatus()
      }
        // var date = getDate()
        // setstartdate(date)  // 记录总的开始时间
        // setstart_date(date) //记录每道题的开始时间
    }, [props.route.params.selectedindex]);

    function changestatus(){
        const url = global.constants.baseUrl+"studentApp_deleteAccessControl.do"
        const params = {studentID:global.constants.userName};
          http.get(url, params).then((resStr) => {
          })
        
      }
    // 获取时间返回 00::00:00
    function getDate() {
        var date = new Date();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var seconds = date.getSeconds();
        return hour + ":" + minute + ":" + seconds;
    }

    //getData()函数是为了获取导学案内容，和学生之前可能作答的结果   得到之后设置状态success 是否成功  data 具体试题数据  dataNum题目总数
    function getData() {
        const data_url = global.constants.baseUrl+"studentApp_getCatalog.do";
        const data_params = {
            learnPlanId: learnPlanId, //各种题型
            deviceType: "PAD",
        };
        if (!success) {
            http.get(data_url, data_params).then((resStr) => {
                let data_resJson = JSON.parse(resStr);
                var LearningGuidedata = data;
                let getdatanum = 0;
                let isallObjective = [];
                //i是最外层的   遍历环节
                for (var i = 0; i < data_resJson.json.data.length; i++) {
                    //j是遍历  activityList  的
                    for (
                        var j = 0;
                        j < data_resJson.json.data[i].activityList.length;
                        j++
                    ) {
                        getdatanum +=
                            data_resJson.json.data[i].activityList[j]
                                .resourceList.length;
                        for (
                            var k = 0;
                            k <
                            data_resJson.json.data[i].activityList[j]
                                .resourceList.length;
                            k++
                        ) {
                            LearningGuidedata.push(
                                data_resJson.json.data[i].activityList[j]
                                    .resourceList[k]
                            );
                            if (
                                data_resJson.json.data[i].activityList[j]
                                    .resourceList[k].resourceType == "01"
                            ) {
                                isallObjective.push(
                                    data_resJson.json.data[i].activityList[j]
                                        .resourceList[k].baseTypeId
                                );
                            }
                        }
                    }
                }

                setisallObj(isallObjective);
                setData(LearningGuidedata);
                setDataNum(getdatanum);
                setSuccess(data_resJson.json.success);
            });
        }

        //获取历史导学案作答记录
        const oldAnswer_url = global.constants.baseUrl+"studentApp_getstuAnswerLearnPlanList.do";
        const oldAnswer_params = {
            learnPlanId: learnPlanId,
            userName: global.constants.userName,
        };

        if (!oldStuAnswer_success) {
            http.get(oldAnswer_url, oldAnswer_params).then((resStr) => {
                let oldAnswer_resJson = JSON.parse(resStr);
                if (oldAnswer_resJson.success) {
                    //如果获取到数据！设置历史作答记录
                    var oldAnswerList = [];
                    oldAnswer_resJson.data.forEach(function (item) {
                        oldAnswerList.push(item.stuAnswer);
                    });
                    setoldAnswerdata(oldAnswerList);
                    setoldStuAnswer_success(true);
                }
            });
        }
    }

    //根据data里面的数据类型展示导学案内容
    function getTiMu(Item, index) {
        //console.log(index,Item.resourceType)
        if (Item.resourceType == "01") {
            switch (Item.baseTypeId) {
                //在调用题目  模板时，需要传入  sum代表总题数，   num代表当前题目索引，  datasource 代表该题数据
                //                            sum  选择传不传     num 选择传不传     datasource  必须传
                case "101":
                    return (
                        <LG_singleContainer
                            isallObj={isallObj}
                            LG_submit_status={status}
                            startdate={startdate}
                            papername={props.route.params.papername}
                            learnPlanId={learnPlanId}
                            getLG_ischange={setLG_ischange}
                            getStu_LG_answer={setStu_LG_answer_i}
                            sum={dataNum}
                            num={index}
                            datasource={Item}
                            oldLG_Answer_data={oldAnswerdata[index]}
                        />
                    );
                case "102":
                    return (
                        <LG_multipleContainer
                            isallObj={isallObj}
                            LG_submit_status={status}
                            startdate={startdate}
                            papername={props.route.params.papername}
                            learnPlanId={learnPlanId}
                            getLG_ischange={setLG_ischange}
                            getStu_LG_answer={setStu_LG_answer_i}
                            sum={dataNum}
                            num={index}
                            datasource={Item}
                            oldLG_Answer_data={oldAnswerdata[index]}
                        />
                    );
                case "103":
                    return (
                        <LG_judgementContainer
                            isallObj={isallObj}
                            LG_submit_status={status}
                            startdate={startdate}
                            papername={props.route.params.papername}
                            learnPlanId={learnPlanId}
                            getLG_ischange={setLG_ischange}
                            getStu_LG_answer={setStu_LG_answer_i}
                            sum={dataNum}
                            num={index}
                            datasource={Item}
                            oldLG_Answer_data={oldAnswerdata[index]}
                        />
                    );
                case "104":
                    return (
                        <LG_subjectiveContainer
                            isallObj={isallObj}
                            LG_submit_status={status}
                            startdate={startdate}
                            papername={props.route.params.papername}
                            learnPlanId={learnPlanId}
                            getLG_ischange={setLG_ischange}
                            getStu_LG_answer={setStu_LG_answer_i}
                            sum={dataNum}
                            num={index}
                            datasource={Item}
                            oldLG_Answer_data={oldAnswerdata[index]}
                        />
                    );
                case "106":
                    return (
                        <LG_subjectiveContainer
                            isallObj={isallObj}
                            LG_submit_status={status}
                            startdate={startdate}
                            papername={props.route.params.papername}
                            learnPlanId={learnPlanId}
                            getLG_ischange={setLG_ischange}
                            getStu_LG_answer={setStu_LG_answer_i}
                            sum={dataNum}
                            num={index}
                            datasource={Item}
                            oldLG_Answer_data={oldAnswerdata[index]}
                        />
                    );
                case "108":
                    return (
                        <LG_readContainer
                            isallObj={isallObj}
                            LG_submit_status={status}
                            startdate={startdate}
                            papername={props.route.params.papername}
                            learnPlanId={learnPlanId}
                            getLG_ischange={setLG_ischange}
                            getStu_LG_answer={setStu_LG_answer_i}
                            sum={dataNum}
                            num={index}
                            datasource={Item}
                            oldLG_Answer_data={oldAnswerdata[index]}
                        />
                    );
                default:
                    break;
            }
        } else if (Item.resourceType == "02") {
            // return  <Text>这里是试卷类型{Item.resourceName}{Item.url}</Text>
            return (
                <PaperContainer
                    isallObj={isallObj}
                    submit_status={status}
                    startdate={startdate}
                    papername={props.route.params.papername}
                    learnPlanId={learnPlanId}
                    sum={dataNum}
                    num={index}
                    datasource={Item}
                />
            );
        } else {
            if (Item.resourceType == "03" && Item.format == "ppt") {
                return (
                    <PPTContainer
                        isallObj={isallObj}
                        submit_status={status}
                        startdate={startdate}
                        papername={props.route.params.papername}
                        learnPlanId={learnPlanId}
                        sum={dataNum}
                        num={index}
                        datasource={Item}
                    />
                );
            } else if (Item.resourceType == "03" && Item.format == "video") {
                return (
                    <VideoContainer
                        isallObj={isallObj}
                        submit_status={status}
                        startdate={startdate}
                        papername={props.route.params.papername}
                        learnPlanId={learnPlanId}
                        sum={dataNum}
                        num={index}
                        datasource={Item}
                    />
                );
            } else if (Item.resourceType == "03" && Item.format == "image") {
                return (
                    <ShowImageContainer
                        isallObj={isallObj}
                        submit_status={status}
                        startdate={startdate}
                        papername={props.route.params.papername}
                        learnPlanId={learnPlanId}
                        sum={dataNum}
                        num={index}
                        datasource={Item}
                    />
                );
            } else if (Item.resourceType == "03" && Item.format == "music") {
                return (
                    <MusicContainer
                        isallObj={isallObj}
                        submit_status={status}
                        startdate={startdate}
                        papername={props.route.params.papername}
                        learnPlanId={learnPlanId}
                        sum={dataNum}
                        num={index}
                        datasource={Item}
                    />
                );
            } else if (Item.resourceType == "03" && Item.format == "word") {
                return (
                    <WordContainer
                        isallObj={isallObj}
                        submit_status={status}
                        startdate={startdate}
                        papername={props.route.params.papername}
                        learnPlanId={learnPlanId}
                        sum={dataNum}
                        num={index}
                        datasource={Item}
                    />
                );
            } else if (Item.resourceType == "03" && Item.format == "pdf") {
                return (
                    <WordContainer
                        isallObj={isallObj}
                        submit_status={status}
                        startdate={startdate}
                        papername={props.route.params.papername}
                        learnPlanId={learnPlanId}
                        sum={dataNum}
                        num={index}
                        datasource={Item}
                    />
                );
            }
        }
    }

    // 这个函数是为了判断是否有数据，要是没有数据的话显示loading页面，有数据的话显示的是导学案内容
    function loading(success) {
        if (!success) {
            return (
                <Layout style={styles.tab} level="2">
                    <Loading show="true" color="#59B9E0" />
                </Layout>
            );
        } else {
            return "";
        }
    }

    // 这个函数是为了提交学生的答案，  会先判断答案是否改变了
    //导学案的提交需要判断类型。  所有类型都要提交作答时间，  只有01（试题）类型需要提交答案
    function Submit_Stu_answer(newindex, selectedIndex) {
        let change_status = 0;
        // 处理状态
        if (status == "1") {
            change_status = 1;
        } else {
            change_status = 3;
        }

        //处理时间
        let answerdate = 0;
        let nowdate = getDate();
        let startdatearr = start_date.split(":");
        let nowdatearr = nowdate.split(":");

        //判断小时  如果过了一天 就要提交的时候 + 24
        if (parseInt(nowdatearr[0]) < parseInt(startdatearr[0]))
            nowdatearr[0] = parseInt(nowdatearr[0]) + 24;
        //处理分钟
        let answerdate_minute =
            (parseInt(nowdatearr[0]) - parseInt(startdatearr[0])) * 60 +
            (parseInt(nowdatearr[1]) - parseInt(startdatearr[1]));
        // 结束的秒数 小于 开始的秒数，就处理秒的时候秒多加1 分钟减1
        if (parseInt(nowdatearr[2]) < parseInt(startdatearr[2])) {
            answerdate_minute = parseInt(answerdate_minute) - 1;
            nowdatearr[2] = parseInt(nowdatearr[2]) + 60;
        }
        let answerdate_seconds =
            parseInt(nowdatearr[2]) - parseInt(startdatearr[2]);
        answerdate =
            (parseInt(answerdate_minute) * 60 + parseInt(answerdate_seconds)) *
            1000;
        let newdate_arr = date_arr;
        newdate_arr[selectedIndex] = answerdate;
        setdate_arr(newdate_arr);

        // 且重置下一道题目 start_date
        if (data[selectedIndex].resourceType != "01") {
            //是导学案的话就提交作答时间   毫秒值   累加在服务器端做
            const submitResource_url = global.constants.baseUrl+"studentApp_stuSaveLearnResTime.do";
            const submitResource_params = {
                learnPlanId: learnPlanId,
                userName: global.constants.userName,
                contentId: data[selectedIndex].resourceId,
                useTime: newdate_arr[selectedIndex],
            };
            http.get(submitResource_url, submitResource_params).then(
                (resStr) => {}
            );
        } else {
            //else  处理的是提交试题类型作答结果

            //判断oldAnswerdata[selectedIndex]  是否和 Stu_answer[selectedIndex] 一样，相等的话就不提交 不同的话在提交
            const answerlist = Stu_answer;
            //ischange 是试题部分 传过来的告知  作答结果是否改变  如果改变  这个页面记录的新的学生答案就会变   就会触发提交答案
            if (ischange) {
                answerlist[selectedIndex] = Stu_answer_i;
                setStu_answer(answerlist);
            }

            if (
                answerlist[selectedIndex] != oldAnswerdata[selectedIndex] &&
                ischange
            ) {
                // console.log('题目序号：',selectedIndex+1,'题目用时',answerdate,'提交的答案:',Stu_answer[selectedIndex])
                const submit_url = global.constants.baseUrl+"studentApp_stuSaveLpAnswer.do";
                const submit_params = {
                    learnPlanId: learnPlanId,
                    userName: global.constants.userName,
                    learnPlanName: props.route.params.papername,
                    questionId: data[selectedIndex].resourceId,
                    answer: Stu_answer[selectedIndex],
                    status: change_status,
                };
                // 提交答案
                // 现在导学案要做的是  提交答案（根据情况）  +  提交作答时间（必须交）
                http.get(submit_url, submit_params).then((resStr) => {
                    let submit_resJson = JSON.parse(resStr);
                });

                //提交完之后把历史答案改了
                var newoldAnswerdata = oldAnswerdata;
                newoldAnswerdata[selectedIndex] = answerlist[selectedIndex];
                setoldAnswerdata(newoldAnswerdata);
                setLG_ischange(false);
            } else {
                setLG_ischange(false);
                setstart_date(getDate());
                // console.log('题目序号:',selectedIndex+1,'作答结果没有改变')
            }
        }
        // 试题交答案，资源交时长  之后都要翻页
        setstart_date(getDate()); //记录的是进入下一题的时间
        setSelectedIndex(newindex);
    }

    return (
        <View>
            <View style={{height:50,flexDirection:'row',alignItems:"center",backgroundColor:'#fff',width:screenWidth,justifyContent:'center'}}>
                <TouchableOpacity style={{position:'absolute',left:0}} onPress={()=>{props.navigation.goBack()}}>
                     <Image style={{width:30,height:30}} source={require('../../../assets/TakePicturesAndAssignWork/goback.png')}></Image>
                </TouchableOpacity>
               
                <Text style={{fontSize:17,color:'#59B9E0'}}>{props.route.params.papername.length>6?props.route.params.papername.substring(0,6)+"...":props.route.params.papername}</Text>
                {data.length>0?(
                     <View style={{flexDirection:'row',alignItems:'center',position:"absolute",right:0}}>
                        <Text style={{color:'#59B9E0'}}>{selectedIndex+1}</Text>
                        <Text>/{data.length}</Text>
                        <TouchableOpacity onPress={()=>{
                            Submit_Stu_answer(selectedIndex, selectedIndex)
                            props.navigation.navigate('SubmitLearningGuide',
                                {   learnPlanId:learnPlanId,
                                    submit_status:status,
                                    startdate:startdate,
                                    papername:props.route.params.papername,
                                    isallObj:isallObj})
                            }}>
                            <Image style={{marginRight:8,marginLeft:5}} source={require('../../../assets/image3/look.png')}></Image>
                        </TouchableOpacity>
                        
                        <RightMenu
                            getselectedindex={setSelectedIndex}
                            learnPlanId={props.route.params.learnId}
                            Sub_Stu_answer={Submit_Stu_answer}
                            selectedIndex={selectedIndex}
                        />
                    </View>
                ):(<></>)}
               
              
            </View>
            <ViewPager
                style={{ backgroundColor: "#FFFFFF", borderTopWidth: 0.5,height:screenHeight-50,paddingBottom:5}}
                swipeEnabled={false}
                shouldLoadComponent={shouldLoadComponent}
                selectedIndex={selectedIndex}
                onSelect={(index) => Submit_Stu_answer(index, selectedIndex)}
            >
                {/* 根据这套导学案的data使用map遍历加载 */}
                {data.map(function (item, index) {
                    return (
                        // 每个题目都是一页，都需要一个layout
                        // 每一个layout里面都是有左右两张图片，绝对定位悬浮在页面上面，getTimu函数是加载题目数据。
                        <Layout key={index} style={styles.tab} level="2">
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "45%",
                                    zIndex: 99,
                                }}
                                onPress={() => {
                                    const newindex = selectedIndex - 1;
                                    if (newindex == -1) {
                                        Toast.showInfoToast("已经是第一题", 1000);
                                        //提交一下答案
                                        Submit_Stu_answer(
                                            selectedIndex,
                                            selectedIndex
                                        );
                                    } else {
                                        Submit_Stu_answer(newindex, selectedIndex);
                                    }
                                }}
                            >
                                <Image
                                    source={require("../../../assets/image3/zuo_03.png")}
                                ></Image>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "45%",
                                    zIndex: 99,
                                }}
                                onPress={() => {
                                    const newindex = selectedIndex + 1;
                                    if (newindex == dataNum) {
                                        //Toast.showInfoToast('已经是最后一题') 需要跳转到答题页面
                                        Submit_Stu_answer(
                                            selectedIndex,
                                            selectedIndex
                                        );
                                        Alert.alert('','已经最后一题，确定提交导学案？',[{text:'取消',onPress:()=>{}},{},
                                        {text:'确定',onPress:()=>{
                                                navigation.navigate({
                                                    name: "SubmitLearningGuide",
                                                    params: {
                                                        learnPlanId: learnPlanId,
                                                        submit_status: status,
                                                        startdate: startdate,
                                                        papername:props.route.params.papername,
                                                        isallObj: isallObj,
                                                    },
                                                    megre: true,
                                                });
                                            }}
                                        ])
                                    } else {
                                        Submit_Stu_answer(newindex, selectedIndex);
                                    }
                                }}
                            >
                                <Image
                                    source={require("../../../assets/image3/you_03.png")}
                                ></Image>
                            </TouchableOpacity>

                            {getTiMu(item, index)}
                        </Layout>
                    );
                })}
                {/* 每道题都有提交页面 ，当没有题目的时候显示加载页面*/}
                {loading(success)}
            </ViewPager>
        </View>
       
    );
}

const styles = StyleSheet.create({
    tab: {
        height: "100%",
    },
});
