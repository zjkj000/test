import React, { Component } from 'react';
import { useRoute } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Button,
    BackHandler
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';


const screenWidth = Dimensions.get('window').width;

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
    //console.log([zero(h), zero(i), zero(s)].join(":"));
    // return [zero(h), zero(i), zero(s)].join(":");
    return [zero(h), zero(i), zero(s)].join(":");
}

export default function VideoPlayerContainer(props) {
    const url = props.url
    const setvideoUrl = props.setvideoUrl
    const setOptions = props.setOptions
    return (
        <VideoPlayer url={url} setvideoUrl={setvideoUrl} setOptions={setOptions} />
    )
}
class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true,
            videoCover: '../../../assets/errorQue/previewImg2.jpg',
            videoWidth: screenWidth,
            videoHeight: screenWidth * 9 / 16, // 默认16：9的宽高比
            showVideoCover: true,    // 是否显示视频封面
            isFullScreen: false,     // 当前是否全屏显示
        }

    }



    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        this.props.setOptions({ headerShown: false })

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
    //滑动返回
    onBackAndroid = () => {
        this.props.setvideoUrl('')
        this.props.setOptions({ headerShown: true })
        return true;
    };


    onLoad = (data) => {
        this.setState({ duration: data.duration });
        console.log(data.duration + "xxx");
    };

    onProgress = (data) => {
        this.setState({ currentTime: data.currentTime });
        console.log(data.currentTime + "hhh");
    };
    //视频播放完暂停并重置
    onEnd = () => {
        this.setState({ paused: true })
        this.video.seek(0)
    };

    onAudioBecomingNoisy = () => {
        this.setState({ paused: true })
    };
    //
    onAudioFocusChanged = (event) => {
        this.setState({ paused: !event.hasAudioFocus })
    };
    //当前位置播放百分比
    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        }
        return 0;
    };

    //控制播放速率
    renderRateControl(rate) {
        const isSelected = (this.state.rate === rate);

        return (
            <TouchableOpacity onPress={() => {
                this.setState({ rate })
            }}>
                <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {rate}x
                </Text>
            </TouchableOpacity>
        );
    }
    //视频esize控制
    renderResizeModeControl(resizeMode) {
        const isSelected = (this.state.resizeMode === resizeMode);

        return (
            <TouchableOpacity onPress={() => {
                this.setState({ resizeMode })
            }}>
                <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {resizeMode}
                </Text>
            </TouchableOpacity>
        )
    }
    //控制音量
    renderVolumeControl(volume) {
        const isSelected = (this.state.volume === volume);

        return (
            <TouchableOpacity onPress={() => {
                this.setState({ volume })
            }}>
                <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {volume * 100}%
                </Text>
            </TouchableOpacity>
        )
    }
    /// 点击了工具栏上的全屏按钮
    onControlShrinkPress() {
        if (this.state.isFullScreen) {
            Orientation.lockToPortrait();
        } else {
            Orientation.lockToLandscape();
        }
    }

    /// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
    _onLayout = (event) => {
        //获取根View的宽高
        let { width, height } = event.nativeEvent.layout;
        console.log('通过onLayout得到的宽度：' + width);
        console.log('通过onLayout得到的高度：' + height);

        // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
        let isLandscape = (width > height);
        if (isLandscape) {
            this.setState({
                videoWidth: width,
                videoHeight: height,
                isFullScreen: true,
            })
        } else {
            this.setState({
                videoWidth: width,
                videoHeight: width * 9 / 16,
                isFullScreen: false,
            })
        }
        Orientation.unlockAllOrientations();
    };

    render() {
        //已经播放量
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        //尚未播放量
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
        //视频播放地址
        const url = this.state.url
        console.log(url)

        return (
            <View style={styles.container} onLayout={this._onLayout}>
                {/* 视频部分 */}
                <TouchableOpacity
                    style={styles.fullScreen}
                    onPress={() => this.setState({ paused: !this.state.paused })}>
                    <Video
                        ref={(ref) => { this.video = ref }}
                        /* For ExoPlayer */
                        source={{ uri: url }}
                        style={styles.fullScreen}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        onLoad={this.onLoad}
                        onProgress={this.onProgress}
                        onEnd={this.onEnd}
                        onAudioBecomingNoisy={this.onAudioBecomingNoisy}
                        onAudioFocusChanged={this.onAudioFocusChanged}
                        repeat={false}
                    />
                    

                </TouchableOpacity>
               

                {/* 关闭与全屏按钮 */}
                <View style={styles.textStyle}>
                    {/* <Text style={styles.volumeControl}>
                        {formatTime(this.state.duration - this.state.currentTime)}
                    </Text> */}

                    <Button style={styles.btnStyle} title={'关闭'} color={'#73808080'}
                        onPress={() => {
                            this.props.setvideoUrl('')
                            this.props.setOptions({ headerShown: true })
                        }}
                    />
                    <Button style={styles.btnStyle} title={this.state.isFullScreen?'缩小': '全屏'} color={'#73808080'}
                        onPress={() => {
                            this.onControlShrinkPress()
                        }}
                    />
                </View>

                {/* play按钮 */}
                <View style={styles.playButton}>
                        {
                            !this.state.paused ? null :
                                <TouchableWithoutFeedback onPress={() => this.setState({ paused: !this.state.paused })}>
                                    <Image
                                        style={styles.playImage}
                                        source={require('../../../assets/errorQue/playvideo.png')}
                                    />
                                </TouchableWithoutFeedback>
                        }
                </View>

                {/* 进度条加载区 */}
                <View style={styles.controls}>
                    
                    <View style={styles.trackingControls}>

                        <View style={styles.timeViewleft}> 
                            <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                        </View>

                        <View style={styles.progress}>
                            <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
                            <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
                        </View>

                        <View style={styles.timeViewright}> 
                            <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                        </View>
                    </View>
                    
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    textStyle: {
        width: '100%',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:25,
        justifyContent: 'space-between',
        flexDirection: 'row',
        
    },
    btnStyle: {
        flex: 1,
        margin: 10,
        paddingRight: 10,
        paddingTop: 25,
        justifyContent:'space-evenly',
        flexDirection: 'row',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 10,
        right: 0,
    },
    controls: {
        flexDirection:'row',
        justifyContent:'flex-start',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 10,
        left: 5,
        right: 5,
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 20,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 20,
        backgroundColor: '#2C2C2C',
    },
    generalControls: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 4,
        overflow: 'hidden',
        paddingTop: 10,
    },
    rateControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    volumeControl: {
        fontSize: 25,
        color: '#fff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resizeModeControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlOption: {
        alignSelf: 'center',
        fontSize: 11,
        color: 'white',
        paddingLeft: 2,
        paddingRight: 2,
        lineHeight: 12,
    },
    time: {
        fontSize: 12,
        color: 'white',
    },
    timeViewleft:{
        flex:0.3,
        flexDirection:'row'
    },
    timeViewright:{
        flex:0.3,
        flexDirection:'row-reverse'
    },

    trackingControls: {
        flex:1,
        flexDirection: 'row',
    },
    playButton:{
        alignItems: 'center',
        justifyContent: 'center',
        height:'80%',
        width:'100%'
        
    },
    playImage: {
        resizeMode: "contain",
        width: 50,
    },
        
   
});