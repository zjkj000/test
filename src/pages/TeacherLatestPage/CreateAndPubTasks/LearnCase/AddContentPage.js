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
    Slider, 
    TouchableWithoutFeedback, 
} from "react-native";
import { Button } from '@ui-kitten/components';
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../../utils/http/request";
import Loading from "../../../../utils/loading/Loading"; 
import Videos from "./Videos";

import Video from 'react-native-video';

import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';
import HTMLView from 'react-native-htmlview';

import Toast from '../../../../utils/Toast/Toast';

let pageFlag = 0; //pageFlag=0，currentPage有效；pageFlag=1，searchPage有效
let currentPage = 0;
let searchPage = 0;

let isFirstPage = true;  //当前数据是否是第一页数据的标志
let isLastPage = false; //当前数据是否是最后一页数据的标志

let fetchNum = 0;
let firstContentId = '';

export default function AddContentPageContainer(props) {
    const navigation = useNavigation();


    // console.log('---------AddContentPageContainer----props--------');
    // console.log('----type---', props.type , '---typeValue----' ,  props.typeValue);
    // console.log('-------------------------------------------------');

    //将navigation传给HomeworkProperty组件，防止路由出错
    return <AddContentPage navigation={navigation}
                        actionType = {props.actionType} 
                        channelCode = {props.channelCode}
                        subjectCode = {props.subjectCode}
                        textBookCode = {props.textBookCode}
                        gradeLevelCode = {props.gradeLevelCode}
                        pointCode = {props.pointCode}
                        type = {props.type}
                        typeValue = {props.typeValue}

                        setContentList = {props.setContentList}  
                        contentList = {props.contentList}

                        selectContentNum = {props.selectContentNum}
                        setSelectContentNum = {props.setSelectContentNum}

                        selectContentList = {props.selectContentList}
                        setSelectContentList = {props.setSelectContentList}

                        learnPlanId = {props.learnPlanId}
                        setLearnPlanId = {props.setLearnPlanId}

                        isFetchAgain={props.isFetchAgain}
                        setIsFetchAgain={props.setIsFetchAgain}
            />;
}

