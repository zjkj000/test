import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert} from 'react-native';






//暂时没用了，判断题 用的 RadioList  传的对错。

import RadioGroup  from './RadioGroup';
export default class CircleList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sexArray: [],
        };
    }


    render() {
        return (
            <View style={{height: 44, flex: 1,marginTop:15}}>
                <RadioGroup
                    style={{flexDirection: 'row',justifyContent:'space-around'}}//整个组件的样式----这样可以垂直和水平
                    conTainStyle={{height: 44, width: 60}}//图片和文字的容器样式
                    imageStyle={{width: 35, height: 35}}//图片样式
                    textStyle={{color: 'black'}}//文字样式
                    selectIndex={''}//空字符串,表示不选中,数组索引表示默认选中
                    data={this.state.sexArray}//数据源
                    onPress={(index, item)=> {
                        // alert('h')
                    }}
                />
            </View>
        )
    }
}
