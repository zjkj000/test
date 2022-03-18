import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Modal,
}from 'react-native';

// visible bool 控制弹出框隐藏(false)或显示(true)
// transparent bool 控制弹出框背景，若为false则弹出框背景为灰色，会挡住弹出框后面的内容，true时才为modal根视图的背景颜色。
// animationType string 控制弹出框的动画效果 有三个值：none slide fade
// onRequestClose func 当请求关闭时执行
// 使用方法：
// <CustomModal title="标题" 
//              message="消息"  
//              ref="_customModal" 
//              visibility={this.state.modalVisibility}
                             
//              onLeftPress={()=>{this.setState({modalVisibility:false})}} 
//              onRightPress={()=>{this.setState({modalVisibility:false})}}/>

export default class CustomModal extends Component {

    render() {
        return (
                <Modal
                    visible={this.props.visibility}
                    transparent={true}
                    animationType={'fade'}//none slide fade
                    onRequestClose={()=>this.setState({visibility:false})}
                >
                    <View style={styles.container}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{this.props.title}</Text>
                            <Text style={styles.modalMessage}>{this.props.message}</Text>
                            <View style={styles.horizonLine}/>
                            <View style={styles.row}>
                                <TouchableHighlight style={styles.leftBn} onPress={this.props.onLeftPress} underlayColor={'#C5C5C5'}>
                                    <Text style={styles.leftBnText}>取消</Text>
                                </TouchableHighlight>
                                <View style={styles.verticalLine}/>
                                <TouchableHighlight style={styles.rightBn} onPress={this.props.onRightPress}
                                                    underlayColor={'#C5C5C5'} >
                                    <Text style={styles.rightBnText}>确定</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        justifyContent:'center',
        alignItems:'center'
    },
    modalContainer: {
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 3,
        backgroundColor: "white",
        alignItems:'center',
    },
    modalTitle: {
        color: '#000000',
        fontSize: 16,
        marginTop: 10,
    },
    modalMessage:{
        color:'#8a8a8a',
        fontSize:14,
        margin:10,
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
    },
    horizonLine:{
        backgroundColor:'#9f9fa3',
        height:0.5,
        alignSelf:'stretch'
    },
    verticalLine:{
        backgroundColor:'#9f9fa3',
        width:1,
        alignSelf:'stretch'
    },
    leftBn:{
        borderBottomLeftRadius:3,
        padding:7,
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center',
    },
    leftBnText:{
        fontSize:16,
        color:'#8a8a8a',
    },
    rightBn:{
        borderBottomRightRadius:3,
        padding:7,
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center',
    },
    rightBnText:{
        fontSize:16,
        color:'#00A9F2'
    }
})

