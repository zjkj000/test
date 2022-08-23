import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image ,StatusBar ,Dimensions } from "react-native";
import { screenHeight, screenWidth } from "../utils/Screen/GetSize";

export default class TestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render(){
        return(
            <View style={{height:screenHeight,backgroundColor:'pink'}}>
                {console.log('========Dimensions.get("window").height=======',Math.round(Dimensions.get("window").height))}
                {console.log('=========STATUS_BAR_HEIGHT=========',Math.round(StatusBar.currentHeight))}
                <StatusBar hidden={true} backgroundColor={'red'} />
                <Text>
                    测试屏幕高度
                </Text>
            </View>
        )
    }
}