import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert} from 'react-native';

import RadiosGroup  from './RadiosGroup';
export default class Checkbox extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            questionChoiceList:[],
            sexArray: [
            ],
        };
    }
    UNSAFE_componentWillMount(){
        const list = this.props.ChoiceList.split(",");
        const NewsexArray = [];
        list.map(function(item,index){
            let image_new='';
            let image2_new='';
            if(item =="A"){
                image_new = require('../../../../assets/image3/DA.png');
                image2_new = require('../../../../assets/image3/DA1.png');
            }else if(item =="B"){
                image_new = require('../../../../assets/image3/DB.png');
                image2_new = require('../../../../assets/image3/DB1.png');
            }else if(item =="C"){
                image_new = require('../../../../assets/image3/DC.png');
                image2_new = require('../../../../assets/image3/DC1.png');
            }else if(item =="D"){
                image_new = require('../../../../assets/image3/DD.png');
                image2_new = require('../../../../assets/image3/DD1.png');
            }
            else if(item =="E"){
                image_new = require('../../../../assets/image3/DE.png');
                image2_new = require('../../../../assets/image3/DE1.png');
            }else if(item=="F"){
                image_new = require('../../../../assets/image3/DF.png');
                image2_new = require('../../../../assets/image3/DF1.png');
            }else if(item=="G"){
                image_new = require('../../../../assets/image3/DG.png');
                image2_new = require('../../../../assets/image3/DG1.png');
            }else{
                image_new = require('../../../../assets/image3/DH.png');
                image2_new = require('../../../../assets/image3/DH1.png');
            }
            NewsexArray.push(
                                    { 
                                        title:  item,
                                        image:  image_new,
                                        image2: image2_new,
                                        selected:false,
                                        }
                    )  
            })
            this.setState({questionChoiceList:list,sexArray:NewsexArray});
    }

    render() {
        return (
            <View style={{height: 44,flex: 1,marginTop:5}}>
                {/* {setquestionChoiceList} */}
                <RadiosGroup
                    style={{flexDirection: 'row',justifyContent:'space-around'}}//整个组件的样式----这样可以垂直和水平
                    conTainStyle={{height: 44, width: 60}}//图片和文字的容器样式
                    imageStyle={{width: 35, height: 35}}//图片样式
                    textStyle={{color: 'black'}}//文字样式
                    data={this.state.sexArray}//数据源
                    onPress={()=>{}}
                />
            </View>
        )
    }
}
