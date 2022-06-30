import React from 'react';
import {StyleSheet, Text, View, Modal, ActivityIndicator} from 'react-native';

let lo;
const defaultTimeOut = -1;//设置显示时间标识
export class WaitLoading {
    /**
     * @param text  Waiting显示文本，默认为'加载中'
     * @param timeout Waiting显示时间，为-1时会一只显示，需要手动关闭
     */
    static show(text = '加载中...', timeout = defaultTimeOut) {
        // console.log('Waiting组件显示时间:',timeout);
        lo.setState({"isShow": true, "text": text, "timeout": timeout,type:''});
    }
    //成功的时候
    static show_success(text = '加载中...', timeout = defaultTimeOut) {
        // console.log('Waiting组件显示时间:',timeout);
        lo.setState({"isShow": true, "text": text, "timeout": timeout,type:'success'});
    }
    //失败的时候
    static show_false() {
        // console.log('Waiting组件显示时间:',timeout);
        lo.setState({"isShow": true, "text":'出错了...', "timeout": 1000,type:'false'});
    }
    //关闭Waiting
    static dismiss() {
        lo.setState({"isShow": false});
    }
}

export class Waiting extends React.Component {
    constructor(props) {
        super(props);
        this.handle = 0;
        this.state = {
            isShow: false,
            timeout: defaultTimeOut,
            text: "加载中...",
            type:'info'                      //三种类型    info   success   false   对应三种文字颜色
        };
        lo = this;
    }

    componentWillUnmount() {
        clearTimeout(this.handle);
    }

    render() {
        clearTimeout(this.handle);

        (this.state.timeout !== defaultTimeOut) && (this.handle = setTimeout(() => {
            WaitLoading.dismiss();
        }, this.state.timeout));

        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => {
                    WaitLoading.dismiss();
                }}>
                <View style={styles.container}>
                    <View style={[styles.load_box, this.props.loadingStyle]}>
                        <ActivityIndicator animating={true} color={this.state.type=='success'?'#78fee0'
                                     :this.state.type=='false'?'red'
                                     :'#FFF'} size={'large'}
                                           style={styles.load_progress}/>
                        <Text style={[this.state.type=='success'?styles.load_text_s
                                     :this.state.type=='false'?styles.load_text_f
                                     :styles.load_text, this.props.textStyle]}>{this.state.text}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    load_box: {
        width: 100,
        height: 100,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    load_progress: {
        width: 50,
        height: 50
    },
    //默认字体颜色
    load_text: {color: '#FFF',},
    //失败字体
    load_text_f:{color: 'red',},
    //成功字体
    load_text_s:{color: '#78fee0',},
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(178,178,178,0.8)',
    },
});
