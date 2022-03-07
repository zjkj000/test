# test

用于测试 git

## 2022.2.22 路由框架

### MainNavigation 组件

该组件用于集中处理组件间路由，需要路由的页面无论层级，都暂时写到该组件内，写法如下：

```react
<Stack.Screen name="Login" component={Login} />
```

其中 Login 为页面组件
之后在页面中如果需要跳转到该页面，只需要使用如下方式进行跳转：

```react
import { useNavigation } from "@react-navigation/native";
...
const navigation = useNavigation()
navigation.navigate("Login");
```

注意 useNavigation()只能被使用在函数组件中，如果是类组件，请在该组件外包裹一层函数，将 navigation 作为参数传入类组件，详见 React Navigation 指南

### TabBar 组件

该组件用于渲染底部导航栏，包含：

1. 首页
2. 线上课程
3. 错题本
4. 我的

四个页面，分别通过四个`renderXXXX`函数进行渲染，将写好的页面组件通过这四个 render 函数渲染即可

### 页面逻辑

App.js 负责渲染 MainNavigation 组件，并用 navigationContainer 将其包裹，搭建路由结构。MainNavigation 默认路由为 Login 组件。
Login 组件用于渲染登录页面，处理登录事件后跳转至 TabBar.js 组件，该组件用于渲染底部导航栏。

### utils

-   增加 http 组件，用于完成网络请求。
    -   httpBaseConfig.js 用于配置 API 的 URL
    -   使用时引入 http 类后，根据需求调用 get，post 等函数即可，需要传入调用 API 的相对地址，以及需要传递的参数 param，param 可以为空
-   增加 loading 组件，用于渲染 loading 界面
-   增加 PlaceHolder 组件，用于渲染骨架屏
-   增加 Screen 组件，用于获取设备的宽高
-   增加 TwiceTap 组件，用于为其他组件绑定点两次返回键推出应用的功能

## 2022.2.23 增加我的页面

### UI 组件库 React Native UI Kitten

该组件库基于 EVA Design 开发，使用时安装如下依赖：

```shell
yarn add @ui-kitten/components @eva-design/eva react-native-svg
```

然后在`App.js`中使用`ApplicationProvider`将其包裹,并且，为了能够使用 eva 图标库（该 UI 库推荐的图标库），还需要安装如下依赖：

```shell
yarn add @ui-kitten/eva-icons react-native-svg
```

然后同样在`App.js`中注册，最终整合到其中的写法如下：

```react
import React, { Component } from "react";
import { SafeAreaView, View } from "react-native";
import MainNavigation from "./src/Components/Navigation/MainNavigation";
import "react-native-get-random-values";
import { NavigationContainer, navigationRef } from "@react-navigation/native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider {...eva} theme={eva.light}>
                    <NavigationContainer>
                        <MainNavigation />
                    </NavigationContainer>
                </ApplicationProvider>
            </>
        );
    }
}
```

### 我的页面

在该页面中实现自定义头部，头像，以及各种按钮。
其中需要调取摄像头权限，进行拍照并更换头像。
头像使用 Avatar 控件，并通过 Overflow Menu 设置弹出页，通过弹出页面选择拍照或是从图库中直接选择。

## 2022.2.28 增加线上课堂界面

### 连接界面

改页面主要实现输入 IP 地址，点击连接按钮进行连接，跳转到 Temp 界面显示课堂信息并强制横屏。
使用如下方式实现强制横屏，增加点击输入框弹出历史记录的功能，增加可点击图标以便后期增加扫码功能。

### Temp 界面

显示课堂信息，并强制横屏，阻止返回事件：
使用如下组件为组件添加监听横屏事件：

```shell
yarn add react-native-orientation
```

该组件为我们提供了一些控制横竖屏的操作，例如：

```react
import Orientation from "react-native-orientation";
Orientation.lockToLandscape();
Orientation.lockToPortrait();
```

