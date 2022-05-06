import React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TextInput,
    Alert,
    Modal,
    Platform,
    ScrollView,
    Overlay,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { Button } from '@ui-kitten/components';
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../../utils/http/request";
import DateTime from "./DateTime";

import { DatePicker, List, Provider } from '@ant-design/react-native';

import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';
import RenderHtml from 'react-native-render-html';

import Toast from '../../../../utils/Toast/Toast';

import HomeworkPropertyModelContainer from "./HomeworkPropertyModel";


//暂存请求到的试题(定义为二维数组，每一维存放相同类型的试题)
//试题都请求完之后，依次将数据按维存放到state中试题list
var paperListOne = [];  //一维
var paperListTwo = [];  //存放多个paperListOne

var paperListCopy = []; //将paperListTwo二维数组转化为一维数组
//typeAll==count时，调用setState，将paperListCopy赋值给state中的paperList
let typeAll = 0; //试题类型总数
let count = 0; //目前已请求完成多少个类型的试题

let pageNo = 1; //当前第几页
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了

let fetchNum = 0; //请求试题次数

export default function CreateHomeworkContainer(props) {
    // console.log('------函数式props----',props.route.params);
    const paramsData = props.route.params;

    const navigation = useNavigation();

    //将navigation传给HomeworkProperty组件，防止路由出错
    return <CreateHomework navigation={navigation} paramsData={paramsData}/>;
}

