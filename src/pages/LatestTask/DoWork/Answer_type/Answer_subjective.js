import { Text, StyleSheet, View, ScrollView,Image,TextInput,Button,Alert} from 'react-native'
import React, { Component } from 'react'
import HTMLView from 'react-native-htmlview';
import { TouchableOpacity } from "react-native-gesture-handler";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {OverflowMenu,MenuItem} from "@ui-kitten/components";



// 主观题 模板页面
//  使用时 需要传入三个参数：  sum   num  datasource
// 需要传的参数有三个，第一个是共多少题，第二个是当前是第index题 这里用了的（index+1）显示第几题。 第三个是试题数据。
export default class Answer_single extends Component {
  constructor(props) {
    super(props)
    this.state = {  
            moduleVisible : false, //用于控制点击拍照图片，弹出选择  拍照或者从相册选取 
            numid:'',
            questionTypeName:'主观题',
            questionId:'',
            baseTypeId:'',
            questionName:'',        //题目名称
            questionChoiceList:'',  
            questionContent:'',   //题目内容
            answer:'',      
            imgURL: "",            //拍照或本地选择照片的uri
            value: "",   
            hasImage:false, //是否答案有照片
            msg:''        //答案内容
    }
 }  
    UNSAFE_componentWillMount(){this.setState({numid:this.props.num,...this.props.datasource});}
    
    //拍照调用的函数
    handleCamera = () => {
        const option = {
            title: "请选择",
            cancelButtonTitle: "取消",
            takePhotoButtonTitle: "拍照",
            chooseFromLibraryButtonTitle: "选择照片",
            includeBase64: true, // 拍照后生成base64字串
            quality: 1.0,
            allowsEditing: true,
            maxWidth: 500,
            maxHeight: 500,
            saveToPhotos: true,
            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        };
        launchCamera(option, (response) => {
            // console.log(response);
            if (response.didCancel) {
                return;
            }
            response = response.assets[0];
            // console.log(response.base64);
            this.setState({
                imgURL: response.uri,
                hasImage: true,
                moduleVisible: false,
            });
        });
      };

    //从本地选择照片需要的函数
    handleLibrary = () => {
        const option = {
            title: "请选择",
            chooseFromLibraryButtonTitle: "选择照片",
            includeBase64: true, // 拍照后生成base64字串
            quality: 1.0,
            allowsEditing: true,
            maxWidth: 500,
            maxHeight: 500,
            saveToPhotos: true,
            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        };
        launchImageLibrary(option, (response) => {
            // console.log(response);
            if (response.didCancel) {
                return;
            }
            response = response.assets[0];
            // console.log(response.base64);
            this.setState({
                imgURL: response.uri,
                hasImage: true,
                moduleVisible: false,
            });
        });
    };

    //默认弹框不显示，以及需要把弹窗效果加在的地方的  相机图片  显示
    renderAvatar = () => {
      return (
          <TouchableOpacity
              onPress={() => {
                  this.setState({ moduleVisible: true });
              }}
          >
          <Image style={{width:30,height:30}} source={require('../../../../assets/image3/camera.png')}></Image>
          </TouchableOpacity>
      );
  };
  render(){
    const HTML = this.state.questionContent;
    let answerimage = this.state.hasImage? <Image style={{width:50,height:50}} source={{ uri: this.state.imgURL }}></Image>:null;
    return (
      <View>
            {/* 第一行显示 第几题  题目类型 */}
            <View  style={styles.answer_title}>
                <Text>{this.state.numid+1}/{this.props.sum}题</Text>
                <Text style={{marginLeft:20}}>{this.state.questionTypeName}</Text>
            </View>
            {/* 题目展示区域 */}
            <ScrollView style={styles.answer_area}>
                <HTMLView value={HTML}/>
                <Text style={{height:50}}></Text>
            </ScrollView>
            {/* 分割线 */}
            <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>
            {/* 答案预览区域 */}
            <ScrollView style={styles.answer_preview}>
                {answerimage}
                <Text >{this.state.msg}</Text>
            </ScrollView>
          
          {/* 作答区域 */}
          <View style={{backgroundColor:'#000000',height:1,width:'100%'}}></View>
            <View style={styles.content}>
              <Text onPress={()=>this.setState({msg:''})} style={{color:'#B68459'}}>删除</Text>
              <TextInput placeholder="请输入答案！" multiline style={{width:200,backgroundColor:'#FFFFFF',height:40}} value={this.state.msg} onChangeText={text=>this.setState({msg:text})}></TextInput>
              {/* 拍照答题功能弹窗 */}
              <OverflowMenu
                        anchor={this.renderAvatar}
                        visible={this.state.moduleVisible}
                        onBackdropPress={() => {
                            this.setState({ moduleVisible: false });
                        }}
                    >
                        <MenuItem title="拍照" 
                           onPress={this.handleCamera} 
                        />
                        <MenuItem
                            title="从相册中选择"
                             onPress={this.handleLibrary}
                        />
                        <MenuItem
                            title="取消"
                            onPress={() => {
                                this.setState({ moduleVisible: false });
                            }}
                        />
              </OverflowMenu>
              <Button title='保存' onPress={()=>alert('点了保存')} style={{width:100,height:35}}></Button>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    answer_title:{padding:10,paddingLeft:30,flexDirection:'row'},
    answer_area:{height:"65%",padding:20},
    answer_preview:{height:"21%",padding:20,backgroundColor:'#FFFFFF'},
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
},
    content:{width:"100%",flexDirection:'row',justifyContent:'space-around',backgroundColor:'#E6DDD6',padding:10,alignItems:'center'}
})