接下来只需要在组件的挂载和卸载生命周期中添加监听事件即可。

使用如下组件进行安卓返回操作的阻拦：

```react
import {
    BackHandler,
} from 'react-native';

```

定义监听 Back 按键处理函数：

```react
onBackAndroid() {

        if(this.props.navigation.state.params&&this.props.navigation.state.params.showDialog){//当dialog存在时，先消失dialog   然后返回true ，不执行系统默认操作
            this.props.navigation.setParams({
                showDialog:false
            })
            return true;
        }else{//返回false ，不执行系统默认操作
            return false;
        }

    }
```

注册监听事件：

```react
 componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

    }
```

取消监听事件：

```react
 componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

    }
```

## My 页面更新：

为修改密码功能增加弹出框，但输入框间距有待调整。

## 2022.3.2 增加扫码组件和通知组件

### 今日任务

-   扫码组件（未测试）
-   通知组件（实现并测试）

### 具体实现

#### 通知组件

通知组件使用如下第三放组件进行实现：

```shell
yarn add rn-overlay
```

使用时在 index.js 中全局引入该组件：

```react
import "rn-overlay";

```

之后使用则只需要从`react-native`中引入即可：

```react
import { Overlay } from "react-native";
```

封装时使用类`Toast`，将不同类型的弹出框设置为该类的类函数：

```react
import { Easing, Overlay } from "react-native";

const toast = Overlay.Toast;

export default class Toast {
    static showDangerToast(message) {
        toast.show(message, 3000, {
            textStyle: {
                backgroundColor: "#FFD6B3",
                color: "#7A0C10",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showSuccessToast(message) {
        toast.show(message, 3000, {
            textStyle: {
                backgroundColor: "#C0F9B1",
                color: "#0A5E2E",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showWarningToast(message) {
        toast.show(message, 2000, {
            textStyle: {
                backgroundColor: "#FFF9A4",
                color: "#7A6C05",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showInfoToast(message) {
        toast.show(message, 3000, {
            textStyle: {
                backgroundColor: "#9FD9FF",
                color: "#02247A",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
}
```

每个函数均接受参数：`message`，该参数用于表示需要在弹出框中显示的文字。该弹出框会根据 `message` 的内容动态调整大小.

Overlay 中的 Toast 函数接收如下参数：

-   message ：必须，需要显示的消息
-   duration ：非必须，消息框显示的时长，默认为 3000
-   option ：非必须，接收一个 styles 对象，其中应包含`textStyle`属性，用于定义弹出框的样式
-   position ：非必须，接收一个 toast.Position 中的参数，用于指定弹出框出现的位置，默认为中间，
-   animateEasing ：非必须，接收一个 React Native 中定义的 Easing 对象，用于定义弹出框的动画

## 2022.3.4 bug 修复

### 今日任务

-   整合各个部分的开发成果
-   解决扫码界面传参问题
-   完善扫码界面的动画表现
-   完成轮询请求消息队列
-   将项目打包

### 扫码页面传参问题

上节提到使用如下组件实现并封装了扫码功能：

```react
yarn add react-native-camera
```

但该组件使用轮询机制判断扫码结果并予以处理，因此该组件将会多次得到扫码结果，而在该项目中，扫码页面与其他页面独立，因此扫码得到结果后需要跳转到原页面，并将参数传递到该页面，如下所示：

```react
onBarCodeRead = (result) => {
        const { navigation, route } = this.props;

        const { data } = result;
        if (route.params?.backPage) {
            let { backPage } = route.params;
            navigation.navigate({
                name: backPage,
                params: { ipAddress: data },
                merge: true,
            });
        } else {
            navigation.navigate({
                name: "Home",
                params: { ipAddress: data },
                merge: true,
            });
        }
    };
```

