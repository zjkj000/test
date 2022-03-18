import { Text, StyleSheet, View, ScrollView,Image,TouchableOpacity,Alert,Dimensions,Slider, TouchableWithoutFeedback, Button,  } from 'react-native'
import React, { Component, useState } from 'react'
import RadioList from '../../DoWork/Utils/RadioList';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";

// import Slider from '@react-native-community/slider';  //进度图标需要拉动
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import Loading from "../../../../utils/loading/Loading";

export default function MusicContainer(props) {
    const navigation = useNavigation();
    const paperId= props.paperId
    const submit_status=props.submit_status
    const startdate=props.startdate
    const papername = props.papername
    const sum=props.sum
    const num=props.num 
    const datasource=props.datasource
    const oldAnswer_data=props.oldAnswer_data
    const[ischange,setischange] = useState()
    props.getischange(ischange)
    const[Stu_answer,setStu_answer] = useState()
    props.getStu_answer(Stu_answer)
    return (
    <Music  navigation={navigation}  
                    papername = {papername}
                    submit_status={submit_status}  
                    startdate={startdate}
                    paperId={paperId} 
                    getischange={setischange}   
                    getStu_answer={setStu_answer}  
                    sum={sum} 
                    num={num} 
                    isallObj={props.isallObj}
                    datasource={datasource} 
                    oldAnswer_data={oldAnswer_data}   />
  )
}
//  Music展示 模板页面
class Music extends Component {
     constructor(props) {
        super(props)
        this.stuAnswer=this.stuAnswer.bind(this);
        this.state = {

                numid:'',
                resourceName:'单选题',
                resourceId:'',
                baseTypeId:'',
                questionName:'',        //题目名称
                questionChoiceList:'',  //题目选项
                question:'',   //题目内容
                answer:'',
                stu_answer:'',
                oldStuAnswer:'',

                videoUrl: "http://124.129.157.208:8810/SD/2017qingdao/xiaoxueEnglish/grade3/b/1.mp4",
                //videoCover: "http://124.129.157.208:8889/data/uploads/kecheng/2018/01/18/5a600b2c99836.png@0o_0l_220w.png",
                videoCover: '',
                videoWidth: screenWidth,
                videoHeight: screenWidth * 9/16, // 默认16：9的宽高比
                showVideoCover: true,    // 是否显示视频封面
                showVideoControl: false, // 是否显示视频控制组件
                isPlaying: false,        // 视频是否正在播放
                currentTime: 0,        // 视频当前播放的时间
                duration: 0,           // 视频的总时长
                isFullScreen: false,     // 当前是否全屏显示
                playFromBeginning: false, // 是否从头开始播放

                resource: '', //api请求的数据data
        }
     }  
   
     //用于将本道题写的答案  传给 Todo页面，用于提交
     stuAnswer(str){
         this.setState({stu_answer:str})
         this.props.getStu_answer(str)
         this.props.getischange(true);
     }