class CreateHomework extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paperId: '', //空试卷id

            addPaperFlag: true, //导航“添加试题”是否被选中
            updatePaperFlag: false, //导航“调整顺序”是否被选中
            pushPaperFlag: false, //导航“布置作业”是否被选中

            filterModelVisiblity: false, //设置属性悬浮框是否显示

            paperTypeList: [], //试题库试题类型
            paperList: [], //试题库试题

            selectPaperNum: 0, //已选中试题数目
            //selectFlag: false, //试题是否被选中

            selectPaperIndex: 0, //选中的试题索引
            selectPaperList: [], //添加到试卷中的试题
            baseTypeIdLists: [], //添加到试卷中的试题baseTypeId

            //调整顺序小页面
            updatePaperIndex: 0, //添加到试卷中的试题当前显示的试题索引


            //布置作业小页面
            startTime: '', //开始时间
            endTime: '', //结束时间

            className: '', //选择课堂
            classNameList: [], //班级列表
            classNameVisibility: false, //是否显示课堂列表

            assigntoWho: '0', //布置作业对象 0:班级 1：小组 2:个人

            class: {}, //所选中的课堂对应的班级信息
            classFlag: false, //是否选中班级

            groupList: [], //小组列表
            groupSelected: [], //被选中的小组

            studentsList: [], //个人列表（接口返回的classList、学生信息由字符串拼接）
            studentsListTrans: [], //studentsList中拼接的学生信息挨个提取出
            studentSelected: [], //被选中的学生

            paperObject: {}, //生成的试卷对象


            //网络请求状态
            error: false,
            errorInfo: "",
            isRefresh: false,
            showFoot: 0, //控制foot， 0：隐藏footer 1：已加载完成，没有更多数据 2：正在加载中
        };
    }

    UNSAFE_componentWillMount(){
        if(this.state.paperId == ''){ //调接口，获取paperId
            this.fetchPaperId();
        }
    }

    //获取试卷id
    fetchPaperId = () => {
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_createEmptyPaper.do";
        const params = {
            userName: userId,
            //callback:'ha',
        };

        console.log('-----fetchPaperId-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('--------试卷id------');
                console.log(resJson.data);
                console.log('------------------------');
                this.setState({ paperId: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    componentWillUnmount(){
        console.log('---componentWillUnmount----');
        paperListOne = [];
        paperListTwo = [];
        paperListCopy = [];
        typeAll = 0;
        count = 0;
        fetchNum = 0;
    }

    setModalVisible = (visible) => {
        this.setState({ filterModelVisiblity: visible });   
    }

    //显示设置属性悬浮框
    showFilter = () => {
        const { filterModelVisiblity } = this.state;
        return (
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={filterModelVisiblity}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible(!filterModelVisiblity);
                    }}
                >
                    <View>
                        <Text
                            style={{height: 70, width: 40, right: 0, position: 'absolute'}}
                            onPress={()=>{
                                this.setModalVisible(!filterModelVisiblity);
                        }}></Text>
                    </View>
                    {/**设置属性悬浮框组件   父子结点传参(传方法！！！！) */}
                    <HomeworkPropertyModelContainer 
                        paperTypeList={this.state.paperTypeList} 
                        studyRank={this.props.paramsData.studyRank}
                        studyClass={this.props.paramsData.studyClass}
                        edition={this.props.paramsData.edition}
                        book={this.props.paramsData.book}
                        knowledge={this.props.paramsData.knowledge}

                        channelNameList={this.props.paramsData.channelNameList} //学段名列表（接口数据）
                        studyClassList={this.props.paramsData.studyClassList} //学科列表（接口数据）
                        editionList={this.props.paramsData.editionList} //版本列表（接口数据）
                        bookList={this.props.paramsData.bookList} //教材列表（接口数据）  
                        knowledgeList={this.props.paramsData.knowledgeList} //从接口中返回的数据

                        setAllProperty={this.setAllProperty}
                    />
                </Modal>
        );
    }
    //设置属性悬浮框组件 传递的props方法，用来修改
    setAllProperty = (paramsObj) => {
        //重新修改state有关试题请求的参数，重新请求试题
    }

    //修改导航选中标志(添加试题、调整顺序、布置作业)
    updateFlag = (type , flag) => {
        if(type == 1){  //添加试题
            if(flag == true){ //目前就是添加试题页面
                this.setState({ 
                    updatePaperFlag: false,
                    pushPaperFlag: false,
                })
            }else{
                this.setState({ 
                    addPaperFlag: true,
                    updatePaperFlag: false,
                    pushPaperFlag: false,

                    //selectPaperIndex: 0, //选中的试题索引
                })
            }
        }else if(type == 2){ //调整试题顺序
            if(flag == true){
                this.setState({ 
                    addPaperFlag: false,
                    pushPaperFlag: false,
                })
            }else{
                // if(this.state.selectPaperList.length > 0){
                    this.setState({ 
                        addPaperFlag: false,
                        updatePaperFlag: true,
                        pushPaperFlag: false,
    
                        updatePaperIndex: 0, //添加到试卷中的试题当前显示的试题索引
                    })
                // }else{
                //     console.log('暂无选中试题');
                //     Toast.showInfoToast('暂无选中试题');
                //     Toast.showSuccessToast('-------');
                //     console.log('暂无选中试题1111');
                // }
            }
        }else if(type == 3){ //布置作业
            // const { paperObject } = this.state;
            // if(JSON.stringify(paperObject) == "{}"){ //生成试卷对象
            //     this.createPaperObject();
            // }
            if(flag == true){
                this.setState({ 
                    addPaperFlag: false,
                    updatePaperFlag: false,
                })
            }else{
                this.createPaperObject(); //生成试卷对象
                this.setState({ 
                    addPaperFlag: false,
                    updatePaperFlag: false,
                    pushPaperFlag: true,
                })
            }
        }
    }

    //生成试卷对象
    createPaperObject = () => {
        const { selectPaperList , baseTypeIdLists , paperId } = this.state;
        let papers = []; //
        let j = 0;
        let bigId = 1;
        let smallId = 0;
        //console.log('**********createPaperObject********', Date.parse(new Date()));
        for(let i = 0 ; i < baseTypeIdLists.length ; i++){ //baseTypeIdLists和selectPaperList中的baseTypeId顺序一致
            // console.log('****baseTypeIdLists**i*',baseTypeIdLists[i] , i);
            for(j ; j < selectPaperList.length ; j++){
                // console.log('***selectPaperList[j]**j*',selectPaperList[j].baseTypeId , j);
                if(selectPaperList[j].baseTypeId.indexOf(baseTypeIdLists[i]) < 0){
                    bigId++;
                    smallId = 1;
                }else{
                    smallId++;
                }
                papers.push({
                    questionId: selectPaperList[j].questionId,
                    typeName: selectPaperList[j].typeName,
                    typeId: selectPaperList[j].typeId,
                    baseTypeId: selectPaperList[j].baseTypeId,
                    questionTextControl: selectPaperList[j].questionTextControl,
                    pointCode: selectPaperList[j].pointCode,
                    pointName: selectPaperList[j].pointName,
                    score: selectPaperList[j].score,
                    questionDifficult: selectPaperList[j].questionDifficult,
                    bigId: bigId,
                    smallId: smallId,
                });
                if(selectPaperList[j].baseTypeId.indexOf(baseTypeIdLists[i]) < 0){ //新的baseTypeId          
                    j++;
                    break ;
                }
            }
        }
        // console.log('*******试卷题目***********');
        // for(let i = 0 ; i < papers.length ; i++){
        //     console.log(papers[i]);
        // }
        // console.log('**************************');
        let paperObj = { data: papers , paperId: paperId }
        console.log('*************paperObject****type***',typeof(paperObj));
        console.log(paperObj);
        console.log('**************************');
        this.setState({ paperObject: paperObj });
    }

    //布置试卷 设置接口参数
    setPushPapersParams = () => {
        const { assigntoWho ,  groupSelected , studentSelected , studentsList } = this.state;
        const classSecleted = this.state.class;
        var keTangId = classSecleted.keTangId; //课堂id
        var keTangName = classSecleted.keTangName; //课堂名
        var classIdOrGroupId = classSecleted.classId;  //班级id
        var classOrGroupName = classSecleted.className; //班级名(接口返回的班级名后面自带一个逗号,)
        var learnType = ''; //作业布置方式 班级、个人70、小组50

        var stuIds = '';
        var stuNames = '';

        var startTime = this.state.startTime;
        var endTime = this.state.endTime;

        if(assigntoWho == '0'){ //布置给班级 （有对应的学生信息需要拼装吗，接口传空值？）
            learnType = '70';
            stuIds = studentsList[0].ids;
            stuNames = studentsList[0].name;
            // console.log('**********studentsList******',stuIds);
            // console.log('**********studentsList.length******',studentsList.length);
            // return;
        }else if(assigntoWho == '1'){ //布置给小组 拼装小组id、小组名 学生id、学生姓名
            learnType = '50';
            classIdOrGroupId = '';
            classOrGroupName = '';

            for(let i = 0 ; i < groupSelected.length ; i++){
                classIdOrGroupId = classIdOrGroupId + ';' + groupSelected[i].id;
                classOrGroupName = classOrGroupName + ';' + groupSelected[i].value;
                
                stuIds = stuIds + ',' + groupSelected[i].ids;
                stuNames = stuNames + ',' + groupSelected[i].name;
            }
        }else{ //布置给个人
            learnType = '70';
            
            for(let i = 0 ; i < studentSelected.length ; i++){
                stuIds = stuIds + ',' + studentSelected[i].id;
                stuNames = stuNames + ',' + studentSelected[i].name;
            }
        }
        return(
            {
                startTime: startTime,
                endTime: endTime,
                keTangId: keTangId,
                classIdOrGroupId: classIdOrGroupId,
                stuIds: stuIds,
                stuNames: stuNames,
                learnType: learnType,
                keTangName: keTangName,
                classOrGroupName: classOrGroupName,
            }
        );
    }

    //保存试卷 设置接口参数
    setSavePapersParams = () => {
        const paramsData = this.props.paramsData;
        const { paperObject } = this.state;
        var papersJsonStr = JSON.stringify(paperObject); //js对象转化为json字符串
        console.log('*********papersJsonStr*********',typeof(papersJsonStr));
        console.log(papersJsonStr);
        console.log('*******************************')
        return(
            {
                jsonStr: papersJsonStr,
                channelCode: paramsData.studyRankId,
                channelName: paramsData.studyRank,
                subjectCode: paramsData.studyClassId,
                subjectName: paramsData.studyClass,
                textBookCode: paramsData.editionId,
                textBookName: paramsData.edition,
                gradeLevelCode: paramsData.bookId,
                gradeLevelName: paramsData.book,
                pointCode: paramsData.knowledgeCode,
                paperName: paramsData.name,
                introduction: paramsData.introduction,
            }
        );
    }


    //点击“布置作业”页面的确定按钮，即保存且布置试卷
    pushAndSavePaper = () => {
        var pushParamsObj = this.setPushPapersParams();    
        var saveParamsObj = this.setSavePapersParams();
        var allParams = {
            ...pushParamsObj,
            ...saveParamsObj,
            token: global.constants.token,
            assignType: 1, //表示保存+布置
            userName: global.constants.userName,
            paperName: this.props.paramsData.name,
            paperId: this.state.paperId,
            flag: 'save',
        }
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_assignJobToStudents.do";
        const params = {
            ...allParams,
            //callback:'ha',
        };
        console.log('-----pushAndSavePaper-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('****************resJson.success*********', resJson);
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //点击“布置作业”页面的保存按钮，即保存但不布置试卷
    savePaper = () => {
        var saveParamsObj = this.setSavePapersParams();
        console.log('---------saveParamsObj--------');
        console.log(saveParamsObj);
        console.log('------------------------------');
        var allParams = {
            ...saveParamsObj,
            token: global.constants.token,
            assignType: 3, //表示只保存，不布置
            userName: global.constants.userName,
            paperName: this.props.paramsData.name,
            paperId: this.state.paperId,
            flag: 'save',
        }
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_assignJobToStudents.do";
        const params = {
            ...allParams,
            //callback:'ha',
        };
        console.log('-----savePaper-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('****************resJson.success*********', resJson , typeof(resJson));
                console.log('*************************');
                // console.log('****************resJson.success***Type******', resJson.success);
                
                // if(resJson.success){
                //     this.props.navigation.navigate({name: 'Teacher_Home'});
                // }
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //当前页面显示的题目是否添加到试题中(添加试题小页面)
    ifSelected = () => {
        const { selectPaperIndex , selectPaperList , paperList } = this.state;
        let i = 0 ;
        for(i = 0 ; i < selectPaperList.length ; i++){
            if(selectPaperList[i].questionId == paperList[selectPaperIndex].questionId){
                return true;
            }
        }
        if(i >= selectPaperList.length){
            return false;
        }
    }

    //修改选中题目数(添加试题小页面)
    updateSlectNum = (flag) => {

        const { selectPaperIndex , selectPaperList , paperList , paperTypeList } = this.state;
        if(flag == true){ //删除试题
            var index = selectPaperList.indexOf(paperList[selectPaperIndex]); //查询要删除元素的位置
            var selectPaperListCopy = selectPaperList;
            if(index >= 0){
                selectPaperListCopy.splice(index , 1); //删除指定位置元素

                var baseTypeIdList = []; //记录选中题目的baseTypeId个数
                if(selectPaperListCopy.length > 0){
                    var baseTypeIdtemp = selectPaperListCopy[0].baseTypeId;
                    baseTypeIdList.push(baseTypeIdtemp);
                    for(let i = 0 ; i < selectPaperListCopy.length ; i++){ //获取选中题目的baseTypeId个数    
                        if(selectPaperListCopy[i].baseTypeId.indexOf(baseTypeIdtemp) < 0){
                            if(baseTypeIdList.indexOf(selectPaperListCopy[i].baseTypeId) < 0){
                                baseTypeIdList.push(selectPaperListCopy[i].baseTypeId);
                                baseTypeIdtemp = selectPaperListCopy[i].baseTypeId;
                            }
                        }
                    }
                }

                this.setState({
                    selectPaperNum: this.state.selectPaperNum - 1,
                    selectPaperList: selectPaperListCopy,
                    baseTypeIdLists: baseTypeIdList.length > 0 ? baseTypeIdList : [],
                })
            } 
        }else{  //添加试题
            var selectPaperListCopy = selectPaperList;
            selectPaperListCopy.push(paperList[selectPaperIndex]);

            var baseTypeIdList = []; //记录选中题目的baseTypeId个数
            var baseTypeIdtemp = selectPaperListCopy[0].baseTypeId;
            baseTypeIdList.push(baseTypeIdtemp);
            for(let i = 0 ; i < selectPaperListCopy.length ; i++){ //获取选中题目的baseTypeId个数    
                if(selectPaperListCopy[i].baseTypeId.indexOf(baseTypeIdtemp) < 0){
                    if(baseTypeIdList.indexOf(selectPaperListCopy[i].baseTypeId) < 0){
                        baseTypeIdList.push(selectPaperListCopy[i].baseTypeId);
                        baseTypeIdtemp = selectPaperListCopy[i].baseTypeId;
                    }
                }
            }
            console.log('-------baseTypeIdList-----',baseTypeIdList);
            //按照id大小排序
            for(let i = 0 ; i < baseTypeIdList.length ; i++){
                for(let j = i ; j < baseTypeIdList.length ; j++){
                    if(baseTypeIdList[j] < baseTypeIdList[i]){
                        var tempId = baseTypeIdList[i];
                        baseTypeIdList[i] = baseTypeIdList[j];
                        baseTypeIdList[j] = tempId;
                    }
                }
            }
            console.log('-----baseTypeIdList--sort---',baseTypeIdList);

            //调整顺序（相同类型在一块）
            var tempPaperList = [];
            for(let i = 0 ; i < baseTypeIdList.length ; i++){
                // console.log('----试题类型---' , paperTypeList[i]);
                for(let j = 0 ; j < selectPaperListCopy.length ; j++){
                    // console.log('----添加试题类型---' , selectPaperListCopy[j].typeName);
                    if(selectPaperListCopy[j].baseTypeId.indexOf(baseTypeIdList[i]) >= 0
                        || baseTypeIdList[i].indexOf(selectPaperListCopy[j].baseTypeId) >= 0){
                            // console.log('----类型一致-------');
                            tempPaperList.push(selectPaperListCopy[j]);//添加的试题
                    }
                }
            }
 
            this.setState({
                selectPaperNum: this.state.selectPaperNum + 1,
                selectPaperList: tempPaperList,  
                baseTypeIdLists: baseTypeIdList,
            })
        }
    }

    //调整顺序小页面 删除试题
    deletePaperTitle = () => {
        const { updatePaperIndex , selectPaperList } = this.state;
        console.log('------删除添加的试题index----', updatePaperIndex);
        var selectPaperListCopy = selectPaperList;
        if(updatePaperIndex >= 0){
            selectPaperListCopy.splice(updatePaperIndex , 1); //删除指定位置元素
            this.setState({
                selectPaperNum: this.state.selectPaperNum - 1,
                //若删除的是最后一道题，则页面显示selectPaperList最新的最后一道题
                updatePaperIndex: updatePaperIndex == selectPaperList.length ? 
                                                        selectPaperList.length - 1 : updatePaperIndex,
                selectPaperList: selectPaperListCopy,
            })
        } 
    }

    //获取试题库试题类型
    fetchPaperType = () => {
        const paramsData = this.props.paramsData;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getQuestionTypeList.do";
        const params = {
            channelCode: paramsData.studyRankId,
            subjectCode: paramsData.studyClassId,
            textBookCode: paramsData.editionId,
            gradeLevelCode: paramsData.bookId,
            pointCode: paramsData.knowledgeCode,
            //callback:'ha',
        };

        console.log('-----fetchPaperType-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('--------试题库试题类型数据------');
                console.log(resJson.data);
                console.log('------------------------');

                //定义临时存储接口请求试题数据的二维数组
                for(let i = 0 ; i < resJson.data.length ; i++){
                    paperListTwo[i] = [];
                }
                typeAll = paperListTwo.length; //总类型数
                // console.log('****paperListCopyLength****' , paperListTwo.length);

                this.setState({ paperTypeList: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //请求试题库试题
    fetchPaperList = () => {
        const { paperTypeList } = this.state;

        //this.fetchPaperListItem(paperNo , '填空题' , 99);
        for(let i = 0 ; i < paperTypeList.length ; i++){
            this.fetchPaperListItem(i , 1 , paperTypeList[i] , 99); //fetch异步
        }      
    }

    //依据试题类型请求试题
    fetchPaperListItem = (index , paperNum , paperType , shareTag) => {
        const paramsData = this.props.paramsData;
        const token = global.constants.token;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getAllQuestions.do";
        const params = {
            currentpage: paperNum,
            channelCode: paramsData.studyRankId,
            subjectCode: paramsData.studyClassId,
            textBookCode: paramsData.editionId,
            gradeLevelCode: paramsData.bookId,
            pointCode: paramsData.knowledgeCode,
            questionTypeName: paperType,
            shareTag: shareTag,
            token: token,
            //callback:'ha',
        };

        // console.log('-----fetchPaperListItem-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);

                paperListOne = resJson.data;
                // console.log('----paperListOne-----', paperListOne);
                let paperLength; //当前请求页试题数目
                if(paperListOne == null){
                    //console.log('!!!!!params!!!!resJson!!!' , params , resJson);
                    //参数存在问题token失效等
                    Alert.alert(resJson);
                    return;
                }else{
                    paperLength = paperListOne != '' ? paperListOne.length : 0;
                }
                // console.log('*****paperLength***' , paperLength);
                if(paperLength > 0){
                    paperListOne.map(function (Item) {
                        paperListTwo[index].push(Item);
                    });
                    //paperListTwo[index].concat(paperListOne);

                    paperListOne = [];

                    // console.log('---paperListOne-Length---', index , paperType , paperListTwo[index].length);
                    //试题请求接口每次最多返回5个数据
                    if(paperLength == 5){
                        //paperNo++;
                        //接着请求下一页数据
                        this.fetchPaperListItem(index , paperNum+1 , paperType , shareTag);
                    }else{
                        console.log('*****此类型请求完****', paperType);
                        //此类型最后一页数据读取完，结束此类型请求
                        count++; //目前已请求完成类型试题数
                        // paperListTwo[index].map(function (Item) {
                        //     paperListCopy.push(Item);
                        // });
                        //所有类型的试题都读取完
                        if(count == typeAll){
                            paperListCopy = [];
                            for(let i = 0 ; i < paperListTwo.length ; i++){
                                for(let j = 0 ; j < paperListTwo[i].length ; j++){
                                    paperListCopy.push(paperListTwo[i][j]);
                                }
                            }
                            // console.log('****paperListCopy试题总数***', paperListCopy.length);
                            this.setState({ paperList: paperListCopy });
                        }
                        return;
                    }
                }else{
                    //当前页已经没有试题，说明试题已经请求完
                    console.log('-----此类型请求完---' , paperType);
                    // console.log('****paperListOne****',resJson);
                    count++; //目前已请求完成类型试题数
                    //所有类型的试题都读取完
                    if(count == typeAll){
                        paperListCopy = [];
                        for(let i = 0 ; i < paperListTwo.length ; i++){
                            for(let j = 0 ; j < paperListTwo[i].length ; j++){
                                paperListCopy.push(paperListTwo[i][j]);
                            }
                        }
                        // console.log('****paperListCopy试题总数***', paperListCopy.length);
                        this.setState({ paperList: paperListCopy });
                    }
                    return;
                }

            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }


    //展示添加试题页面
    showAddPaper = () => {
        return(
                <View style={styles.bodyView}>
                    {/**选中题目数 添加此试题或删除此试题 */}
                    <View style={styles.paperSelectNumView}>
                        <Text style={styles.selectPaperNum}>(已选中{this.state.selectPaperNum})</Text>
                        {
                            this.ifSelected() ?
                                        <TouchableOpacity onPress={()=>{this.updateSlectNum(true)}}>
                                            <Image
                                                style={{
                                                    width: 26, 
                                                    height: 26,
                                                    top: 7,
                                                    left: screenWidth*0.652,
                                                    position: 'absolute',
                                                }} 
                                                source={require('../../../../assets/teacherLatestPage/shanchu.png')}
                                            />
                                        </TouchableOpacity>
                                        : 
                                        <TouchableOpacity onPress={()=>{this.updateSlectNum(false)}}>
                                            <Image
                                                    style={{
                                                        width: 30, 
                                                        height: 30,
                                                        top: 5,
                                                        left: screenWidth*0.65,
                                                        position: 'absolute',
                                                    }} 
                                                    source={require('../../../../assets/teacherLatestPage/tianjia.png')}
                                            />
                                        </TouchableOpacity>
                        }
                    </View>

                    {/**题目展示 */}
                    <View style={styles.showPaper}>
                        {/**请求试题库试题类型 */}
                        {/* {console.log('***试题类型数***', this.state.paperTypeList.length)} */}
                        {
                            this.state.paperTypeList.length <= 0 ? this.fetchPaperType() : null
                        }
                        {/**依据试题类型请求试题 */}
                        {/* {console.log('***试题总数***', this.state.paperList.length)} */}
                        {/* {
                            this.state.paperTypeList.length > 0
                            && this.state.paperList.length <= 0
                                ? this.fetchPaperList()
                                : null
                        } */}
                        {console.log('******showAddPaper**总试题数*******', this.state.paperList.length , Date.parse(new Date()))}
                        {
                            this.state.paperTypeList.length > 0
                            && this.state.paperList.length <= 0
                            ? this.fetchData(pageNo , this.state.paperTypeList[1] , 99 , false)
                            : null
                        }
                        {/**题目 答案 解析*/}
                        {
                            this.state.paperList.length > 0 ? this.showAllPaperTitle() : null
                        }
                    </View>
                </View>
        );
    }

    //显示添加试题页面所有试题
    showAllPaperTitle = () => {
        const { selectPaperIndex , paperList } = this.state;
        return(
            <ScrollView  showsVerticalScrollIndicator={false}>
                {/**题面 */}
                {/* {console.log('---题目-----' ,paperList[selectPaperIndex].tiMian)} */}
                <Text style={styles.paperContent}>[题面] {paperList[selectPaperIndex].typeName}{paperList[selectPaperIndex].baseTypeId}</Text>
                <View style={{padding: 10}}>
                    <RenderHtml contentWidth={screenWidth} source={{html: paperList[selectPaperIndex].tiMian}}></RenderHtml>
                </View>
                

                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**答案 */}
                <Text style={styles.paperContent}>[答案]</Text>
                <View style={{padding: 10}}>
                    <RenderHtml contentWidth={screenWidth} source={{html: paperList[selectPaperIndex].answer}}></RenderHtml>
                </View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />
                
                {/**解析 */}
                <Text style={styles.paperContent}>[解析]</Text>
                <View style={{padding: 10}}>
                    <RenderHtml contentWidth={screenWidth} source={{html: paperList[selectPaperIndex].analysis}}></RenderHtml>
                </View>
            </ScrollView>
        );
    }

    //展示添加试题页面底部
    showAddPaperBottom = () => {
        return (
            <View>
                <FlatList
                    //水平布局
                    horizontal={true}
                    //定义数据显示效果
                    data={this.state.paperList}
                    renderItem={this._renderItemView.bind(this)}
                    //分割线
                    //ItemSeparatorComponent={this._separator}
                    //下拉刷新相关
                    onRefresh={() => this._onRefresh()}
                    refreshing={this.state.isRefresh}
                    //上拉加载相关
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.01}
                />
            </View>
        );
    }

    //请求试题
    fetchData = (paperNum , paperType , shareTag , isRefresh) => {
        const paramsData = this.props.paramsData;
        const token = global.constants.token;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getAllQuestions.do";
        const params = {
            currentpage: paperNum,
            channelCode: paramsData.studyRankId,
            subjectCode: paramsData.studyClassId,
            textBookCode: paramsData.editionId,
            gradeLevelCode: paramsData.bookId,
            pointCode: paramsData.knowledgeCode,
            questionTypeName: paperType,
            shareTag: shareTag,
            token: token,
            //callback:'ha',
        };

        console.log('-----fetchData-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                fetchNum++; //请求次数增加

                let resJson = JSON.parse(resStr);

                paperListOne = resJson.data;
                // console.log('----paperListOne-----', paperListOne);
                let paperLength; //当前请求页试题数目
                if(paperListOne == null){
                    //console.log('!!!!!params!!!!resJson!!!' , params , resJson);
                    //参数存在问题token失效等
                    Alert.alert(resJson);
                    return;
                }else{
                    paperLength = paperListOne != '' ? paperListOne.length : 0;
                }
                console.log('*****currentFecthLength***' , paperLength , Date.parse(new Date()));

                let foot = 0;

                // console.log('---paperListOne-Length---', index , paperType , paperListTwo[index].length);
                //试题请求接口每次最多返回5个数据
                if(paperLength < 5){
                    foot = 1; //未请求到数据，数据加载完了
                    dataFlag = false; //数据加载完了
                    console.log('********总试题数*******', this.state.paperList.length);
                }
                console.log('---------fetchNum--------',fetchNum);
                this.setState({
                    paperList: isRefresh || fetchNum == 1 || fetchNum == 2 ? paperListOne : this.state.paperList.concat(paperListOne),
                    showFoot: foot, 
                });
                console.log('*******allLength**' , this.state.paperList.length , Date.parse(new Date()));
                
                paperListOne = [];
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //下拉刷新
    _onRefresh = () => {
        console.log("下拉刷新！！！");
        pageNo = 1;
        this.setState({
            isRefresh: true, //下拉控制
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            //isRefreshing: false, //下拉控制
        });
        this.fetchData(pageNo , this.state.paperTypeList[0] , 99 , true);
    }

    //上拉加载
    _onEndReached() {
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if (pageNo != 1 && dataFlag == false) {
            return;
        } else {
            pageNo++;
        }
        console.log('*************pageNo*******',pageNo);
        //底部显示正在加载更多数据
        this.setState({ showFoot: 2 });
        //获取数据
        this.fetchData(pageNo , this.state.paperTypeList[1] , 99 , false);
    }

    //底部信息提示
    _renderFooter() {
        if (this.state.showFoot == 1) {
            return (
                <View>
                    <View
                        style={{
                            height: 30,
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                color: "#999999",
                                fontSize: 14,
                                marginTop: 5,
                                marginBottom: 5,
                            }}
                        >
                            没有更多数据了
                        </Text>
                    </View>
                </View>
            );
        } else if (this.state.showFoot == 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator color="#59B9E0" />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot == 0) {
            return (
                <View style={styles.footer}>
                    <View style={{ height: 1, backgroundColor: "#999999" }} />
                    <Text></Text>
                </View>
            );
        }
    }

    //返回itemView(单个试题)
    _renderItemView = (paperItem) => {
        const { paperList } = this.state;
        console.log('***_renderItemView***paperLength***index**试题id*', paperList.length , paperItem.index , paperItem.item.questionId);
        let paper_i = paperItem.index;
        // console.log('*******[paper_i]*****[length]**********', paper_i , paperList.length , paperItem.item.baseTypeId);
        let paperTypeImg;
        if(paperItem.item.baseTypeId == '101'){
            paperTypeImg = require('../../../../assets/teacherLatestPage/101.png');
        }else if(paperItem.item.baseTypeId == '102'){
            paperTypeImg = require('../../../../assets/teacherLatestPage/102.png');
        }else if(paperItem.item.baseTypeId == '103'){
            paperTypeImg = require('../../../../assets/teacherLatestPage/103.png');
        }else if(paperItem.item.baseTypeId == '104'){
            paperTypeImg = require('../../../../assets/teacherLatestPage/104.png');
        }else if(paperItem.item.baseTypeId == '106'){
            paperTypeImg = require('../../../../assets/teacherLatestPage/106.png');
        }else if(paperItem.item.baseTypeId == '108'){
            if(paperItem.item.typeName.indexOf('填空')){
                paperTypeImg = require('../../../../assets/teacherLatestPage/109.png');
            }else{
                paperTypeImg = require('../../../../assets/teacherLatestPage/108.png');
            }
        }else{
            paperTypeImg = require('../../../../assets/teacherLatestPage/107.png');
        }
        return(  
                <TouchableOpacity 
                    key={paper_i}
                    onPress={() => {
                        if(this.state.selectPaperIndex != paper_i){
                            this.setState({ 
                                selectPaperIndex: paper_i,
                            })
                        }
                    }}
                >
                    <Image 
                        source={paperTypeImg} 
                        style={this.state.selectPaperIndex == paper_i ? styles.checked : styles.little_image} 
                    />
                </TouchableOpacity>  
        ); 
    }

    //展示添加试题页面底部
    // showAddPaperBottom = () => {
    //     const { paperList } = this.state;
    //     var paperItems = [];
    //     for(let paper_i = 0 ; paper_i < paperList.length ; paper_i++){
    //         let paperTypeImg;
    //         if(paperList[paper_i].baseTypeId == '101'){
    //             paperTypeImg = require('../../../../assets/teacherLatestPage/101.png');
    //         }else if(paperList[paper_i].baseTypeId == '102'){
    //             paperTypeImg = require('../../../../assets/teacherLatestPage/102.png');
    //         }else if(paperList[paper_i].baseTypeId == '103'){
    //             paperTypeImg = require('../../../../assets/teacherLatestPage/103.png');
    //         }else if(paperList[paper_i].baseTypeId == '104'){
    //             paperTypeImg = require('../../../../assets/teacherLatestPage/104.png');
    //         }else if(paperList[paper_i].baseTypeId == '106'){
    //             paperTypeImg = require('../../../../assets/teacherLatestPage/106.png');
    //         }else if(paperList[paper_i].baseTypeId == '108'){
    //             if(paperList[paper_i].typeName.indexOf('填空')){
    //                 paperTypeImg = require('../../../../assets/teacherLatestPage/109.png');
    //             }else{
    //                 paperTypeImg = require('../../../../assets/teacherLatestPage/108.png');
    //             }
    //         }else{
    //             paperTypeImg = require('../../../../assets/teacherLatestPage/107.png');
    //         }
    //         paperItems.push(
    //             <TouchableOpacity 
    //                 key={paper_i}
    //                 onPress={() => {
    //                     if(this.state.selectPaperIndex != paper_i){
    //                         this.setState({ 
    //                             selectPaperIndex: paper_i,
    //                         })
    //                     }
    //                 }}
    //             >
    //                 <Image 
    //                     source={paperTypeImg} 
    //                     style={this.state.selectPaperIndex == paper_i ? styles.checked : styles.little_image} 
    //                 />
    //             </TouchableOpacity>   
    //         );
    //     }
    //     return(
    //             <ScrollView  
    //                 horizontal={true} 
    //                 showsHorizontalScrollIndicator={false}
    //                 style={styles.bottomView}
    //             >
    //                 {/**scrollView item个数 */}
    //                 {/* {console.log('***scrollView item个数**' , paperItems.length)} */}
    //                 {paperItems}
    //             </ScrollView>
    //     );
    // }

    //向上（前）移动试卷题目（同类型之间移动）
    moveUpPaper = () => {
        const { updatePaperIndex , selectPaperList } = this.state;
        if(updatePaperIndex == 0){
            Alert.alert('已经是第一道题了');
        }else{
            const baseTypeId1 = selectPaperList[updatePaperIndex].baseTypeId;
            const baseTypeId2 = selectPaperList[updatePaperIndex - 1].baseTypeId;
            if(baseTypeId1 != baseTypeId2){
                Alert.alert('类型不一致，不能移动');
            }else{
                const tempPaperList = selectPaperList;
                const tempPaperItem = selectPaperList[updatePaperIndex]; //移动项
                tempPaperList[updatePaperIndex] = tempPaperList[updatePaperIndex - 1]; 
                tempPaperList[updatePaperIndex - 1] = tempPaperItem; 
                this.setState({
                    selectPaperList: tempPaperList,
                    updatePaperIndex : updatePaperIndex - 1,
                });
            }
        }
    }

    //向下（后）移动试卷题目（同类型之间移动）
    moveDownPaper = () => {
        const { updatePaperIndex , selectPaperList } = this.state;
        if(updatePaperIndex == (selectPaperList.length - 1)){
            Alert.alert('已经是最后一道题了');
        }else{
            const baseTypeId1 = selectPaperList[updatePaperIndex].baseTypeId;
            const baseTypeId2 = selectPaperList[updatePaperIndex + 1].baseTypeId;
            if(baseTypeId1 != baseTypeId2){
                Alert.alert('类型不一致，不能移动');
            }else{
                const tempPaperList = selectPaperList;
                const tempPaperItem = selectPaperList[updatePaperIndex]; //移动项
                tempPaperList[updatePaperIndex] = tempPaperList[updatePaperIndex + 1]; 
                tempPaperList[updatePaperIndex + 1] = tempPaperItem; 
                this.setState({
                    selectPaperList: tempPaperList,
                    updatePaperIndex : updatePaperIndex + 1,
                });
            }
        }
    }

    //调整试题页面
    showUpdatePaper = () => {
        return(
            <View style={styles.bodyView}>
                {/**选中题目数 删除此试题 */}
                <View style={styles.paperSelectNumView}>
                    <Text style={styles.selectPaperNum}>(已选中{this.state.selectPaperNum})</Text>
                    {
                        //（同类型试题之间）移动试题 上移
                        <TouchableOpacity onPress={()=>{this.moveUpPaper()}}>
                            <Image
                                style={{
                                    width: 27, 
                                    height: 27,
                                    top: 7,
                                    left: screenWidth*0.4,
                                    position: 'absolute',
                                }} 
                                source={require('../../../../assets/teacherLatestPage/shangyi.png')}
                            />
                        </TouchableOpacity>
                    }
                    {
                        //（同类型试题之间）移动试题 下移
                        <TouchableOpacity onPress={()=>{this.moveDownPaper()}}>
                            <Image
                                style={{
                                    width: 27, 
                                    height: 27,
                                    top: 7,
                                    left: screenWidth*0.53,
                                    position: 'absolute',
                                }} 
                                source={require('../../../../assets/teacherLatestPage/xiayi.png')}
                            />
                    </TouchableOpacity>
                    }
                    {
                        <TouchableOpacity onPress={()=>{this.deletePaperTitle()}}>
                            <Image
                                style={{
                                    width: 27, 
                                    height: 27,
                                    top: 7,
                                    left: screenWidth*0.652,
                                    position: 'absolute',
                                }} 
                                source={require('../../../../assets/teacherLatestPage/shanchu.png')}
                            />
                        </TouchableOpacity>
                    }
                </View>

                {/**题目展示 */}
                <View style={styles.showPaper}>
                    {/**题目 答案 解析*/}
                    {
                        this.state.selectPaperList.length > 0 ? this.showSelectedPaperTitle() : Alert.alert('还没有选择试题')
                    }
                </View>
            </View>
        );
    }

    //展示被选中的试题题目等信息
    showSelectedPaperTitle = () => {
        const { updatePaperIndex , selectPaperList } = this.state;
        return(
            <ScrollView  showsVerticalScrollIndicator={false}>
                {/**题面 */}
                {/* {console.log('---题目-----' ,selectPaperList[updatePaperIndex].tiMian)} */}
                <Text style={styles.paperContent}>[题面] {selectPaperList[updatePaperIndex].typeName}{selectPaperList[updatePaperIndex].baseTypeId}</Text>
                <View style={{padding: 10}}>
                    <RenderHtml contentWidth={screenWidth} source={{html: selectPaperList[updatePaperIndex].tiMian}}></RenderHtml>
                </View>
                

                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**答案 */}
                <Text style={styles.paperContent}>[答案]</Text>
                <View style={{padding: 10}}>
                    <RenderHtml contentWidth={screenWidth} source={{html: selectPaperList[updatePaperIndex].answer}}></RenderHtml>
                </View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />
                
                {/**解析 */}
                <Text style={styles.paperContent}>[解析]</Text>
                <View style={{padding: 10}}>
                    <RenderHtml contentWidth={screenWidth} source={{html: selectPaperList[updatePaperIndex].analysis}}></RenderHtml>
                </View>
            </ScrollView>
        );
    }

    //调整试题页面底部
    showUpdatePaperBottom = () => {
        const { selectPaperList } = this.state;
        // console.log('*****************************');
        // for(let i = 0 ; i < selectPaperList.length ; i++){
        //     console.log(selectPaperList[i].tiMian);
        // }
        // console.log('*****************************');
        var paperItems = [];
        for(let paper_i = 0 ; paper_i < selectPaperList.length ; paper_i++){
            let paperTypeImg;
            if(selectPaperList[paper_i].baseTypeId == '101'){
                paperTypeImg = require('../../../../assets/teacherLatestPage/101.png');
            }else if(selectPaperList[paper_i].baseTypeId == '102'){
                paperTypeImg = require('../../../../assets/teacherLatestPage/102.png');
            }else if(selectPaperList[paper_i].baseTypeId == '103'){
                paperTypeImg = require('../../../../assets/teacherLatestPage/103.png');
            }else if(selectPaperList[paper_i].baseTypeId == '104'){
                paperTypeImg = require('../../../../assets/teacherLatestPage/104.png');
            }else if(selectPaperList[paper_i].baseTypeId == '106'){
                paperTypeImg = require('../../../../assets/teacherLatestPage/106.png');
            }else if(selectPaperList[paper_i].baseTypeId == '108'){
                if(selectPaperList[paper_i].typeName.indexOf('填空')){
                    paperTypeImg = require('../../../../assets/teacherLatestPage/109.png');
                }else{
                    paperTypeImg = require('../../../../assets/teacherLatestPage/108.png');
                }
            }else{
                paperTypeImg = require('../../../../assets/teacherLatestPage/107.png');
            }
            paperItems.push(
                <TouchableOpacity 
                    key={paper_i}
                    onPress={() => {
                        if(this.state.updatePaperIndex != paper_i){
                            this.setState({ 
                                updatePaperIndex: paper_i,
                            })
                        }
                    }}
                >
                    <Image 
                        source={paperTypeImg} 
                        style={this.state.updatePaperIndex == paper_i ? styles.checked : styles.little_image} 
                    />
                </TouchableOpacity>   
            );
        }
        return(
                <ScrollView  
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    style={styles.bottomView}
                >
                    {paperItems}
                </ScrollView>
        );
    }


    //修改“选择课堂”列表是否显示标识
    updateClassNameVisibility = () => {
        if(this.state.classNameVisibility){
            this.setState({ classNameVisibility: false });
        }else{
            this.setState({ classNameVisibility: true });
        }
    }

    //请求课堂列表
    fetchClassNameList = () => {
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getKeTangList.do";
        const params = {
            userName: userId,
            //callback:'ha',
        };

        console.log('-----fetchClassNameList-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('------------------');
                this.setState({ classNameList: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示“选择课堂”列表
    showClassNameList = () => {
        const { classNameList } = this.state;
        const content = classNameList.map((item, index) => {
            return(
                <View style={{flexDirection: 'column',justifyContent:'center',alignItems:'center'}}>
                    <View key={index} 
                        style={this.state.className == item.keTangName ? styles.classNameViewSelected : styles.classNameView}
                    >
                        <Text style={styles.classNameText}
                            onPress={()=>{
                                // console.log('---showClassNameList----' , item.keTangId , item.keTangName)
                                if(this.state.className != item.keTangName){
                                    //更新选择的课堂以及布置对象
                                    this.setState({ 
                                        className: item.keTangName ,
                                        class: item , 
                                        classFlag: false,
                                        groupList: [] , 
                                        studentsList: [] ,
                                        studentsListTrans: [],
                                        groupSelected: [],
                                        studentSelected: [],
                                    })
                                }
                            }}
                        >
                            {item.keTangName}
                        </Text>
                    </View>
                    <View style={{height: 5}}></View>
                </View>
            );
        })
        return content;
    }

    //修改布置对象
    updateAssign = (type) => {
        if(type == '0'){
            if(this.state.assigntoWho != '0'){
                this.setState({ assigntoWho: '0' });
            }
        }else if(type == '1'){
            if(this.state.assigntoWho != '1'){
                this.setState({ assigntoWho: '1' });
            }
        }else{
            if(this.state.assigntoWho != '2'){
                this.setState({ assigntoWho: '2' });
            }
        }
    }

    //请求小组以及学生信息
    fetchGroupAndStudentList = (classId) => {
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getClassStudentList.do";
        const params = {
            keTangId: classId,
            //callback:'ha',
        };

        console.log('-----fetchGroupAndStudentList-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ groupList: resJson.data.groupList , studentsList: resJson.data.classList });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //查看小组是否在已选择的小组列表中
    IsInGroupSelected = (groupItem) => {
        const { groupSelected } = this.state;
        for(let i = 0 ; i < groupSelected.length ; i++){
            if(groupSelected[i].id == groupItem.id){
                return true;
            }
        }
        return false;
    }

    //更新已选择的小组列表
    updateGroupSelected = (groupItem) => {
        const { groupSelected } = this.state;
        let groups = [];
        let flag = this.IsInGroupSelected(groupItem);
        if(flag == true){ //在则删除
            for(let i = 0 ; i < groupSelected.length ; i++){
                if(groupSelected[i].id != groupItem.id){
                    groups.push(groupSelected[i]);
                }
            }
            this.setState({ groupSelected: groups });
        }else{ //不在则添加
            groups = groupSelected;
            groups.push(groupItem);
            this.setState({ groupSelected: groups });
        }
    }

    //查看学生是否在已选择的学生列表中
    IsInStudentSelected = (studentItem) => {
        const { studentSelected } = this.state;
        // console.log('-------studentSelected------',studentSelected.length);
        for(let i = 0 ; i < studentSelected.length ; i++){
            if(studentSelected[i].id == studentItem.id){
                return true;
            }
        }
        return false;
    }

    //更新已选择的学生列表
    updateStudentSelected = (studentItem) => {
        const { studentSelected } = this.state;
        let students = [];
        let flag = this.IsInStudentSelected(studentItem);
        if(flag == true){ //在则删除
            for(let i = 0 ; i < studentSelected.length ; i++){
                if(studentSelected[i].id != studentItem.id){
                    students.push(studentSelected[i]);
                }
            }
            this.setState({ studentSelected: students });
        }else{ //不在则添加
            students = studentSelected;
            students.push(studentItem);
            this.setState({ studentSelected: students });
        }
    }

    //分割获取到的学生信息字符串（个人列表中的学生信息)
    splitStudents = () => {
        const { studentsList , studentsListTrans } = this.state;
        if(studentsList.length > 0 && studentsListTrans.length <= 0){
            let studentsNameList = [];
            let studentsIdList = [];
            let students = [];
                      
            console.log('*****studentsList.length**',studentsList.length);
            console.log('*****classList**',studentsList);
            for(let i = 0 ; i < studentsList.length ; i++){
                let names = studentsList[i].name.split(','); //姓名分割
                names.map((item , index)=>{
                    studentsNameList.push(item);
                });
                console.log('*****names**',names);
                let Ids = studentsList[i].ids.split(','); //id分割
                Ids.map((item , index)=>{
                    studentsIdList.push(item);
                });
                console.log('*****Ids**',Ids);
            }
            for(let i = 0 ; i < studentsNameList.length ; i++){ //组装分割的姓名+id
                students.push({
                    id: studentsIdList[i],
                    name: studentsNameList[i],
                })
            }
            this.setState({ studentsListTrans: students });
        }
    }

    //布置对象列表
    showAssignToWho = () => {
        const { assigntoWho } = this.state;
        const assignList = [];
        if(this.state.className == ''){
            return(
                <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10,}}>请先选择课堂</Text>
                </View>
            );
        }else{
            if(assigntoWho == '0'){ //班级
                return(
                    <View 
                        style={this.state.classFlag == false ?
                            {width: screenWidth*0.4,  height: 35, marginTop: 10, marginLeft: 20, backgroundColor: '#DCDCDC'}
                            : {width: screenWidth*0.4,  height: 35, marginTop: 10, marginLeft: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: 'red'}
                        }
                    >
                        <Text 
                            style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 5, textAlign: 'center'}}
                            onPress={()=>{
                                if(this.state.groupList.length <= 0 && this.state.studentsList.length <= 0){
                                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                                    if(this.state.class != null){ //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                                    }     
                                }
                                this.splitStudents(); //分割获取到的学生信息
                                if(this.state.classFlag){
                                    this.setState({classFlag: false});
                                }else{
                                    this.setState({classFlag: true});
                                }
                            }}
                        >
                            {this.state.class.className.substring(0 , this.state.class.className.length - 1)}
                        </Text>
                    </View>
                );
            }else if(assigntoWho == '1'){ //小组
                console.log('***group**student**' , this.state.groupList.length , this.state.studentsList.length);
                if(this.state.groupList.length <= 0 && this.state.studentsList.length <= 0){
                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                    if(this.state.class != null){ //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                    }     
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                if(this.state.groupList.length > 0){
                    content = this.state.groupList.map((item , index)=>{
                        return(
                            <View style={{flexDirection: 'column',justifyContent:'center',alignItems:'center'}}>
                                <View key={index} 
                                    style={ this.IsInGroupSelected(item) ? styles.groupViewSelected : styles.groupView }
                                >
                                    <Text style={styles.groupItem}
                                        onPress={()=>{this.updateGroupSelected(item)}}
                                    >
                                        {item.value}
                                    </Text>
                                </View>
                                <View style={{height: 5}}></View>
                            </View>
                        )
                    })
                }
                return(
                    this.state.groupList.length > 0
                    ? content
                    : <View style={{justifyContent:'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10,}}>
                        您还没有创建小组，可以前往电脑端进行创建</Text>
                    </View>
                );
            }else{ //个人
                if(this.state.groupList.length <= 0 && this.state.studentsList.length <= 0){
                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                    if(this.state.class != null){ //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                    }     
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                const { studentsListTrans } = this.state;     
                if(studentsListTrans.length > 0){
                    content = studentsListTrans.map((item , index)=>{
                        return(
                                <View key={index} 
                                    style={ this.IsInStudentSelected(item) ? {
                                            width: screenWidth * 0.3,
                                            height: 35,
                                            fontSize: 15,
                                            color: 'black',
                                            backgroundColor: '#fff',
                                            fontWeight: '300',
                                            margin: 3,
                                            borderWidth: 2,
                                            borderColor: 'red',
                                            textAlign: 'center',
                                        }
                                        : {
                                            width: screenWidth * 0.3,
                                            height: 35,
                                            fontSize: 15,
                                            color: 'black',
                                            backgroundColor: '#DCDCDC',
                                            fontWeight: '300',
                                            margin: 3,
                                            borderWidth: 2,
                                            borderColor: '#fff',
                                            textAlign: 'center',
                                        }
                                    }
                                >
                                    <Text style={styles.classNameText}
                                        onPress={()=>{this.updateStudentSelected(item)}}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                                // <View style={{height: 5}}></View>
                        )
                    })
                }
                return(
                    studentsListTrans.length > 0
                    ? <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',  //自动换行
                                backgroundColor: '#fff',
                                left: screenWidth * 0.025,
                                marginBottom: 10,
                            }}
                    >
                        {content}
                    </View>
                    : <View style={{justifyContent:'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10,}}>
                            当前班级没有学生信息</Text>
                    </View>
                );
            }
        }
    }

    //设置开始时间
    setStartTime = (time) => {
        this.setState({ startTime: time , endTime: time });
    }
    //设置结束时间
    setEndTime = (time) => {
        this.setState({ endTime: time });
    }

    //布置作业页面
    showPushPaper = () => {
        return(
            <View  style={{...styles.bodyView,height:'82%'}}>
                {/**布置 保存 */}
                <View style={{...styles.paperSelectNumView,justifyContent: 'space-around'}}>
                    <Text 
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            color: '#4DC7F8',
                            top: 10,
                        }}
                        onPress={()=>{Alert.alert('布置')}}
                    >布置</Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            color: 'black',
                            top: 10,
                        }}
                        onPress={()=>{this.savePaper()}}
                    >保存</Text>
                </View>
                <ScrollView style={{height:'100%'}}>
                    {/**开始时间 */}
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.title}>开始时间:</Text>
                        <Text style={{...styles.title,width: screenWidth * 0.6,}}>{this.state.startTime}</Text>
                        <View style={{right: 10, position: 'absolute'}}>
                            <DateTime setDateTime={this.setStartTime} selectedDateTime={this.state.startTime}/>
                        </View>
                    </View>

                    

                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />

                    {/**结束时间 */}
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.title}>结束时间:</Text>
                        <Text style={{...styles.title,width: screenWidth * 0.6,}}>{this.state.endTime}</Text>
                        <View style={{right: 10, position: 'absolute'}}>
                            <DateTime setDateTime={this.setEndTime} selectedDateTime={this.state.endTime}/>
                        </View>
                    </View>

                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                
                    {/**选择课堂 */}
                    <View style={{flexDirection:'row',width:screenWidth}}>
                        <TouchableOpacity
                            style={{flexDirection:'row',width:screenWidth}}
                            onPress={() => {
                                this.updateClassNameVisibility();
                            }}
                        >
                            <Text style={styles.title}>选择课堂:</Text>
                            <Text style={{...styles.title,width: screenWidth * 0.6,}}>{this.state.className}</Text>
                            <TouchableOpacity style={{flexDirection:'row',position:'absolute',right:20,}} 
                                onPress={() => {
                                    this.updateClassNameVisibility();
                                }}
                            >
                                <Image style={{top:10,width:20,height:20}} 
                                    source={
                                        this.state.classNameVisibility ?
                                        require('../../../../assets/teacherLatestPage/top.png')
                                        : require('../../../../assets/teacherLatestPage/bot.png')
                                    }
                                >
                                </Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    {/**可选课堂列表 */}
                    {this.state.classNameVisibility ?
                        <View>
                            {
                                this.state.classNameList.length <= 0
                                    ? this.fetchClassNameList()
                                    : null
                            }
                            {
                                this.state.classNameList.length > 0
                                    ? this.showClassNameList()
                                    : <Text>课堂列表未获取到或者为空</Text>
                            }
                        </View>
                        : null
                    }
                    

                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                
                    {/**布置 */}
                    <View style={{flexDirection:'row',alignItems:'center',borderBottomWidth:0.5}}>
                        <Text style={styles.title}>布置给:</Text>
                        {/**班级 小组  个人 */}
                        <View style={this.state.assigntoWho == '0' ? styles.assignViewSelected : styles.assignView}>
                            <Text style={styles.assignText} onPress={()=>{this.updateAssign(0)}}>班级</Text>
                        </View>
                        <View style={this.state.assigntoWho == '1' ? styles.assignViewSelected : styles.assignView}>
                            <Text style={styles.assignText} onPress={()=>{this.updateAssign(1)}}>小组</Text>
                        </View>
                        <View style={this.state.assigntoWho == '2' ? styles.assignViewSelected : styles.assignView}>
                            <Text style={styles.assignText} onPress={()=>{this.updateAssign(2)}}>个人</Text>
                        </View>
                    </View>

                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                    {/**布置对象列表 */}
                    {this.showAssignToWho()}
                </ScrollView>
            </View>
        );
    }

    //布置作业页面底部按钮
    showPushPaperBottom = () => {
        return(
            <View style={{flexDirection:'row',justifyContent:'space-around',backgroundColor:'#fff'}}>
                    <Button style={{width:'40%'}}
                        onPress={()=>{
                            this.setState({
                                startTime: undefined,
                                endTime: undefined,
                                className: '', //选择课堂
                                //classNameList: [], //班级列表
                                classNameVisibility: false, //是否显示课堂列表

                                assigntoWho: '0', //布置作业对象 0:班级 1：小组 2:个人

                                class: {}, //所选中的课堂对应的班级信息
                                classFlag: false, //是否选中班级

                                //groupList: [], //小组列表
                                groupSelected: [], //被选中的小组

                               // studentsList: [], //个人列表（接口返回的classList、学生信息由字符串拼接）
                                //studentsListTrans: [], //studentsList中拼接的学生信息挨个提取出
                                studentSelected: [], //被选中的学生
                            })
                        }}
                    >重置</Button>
                    <Button style={{width:'40%'}}
                        onPress={()=>{this.pushAndSavePaper()}}
                    >确定</Button>
            </View>
        );
    }


    render() {
        // console.log('--------类式props-------', this.props.paramsData);
        return (
            <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                {/**导航项 */}
                <View style={styles.routeView}>
                    {/**返回按钮 */}
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.goBack();
                        }}
                    >
                        <Image style={{width: 30, height: 30}} source={require('../../../../assets/teacherLatestPage/goBack.png')}></Image>
                    </TouchableOpacity>
                    {/**三个可选项 */}
                    <View
                        style={{
                            flexDirection: 'row',
                            height: 40,
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: '#4DC7F8',
                        }}
                    >
                        <Text 
                            style={this.state.addPaperFlag ? styles.addPaperSelect : styles.addPaper}
                            onPress={()=>{
                                this.updateFlag(1 , this.state.addPaperFlag);
                            }}
                        >添加试题</Text>
                        <Text 
                            style={this.state.updatePaperFlag ? styles.addPaperSelect : styles.updatePaper}
                            onPress={()=>{
                                this.updateFlag(2 , this.state.updatePaperFlag);
                            }}
                        >调整顺序</Text>
                        <Text 
                            style={this.state.pushPaperFlag ? styles.addPaperSelect : styles.pushPaper}
                            onPress={()=>{
                                this.updateFlag(3 , this.state.pushPaperFlag);
                            }}
                        >布置作业</Text>
                    </View>
                    {/**筛选按钮 */}
                    {
                        this.state.addPaperFlag ?
                                    <TouchableOpacity
                                        onPress={()=>{
                                            // Alert.alert('设置属性悬浮框');
                                            this.setState({ filterModelVisiblity: !this.state.filterModelVisiblity })
                                        }}
                                    >
                                        <Image style={{width: 20, height: 20}} source={require('../../../../assets/teacherLatestPage/filter2.png')}></Image>
                                    </TouchableOpacity>
                                    : <View style={{width: 20, height: 20}}/>
                    }
                    {
                        this.state.filterModelVisiblity ? this.showFilter() : null
                    }
                </View>
            
                {/**试题展示、调整顺序、布置作业展示区 */}
                {
                    this.state.addPaperFlag 
                            ? this.showAddPaper()
                            : this.state.updatePaperFlag 
                            ? this.showUpdatePaper()
                            : this.showPushPaper()
                }             

                {/**底部展示区 */}
                {
                    this.state.addPaperFlag 
                            ? this.showAddPaperBottom()
                            : this.state.updatePaperFlag
                            ?  this.showUpdatePaperBottom()
                            : this.showPushPaperBottom()
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modelView: {
        top: '20%',
        left: screenWidth*0.2,
        height: screenHeight*0.8,
        width: screenWidth*0.8,
        backgroundColor: 'gray',
    },
    routeView: {
        height: screenHeight*0.1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingRight: 10, 
        paddingLeft: 10,
    },
    bodyView: {
        height: screenHeight*0.7,
        flexDirection: 'column',
    },
    bottomView: {
         //top: '100%',
         height: screenHeight*0.2,
         paddingTop: 20,
         paddingBottom: 20,
        //  position: 'absolute',
         backgroundColor: '#fff',       
    },
    addPaper: {
        borderBottomWidth: 1,
        borderBottomColor: '#4DC7F8',
        borderRadius: 5,
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: '#4DC7F8',
        backgroundColor: '#fff',
        fontWeight: '300',
        padding: 10,
        textAlign: 'center',
    },
    addPaperSelect: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#4DC7F8',
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: 'white',
        backgroundColor: '#4DC7F8',
        fontWeight: '300',
        padding: 10,
        textAlign: 'center',
    },
    updatePaper: {
        borderBottomWidth: 1,
        borderBottomColor: '#4DC7F8',
        borderRadius: 0.5,
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: '#4DC7F8',
        backgroundColor: '#fff',
        fontWeight: '300',
        padding: 10,
        textAlign: 'center',
    },
    pushPaper: {
        borderBottomWidth: 1,
        borderBottomColor: '#4DC7F8',
        borderRadius: 5,
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: '#4DC7F8',
        backgroundColor: '#fff',
        fontWeight: '300',
        padding: 10,
        textAlign: 'center',
    },
    paperSelectNumView: {
        height: screenHeight*0.06,
        flexDirection: 'row',
        backgroundColor: '#EBEDEC',
    },
    selectPaperNum: {
        fontSize: 18,
        color: '#8B8B7A',
        paddingLeft: 20,
        paddingTop: 7,
    },
    showPaper: {
        height: '90%',
        flexDirection: 'column',
    },
    little_image:{
        height:60,
        width:screenWidth*0.15,
        marginTop: 5,
        marginLeft:5
    },
    checked:{
        height:70,
        width:screenWidth*0.16,
        marginLeft:5,
        borderColor:'#FFA500',
        borderRadius: 5,
        borderWidth:5,
    },
    paperContent: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 10,
    },
    title: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth * 0.2,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        //height:'100%',
    },
    classNameView: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#DCDCDC',
        borderWidth: 2,
        borderColor: '#fff',
    },
    classNameViewSelected: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: 'red',
    },
    classNameText: {
        fontSize: 15,
        color: 'black',
        fontWeight: '300',
        paddingTop: 8,
        textAlign: 'center',
    },
    assignView: {
        width: screenWidth * 0.15,
        height: 30,
        backgroundColor: '#fff',
    },
    assignViewSelected: {
        width: screenWidth * 0.15,
        height: 30,
        backgroundColor: '#4DC7F8',
        borderRadius: 5,
    },
    assignText: {
        fontSize: 15,
        color: 'black',
        fontWeight: '300',
        textAlign: 'center',
        paddingTop: 3,
    },
    groupView: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#DCDCDC',
        marginTop:3,
        borderWidth: 2,
        borderColor: '#fff',
    },
    groupViewSelected: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#fff',
        marginTop:3,
        borderWidth: 2,
        borderColor: 'red',
    },
    groupItem: {
        fontSize: 15,
        color: 'black',
        fontWeight: '300',
        paddingTop: 8,
        textAlign: 'center',
    },
})