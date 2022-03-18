import { Text, View,TouchableOpacity,StyleSheet,Image,Button} from 'react-native'
import React, { Component } from 'react'
import ImageHandler from '../../../../utils/Camera/Camera'
export default class SubjectiveArea extends Component {

     //拍照调用的函数
     handleCamera = () => {
        ImageHandler.handleCamera().then((res) => {
            if (res) {
            
            } 
        })
    };
    
    
    //从本地选择照片需要的函数
    handleLibrary = () => {
        ImageHandler.handleLibrary().then((res) => {
            if (res) {
                //
            } 
            
        });
    };
  

    render() {
    return (
            // 书写答案，选择照片 区域 
            <View style={styles.content}>
                    
                    {/* 文本框+保存按钮区域 */}
                    <View style={{borderColor:'#000000',borderWidth:1,flexDirection:'row'}}>
                        <TextInput placeholder="请输入答案" multiline value={''}
                            onChangeText={(text)=>{
                                
                            }}
                            style={{ width: 200, backgroundColor: '#FFFFFF', height: 40 }} >
                        </TextInput>
                        
                        {/* 保存按钮将文本输入框的内容传到学生作答答案里面 */}
                        <Button title="保存"
                            onPress={()=>{
                                
                            }}
                            style={{ width: 100, height: 35,backgroundColor:'#59B9E0'}}
                        ></Button>
                    </View>

                    {/* 相机拍照 */}
                    <TouchableOpacity  onPress={()=> {
                        this.handleCamera()
                        }} >
                            <Image style={{width:30,height:30}} source={require('../../../../assets/image3/camera.png')}></Image>
                    </TouchableOpacity>

                    {/* 从相册选择照片 */}
                    <TouchableOpacity onPress={() => {
                        this.handleLibrary()
                        }}>
                        <Image style={{width:30,height:30}} source={require('../../../../assets/image3/photoalbum.png')}></Image>
                    </TouchableOpacity>
                </View>
    )
  }
}

const styles = StyleSheet.create({
    content: {borderTopWidth:1,borderTopColor:'#000000', width: "100%", flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#E6DDD6', padding: 10, alignItems: 'center' }
});