     UNSAFE_componentWillMount(){
         //请求数据  需要  作业id  用户id   这道题的 numid
         //id有了 props.paperId   用户id有  
         //请求到之后  就要把答案 设置到oldstuanswer
         this.setState({
             resource:this.props.datasource,
             videoUrl:this.props.datasource.url,
             stu_answer:this.props.oldAnswer_data?this.props.oldAnswer_data:'',
             oldStuAnswer:this.props.oldAnswer_data,
             numid:this.props.num?this.props.num:0,
             ...this.props.datasource});
        }   

        
        formatTime(second) {
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
                }
            )
            }
        }
        
        /// 点击了播放器正中间的播放按钮
        onPressPlayButton() {
            let isPlay = !this.state.isPlaying;
            this.setState({
            isPlaying: isPlay,
            showVideoCover: false
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
        
        /// 点击了工具栏上的全屏按钮
        onControlShrinkPress() {
            if (this.state.isFullScreen) {
            Orientation.lockToPortrait();
            } else {
            Orientation.lockToLandscape();
            }
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
                showVideoCover: false
            })
            }
        }
        
        /// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
        _onLayout = (event) => {
            //获取根View的宽高
            let {width, height} = event.nativeEvent.layout;
            console.log('通过onLayout得到的宽度：' + width);
            console.log('通过onLayout得到的高度：' + height);
            
            // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
            let isLandscape = (width > height);
            if (isLandscape){
            this.setState({
                videoWidth: width,
                videoHeight: height,
                isFullScreen: true,
            })
            } else {
            this.setState({
                videoWidth: width,
                videoHeight: width * 9/16,
                isFullScreen: false,
            })
            }
            Orientation.unlockAllOrientations();
        };
        
        /// -------外部调用事件方法-------
        
        ///播放视频，提供给外部调用
        playVideo() {
            this.setState({
            isPlaying: true,
            showVideoCover: false
            })
        }
        
        /// 暂停播放，提供给外部调用
        pauseVideo() {
            this.setState({
            isPlaying: false,
            })
        }
        
        /// 切换视频并可以指定视频开始播放的时间，提供给外部调用
        switchVideo(videoURL, seekTime) {
            this.setState({
            videoUrl: videoURL,
            currentTime: seekTime,
            isPlaying: true,
            showVideoCover: false
            });
            this.videoPlayer.seek(seekTime);
        }


            //渲染详情页
    showContent = () => {
        const {resource} = this.state;
        const URL = resource.url;
        const resourceName = resource.resourceName;
        if(resource.length <= 0){
            return(
            <Loading show={true}/> 
            );
        }else if(resource.url == "预览文件不存在"){
        return(
            <View style={styles.imageNull}>
                <Image 
                    source={require("../../../../assets/LatestTaskImages/null.jpg")}  
                />
            </View>
        );
        }else{
            return( //"http://www.cn901.com/res/91Content/resource/2021/01/22/video/46c31428-3fa2-47d2-ae51-be58a3f8aba0_mp4.mp4"
                <View style={styles.container} onLayout={this._onLayout}>
                    <View style={{top: screenHeight*0.4 ,width: this.state.videoWidth, height: 50, backgroundColor:'#000000' }}>
                        <Video
                        ref={(ref) => this.videoPlayer = ref}
                        source={{uri: this.state.videoUrl}}
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
                        style={{width: this.state.videoWidth, height: 50}}
                        />
                        {
                            <View style={[styles.control, {width: this.state.videoWidth}]}>
                            {/**播放器工具栏 播放暂停图标onControlPlayPress() */}
                            <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlPlayPress() }}>
                                <Image
                                style={styles.playControl}
                                source={this.state.isPlaying ? require('../../../../assets/LatestTaskImages/continue.png') : require('../../../../assets/LatestTaskImages/pause.png')}
                                />
                            </TouchableOpacity>
                            <Text style={styles.time}>{this.formatTime(this.state.currentTime)}</Text>
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
                            <Text style={styles.time}>{this.formatTime(this.state.duration)}</Text>
                            </View>
                        }
                    </View>
                </View>
            );
        }
    }

     render() {   
        return (  
        <View>
                {/* 第一行显示 第几题  题目类型 */}
                <View  style={styles.title}>  
                    <Text style={{fontWeight:'600',color:	'#000000',fontSize:17,width:'65%'}}>{this.state.resourceName}</Text>
                    <View style={{position:'absolute',right:80,top:10,flexDirection:'row'}}>
                        <Text style={{color:'#59B9E0'}} >{(this.state.numid?this.state.numid:0)+1}</Text>
                        <Text >/{this.props.sum?this.props.sum:1} </Text>
                    </View>
                    <TouchableOpacity onPress={
                        ()=>{
                            //导航跳转
                            this.props.navigation.navigate('SubmitLearningGuide',
                            {   paperId:this.props.paperId,
                                submit_status:this.props.submit_status,
                                startdate:this.props.startdate,
                                papername:this.props.papername,
                                isallObj:this.props.isallObj})
                        }
                    } style={{position:'absolute',right:20,top:10}}
                        
                        >
                            <Image source={require('../../../../assets/image3/look.png')}></Image>
                    </TouchableOpacity>
                </View>
                
                {/* 展示music就行 */}
                <View style={styles.area}>
                    { this.showContent()}
                </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    title:{padding:10,paddingLeft:30,flexDirection:'row',},
    area:{height:"85%",padding:20,color:'#FFFFFF'},
  imageNull: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: screenHeight*0.2,
      paddingBottom: screenHeight*0.2,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
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
  shrinkControl: {
    width: 15,
    height: 15,
    marginRight: 15,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
});