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

export default function UpdateContentPageContainer(props) {
    const navigation = useNavigation();

    console.log('----------props-------------',props.selectContentNum)

    //将navigation传给HomeworkProperty组件，防止路由出错
    return <UpdateContentPage navigation={navigation}
                actionType = {props.actionType}
                learnPlanId = {props.learnPlanId}
                selectContentNum = {props.selectContentNum}
                setSelectContentNum = {props.setSelectContentNum}

                selectContentList = {props.selectContentList}
                setSelectContentList = {props.setSelectContentList}
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

class UpdateContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateContentIndex: 0,
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
        }
    }

    UNSAFE_componentWillMount(){
        console.log('-------update-----------componentWillMount-----------------------------');
        this.setState({
            selectContentNum: this.props.selectContentNum,
            selectContentList: this.props.selectContentList,
        })
        console.log(this.state.selectContentNum , this.state.selectContentList.length)
        console.log('--------------------------------------------------------------------');
        if(this.props.actionType == 'update' && this.state.selectContentList.length <= 0){
            this.fetchLearnPlanEditContent();
        }
    }

    fetchLearnPlanEditContent = () => {
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getLpEditContent.do";
        const params = {
            learnPlanId: this.props.learnPlanId,
            deviceType: 'PHONE'
            //callback:'ha',
        };

        console.log('-----==================fetchLearnPlanEditContent==================-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('--------导学案内容列表------',resJson.data.length);
                // console.log(resJson.data);
                // console.log('------------------------');
                if(resJson.data.length > 0){
                    this.setState({ 
                        selectContentList: resJson.data,
                        selectContentNum: resJson.data.length
                    },()=>{
                        this.props.setSelectContentNum(this.state.selectContentList.length);
                        this.props.setSelectContentList(this.state.selectContentList);
                        console.log('=========selectContentList=============',this.state.selectContentList.length)
                    });
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

    UNSAFE_componentWillUpdate(){
        console.log('-----------update-------componentWillUpdate-----------------------------');
        console.log('================update============================',this.props.selectContentNum);
        // console.log(this.props.selectContentList)
        console.log('==================================================');
    }

    componentWillUnmount(){
        console.log('--------update----------componentWillUnmount----------------------------');
        //组件卸载时将已选中导学案数目以及导学案列表传给父组件CreateLearnFrame
        this.props.setSelectContentNum(this.state.selectContentList.length);
        this.props.setSelectContentList(this.state.selectContentList);
    }


    ////修改选中题目数(调整内容顺序小页面)
    updateSlectNum = () => {
        const {  selectContentList , updateContentIndex } = this.state;
        var selectContentListCopy = selectContentList;
        selectContentListCopy.splice(updateContentIndex , 1);
        this.setState({
            selectContentNum: this.state.selectContentList.length - 1,
            //若删除的是最后一道题，则页面显示selectContentList最新的最后一道题
            updateContentIndex: updateContentIndex == selectContentList.length ? 
                                    selectContentList.length - 1 : updateContentIndex,
            selectContentList: selectContentListCopy
        },()=>{
            this.props.setSelectContentNum(this.state.selectContentList.length);
            this.props.setSelectContentList(this.state.selectContentList);
        })
    }

    //顶部（已选数目+删除）
    showTitle = () => {
        return(
            <View>
                <View style={styles.paperSelectNumView}>
                    <Text style={styles.selectPaperNum}>
                        {this.state.updateContentIndex + 1}
                        {'/'}
                        {this.state.selectContentList.length}
                    </Text>
                    {
                        //（同类型试题之间）移动试题 上移
                        <TouchableOpacity 
                            onPress={()=>{this.moveUpPaper()}}
                            style={{width: 30,height: 40,}}
                        >
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    top: 7,
                                    // left: screenWidth*0.4,
                                    // position: 'absolute',
                                }} 
                                source={require('../../../../assets/teacherLatestPage/shangyi.png')}
                            />
                        </TouchableOpacity>
                    }
                    {
                        //（同类型试题之间）移动试题 下移
                        <TouchableOpacity 
                            onPress={()=>{this.moveDownPaper()}}
                            style={{width: 31,height: 40,left: 20,}}
                        >
                            <Image
                                style={{
                                    width: 31,
                                    height: 31,
                                    top: 7,
                                    // left: screenWidth*0.53,
                                    // position: 'absolute',
                                }} 
                                source={require('../../../../assets/teacherLatestPage/xiayi.png')}
                            />
                        </TouchableOpacity>
                    }
                    {
                        <TouchableOpacity 
                            onPress={()=>{this.updateSlectNum()}}
                            style={{width: 30,height: 40,left: 40,}}
                        >
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    top: 7,
                                    // left: screenWidth*0.652,
                                    // position: 'absolute',
                                }} 
                                source={require('../../../../assets/teacherLatestPage/shanchu.png')}
                            />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }

    //已选中导学案内容展示区
    showContent  = () => {
        const {selectContentList , updateContentIndex} = this.state;
        if(selectContentList[updateContentIndex].type == 'paper'){
            return(
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
        }else if(selectContentList[updateContentIndex].type == 'question'){
            return(
                <View style={styles.contentView}>
                    <ScrollView  showsVerticalScrollIndicator={false}>
                        {/**题面 */}
                        <Text style={styles.paperContent}>[题面]</Text>
                        <View style={{padding: 10}}>
                            <RenderHtml 
                                contentWidth={screenWidth} 
                                source={{html: selectContentList[updateContentIndex].shitiShow}}
                                tagsStyles={{
                                    img: {
                                    flexDirection: 'row',
                                    },
                                    p: {
                                    flexDirection: 'row',
                                    },
                                }}
                            ></RenderHtml>
                        </View>
                        
                        <View style={{ height: 1, backgroundColor: "#999999" }} />

                        {/**答案 */}
                        <Text style={styles.paperContent}>[答案]</Text>
                        <View style={{padding: 10}}>
                            <RenderHtml 
                                contentWidth={screenWidth} 
                                source={{html: selectContentList[updateContentIndex].shitiAnswer}}
                                tagsStyles={{
                                    img: {
                                    flexDirection: 'row',
                                    },
                                    p: {
                                    flexDirection: 'row',
                                    },
                                }}
                            ></RenderHtml>
                        </View>
                        <View style={{ height: 1, backgroundColor: "#999999" }} />
                        
                        {/**解析 */}
                        <Text style={styles.paperContent}>[解析]</Text>
                        <View style={{padding: 10}}>
                            <RenderHtml 
                                contentWidth={screenWidth} 
                                source={{html: selectContentList[updateContentIndex].shitiAnalysis}}
                                tagsStyles={{
                                    img: {
                                    flexDirection: 'row',
                                    },
                                    p: {
                                    flexDirection: 'row',
                                    },
                                }}
                            ></RenderHtml>
                        </View>
                    </ScrollView>
                </View>
            );
        }else if(selectContentList[updateContentIndex].type == 'resource'){
            return(
                <View style={styles.contentView}>
                    {
                        selectContentList[updateContentIndex].format == 'ppt' && this.state.pptList.length <= 0
                            ? this.setState({ pptList: selectContentList[updateContentIndex].pptList })
                            : null
                    }
                    {this.showResourceType(selectContentList[updateContentIndex])}
                </View>
            );
        }
    }

    //当导学案类型为resource时，根据format返回对应格式的内容
    showResourceType = (contentTemp) => {
        if(contentTemp.format == 'word'){
            return(
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

    //向上（前）移动试卷题目
    moveUpPaper = () => {
        const { updateContentIndex , selectContentList } = this.state;
        if(updateContentIndex == 0){
            Alert.alert('','已经是第一个内容了', [{} , {text: '关闭', onPress: ()=>{}}]);
            Toast.showInfoToast('已经是第一个内容了',1000);
        }else{
            const tempPaperList = selectContentList;
            const tempPaperItem = selectContentList[updateContentIndex]; //移动项
            tempPaperList[updateContentIndex] = tempPaperList[updateContentIndex - 1]; 
            tempPaperList[updateContentIndex - 1] = tempPaperItem; 
            this.setState({
                selectContentList: tempPaperList,
                updateContentIndex : updateContentIndex - 1,
            });
        }
    }

    //向下（后）移动试卷题目
    moveDownPaper = () => {
        const { updateContentIndex , selectContentList } = this.state;
        if(updateContentIndex == (selectContentList.length - 1)){
            Alert.alert('','已经是最后一个内容了', [{} , {text: '关闭', onPress: ()=>{}}]);
            Toast.showInfoToast('已经是最后一个内容了',1000);
        }else{
            const tempPaperList = selectContentList;
            const tempPaperItem = selectContentList[updateContentIndex]; //移动项
            tempPaperList[updateContentIndex] = tempPaperList[updateContentIndex + 1]; 
            tempPaperList[updateContentIndex + 1] = tempPaperItem; 
            this.setState({
                selectContentList: tempPaperList,
                updateContentIndex : updateContentIndex + 1,
            });
        }
    }

    //底部展示区
    showUpdateContentBottom = () => {
        return(
            <View style={{ 
                ...styles.bottomView,
                // backgroundColor: 'pink',
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        {/**显示底部试题类型图标 */}
                        {this.showLearnCaseTypeImg()}    
                    </ScrollView>
                </View>
            </View>
        );
    }

    //显示底部导学案类型图标
    showLearnCaseTypeImg = () => {
        const { selectContentList , updateContentIndex } = this.state;
        let content = [];
        for(let i = 0 ; i < selectContentList.length ; i++){
            let contentTypeImg;
            if(selectContentList[i].type == 'question'){
                if(selectContentList[i].baseTypeId == '101'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/101.png');
                }else if(selectContentList[i].baseTypeId == '102'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/102.png');
                }else if(selectContentList[i].baseTypeId == '103'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/103.png');
                }else if(selectContentList[i].baseTypeId == '104'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/104.png');
                }else if(selectContentList[i].baseTypeId == '106'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/106.png');
                }else if(selectContentList[i].baseTypeId == '108'){
                    if(selectContentList[i].typeName.indexOf('填空')){
                        contentTypeImg = require('../../../../assets/teacherLatestPage/109.png');
                    }else{
                        contentTypeImg = require('../../../../assets/teacherLatestPage/108.png');
                    }
                }else{
                    contentTypeImg = require('../../../../assets/teacherLatestPage/107.png');
                }
            }else if(selectContentList[i].type == 'paper'){
                contentTypeImg = require('../../../../assets/teacherLatestPage/word.png');
            }else if(selectContentList[i].type == 'resource'){
                if(selectContentList[i].format == 'other'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/other.png');
                }else if(selectContentList[i].format == 'video'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/mp4.png');
                }else if(selectContentList[i].format == 'music'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/music.png');
                }else if(selectContentList[i].format == 'image'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/image.png');
                }else if(selectContentList[i].format == 'word'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/word.png');
                }else if(selectContentList[i].format == 'ppt'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/ppt.png');
                }else if(selectContentList[i].format == 'pdf'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/pdf.png');
                }else if(selectContentList[i].format == 'text'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/txt.png');
                }else if(selectContentList[i].format == 'html'){
                    contentTypeImg = require('../../../../assets/teacherLatestPage/html.png');
                }
            }

            content.push(
                <TouchableOpacity 
                    key={i}
                    onPress={() => {
                        if(updateContentIndex != i){
                            console.log('-----------select----i---' ,i);
                            this.setState({ 
                                updateContentIndex: i,
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
                >
                    <Image 
                        source={contentTypeImg} 
                        style={updateContentIndex == i ? styles.checked : styles.little_image} 
                    />
                </TouchableOpacity>   
            );
        }
        return content;
    }

    render(){
        console.log('-----update---render--------',this.state.selectContentNum)
        return(
            <View  style={{ flexDirection: 'column', backgroundColor: '#fff' , flex: 1 }}>
                <View style={styles.bodyView}>
                    {
                        this.state.selectContentList.length > 0 
                            ? this.showTitle() 
                            : <View style={{...styles.bodyView,height:screenHeight}}>
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
                                    >正在获取导学案中的内容，请耐心等待</Text>
                                </View>
                            </View>
                    }
                    {
                        this.state.selectContentList.length > 0 
                                ? this.showContent() 
                                : null
                    }
                </View>
                {
                    this.state.selectContentList.length > 0 
                            ? this.showUpdateContentBottom() 
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
    },
    contentView:{
        height: screenHeight - 220,
        flexDirection: 'column',
        // backgroundColor: 'red'
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
        height:screenWidth*0.15,
        width:screenWidth*0.15,
        marginTop: 5,
        marginLeft:3
    },
    checked:{
        height:screenWidth*0.16,
        width:screenWidth*0.16,
        marginLeft:5,
        borderColor:'#FFA500',
        borderRadius: 5,
        borderWidth:5,
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
        width: screenWidth * 0.67
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