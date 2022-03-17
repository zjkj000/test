import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Text
} from "react-native";

class WrongRecycleButton extends Component {
    constructor(props) {
        super(props);
    }
    handleRecycle = () => {
        Alert.alert('错题回收站还未开放')
    }
    render() {
        return (
            
                <TouchableOpacity onPress={() => this.handleRecycle()}>
                    <View>
                        <Image 
                            source={require('../../assets/photoImage/recycle.png')}
                            style={styles.Image}/>
                    </View>
                    
                </TouchableOpacity>
        )
    }
}
export default WrongRecycleButton;

const styles = StyleSheet.create({
    Image: {
        height:25,
        width:25,
        marginRight:8
    }
})