上述函数`onBarCodeRead`将会执行多次，那么路由跳转也将执行多次，而每次执行都会引发原页面的渲染，而如果此时我们调用 set 方法进行 state 的设置，那么将会再一次导致页面渲染，最终使得渲染次数过多而报错。因此，我们需要一个方法来监听路由参数的变化，在此参数变化的情况下才进行对 state 的修改。
最终解决方案是使用钩子函数`useEffect`：

```react
    React.useEffect(() => {
        if (route.params?.ipAddress) {
            if (typeof route.params.ipAddress == "string") {
                let ipAddress = route.params.ipAddress;
                setScanIpAddress(ipAddress);
                setIpAddress(ipAddress);
            }
        }
    }, [route]);
```

使用该函数的第二个参数`[]`设置该钩子函数监听的变量，当该变量发生变换后，才会调用第一个参数中定义的钩子函数。因此解决了如上问题。

### 扫码页面动画

实现类似微信扫码上的横条上下移动动画。使用`react-native`中提供的动画组件`Animated`,通过如下配置，实现了该动画效果：

```react
    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(this.state.moveAnim, {
            toValue: -200,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => this.startAnimation());
    };
```

### 轮询请求

在上课界面中需要轮询请求消息 API，以实时响应 Host 传来的消息，因此需要在组件挂载时创建一个计时器：

```react
componentDidMount() {
        Orientation.lockToLandscape();
        if (Platform.OS === "android") {
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.onBackAndroid
            );
        }

        // 轮询
        this.timerId = setInterval(() => {
            this.getInfo();
            const { resJson } = this.state;
            if (resJson) {
                messageList = resJson.messageList;
                if (messageList.length !== 0) {
                    let action = messageList[0];
                    console.log(action);
                }
            }
        }, 500);
    }
```

并在组件卸载时将计时器清除，以免占用资源：

```react
    componentWillUnmount() {
        Orientation.lockToPortrait();
        if (Platform.OS === "android") {
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.onBackAndroid
            );
        }
        // 清空定时器
        clearInterval(this.timerId);
    }
```

最终实现能在控制台查看实时返回的消息的功能。

### 打包问题

由于本项目使用了组件`react-native-orientation`组件实现强制横屏效果，因此项目在打包时遇到了如下问题：

```shell
Execution failed for task ‘:react-native-orientation:verifyReleaseResources’.
```

原因是该组件在打包时使用了自己的 build.gradle 配置，该配置中使用的 JDK 版本与本地使用的 JDK 版本发生了冲突，解决方法如下：

1. 修改 node_modules\react-native-orientation\android\build.gradle 文件中、dependencies 下 compile 为 implementation。
2. 修改 node_modules\react-native-orientation\android\build.gradle 文件、与 android\build.gradle 文件版本保持一致。
   修改如下：

```xml
apply plugin: 'com.android.library'

android {
    // compileSdkVersion 23
    compileSdkVersion = 30
    // buildToolsVersion "23.0.1"
    buildToolsVersion = "30.0.2"

    defaultConfig {
        minSdkVersion 16
        // targetSdkVersion 22
        targetSdkVersion = 30
        versionCode 1
        versionName "1.0"
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
    }
}

dependencies {
    // compile "com.facebook.react:react-native:+"
    implementation "com.facebook.react:react-native:+"
}

```

最终打包成功

### 心得体会

本次整合时的 Bug 主要表现在大家完成自己的部分后没有及时 push，并且在测试重要开发环节时没有创建自己的分支，而是直接在主分支上修改。导致最终项目整合时出现了版本不一致，依赖冲突等问题。一次建议下次使用该命令：

```git
$ git branch 分支名 //创建新分支
$ git checkout 分支名 //切换到该分支
```

切换后的所有改动，通过 add 与 commit 都将提交到新的分支上，不会影响主分支。
当调试完毕，需要与主分支合并时，先保证该分支上所有改动都已 commit，然后切换到主分支：

```git
$ git checkout main
```

然后使用如下命令进行分支合并：

```git
$ git merge 分支名
```
