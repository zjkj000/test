import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    Platform,
    ScrollView,
} from "react-native";
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../../utils/http/request";
import {
    Button,
} from "@ui-kitten/components";
import { WebView } from 'react-native-webview';

let textInputName = ''; //设置属性---名称
let textInputPaper = ''; //设置属性---试卷简介
let textLearnSumTime = ''; //设置属性---学时总数
let textStudyTime = ''; //设置属性---研读学时
let textLearnAim = ''; //设置属性---学习目标
let textLearnPoint = ''; //设置属性---学习重点
let textLearnDiff = ''; //设置属性---学习难点
let textCourseSummary = ''; //设置属性---课堂总结
let textCourseExpansion = ''; //设置属性---课外扩展

export default function LearnCasePropertyContainer(props) {
    const navigation = useNavigation();
    //将navigation传给LearnCaseProperty组件，防止路由出错
    return <LearnCaseProperty navigation={navigation} />;
}

class LearnCaseProperty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studyRank: '', //学段
            studyRankId: '', //学段编码
            studyRankVisibility: false, //学段选择列表是否显示
            channelNameList: [], //学段名列表（接口数据）

            studyClass: '', //学科
            studyClassId: '', //学科编码
            studyClassVisibility: false, //学段选择列表是否显示
            studyClassList: [], //学科列表（接口数据）

            edition: '', //版本
            editionId: '', //版本编码
            editionVisibility: false, //版本选择列表是否显示
            editionList: [], //版本列表（接口数据）

            book: '', //教材
            bookId: '', //教材编码
            bookVisibility: false, //教材选择列表是否显示
            bookList: [], //教材列表（接口数据）

            knowledge: '', //知识点(选中的)
            knowledgeCode: '', //选中的知识点项的编码
            knowledgeVisibility: false, //知识点选择列表是否显示     
            knowledgeModelVisibility: false, //知识点悬浮框model是否显示      
            knowledgeList: [], //从接口中返回的数据

            useAim: 'all', //使用目的：all:全部 before:课前 mid:课中 after:课后

            //网络请求状态
            error: false,
            errorInfo: "",
        };
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
            })
        } else {
            if (flag == 1) { //学段
                this.setState({
                    studyRankVisibility: true,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                })
            } else if (flag == 2) { //学科
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: true,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                })
            } else if (flag == 3) { //版本
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: true,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                })
            } else if (flag == 4) { //教材
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: true,
                    knowledgeVisibility: false,
                })
            } else if (flag == 5) { //知识点
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: true,
                })
            }
        }

    }

    //显示知识点覆盖框
    showKnowledgeModal = () => {
        const { knowledgeModelVisibility } = this.state;
       
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={knowledgeModelVisibility}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    this.setState({ knowledgeModelVisibility: false });
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={{
                                height: 20,
                                width: screenWidth,
                                paddingLeft: screenWidth * 0.9,
                                position: 'absolute',
                            }}
                            onPress={() => {
                                this.setState({ knowledgeModelVisibility: false });
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
                                && this.state.studyRank != ''
                                && this.state.studyClass != ''
                                && this.state.edition != ''
                                && this.state.book != ''
                                ? this.showKnowledgeList()
                                : null
                        }
                        {
                            this.state.knowledgeList.length > 0
                                ?
                                    <WebView
                                        onMessage={(event) => {
                                            this.setState({ 
                                                knowledgeModelVisibility: false, 
                                                knowledge: JSON.parse(event.nativeEvent.data).name ,
                                                knowledgeCode: JSON.parse(event.nativeEvent.data).id,
                                            });
                                        }}
                                        javaScriptEnabled={true}
                                        scalesPageToFit={Platform.OS === 'ios' ? true : false}
                                        // style={{height: screenHeight , width : screenWidth}}
                                        source={{ html: this.state.knowledgeList }}
                                    ></WebView>
                                : <Text>知识点数据为请求到或没有数据</Text>
                        }
                    </View>
                </View>
            </Modal>
        );
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
                // console.log('--------知识点数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
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

    //获取学段列表数据
    fetchChannelName = () => {
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getChannelList.do";
        const params = {
            userName: userId,
            //callback:'ha',
        };

        console.log('-----fetchChannelName-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------学段数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ channelNameList: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示学段列表数据
    showChannelName = () => {
        // console.log('-----showChannelName-----' , Date.parse(new Date()))
        const { channelNameList } = this.state;
        const content = channelNameList.map((item, index) => {
            return (
                <View key={index} style={{ width: screenWidth * 0.325 }}>
                    <Text
                        style={this.state.studyRank == item.channelName ?
                            styles.studyRankItemSelected :
                            styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.studyRank != item.channelName) { //所选学段与state中的不同
                                this.setState({
                                    studyRank: item.channelName,
                                    studyRankId: item.channelId,
                                    //学段信息修改，清空学科信息，重新获取学科信息!!!
                                    studyClass: '',
                                    studyClassId: '',
                                    studyClassList: [],
                                    //版本信息修改
                                    edition: '',
                                    editionId: '',
                                    editionList: [],
                                    //教材信息修改
                                    book: '',
                                    bookId: '',
                                    bookList: [],
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: '',
                                    knowledgeCode: '',
                                })
                            } else {
                                this.setState({
                                    studyRank: '',
                                    studyRankId: '',
                                })
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
        // var allcomeData = [];
        // for(let i = 0 ; i < channelNameList.length ; i++){
        //     allcomeData.push(
        //         <View key={i}>
        //             <Text 
        //                 style={this.state.studyRank == channelNameList[i].channelName ?
        //                                 styles.studyRankItemSelected : 
        //                                 styles.studyRankItem
        //                     }
        //                 onPress={()=>{this.setState({ studyRank: channelNameList[i].channelName})}}
        //             >
        //                 {console.log('-----学段名称-----' , channelNameList[i].channelName)}
        //                 {channelNameList[i].channelName}
        //             </Text>
        //             <Text style={{width: screenWidth*0.025}}></Text>
        //         </View>
        //     );
        // }
        // return allcomeData;
    }

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

        console.log('-----fetchStudyClass-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------学科数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ studyClassList: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示学科列表数据
    showStudyClass = () => {
        const { studyClassList } = this.state;
        const content = studyClassList.map((item, index) => {
            return (
                <View key={index} style={{ width: screenWidth * 0.325 }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={this.state.studyClass == item.subjectName ?
                            styles.studyRankItemSelected :
                            styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.studyClass != item.subjectName) {
                                this.setState({
                                    studyClass: item.subjectName,
                                    studyClassId: item.subjectId,
                                    //版本信息修改
                                    edition: '',
                                    editionId: '',
                                    editionList: [],
                                    //教材信息修改
                                    book: '',
                                    bookId: '',
                                    bookList: [],
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: '',
                                    knowledgeCode: '',
                                })
                            } else {
                                this.setState({
                                    studyClass: '',
                                    studyClassId: '',
                                })
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
    }

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

        console.log('-----fetchEdition-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------版本数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ editionList: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示版本列表数据
    showEdition = () => {
        const { editionList } = this.state;
        const content = editionList.map((item, index) => {
            return (
                <View key={index} style={{ width: screenWidth * 0.325 }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={this.state.edition == item.textbookName ?
                            styles.studyRankItemSelected :
                            styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.edition != item.textbookName) {
                                this.setState({
                                    edition: item.textbookName,
                                    editionId: item.textBookCode,
                                    //教材信息修改
                                    book: '',
                                    bookId: '',
                                    bookList: [],
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: '',
                                    knowledgeCode: '',
                                })
                            } else {
                                this.setState({
                                    edition: '',
                                    editionId: '',
                                })
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
    }

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

        console.log('-----fetchBook-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------教材数据------');
                // console.log(resJson.data);
                // console.log('------------------------');
                this.setState({ bookList: resJson.data });
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示教材列表数据
    showBook = () => {
        const { bookList } = this.state;
        const content = bookList.map((item, index) => {
            return (
                <View key={index} style={{ width: screenWidth * 0.325 }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={this.state.book == item.gradeLevelName ?
                            styles.studyRankItemSelected :
                            styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.book != item.gradeLevelName) {
                                this.setState({
                                    book: item.gradeLevelName,
                                    bookId: item.gradeLevelCode,
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: '',
                                    knowledgeCode: '',
                                })
                            } else {
                                this.setState({
                                    book: '',
                                    bookId: '',
                                })
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
    }



    render() {
        return (
            <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                <ScrollView horizontal={false} showsVerticalScrollIndicator={false}
                    style={{ height: '90%', backgroundColor: '#fff' }}
                >
                    {/**名称 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.necessary}>*</Text>
                        <Text style={styles.title}>名称:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.8,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textInputName = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />

                    {/**学段 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(1, this.state.studyRankVisibility);
                        }}
                    >
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                            <Text style={styles.necessary}>*</Text>
                            <Text style={styles.title}>学段:</Text>
                            <Text style={styles.studyRank}>{this.state.studyRank}</Text>
                            {this.state.studyRankVisibility ?
                                <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/top.png')}
                                />
                                : <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/bot.png')}
                                />
                            }
                        </View>
                    </TouchableOpacity>
                    {/**学段列表 */}
                    {this.state.studyRankVisibility ?
                        <View style={styles.contentlistView}>
                            {
                                this.state.channelNameList.length <= 0
                                    ? this.fetchChannelName()
                                    : null
                            }
                            {
                                this.state.channelNameList.length > 0
                                    ? this.showChannelName()
                                    : <Text>学段列表未获取到或者为空</Text>
                            }
                        </View>
                        : null
                    }
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />

                    {/**学科 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(2, this.state.studyClassVisibility);
                        }}
                    >
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                            <Text style={styles.necessary}>*</Text>
                            <Text style={styles.title}>学科:</Text>
                            <Text style={styles.studyRank}>{this.state.studyClass}</Text>
                            {this.state.studyClassVisibility ?
                                <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/top.png')}
                                />
                                : <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/bot.png')}
                                />
                            }
                        </View>
                    </TouchableOpacity>
                    {/**学科列表 */}
                    {this.state.studyClassVisibility ?
                        <View style={styles.contentlistView}>
                            {
                                this.state.studyClassList.length <= 0
                                    && this.state.studyRank != ''
                                    ? this.fetchStudyClass()
                                    : null
                            }
                            {
                                this.state.studyClassList.length > 0
                                    ? this.showStudyClass()
                                    : <Text>学科列表未获取到或者为空</Text>
                            }
                        </View>
                        : null
                    }
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                    
                    {/**版本 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(3, this.state.editionVisibility);
                        }}
                    >
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                            <Text style={styles.necessary}>*</Text>
                            <Text style={styles.title}>版本:</Text>
                            <Text style={styles.studyRank}>{this.state.edition}</Text>
                            {this.state.editionVisibility ?
                                <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/top.png')}
                                />
                                : <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/bot.png')}
                                />
                            }
                        </View>
                    </TouchableOpacity>
                    {/**版本列表 */}
                    {this.state.editionVisibility ?
                        <View style={styles.contentlistView}>
                            {
                                this.state.editionList.length <= 0
                                    && this.state.studyRank != ''
                                    && this.state.studyClass != ''
                                    ? this.fetchEdition()
                                    : null
                            }
                            {
                                this.state.editionList.length > 0
                                    ? this.showEdition()
                                    : <Text>版本列表未获取到或者为空</Text>
                            }
                        </View>
                        : null
                    }
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                    
                    {/**教材 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(4, this.state.bookVisibility);
                        }}
                    >
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                            <Text style={styles.necessary}>*</Text>
                            <Text style={styles.title}>教材:</Text>
                            <Text style={styles.studyRank}>{this.state.book}</Text>
                            {this.state.bookVisibility ?
                                <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/top.png')}
                                />
                                : <Image
                                    style={styles.studyRankImg}
                                    source={require('../../../../assets/teacherLatestPage/bot.png')}
                                />
                            }
                        </View>
                    </TouchableOpacity>
                    {/**教材列表 */}
                    {this.state.bookVisibility ?
                        <View style={styles.contentlistView}>
                            {
                                this.state.bookList.length <= 0
                                    && this.state.studyRank != ''
                                    && this.state.studyClass != ''
                                    && this.state.edition != ''
                                    ? this.fetchBook()
                                    : null
                            }
                            {
                                this.state.bookList.length > 0
                                    ? this.showBook()
                                    : <Text>教材列表未获取到或者为空</Text>
                            }
                        </View>
                        : null
                    }
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                    
                    {/**知识点 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(5, this.state.knowledgeVisibility);
                        }}
                    >
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                            <Text style={styles.necessary}>*</Text>
                            <Text style={styles.longTitle}>知识点:</Text>
                            <Text style={styles.studyRank}>{this.state.knowledge}</Text>
                        </View>
                    </TouchableOpacity>
                    {/**知识点选择悬浮页面!!! */}
                    {this.state.knowledgeVisibility ?
                        <TouchableOpacity
                            style={styles.knowledge}
                            onPress={() => { this.setState({ knowledgeModelVisibility: true }) }}
                        >
                            <Text style={styles.knowledgeText}>
                                点击这里选择知识点
                            </Text>
                            {this.state.knowledgeModelVisibility ?
                                this.showKnowledgeModal()
                                : null
                            }
                        </TouchableOpacity>
                        : null
                    }
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />

                    {/**使用目的 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.necessary}>*</Text>
                        <Text style={styles.longTitle}>使用目的:</Text>
                        <Text style={this.state.useAim != 'all' ? styles.content : styles.contentSelected} 
                            onPress={()=>{
                                            if(this.state.useAim != 'all'){
                                                this.setState({useAim: 'all'})
                                            }
                                    }}>全部</Text>
                        <Text style={this.state.useAim != 'before' ? styles.content : styles.contentSelected} 
                            onPress={()=>{
                                            if(this.state.useAim != 'before'){
                                                this.setState({useAim: 'before'})
                                            }
                                    }}>课前</Text>
                        <Text style={this.state.useAim != 'mid' ? styles.content : styles.contentSelected} 
                            onPress={()=>{
                                            if(this.state.useAim != 'mid'){
                                                this.setState({useAim: 'mid'})
                                            }
                                    }}>课中</Text>
                        <Text style={this.state.useAim != 'after' ? styles.content : styles.contentSelected} 
                            onPress={()=>{
                                            if(this.state.useAim != 'after'){
                                                this.setState({useAim: 'after'})
                                            }
                                    }}>课后</Text>
                    </View>
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                    
                    {/**学时总数 研读学时 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.necessary}>*</Text>
                        <Text style={styles.longTitle}>学时总数:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.2,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textLearnSumTime = text }}
                        ></TextInput>
                        <View style={{width: 50}}></View>
                        <Text style={styles.necessary}>*</Text>
                        <Text style={styles.longTitle}>研读学时:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.2,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textStudyTime = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                    
                    {/**内容简介 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.longTitle}>内容简介:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.75,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textInputPaper = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />


                    {/**学习目标 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.longTitle}>学习目标:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.75,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textLearnAim = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                
                    {/**学习重点 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.longTitle}>学习重点:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.75,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textLearnPoint = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                
                    {/**学习难点 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.longTitle}>学习难点:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.75,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textLearnDiff = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                
                    {/**课堂总结 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.longTitle}>课堂总结:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.75,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textCourseSummary = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                
                    {/**课外扩展 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.longTitle}>课外扩展:</Text>
                        <TextInput
                            style={{
                                width: screenWidth * 0.75,
                                backgroundColor: '#fff',
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text)=>{ textCourseExpansion = text }}
                        ></TextInput>
                    </View>
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 1, backgroundColor: "#DCDCDC" }} />
                </ScrollView>

                {/**取消 确定按钮 */}
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: '#fff',
                        top: '100%',
                        //height: '8%',
                        position: 'absolute',
                    }}
                >
                    <Text style={{ width: screenWidth * 0.05 }}></Text>
                    <Button style={styles.button}
                        onPress={() => {
                            //Alert.alert('取消功能还未写！！！')
                            this.props.navigation.goBack();
                        }}
                    >
                        取消
                    </Button>
                    <Text style={{ width: screenWidth * 0.1 }}></Text>
                    <Button style={styles.button}
                        onPress={() => { 
                            Alert.alert('该功能还未开发');
                            //console.log('----------',textInputName , textInputPaper); 
                            // if(
                            //     textInputName != ''
                            //     && this.state.studyRank != ''
                            //     && this.state.studyClass != ''
                            //     && this.state.edition != ''
                            //     && this.state.book != ''
                            //     && this.state.knowledge != ''
                            //     && textLearnSumTime != ''
                            //     && textStudyTime != ''
                            // )(
                            //         this.props.navigation.navigate({
                            //             name: '创建导学案',
                            //             params: {
                            //                 name: textInputName,
                            //                 introduction: textInputPaper,
                            //                 useAim: this.state.useAim,
                            //                 learnSumTime: textLearnSumTime,
                            //                 studyTime: textStudyTime,
                            //                 learnAim: textLearnAim,
                            //                 learnPoint: textLearnAim,
                            //                 learnDiff: textLearnDiff,
                            //                 courseSummary: textCourseSummary,
                            //                 courseExpansion: textCourseExpansion,
                            //                 studyRankId: this.state.studyRankId,
                            //                 studyRank: this.state.studyRank,
                            //                 studyClassId: this.state.studyClassId,
                            //                 studyClass: this.state.studyClass,
                            //                 editionId: this.state.editionId,
                            //                 edition: this.state.edition,
                            //                 bookId: this.state.bookId,
                            //                 book: this.state.book,
                            //                 knowledgeCode: this.state.knowledgeCode,
                            //                 knowledge: this.state.knowledge,

                            //                 channelNameList: this.state.channelNameList, //学段名列表（接口数据）
                            //                 studyClassList: this.state.studyClassList, //学科列表（接口数据）
                            //                 editionList: this.state.editionList, //版本列表（接口数据）
                            //                 bookList: this.state.bookList, //教材列表（接口数据）  
                            //                 knowledgeList: this.state.knowledgeList, //从接口中返回的数据
                            //             }
                            //         })
                            // )
                            // else{
                            //     Alert.alert('必填项不完整');
                            // }
                        }}
                    >
                        确定
                    </Button>
                    <Text style={{ width: screenWidth * 0.05 }}></Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    necessary: {
        color: 'red',
        width: screenWidth * 0.03,
        paddingTop: 12,
        //height:'100%',
    },
    title: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth * 0.12,
        paddingTop: 12,
        //height:'100%',
    },
    longTitle: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth * 0.18,
        paddingTop: 12,
    },
    contentlistView: {
        flexDirection: 'row',
        flexWrap: 'wrap',  //自动换行
        backgroundColor: '#fff',
        left: screenWidth * 0.025,
        marginBottom: 10,
    },
    studyRank: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        top: 8,
        width: screenWidth * 0.6,
        paddingTop: 5,
    },
    studyRankItem: {
        width: screenWidth * 0.3,
        fontSize: 15,
        color: 'black',
        backgroundColor: '#DCDCDC',
        fontWeight: '300',
        padding: 10,
        borderWidth: 2,
        borderColor: '#fff',
        textAlign: 'center',
    },
    studyRankItemSelected: {
        width: screenWidth * 0.3,
        fontSize: 15,
        color: 'black',
        backgroundColor: '#DCDCDC',
        fontWeight: '300',
        padding: 10,
        borderWidth: 1,
        borderColor: 'red',
        textAlign: 'center',
    },
    studyRankImg: {
        height: '150%',
        width: screenWidth * 0.1,
        resizeMode: "contain",
        left: screenWidth * 0.9,
        position: 'absolute',
    },
    knowledge: {
        width: screenWidth * 0.9,
        height: 40,
        backgroundColor: '#DCDCDC',
        left: 20,
        borderRadius: 5,
        //paddingBottom: 10,
        marginTop: 20,
        marginBottom: 15,
    },
    knowledgeText: {
        width: '100%',
        height: '100%',
        fontSize: 15,
        color: 'gray',
        fontWeight: '300',
        paddingTop: 10,
        paddingLeft: 10,
    },
    content: {
        width: screenWidth * 0.15,
        height: 30,
        fontSize: 15,
        fontWeight: '400',
        paddingTop: 5,
        textAlign: 'center',
        color: '#4DC7F8',
        marginLeft: 10,
        marginTop: 5,
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
    },
    contentSelected: {
        width: screenWidth * 0.15,
        height: 30,
        fontSize: 15,
        fontWeight: '400',
        paddingTop: 5,
        marginTop: 5,
        textAlign: 'center',
        color: 'white',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#4DC7F8',
        backgroundColor: '#4DC7F8',
        marginLeft: 10,
    },
    button: {
        width: screenWidth * 0.4,
        color: 'white',
        backgroundColor: '#4DC7F8',
    },

    centeredView: {
        //height: '100%',
    },
    modalView: {
        height: '95%',
        marginTop: 55, //model覆盖框组件不会覆盖路由标题,但是点击顶部的路由返回箭头按钮没反应（组件覆盖）（modal组件visible为true）
        backgroundColor: "white",
        padding: 30,
        paddingBottom: 80,
    },
})