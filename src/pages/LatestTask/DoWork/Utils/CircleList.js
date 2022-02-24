import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert} from 'react-native';

import RadioGroup  from './RadioGroup';
export default class CircleList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sexArray: [
                {
                    title: 'A',
                    image:  require('../../../../assets/image3/10.png'),
                    image2:require('../../../../assets/image3/20.png'),
                },
                {
                    title: 'B',
                    image:  require('../../../../assets/image3/11.png'),
                    image2:require('../../../../assets/image3/21.png'),
                },
                {
                    title: 'C',
                    image:  require('../../../../assets/image3/12.png'),
                    image2:require('../../../../assets/image3/22.png'),
                },
                {
                    title: 'D',
                    image:  require('../../../../assets/image3/13.png'),
                    image2:require('../../../../assets/image3/23.png'),
                }
            ],
        };
    }


    render() {
        return (
            <View style={{height: 44, flex: 1,marginTop:10}}>
                <RadioGroup
                    style={{flexDirection: 'row',justifyContent:'space-around'}}//整个组件的样式----这样可以垂直和水平
                    conTainStyle={{height: 44, width: 60}}//图片和文字的容器样式
                    imageStyle={{width: 25, height: 25}}//图片样式
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
