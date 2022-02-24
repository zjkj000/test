import React, { Component } from "react";
import { View , Image, Text ,StyleSheet} from "react-native";
import { Card } from "@ui-kitten/components";

export default Wrongbook = () =>{
    //渲染
    return(
        <>
            <View style={{height:'10%'}}/>
            <View style={styles.Container}>
                

                <View style={styles.ContainerLeft}>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                            <View style={styles.ViewCardleft}>
                                <Image 
                                    source={require('../../assets/teaImg/paper.png')}
                                    style={styles.Image}
                                />
                            </View>
                            <View style={styles.ViewCardright}>
                                <Text>语文</Text>
                            </View>
                            
                        </View>
                    </Card>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>

                </View>

                
            <View style={styles.ContainerRight}>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>
                    <Card style={styles.Card}>
                        <View style={styles.ViewCard}>
                                <View style={styles.ViewCardleft}>
                                    <Image 
                                        source={require('../../assets/teaImg/paper.png')}
                                        style={styles.Image}
                                    />
                                </View>
                                <View style={styles.ViewCardright}>
                                    <Text>语文</Text>
                                </View>
                                
                        </View>
                    </Card>
                    
            </View>
                

            </View>
        </>
    )
};
const styles = StyleSheet.create({
    Container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:'100%',
        width:'100%',
        
    },
    ContainerLeft:{
        flexDirection:'column',
        alignItems:'center',
        height:'100%',
        width:'100%',
        flex:6,
    },
    ContainerRight:{
        flexDirection:'column',
        alignItems:'center',
        height:'100%',
        width:'100%',
        flex:6
    },
    Card:{
        margin:'5%',
        width:'85%',
        height:'9%',
        backgroundColor:'black',
        padding:0,
    },
    ViewCard:{
        ...StyleSheet.absoluteFillObject,
        
        flexDirection:'row',
        alignItems:'center',
        margin:0,
        padding:0,
        backgroundColor:'#F5FCFF'
    },
    ViewCardleft:{
        alignItems:'center',
        height:'100%',
        width:'45%',
        margin:0,
        padding:0,
        backgroundColor:"yellow"
    },
    ViewCardright:{
        flexDirection:'column',
        alignItems:'center',
        height:'100%',
        width:'55%',
        margin:0,
        padding:0,
        //backgroundColor:'green'
    },
    Image:{
        width:50,
        height:50,
    }
})