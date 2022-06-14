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

import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

import Toast from '../../../../utils/Toast/Toast';
import AddContentPageContainer from "./AddContentPage";
import UpdateContentPageContainer from "./UpdateContentPage";
import PushOrSaveContentPageContainer from "./PushOrSaveContentPage";
import LearnCasePropertyModalContainer from "./LearnCasePropertyModal";


export default function CreateLearnCaseContainer(props) {
    // console.log('------函数式props----',props.route.params);
    const paramsData = props.route.params;
    console.log('---------------------------------');
    console.log('学段', paramsData.studyRank , paramsData.studyRankId);
    console.log('学科', paramsData.studyClass , paramsData.studyClassId);
    console.log('版本', paramsData.edition , paramsData.editionId);
    console.log('教材', paramsData.book , paramsData.bookId);
    console.log('知识点', paramsData.knowledge , paramsData.knowledgeCode);
    console.log('---------------------------------');

    const navigation = useNavigation();

    //将navigation传给HomeworkProperty组件，防止路由出错
    return <CreateLearnCase navigation={navigation} paramsData={paramsData}/>;
}

class CreateLearnCase extends React.Component {
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

            channelNameList: this.props.paramsData.channelNameList, //学段名列表（接口数据）
            studyClassList: this.props.paramsData.studyClassList, //学科列表（接口数据）
            editionList: this.props.paramsData.editionList, //版本列表（接口数据）
            bookList: this.props.paramsData.bookList, //教材列表（接口数据）  

            knowledgeList: [],

            learnPlanId: '', 

            type: 0,
            typeValue: '',

            addPaperFlag: true, //导航“添加试题”是否被选中
            updatePaperFlag: false, //导航“调整顺序”是否被选中
            pushPaperFlag: false, //导航“布置作业”是否被选中

            filterModelVisiblity: false, //设置属性悬浮框是否显示
            knowledgeModelVisibility: false, //知识点悬浮框是否显示

            shareTag: '99', //‘共享内容’

            contentList: [], //导学案内容请求数据
            selectContentNum: 0, //添加到导学案中的内容数目
            selectContentList: [], //添加到导学案中的试题


