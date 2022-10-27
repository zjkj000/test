import React , {useEffect,useState} from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity,TextInput,Alert, Modal,ScrollView} from "react-native";
import { SearchBar } from "@ant-design/react-native";
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../utils/http/request";
import {Avatar,Layout,Button,Divider,Input,OverflowMenu,MenuItem,} from "@ui-kitten/components";
import { WebView } from 'react-native-webview';
import Toast from '../../../utils/Toast/Toast'
import StorageUtil from "../../../utils/Storage/Storage";

export default function CreateWorkContainer(props) {
    const navigation = useNavigation();
    navigation.setOptions({title:'设置属性'});
    return <CreateWork navigation={navigation} />;
}

class CreateWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InputText:'', 

            studyRank: '', //学段
            studyRankId: '', //学段编码
            studyRankVisibility: false, //学段选择列表是否显示
            channelNameList: [], //学段名列表（接口数据）
            
            studyClass: '', //学科
            studyClassId: '' , //学科编码
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
            
            knowledge: '', //知识点
            knowledgeCode: '', //选中的知识点项的编码
            Longknowledge:'',          //长知识点+（包括单元  教材  版本）
            knowledgeVisibility: false, //知识点选择列表是否显示     
            knowledgeModelVisibility: false, //知识点悬浮框model是否显示      
            knowledgeList: [], //从接口中返回的数据
            webViewHeight: 0, //知识点内容webView高度

            //网络请求状态
            error: false,
            errorInfo: "",
            res:''   //historyProperty
        };
    }

    UNSAFE_componentWillMount(){
        StorageUtil.get("historyProperty").then((res) => { 
            if (res) {
                this.setState({ 
                    res:res,
                    studyRank: res.studyRank ?  res.studyRank : '',
                    studyRankId: res.studyRankId ?  res.studyRankId : '', 
                    channelNameList: res.channelNameList ?  res.channelNameList : [], 

                    studyClass: res.studyClass ?  res.studyClass : '', 
                    studyClassId: res.studyClassId ?  res.studyClassId : '', 
                    studyClassList: res.studyClassList ?  res.studyClassList : [], 

                    edition: res.edition ?  res.edition : '', 
                    editionId: res.editionId ?  res.editionId : '', 
                    editionList: res.editionList ?  res.editionList : [], 

                    book: res.book ?  res.book : '', 
                    bookId: res.bookId ?  res.bookId : '', 
                    bookList: res.bookList ?  res.bookList : [], 

                    knowledge: res.knowledge ?  res.knowledge : '', 
                    Longknowledge: res.Longknowledge ?  res.Longknowledge : '',
                    knowledgeCode: res.knowledgeCode ?  res.knowledgeCode : '', 
                    knowledgeList: res.knowledgeList ?  res.knowledgeList : [], 
                });
            }
        });
    }

    //更新缓存
    setPropertys = () => {
        let propertys = {
            studyRank: this.state.studyRank ?  this.state.studyRank : '',
            studyRankId: this.state.studyRankId ?  this.state.studyRankId : '', 
            channelNameList: this.state.channelNameList ?  this.state.channelNameList : [], 

            studyClass: this.state.studyClass ?  this.state.studyClass : '', 
            studyClassId: this.state.studyClassId ?  this.state.studyClassId : '', 
            studyClassList: this.state.studyClassList ?  this.state.studyClassList : [], 

            edition: this.state.edition ?  this.state.edition : '', 
            editionId: this.state.editionId ?  this.state.editionId : '', 
            editionList: this.state.editionList ?  this.state.editionList : [], 

            book: this.state.book ?  this.state.book : '', 
            bookId: this.state.bookId ?  this.state.bookId : '', 
            bookList: this.state.bookList ?  this.state.bookList : [], 

            knowledge: this.state.knowledge ?  this.state.knowledge : '', 
            Longknowledge: this.state.Longknowledge ?  this.state.Longknowledge : '',
            knowledgeCode: this.state.knowledgeCode ?  this.state.knowledgeCode : '', 
            knowledgeList: this.state.knowledgeList ?  this.state.knowledgeList : [], 
        };
        StorageUtil.save("historyProperty", propertys);
    }
    //更新是否显示状态
    updateVisibility = (flag , visibility) => {
        //如果当前列表状态为true，点击后需要把所有的列表都隐藏
        if(visibility == true){
            this.setState({
                studyRankVisibility: false,
                studyClassVisibility: false,
                editionVisibility: false,
                bookVisibility: false,
                knowledgeVisibility: false,
            })
        }else{
            if(flag == 1){ //学段
                this.setState({
                    studyRankVisibility: true,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                })
            }else if(flag == 2){ //学科
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: true,
                    editionVisibility: false,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                })
            }else if(flag == 3){ //版本
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: true,
                    bookVisibility: false,
                    knowledgeVisibility: false,
                })
            }else if(flag == 4){ //教材
                this.setState({
                    studyRankVisibility: false,
                    studyClassVisibility: false,
                    editionVisibility: false,
                    bookVisibility: true,
                    knowledgeVisibility: false,
                })
            }else if(flag == 5){ //知识点
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
    getLongknowledge(id){
        const url = global.constants.baseUrl+"teacherApp_getPointName.do";
        const params = {
            pointId:id}
        http.get(url, params)
        .then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                this.setState({
                    Longknowledge:resJson.data
                })
            }
        })
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
                this.setState({ knowledgeModelVisibility: false });
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={{
                            height: 20,
                            width: screenWidth,
                            paddingLeft: screenWidth*0.9,
                            position: 'absolute',
                        }}
                        onPress={() => {
                            this.setState({ knowledgeModelVisibility: false });
                        }}
                        >
                        <Image  style={{top: 0,height: '80%',width: '80%',resizeMode: "center",}} 
                        source={require('../../../assets/image3/top.png')}
                        />
                    </TouchableOpacity>
                  {this.state.knowledgeList.length <= 0 ?  this.showKnowledgeList() : null}
                  {
                      this.state.knowledgeList.length > 0 ? 
                                // <View style={{height: this.state.webViewHeight}}>
                                <WebView
                                    onMessage={
                                        (event)=>{
                                        var id = JSON.parse(event.nativeEvent.data).id
                                        this.setState({ 
                                            knowledgeModelVisibility: false,
                                            knowledge:JSON.parse(event.nativeEvent.data).name,
                                            knowledgeCode:JSON.parse(event.nativeEvent.data).id});
                                        
                                        this.getLongknowledge(id)
                                        
                                        }}
                                    javaScriptEnabled={true}
                                    scalesPageToFit={Platform.OS === 'ios'? true : false}
                                    // style={{height: screenHeight , width : screenWidth}}
                                    source={{ html: this.state.knowledgeList }}
                                ></WebView>
                                : <Text>知识点数据未请求到或没有数据</Text>
                  }
                </View>
              </View>
            </Modal>
        );
    }

    //根据内容计算webview高度
    onWebViewMessage = (event) => {
        this.setState({ webViewHeight: Number(event.nativeEvent.data) })
    }

    //从接口中获取知识点内容
    showKnowledgeList = () => {
        const { studyClassId , editionId , bookId } = this.state;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getKnowledgeAllTree.do";
        const params = {
            subjectCode: studyClassId,
            textBookCode: editionId,
            gradeLevelCode: bookId,
        };
        
            http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ knowledgeList: resJson.data });
            })
            .catch((error) => {
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
        }; 

        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ channelNameList: resJson.data });
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示学段列表数据
    showChannelName = () => {
        const { channelNameList } = this.state;
        const content = channelNameList.map((item , index) => {
            return(
                <View key={index} style={{width: screenWidth*0.3}}>
                    <Text 
                        style={this.state.studyRank == item.channelName ?
                                        styles.studyRankItemSelected : 
                                        styles.studyRankItem
                            }
                        onPress={()=>{
                            if(this.state.studyRank != item.channelName){
                                this.setState({ 
                                    studyRank: item.channelName , 
                                    studyRankId: item.channelId ,
                                    //学段信息修改，清空学科信息，重新获取学科信息!!!
                                    studyClass: '',
                                    studyClassId: '',
                                    studyClassList: [] ,
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
                            }else{
                                this.setState({
                                    book:'',
                                    bookId:'',
                                })
                            }
                        }}
                    >
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
        }; 

        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ studyClassList: resJson.data });
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示学科列表数据
    showStudyClass = () => {
        const { studyClassList } = this.state;
        const content = studyClassList.map((item , index) => {
            return(
                <View key={index} style={{width: screenWidth*0.3}}>
                    <Text 
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={this.state.studyClass == item.subjectName.substring(2) ?
                                        styles.studyRankItemSelected : 
                                        styles.studyRankItem
                            }
                        onPress={()=>{
                            if(this.state.studyClass != item.subjectName.substring(2)){
                                this.setState({ 
                                    studyClass: item.subjectName.substring(2) , 
                                    studyClassId: item.subjectId ,
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
                            }else{
                                this.setState({
                                    book:'',
                                    bookId:'',
                                })
                            }
                        }}
                    >
                        {item.subjectName.substring(2)}
                    </Text>
                </View>
            );
        });
        return content;
    }

    //请求版本列表数据
    fetchEdition = () => {
        const { studyRankId , studyClassId } = this.state;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getBookVersionList.do";
        const params = {
            userName: userId,
            channelCode: studyRankId,
            subjectCode: studyClassId,
        }; 

        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ editionList: resJson.data });
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示版本列表数据
    showEdition = () => {
        const { editionList } = this.state;
        const content = editionList.map((item , index) => {
            return(
                <View key={index} style={{width: screenWidth*0.3}}>
                    <Text 
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={this.state.edition == item.textbookName ?
                                        styles.studyRankItemSelected : 
                                        styles.studyRankItem
                            }
                        onPress={()=>{
                            if(this.state.edition != item.textbookName){
                                this.setState({ 
                                    edition: item.textbookName , 
                                    editionId: item.textBookCode ,
                                    //教材信息修改
                                    book: '',
                                    bookId: '',
                                    bookList: [],
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: '',
                                    knowledgeCode: '',
                                })
                            }else{
                                this.setState({
                                    book:'',
                                    bookId:'',
                                })
                            }
                        }}
                    >
                        {item.textbookName}
                    </Text>
                </View>
            );
        });
        return content;
    }

    //获取教材列表数据
    fetchBook = () => {
        const { studyRankId , studyClassId , editionId } = this.state;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getBookList.do";
        const params = {
            userName: userId,
            channelCode: studyRankId,
            subjectCode: studyClassId,
            textBookCode: editionId,
        }; 

        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ bookList: resJson.data });
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示教材列表数据
    showBook = () => {
        const { bookList } = this.state;
        const content = bookList.map((item , index) => {
            return(
                <View key={index} style={{width: screenWidth*0.45}}>
                    <Text 
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={this.state.book == item.gradeLevelName ?
                                        styles.studyRankItemSelected : 
                                        styles.studyRankItem
                            }
                        onPress={()=>{
                            if(this.state.book != item.gradeLevelName){
                                this.setState({ 
                                    book: item.gradeLevelName , 
                                    bookId: item.gradeLevelCode ,
                                    //知识点信息修改
                                    knowledgeList: [],
                                    knowledge: '',
                                    knowledgeCode: '',
                                })
                            }else{
                                this.setState({
                                    book:'',
                                    bookId:'',
                                })
                            }
                        }}
                    >
                        {item.gradeLevelName}
                    </Text>
                </View>
            );
        });
        return content;
    }



    render(){

        return(
            <View style={{flexDirection: 'column' , backgroundColor: '#fff',borderTopWidth:0.8}}>
                <ScrollView horizontal={false} showsVerticalScrollIndicator={false}
                    style={{height: '93%' , backgroundColor: '#fff'}}>
                        
                        {/**名称 */}
                        <View style={{flexDirection: 'row' , backgroundColor: '#fff' , padding: 10,paddingLeft:20,borderBottomWidth:0.5,}}>
                            <Text style={styles.necessary}>*</Text>
                            <Text style={styles.title}>名称:</Text>
                            <TextInput 
                                placeholder="请输入名称"
                                value={this.state.InputText}
                                style={{
                                    width: screenWidth*0.7 ,
                                    height:40,
                                    marginLeft:15,
                                    backgroundColor: '#fff' , 
                                    borderColor: '#DCDCDC',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    paddingLeft: 20,
                                }}
                                onChangeText={(text)=>{
                                    this.setState({InputText:text})
                                }}
                            ></TextInput>
                        </View>
                            
                        {/* 学段+学段列表 */}
                        <View style={{backgroundColor: '#fff' , paddingLeft:20,paddingBottom:15,borderBottomWidth:0.5,}}>
                                {/**学段 */}
                                <TouchableOpacity onPress={() => {this.updateVisibility(1 , this.state.studyRankVisibility);}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.necessary}>*</Text>
                                        <Text style={styles.title}>学段:</Text>
                                        <Text style={styles.studyRank}>{this.state.studyRank}</Text>
                                        {this.state.studyRankVisibility ?    
                                                    <Image  style={styles.studyRankImg}
                                                            source={require('../../../assets/teacherLatestPage/top.png')}/> 
                                                    : <Image style={styles.studyRankImg}
                                                        source={require('../../../assets/teacherLatestPage/bot.png')}/>
                                        }
                                    </View>
                                </TouchableOpacity>
                                {/**学段列表 */}
                                {this.state.studyRankVisibility ?
                                    <View  style={styles.contentlistView}>
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
                        </View>
                        
                        {/* 学科+学科列表 */}
                        <View style={{backgroundColor: '#fff' ,  paddingLeft:20,paddingBottom:15,borderBottomWidth:0.5,}}>
                                {/**学科 */}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.updateVisibility(2 , this.state.studyClassVisibility);
                                    }}
                                >
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.necessary}>*</Text>
                                        <Text style={styles.title}>学科:</Text>
                                        <Text style={styles.studyRank}>{this.state.studyClass}</Text>
                                        {this.state.studyClassVisibility ? 
                                                        <Image 
                                                            style={styles.studyRankImg}
                                                            source={require('../../../assets/teacherLatestPage/top.png')}
                                                        /> 
                                                    : <Image 
                                                        style={styles.studyRankImg}
                                                        source={require('../../../assets/teacherLatestPage/bot.png')}
                                                    />
                                        }
                                    </View>
                                </TouchableOpacity>
                                {/**学科列表 */}
                                {this.state.studyClassVisibility ?
                                    <View  style={styles.contentlistView}>
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
                        </View>
                        
                        {/* 版本+版本列表 */}
                        <View style={{backgroundColor: '#fff' ,  paddingLeft:20,paddingBottom:15,borderBottomWidth:0.5,}}>
                                {/**版本 */}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.updateVisibility(3 , this.state.editionVisibility);
                                    }}
                                >
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.necessary}>*</Text>
                                        <Text style={styles.title}>版本:</Text>
                                        <Text style={styles.studyRank}>{this.state.edition}</Text>
                                        {this.state.editionVisibility ? 
                                                        <Image 
                                                            style={styles.studyRankImg}
                                                            source={require('../../../assets/teacherLatestPage/top.png')}
                                                        /> 
                                                    : <Image 
                                                        style={styles.studyRankImg}
                                                        source={require('../../../assets/teacherLatestPage/bot.png')}
                                                    />
                                        }
                                    </View>
                                </TouchableOpacity>
                                {/**版本列表 */}
                                {this.state.editionVisibility ?
                                    <View  style={styles.contentlistView}>
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
                        </View>
                        
                        {/* 教材+教材列表 */}
                        <View style={{backgroundColor: '#fff' , paddingLeft:20,paddingBottom:15,borderBottomWidth:0.5,}}>
                            {/**教材 */}
                            <TouchableOpacity
                                onPress={() => {
                                    this.updateVisibility(4 , this.state.bookVisibility);
                                }}
                            >
                                <View style={{flexDirection: 'row' }}>
                                    <Text style={styles.necessary}>*</Text>
                                    <Text style={styles.title}>教材:</Text>
                                    <Text style={styles.studyRank}>{this.state.book}</Text>
                                    {this.state.bookVisibility ?     
                                                    <Image 
                                                        style={styles.studyRankImg}
                                                        source={require('../../../assets/teacherLatestPage/top.png')}
                                                    /> 
                                                : <Image 
                                                    style={styles.studyRankImg}
                                                    source={require('../../../assets/teacherLatestPage/bot.png')}
                                                />
                                    }
                                </View>
                            </TouchableOpacity>
                            {/**教材列表 */}
                            {this.state.bookVisibility ?
                                <View  style={styles.contentlistView}>
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
                        </View>

                        {/**知识点 */}
                        <View style={{backgroundColor: '#fff' ,  paddingLeft:20,paddingBottom:5,borderBottomWidth:0.5,}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.updateVisibility(5 , this.state.knowledgeVisibility);
                                }}
                            >
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.necessary}>*</Text>
                                    <Text style={styles.longTitle}>知识点:</Text>
                                    <Text style={styles.studyRank}>{this.state.knowledge}</Text>
                                </View>
                            </TouchableOpacity>
                            
                                <TouchableOpacity 
                                    style={styles.knowledge}
                                    onPress={()=>{
                                        this.updateVisibility(5 , this.state.knowledgeVisibility);
                                        if(this.state.book!='')
                                        {this.setState({ knowledgeModelVisibility: true })}
                                        else{
                                            Toast.showInfoToast('请先选择教材',1000)
                                        }
                                        
                                    }}
                                >
                                    <Text style={styles.knowledgeText}>
                                        点击这里选择知识点
                                    </Text>
                                    {this.state.knowledgeModelVisibility ? 
                                                this.showKnowledgeModal()
                                                : null
                                    }
                                </TouchableOpacity>
                               
                        </View>
                        
                       
                </ScrollView>

                {/**取消 确定按钮 */}
                <View 
                    style={{
                        flexDirection: 'row' , 
                        backgroundColor:'#fff',
                        top: '100%',
                        //height: '8%',
                        position: 'absolute',
                    }}
                >
                    <Text style={{width: screenWidth*0.05,backgroundColor:'#fff'}}></Text>
                    <Button style={styles.button}
                        onPress={()=>{
                            this.props.navigation.goBack();
                        }} 
                    >
                        取消
                    </Button>
                    <Text style={{width: screenWidth*0.1}}></Text>
                    <Button style={styles.button}
                        onPress={()=>{

                            if(this.state.InputText==''){
                                Alert.alert('','请输入试卷名称',[{},{},{text:'确定',onPress:()=>{}}])
                                Toast.showInfoToast('请输入试卷名称',1000)
                            }else if(this.state.knowledgeCode!=''&&this.state.Longknowledge!=''){
                                this.setPropertys()
                                this.props.navigation.navigate({
                                    name:'EditPicturePaperWork',
                                    params:{
                                        paperName:this.state.InputText,
                                        channelCode:this.state.studyRankId,          //学段码
                                        channelName:this.state.studyRank,
                                        subjectCode:this.state.studyClassId,              //学科编码
                                        subjectName:this.state.studyClass,
                                        textBookCode:this.state.editionId,            //教材版本编码
                                        textBookName:this.state.edition,
                                        gradeLevelCode:this.state.bookId,        //教材编码
                                        gradeLevelName:this.state.book,
                                        pointCode:this.state.knowledgeCode,                  //知识点码
                                        pointName:this.state.Longknowledge,
                                    }
                                })
                            }else{
                                Alert.alert('','请先选择知识点',[{},{},{text:'确定',onPress:()=>{}}])
                                Toast.showInfoToast('请先选择知识点',1000)
                            }
                            
                        }}
                    >
                        确定
                    </Button>
                    <Text style={{width: screenWidth*0.05}}></Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    necessary:{
        color: 'red',
        width: screenWidth*0.03,
        paddingTop: 12,
        //height:'100%',
    },
    title:{
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth*0.12,
        paddingTop: 12,
        //height:'100%',
    },
    longTitle:{
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth*0.18,
        paddingTop: 12,
    },
    contentlistView:{
        marginTop:12,
        flexDirection: 'row' , 
        flexWrap: 'wrap',  //自动换行
        backgroundColor: '#fff' , 
        left: screenWidth*0.025,
        marginBottom: 10,
    },
    studyRank:{
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        top: 8,
        width: screenWidth*0.6,
        paddingTop: 5,
    },
    studyRankItem:{
        // width: screenWidth * 0.25,
        fontSize: 15,
        margin:5,
        color: 'black',
        backgroundColor: '#DCDCDC',
        fontWeight: '300',
        padding: 8,
        borderWidth: 2,
        borderColor: '#fff',
        textAlign: 'center',
    },
    studyRankItemSelected:{
        // width: screenWidth * 0.25,
        fontSize: 15,
        margin:5,
        color: 'black',
        backgroundColor: '#DCDCDC',
        fontWeight: '300',
        padding: 8,
        borderWidth: 1,
        borderColor: 'red',
        textAlign: 'center',
    },
    studyRankImg:{
        height: '150%',
        width: screenWidth*0.1,
        resizeMode: "contain",
        left: screenWidth*0.85,
        position: 'absolute',
    },
    knowledge:{
        width: screenWidth*0.8 , 
        height: 40 , 
        backgroundColor: '#DCDCDC',
        left: 20,
        borderRadius: 5,
        //paddingBottom: 10,
        marginTop: 20,
        marginBottom: 15,
    },
    knowledgeText:{
        width: '70%' , 
        height: '100%',
        fontSize: 15,
        color: 'gray',
        fontWeight: '300',
        paddingTop: 10,
        paddingLeft: 10,
    },
    button:{
        width: screenWidth*0.4,
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
        paddingBottom:80
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
    }
})