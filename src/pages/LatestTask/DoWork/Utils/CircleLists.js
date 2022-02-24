import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert} from 'react-native';

import RadiosGroup  from './RadiosGroup';
export default class CircleList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sexArray: [
                {
                    title: 'A',
                    image:  require('../../../../assets/image3/DA.png'),
                    image2:require('../../../../assets/image3/DA1.png'),
                    selected: false,
                },
                {
                    title: 'B',
                    image:  require('../../../../assets/image3/DB.png'),
                    image2:require('../../../../assets/image3/DB1.png'),
                    selected: false,
                },
                {
                    title: 'C',
                    image: require('../../../../assets/image3/DC.png'),
                    image2:require('../../../../assets/image3/DC1.png'),
                    selected:false,
                },
                {
                    title: 'D',
                    image: require('../../../../assets/image3/DD.png'),
                    image2:require('../../../../assets/image3/DD1.png'),
                    selected:false,
                },
                {
                    title: 'E',
                    image: require('../../../../assets/image3/DE.png'),
                    image2:require('../../../../assets/image3/DE1.png'),
                    selected:false,
                },
                {
                    title: 'F',
                    image: require('../../../../assets/image3/DF.png'),
                    image2:require('../../../../assets/image3/DF1.png'),
                    selected:false,
                }
            ],
        };
    }

    render() {
        return (
            <View style={{flex: 1,marginTop:10}}>
                <RadiosGroup
                    style={{flexDirection: 'row',justifyContent:'space-around'}}//整个组件的样式----这样可以垂直和水平
                    conTainStyle={{height: 44, width: 60}}//图片和文字的容器样式
                    imageStyle={{width: 25, height: 25}}//图片样式
                    textStyle={{color: 'black'}}//文字样式
                    data={this.state.sexArray}//数据源
                    onPress={()=>{}}
                />
            </View>
        )
    }
}
