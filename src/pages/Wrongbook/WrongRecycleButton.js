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
import { useNavigation } from "@react-navigation/native";
import '../../utils/global/wrongBook'
import CustomModal from '../../utils/Alert_yesno/CustomModal'

export default function WrongRecycleButtoContainer() {
    const navigation = useNavigation()
    return (
       <WrongRecycleButton navigation={navigation}/>
    )
}
class WrongRecycleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisibility : false,
        }
    }
  
    
    handleRecycle(){
        
        this.props.navigation.navigate({
            name:'WrongRecycle',
        })
    }
    
    render() {
        
        return (
            
                <TouchableOpacity onPress={() => this.handleRecycle()}>
                    <View>
                        <Image 
                            source={require('../../assets/errorQue/recycle.png')}
                            style={styles.Image}/>
                    </View>
                    
                </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    Image: {
        height:25,
        width:25,
        marginRight:8
    }
})