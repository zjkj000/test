import { convertStringArrayToDate } from "antd-mobile/es/components/date-picker/date-picker-utils";
import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    useWindowDimensions,
    Alert,
    Text
} from "react-native";
import RenderHtml from 'react-native-render-html';

export default function ShowAnswerContainer(props) {
    const shitiAnswer = props.shitiAnswer
    const stuAnswer = props.stuAnswer
    const basetypeId = props.basetypeId
    const shitiAnalysis = props.shitiAnalysis
    const width = useWindowDimensions().width
    return (
        <ShowAnswer
            shitiAnswer={shitiAnswer}
            stuAnswer={stuAnswer}
            shitiAnalysis={shitiAnalysis}
            width={width}
            basetypeId={basetypeId} />
    )
}

class ShowAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: global.constants.token,
            userName: global.constants.userName,
            ip: global.constants.baseUrl,
            basetypeId: this.props.basetypeId,
            shitiAnswer: this.props.shitiAnswer,
            stuAnswer: this.props.stuAnswer,
            width: this.props.width,
            basetypeId: this.props.basetypeId,
            shitiAnalysis: this.props.shitiAnalysis
        }

    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            stuAnswer: nextProps.stuAnswer
        });
    }
  
    render() {
        if (this.state.shitiAnswer == "") {
            this.setState({
                shitiAnswer: '无'
            })
        }

        switch (this.state.basetypeId) {
            case '104': return (
                <View style={styles.container}>
                    {/* 参考答案部分 */}
                    <View style={styles.class_content}>
                        <View style={styles.class_content_title}>
                            <Text>【参考答案】</Text>
                        </View>

                        <View style={styles.class_content_con}>
                            <RenderHtml
                                contentWidth={this.props.width - 6}
                                source={{ html: this.state.shitiAnswer }}
                            />
                        </View>
                    </View>
                    {/* 你的作业作答部分 */}
                    <View style={styles.class_content}>
                        <View style={styles.class_content_title}>
                            <Text>【你的作答】</Text>
                        </View>

                        <View style={styles.class_content_con}>
                            <RenderHtml
                                contentWidth={this.props.width - 6}
                                source={{ html: this.state.stuAnswer }}
                            />
                        </View>
                    </View>
                </View>)
            case '106': return (
                <View style={styles.container}>
                    {/* 参考答案部分 */}
                    <View style={styles.class_content}>
                        <View style={styles.class_content_title}>
                            <Text>【参考答案】</Text>
                        </View>

                        <View style={styles.class_content_con}>
                            <RenderHtml
                                contentWidth={this.props.width - 6}
                                source={{ html: this.state.shitiAnswer }}
                            />
                        </View>
                    </View>
                    {/* 你的作业作答部分 */}
                    <View style={styles.class_content}>
                        <View style={styles.class_content_title}>
                            <Text>【你的作业作答】</Text>
                        </View>

                        <View style={styles.class_content_con}>
                            <RenderHtml
                                contentWidth={this.props.width - 6}
                                source={{ html: this.state.stuAnswer }}
                            />
                        </View>
                    </View>
                </View>)
            case '108': return (
                <View style={styles.container}>
                    {/* 参考答案部分 */}
                    <View style={styles.class_content}>
                        <View style={styles.class_content_title}>
                            <Text>【参考答案】</Text>
                        </View>

                        <View style={styles.class_content_con}>
                            <RenderHtml
                                contentWidth={this.props.width - 6}
                                source={{ html: this.state.shitiAnswer }}
                            />
                        </View>
                    </View>
                    {/* 你的作业作答部分 */}
                    <View style={styles.class_content}>
                        <View style={styles.class_content_title}>
                            <Text>【你的作业作答】</Text>
                        </View>

                        <View style={styles.class_content_con}>
                            <RenderHtml
                                contentWidth={this.props.width - 6}
                                source={{ html: this.state.stuAnswer }}
                            />
                        </View>
                    </View>
                </View>)

        }
        // return (
        //     <View style={styles.container}>
        //         {/* 参考答案部分 */}
        //         <View style={styles.class_content}>
        //             <View style={styles.class_content_title}>
        //                 <Text>【参考答案】</Text>
        //             </View>

        //             <View style={styles.class_content_con}>
        //                 <RenderHtml
        //                     contentWidth={this.props.width - 6}
        //                     source={{ html: this.state.shitiAnswer }}
        //                 />
        //             </View>
        //         </View>
        //         {/* 你的作业作答部分 */}
        //         <View style={styles.class_content}>
        //             <View style={styles.class_content_title}>
        //                 <Text>【你的作业作答】</Text>
        //             </View>

        //             <View style={styles.class_content_con}>
        //                 <RenderHtml
        //                     contentWidth={this.props.width - 6}
        //                     source={{ html: this.state.stuAnswer }}
        //                 />
        //             </View>
        //         </View>
        //     </View>
        // )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    class_content: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    class_content_title: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    class_content_con: {
        borderColor: '#696969',
        borderWidth: 1,
        margin: 3,
    },
    //字体

    class_type_text: {
        fontSize: 15,
        color: '#808080',
    },
    index: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'

    },
    //图标
    Img: {
        marginLeft: 5,
        height: 25,
        width: 25,
    },
    Arrow: {
        margin: 8
    }
});