function formatTime(second) {
    let h = 0, i = 0, s = parseInt(second);
    if (s > 60) {
      i = parseInt(s / 60);
      s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
      return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(":");
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
            contentList: this.props.contentList,    //底部显示的导学案内容列表

            selectContentIndex: 0,
            selectContentNum: this.props.selectContentNum,
            selectContentList: this.props.selectContentList, //添加到导学案中的试题

            //导学案内容为ppt
            pptList: [],
            selectPptIndex: 0,

            //导学案内容为视频、音频
            showVideoControl: false, // 是否显示视频控制组件
            isPlaying: false,        // 视频是否正在播放
            currentTime: 0,        // 视频当前播放的时间
            duration: 0,           // 视频的总时长
            playFromBeginning: false, // 是否从头开始播放

            shareTag: '99',

            type: this.props.type,
            typeValue: this.props.typeValue,

            learnPlanId: this.props.learnPlanId,

            imgState: 1,

            //网络请求状态
            error: false,
            errorInfo: "",
        }
    }

    UNSAFE_componentWillMount(){
        console.log('-------add-----------componentWillMount-----------------------------');
        this.setState({
            channelCode: this.props.channelCode,
            subjectCode: this.props.subjectCode,
            textBookCode: this.props.textBookCode,
            gradeLevelCode: this.props.gradeLevelCode,
            pointCode: this.props.pointCode,
            contentList: this.props.contentList,    //底部显示的导学案内容列表

            selectContentNum: this.props.selectContentNum,
            selectContentList: this.props.selectContentList,
        })
        console.log(this.state.selectContentNum , this.state.selectContentList.length)
        console.log('--------------------------------------------------------------------');
        this.fetchData(this.state.type , this.state.typeValue , 'PHONE'); //type typeValue deviveType
    }

    UNSAFE_componentWillUpdate(nextProps){
        console.log('-------add-----------componentWillUpdate-----------------------------');
        // console.log('---------nextProps----------');
        // console.log(nextProps);
        // console.log('---------Props----------');
        // console.log(this.props);
        //重新筛选导学案属性
        if(
            // this.props.channelCode != nextProps.channelCode
            // || this.props.subjectCode != nextProps.subjectCode
            // || this.props.textBookCode != nextProps.textBookCode
            // || this.props.gradeLevelCode != nextProps.gradeLevelCode
            // || this.props.pointCode != nextProps.pointCode
            // || this.props.type != nextProps.type
            // || this.props.typeValue != nextProps.typeValue
            nextProps.isFetchAgain != this.props.isFetchAgain
            && nextProps.isFetchAgain
        ){
            pageFlag = 0; //pageFlag=0，currentPage有效；pageFlag=1，searchPage有效
            currentPage = 0;
            searchPage = 0;

            isFirstPage = true;  //当前数据是否是第一页数据的标志
            isLastPage = false; //当前数据是否是最后一页数据的标志
            fetchNum = 0;
            firstContentId = '';
            this.setState({
                channelCode: nextProps.channelCode,
                subjectCode: nextProps.subjectCode,
                textBookCode: nextProps.textBookCode,
                gradeLevelCode: nextProps.gradeLevelCode,
                pointCode: nextProps.pointCode,
                type: nextProps.type,
                typeValue: nextProps.typeValue
            },()=>{
                this.props.setIsFetchAgain(false);
                this.fetchData(nextProps.type , nextProps.typeValue , 'PHONE');
            })
        }
    }

    componentWillUnmount(){
        console.log('---------add---------componentWillUnmount----------------------------');
        console.log('----------add----learnPlanId-----WillUnmount-----', this.state.learnPlanId );
        //组件卸载时将已选中导学案数目以及导学案列表传给父组件CreateLearnFrame
        this.props.setSelectContentNum(this.state.selectContentList.length);
        this.props.setSelectContentList(this.state.selectContentList);
        this.props.setLearnPlanId(this.state.learnPlanId);

        pageFlag = 0; //pageFlag=0，currentPage有效；pageFlag=1，searchPage有效
        currentPage = 0;
        searchPage = 0;

        isFirstPage = true;  //当前数据是否是第一页数据的标志
        isLastPage = false; //当前数据是否是最后一页数据的标志
    }

    fetchData = (type , typeValue , deviceType) => {
        const userName = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_selectResToCreateLp.do";
        const params = {
            userName: userName,
            channelCode: this.state.channelCode,
            subjectCode: this.state.subjectCode,
            textBookCode: this.state.textBookCode,
            gradeLevelCode: this.state.gradeLevelCode,
            pointCode: this.state.pointCode,

            type: type,
            typeValue: typeValue,
            deviceType: deviceType,

            shareTag: this.state.shareTag,

            searchPage: searchPage,
            currentPage: currentPage,
            learnPlanId: this.state.learnPlanId,
            // callback: 'ha',
        };

        console.log('-----fetchData---pageFlag--currentPage--searchPage-', 
                pageFlag , currentPage , searchPage);
        // console.log(url , params);
        http.get(url, params)
            .then((resStr) => {
                fetchNum++;
                let resJson = JSON.parse(resStr);
                console.log('--------导学案内容--length----',resJson.data.esmodelList.length);
                // console.log((resJson.data.esmodelList)[0]);
                if(this.state.shareTag != '50'){
                    console.log('--------导学案Page------');
                    console.log('pageFlag' , resJson.data.pageFlag);
                    console.log('currentPage', resJson.data.currentPage);
                    console.log('searchPage', resJson.data.searchPage);
                    console.log('----------add----learnPlanId----------', resJson.data.learnPlanId );
                }

                if(this.state.shareTag != '50'){
                    pageFlag = resJson.data.pageFlag;
                    currentPage = resJson.data.currentPage;
                    searchPage = resJson.data.searchPage;
                }else{
                    currentPage = resJson.data.currentPage;
                } 

                //第一次请求数据 第一个数据的id 
                if(fetchNum == 1 && resJson.data.esmodelList.length > 0){  
                    firstContentId = (resJson.data.esmodelList)[0].id;
                    console.log('*******firstContentId**************', firstContentId);
                }
                
                //更新当前请求的数据是否是第一页数据的标志(currentPage == 1 && pageFlag == 0) ||(searchPage == 1 && pageFlag == 1)
                if(
                    resJson.data.esmodelList.length > 0
                    && (resJson.data.esmodelList)[0].id == firstContentId
                ){
                    console.log('*******firstContentId******resJsonId********', firstContentId , (resJson.data.esmodelList)[0].id);
                    isFirstPage = true;
                }else{
                    isFirstPage = false;
                }
                console.log('---------isFirstPage----',isFirstPage);
                
                if(resJson.data.esmodelList.length > 0){
                    if(this.state.shareTag != '50'){
                        this.setState({ 
                            contentList: resJson.data.esmodelList,
                            learnPlanId: this.props.learnPlanId != '' ? this.props.learnPlanId : resJson.data.learnPlanId, //shareTag=99或10才有
                            selectContentIndex: 0,
                            pptList: [],
                            selectPptIndex: 0,
                            showVideoControl: false, // 是否显示视频控制组件
                            isPlaying: false,        // 视频是否正在播放
                            currentTime: 0,        // 视频当前播放的时间
                            duration: 0,           // 视频的总时长
                            playFromBeginning: false, // 是否从头开始播放
                        },()=>{
                            console.log('=======add===props===learnPlanId=============', this.props.learnPlanId);
                            console.log('=======add===state===learnPlanId=============', this.state.learnPlanId);
                        });
                    }else{
                        this.setState({ 
                            contentList: resJson.data.esmodelList,
                            selectContentIndex: 0,
                            pptList: [],
                            selectPptIndex: 0,
                            showVideoControl: false, // 是否显示视频控制组件
                            isPlaying: false,        // 视频是否正在播放
                            currentTime: 0,        // 视频当前播放的时间
                            duration: 0,           // 视频的总时长
                            playFromBeginning: false, // 是否从头开始播放
                        });
                    }
                }else if(resJson.data.esmodelList.length == 0){
                    isLastPage = true;
                    Alert.alert('','没有请求到导学案数据', [{} , {text: '关闭', onPress: ()=>{}}]);
                    this.setState({ 
                        contentList: [],
                        selectContentIndex: 0,
                        pptList: [],
                        selectPptIndex: 0,
                        showVideoControl: false, // 是否显示视频控制组件
                        isPlaying: false,        // 视频是否正在播放
                        currentTime: 0,        // 视频当前播放的时间
                        duration: 0,           // 视频的总时长
                        playFromBeginning: false, // 是否从头开始播放
                    })
                } 

                if(resJson.data.esmodelList.length < 5){
                    isLastPage = true;
                    // Alert.alert('没有更多导学案内容了');
                }
                console.log('---------isLastPage----',isLastPage);
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
        const { selectContentIndex , selectContentList , contentList } = this.state;
        let i = 0 ;
        for(i = 0 ; i < selectContentList.length ; i++){
            if(selectContentList[i].id == contentList[selectContentIndex].id){
                return true;
            }
        }
        if(i >= selectContentList.length){
            return false;
        }
        // i = selectContentList.indexOf(contentList[selectContentIndex]);
        // console.log('================导学案是否被选择=========================' , selectContentList.includes(contentList[selectContentIndex]));
        // return (selectContentList.includes(contentList[selectContentIndex])); 
    }

    getIndex = () => {
        const { selectContentIndex , selectContentList , contentList } = this.state;
        let i = -1 ;
        for(i = 0 ; i < selectContentList.length ; i++){
            if(selectContentList[i].id == contentList[selectContentIndex].id){
                return i;
            }
        }
        if(i >= selectContentList.length){
            return -1;
        }
    }

    ////修改选中题目数(添加试题小页面)
    updateSlectNum = (flag) => {
        const { selectContentIndex , selectContentList , contentList } = this.state;
        if(flag){ //删除内容
            // var index = selectContentList.indexOf(contentList[selectContentIndex]);
            var index = this.getIndex();
            var selectContentListCopy = selectContentList;
            if(index >= 0){
                selectContentListCopy.splice(index , 1);
                this.setState({
                    selectContentNum: this.state.selectContentNum - 1,
                    selectContentList: selectContentListCopy
                },()=>{
                    // this.props.setSelectContentNum(this.state.selectContentList.length);
                    // this.props.setSelectContentList(this.state.selectContentList);
                    // this.props.setLearnPlanId(this.state.learnPlanId);
                })
            }
        }else{ //添加内容
            var selectContentListCopy = selectContentList;
            selectContentListCopy.push(contentList[selectContentIndex]);
            this.setState({
                selectContentNum: this.state.selectContentNum + 1,
                selectContentList: selectContentListCopy
            },()=>{
                // this.props.setSelectContentNum(this.state.selectContentList.length);
                // this.props.setSelectContentList(this.state.selectContentList);
                // this.props.setLearnPlanId(this.state.learnPlanId);
            })
        }
    }

    //顶部（已选数目+添加+删除）
    showTitle = () => {
        return(
            <View>
                <View style={styles.paperSelectNumView}>
                    <Text style={styles.selectPaperNum}>(已选中{this.state.selectContentNum})</Text>
                    {/* <TouchableOpacity 
                        onPress={() => {
                            Alert.alert('-----')
                            console.log('*************************添加删除试题********************************')
                            let { selectContentNum , imgState } = this.state;
                            this.setState({ imgState: !imgState  , selectContentNum:selectContentNum + 1 })
                            // this.updateSlectNum(false);
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                top: 5,
                                left: screenWidth * 0.65,
                                position: 'absolute',
                            }}
                            source={
                                this.state.imgState == 0
                                ? require('../../../../assets/teacherLatestPage/shanchu.png')
                                : require('../../../../assets/teacherLatestPage/tianjia.png')
                            }
                        />
                    </TouchableOpacity> */}
                    {
                        this.state.contentList.length > 0 && this.ifSelected() ?
                                    <TouchableOpacity 
                                        onPress={()=>{this.updateSlectNum(true)}}
                                        style={{width: 30,height: 40}}
                                    >
                                        <Image
                                            style={{
                                                width: 30, 
                                                height: 30,
                                                top: 5,
                                                // left: screenWidth*0.5,
                                                // position: 'absolute',
                                            }} 
                                            source={require('../../../../assets/teacherLatestPage/shanchu.png')}
                                        />
                                    </TouchableOpacity>
                                    : 
                                    <TouchableOpacity 
                                        onPress={()=>{this.updateSlectNum(false)}}
                                        style={{width: 30,height: 40}}
                                    >
                                        <Image
                                            style={{
                                                width: 30, 
                                                height: 30,
                                                top: 5,
                                                // left: screenWidth*0.5,
                                                // position: 'absolute',
                                            }} 
                                            source={require('../../../../assets/teacherLatestPage/tianjia.png')}
                                        />
                                    </TouchableOpacity>
                    } 
                </View>
            </View>
        );
    }

    //导学案内容展示区
    showContent = () => {
        const {contentList , selectContentIndex} = this.state;
        console.log('====================导学案类型=======================',contentList[selectContentIndex].type)
        {console.log('导学案' , contentList[selectContentIndex].url)}
        if(contentList[selectContentIndex].type == 'paper'){
            return( //style={{height: screenHeight - 190}}
                <View style={styles.contentView}> 
                    <View style={{alignItems: "center",height:40,top:5}}>
                        <Text style={{
                                fontSize: 20,
                                fontWeight:'600',
                            }}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                        >
                            {contentList[selectContentIndex].name}
                        </Text>
                    </View>
                    <WebView  
                        scalesPageToFit={Platform.OS === 'ios'? true : false}
                        source={{ uri: contentList[selectContentIndex].url }} 
                    />
                </View>
            );
        }else if(contentList[selectContentIndex].type == 'question'){
            return(
                <View style={styles.contentView}>
                    <ScrollView  showsVerticalScrollIndicator={false}>
                        {/**题面 */}
                        <Text style={styles.paperContent}>[题面]</Text>
                        <View style={{padding: 10}}>
                            <RenderHtml 
                                contentWidth={screenWidth} 
                                source={{html: contentList[selectContentIndex].shitiShow}}
                                tagsStyles={{
                                    img:{
                                        flexDirection:'row',
                                        flexWrap:'wrap'
                                    },
                                    p:{
                                        flexDirection:'row',
                                        flexWrap:'wrap'
                                    }
                                }}
                            ></RenderHtml>
                        </View>
                        
                        <View style={{ height: 1, backgroundColor: "#999999" }} />

                        {/**答案 */}
                        <Text style={styles.paperContent}>[答案]</Text>
                        <View style={{padding: 10}}>
                            <RenderHtml 
                                contentWidth={screenWidth} 
                                source={{html: contentList[selectContentIndex].shitiAnswer}}
                                tagsStyles={{
                                    img:{
                                        flexDirection:'row',
                                        flexWrap:'wrap'
                                    },
                                    p:{
                                        flexDirection:'row',
                                        flexWrap:'wrap'
                                    }
                                }}
                            ></RenderHtml>
                        </View>
                        <View style={{ height: 1, backgroundColor: "#999999" }} />
                        
                        {/**解析 */}
                        <Text style={styles.paperContent}>[解析]</Text>
                        <View style={{padding: 10}}>
                            <RenderHtml 
                                contentWidth={screenWidth} 
                                source={{html: contentList[selectContentIndex].shitiAnalysis}}
                                tagsStyles={{
                                    img:{
                                        flexDirection:'row',
                                        flexWrap:'wrap'
                                    },
                                    p:{
                                        flexDirection:'row',
                                        flexWrap:'wrap'
                                    }
                                }}
                            ></RenderHtml>
                        </View>
                    </ScrollView>
                </View>
            );
        }else if(contentList[selectContentIndex].type == 'resource'){
            return(
                // <ScrollView  showsVerticalScrollIndicator={false}>
                <View style={styles.contentView}>
                    {
                        contentList[selectContentIndex].format == 'ppt' && this.state.pptList.length <= 0
                            ? this.setState({ pptList: contentList[selectContentIndex].pptList })
                            : null
                    }
                    {this.showResourceType(contentList[selectContentIndex])}
                </View>
                // </ScrollView>
            );
        }
    }

    //当导学案类型为resource时，根据format返回对应格式的内容
    showResourceType = (contentTemp) => {
        if(contentTemp.format == 'word'){
            return( //style={{padding: 10,height: screenHeight*0.8}}
                <View style={{height:'100%'}}>
                    <View style={{alignItems: "center",height:40,top:5}}>
                        <Text style={{
                                fontSize: 20,
                                fontWeight:'600',
                            }}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                        >
                            {contentTemp.name}
                        </Text>
                    </View>
                    <WebView  
                        scalesPageToFit={Platform.OS === 'ios'? true : false}
                        source={{ uri: contentTemp.url }} 
                    />
                </View>
            );
        }else if(contentTemp.format == 'ppt'){
            const { pptList , selectPptIndex } = this.state;
            return(
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    style={{flexDirection: 'column'}}
                >
                    <View style={{alignItems: "center",height:40,top:5}}>
                        <Text style={{
                                fontSize: 20,
                                fontWeight:'600',
                            }}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                        >
                            {contentTemp.name}
                        </Text>
                    </View>
                    <View style={{alignItems:'center', marginTop: screenHeight*0.1,}}>
                        <Image style={{width:350,height:280}} source={{uri: pptList[selectPptIndex]}}></Image>
                    </View>
                    <ScrollView 
                        horizontal={true} 
                        style={{height: 100, marginTop: 30,marginTop: screenHeight*0.1}}
                        showsHorizontalScrollIndicator={false}
                    >
                        {this.getPPT(pptList)}
                    </ScrollView>
                </ScrollView> 
            );
        }else if(contentTemp.format == 'image'){
            return(
                <View style={{alignItems:'center',height:'100%',paddingTop:'15%'}}>
                    <Image style={{width:'90%',height:250}} source={{uri: contentTemp.url}}></Image>
                </View>
            );
        }else if(contentTemp.format == 'pdf'){
            return(<Text>这是pdf类型</Text>);
        }else if(contentTemp.format == 'text'){
            return(<Text>这是text类型</Text>);
        }else if(contentTemp.format == 'html'){
            return(<Text>这是html类型</Text>);
        }else if(contentTemp.format == 'flash'){
            return(<Text>这是flash类型</Text>);
        }else if(contentTemp.format == 'music'){
            return(
                <View style={{flex: 1,backgroundColor: '#fff',}}>
                  <View style={{alignItems: "center"}}>
                    <Text style={{
                        top: screenHeight*0.1,
                        fontSize: 20,
                        fontWeight:'600',
                      }}
                    >
                        {contentTemp.name}
                    </Text>
                  </View>
                  <View style={{
                        top: screenHeight*0.1,
                        width: screenWidth, 
                        height: 50, 
                        backgroundColor:'#000000',
                      }}
                  >
                    <Video
                      ref={(ref) => this.videoPlayer = ref}
                      source={{uri: contentTemp.url}}
                      rate={1.0}
                      volume={1.0}
                      muted={false}
                      paused={!this.state.isPlaying}
                      resizeMode={'contain'}
                      playWhenInactive={false}
                      playInBackground={false}
                      ignoreSilentSwitch={'ignore'}
                      progressUpdateInterval={250.0}  //通知频率
                      onLoadStart={this._onLoadStart}
                      onLoad={this._onLoaded}
                      onProgress={this._onProgressChanged}  //播放进度通知
                      onEnd={this._onPlayEnd}
                      onError={this._onPlayError}
                      onBuffer={this._onBuffering}
                      style={{width: screenWidth, height: 50}}
                    />
                    </View>
                    {
                        <View style={[styles.control, {width: screenWidth}]}>
                          {/**播放器工具栏 播放暂停图标onControlPlayPress() */}
                          <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlPlayPress() }}>
                            <Image
                              style={styles.playControl}
                              source={this.state.isPlaying ? require('../../../../assets/LatestTaskImages/continue.png') : require('../../../../assets/LatestTaskImages/pause.png')}
                            />
                          </TouchableOpacity>
                          <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                          {/**进度条 */}
                          <Slider
                            style={{flex: 1}}
                            maximumTrackTintColor={'#999999'}
                            minimumTrackTintColor={'#00c06d'}
                            thumbImage={require('../../../../assets/LatestTaskImages/jindu.png')}
                            value={this.state.currentTime}
                            minimumValue={0}
                            maximumValue={this.state.duration}
                            onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}
                          />
                          <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                        </View>
                    }
                </View>
            );
        }else if(contentTemp.format == 'video'){
            return(
                // <Videos videoObj={contentTemp} />
                <View style={{flex: 1,backgroundColor: '#fff',}}>
                  <View style={{alignItems: "center"}}>
                    <Text style={{
                        top: screenHeight*0.1,
                        fontSize: 20,
                        fontWeight:'600',
                      }}
                    >
                        {contentTemp.name}
                    </Text>
                  </View>
                  <View style={{
                        top: screenHeight*0.1,
                        width: screenWidth, 
                        height: screenHeight*0.57, 
                        backgroundColor:'#000000',
                      }}
                  >
                    <Video
                      ref={(ref) => this.videoPlayer = ref}
                      source={{uri: contentTemp.url}}
                      rate={1.0}
                      volume={1.0}
                      muted={false}
                      paused={!this.state.isPlaying}
                      resizeMode={'contain'}
                      playWhenInactive={false}
                      playInBackground={false}
                      ignoreSilentSwitch={'ignore'}
                      progressUpdateInterval={250.0}  //通知频率
                      onLoadStart={this._onLoadStart}
                      onLoad={this._onLoaded}
                      onProgress={this._onProgressChanged}  //播放进度通知
                      onEnd={this._onPlayEnd}
                      onError={this._onPlayError}
                      onBuffer={this._onBuffering}
                      style={{width: screenWidth, height: screenHeight*0.5,marginBottom:100}}
                    />
                    </View>
                    {/**hideControl()控制播放器工具栏的显示和隐藏 */}
                    <TouchableWithoutFeedback onPress={() => { this.hideControl() }}> 
                      <View
                        style={{
                          position: 'absolute',
                          top: screenHeight*0.1,
                          left: 0,
                          width: screenWidth,
                          height: screenHeight*0.5,
                          backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0)',
                          alignItems:'center',
                          justifyContent:'center'
                        }}>
                        {   //视频暂停时显示暂停图标
                          this.state.isPlaying ? null :
                            <TouchableWithoutFeedback onPress={() => { this.onPressPlayButton() }}>
                              <Image
                                style={styles.playButton}
                                source={require('../../../../assets/LatestTaskImages/pause.png')}
                              />
                            </TouchableWithoutFeedback>
                        }
                      </View>
                    </TouchableWithoutFeedback>
                    {
                      this.state.showVideoControl ?  // 是否显示视频控制组件
                        <View style={[styles.control, {width: screenWidth}]}>
                          {/**播放器工具栏 播放暂停图标onControlPlayPress() */}
                          <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlPlayPress() }}>
                            <Image
                              style={styles.playControl}
                              source={this.state.isPlaying ? require('../../../../assets/LatestTaskImages/continue.png') : require('../../../../assets/LatestTaskImages/pause.png')}
                            />
                          </TouchableOpacity>
                          <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                          {/**进度条 */}
                          <Slider
                            style={{flex: 1}}
                            maximumTrackTintColor={'#999999'}
                            minimumTrackTintColor={'#00c06d'}
                            thumbImage={require('../../../../assets/LatestTaskImages/jindu.png')}
                            value={this.state.currentTime}
                            minimumValue={0}
                            maximumValue={this.state.duration}
                            onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}
                          />
                          <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                        </View> : null
                    }
                </View>
            );
        }else if(contentTemp.format == 'other'){
            return(<Text>这是other类型</Text>);
        }
    }

    //当导学案类型为ppt时，底部水平显示PPT列表
    getPPT(pptList){
        const { selectPptIndex } = this.state;
        var pptItems=[];
        for(let ppt_i = 0 ; ppt_i < pptList.length ; ppt_i++){
            pptItems.push(
                <TouchableOpacity 
                    onPress={() => this.setState({ selectPptIndex: ppt_i })}
                >
                    <Image 
                        source={{uri: pptList[ppt_i]}} 
                        style={selectPptIndex == ppt_i ? styles.pptchecked : styles.pptlittle_image} 
                    />
                </TouchableOpacity>
                
            )
        }
        return pptItems;
    }

    //底部展示区
    showAddPaperBottom = () => {
        return(
            <View style={{ flexDirection:'row', alignItems: 'center' , ...styles.bottomView ,}}>
                <TouchableOpacity
                    style={{ height: 100, width: 40, paddingLeft: 5 , alignItems: 'center'}}
                    onPress={()=>{
                        // Alert.alert('上翻');
                        isLastPage = false;
                        if(this.state.shareTag != '50'){ //非私有内容
                            if(pageFlag == 1 && (searchPage == 0 || searchPage == 1)){
                                //从完全匹配到推荐，currentPage还是加了1
                                currentPage = currentPage - 1;
                                this.fetchData(this.state.type , this.state.typeValue , 'PHONE');
                            }
                            if(!isFirstPage){
                                if(pageFlag == 0){
                                    currentPage = currentPage - 1;
                                }else{
                                    searchPage = searchPage - 1;
                                }
                                this.fetchData(this.state.type , this.state.typeValue , 'PHONE');
                            }else{
                                Alert.alert('','已经是第一页数据了', [{} , {text: '关闭', onPress: ()=>{}}]);
                            }
                        }else{ //私有内容
                            if(!isFirstPage){
                                currentPage = currentPage - 1;
                                this.fetchData(this.state.type , this.state.typeValue , 'PHONE');
                            }else{
                                Alert.alert('','已经是第一页数据了', [{} , {text: '关闭', onPress: ()=>{}}]);
                            }
                        }
                    }}
                >
                    <Image
                        style={{ width: 25, height: 25, top: 37}}
                        source={require('../../../../assets/teacherLatestPage/back.png')}
                    ></Image>
                </TouchableOpacity>
                {/**显示底部试题类型图标 */}
                <View style={{ width: screenWidth - 80, flexDirection: 'row', alignItems: 'center'}}>
                    {this.showLearnCaseTypeImg()}
                </View>
                <TouchableOpacity
                    style={{ height: 100, width: 40, paddingRight: 5 , alignItems: 'center'}}
                    onPress={()=>{
                        // Alert.alert('下翻');
                        isFirstPage = false;
                        if(this.state.shareTag != '50'){ //非私有内容
                            if(!isLastPage){
                                if(pageFlag == 0){
                                    currentPage = currentPage + 1;
                                }else{
                                    searchPage = searchPage + 1;
                                }
                                this.fetchData(this.state.type , this.state.typeValue , 'PHONE');
                            }else{
                                Alert.alert('','已经是最后一页数据了', [{} , {text: '关闭', onPress: ()=>{}}]);
                            }  
                        }else{
                            if(!isLastPage){
                                currentPage = currentPage + 1;
                                this.fetchData(this.state.type , this.state.typeValue , 'PHONE');
                            }else{
                                Alert.alert('','已经是最后一页数据了', [{} , {text: '关闭', onPress: ()=>{}}]);
                            } 
                        }
                    }}
                >
                    <Image
                        style={{ width: 25, height: 25, top: 37}}   
                        source={require('../../../../assets/teacherLatestPage/next.png')}
                    ></Image>
                </TouchableOpacity>
            </View>
        );
    }

    //显示底部导学案类型图标
    showLearnCaseTypeImg = () => {
        const { contentList , selectContentIndex } = this.state;
        let content = [];
        for(let i = 0 ; i < contentList.length ; i++){
            let contentTypeImg;
            if(contentList[i].type == 'question'){
                if(contentList[i].baseTypeId == '101'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/101.png');
                }else if(contentList[i].baseTypeId == '102'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/102.png');
                }else if(contentList[i].baseTypeId == '103'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/103.png');
                }else if(contentList[i].baseTypeId == '104'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/104.png');
                }else if(contentList[i].baseTypeId == '106'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/106.png');
                }else if(contentList[i].baseTypeId == '108'){
                    if(contentList[i].typeName.indexOf('填空')){
                        contentTypeImg = require('../../../../assets/teacherLatestPage/109.png');
                    }else{
                        contentTypeImg = require('../../../../assets/teacherLatestPage/108.png');
                    }
                }else{
                    contentTypeImg = require('../../../../assets/teacherLatestPage/107.png');
                }
            }else if(contentList[i].type == 'paper'){
                contentTypeImg = require('../../../../assets/teacherLatestPage/word.png');
            }else if(contentList[i].type == 'resource'){
                if(contentList[i].format == 'other'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/other.png');
                }else if(contentList[i].format == 'video'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/mp4.png');
                }else if(contentList[i].format == 'music'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/music.png');
                }else if(contentList[i].format == 'image'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/image.png');
                }else if(contentList[i].format == 'word'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/word.png');
                }else if(contentList[i].format == 'ppt'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/ppt.png');
                }else if(contentList[i].format == 'pdf'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/pdf.png');
                }else if(contentList[i].format == 'text'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/txt.png');
                }else if(contentList[i].format == 'html'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/html.png');
                }
            }

            content.push(
                <TouchableOpacity 
                    key={i}
                    onPress={() => {
                        if(selectContentIndex != i){
                            console.log('-----------select----i---' ,i);
                            this.setState({ 
                                selectContentIndex: i,
                                pptList: [],
                                selectPptIndex: 0,
                                showVideoControl: false, // 是否显示视频控制组件
                                isPlaying: false,        // 视频是否正在播放
                                currentTime: 0,        // 视频当前播放的时间
                                duration: 0,           // 视频的总时长
                                playFromBeginning: false, // 是否从头开始播放
                            })
                        }
                    }}
                    style={{
                        top: 5,
                        // height: 90,
                        height: (screenWidth - 80) * 0.2,
                        width: (screenWidth - 80) * 0.2 ,
                        alignItems: 'center'
                    }}
                >
                    <Image 
                        source={contentTypeImg} 
                        style={selectContentIndex == i ? styles.checked : styles.little_image} 
                    />
                </TouchableOpacity>   
            );
        }
        return content;
    }

    render(){
        return( //style={styles.bodyView}
            <View  style={{ flexDirection: 'column', backgroundColor: '#fff' , flex: 1 }}>  
                <View style={styles.bodyView}>
                    {
                        this.showTitle()
                    }
                    {/* <ScrollView   
                        showsVerticalScrollIndicator={false}
                        style={styles.contentView}
                        keyboardShouldPersistTaps={true}
                    > */}
                    {/* <View style={styles.contentView}> */}
                        {
                            this.state.contentList.length > 0 
                                    ? this.showContent() 
                                    : <Loading show={true} />
                        }
                    {/* </View> */}
                </View>
                {/* </ScrollView> */}
                {
                    this.state.contentList.length > 0 
                            ? this.showAddPaperBottom() 
                            : null
                }
            </View>
        )
    }

    /// -------Video组件回调事件-------
    
    _onLoadStart = () => {
        console.log('视频开始加载');
    };
    
    _onBuffering = () => {
        console.log('视频缓冲中...')
    };
    
    _onLoaded = (data) => {
        console.log('视频加载完成');
        this.setState({
        duration: data.duration,
        });
    };
    
    _onProgressChanged = (data) => {
        console.log('视频进度更新');
        if (this.state.isPlaying) {
        this.setState({
            currentTime: data.currentTime,
        })
        }
    };
    
    _onPlayEnd = () => {
        console.log('视频播放结束');
        this.setState({
        currentTime: 0,
        isPlaying: false,
        playFromBeginning: true
        });
    };
    
    _onPlayError = () => {
        console.log('视频播放失败');
    };

    ///-------控件点击事件-------
    
    /// 控制播放器工具栏的显示和隐藏
    hideControl() {
        if (this.state.showVideoControl) {
            this.setState({
                showVideoControl: false,
            })
        } else {
            this.setState(
                {
                showVideoControl: true,
                },
                // 5秒后自动隐藏工具栏
                () => {
                setTimeout(
                    () => {
                    this.setState({
                        showVideoControl: false
                    })
                    }, 5000
                )
            })
        }
    }
    
    /// 点击了播放器正中间的播放按钮
    onPressPlayButton() {
        let isPlay = !this.state.isPlaying;
        this.setState({
            isPlaying: isPlay,
        });
        if (this.state.playFromBeginning) {
            this.videoPlayer.seek(0);
            this.setState({
                playFromBeginning: false,
            })
        }
    }

    /// 点击了工具栏上的播放按钮
    onControlPlayPress() {
        this.onPressPlayButton();
    }

    /// 进度条值改变
    onSliderValueChanged(currentTime) {
        this.videoPlayer.seek(currentTime);
        if (this.state.isPlaying) {
        this.setState({
            currentTime: currentTime
        })
        } else {
            this.setState({
                currentTime: currentTime,
                isPlaying: true,
            })
        }
    }
}

