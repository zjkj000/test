import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../../utils/http/request";

import Toast from "../../../../utils/Toast/Toast";

export default function HomeworkPropertyModelContainer(props) {
    const paperTypeList = props.paperTypeList;

    const navigation = useNavigation();
    //路由标题
    navigation.setOptions({ title: "设置属性" });
    //将navigation传给HomeworkProperty组件，防止路由出错
    return (
        <HomeworkPropertyModel
            navigation={navigation}
            paperTypeList={paperTypeList}
            studyRank={props.studyRank}
            studyRankId={props.studyRankId}
            studyClass={props.studyClass}
            studyClassId={props.studyClassId}
            edition={props.edition}
            editionId={props.editionId}
            book={props.book}
            bookId={props.bookId}
            knowledge={props.knowledge}
            knowledgeCode={props.knowledgeCode}
            channelNameList={props.channelNameList} //学段名列表（接口数据）
            studyClassList={props.studyClassList} //学科列表（接口数据）
            editionList={props.editionList} //版本列表（接口数据）
            bookList={props.bookList} //教材列表（接口数据）
            knowledgeList={props.knowledgeList} //从接口中返回的数据
            setAllProperty={props.setAllProperty}
            setFetchAgainProperty={props.setFetchAgainProperty}
        />
    );
}

class HomeworkPropertyModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shareContent: true, //共享内容
            schoolContent: false, //本校内容
            privateContent: false, //私有内容

            studyRank: this.props.studyRank, //学段
            studyRankId: this.props.studyRankId, //学段编码
            studyRankVisibility: false, //学段选择列表是否显示
            channelNameList: this.props.channelNameList, //学段名列表（接口数据）

            studyClass: this.props.studyClass, //学科
            studyClassId: this.props.studyClassId, //学科编码
            studyClassVisibility: false, //学段选择列表是否显示
            studyClassList: this.props.studyClassList, //学科列表（接口数据）

            edition: this.props.edition, //版本
            editionId: this.props.editionId, //版本编码
            editionVisibility: false, //版本选择列表是否显示
            editionList: this.props.editionList, //版本列表（接口数据）

            book: this.props.book, //教材
            bookId: this.props.bookId, //教材编码
            bookVisibility: false, //教材选择列表是否显示
            bookList: this.props.bookList, //教材列表（接口数据）

            knowledge: this.props.knowledge, //知识点(选中的)
            shortKnowledge: "",
            knowledgeCode: this.props.knowledgeCode, //选中的知识点项的编码
            knowledgeVisibility: false, //知识点选择列表是否显示
            paperTypeVisibility: false, //试题类型列表是否显示

            //共享内容
            questionType1: "",
            questionTypeId1: "",
            questionTypeList1: [], //试题类型列表
            questionTypeListFetch1: [],

            //本校内容
            questionType2: "",
            questionTypeId2: "",
            questionTypeList2: [], //试题类型列表
            questionTypeListFetch2: [],

            //私有内容
            questionType3: "",
            questionTypeId3: "",
            questionTypeList3: [], //试题类型列表
            questionTypeListFetch3: [],

            resetButton: false, //重置
            sureButton: true, //确定

            //网络请求状态
            error: false,
            errorInfo: "",
        };
    }

    UNSAFE_componentWillMount() {
        console.log("----------设置属性------WillMount------");
        const { knowledge } = this.state;
        var knowledgeSplit = knowledge.split("/");
        var length = knowledgeSplit.length;
        this.setState({
            shortKnowledge: knowledgeSplit[length - 2],
        });
        this.fetchPaperType();
    }

    UNSAFE_componentWillUpdate(nextProps){
        console.log('-----设置属性-----componentWillUpdate------');
    }

    //请求试题类型
    fetchPaperType = () => {
        const { shareContent, schoolContent, privateContent } = this.state;
        const { studyRankId, studyClassId, editionId, bookId, knowledgeCode } =
            this.state;
        var shareTag;
        if (shareContent) {
            shareTag = "99";
        } else if (schoolContent) {
            shareTag = "10";
        } else if (privateContent) {
            shareTag = "50";
        }
        const userId = global.constants.userName;
        const token = global.constants.token;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getQuestionTypeList1.do";
        const params = {
            teacherId: userId,
            channelCode: shareTag != "50" ? studyRankId : "",
            subjectCode: shareTag != "50" ? studyClassId : "",
            textBookCode: shareTag != "50" ? editionId : "",
            gradeLevelCode: shareTag != "50" ? bookId : "",
            pointCode: shareTag != "50" ? knowledgeCode : "",
            token: token,
            shareTag: shareTag,
            //callback:'ha',
        };

        console.log("-----fetchPaperType-----", Date.parse(new Date()));
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log("--------试题库试题类型数据------");
                console.log(resJson.data);
                console.log("------------------------");

                if (resJson.data.length > 0) {
                    var resJsonData = [];
                    var paperTypeListTemp = [];
                    if (!this.state.privateContent) {
                        for (let i = 0; i < resJson.data.length; i++) {
                            resJsonData.push(resJson.data[i][1]);
                            paperTypeListTemp.push(resJson.data[i][1]);
                            console.log("****", resJson.data[i][1]);
                        }
                        paperTypeListTemp.splice(0, 0, "全部");
                    } else {
                        for (let i = 0; i < resJson.data.length; i++) {
                            resJsonData.push(resJson.data[i]);
                            paperTypeListTemp.push(resJson.data[i]);
                            console.log("****", resJson.data[i]);
                        }
                        paperTypeListTemp.splice(0, 0, "全部");
                    }
                    // console.log('----resJsonData---',resJsonData);
                    if (shareContent) {
                        this.setState({
                            questionTypeList1: paperTypeListTemp,
                            questionTypeListFetch1: resJsonData,
                        });
                    } else if (schoolContent) {
                        this.setState({
                            questionTypeList2: paperTypeListTemp,
                            questionTypeListFetch2: resJsonData,
                        });
                    } else {
                        this.setState({
                            questionTypeList3: paperTypeListTemp,
                            questionTypeListFetch3: resJsonData,
                        });
                    }
                } else {
                    Alert.alert("", "该知识点没有对应的试题", [
                        {},
                        { text: "关闭", onPress: () => {} },
                    ]);
                    Toast.showInfoToast("该知识点没有对应的试题", 1000);
                    return;
                }
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    componentWillUnmount() {
        console.log("----------设置属性------WillUnmount------");
    }

    //更新是否显示状态
    updateVisibility = (flag, visibility) => {
        //如果当前列表状态为true，点击后需要把所有的列表都隐藏
        if (visibility == true) {
            this.setState({
                studyRankVisibility: false,
                studyClassVisibility: false,
                editionVisibility: false,
                bookVisibility: false,
                knowledgeVisibility: false,
                paperTypeVisibility: false,
            });
        } else {
            if (flag == 1) {
                //学段
                this.setState({
                    studyRankVisibility: true,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                });
            } else if (flag == 2) {
                //学科
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: true,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                });
            } else if (flag == 3) {
                //版本
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: true,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                });
            } else if (flag == 4) {
                //教材
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: true,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                });
            } else if (flag == 5) {
                //知识点
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: true,
                    paperTypeVisibility: false,
                });
            } else if (flag == 6) {
                //类型
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: true,
                });
            }
        }
    };

    //更新“共享内容 本校内容 私有内容”
    updateContent = (type, state) => {
        if (type == 1) {
            if (!state) {
                this.setState({
                    shareContent: true,
                    schoolContent: false,
                    privateContent: false,
                    paperTypeVisibility: false,
                    questionType1: "",
                });
            }
        } else if (type == 2) {
            if (!state) {
                this.setState({
                    shareContent: false,
                    schoolContent: true,
                    privateContent: false,
                    paperTypeVisibility: false,
                    questionType2: "",
                });
            }
        } else {
            if (!state) {
                this.setState({
                    shareContent: false,
                    schoolContent: false,
                    privateContent: true,
                    paperTypeVisibility: false,
                    questionType3: "",
                });
            }
        }
    };

    //获取学段列表数据
    fetchChannelName = () => {
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getChannelList.do";
        const params = {
            userName: userId,
            //callback:'ha',
        };

        console.log("-----fetchChannelName-----", Date.parse(new Date()));
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------学段数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ channelNameList: resJson.data });
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //显示学段列表数据
    showChannelName = () => {
        // console.log('-----showChannelName-----' , Date.parse(new Date()))
        const { channelNameList } = this.state;
        const content = channelNameList.map((item, index) => {
            return (
                <View key={index}>
                    <Text
                        style={
                            this.state.studyRank == item.channelName
                                ? styles.studyRankItemSelected
                                : styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.studyRank != item.channelName) {
                                //所选学段与state中的不同
                                this.setState({
                                    studyRank: item.channelName,
                                    studyRankId: item.channelId,
                                    //学段信息修改，清空学科信息，重新获取学科信息!!!
                                    studyClass: "",
                                    studyClassId: "",
                                    studyClassList: [],
                                    //版本信息修改
                                    edition: "",
                                    editionId: "",
                                    editionList: [],
                                    //教材信息修改
                                    book: "",
                                    bookId: "",
                                    bookList: [],
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: "",
                                    shortKnowledge: "",
                                    knowledgeCode: "",
                                    //类型信息修改:
                                    questionType1: "",
                                    questionTypeId1: "",
                                    questionTypeList1: [], //试题类型列表
                                    questionTypeListFetch1: [],
                                    questionType2: "",
                                    questionTypeId2: "",
                                    questionTypeList2: [], //试题类型列表
                                    questionTypeListFetch2: [],
                                    questionType3: "",
                                    questionTypeId3: "",
                                    questionTypeList3: [], //试题类型列表
                                    questionTypeListFetch3: [],
                                });
                            } else {
                                this.setState({
                                    studyRank: "",
                                    studyRankId: "",
                                });
                            }
                        }}
                    >
                        {/* {console.log('-----学段名称-----' , item.channelName , item.channelId)} */}
                        {item.channelName}
                    </Text>
                </View>
            );
        });
        return content;
    };

    //获取学科列表数据
    fetchStudyClass = () => {
        const { studyRankId } = this.state;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getSubjectInfoList.do";
        const params = {
            userName: userId,
            channelCode: studyRankId,
            //callback:'ha',
        };

        console.log("-----fetchStudyClass-----", Date.parse(new Date()));
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------学科数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ studyClassList: resJson.data });
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //显示学科列表数据
    showStudyClass = () => {
        const { studyClassList } = this.state;
        const content = studyClassList.map((item, index) => {
            return (
                <View key={index}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={
                            this.state.studyClass == item.subjectName
                                ? styles.studyRankItemSelected
                                : styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.studyClass != item.subjectName) {
                                this.setState({
                                    studyClass: item.subjectName,
                                    studyClassId: item.subjectId,
                                    //版本信息修改
                                    edition: "",
                                    editionId: "",
                                    editionList: [],
                                    //教材信息修改
                                    book: "",
                                    bookId: "",
                                    bookList: [],
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: "",
                                    shortKnowledge: "",
                                    knowledgeCode: "",
                                    //类型信息修改:
                                    questionType1: "",
                                    questionTypeId1: "",
                                    questionTypeList1: [], //试题类型列表
                                    questionTypeListFetch1: [],
                                    questionType2: "",
                                    questionTypeId2: "",
                                    questionTypeList2: [], //试题类型列表
                                    questionTypeListFetch2: [],
                                    questionType3: "",
                                    questionTypeId3: "",
                                    questionTypeList3: [], //试题类型列表
                                    questionTypeListFetch3: [],
                                });
                            } else {
                                this.setState({
                                    studyClass: "",
                                    studyClassId: "",
                                });
                            }
                        }}
                    >
                        {/* {console.log('-----学科名称-----' , item.subjectName , item.subjectId)} */}
                        {item.subjectName.substring(2)}
                    </Text>
                </View>
            );
        });
        return content;
    };

    //请求版本列表数据
    fetchEdition = () => {
        const { studyRankId, studyClassId } = this.state;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getBookVersionList.do";
        const params = {
            userName: userId,
            channelCode: studyRankId,
            subjectCode: studyClassId,
            //callback:'ha',
        };

        console.log("-----fetchEdition-----", Date.parse(new Date()));
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------版本数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ editionList: resJson.data });
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //显示版本列表数据
    showEdition = () => {
        const { editionList } = this.state;
        const content = editionList.map((item, index) => {
            return (
                <View key={index}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={
                            this.state.edition == item.textbookName
                                ? styles.studyRankItemSelected
                                : styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.edition != item.textbookName) {
                                this.setState({
                                    edition: item.textbookName,
                                    editionId: item.textBookCode,
                                    //教材信息修改
                                    book: "",
                                    bookId: "",
                                    bookList: [],
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: "",
                                    shortKnowledge: "",
                                    knowledgeCode: "",
                                    //类型信息修改:
                                    questionType1: "",
                                    questionTypeId1: "",
                                    questionTypeList1: [], //试题类型列表
                                    questionTypeListFetch1: [],
                                    questionType2: "",
                                    questionTypeId2: "",
                                    questionTypeList2: [], //试题类型列表
                                    questionTypeListFetch2: [],
                                    questionType3: "",
                                    questionTypeId3: "",
                                    questionTypeList3: [], //试题类型列表
                                    questionTypeListFetch3: [],
                                });
                            } else {
                                this.setState({
                                    edition: "",
                                    editionId: "",
                                });
                            }
                        }}
                    >
                        {/* {console.log('-----版本名称-----' , item.textbookName , item.textBookCode)} */}
                        {item.textbookName}
                    </Text>
                </View>
            );
        });
        return content;
    };

    //获取教材列表数据
    fetchBook = () => {
        const { studyRankId, studyClassId, editionId } = this.state;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getBookList.do";
        const params = {
            userName: userId,
            channelCode: studyRankId,
            subjectCode: studyClassId,
            textBookCode: editionId,
            //callback:'ha',
        };

        console.log("-----fetchBook-----", Date.parse(new Date()));
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------教材数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ bookList: resJson.data });
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //显示教材列表数据
    showBook = () => {
        const { bookList } = this.state;
        const content = bookList.map((item, index) => {
            return (
                <View key={index}>
                    <Text
                        // numberOfLines={1}
                        // ellipsizeMode={"tail"}
                        style={
                            this.state.book == item.gradeLevelName
                                ? styles.studyRankItemSelected
                                : styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.book != item.gradeLevelName) {
                                this.setState({
                                    book: item.gradeLevelName,
                                    bookId: item.gradeLevelCode,
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: "",
                                    shortKnowledge: "",
                                    knowledgeCode: "",
                                    //类型信息修改:
                                    questionType1: "",
                                    questionTypeId1: "",
                                    questionTypeList1: [], //试题类型列表
                                    questionTypeListFetch1: [],
                                    questionType2: "",
                                    questionTypeId2: "",
                                    questionTypeList2: [], //试题类型列表
                                    questionTypeListFetch2: [],
                                    questionType3: "",
                                    questionTypeId3: "",
                                    questionTypeList3: [], //试题类型列表
                                    questionTypeListFetch3: [],
                                });
                            } else {
                                this.setState({
                                    book: "",
                                    bookId: "",
                                });
                            }
                        }}
                    >
                        {/* {console.log('-----教材名称-----' , item.gradeLevelName , item.gradeLevelCode)} */}
                        {item.gradeLevelName}
                    </Text>
                </View>
            );
        });
        return content;
    };

    //显示试题类型列表数据
    showPaperType = () => {
        const { shareContent, schoolContent, privateContent } = this.state;
        const { questionType1, questionTypeList1 } = this.state;
        const { questionType2, questionTypeList2 } = this.state;
        const { questionType3, questionTypeList3 } = this.state;
        var questionType = "";
        var questionTypeList = [];
        if (shareContent) {
            questionType = questionType1;
            questionTypeList = questionTypeList1;
        } else if (schoolContent) {
            questionType = questionType2;
            questionTypeList = questionTypeList2;
        } else {
            questionType = questionType3;
            questionTypeList = questionTypeList3;
        }
        const content = questionTypeList.map((item, index) => {
            return (
                <View key={index}>
                    <Text
                        // numberOfLines={1}
                        // ellipsizeMode={"tail"}
                        style={
                            questionType == item 
                            ? {...styles.studyRankItemSelected}
                            : {...styles.studyRankItem}
                        }
                        onPress={() => {
                            if (questionType != item) {
                                if (shareContent) {
                                    this.setState({
                                        questionType1: item,
                                        questionType2: "",
                                        questionType3: "",
                                    });
                                } else if (schoolContent) {
                                    this.setState({
                                        questionType1: "",
                                        questionType2: item,
                                        questionType3: "",
                                    });
                                } else if (privateContent) {
                                    this.setState({
                                        questionType1: "",
                                        questionType2: "",
                                        questionType3: item,
                                    });
                                }
                            } else {
                                if (shareContent) {
                                    this.setState({
                                        questionType1: "",
                                    });
                                } else if (schoolContent) {
                                    this.setState({
                                        questionType2: "",
                                    });
                                } else if (privateContent) {
                                    this.setState({
                                        questionType3: "",
                                    });
                                }
                            }
                        }}
                    >
                        {item}
                    </Text>
                </View>
            );
        });
        return content;
    };

    //重新设置导学案属性
    setFetchAgainPropertys = () => {
        const { shareContent, schoolContent } = this.state;
        const { questionType1, questionType2, questionType3 } = this.state;
        const { questionTypeList1, questionTypeList2, questionTypeList3 } =
            this.state;
        let shareTagTepm = shareContent ? "99" : schoolContent ? "10" : "50";
        var paperType = "";
        var paperTypeListFetch = [];
        if (shareContent) {
            paperType = questionType1;
            paperTypeListFetch = questionTypeList1;
        } else if (schoolContent) {
            paperType = questionType2;
            paperTypeListFetch = questionTypeList2;
        } else {
            paperType = questionType3;
            paperTypeListFetch = questionTypeList3;
            console.log("*******questionType3**********", questionType3);
        }
        let paramsObj = {
            shareTag: shareTagTepm,
            studyRank: this.state.studyRank,
            studyRankId: this.state.studyRankId,
            studyClass: this.state.studyClass,
            studyClassId: this.state.studyClassId,
            edition: this.state.edition,
            editionId: this.state.editionId,
            book: this.state.book,
            bookId: this.state.bookId,
            knowledge: this.state.knowledge,
            knowledgeCode: this.state.knowledgeCode,
            paperType: paperType,
            paperTypeListFetch: paperTypeListFetch,
        };
        this.props.setFetchAgainProperty(paramsObj);
    };

    render() {
        console.log(
            "----------render-----knowledgeModelVisibility----",
            this.state.knowledgeModelVisibility
        );
        return (
            <View
                // style={this.state.knowledgeModelVisibility ?
                //     {...styles.model, borderWidth: 1, borderColor: '#DCDCDC' , opacity: 0}
                //     : {...styles.model, borderWidth: 1, borderColor: '#DCDCDC' , opacity: 1}}
                style={{
                    ...styles.model,
                    borderWidth: 1,
                    borderColor: "#DCDCDC",
                    opacity: 1,
                }}
            >
                <ScrollView
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ ...styles.itemView, marginBottom: 5 }}>
                        <Text
                            style={
                                !this.state.shareContent
                                    ? styles.content
                                    : styles.contentSelected
                            }
                            onPress={() => {
                                this.updateContent(1, this.state.shareContent);
                            }}
                        >
                            共享内容
                        </Text>
                        <Text
                            style={
                                !this.state.schoolContent
                                    ? styles.content
                                    : styles.contentSelected
                            }
                            onPress={() => {
                                this.updateContent(2, this.state.schoolContent);
                            }}
                        >
                            本校内容
                        </Text>
                        <Text
                            style={
                                !this.state.privateContent
                                    ? styles.content
                                    : styles.contentSelected
                            }
                            onPress={() => {
                                this.updateContent(
                                    3,
                                    this.state.privateContent
                                );
                            }}
                        >
                            私有内容
                        </Text>
                    </View>

                    {/**学段 */}
                    {!this.state.privateContent ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.updateVisibility(
                                    1,
                                    this.state.studyRankVisibility
                                );
                            }}
                        >
                            <View style={styles.itemView}>
                                <Text style={styles.title}>学段:</Text>
                                <Text style={styles.studyRank}>
                                    {this.state.studyRank}
                                </Text>
                                {this.state.studyRankVisibility ? (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/top.png")}
                                    />
                                ) : (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/bot.png")}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/**学段列表 */}
                    {this.state.studyRankVisibility ? (
                        <View style={styles.contentlistView}>
                            {this.state.channelNameList.length <= 0
                                ? this.fetchChannelName()
                                : null}
                            {this.state.channelNameList.length > 0 ? (
                                this.showChannelName()
                            ) : (
                                <Text>学段列表未获取到或者为空</Text>
                            )}
                        </View>
                    ) : null}
                    {/**分割线 */}
                    {
                        !this.state.privateContent
                        ? <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                        : null
                    }

                    {/**学科 */}
                    {!this.state.privateContent ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.updateVisibility(
                                    2,
                                    this.state.studyClassVisibility
                                );
                            }}
                        >
                            <View style={styles.itemView}>
                                <Text style={styles.title}>学科:</Text>
                                <Text style={styles.studyRank}>
                                    {this.state.studyClass}
                                </Text>
                                {this.state.studyClassVisibility ? (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/top.png")}
                                    />
                                ) : (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/bot.png")}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/**学科列表 */}
                    {this.state.studyClassVisibility ? (
                        <View style={styles.contentlistView}>
                            {this.state.studyClassList.length <= 0 &&
                            this.state.studyRank != ""
                                ? this.fetchStudyClass()
                                : null}
                            {this.state.studyClassList.length > 0 ? (
                                this.showStudyClass()
                            ) : (
                                <Text>学科列表未获取到或者为空</Text>
                            )}
                        </View>
                    ) : null}
                    {/**分割线 */}
                    {
                        !this.state.privateContent
                        ? <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                        : null
                    }

                    {/**版本 */}
                    {!this.state.privateContent ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.updateVisibility(
                                    3,
                                    this.state.editionVisibility
                                );
                            }}
                        >
                            <View style={styles.itemView}>
                                <Text style={styles.title}>版本:</Text>
                                <Text style={styles.studyRank}>
                                    {this.state.edition}
                                </Text>
                                {this.state.editionVisibility ? (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/top.png")}
                                    />
                                ) : (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/bot.png")}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/**版本列表 */}
                    {this.state.editionVisibility ? (
                        <View style={styles.contentlistView}>
                            {this.state.editionList.length <= 0 &&
                            this.state.studyRank != "" &&
                            this.state.studyClass != ""
                                ? this.fetchEdition()
                                : null}
                            {this.state.editionList.length > 0 ? (
                                this.showEdition()
                            ) : (
                                <Text>版本列表未获取到或者为空</Text>
                            )}
                        </View>
                    ) : null}
                    {/**分割线 */}
                    {
                        !this.state.privateContent
                        ? <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                        : null
                    }

                    {/**教材 */}
                    {!this.state.privateContent ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.updateVisibility(
                                    4,
                                    this.state.bookVisibility
                                );
                            }}
                        >
                            <View style={styles.itemView}>
                                <Text style={styles.title}>教材:</Text>
                                <Text style={styles.studyRank}>
                                    {this.state.book}
                                </Text>
                                {this.state.bookVisibility ? (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/top.png")}
                                    />
                                ) : (
                                    <Image
                                        style={styles.studyRankImg}
                                        source={require("../../../../assets/teacherLatestPage/bot.png")}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/**教材列表 */}
                    {this.state.bookVisibility ? (
                        <View style={styles.contentlistView}>
                            {this.state.bookList.length <= 0 &&
                            this.state.studyRank != "" &&
                            this.state.studyClass != "" &&
                            this.state.edition != ""
                                ? this.fetchBook()
                                : null}
                            {this.state.bookList.length > 0 ? (
                                this.showBook()
                            ) : (
                                <Text>教材列表未获取到或者为空</Text>
                            )}
                        </View>
                    ) : null}
                    {/**分割线 */}
                    {
                        !this.state.privateContent
                        ? <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                        : null
                    }

                    {/**知识点 */}
                    {!this.state.privateContent ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.updateVisibility(
                                    5,
                                    this.state.knowledgeVisibility
                                );
                            }}
                        >
                            <View style={styles.itemView}>
                                <Text style={styles.longTitle}>知识点:</Text>
                                <Text
                                    style={styles.studyRank}
                                    numberOfLines={1}
                                    ellipsizeMode={"tail"}
                                >
                                    {this.state.shortKnowledge}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/**知识点选择悬浮页面!!! */}
                    {this.state.knowledgeVisibility ? (
                        <TouchableOpacity
                            style={styles.knowledge}
                            onPress={() => {
                                //this.setState({ knowledgeModelVisibility: true })
                                this.props.setAllProperty(
                                    this.state.studyRank,
                                    this.state.studyRankId,
                                    this.state.channelNameList,
                                    this.state.studyClass,
                                    this.state.studyClassId,
                                    this.state.studyClassList,
                                    this.state.edition,
                                    this.state.editionId,
                                    this.state.editionList,
                                    this.state.book,
                                    this.state.bookId,
                                    this.state.bookList
                                );
                            }}
                        >
                            <Text style={styles.knowledgeText}>
                                点击这里选择知识点
                            </Text>
                        </TouchableOpacity>
                    ) : null}

                    {/**分割线 */}
                    {
                        !this.state.privateContent
                        ? <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                        : null
                    }

                    {/**类型 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(
                                6,
                                this.state.paperTypeVisibility
                            );
                        }}
                    >
                        <View style={styles.itemView}>
                            <Text style={styles.title}>类型:</Text>
                            <Text style={styles.studyRank}>
                                {this.state.shareContent
                                    ? this.state.questionType1
                                    : this.state.schoolContent
                                    ? this.state.questionType2
                                    : this.state.questionType3}
                            </Text>
                            {this.state.paperTypeVisibility ? (
                                <Image
                                    style={styles.studyRankImg}
                                    source={require("../../../../assets/teacherLatestPage/top.png")}
                                />
                            ) : (
                                <Image
                                    style={styles.studyRankImg}
                                    source={require("../../../../assets/teacherLatestPage/bot.png")}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                    {/**类型列表!!! */}
                    {this.state.paperTypeVisibility ? (
                        <View style={styles.contentlistView}>
                            {
                                this.state.studyRankId  == '' ||
                                this.state.studyClassId == '' ||
                                this.state.editionId == '' ||
                                this.state.bookId == '' || 
                                this.state.knowledgeCode == '' 
                                    ?   Alert.alert("", "请将属性选择完整", [
                                        {},
                                        { text: "关闭", onPress: () => {} },
                                    ])
                                    : null
                            }
                            {
                                this.state.shareContent 
                                && this.state.questionTypeList1.length <= 0
                                && (
                                    this.state.studyRankId  != '' &&
                                    this.state.studyClassId != '' &&
                                    this.state.editionId != '' &&
                                    this.state.bookId != '' &&  
                                    this.state.knowledgeCode != '' 
                                )
                                    ? this.fetchPaperType()
                                    : null
                                }
                            {
                                this.state.schoolContent &&
                                this.state.questionTypeList2.length <= 0
                                && (
                                    this.state.studyRankId  != '' &&
                                    this.state.studyClassId != '' &&
                                    this.state.editionId != '' &&
                                    this.state.bookId != '' &&  
                                    this.state.knowledgeCode != '' 
                                )
                                    ? this.fetchPaperType()
                                    : null
                            }
                            {
                                this.state.privateContent &&
                                this.state.questionTypeList3.length <= 0
                                && (
                                    this.state.studyRankId  != '' &&
                                    this.state.studyClassId != '' &&
                                    this.state.editionId != '' &&
                                    this.state.bookId != '' &&  
                                    this.state.knowledgeCode != '' 
                                )
                                    ? this.fetchPaperType()
                                    : null
                                }
                            {
                                this.state.shareContent &&
                                this.state.questionTypeList1.length > 0
                                    ? this.showPaperType()
                                    : null
                            }
                            {
                                this.state.schoolContent &&
                                this.state.questionTypeList2.length > 0
                                    ? this.showPaperType()
                                    : null
                            }
                            {
                                this.state.privateContent &&
                                this.state.questionTypeList3.length > 0
                                    ? this.showPaperType()
                                    : null
                            }
                        </View>
                    ) : null}
                    {/**分割线 */}
                    <View
                        style={{
                            paddingLeft: 0,
                            width: screenWidth,
                            height: 2,
                            backgroundColor: "#DCDCDC",
                        }}
                    />
                </ScrollView>

                {/**重置 确定按钮 */}
                <View
                    style={{
                        flexDirection: "row",
                        borderWidth: 1,
                        borderColor: "#DCDCDC",
                        backgroundColor: "#fff",
                        width: screenWidth * 0.6,
                        top: "100%",
                        position: "absolute",
                    }}
                >
                    <Text
                        style={
                            this.state.resetButton
                                ? styles.buttonSelect
                                : styles.button
                        }
                        onPress={() => {
                            // Alert.alert('重置功能还未写！！！')
                            this.setState({
                                shareContent: true, //共享内容
                                schoolContent: false, //本校内容
                                privateContent: false, //私有内容

                                studyRank: "", //学段
                                studyRankId: "", //学段编码
                                studyRankVisibility: false, //学段选择列表是否显示

                                studyClass: "", //学科
                                studyClassId: "", //学科编码
                                studyClassVisibility: false, //学段选择列表是否显示

                                edition: "", //版本
                                editionId: "", //版本编码
                                editionVisibility: false, //版本选择列表是否显示

                                book: "", //教材
                                bookId: "", //教材编码
                                bookVisibility: false, //教材选择列表是否显示

                                knowledge: "", //知识点(选中的)
                                knowledgeCode: "", //选中的知识点项的编码
                                knowledgeVisibility: false, //知识点选择列表是否显示
                                shortKnowledge: "",

                                paperTypeVisibility: false, //试题类型列表是否显示

                                questionType1: "",
                                questionType2: "",
                                questionType3: "",
                            });
                        }}
                    >
                        重置
                    </Text>
                    <Text
                        style={
                            this.state.sureButton
                                ? styles.buttonSelect
                                : styles.button
                        }
                        onPress={() => {
                            // Alert.alert('确定功能还未写！！！')
                            if (this.state.shareContent) {
                                if (this.state.questionType1 == "") {
                                    Alert.alert("", "请选择属性", [
                                        {},
                                        { text: "关闭", onPress: () => {} },
                                    ]);
                                } else {
                                    this.setFetchAgainPropertys();
                                }
                            } else if (this.state.schoolContent) {
                                if (this.state.questionType2 == "") {
                                    Alert.alert("", "请选择属性", [
                                        {},
                                        { text: "关闭", onPress: () => {} },
                                    ]);
                                } else {
                                    this.setFetchAgainPropertys();
                                }
                            } else {
                                if (this.state.questionType3 == "") {
                                    Alert.alert("", "请选择属性", [
                                        {},
                                        { text: "关闭", onPress: () => {} },
                                    ]);
                                } else {
                                    this.setFetchAgainPropertys();
                                }
                            }
                        }}
                    >
                        确定
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    model: {
        flexDirection: 'column', 
        backgroundColor: '#fff' , 
        top: 50 , 
        right: 0 , 
        height: screenHeight*0.6,
        width: screenWidth*0.7,
        position: 'absolute',
    },
    content: {
        width: screenWidth * 0.2,
        height: 30,
        fontSize: 15,
        fontWeight: "400",
        paddingTop: 5,
        textAlign: "center",
        color: "#4DC7F8",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#4DC7F8",
        backgroundColor: "#fff",
        marginLeft: 10,
    },
    contentSelected: {
        width: screenWidth * 0.2,
        height: 30,
        fontSize: 15,
        fontWeight: "400",
        paddingTop: 5,
        textAlign: "center",
        color: "white",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#4DC7F8",
        backgroundColor: "#4DC7F8",
        marginLeft: 10,
    },
    itemView: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    title: {
        fontSize: 15,
        color: "black",
        fontWeight: "500",
        width: screenWidth * 0.1,
        paddingTop: 5,
        paddingBottom: 5,
        //height:'100%',
    },
    longTitle: {
        fontSize: 15,
        color: "black",
        fontWeight: "500",
        width: screenWidth * 0.15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    contentlistView: {
        flexDirection: "row",
        flexWrap: "wrap", //自动换行
        backgroundColor: "#fff",
        left: screenWidth * 0.025,
        marginBottom: 10,
    },
    studyRank: {
        fontSize: 15,
        color: "black",
        fontWeight: "500",
        width: screenWidth * 0.4,
        height: 40,
        paddingTop: 5,
    },
    studyRankItem: {
        width: screenWidth * 0.2,
        // height: 40,
        fontSize: 15,
        color: "black",
        backgroundColor: "#DCDCDC",
        fontWeight: "300",
        padding: 10,
        borderWidth: 2,
        borderColor: "#fff",
        textAlign: "center",
        marginLeft: 5,
    },
    studyRankItemSelected: {
        width: screenWidth * 0.2,
        // height: 38,
        fontSize: 15,
        color: "black",
        backgroundColor: "#DCDCDC",
        fontWeight: "300",
        padding: 10,
        borderWidth: 1,
        borderColor: "red",
        textAlign: "center",
        marginLeft: 5,
    },

    studyRankImg: {
        height: 20,
        width: 20,
        top: 10,
        //resizeMode: "contain",
        right: 10,
        position: "absolute",
    },
    knowledge: {
        width: screenWidth * 0.6,
        height: 40,
        backgroundColor: "#DCDCDC",
        left: 10,
        borderRadius: 5,
        //paddingBottom: 10,
        marginTop: 5,
        marginBottom: 15,
    },
    knowledgeText: {
        width: "100%",
        height: "100%",
        fontSize: 15,
        color: "gray",
        fontWeight: "300",
        paddingTop: 10,
        paddingLeft: 10,
    },
    button: {
        width: screenWidth * 0.35,
        height: 40,
        fontSize: 15,
        fontWeight: "400",
        paddingTop: 8,
        textAlign: "center",
        color: "black",
        backgroundColor: "#fff",
    },
    buttonSelect: {
        width: screenWidth * 0.35,
        height: 40,
        fontSize: 15,
        fontWeight: "400",
        paddingTop: 8,
        textAlign: "center",
        color: "white",
        backgroundColor: "red",
    },
    centeredView: {
        //height: '100%',
    },
    modalView: {
        height: "95%",
        marginTop: 120, //model覆盖框组件不会覆盖路由标题,但是点击顶部的路由返回箭头按钮没反应（组件覆盖）（modal组件visible为true）
        backgroundColor: "white",
        padding: 30,
        paddingBottom: 80,
        //justifyContent: "center",
        //alignItems: "center",
    },
});
