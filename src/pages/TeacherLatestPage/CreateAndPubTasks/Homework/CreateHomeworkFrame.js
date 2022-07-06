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
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import AddContentPageContainer from "./AddContentPage";

export default function CreateLearnCaseContainer(props) {
    // console.log('------函数式props----',props.route.params);
    const navigation = useNavigation();

    //将navigation传给HomeworkProperty组件，防止路由出错
    return (
        <CreateLearnCase
            navigation={navigation}
            paramsData={props.route.params}
        />
    );
}

class CreateLearnCase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addPaperFlag: true, //导航“添加试题”是否被选中
            updatePaperFlag: false, //导航“调整顺序”是否被选中
            pushPaperFlag: false, //导航“布置作业”是否被选中

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

            channelNameList:
                this.props.paramsData.type == "create"
                    ? this.props.paramsData.channelNameList
                    : "", //学段名列表（接口数据）
            studyClassList:
                this.props.paramsData.type == "create"
                    ? this.props.paramsData.studyClassList
                    : "", //学科列表（接口数据）
            editionList:
                this.props.paramsData.type == "create"
                    ? this.props.paramsData.editionList
                    : "", //版本列表（接口数据）
            bookList:
                this.props.paramsData.type == "create"
                    ? this.props.paramsData.bookList
                    : "", //教材列表（接口数据）

            knowledgeList: "",

            shareTag: "99", //‘共享内容’
            paperTypeName: "all",

            selectPaperList: [], //已选中试题
        };
    }

    UNSAFE_componentWillMount() {}

    //修改导航选中标志(添加试题、调整顺序、布置作业)
    updateFlag = (type, flag) => {
        if (type == 1) {
            //添加试题
            if (flag == true) {
                //目前就是添加试题页面
                this.setState({
                    updatePaperFlag: false,
                    pushPaperFlag: false,
                });
            } else {
                this.setState({
                    addPaperFlag: true,
                    updatePaperFlag: false,
                    pushPaperFlag: false,
                });
            }
        } else if (type == 2) {
            //调整试题顺序
            if (flag == true) {
                this.setState({
                    addPaperFlag: false,
                    pushPaperFlag: false,
                });
            } else {
                // if(this.state.selectPaperList.length > 0){
                this.setState({
                    addPaperFlag: false,
                    updatePaperFlag: true,
                    pushPaperFlag: false,

                    updatePaperIndex: 0, //添加到试卷中的试题当前显示的试题索引
                });
                // }else{
                //     Alert.alert('','暂无选中试题', [{} , {text: '关闭', onPress: ()=>{}}]);
                //     Toast.showInfoToast('暂无选中试题',1000);
                // }
            }
        } else if (type == 3) {
            //布置作业
            if (flag == true) {
                this.setState({
                    addPaperFlag: false,
                    updatePaperFlag: false,
                });
            } else {
                // if(this.state.selectPaperList.length > 0){
                this.setState({
                    addPaperFlag: false,
                    updatePaperFlag: false,
                    pushPaperFlag: true,
                });
                // }else{
                //     Alert.alert('','暂无选中试题', [{} , {text: '关闭', onPress: ()=>{}}]);
                //     Toast.showInfoToast('暂无选中试题',1000);
                // }
            }
        }
    };

    render() {
        return (
            <View style={{ flexDirection: "column", backgroundColor: "#fff" }}>
                {/**导航项 */}
                <View style={styles.routeView}>
                    {/**返回按钮 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require("../../../../assets/teacherLatestPage/goback.png")}
                        ></Image>
                    </TouchableOpacity>
                    {/**三个可选项 */}
                    <View
                        style={{
                            flexDirection: "row",
                            height: 40,
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: "#4DC7F8",
                        }}
                    >
                        <Text
                            style={
                                this.state.addPaperFlag
                                    ? styles.addPaperSelect
                                    : styles.addPaper
                            }
                            onPress={() => {
                                this.updateFlag(1, this.state.addPaperFlag);
                            }}
                        >
                            添加内容
                        </Text>
                        <Text
                            style={
                                this.state.updatePaperFlag
                                    ? styles.addPaperSelect
                                    : styles.updatePaper
                            }
                            onPress={() => {
                                this.updateFlag(2, this.state.updatePaperFlag);
                            }}
                        >
                            调整顺序
                        </Text>
                        <Text
                            style={
                                this.state.pushPaperFlag
                                    ? styles.addPaperSelect
                                    : styles.pushPaper
                            }
                            onPress={() => {
                                this.updateFlag(3, this.state.pushPaperFlag);
                            }}
                        >
                            保存或布置
                        </Text>
                    </View>
                    {/**筛选按钮 */}
                    {this.state.addPaperFlag ? (
                        <TouchableOpacity
                            onPress={() => {
                                // Alert.alert('设置属性悬浮框');
                                this.setState({});
                            }}
                        >
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require("../../../../assets/teacherLatestPage/filter2.png")}
                            ></Image>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 20, height: 20 }} />
                    )}
                </View>

                {/**内容展示、调整顺序、布置或保存展示区 */}
                {/* {
                    this.state.addPaperFlag 
                    ? <AddContentPageContainer />
                    : this.state.updatePaperFlag
                    ? <UpdateContentPageContainer />
                    : <PushOrSaveContentPageContainer />
                }    */}
                <AddContentPageContainer
                    channelCode={this.state.studyRankId}
                    subjectCode={this.state.studyClassId}
                    textBookCode={this.state.editionId}
                    gradeLevelCode={this.state.bookId}
                    pointCode={this.state.knowledgeCode}
                    questionTypeName={this.state.paperTypeName}
                    shareTag={this.state.shareTag}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    routeView: {
        height: 55,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 10,
        paddingLeft: 10,
    },
    addPaper: {
        borderBottomWidth: 1,
        borderBottomColor: "#4DC7F8",
        borderRadius: 5,
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: "#4DC7F8",
        backgroundColor: "#fff",
        fontWeight: "300",
        padding: 10,
        textAlign: "center",
    },
    addPaperSelect: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#4DC7F8",
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: "white",
        backgroundColor: "#4DC7F8",
        fontWeight: "300",
        padding: 10,
        textAlign: "center",
    },
    updatePaper: {
        borderBottomWidth: 1,
        borderBottomColor: "#4DC7F8",
        borderRadius: 0.5,
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: "#4DC7F8",
        backgroundColor: "#fff",
        fontWeight: "300",
        padding: 10,
        textAlign: "center",
    },
    pushPaper: {
        borderBottomWidth: 1,
        borderBottomColor: "#4DC7F8",
        borderRadius: 5,
        height: 40,
        width: screenWidth * 0.25,
        fontSize: 15,
        color: "#4DC7F8",
        backgroundColor: "#fff",
        fontWeight: "300",
        padding: 10,
        textAlign: "center",
    },
});
