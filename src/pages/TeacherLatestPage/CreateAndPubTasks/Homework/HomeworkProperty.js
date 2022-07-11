import React, { useEffect, useState } from "react";
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
} from "react-native";
import { SearchBar } from "@ant-design/react-native";
//import { SearchBar } from 'react-native-elements';
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
//import { Container , Header , Item , Input , Icon , Button } from 'native-base';
import http from "../../../../utils/http/request";
import {
    Avatar,
    Layout,
    Button,
    Divider,
    Input,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";
//import { ScrollView } from "react-native-gesture-handler";
import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';


let textInputName = ''; //设置属性---名称
let textInputPaper = ''; //设置属性---试卷简介

let floor = 0; //记录知识点解析树的层数
let floorFlag = false; //层数增加减少逻辑
let knowledgeNodeList = []; //存放解析后的知识点(对象数组):对象属性：type：1、2、3一二三级标题 ； code：编码 ； name：名称

export default function HomeworkPropertyContainer(props) {

    const navigation = useNavigation();
    //路由标题
    navigation.setOptions({ title: '设置属性' });
    //将navigation传给HomeworkProperty组件，防止路由出错
    return <HomeworkProperty navigation={navigation} />;
}

class HomeworkProperty extends React.Component {
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
            Longknowledge:'',
            knowledgeCode: '', //选中的知识点项的编码
            knowledgeVisibility: false, //知识点选择列表是否显示     
            knowledgeModelVisibility: false, //知识点悬浮框model是否显示      
            knowledgeList: [], //从接口中返回的数据
            webViewHeight: 0, //知识点内容webView高度



            //网络请求状态
            error: false,
            errorInfo: "",
        };
    }
    getLongknowledge(id , name){
        const url = global.constants.baseUrl+"teacherApp_getPointName.do";
        const params = {
            pointId:id
        }
        http.get(url, params)
        .then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                this.setState({
                    knowledgeModelVisibility: false,
                    knowledgeCode: id,
                    knowledge: name,
                    Longknowledge:resJson.data
                })
            }
        })
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
                                            var id = JSON.parse(event.nativeEvent.data).id;
                                            var name = JSON.parse(event.nativeEvent.data).name;
                                            // this.setState({ 
                                            //     knowledgeModelVisibility: false, 
                                            //     knowledge: JSON.parse(event.nativeEvent.data).name ,
                                            //     knowledgeCode: JSON.parse(event.nativeEvent.data).id,
                                            // });
                                            this.getLongknowledge(id , name);
                                        }}
                                        javaScriptEnabled={true}
                                        scalesPageToFit={Platform.OS === 'ios' ? true : false}
                                        // style={{height: screenHeight , width : screenWidth}}
                                        source={{ html: this.state.knowledgeList }}
                                    ></WebView>
                                // <ScrollView  showsVerticalScrollIndicator={false}>
                                //     <HTMLView 
                                //         value={this.state.knowledgeList}
                                //         renderNode={this.getKnowledgeList}
                                //     />
                                // </ScrollView>
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
                console.log('--------知识点数据----property--',typeof(resJson.data));
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

    //解析知识点内容
    getKnowledgeList = (node, index, siblings, parent, defaultRenderer) => {
        if (node.name == 'span') {
            //const nodeName = node.parent.parent.name == null ? 'null' : node.parent.parent.name;
            if (floorFlag == false) {
                floor++; //标题层级
            }
            console.log('----span---floor---', floor, node.children[0].attribs.id, node.children[0].children[0].data);
            return (this.showKnowledge(floor, node.children[0].attribs.id, node.children[0].children[0].data));
        } else if (node.name == 'label' && node.parent.name != 'span') {
            floorFlag = true;

            //console.log('*******label****node.parent.next***', node.children[0].data , node.parent.next == null ? '最后一个' : '后面还有');
            console.log('----label------floor', floor + 1, node.attribs.id, node.children[0].data);
            return (this.showKnowledge(floor + 1, node.attribs.id, node.children[0].data));
        } else {

        }
    }

    //显示知识点项
    showKnowledge = (type, code, name) => {
        if (type == 1) {
            return (
                <View
                    style={{
                        paddingLeft: 30,
                        marginBottom: 10,
                        width: screenWidth,
                    }}
                >
                    <Text style={styles.knowledgeListText}
                        onPress={() => {
                            // Alert.alert(item.code , item.name);
                            this.setState({ knowledgeModelVisibility: false, knowledgeCode: code, knowledge: name });
                        }}
                    >
                        {name}
                    </Text>
                </View>
            );
        }
        else if (type == 2) {
            return (
                <View
                    style={{
                        paddingLeft: 50,
                        marginBottom: 10,
                        width: screenWidth,
                    }}
                >
                    <Text style={styles.knowledgeListText}
                        onPress={() => {
                            // Alert.alert(item.code , item.name);
                            this.setState({ knowledgeModelVisibility: false, knowledgeCode: code, knowledge: name });
                        }}
                    >
                        {name}
                    </Text>
                </View>
            );
        }
        else if (type == 3) {
            return (
                <View
                    style={{
                        paddingLeft: 70,
                        marginBottom: 10,
                        width: screenWidth,
                    }}
                >
                    <Text style={styles.knowledgeListText}
                        onPress={() => {
                            // Alert.alert(item.code , item.name);
                            this.setState({ knowledgeModelVisibility: false, knowledgeCode: code, knowledge: name });
                        }}
                    >
                        {name}
                    </Text>
                </View>
            );
        } else if (type == 4) {
            return (
                <View
                    style={{
                        paddingLeft: 90,
                        marginBottom: 10,
                        width: screenWidth,
                    }}
                >
                    <Text style={styles.knowledgeListText}
                        onPress={() => {
                            // Alert.alert(item.code , item.name);
                            this.setState({ knowledgeModelVisibility: false, knowledgeCode: code, knowledge: name });
                        }}
                    >
                        {name}
                    </Text>
                </View>
            );
        } else {
            return (
                <View
                    style={{
                        paddingLeft: 110,
                        marginBottom: 10,
                        width: screenWidth,
                    }}
                >
                    <Text style={styles.knowledgeListText}
                        onPress={() => {
                            // Alert.alert(item.code , item.name);
                            this.setState({ knowledgeModelVisibility: false, knowledgeCode: code, knowledge: name });
                        }}
                    >
                        {name}
                    </Text>
                </View>
            );
        }
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
                    style={{ height: '92%', backgroundColor: '#fff' }}
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
                    {/**试卷简介 */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                        <Text style={styles.longTitle}>试卷简介:</Text>
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

                </ScrollView>

                {/**取消 确定按钮 */}
                <View
                    style={{
                        flexDirection: 'row',
                        bacgroundColor: '#fff',
                        top: '100%',
                        position: 'absolute',
                    }}
                >
                    <Text style={{ width: screenWidth * 0.05, backgroundColor: '#fff' }}></Text>
                    <Button style={styles.button}
                        onPress={() => {
                            //Alert.alert('取消功能还未写！！！')
                            this.props.navigation.goBack();
                        }}
                    >
                        取消
                    </Button>
                    <Text style={{ width: screenWidth * 0.1 , backgroundColor: '#fff'  }}></Text>
                    <Button style={styles.button}
                        onPress={() => { 
                            //console.log('----------',textInputName , textInputPaper); 
                            // if(
                            //     textInputName != ''
                            //     && this.state.studyRank != ''
                            //     && this.state.studyClass != ''
                            //     && this.state.edition != ''
                            //     && this.state.book != ''
                            //     && this.state.knowledge != ''
                            // )(
                                    this.props.navigation.navigate({
                                        name: '创建作业',
                                        params: {
                                            type: 'create',
                                            name: textInputName,
                                            introduction: textInputPaper,
                                            studyRankId: this.state.studyRankId,
                                            studyRank: this.state.studyRank,
                                            studyClassId: this.state.studyClassId,
                                            studyClass: this.state.studyClass,
                                            editionId: this.state.editionId,
                                            edition: this.state.edition,
                                            bookId: this.state.bookId,
                                            book: this.state.book,
                                            knowledgeCode: this.state.knowledgeCode,
                                            // knowledge: this.state.knowledge,
                                            knowledge: this.state.Longknowledge,  //新的长知识点

                                            channelNameList: this.state.channelNameList, //学段名列表（接口数据）
                                            studyClassList: this.state.studyClassList, //学科列表（接口数据）
                                            editionList: this.state.editionList, //版本列表（接口数据）
                                            bookList: this.state.bookList, //教材列表（接口数据）  
                                            knowledgeList: this.state.knowledgeList, //从接口中返回的数据
                                        }
                                    })
                            // )
                            // else{
                            //     Alert.alert(
                            //         '',
                            //         '必填项不完整',
                            //         [
                            //             {} ,
                            //             {text: '关闭',onPress: ()=>{}}
                            //         ]
                            //     );
                            // }
                        }}
                    >
                        确定
                    </Button>
                    <Text style={{ width: screenWidth * 0.05 , backgroundColor: '#fff' }}></Text>
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
        //justifyContent: "center",
        //alignItems: "center",
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    knowledgeListText: {
        color: "#1C1C1C",
        fontSize: 15,
        fontWeight: "600",
    }
})