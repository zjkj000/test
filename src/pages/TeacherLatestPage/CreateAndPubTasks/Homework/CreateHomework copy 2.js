import React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    Platform,
    ScrollView,
} from "react-native";
import { Button } from '@ui-kitten/components';
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../../utils/http/request";
import DateTime from "../../../../utils/datetimePickerUtils/DateTime";


import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

import Toast from '../../../../utils/Toast/Toast';

import HomeworkPropertyModelContainer from "./HomeworkPropertyModel";
import { Waiting, WaitLoading } from "../../../../utils/WaitLoading/WaitLoading";

let pageNo = 1; //当前第几页
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
let allPageNo = 0; //总数

export default function CreateHomeworkContainer(props) {
    console.log('------函数式props----', props.route.params.knowledgeCode);
    const paramsData = props.route.params;
    const navigation = useNavigation();

    //将navigation传给HomeworkProperty组件，防止路由出错
    return <CreateHomework navigation={navigation} paramsData={paramsData} />;
}

class CreateHomework extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paramsDataProps: this.props.paramsData,

            studyRankId: this.props.paramsData.studyRankId,
            studyRank: this.props.paramsData.studyRank,
            studyClassId: this.props.paramsData.studyClassId,
            studyClass: this.props.paramsData.studyClass,
            editionId: this.props.paramsData.editionId,
            edition: this.props.paramsData.edition,
            bookId: this.props.paramsData.bookId,
            book: this.props.paramsData.book,
            knowledgeCode: this.props.paramsData.knowledgeCode,
            knowledge: this.props.paramsData.knowledge,

            channelNameList: this.props.paramsData.type == 'create' ? this.props.paramsData.channelNameList : '', //学段名列表（接口数据）
            studyClassList: this.props.paramsData.type == 'create' ? this.props.paramsData.studyClassList : '', //学科列表（接口数据）
            editionList: this.props.paramsData.type == 'create' ? this.props.paramsData.editionList : '', //版本列表（接口数据）
            bookList: this.props.paramsData.type == 'create' ? this.props.paramsData.bookList : '', //教材列表（接口数据）  

            knowledgeList: '',

            paperId: this.props.paramsData.type == 'create' ? '' : this.props.paramsData.paperId, //空试卷id

            addPaperFlag: this.props.paramsData.type == 'create' ? true : false, //导航“添加试题”是否被选中
            updatePaperFlag: this.props.paramsData.type == 'create' ? false : true, //导航“调整顺序”是否被选中
            pushPaperFlag: false, //导航“布置作业”是否被选中

            filterModelVisiblity: false, //设置属性悬浮框是否显示
            knowledgeModelVisibility: false, //知识点悬浮框是否显示

            shareTag: '99', //‘共享内容’
            paperTypeName: 'all',

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

            imgState: 1,


            //网络请求状态
            error: false,
            errorInfo: "",
            isRefresh: false,
            showFoot: 0, //控制foot， 0：隐藏footer 1：已加载完成，没有更多数据 2：正在加载中
        };
    }

    UNSAFE_componentWillMount() {
        console.log('------componentWillMount--------');
        // console.log(this.state.paramsDataProps);
        // console.log('-------------------------------');
        // if(this.state.paperId == ''){ //调接口，获取paperId
        //     this.fetchPaperId();
        // }
        if (this.props.paramsData.type == 'update') {
            this.fetchPaperEditContent();
        }
        var _dateStr = new Date().toISOString().substring(0, 10) + ' ' + new Date().toISOString().substring(11, 16)
        _dateStr = _dateStr.substring(0, 11) + (parseInt(_dateStr.substring(12, 13)) + 8) + _dateStr.substring(13, 16)
        this.setState({
            startTime: _dateStr,
            endTime: this.nextDay(_dateStr.substring(0, 10)), //结束时间
        })
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        console.log('----WillUpdate--------------------------');
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
                this.setState({ paperId: resJson.data }, () => {
                    if (this.state.baseTypeIdLists.length <= 0) {
                        this.sortSelectPaperList();
                        // this.createPaperObject(); //生成试卷对象
                        // console.log('-------排序并生成试题-----',this.state.paperObject , this.state.selectPaperList.length);
                    } else {
                        this.createPaperObject(); //生成试卷对象
                    }
                });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //获取试卷中的试题
    fetchPaperEditContent = () => {
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getPaperEditContent.do";
        const params = {
            userName: userId,
            paperId: this.state.paperId,
            //callback:'ha',
        };

        console.log('-----fetchPaperEditContent-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('--------试卷内容列表------', resJson.data.length);
                console.log(resJson.data);
                console.log('------------------------');
                //获取已选择试题的baseTypeIdLists
                var selectPaperListCopy = resJson.data;
                var baseTypeIdList = []; //记录选中题目的baseTypeId个数
                if (selectPaperListCopy.length > 0) {
                    var baseTypeIdtemp = selectPaperListCopy[0].baseTypeId;
                    baseTypeIdList.push(baseTypeIdtemp);
                    for (let i = 1; i < selectPaperListCopy.length; i++) { //获取选中题目的baseTypeId个数    
                        if (selectPaperListCopy[i].baseTypeId.indexOf(baseTypeIdtemp) < 0) {
                            if (baseTypeIdList.indexOf(selectPaperListCopy[i].baseTypeId) < 0) {
                                baseTypeIdList.push(selectPaperListCopy[i].baseTypeId);
                                baseTypeIdtemp = selectPaperListCopy[i].baseTypeId;
                            }
                        }
                    }
                }
                console.log('*********baseTypeIdList*****************', baseTypeIdList);

                this.setState({
                    selectPaperNum: resJson.data.length,
                    selectPaperList: resJson.data,
                    baseTypeIdLists: baseTypeIdList
                }, () => {
                    console.log('=========baseTypeIdList=============', this.state.baseTypeIdLists)
                });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    componentWillUnmount() {
        pageNo = 1; //当前第几页
        dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
        allPageNo = 0; //总数
    }

    setModalVisible = (visible) => {
        console.log('-----------setModalVisible---------------', visible);
        this.setState({ filterModelVisiblity: visible, });
    }

    getLongknowledge(id) {
        const url = global.constants.baseUrl + "teacherApp_getPointName.do";
        const params = {
            pointId: id
        }
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                if (resJson.success) {
                    this.setState({
                        filterModelVisiblity: true,
                        knowledgeModelVisibility: false,
                        knowledgeCode: id,
                        knowledge: resJson.data
                    })
                }
            })
    }

    //显示设置属性悬浮框
    showFilter = () => {
        const { filterModelVisiblity, knowledgeModelVisibility } = this.state;
        if (filterModelVisiblity) { //显示设置属性覆盖框
            return (
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={filterModelVisiblity}
                    onRequestClose={() => {
                        console.log('----------------Modal has been closed.---------------------');
                        Alert.alert('', '关闭悬浮框', [{}, { text: '确定', onPress: () => { } }]);
                        this.setModalVisible(!filterModelVisiblity);
                    }}
                >
                    <View>
                        <Text
                            style={{ height: 70, width: 40, right: 0, position: 'absolute' }}
                            onPress={() => {
                                this.setModalVisible(!filterModelVisiblity);
                            }}></Text>
                    </View>
                    {/**设置属性悬浮框组件   父子结点传参(传方法！！！！) */}
                    <HomeworkPropertyModelContainer
                        paperTypeList={this.state.paperTypeList}
                        studyRank={this.state.studyRank}
                        studyRankId={this.state.studyRankId}
                        studyClass={this.state.studyClass}
                        studyClassId={this.state.studyClassId}
                        edition={this.state.edition}
                        editionId={this.state.editionId}
                        book={this.state.book}
                        bookId={this.state.bookId}
                        knowledge={this.state.knowledge}
                        knowledgeCode={this.state.knowledgeCode}

                        channelNameList={this.state.channelNameList} //学段名列表（接口数据）
                        studyClassList={this.state.studyClassList} //学科列表（接口数据）
                        editionList={this.state.editionList} //版本列表（接口数据）
                        bookList={this.state.bookList} //教材列表（接口数据）  
                        knowledgeList={this.state.knowledgeList} //从接口中返回的数据

                        setAllProperty={this.setAllProperty}
                        setFetchAgainProperty={this.setFetchAgainProperty}
                    />
                </Modal>
            );
        } else if (knowledgeModelVisibility) { //显示知识点覆盖框
            return (
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={knowledgeModelVisibility}
                    onRequestClose={() => {
                        console.log('----------------Modal has been closed.---------------------');
                        Alert.alert('', '关闭悬浮框', [{}, { text: '确定', onPress: () => { } }]);
                        this.setState({ knowledgeModelVisibility: !knowledgeModelVisibility });
                    }}
                >
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={{
                                height: 20,
                                width: screenWidth,
                                paddingRight: screenWidth * 0.9,
                                position: 'absolute',
                            }}
                            onPress={() => {
                                this.setState({
                                    filterModelVisiblity: true,
                                    knowledgeModelVisibility: false,
                                });
                            }}
                        >
                            <Image
                                style={{
                                    top: 0,
                                    height: '80%',
                                    width: '80%',
                                    resizeMode: "center",
                                }}
                                source={require('../../../../assets/teacherLatestPage/close.png')}
                            />
                        </TouchableOpacity>
                        {console.log('-----knowledgeList--!!!!!!!!-', this.state.knowledgeList)}
                        {/**知识点数据为空时请求数据 */}
                        {
                            this.state.knowledgeList == ''
                                && this.state.paramsDataProps.studyRank != ''
                                && this.state.paramsDataProps.studyClass != ''
                                && this.state.paramsDataProps.edition != ''
                                && this.state.paramsDataProps.book != ''
                                ? this.showKnowledgeList()
                                : null
                        }
                        {
                            this.state.knowledgeList != ''
                                ? console.log(this.state.knowledgeList)
                                : null
                        }
                        {
                            this.state.knowledgeList != ''
                                ?
                                <WebView
                                    onMessage={(event) => {
                                        var id = JSON.parse(event.nativeEvent.data).id;
                                        // var name = JSON.parse(event.nativeEvent.data).name;
                                        this.getLongknowledge(id);
                                    }}
                                    javaScriptEnabled={true}
                                    scalesPageToFit={Platform.OS === 'ios' ? true : false}
                                    source={{ html: this.state.knowledgeList }}
                                ></WebView>
                                : <Text>知识点数据为请求到或没有数据</Text>
                        }
                    </View>
                </Modal>
            );
        }
    }
    //设置属性悬浮框组件 传递的props方法，用来修改
    setAllProperty = (
        studyRank,
        studyRankId,
        channelNameList,
        studyClass,
        studyClassId,
        studyClassList,
        edition,
        editionId,
        editionList,
        book,
        bookId,
        bookList
    ) => {
        //重新修改state有关试题请求的参数，重新请求试题
        this.setState({
            filterModelVisiblity: false,
            knowledgeModelVisibility: true,
            studyRank: studyRank,
            studyRankId: studyRankId,
            channelNameList: channelNameList,
            studyClass: studyClass,
            studyClassId: studyClassId,
            studyClassList: studyClassList,
            editino: edition,
            editionId: editionId,
            editionList: editionList,
            book: book,
            bookId: bookId,
            bookList: bookList,
            knowledge: '',
            knowledgeCode: '',
            knowledgeList: ''
        });
    }

    //设置属性悬浮框点击“确定”按钮，需要重新请求试题
    setFetchAgainProperty = (paramsObj) => {
        pageNo = 1; //当前第几页
        dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
        allPageNo = 0; //总数

        console.log('---------setFetchAgainProperty---------');
        console.log(paramsObj);
        console.log('---------------------------------------');
        let paramsDataPropsTemp = {
            name: this.props.paramsData.name,
            introduction: this.props.paramsData.introduction,
            studyRank: paramsObj.studyRank,
            studyRankId: paramsObj.studyRankId,
            studyClass: paramsObj.studyClass,
            studyClassId: paramsObj.studyClassId,
            edition: paramsObj.edition,
            editionId: paramsObj.editionId,
            book: paramsObj.book,
            bookId: paramsObj.bookId,
            knowledge: paramsObj.knowledge,
            knowledgeCode: paramsObj.knowledgeCode,
        };
        let paperTypeTtem = '';
        if (paramsObj.paperType == '全部') {
            paperTypeTtem = 'all';
        } else {
            paperTypeTtem = paramsObj.paperType;
        }
        console.log('-----试题类型----', paperTypeTtem);
        this.setState({
            filterModelVisiblity: false,
            knowledgeModelVisibility: false,
            shareTag: paramsObj.shareTag,
            paramsDataProps: paramsDataPropsTemp,

            paperTypeName: paperTypeTtem, //试题库试题类型
            paperList: [], //试题库试题
            selectPaperIndex: 0, //选中的试题索引
            updatePaperIndex: 0, //添加到试卷中的试题当前显示的试题索引
        });
    }

    //从接口中获取知识点内容
    showKnowledgeList = () => {
        const { studyClassId, editionId, bookId } = this.state;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getKnowledgeAllTree.do";
        const params = {
            subjectCode: studyClassId,
            textBookCode: editionId,
            gradeLevelCode: bookId,
            //callback:'ha',
        };

        console.log('-----showKnowledgeList-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('--------知识点数据------', typeof (resJson.data));
                console.log(resJson.data);
                console.log('------------------------');
                if (resJson.data != null || resJson.data != '') {
                    this.setState({ knowledgeList: resJson.data });
                } else {
                    Alert.alert('', '没有相关知识点', [{}, { text: '关闭', onPress: () => { } }]);
                    // this.setState({ knowledgeList: '' });
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

    //修改导航选中标志(添加试题、调整顺序、布置作业)
    updateFlag = (type, flag) => {
        if (type == 1) {  //添加试题
            if (flag == true) { //目前就是添加试题页面
                this.setState({
                    updatePaperFlag: false,
                    pushPaperFlag: false,
                })
            } else {
                this.setState({
                    addPaperFlag: true,
                    updatePaperFlag: false,
                    pushPaperFlag: false,

                    baseTypeIdLists: [],
                    //selectPaperIndex: 0, //选中的试题索引
                })
            }
        } else if (type == 2) { //调整试题顺序
            if (flag == true) {
                this.setState({
                    addPaperFlag: false,
                    pushPaperFlag: false,
                })
            } else {
                if (this.state.selectPaperList.length > 0) {
                    this.sortSelectPaperList();
                    this.setState({
                        addPaperFlag: false,
                        updatePaperFlag: true,
                        pushPaperFlag: false,

                        updatePaperIndex: 0, //添加到试卷中的试题当前显示的试题索引
                    })
                } else {
                    Alert.alert('', '暂无选中试题', [{}, { text: '关闭', onPress: () => { } }]);
                    Toast.showInfoToast('暂无选中试题', 1000);
                }
            }
        } else if (type == 3) { //布置作业
            // const { paperObject } = this.state;
            // if(JSON.stringify(paperObject) == "{}"){ //生成试卷对象
            //     this.createPaperObject();
            // }
            if (flag == true) {
                this.setState({
                    addPaperFlag: false,
                    updatePaperFlag: false,
                })
            } else {
                if (this.state.selectPaperList.length > 0) {
                    if (this.state.paperId == '') { //调接口，获取paperId
                        this.fetchPaperId();
                    }
                    // if(this.state.baseTypeIdLists.length <= 0){
                    //     this.sortSelectPaperList();
                    //     // this.createPaperObject(); //生成试卷对象
                    //     // console.log('-------排序并生成试题-----',this.state.paperObject , this.state.selectPaperList.length);
                    // }else{
                    //     // this.createPaperObject();
                    //     // console.log('-------生成试题-----',this.state.paperObject , this.state.selectPaperList.length);
                    // }
                    if (this.props.paramsData.type == 'update') {
                        if (this.state.baseTypeIdLists.length <= 0) {
                            this.sortSelectPaperList();
                        } else {
                            this.createPaperObject();
                        }
                    }

                    this.setState({
                        addPaperFlag: false,
                        updatePaperFlag: false,
                        pushPaperFlag: true,
                    })
                } else {
                    Alert.alert('', '暂无选中试题', [{}, { text: '关闭', onPress: () => { } }]);
                    Toast.showInfoToast('暂无选中试题', 1000);
                }
            }
        }
    }

    //生成试卷对象
    createPaperObject = () => {
        const { selectPaperList, baseTypeIdLists, paperId } = this.state;
        let papers = []; //
        let j = 0;
        let bigId = 1;
        let smallId = 0;
        //console.log('**********createPaperObject********', Date.parse(new Date()));
        for (let i = 0; i < baseTypeIdLists.length; i++) { //baseTypeIdLists和selectPaperList中的baseTypeId顺序一致
            // console.log('****baseTypeIdLists**i*',baseTypeIdLists[i] , i);
            for (j; j < selectPaperList.length; j++) {
                // console.log('***selectPaperList[j]**j*',selectPaperList[j].baseTypeId , j);
                if (selectPaperList[j].baseTypeId.indexOf(baseTypeIdLists[i]) < 0) {
                    bigId++;
                    smallId = 1;
                } else {
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
                if (selectPaperList[j].baseTypeId.indexOf(baseTypeIdLists[i]) < 0) { //新的baseTypeId          
                    j++;
                    break;
                }
            }
        }
        console.log('*******试卷题目数***********', papers.length);
        // for(let i = 0 ; i < papers.length ; i++){
        //     console.log(papers[i]);
        // }
        // console.log('**************************');
        let paperObj = { data: papers, paperId: paperId }
        console.log('*************paperObject****type***', typeof (paperObj));
        console.log(paperObj);
        console.log('**************************');
        this.setState({ paperObject: paperObj });
    }

    //布置试卷 设置接口参数
    setPushPapersParams = () => {
        const { assigntoWho, groupSelected, studentSelected, studentsList } = this.state;
        const classSecleted = this.state.class;
        var keTangId = classSecleted.keTangId; //课堂id
        var keTangName = classSecleted.keTangName; //课堂名
        var classIdOrGroupId = (classSecleted.classId).substring(0, (classSecleted.classId).length - 1);  //班级id
        var classOrGroupName = (classSecleted.className).substring(0, (classSecleted.className).length - 1); //班级名(接口返回的班级名后面自带一个逗号,)
        var learnType = ''; //作业布置方式 班级、个人70、小组50

        var stuIds = '';
        var stuNames = '';

        var startTime = this.state.startTime;
        var endTime = this.state.endTime;

        if (assigntoWho == '0') { //布置给班级 （有对应的学生信息需要拼装吗，接口传空值？）
            learnType = '70';
            stuIds = studentsList[0].ids;
            stuNames = studentsList[0].name;
            console.log('****班级******studentsList******', stuIds);
            console.log('*****班级*****studentsList******', stuNames);
            // console.log('**********studentsList.length******',studentsList.length);
            // return;
        } else if (assigntoWho == '1') { //布置给小组 拼装小组id、小组名 学生id、学生姓名
            learnType = '50';
            classIdOrGroupId = '';
            classOrGroupName = '';

            for (let i = 0; i < groupSelected.length; i++) {
                console.log('***小组*******groupSelected**id****', groupSelected[i].id);
                console.log('****小组******groupSelected**value****', groupSelected[i].value);
                console.log('****小组******stuId**id****', groupSelected[i].ids);
                console.log('****小组******stuNames**name****', groupSelected[i].name);
                classIdOrGroupId = classIdOrGroupId + groupSelected[i].id + ';';
                classOrGroupName = classOrGroupName + groupSelected[i].value + ';';

                stuIds = stuIds + groupSelected[i].ids + ';';
                stuNames = stuNames + groupSelected[i].name + ';';
            }
            classIdOrGroupId = classIdOrGroupId.substring(0, classIdOrGroupId.length - 1);
            classOrGroupName = classOrGroupName.substring(0, classOrGroupName.length - 1);
            stuIds = stuIds.substring(0, stuIds.length - 1);
            stuNames = stuNames.substring(0, stuNames.length - 1);
        } else { //布置给个人
            learnType = '70';

            for (let i = 0; i < studentSelected.length; i++) {
                console.log('****个人******stuId**id****', studentSelected[i].id);
                console.log('****个人******stuNames**name****', studentSelected[i].name);
                stuIds = stuIds + studentSelected[i].id + ',';
                stuNames = stuNames + studentSelected[i].name + ',';
            }
            stuIds = stuIds.substring(0, stuIds.length - 1);
            stuNames = stuNames.substring(0, stuNames.length - 1);
        }
        console.log('====================布置作业参数设置========================')
        console.log('learnType: ', learnType);
        console.log('keTangId: ', keTangId);
        console.log('keTangName: ', keTangName);
        console.log('classIdOrGroupId: ', classIdOrGroupId);
        console.log('classOrGroupName: ', classOrGroupName);
        console.log('stuIds: ', stuIds);
        console.log('stuNames: ', stuNames);
        console.log('===========================================================')
        return (
            {
                startTime: startTime + ':00',
                endTime: endTime + ':00',
                keTangId: keTangId,
                classOrGroupId: classIdOrGroupId,
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
        const paramsData = this.state.paramsDataProps;
        const { paperObject } = this.state;
        var papersJsonStr = JSON.stringify(paperObject); //js对象转化为json字符串
        return (
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
                pointName: paramsData.knowledge,
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
            flag: this.props.paramsData.type == 'create' ? 'save' : 'edit',
        }
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_assignJobToStudents.do";
        const params = {
            ...allParams,
            //callback:'ha',
        };
        // console.log('-----pushAndSavePaper-----', Date.parse(new Date()))
        WaitLoading.show('保存中...', -1)
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('****************resJson.success*********', resJson);
                if (resJson.success) {
                    Alert.alert(this.props.paramsData.name, '作业布置成功', [{},
                    {
                        text: '关闭', onPress: () => {
                            this.props.navigation.navigate({
                                name: "Teacher_Home",
                                params: {
                                    screen: "最新",
                                    params: {
                                        isRefresh: true,
                                    },
                                },
                                merge: true,
                            });
                        }
                    }
                    ]);
                } else {
                    WaitLoading.show_false()
                    console.log(resJson.message);
                    // Alert.alert(resJson.message);
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

    //点击“布置作业”页面的保存按钮，即保存但不布置试卷
    savePaper = () => {
        var saveParamsObj = this.setSavePapersParams();
        var allParams = {
            ...saveParamsObj,
            token: global.constants.token,
            assignType: 3, //表示只保存，不布置
            userName: global.constants.userName,
            paperName: this.props.paramsData.name,
            paperId: this.state.paperId,
            flag: this.props.paramsData.type == 'create' ? 'save' : 'edit',
        }
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_assignJobToStudents.do";
        const params = {
            ...allParams,
            //callback:'ha',
        };
        console.log('-----savePaper-----', Date.parse(new Date()))
        WaitLoading.show('保存中...', -1)
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);

                if (resJson.success) {
                    Alert.alert(this.props.paramsData.name, '作业保存成功', [{},
                    {
                        text: '关闭', onPress: () => {
                            this.props.navigation.navigate({
                                name: "Teacher_Home",
                                params: {
                                    screen: "教学内容",
                                    params: {
                                        isRefresh: true,
                                    },
                                },
                                merge: true,
                            });
                        }
                    }
                    ]);
                } else {
                    WaitLoading.show_false()
                    console.log(resJson.message);
                    // Alert.alert(resJson.message);
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

    //当前页面显示的题目是否添加到试题中(添加试题小页面)
    ifSelected = () => {
        const { selectPaperIndex, selectPaperList, paperList } = this.state;
        let i = false;
        for (i = 0; i < selectPaperList.length; i++) {
            if (selectPaperList[i].questionId == paperList[selectPaperIndex].questionId) {
                return true;
            }
        }
        if (i >= selectPaperList.length) {
            return false;
        }
        // console.log('================试题是否被选择=========================' , selectPaperList.includes(paperList[selectPaperIndex]));
        // return (selectPaperList.includes(paperList[selectPaperIndex])); 
    }

    //将已选择的试题进行排序(调整顺序小页面)
    sortSelectPaperList = () => {
        const { selectPaperList } = this.state;
        var selectPaperListCopy = selectPaperList;

        var baseTypeIdList = []; //记录选中题目的baseTypeId个数
        if (selectPaperListCopy.length > 0) {
            var baseTypeIdtemp = selectPaperListCopy[0].baseTypeId;
            baseTypeIdList.push(baseTypeIdtemp);
            for (let i = 0; i < selectPaperListCopy.length; i++) { //获取选中题目的baseTypeId个数    
                if (selectPaperListCopy[i].baseTypeId.indexOf(baseTypeIdtemp) < 0) {
                    if (baseTypeIdList.indexOf(selectPaperListCopy[i].baseTypeId) < 0) {
                        baseTypeIdList.push(selectPaperListCopy[i].baseTypeId);
                        baseTypeIdtemp = selectPaperListCopy[i].baseTypeId;
                    }
                }
            }
        }
        console.log('-------baseTypeIdList-----', baseTypeIdList);
        baseTypeIdList.sort();
        console.log('-----baseTypeIdList--sort---', baseTypeIdList);
        //调整顺序（相同类型在一块）
        var tempPaperList = [];
        for (let i = 0; i < baseTypeIdList.length; i++) {
            // console.log('----试题类型---' , paperTypeList[i]);
            for (let j = 0; j < selectPaperListCopy.length; j++) {
                // console.log('----添加试题类型---' , selectPaperListCopy[j].typeName);
                if (selectPaperListCopy[j].baseTypeId == baseTypeIdList[i]) {
                    // console.log('----类型一致-------');
                    tempPaperList.push(selectPaperListCopy[j]);//添加的试题
                }
            }
        }
        this.setState({
            selectPaperList: tempPaperList,
            baseTypeIdLists: baseTypeIdList.length > 0 ? baseTypeIdList : [],
        }, () => {
            if (this.state.pushPaperFlag) {
                this.createPaperObject();
            }
        })
    }

    getIndex = () => {
        const { selectPaperIndex, selectPaperList, paperList } = this.state;
        let i = -1;
        for (i = 0 ; i < selectPaperList.length; i++) {
            if (selectPaperList[i].questionId == paperList[selectPaperIndex].questionId) {
                return i;
            }
        }
        if (i >= selectPaperList.length) {
            return -1;
        }
    }

    //修改选中题目数(添加试题小页面)
    updateSlectNum = (flag) => {
        console.log('=======================修改选中题目数============================');
        const { selectPaperIndex, selectPaperList, paperList } = this.state;
        if (flag == true) { //删除试题
            console.log('=======================删除试题============================');
            // var index = selectPaperList.indexOf(paperList[selectPaperIndex]); //查询要删除元素的位置
            var index = this.getIndex();
            var selectPaperListCopy = selectPaperList;
            if (index >= 0) {
                selectPaperListCopy.splice(index, 1); //删除指定位置元素

                this.setState({
                    selectPaperNum: this.state.selectPaperNum - 1,
                    selectPaperList: selectPaperListCopy,
                }, () => {
                    console.log('=======================删除试题=========成功===================');
                })
            }
        } else {  //添加试题
            console.log('=======================添加试题============================');
            var selectPaperListCopy = selectPaperList;
            selectPaperListCopy.push(paperList[selectPaperIndex]);

            this.setState({
                selectPaperNum: this.state.selectPaperNum + 1,
                selectPaperList: selectPaperListCopy,
            }, () => {
                console.log('=======================添加试题=========成功===================');
            })
        }
    }

    //调整顺序小页面 删除试题
    deletePaperTitle = () => {
        const { updatePaperIndex, selectPaperList } = this.state;
        console.log('------删除添加的试题index----', updatePaperIndex);
        var selectPaperListCopy = selectPaperList;
        if (updatePaperIndex >= 0) {
            selectPaperListCopy.splice(updatePaperIndex, 1); //删除指定位置元素

            var baseTypeIdList = []; //记录选中题目的baseTypeId个数
            if (selectPaperListCopy.length > 0) {
                var baseTypeIdtemp = selectPaperListCopy[0].baseTypeId;
                baseTypeIdList.push(baseTypeIdtemp);
                for (let i = 0; i < selectPaperListCopy.length; i++) { //获取选中题目的baseTypeId个数    
                    if (selectPaperListCopy[i].baseTypeId.indexOf(baseTypeIdtemp) < 0) {
                        if (baseTypeIdList.indexOf(selectPaperListCopy[i].baseTypeId) < 0) {
                            baseTypeIdList.push(selectPaperListCopy[i].baseTypeId);
                            baseTypeIdtemp = selectPaperListCopy[i].baseTypeId;
                        }
                    }
                }
            }
            console.log('-----baseTypeIdList--delete---', baseTypeIdList);
            this.setState({
                selectPaperNum: this.state.selectPaperNum - 1,
                //若删除的是最后一道题，则页面显示selectPaperList最新的最后一道题
                updatePaperIndex: updatePaperIndex == selectPaperList.length ?
                    selectPaperList.length - 1 : updatePaperIndex,
                selectPaperList: selectPaperListCopy,
                baseTypeIdLists: baseTypeIdList,
            })
        }
    }

    //获取试题库试题类型
    fetchPaperType = () => {
        const paramsData = this.state.paramsDataProps;
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

        console.log('-----fetchPaperType-----', Date.parse(new Date()), this.state.paperTypeList)
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('--------试题库试题类型数据------');
                console.log(resJson.data);
                console.log('------------------------');

                typeAll = resJson.data.length; //总类型数
                // console.log('****paperListCopyLength****' , paperListTwo.length);
                if (resJson.data.length > 0) {
                    this.setState({ paperTypeList: resJson.data });
                } else {
                    Toast.showInfoToast('该知识点没有对应的试题', 1000);
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
        this.state.paperList.length <= 0
            ? this.fetchData()
            : null
        if (this.state.paperList.length <= 0) {
            console.log('======================this.state.paperList.length <= 0============================');
            return (
                <View style={{ ...styles.bodyView, height: screenHeight }}>
                    <View style={styles.paperSelectNumView}>
                        <Text style={styles.selectPaperNum}>(已选中{this.state.selectPaperNum})</Text>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 18,
                                color: 'black',
                                paddingTop: 40,
                                textAlign: 'center'
                            }}
                        >请点击右上角图标修改筛选条件查找试题</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.bodyView}>
                    {/**选中题目数 添加此试题或删除此试题 */}
                    <View style={{...styles.paperSelectNumView,height:40}}>
                        {console.log('=============view高度==================', styles.paperSelectNumView.height)}
                        <Text style={styles.selectPaperNum}>
                            (已选中{this.state.selectPaperNum})
                        </Text>
                        {
                            this.state.paperList.length > 0 && this.ifSelected() ?
                                <TouchableOpacity 
                                    onPress={() => { 
                                        this.updateSlectNum(true);
                                    }}
                                    style={{width: 30,height: 40,}}
                                >
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                            top: 5,
                                            // left: screenWidth * 0.652,
                                            // position: 'absolute',
                                        }}
                                        source={require('../../../../assets/teacherLatestPage/shanchu.png')}
                                    />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity 
                                    onPress={() => {
                                        this.updateSlectNum(false);
                                    }}
                                    style={{width: 30,height: 40,}}
                                >
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                            top: 5,
                                            // left: screenWidth * 0.65,
                                            // position: 'absolute',
                                        }}
                                        source={require('../../../../assets/teacherLatestPage/tianjia.png')}
                                    />
                                </TouchableOpacity>
                        }
                    </View>

                    {/**题目展示 */}
                    <View style={styles.showPaper}>
                        {/**题目 答案 解析*/}
                        {
                            this.state.paperList.length > 0 ? this.showAllPaperTitle() : null
                        }
                    </View>
                </View>
            );
        }
    }

    //显示添加试题页面所有试题
    showAllPaperTitle = () => {
        const { selectPaperIndex, paperList } = this.state;
        console.log('&&&&&&&&&&&&&总数&&&&&&selectindex******', paperList.length, selectPaperIndex);
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {/**题面 */}
                {/* {console.log('---题目-----' ,paperList[selectPaperIndex].tiMian)} */}
                <Text style={styles.paperContent}>[题面]</Text>
                <View style={{ padding: 10 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: paperList[selectPaperIndex].tiMian }}></RenderHtml>
                </View>


                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**答案 */}
                <Text style={styles.paperContent}>[答案]</Text>
                <View style={{ padding: 10 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: paperList[selectPaperIndex].answer }}></RenderHtml>
                </View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**解析 */}
                <Text style={styles.paperContent}>[解析]</Text>
                <View style={{ padding: 10 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: paperList[selectPaperIndex].analysis }}></RenderHtml>
                </View>
            </ScrollView>
        );
    }


    //展示添加试题页面底部
    showAddPaperBottom = () => {
        if (this.state.paperList.length > 0) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', ...styles.bottomView, }}>
                    <TouchableOpacity
                        style={{ width: screenWidth * 0.1, paddingLeft: 5 }}
                        onPress={() => {
                            if(pageNo == 1){
                                Alert.alert('', '已经是第一页试题了', [{}, { text: '关闭', onPress: () => { } }]);
                            }else{
                                pageNo--;
                                this.fetchData();
                            }
                        }}
                    >
                        <Image
                            style={{ width: 25, height: 25, }}
                            source={require('../../../../assets/teacherLatestPage/back.png')}
                        ></Image>
                    </TouchableOpacity>
                    {/**显示底部试题类型图标 */}
                    <View style={{ width: screenWidth * 0.8, flexDirection: 'row', alignItems: 'center' }}>
                        {this.showPaperTypeImg()}
                    </View>
                    <TouchableOpacity
                        style={{ width: screenWidth * 0.1, paddingLeft: 11 }}
                        onPress={() => {
                            if(pageNo != allPageNo){
                                pageNo++;
                                this.fetchData();
                            }else{
                                Alert.alert('', '已经是最后一页试题了', [{}, { text: '关闭', onPress: () => { } }]);
                            }
                        }}
                    >
                        <Image
                            style={{ width: 25, height: 25, }}
                            source={require('../../../../assets/teacherLatestPage/next.png')}
                        ></Image>
                    </TouchableOpacity>
                </View>
            );
        }
    }


    //显示底部试题类型图标
    showPaperTypeImg = () => {
        const { paperList, selectPaperIndex } = this.state;
        // console.log('&&&&&&&&&&selectPaperIndex&&Math&&&', selectPaperIndex , (Math.floor(paperList.length / 5) - 1) * 5);
        let content = [];
        for (let i = 0; i < paperList.length; i++) {
            let paperTypeImg;
            if (paperList[i].baseTypeId == '101') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/101.png');
            } else if (paperList[i].baseTypeId == '102') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/102.png');
            } else if (paperList[i].baseTypeId == '103') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/103.png');
            } else if (paperList[i].baseTypeId == '104') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/104.png');
            } else if (paperList[i].baseTypeId == '106') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/106.png');
            } else if (paperList[i].baseTypeId == '108') {
                if (paperList[i].typeName.indexOf('填空')) {
                    paperTypeImg = require('../../../../assets/teacherLatestPage/109.png');
                } else {
                    paperTypeImg = require('../../../../assets/teacherLatestPage/108.png');
                }
            } else {
                paperTypeImg = require('../../../../assets/teacherLatestPage/107.png');
            }
            content.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => {
                        if (selectPaperIndex != i) {
                            console.log('-----------select----i---', i);
                            this.setState({
                                selectPaperIndex: i,
                            })
                        }
                    }}
                >
                    <Image
                        source={paperTypeImg}
                        style={selectPaperIndex == i ? styles.checked : styles.little_image}
                    />
                </TouchableOpacity>
            );
        }
        return content;
    }


    //请求试题
    fetchData = () => {
        const paramsData = this.state.paramsDataProps;
        const userName = global.constants.userName;
        const token = global.constants.token;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getAllQuestions.do";
        const params = {
            teacherId: userName,
            currentpage: pageNo,
            channelCode: paramsData.studyRankId,
            subjectCode: paramsData.studyClassId,
            textBookCode: paramsData.editionId,
            gradeLevelCode: paramsData.bookId,
            pointCode: paramsData.knowledgeCode,
            questionTypeName: this.state.paperTypeName,
            shareTag: this.state.shareTag,
            token: token,
            //callback:'ha',
        };

        console.log('-----fetchData---pageNo---试题类型---', pageNo, this.state.paperTypeName, Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                let paperListOne = resJson.data;
                // console.log('----paperListOne-----', paperListOne);
                let paperLength; //当前请求页试题数目
                if (paperListOne == null) {
                    //console.log('!!!!!params!!!!resJson!!!' , params , resJson);
                    //参数存在问题token失效等
                    Alert.alert('', resJson, [{}, { text: '关闭', onPress: () => { } }]);
                    return;
                } else {
                    paperLength = paperListOne != '' ? paperListOne.length : 0;
                }
                console.log('***pageNo**currentFecthLength***', pageNo, paperLength, Date.parse(new Date()));
                //试题请求接口每次最多返回5个数据
                if(paperLength != 0){
                    this.setState({ paperList: paperListOne , selectPaperIndex: 0 });
                }else{
                    allPageNo = pageNo - 1;
                    pageNo--;
                    // Alert.alert('', '未请求到试题', [{}, { text: '关闭', onPress: () => { } }]);
                }
                if(paperLength < 5){
                    allPageNo = pageNo;
                    dataFlag = false; //数据加载完了
                    console.log('==================所有试题都加载完了===========================', Date.parse(new Date()));
                    // Alert.alert('', '已经是最后一页试题了' , [{}, { text: '关闭', onPress: () => { } }]);
                }

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

    //向上（前）移动试卷题目（同类型之间移动）
    moveUpPaper = () => {
        const { updatePaperIndex, selectPaperList } = this.state;
        if (updatePaperIndex == 0) {
            Alert.alert('', '已经是第一道题了', [{}, { text: '关闭', onPress: () => { } }]);
            Toast.showInfoToast('已经是第一道题了', 1000);
        } else {
            const baseTypeId1 = selectPaperList[updatePaperIndex].baseTypeId;
            const baseTypeId2 = selectPaperList[updatePaperIndex - 1].baseTypeId;
            if (baseTypeId1 != baseTypeId2) {
                Alert.alert('', '类型不一致，不能移动', [{}, { text: '关闭', onPress: () => { } }]);
                Toast.showInfoToast('类型不一致，不能移动', 1000);
            } else {
                const tempPaperList = selectPaperList;
                const tempPaperItem = selectPaperList[updatePaperIndex]; //移动项
                tempPaperList[updatePaperIndex] = tempPaperList[updatePaperIndex - 1];
                tempPaperList[updatePaperIndex - 1] = tempPaperItem;
                this.setState({
                    selectPaperList: tempPaperList,
                    updatePaperIndex: updatePaperIndex - 1,
                });
            }
        }
    }

    //向下（后）移动试卷题目（同类型之间移动）
    moveDownPaper = () => {
        const { updatePaperIndex, selectPaperList } = this.state;
        if (updatePaperIndex == (selectPaperList.length - 1)) {
            Alert.alert('', '已经是最后一道题了', [{}, { text: '关闭', onPress: () => { } }]);
            Toast.showInfoToast('已经是最后一道题了', 1000);
        } else {
            const baseTypeId1 = selectPaperList[updatePaperIndex].baseTypeId;
            const baseTypeId2 = selectPaperList[updatePaperIndex + 1].baseTypeId;
            if (baseTypeId1 != baseTypeId2) {
                Alert.alert('', '类型不一致，不能移动', [{}, { text: '关闭', onPress: () => { } }]);
                Toast.showInfoToast('类型不一致，不能移动', 1000);
            } else {
                const tempPaperList = selectPaperList;
                const tempPaperItem = selectPaperList[updatePaperIndex]; //移动项
                tempPaperList[updatePaperIndex] = tempPaperList[updatePaperIndex + 1];
                tempPaperList[updatePaperIndex + 1] = tempPaperItem;
                this.setState({
                    selectPaperList: tempPaperList,
                    updatePaperIndex: updatePaperIndex + 1,
                });
            }
        }
    }

    //调整试题页面
    showUpdatePaper = () => {
        // if(this.props.type == 'update' && this.state.selectPaperList.length <= 0){
        //     this.fetchPaperEditContent();
        // }
        if (this.state.selectPaperList.length > 0) {
            return (
                <View style={styles.bodyView}>
                    {/**选中题目数 删除此试题 */}
                    <View style={styles.paperSelectNumView}>
                        <Text style={styles.selectPaperNum}>
                            {this.state.updatePaperIndex + 1}
                            {'/'}
                            {this.state.selectPaperNum}
                        </Text>
                        {
                            //（同类型试题之间）移动试题 上移
                            <TouchableOpacity 
                                onPress={() => { this.moveUpPaper() }}
                                style={{width: 30,height: 40,}}
                            >
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        top: 5,
                                        // left: screenWidth * 0.4,
                                        // position: 'absolute',
                                    }}
                                    source={require('../../../../assets/teacherLatestPage/shangyi.png')}
                                />
                            </TouchableOpacity>
                        }
                        {
                            //（同类型试题之间）移动试题 下移
                            <TouchableOpacity 
                                onPress={() => { this.moveDownPaper() }}
                                style={{width: 31,height: 40,left: 20}}
                            >
                                <Image
                                    style={{
                                        width: 31,
                                        height: 31,
                                        top: 5,
                                        // left: screenWidth * 0.53,
                                        // position: 'absolute',
                                    }}
                                    source={require('../../../../assets/teacherLatestPage/xiayi.png')}
                                />
                            </TouchableOpacity>
                        }
                        {
                            <TouchableOpacity 
                                onPress={() => { this.deletePaperTitle() }}
                                style={{width: 30,height: 40,left: 40}}
                            >
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        top: 5,
                                        // left: screenWidth * 0.652,
                                        // position: 'absolute',
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
                            this.state.selectPaperList.length > 0
                                ? this.showSelectedPaperTitle()
                                : Alert.alert('', '还没有选择试题', [{}, { text: '关闭', onPress: () => { } }])
                        }
                    </View>
                </View>
            );
        } else if (this.props.paramsData.type == 'update') {
            return (
                <View style={styles.bodyView}>
                    <View>
                        <Text
                            style={{
                                fontSize: 18,
                                color: 'black',
                                paddingTop: 40,
                                textAlign: 'center'
                            }}
                        >正在获取试卷中的试题，请耐心等待</Text>
                    </View>
                </View>
            );
        }
    }

    //展示被选中的试题题目等信息
    showSelectedPaperTitle = () => {
        const { updatePaperIndex, selectPaperList } = this.state;
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {/**题面 */}
                {/* {console.log('---题目-----' ,selectPaperList[updatePaperIndex].tiMian)} */}
                <Text style={styles.paperContent}>[题面]</Text>
                <View style={{ padding: 10 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: selectPaperList[updatePaperIndex].tiMian }}></RenderHtml>
                </View>


                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**答案 */}
                <Text style={styles.paperContent}>[答案]</Text>
                <View style={{ padding: 10 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: selectPaperList[updatePaperIndex].answer }}></RenderHtml>
                </View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**解析 */}
                <Text style={styles.paperContent}>[解析]</Text>
                <View style={{ padding: 10 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: selectPaperList[updatePaperIndex].analysis }}></RenderHtml>
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
        for (let paper_i = 0; paper_i < selectPaperList.length; paper_i++) {
            let paperTypeImg;
            if (selectPaperList[paper_i].baseTypeId == '101') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/101.png');
            } else if (selectPaperList[paper_i].baseTypeId == '102') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/102.png');
            } else if (selectPaperList[paper_i].baseTypeId == '103') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/103.png');
            } else if (selectPaperList[paper_i].baseTypeId == '104') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/104.png');
            } else if (selectPaperList[paper_i].baseTypeId == '106') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/106.png');
            } else if (selectPaperList[paper_i].baseTypeId == '108') {
                if (selectPaperList[paper_i].typeName.indexOf('填空')) {
                    paperTypeImg = require('../../../../assets/teacherLatestPage/109.png');
                } else {
                    paperTypeImg = require('../../../../assets/teacherLatestPage/108.png');
                }
            } else {
                paperTypeImg = require('../../../../assets/teacherLatestPage/107.png');
            }
            paperItems.push(
                <TouchableOpacity
                    key={paper_i}
                    onPress={() => {
                        if (this.state.updatePaperIndex != paper_i) {
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
        return (
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
        if (this.state.classNameVisibility) {
            this.setState({ classNameVisibility: false });
        } else {
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
            return (
                <View key={index}
                    style={this.state.className == item.keTangName ? styles.classNameViewSelected : styles.classNameView}
                >
                    <Text style={styles.classNameText}
                        onPress={() => {
                            if (this.state.className != item.keTangName) {
                                this.setState({
                                    classFlag: false,
                                    className: item.keTangName,
                                    keTangId: item.keTangId,
                                    class: item,
                                    groupList: [],
                                    studentsList: [],
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
            );
        })
        return content;
    }

    //修改布置对象
    updateAssign = (type) => {
        if (type == '0') {
            if (this.state.assigntoWho != '0') {
                this.setState({ assigntoWho: '0' });
            }
        } else if (type == '1') {
            if (this.state.assigntoWho != '1') {
                this.setState({ assigntoWho: '1' });
            }
        } else {
            if (this.state.assigntoWho != '2') {
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
                this.setState({ groupList: resJson.data.groupList, studentsList: resJson.data.classList });
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
        for (let i = 0; i < groupSelected.length; i++) {
            if (groupSelected[i].id == groupItem.id) {
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
        if (flag == true) { //在则删除
            for (let i = 0; i < groupSelected.length; i++) {
                if (groupSelected[i].id != groupItem.id) {
                    groups.push(groupSelected[i]);
                }
            }
            this.setState({ groupSelected: groups });
        } else { //不在则添加
            groups = groupSelected;
            groups.push(groupItem);
            this.setState({ groupSelected: groups });
        }
    }

    //查看学生是否在已选择的学生列表中
    IsInStudentSelected = (studentItem) => {
        const { studentSelected } = this.state;
        // console.log('-------studentSelected------',studentSelected.length);
        for (let i = 0; i < studentSelected.length; i++) {
            if (studentSelected[i].id == studentItem.id) {
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
        if (flag == true) { //在则删除
            for (let i = 0; i < studentSelected.length; i++) {
                if (studentSelected[i].id != studentItem.id) {
                    students.push(studentSelected[i]);
                }
            }
            this.setState({ studentSelected: students });
        } else { //不在则添加
            students = studentSelected;
            students.push(studentItem);
            this.setState({ studentSelected: students });
        }
    }

    //分割获取到的学生信息字符串（个人列表中的学生信息)
    splitStudents = () => {
        const { studentsList, studentsListTrans } = this.state;
        if (studentsList.length > 0 && studentsListTrans.length <= 0) {
            let studentsNameList = [];
            let studentsIdList = [];
            let students = [];

            console.log('*****studentsList.length**', studentsList.length);
            console.log('*****classList**', studentsList);
            for (let i = 0; i < studentsList.length; i++) {
                let names = studentsList[i].name.split(','); //姓名分割
                names.map((item, index) => {
                    studentsNameList.push(item);
                });
                console.log('*****names**', names);
                let Ids = studentsList[i].ids.split(','); //id分割
                Ids.map((item, index) => {
                    studentsIdList.push(item);
                });
                console.log('*****Ids**', Ids);
            }
            for (let i = 0; i < studentsNameList.length; i++) { //组装分割的姓名+id
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
        if (this.state.className == '') {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10, }}>请先选择课堂</Text>
                </View>
            );
        } else {
            if (assigntoWho == '0') { //班级
                return (
                    <View
                        style={this.state.classFlag == false ?
                            { width: screenWidth * 0.4, height: 40, marginTop: 10, marginLeft: 20, borderRadius: 5, backgroundColor: '#DCDCDC', justifyContent: 'center' }
                            : { width: screenWidth * 0.4, height: 40, marginTop: 10, marginLeft: 20, borderRadius: 5, backgroundColor: '#fff', justifyContent: 'center', borderWidth: 1, borderColor: 'red' }
                        }
                    >
                        <Text
                            style={{ fontSize: 16, color: 'black', fontWeight: '400', textAlign: 'center' }}
                            onPress={() => {
                                if (this.state.groupList.length <= 0 && this.state.studentsList.length <= 0) {
                                    if (this.state.class != null) { //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                                    }
                                }
                                this.splitStudents(); //分割获取到的学生信息
                                if (this.state.classFlag) {
                                    this.setState({ classFlag: false });
                                } else {
                                    this.setState({ classFlag: true });
                                }
                            }}
                        >
                            {this.state.class.className.substring(0, this.state.class.className.length - 1)}
                        </Text>
                    </View>
                );
            } else if (assigntoWho == '1') { //小组
                if (this.state.groupList.length <= 0 && this.state.studentsList.length <= 0) {
                    if (this.state.class != null) { //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                    }
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                if (this.state.groupList.length > 0) {
                    content = this.state.groupList.map((item, index) => {
                        return (
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <View key={index}
                                    style={this.IsInGroupSelected(item) ? styles.groupViewSelected : styles.groupView}
                                >
                                    <Text style={styles.groupItem}
                                        onPress={() => { this.updateGroupSelected(item) }}
                                    >
                                        {item.value}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }
                return (
                    this.state.groupList.length > 0
                        ? content
                        : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10, }}>
                                您还没有创建小组，可以前往电脑端进行创建</Text>
                        </View>
                );
            } else { //个人
                if (this.state.groupList.length <= 0 && this.state.studentsList.length <= 0) {
                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                    if (this.state.class != null) { //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                    }
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                const { studentsListTrans } = this.state;
                if (studentsListTrans.length > 0) {
                    content = studentsListTrans.map((item, index) => {
                        return (
                            <View key={index}
                                style={this.IsInStudentSelected(item) ? {
                                    width: screenWidth * 0.22,
                                    height: 40,
                                    borderRadius: 5,
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
                                        width: screenWidth * 0.22,
                                        height: 40,
                                        borderRadius: 5,
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
                                    onPress={() => { this.updateStudentSelected(item) }}
                                >
                                    {item.name}
                                </Text>
                            </View>
                            // <View style={{height: 5}}></View>
                        )
                    })
                }
                return (
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
                        : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10, }}>
                                当前班级没有学生信息</Text>
                        </View>
                );
            }
        }
    }

    //设置开始时间
    setStartTime = (time) => {
        this.setState({ startTime: time, endTime: this.nextDay(time.substring(0, 10)) });
    }

    nextDay(str) {
        var year = parseInt(str.substring(0, 4))
        var month = parseInt(str.substring(5, 7))
        var day = parseInt(str.substring(8, 10))
        if (month == 2 && day == 28 && year % 100 == 0 && yaer % 400 != 0) {
            month = 3
            day = 1
        } else if (month == 2 && day == 28 && day % 4 != 0) {
            month = 3
            day = 1
        } else if (month == 2 && day < 28) {
            day += 1
        } else if (day == '30' && (month == '2' || month == '4' || month == '6' || month == '9' || month == '11')) {
            month += 1
            day = 1
        } else if (day == '31') {
            day = 1
            if (month < 12) {
                month = month + 1
            } else {
                month = 1
                year += 1
            }
        } else {
            day += 1
        }
        return year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0') + ' 23:59'
    }

    //设置结束时间
    setEndTime = (time) => {
        this.setState({ endTime: time });
    }

    //布置作业页面
    showPushPaper = () => {
        return (
            <View style={{ ...styles.bodyView, height: '82%' }}>
                {/**布置 保存 */}
                <View style={{ ...styles.paperSelectNumView, justifyContent: 'space-around' }}>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            color: '#4DC7F8',
                            top: 10,
                        }}
                        onPress={() => { Alert.alert('', '点击下方确定按钮可布置', [{}, { text: '关闭', onPress: () => { } }]) }}
                    >布置</Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '500',
                            color: 'black',
                            top: 10,
                        }}
                        onPress={() => { this.savePaper() }}
                    >保存</Text>
                </View>
                <ScrollView style={{ height: '100%' }}>
                    {/**开始时间 */}

                    <View style={{ flexDirection: 'row', padding: 15, paddingLeft: 20, alignItems: 'center', borderBottomWidth: 0.5 }}>
                        <Text style={{ fontSize: 15, marginRight: 40 }}>开始时间:</Text>
                        <Text style={{ fontSize: 15, }}>{this.state.startTime}</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 20, flexDirection: 'row' }} >
                            <DateTime style={{ position: 'absolute', right: 20, flexDirection: 'row' }} setDateTime={this.setStartTime} selectedDateTime={this.state.startTime} />
                        </TouchableOpacity>
                    </View>



                    {/**分割线 */}
                    {/* <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} /> */}

                    {/**结束时间 */}
                    <View style={{ flexDirection: 'row', padding: 15, paddingLeft: 20, alignItems: 'center', borderBottomWidth: 0.5 }}>
                        <Text style={{ fontSize: 15, marginRight: 40 }}>结束时间:</Text>
                        <Text style={{ fontSize: 15 }}>{this.state.endTime}</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 20, flexDirection: 'row' }} >
                            <DateTime setDateTime={this.setEndTime} selectedDateTime={this.state.endTime} />
                        </TouchableOpacity>
                    </View>

                    {/**分割线 */}
                    {/* <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} /> */}

                    {/**选择课堂 */}
                    {/* <View style={{flexDirection:'row',width:screenWidth}}>
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
                    </View> */}
                    <View style={{ borderBottomWidth: 1, padding: 15, paddingLeft: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, marginRight: 40 }}>选择课堂:</Text>
                            <Text style={{ fontSize: 15, marginRight: 20 }}>{this.state.className}</Text>
                            <TouchableOpacity onPress={() => { this.setState({ classNameVisibility: !this.state.classNameVisibility }) }} style={{ position: 'absolute', right: 10 }}>
                                <Image style={{ width: 20, height: 20 }} source={this.state.classNameVisibility ? require('../../../../assets/image3/top.png') : require('../../../../assets/image3/bot.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        {/**可选课堂列表 */}
                        {this.state.classNameVisibility ?
                            (<View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
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
                            ) : (<View></View>)
                        }
                    </View>

                    {/**分割线 */}
                    {/* <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} /> */}

                    {/**布置 */}
                    <View style={{ flexDirection: 'row', height: 60, alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, marginRight: 40, marginLeft: 30 }}>布置给:</Text>
                        {/**班级 小组  个人 */}
                        <TouchableOpacity style={{ marginRight: 30 }} onPress={() => { this.updateAssign('0'); this.setState({ SelectKeTangStatus: false }) }}>
                            <View style={{ height: 30, width: screenWidth * 0.15, justifyContent: 'center', borderRadius: 5, alignItems: 'center', backgroundColor: this.state.assigntoWho == '0' ? '#4DC7F8' : '#fff' }}>
                                <Text style={{ fontSize: 15 }}>班级</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { this.updateAssign('1'); this.setState({ SelectKeTangStatus: false }) }}>
                            <View style={{ height: 30, width: screenWidth * 0.15, justifyContent: 'center', borderRadius: 5, alignItems: 'center', backgroundColor: this.state.assigntoWho == '1' ? '#4DC7F8' : '#fff' }}>
                                <Text>小组</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { this.updateAssign('2'); this.setState({ SelectKeTangStatus: false }) }}>
                            <View style={{ height: 30, width: screenWidth * 0.15, justifyContent: 'center', borderRadius: 5, alignItems: 'center', backgroundColor: this.state.assigntoWho == '2' ? '#4DC7F8' : '#fff' }}>
                                <Text>个人</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/**分割线 */}
                    {/* <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} /> */}
                    {/**布置对象列表 */}
                    <ScrollView>
                        <View style={{ alignItems: 'flex-start', marginTop: 15, marginBottom: 50, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {this.showAssignToWho()}
                        </View>
                    </ScrollView>
                    {/* {this.showAssignToWho()} */}
                </ScrollView>
            </View>
        );
    }

    //布置作业页面底部按钮
    showPushPaperBottom = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff' }}>
                <Button style={{ width: '40%' }}
                    onPress={() => {
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
                <Button style={{ width: '40%' }}
                    onPress={() => {
                        const { startTime, endTime } = this.state;
                        const { className } = this.state;
                        const { assigntoWho } = this.state;
                        const { classFlag } = this.state;
                        const { groupSelected, studentSelected } = this.state;
                        if (
                            startTime == ''
                            || endTime == ''
                            || className == ''
                            || (assigntoWho == '0' && !classFlag)
                            || (assigntoWho == '1' && groupSelected.length == 0)
                            || (assigntoWho == '2' && studentSelected.length == 0)
                        ) {
                            Alert.alert('', '请选择以上属性', [{}, { text: '关闭', onPress: () => { } }]);
                        } else {
                            this.pushAndSavePaper();
                        }
                    }}
                >确定</Button>
            </View>
        );
    }


    render() {
        // console.log('----render----类式props---试题类型----', this.state.paperTypeList, Date.parse(new Date()));
        return (
            <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                {/**导航项 */}
                <View style={styles.routeView}>
                    {/**返回按钮 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >
                        <Image style={{ width: 30, height: 30 }} source={require('../../../../assets/teacherLatestPage/goback.png')}></Image>
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
                            onPress={() => {
                                this.updateFlag(1, this.state.addPaperFlag);
                            }}
                        >添加试题</Text>
                        <Text
                            style={this.state.updatePaperFlag ? styles.addPaperSelect : styles.updatePaper}
                            onPress={() => {
                                this.updateFlag(2, this.state.updatePaperFlag);
                            }}
                        >调整顺序</Text>
                        <Text
                            style={this.state.pushPaperFlag ? styles.addPaperSelect : styles.pushPaper}
                            onPress={() => {
                                this.updateFlag(3, this.state.pushPaperFlag);
                            }}
                        >布置作业</Text>
                    </View>
                    {/**筛选按钮 */}
                    {
                        this.state.addPaperFlag ?
                            <TouchableOpacity
                                onPress={() => {
                                    // Alert.alert('设置属性悬浮框');
                                    this.setState({ filterModelVisiblity: !this.state.filterModelVisiblity })
                                }}
                            >
                                <Image style={{ width: 20, height: 20 }} source={require('../../../../assets/teacherLatestPage/filter2.png')}></Image>
                            </TouchableOpacity>
                            : <View style={{ width: 20, height: 20 }} />
                    }
                    {
                        this.state.filterModelVisiblity || this.state.knowledgeModelVisibility ? this.showFilter() : null
                    }
                </View>
                <Waiting />
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
                            ? this.showUpdatePaperBottom()
                            : this.showPushPaperBottom()
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modelView: {
        top: '20%',
        left: screenWidth * 0.2,
        height: screenHeight * 0.8,
        width: screenWidth * 0.8,
        backgroundColor: 'gray',
    },
    routeView: {
        height: screenHeight * 0.1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 10,
    },
    bodyView: {
        height: screenHeight * 0.7,
        flexDirection: 'column',
    },
    bottomView: {
        //top: '100%',
        height: screenHeight * 0.2,
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
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#EBEDEC',
    },
    selectPaperNum: {
        fontSize: 18,
        color: '#8B8B7A',
        paddingLeft: 20,
        paddingTop: 7,
        width: 350
    },
    showPaper: {
        height: '90%',
        flexDirection: 'column',
    },
    little_image: {
        height: 60,
        width: screenWidth * 0.15,
        marginTop: 5,
        marginLeft: 3
    },
    checked: {
        height: 65,
        width: screenWidth * 0.16,
        marginLeft: 5,
        borderColor: '#FFA500',
        borderRadius: 5,
        borderWidth: 5,
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
        width: screenWidth * 0.3,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        //height:'100%',
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
    classNameView: {
        borderRadius: 5,
        width: screenWidth * 0.4,
        height: 40,
        marginLeft: 10,
        marginBottom: 5,
        backgroundColor: '#DCDCDC',
        borderWidth: 2,
        borderColor: '#fff',
    },
    classNameViewSelected: {
        borderRadius: 5,
        width: screenWidth * 0.4,
        height: 40,
        marginLeft: 10,
        marginBottom: 5,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: 'red',
    }, classNameText: {
        fontSize: 15,
        color: 'black',
        fontWeight: '300',
        paddingTop: 8,
        textAlign: 'center',
    }, groupView: {
        borderRadius: 5,
        width: screenWidth * 0.4,
        height: 40,
        backgroundColor: '#DCDCDC',
        marginTop: 3,
        marginBottom: 5,
        marginLeft: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    groupViewSelected: {
        borderRadius: 5,
        width: screenWidth * 0.4,
        height: 40,
        backgroundColor: '#fff',
        marginTop: 3,
        marginBottom: 5,
        marginLeft: 20,
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
    modalView: {
        height: '95%',
        marginTop: 60, //model覆盖框组件不会覆盖路由标题,但是点击顶部的路由返回箭头按钮没反应（组件覆盖）（modal组件visible为true）
        backgroundColor: "white",
        padding: 30,
        paddingBottom: 80,
        //justifyContent: "center",
        //alignItems: "center",
    },
})