const styles = StyleSheet.create({
    bodyView: {
        height: screenHeight - 220,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    contentView:{
        height: screenHeight - 220,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    bottomView: {
        height: 100,
        bottom: 1,
        position: 'absolute',
        backgroundColor: '#fff',       
    },
    paperContent: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 10,
    },
    little_image:{
        bottom: 3,
        height: (screenWidth - 80) * 0.18,
        width: (screenWidth - 80) * 0.18,
    },
    checked:{
        height: (screenWidth - 80) * 0.19,
        width: (screenWidth - 80) * 0.19,
        bottom: 5,
        borderColor: '#FFA500',
        borderRadius: 5,
        borderWidth: 5,
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
        width: screenWidth*0.9,
    },
    pptlittle_image:{
        height:75,
        width:95,
        marginLeft:5,
    },
    pptchecked:{
        height:75,
        width:95,
        marginLeft:5,
        borderColor:'#FFA500',
        borderWidth:2,
    },
    playButton: {
        width: 50,
        height: 50,
    },
    playControl: {
        width: 24,
        height: 24,
        marginLeft: 15,
    },
    time: {
        fontSize: 12,
        color: 'white',
        marginLeft: 10,
        marginRight: 10
    },
    control: {
        flexDirection: 'row',
        height: 44,
        alignItems:'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
})