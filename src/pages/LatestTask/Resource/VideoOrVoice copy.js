import React,{Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import Video from 'react-native-video';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class VideoOrVoice extends Component{
    state={
        rate:1,
        videoReady:false,
        videoTotal:0,
        currentTime:0,
        videoProgress:0,
        replay:false,
        paused:false
    }
    componentDidMount()
    {

    }
    onLoad=()=>{
        this.setState({
            videoReady:true,
        })
    }

    //视频开始隐藏重新播放按钮
    onLoadStart=()=>{


    }
    
    //自定义进度条
    onProgress=(data)=>{
        let duration=data.playableDuration;
        let currentTime=data.currentTime;
        let percent=0;

        //初始加载时duration=0
        if(duration!=0)
        {
            percent=Number((currentTime/duration).toFixed(2));
        }else{
            percent=0
        }
        
        this.setState({
            videoTotal:duration,
            currentTime:currentTime,
            videoProgress:percent,
            replay:false
        })
    }
    //视频结束显示重新播放按钮
    onEnd=()=>{
        this.setState({
            videoProgress:1,
            paused:true   //结束时必须设置暂停,使用seek方法才有效
        })
    }
    onError=(err)=>{
        console.log(err);

    }

    //点击按钮重新播放
    _replay=()=>{
        if(this.state.videoProgress==1)
        {
            this.video.seek(0);
        }
        
        this.setState({
            paused:false
        })

    }

    render()
    {
        return(

            <View>
                <Text>详情</Text>
                <TouchableWithoutFeedback
                    //点击视频暂停/播放 
                    onPress={()=>{
                        console.log(this.state.replay);
                        this.setState({
                            paused:!this.state.paused,
                        })
                    }}
                >
                    <Video 
                        ref={(video)=>{this.video=video}}
                        source={{uri:'https://video.699pic.com/videos/73/92/43/b_mPEcRsUxTkE91597739243.mp4'}} //url或本地文件,{require('xx.mp4')}
                        volume={5} //放大声音倍数
                        paused={this.state.paused}  //是否暂停
                        rate={this.state.rate}  //播放速度,0暂停,1正常
                        muted={false}  //静音
                        resizeMode='contain' //视频适应方式
                        repeat={false} //是否重复播放
                        // controls={true}  //显示视频控键
                        onLoadStart={this.onLoadStart}
                        onLoad={this.onLoad}
                        onProgress={this.onProgress}  //视频播放每隔250毫秒触发,并携带当前已播放时间
                        onEnd={this.onEnd}
                        onError={this.onError}
                        style={styles.video}
                        
                        
                    />
                </TouchableWithoutFeedback>
                {/* 进度条 */}
                <View style={styles.progressBox}>
                    <View style={[styles.progress,{width:Dimensions.get('window').width*this.state.videoProgress}]}></View>
                </View>
                {/* 若不设置重复播放,视频结束显示重新播放按钮 */}
                {
                    this.state.paused? 
                                <TouchableOpacity style={styles.wrap}
                                    onPress={this._replay}
                                >
                                    <View style={styles.play}>
                                            <Text style={{color:'#ccc',fontSize:30,lineHeight:50,marginLeft:5,marginBottom:5}} >▶</Text>
                                    </View>
                                </TouchableOpacity>
                                :<View></View>
                }
                
                {/* 加载圆圈 */}
                {
                    this.state.videoReady? <View></View>: <View
                                    style={styles.load}
                                 >
                                <ActivityIndicator 
                                    size={70}
                                    color='#ccc'
                                    animating={!this.state.videoReady}
                                />
                            </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    video:{
        width:'100%',
        height:300,
        backgroundColor:'black',
        justifyContent:'center',
        alignItems:'center',
        position:'relative'
    },
    load:{
        position:'absolute',
        left:'50%',
        top:'50%',
        marginLeft:-40,
        marginTop:-30
    },
    progressBox:{
        width:'100%',
        height:3,
        backgroundColor:'#ccc'
    },
    progress:{
        width:1,
        height:2,
        backgroundColor:'green'
    },
    wrap:{
        position:'absolute',
        bottom:'40%',
        right:'45%',
    },
    play:{
        height:50,
        width:50,
        resizeMode:'contain',
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center'
    }

})


