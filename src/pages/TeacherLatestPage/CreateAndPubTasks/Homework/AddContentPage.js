import React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../../utils/http/request";
import Loading from "../../../../utils/loading/Loading"; 
import RenderHtml from 'react-native-render-html';


let pageNo = 1; //当前第几页
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
let allPageNo = 0; //总数

export default function AddContentPageContainer(props) {
    const navigation = useNavigation();
    //将navigation传给HomeworkProperty组件，防止路由出错
    return (
        <AddContentPage
            navigation={navigation}
            channelCode={props.channelCode}
            subjectCode={props.subjectCode}
            textBookCode={props.textBookCode}
            gradeLevelCode={props.gradeLevelCode}
            pointCode={props.pointCode}
            questionTypeName={props.questionTypeName}
            shareTag={props.shareTag}
            isFetchAgain={props.isFetchAgain}
            setIsFetchAgain={props.setIsFetchAgain}
        />
    );
}

class AddContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            channelCode: this.props.channelCode,
            subjectCode: this.props.subjectCode,
            textBookCode: this.props.textBookCode,
            gradeLevelCode: this.props.gradeLevelCode,
            pointCode: this.props.pointCode,
            questionTypeName: this.props.questionTypeName,
            shareTag: this.props.shareTag,

            contentList: [], //请求到的试题
            selectContentIndex: 0, //当前页面试题index
            selectContentNum: 0,
            selectContentList: [], //已选择试题列表
            imgState: true,

            error: false,
            errorInfo: '',
        }
    }

    UNSAFE_componentWillMount(){
    }

    UNSAFE_componentWillUpdate(nextProps) {
        console.log(
            "-------add-----------componentWillUpdate-----------------------------"
        );
        console.log("---------nextProps----------", nextProps.isFetchAgain);
        // console.log(nextProps.isFetchAgain);
        console.log("---------Props----------", this.props.isFetchAgain);
        // console.log(this.props.isFetchAgain);
        //重新筛选导学案属性
        if (
            // (this.props.channelCode != nextProps.channelCode
            // || this.props.subjectCode != nextProps.subjectCode
            // || this.props.textBookCode != nextProps.textBookCode
            // || this.props.gradeLevelCode != nextProps.gradeLevelCode
            // || this.props.pointCode != nextProps.pointCode
            // || this.props.questionTypeName != nextProps.questionTypeName
            // || this.props.shareTag!= nextProps.shareTag)
            // && nextProps.isFetchAgain
            nextProps.isFetchAgain != this.props.isFetchAgain &&
            nextProps.isFetchAgain
        ) {
            console.log(
                "===================props发生变化======================="
            );
            pageNo = 1; //当前第几页
            dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
            allPageNo = 0; //总数
            this.setState(
                {
                    channelCode: nextProps.channelCode,
                    subjectCode: nextProps.subjectCode,
                    textBookCode: nextProps.textBookCode,
                    gradeLevelCode: nextProps.gradeLevelCode,
                    pointCode: nextProps.pointCode,
                    questionTypeName: nextProps.questionTypeName,
                    shareTag: nextProps.shareTag,
                },
                () => {
                    this.props.setIsFetchAgain(false);
                    this.fetchData();
                }
            );
        }
    }

    componentWillUnmount(){
    }

    //请求试题
    fetchData = () => {
        const userName = global.constants.userName;
        const token = global.constants.token;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getAllQuestions.do";
        const params = {
            teacherId: userName,
            currentpage: pageNo,
            channelCode: this.state.channelCode,
            subjectCode: this.state.subjectCode,
            textBookCode: this.state.textBookCode,
            gradeLevelCode: this.state.gradeLevelCode,
            pointCode: this.state.pointCode,
            questionTypeName: this.state.questionTypeName,
            shareTag: this.state.shareTag,
            token: token,
            //callback:'ha',
        };

        console.log('-----fetchData---pageNo---试题类型---', pageNo, this.props.questionTypeName, Date.parse(new Date()))
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
                    this.setState({ contentList: paperListOne , selectContentIndex: 0 });
                }else{
                    allPageNo = pageNo - 1;
                    pageNo--;
                    // Alert.alert('', '未请求到试题', [{}, { text: '关闭', onPress: () => { } }]);
                }
                if(paperLength < 5){
                    allPageNo = pageNo;
                    dataFlag = false; //数据加载完了
                    console.log(
                        "==================所有试题都加载完了===========================",
                        Date.parse(new Date())
                    );
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

    //当前试题是否在已选择试题列表中
    ifSelected = () => {
        const { selectContentList , selectContentIndex , contentList } = this.state;
        let i = false;
        for (i = 0; i < selectContentList.length; i++) {
            if (selectContentList[i].questionId == contentList[selectContentIndex].questionId) {
                return true;
            }
        }
        if (i >= selectContentList.length) {
            return false;
        }
    }

    getIndex = () => {
        const { selectContentList , selectContentIndex , contentList } = this.state;
        let i = -1;
        for (i = 0; i < selectContentList.length; i++) {
            if (selectContentList[i].questionId == contentList[selectContentIndex].questionId) {
                return i;
            }
        }
        if (i >= selectContentList.length) {
            return -1;
        }
    }

    getIndex = () => {
        const { selectContentList, selectContentIndex, contentList } =
            this.state;
        let i = -1;
        for (i = 0; i < selectContentList.length; i++) {
            if (
                selectContentList[i].questionId ==
                contentList[selectContentIndex].questionId
            ) {
                return i;
            }
        }
        if (i >= selectContentList.length) {
            return -1;
        }
    };

    //修改选中题目数(添加试题小页面)
    updateSlectNum = (flag) => {
        console.log(
            "=======================修改选中题目数============================"
        );
        const { selectContentList, selectContentIndex, contentList } =
            this.state;
        if (flag == true) {
            //删除试题
            console.log(
                "=======================删除试题============================"
            );
            // var index = selectContentList.indexOf(contentList[selectContentIndex]); //查询要删除元素的位置
            var index = this.getIndex();
            console.log(
                "=============删除试题index=====================",
                index
            );
            var selectPaperListCopy = selectContentList;
            if (index >= 0) {
                selectPaperListCopy.splice(index, 1); //删除指定位置元素

                this.setState({
                    selectContentNum: this.state.selectContentNum - 1,
                    selectContentList: selectPaperListCopy,
                }, () => {
                    console.log('=======================删除试题=========成功===================');
                })
            }
        } else {  //添加试题
            console.log('=======================添加试题============================');
            var selectPaperListCopy = selectContentList;
            selectPaperListCopy.push(contentList[selectContentIndex]);

            this.setState({
                selectContentNum: this.state.selectContentNum + 1,
                selectContentList: selectPaperListCopy,
            }, () => {
                console.log('=======================添加试题=========成功===================');
            })
        }
    }

    //顶部（已选数目+添加+删除）
    showTitle = () => {
        return(
            <View style={styles.paperSelectNumView}>
                <Text style={styles.selectPaperNum}>(已选中{this.state.selectContentNum})</Text>
                <TouchableOpacity 
                        onPress={() => {
                            // let { selectContentNum , imgState } = this.state;
                            // this.setState({ imgState: !imgState  , selectContentNum:selectContentNum + 1 })
                            // this.updateSlectNum(false);
                            Alert.alert('点击了图片！')
                            this.ifSelected()
                                ? this.updateSlectNum(true)
                                : this.updateSlectNum(false);
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                top: 5,
                                // left: screenWidth * 0.65,
                                position: 'absolute',
                            }}
                            source={
                                // !this.state.imgState 
                                this.ifSelected()
                                    ? require('../../../../assets/teacherLatestPage/shanchu.png')
                                    : require('../../../../assets/teacherLatestPage/tianjia.png')
                            }
                        />
                    </TouchableOpacity>
            </View>
        );
    }

    //试题展示区
    showContent = () => {
        const { selectContentIndex, contentList } = this.state;
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {/**题面 */}
                {/* {console.log('---题目-----' ,paperList[selectPaperIndex].tiMian)} */}
                <Text style={styles.paperContent}>[题面]</Text>
                <View style={{ padding: 5 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: contentList[selectContentIndex].tiMian }}></RenderHtml>
                </View>


                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**答案 */}
                <Text style={styles.paperContent}>[答案]</Text>
                <View style={{ padding: 5 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: contentList[selectContentIndex].answer }}></RenderHtml>
                </View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />

                {/**解析 */}
                <Text style={styles.paperContent}>[解析]</Text>
                <View style={{ padding: 5 }}>
                    <RenderHtml contentWidth={screenWidth} source={{ html: contentList[selectContentIndex].analysis }}></RenderHtml>
                </View>
            </ScrollView>
        );
    }


    //底部题面展示区
    showAddPaperBottom = () => {
        return (
            <View style={styles.bottomView}>
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

    //试题类型图标
    showPaperTypeImg = () => {
        const { contentList , selectContentIndex } = this.state;   
        let content = [];
        for (let i = 0; i < contentList.length; i++) {
            let paperTypeImg;
            if (contentList[i].baseTypeId == '101') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/101.png');
            } else if (contentList[i].baseTypeId == '102') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/102.png');
            } else if (contentList[i].baseTypeId == '103') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/103.png');
            } else if (contentList[i].baseTypeId == '104') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/104.png');
            } else if (contentList[i].baseTypeId == '106') {
                paperTypeImg = require('../../../../assets/teacherLatestPage/106.png');
            } else if (contentList[i].baseTypeId == '108') {
                if (contentList[i].typeName.indexOf('填空')) {
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
                        if (selectContentIndex!= i) {
                            console.log('-----------select----i---', i);
                            this.setState({
                                selectContentIndex: i,
                            })
                        }
                    }}
                >
                    <Image
                        source={paperTypeImg}
                        style={selectContentIndex == i ? styles.checked : styles.little_image}
                    />
                </TouchableOpacity>
            );
        }
        return content;
    }


    render(){
        return(
            <View style={styles.bodyView}>
                {
                    this.showTitle()
                }
                <ScrollView   
                    showsVerticalScrollIndicator={false}
                    style={styles.contentView}
                    keyboardShouldPersistTaps={true}
                >
                    {
                        this.state.contentList.length <= 0
                            ? this.fetchData()
                            : null
                    }
                    {
                        this.state.contentList.length > 0 
                            ? this.showContent() 
                            : <Loading show={true} />
                    }
                </ScrollView>
                {
                    this.state.contentList.length > 0 
                        ? this.showAddPaperBottom() 
                        : <Loading show={true} />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bodyView: {
        height: screenHeight - 55,
        flexDirection: 'column',
    },
    contentView:{
        height: screenHeight - 205,
        flexDirection: 'column',
    },
    paperSelectNumView: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#EBEDEC',
        width: screenWidth
    },
    selectPaperNum: {
        fontSize: 18,
        color: '#8B8B7A',
        paddingLeft: 20,
        paddingTop: 7,
        width: 350
    },
    paperContent: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        paddingTop: 5,
        paddingLeft: 5,
        paddingBottom: 5,
    },
    bottomView: {
        height: 110,
        marginBottom: 5,
        // paddingTop: 20,
        // paddingBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row', 
        alignItems: 'center',
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
})