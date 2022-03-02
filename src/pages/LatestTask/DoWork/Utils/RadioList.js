import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert} from 'react-native';
import RadioGroup  from './RadioGroup';

// 这个是封装过的单选按钮，根据选项值  进行设置。
export default class RadioList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            questionChoiceList:[],
            sexArray: [],
        };
    }
    UNSAFE_componentWillMount(){
        const list = this.props.ChoiceList.split(",");
        const NewsexArray = [];
        list.map(function(item,index){
            let image_new='';
            let image2_new='';
            if(item =="A"){
                image_new = require('../../../../assets/image3/10.png');
                image2_new = require('../../../../assets/image3/20.png');
            }else if(item =="B"){
                image_new = require('../../../../assets/image3/11.png');
                image2_new = require('../../../../assets/image3/21.png');
            }else if(item =="C"){
                image_new = require('../../../../assets/image3/12.png');
                image2_new = require('../../../../assets/image3/22.png');
            }else if(item == "D"){
                image_new = require('../../../../assets/image3/13.png');
                image2_new = require('../../../../assets/image3/23.png');
            }else if(item =="E"){
                image_new = require('../../../../assets/image3/E.png');
                image2_new = require('../../../../assets/image3/E1.png');
            }else if(item == "F"){
                image_new = require('../../../../assets/image3/F.png');
                image2_new = require('../../../../assets/image3/F1.png');
            }else if(item =="G"){
                image_new = require('../../../../assets/image3/G.png');
                image2_new = require('../../../../assets/image3/G1.png');
            }else if(item=="H"){
                image_new = require('../../../../assets/image3/H.png');
                image2_new = require('../../../../assets/image3/H1.png');
            }else if(item=="对"){
                image_new = require('../../../../assets/image3/T.png');
                image2_new = require('../../../../assets/image3/T1.png');
            }else if(item=="错"){
                image_new = require('../../../../assets/image3/R.png');
                image2_new = require('../../../../assets/image3/R1.png');
            }else{
                image_new = '';
                image2_new = '';
            }
            NewsexArray.push(
                                    { 
                                        title:  item,
                                        image:  image_new,
                                        image2: image2_new
                                        }
                    )  
            })
            this.setState({questionChoiceList:list,sexArray:NewsexArray});
    }

    render() {
        return (
            <View style={{height: 44, flex: 1,marginTop:5}}>
                <RadioGroup
                    style={{flexDirection: 'row',justifyContent:'space-around'}}//整个组件的样式----这样可以垂直和水平
                    conTainStyle={{height: 44, width: 60}}//图片和文字的容器样式
                    imageStyle={{width: 35, height: 35}}//图片样式
                    textStyle={{color: 'black'}}//文字样式
                    selectIndex={''}//空字符串,表示不选中,数组索引表示默认选中
                    data={this.state.sexArray}//数据源
                />
            </View>
        )
    }
}
