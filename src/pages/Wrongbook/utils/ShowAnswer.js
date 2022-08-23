import { convertStringArrayToDate } from "antd-mobile/es/components/date-picker/date-picker-utils";
import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Image,
    useWindowDimensions,
    Alert,
    Text,
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
            basetypeId: this.props.basetypeId,
            shitiAnswer: this.props.shitiAnswer,
            stuAnswer: this.props.stuAnswer,
            width: this.props.width,
            shitiAnalysis: this.props.shitiAnalysis
        }

    }
    //随时更新键盘输入值
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            stuAnswer: nextProps.stuAnswer
        });
    }
    //解析的显隐控制
    handleAnalysis() {
        return (
            <View style={styles.class_content}>
                <View style={styles.class_content_title}>
                    <Text>【解析】</Text>
                </View>

                <View style={styles.class_content_con}>
                    <RenderHtml
                        contentWidth={this.props.width - 6}
                        source={{ html: this.state.shitiAnalysis }}
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
                    />
                </View>
            </View>
        )
    }
    render() {
        switch (this.state.basetypeId) {
            case '101': return (
                <View style={styles.container}>
                    <View style={styles.class_content}>
                        {/* 参考答案及你的答案 */}
                        <View style={styles.class_chiose}>
                            <View style={styles.class_chiose}>
                                <Text>【参考答案】</Text>
                                <View><Text>{this.state.shitiAnswer}</Text></View>
                            </View>
                            <View style={styles.class_chiose}>
                                <Text>【你的作答】</Text>
                                <View><Text>{this.state.stuAnswer}</Text></View>
                            </View>
                        </View>
                        {/* 解析 */}
                        {this.state.shitiAnalysis == "" ? null : this.handleAnalysis()}

                    </View>
                </View>)

            case '102': return (
                <View style={styles.container}>
                    <View style={styles.class_content}>
                        {/* 参考答案及你的答案 */}
                        <View style={styles.class_chiose}>
                            <View style={styles.class_chiose}>
                                <Text>【参考答案】</Text>
                                <View><Text>{this.state.shitiAnswer}</Text></View>
                            </View>
                            <View style={styles.class_chiose}>
                                <Text>【你的作答】</Text>
                                <View><Text>{this.state.stuAnswer}</Text></View>
                            </View>
                        </View>
                        {/* 解析 */}
                        {this.state.shitiAnalysis == "" ? null : this.handleAnalysis()}

                    </View>
                </View>)
                
            case '103': return (
                <View style={styles.container}>
                    <View style={styles.class_content}>
                        {/* 参考答案及你的答案 */}
                        <View style={styles.class_chiose}>
                            <View style={styles.class_chiose}>
                                <Text>【参考答案】</Text>
                                <View><Text>{this.state.shitiAnswer}</Text></View>
                            </View>
                            <View style={styles.class_chiose}>
                                <Text>【你的作答】</Text>
                                <View><Text>{this.state.stuAnswer}</Text></View>
                            </View>
                        </View>
                        {/* 解析 */}
                        {this.state.shitiAnalysis == "" ? null : this.handleAnalysis()}

                    </View>
                </View>)

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
                            />
                        </View>
                    </View>
                </View>)

        }
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
    class_chiose: {
        flex: 1,
        flexDirection: 'row',

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