            //网络请求状态
            error: false,
            errorInfo: "",
        };
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
                if(this.state.selectContentList.length > 0){
                    this.setState({ 
                        addPaperFlag: false,
                        updatePaperFlag: true,
                        pushPaperFlag: false,
    
                        updatePaperIndex: 0, //添加到试卷中的试题当前显示的试题索引
                    })
                }else{
                    Alert.alert('暂无选中试题');
                    Toast.showInfoToast('暂无选中试题',1000);
                }
            }
        }else if(type == 3){ //布置作业
            if(flag == true){
                this.setState({ 
                    addPaperFlag: false,
                    updatePaperFlag: false,
                })
            }else{
                if(this.state.selectContentList.length > 0){
                    this.setState({ 
                        addPaperFlag: false,
                        updatePaperFlag: false,
                        pushPaperFlag: true,
                    })
                }else{
                    Alert.alert('暂无选中试题');
                    Toast.showInfoToast('暂无选中试题',1000);
                }
            }
        }
    }

    setModalVisible = (visible) => {
        console.log('-----------setModalVisible---------------', visible);
        this.setState({ filterModelVisiblity: visible ,  });   
    }

    //显示设置属性悬浮框
    showFilter = () => {
        const { filterModelVisiblity , knowledgeModelVisibility } = this.state;
        if(filterModelVisiblity){ //显示设置属性覆盖框
            return (
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={filterModelVisiblity}
                        onRequestClose={() => {
                            console.log('----------------Modal has been closed.---------------------');
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
                        <LearnCasePropertyModalContainer 
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

                            setAllProperty={this.setAllProperty}  
                            setFetchAgainProperty={this.setFetchAgainProperty}
                        />
                    </Modal>
            );
        }else if(knowledgeModelVisibility){ //显示知识点覆盖框
            return(
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={knowledgeModelVisibility}
                    onRequestClose={() => {
                        console.log('----------------Modal has been closed.---------------------');
                        Alert.alert("Modal has been closed.");
                        this.setState({knowledgeModelVisibility: !knowledgeModelVisibility});
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
                        {/* {console.log('-----knowledgeList---', this.state.knowledgeList , this.state.knowledgeList.length)} */}
                        {/**知识点数据为空时请求数据 */}
                        {
                            this.state.knowledgeList.length <= 0
                                && this.state.paramsDataProps.studyRank != ''
                                && this.state.paramsDataProps.studyClass != ''
                                && this.state.paramsDataProps.edition != ''
                                && this.state.paramsDataProps.book != ''
                                ? this.showKnowledgeList()
                                : null
                        }
                        {
                            this.state.knowledgeList.length > 0
                                ?
                                    <WebView
                                        onMessage={(event) => {
                                            console.log('---------------------------------');
                                            console.log(JSON.parse(event.nativeEvent.data).name , JSON.parse(event.nativeEvent.data).id);
                                            console.log('---------------------------------');
                                            this.setState({ 
                                                filterModelVisiblity: true,
                                                knowledgeModelVisibility: false, 
                                                knowledge: JSON.parse(event.nativeEvent.data).name ,
                                                knowledgeCode: JSON.parse(event.nativeEvent.data).id,
                                            });
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
        console.log('-------设置属性悬浮框返回参数-------');
        console.log(studyRank, studyRankId, studyClass, studyClassId, edition, editionId, book, bookId);
        console.log('-----------------------------------');
        this.setState({ 
            filterModelVisiblity: false , 
            knowledgeModelVisibility: true ,
            studyRank: studyRank,
            studyRankId: studyRankId,
            channelNameList: channelNameList,
            studyClass: studyClass,
            studyClassId: studyClassId ,
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
        console.log('----------------setFetchAgainProperty----------------------');
        console.log(paramsObj);
        console.log('------------------------------------------------------------');

        this.setState({
            filterModelVisiblity: false , 
            knowledgeModelVisibility: false ,
            shareTag: paramsObj.shareTag,

            studyRankId: paramsObj.channelCode,
            studyRank: paramsObj.channelName,
            studyClassId: paramsObj.subjectCode,
            studyClass: paramsObj.subjectName,
            editionId: paramsObj.textBookCode,
            edition: paramsObj.textBookName,
            bookId: paramsObj.gradeLevelCode,
            book: paramsObj.gradeLevelName,
            knowledgeCode: paramsObj.pointCode,
            knowledge: paramsObj.pointName,

            type: paramsObj.type,
            typeValue: paramsObj.typeValue,
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
                console.log('--------知识点数据------');
                console.log(resJson.data);
                console.log('------------------------');
                this.setState({ knowledgeList: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //setContentList设置导学案内容数据
    setContentList = (contentListTemp) => {
        this.setState({ contentList: contentListTemp });
    }

    //设置已选中导学案的数目
    setSelectContentNum = (count) => {
        this.setState({ selectContentNum: count });
    }

    //设置已选中导学案列表
    setSelectContentList = (list) => {
        this.setState({ selectContentList: list });
    }

    //设置learnPlanId
    setLearnPlanId = (id) => {
        this.setState({ learnPlanId: id });
    }

    render(){
        return(
            <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                {/**导航项 */}
                <View style={styles.routeView}>
                    {/**返回按钮 */}
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.goBack();
                        }}
                    >
                        <Image style={{width: 30, height: 30}} source={require('../../../../assets/teacherLatestPage/goback.png')}></Image>
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
                        >添加内容</Text>
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
                        >保存或布置</Text>
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
                        this.state.filterModelVisiblity || this.state.knowledgeModelVisibility ? this.showFilter() : null
                    }
                </View>
            
                {/**内容展示、调整顺序、布置或保存展示区 */}
                {
                     this.state.addPaperFlag 
                     ? <AddContentPageContainer
                            channelCode = {this.state.studyRankId}
                            subjectCode = {this.state.studyClassId}
                            textBookCode = {this.state.editionId}
                            gradeLevelCode = {this.state.bookId}
                            pointCode = {this.state.knowledgeCode}

                            type = {this.state.type}
                            typeValue = {this.state.typeValue}

                            setContentList = {this.setContentList}  
                            contentList = {this.state.contentList}

                            selectContentNum = {this.state.selectContentNum}
                            setSelectContentNum = {this.setSelectContentNum}

                            selectContentList = {this.state.selectContentList}
                            setSelectContentList = {this.setSelectContentList}

                            learnPlanId = {this.state.learnPlanId}
                            setLearnPlanId = {this.setLearnPlanId}
                        />
                     : this.state.updatePaperFlag
                     ? <UpdateContentPageContainer 
                            selectContentNum = {this.state.selectContentNum}
                            setSelectContentNum = {this.setSelectContentNum}

                            selectContentList = {this.state.selectContentList}
                            setSelectContentList = {this.setSelectContentList}
                     />
                     : <PushOrSaveContentPageContainer
                            learnPlanId = {this.state.learnPlanId}
                            selectContentList = {this.state.selectContentList}
                            paramsData = {this.state.paramsDataProps}
                     />
                }   
                {this.state.updatePaperFlag ? console.log('----------',this.state.selectContentNum) : null}        
            </View>
        )
    }
}

const styles = StyleSheet.create({
    routeView: {
        height: screenHeight*0.1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingRight: 10, 
        paddingLeft: 10,
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