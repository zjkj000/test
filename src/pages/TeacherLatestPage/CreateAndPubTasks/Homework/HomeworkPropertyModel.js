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
    Overlay,
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
import RenderHtml from 'react-native-render-html';


let textInputName = ''; //设置属性---名称
let textInputPaper = ''; //设置属性---试卷简介

let floor = 0; //记录知识点解析树的层数
let floorFlag = false; //层数增加减少逻辑
let knowledgeNodeList = []; //存放解析后的知识点(对象数组):对象属性：type：1、2、3一二三级标题 ； code：编码 ； name：名称

export default function HomeworkPropertyModelContainer(props) {
    const paperTypeList = props.paperTypeList;  

    const navigation = useNavigation();
    //路由标题
    navigation.setOptions({ title: '设置属性' });
    //将navigation传给HomeworkProperty组件，防止路由出错
    return <HomeworkPropertyModel navigation={navigation} 
        paperTypeList={paperTypeList}
        studyRank={props.studyRank}
        studyClass={props.studyClass}
        edition={props.edition}
        book={props.book}
        knowledge={props.knowledge}
        channelNameList={props.channelNameList} //学段名列表（接口数据）
        studyClassList={props.studyClassList} //学科列表（接口数据）
        editionList={props.editionList} //版本列表（接口数据）
        bookList={props.bookList} //教材列表（接口数据）  
        knowledgeList={props.knowledgeList} //从接口中返回的数据
    />;
}

class HomeworkPropertyModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shareContent: true, //共享内容
            schoolContent: false, //本校内容
            privateContent: false, //私有内容

            studyRank: this.props.studyRank, //学段
            studyRankId: '', //学段编码
            studyRankVisibility: false, //学段选择列表是否显示
            channelNameList: this.props.channelNameList, //学段名列表（接口数据）

            studyClass: this.props.studyClass, //学科
            studyClassId: '', //学科编码
            studyClassVisibility: false, //学段选择列表是否显示
            studyClassList: this.props.studyClassList, //学科列表（接口数据）

            edition: this.props.edition, //版本
            editionId: '', //版本编码
            editionVisibility: false, //版本选择列表是否显示
            editionList: this.props.editionList, //版本列表（接口数据）

            book: this.props.book, //教材
            bookId: '', //教材编码
            bookVisibility: false, //教材选择列表是否显示
            bookList: this.props.bookList, //教材列表（接口数据）

            knowledge: this.props.knowledge, //知识点(选中的)
            knowledgeCode: '', //选中的知识点项的编码
            knowledgeVisibility: false, //知识点选择列表是否显示     
            knowledgeModelVisibility: false, //知识点悬浮框model是否显示      
            knowledgeList: this.props.knowledgeList, //从接口中返回的数据

            paperType: '全部', //试题类型(选中的)
            paperTypeVisibility: false, //试题类型列表是否显示

            resetButton: false, //重置
            sureButton: true, //确定



            //网络请求状态
            error: false,
            errorInfo: "",
        };
    }

    UNSAFE_componentWillMount(){
        const {paperTypeList} = this.props;
        var paperTypeListTemp = paperTypeList;
        paperTypeListTemp.splice(0 , 0 , "全部");
        this.setState({ paperTypeList: paperTypeListTemp });
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
            })
        } else {
            if (flag == 1) { //学段
                this.setState({
                    studyRankVisibility: true,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                })
            } else if (flag == 2) { //学科
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: true,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                })
            } else if (flag == 3) { //版本
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: true,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                })
            } else if (flag == 4) { //教材
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: true,
                    knowledgeVisibility: false,
                    paperTypeVisibility: false,
                })
            } else if (flag == 5) { //知识点
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: true,
                    paperTypeVisibility: false,
                })
            }else if (flag == 6) { //类型
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                    paperTypeVisibility: true,
                })
            }
        }

    }

    //更新“共享内容 本校内容 私有内容”
    updateContent = (type, state) => {
        if(type == 1){
            if(!state){
                this.setState({
                    shareContent: true,
                    schoolContent: false,
                    privateContent: false,
                })
            }
        }else if(type == 2){
            if(!state){
                this.setState({
                    shareContent: false,
                    schoolContent: true,
                    privateContent: false,
                })
            }
        }else{
            if(!state){
                this.setState({
                    shareContent: false,
                    schoolContent: false,
                    privateContent: true,
                })
            }
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
                <View key={index}>
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
                <View key={index}>
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
                <View key={index}>
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
                <View key={index}>
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

    //显示试题类型列表数据
    showPaperType = () => {
        const { paperTypeList } = this.props;
        const content = paperTypeList.map((item, index) => {
            return (
                <View key={index}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={this.state.paperType == item ?
                            styles.studyRankItemSelected :
                            styles.studyRankItem
                        }
                        onPress={() => {
                            if (this.state.paperType != item) {
                                this.setState({
                                    paperType: item
                                })
                            } else {
                                this.setState({
                                    paperType: ''
                                })
                            }
                        }}
                    >
                        {item}
                    </Text>
                </View>
            );
        });
        return content;        
    }

    //关闭知识点覆盖框
    onCloseClick = () => {
        // this.OverlayRef.onClose();
        console.log('------------知识点关闭-------');
        this.setState({
            knowledgeModelVisibility: false,
        },()=>{
            console.log('*********knowledgeModelVisibility**************',this.state.knowledgeModelVisibility);
        });
    }

    //显示知识点覆盖框
    showKnowledgeModal = () => {
        const { knowledgeModelVisibility } = this.state;
        console.log('----------knowledgeModelVisibility-----------',knowledgeModelVisibility)

        return(
            <Overlay   visible={knowledgeModelVisibility}
                onShow={()=>{console.log('-----Overlay启动了-------')}}
                onClose={()=>{console.log('-----Overlay关闭了-------')}}
                ref={(ref)=>{this.OverlayRef = ref}}
            >
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={{
                                height: 20,
                                width: screenWidth,
                                paddingLeft: screenWidth * 0.9,
                                position: 'absolute',
                            }}
                            onPress={() => {
                                this.onCloseClick();
                                // this.setState({ knowledgeModelVisibility: false });
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
                                            console.log('---------------------------------');
                                            console.log(JSON.parse(event.nativeEvent.data).name , JSON.parse(event.nativeEvent.data).id);
                                            console.log('---------------------------------');
                                            this.setState({ 
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
            </Overlay>
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



    render() {
        console.log('------------------render---------', Date.parse(new Date()));
        return (
            <View 
                style={this.state.knowledgeModelVisibility ? 
                    {...styles.model, borderWidth: 1, borderColor: '#DCDCDC' , opacity: 0}
                    : {...styles.model, borderWidth: 1, borderColor: '#DCDCDC' , opacity: 1}} 
            >
                <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                    <View style={{...styles.itemView, marginBottom: 5}}>
                        <Text style={!this.state.shareContent ? styles.content : styles.contentSelected} 
                            onPress={()=>{this.updateContent(1 , this.state.shareContent)}}>共享内容</Text>
                        <Text style={!this.state.schoolContent ? styles.content : styles.contentSelected} 
                            onPress={()=>{this.updateContent(2 , this.state.schoolContent)}}>本校内容</Text>
                        <Text style={!this.state.privateContent ? styles.content : styles.contentSelected} 
                            onPress={()=>{this.updateContent(3 , this.state.privateContent)}}>私有内容</Text>
                    </View>

                    {/**学段 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(1, this.state.studyRankVisibility);
                        }}
                    >
                        <View style={styles.itemView}>
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
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />

                    {/**学科 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(2, this.state.studyClassVisibility);
                        }}
                    >
                        <View style={styles.itemView}>
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
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                
                    {/**版本 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(3, this.state.editionVisibility);
                        }}
                    >
                        <View style={styles.itemView}>
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
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                    
                    {/**教材 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(4, this.state.bookVisibility);
                        }}
                    >
                        <View style={styles.itemView}>
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
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                
                    {/**知识点 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(5, this.state.knowledgeVisibility);
                        }}
                    >
                        <View style={styles.itemView}>
                            <Text style={styles.longTitle}>知识点:</Text>
                            <Text style={styles.studyRank}
                                numberOfLines={1}
                                ellipsizeMode={"tail"}
                            >{this.state.knowledge}</Text>
                        </View>
                    </TouchableOpacity>
                    {/**知识点选择悬浮页面!!! */}
                    {this.state.knowledgeVisibility ?
                        <TouchableOpacity
                            style={styles.knowledge}
                            onPress={() => {this.setState({ knowledgeModelVisibility: true })}}
                        >
                            <Text style={styles.knowledgeText}>
                                点击这里选择知识点
                            </Text>
                            {/* {console.log('********this.state.knowledgeModelVisibility******',this.state.knowledgeModelVisibility)} */}
                            {this.state.knowledgeModelVisibility ?
                                this.showKnowledgeModal()
                                : null
                            }
                            {/* {this.showKnowledgeModal()} */}
                        </TouchableOpacity>
                        : null
                    }
                    {/* {
                        this.state.knowledgeVisibility  && this.state.knowledgeModelVisibility?
                                    this.showKnowledgeModal()
                                    : null

                    } */}
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />

                    {/**类型 */}
                    <TouchableOpacity
                        onPress={() => {
                            this.updateVisibility(6, this.state.paperTypeVisibility);
                        }}
                    >
                        <View style={styles.itemView}>
                            <Text style={styles.title}>类型:</Text>
                            <Text style={styles.studyRank}>{this.state.paperType}</Text>
                            {this.state.paperTypeVisibility ?
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
                    {/**类型列表!!! */}
                    {this.state.paperTypeVisibility ?
                        <View style={styles.contentlistView}>
                            {
                                this.props.paperTypeList.length > 0
                                    ? this.showPaperType()
                                    : <Text>试题类型列表未获取到或者为空</Text>
                            }
                        </View>
                        : null
                    }
                    {/**分割线 */}
                    <View style={{ paddingLeft: 0, width: screenWidth, height: 2, backgroundColor: "#DCDCDC" }} />
                </ScrollView>

                {/**重置 确定按钮 */}
                <View
                    style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: '#DCDCDC',
                        backgroundColor: '#fff',
                        width: screenWidth*0.6,
                        top: '100%',
                        position: 'absolute',

                    }}
                >
                    <Text style={this.state.resetButton ? styles.buttonSelect : styles.button}
                        onPress={() => {
                            Alert.alert('重置功能还未写！！！')
                        }}
                    >
                       重置
                    </Text>
                    <Text style={this.state.sureButton ? styles.buttonSelect : styles.button}
                        onPress={() => { 
                            Alert.alert('确定功能还未写！！！')
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
        top: 70 , 
        right: 0 , 
        height: screenHeight*0.6,
        width: screenWidth*0.7,
        position: 'absolute',
    },
    content: {
        width: screenWidth * 0.2,
        height: 30,
        fontSize: 15,
        fontWeight: '400',
        paddingTop: 5,
        textAlign: 'center',
        color: '#4DC7F8',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#4DC7F8',
        backgroundColor: '#fff',
        marginLeft: 10,
    },
    contentSelected: {
        width: screenWidth * 0.2,
        height: 30,
        fontSize: 15,
        fontWeight: '400',
        paddingTop: 5,
        textAlign: 'center',
        color: 'white',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#4DC7F8',
        backgroundColor: '#4DC7F8',
        marginLeft: 10,
    },
    itemView: {
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    title: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth * 0.1,
        paddingTop: 5,
        paddingBottom: 5,
        //height:'100%',
    },
    longTitle: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth * 0.15,
        paddingTop: 5,
        paddingBottom: 5,
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
        width: screenWidth * 0.4,
        height: 40,
        paddingTop: 5,
    },
    studyRankItem: {
        width: screenWidth * 0.2,
        height: 40,
        fontSize: 15,
        color: 'black',
        backgroundColor: '#DCDCDC',
        fontWeight: '300',
        padding: 10,
        borderWidth: 2,
        borderColor: '#fff',
        textAlign: 'center',
        marginLeft: 5,
    },
    studyRankItemSelected: {
        width: screenWidth * 0.2,
        height: 38,
        fontSize: 15,
        color: 'black',
        backgroundColor: '#DCDCDC',
        fontWeight: '300',
        padding: 10,
        borderWidth: 1,
        borderColor: 'red',
        textAlign: 'center',
        marginLeft: 5,
    },
    studyRankImg: {
        height: 20,
        width: 20,
        top: 10,
        //resizeMode: "contain",
        right: 10,
        position: 'absolute',
    },
    knowledge: {
        width: screenWidth * 0.6,
        height: 40,
        backgroundColor: '#DCDCDC',
        left: 10,
        borderRadius: 5,
        //paddingBottom: 10,
        marginTop: 5,
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
        width: screenWidth * 0.35,
        height: 40,
        fontSize: 15,
        fontWeight: '400',
        paddingTop: 8,
        textAlign: 'center',
        color: 'black',
        backgroundColor: '#fff',
    },
    buttonSelect:{
        width: screenWidth * 0.35,
        height: 40,
        fontSize: 15,
        fontWeight: '400',
        paddingTop: 8,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'red',
    },
    centeredView: {
        //height: '100%',
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