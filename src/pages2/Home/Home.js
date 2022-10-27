import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from "react-native";
import http from "../../utils/http/request";
let pageNo = 1; //当前第几页
let totalPage = 5; //总的页数
let itemNo = 0; //item的个数

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRefresh: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false, //下拉控制
        };
    }
    fetchData(pageNo, onRefresh = false) {
        let params = {
            q: "javascript",
            sort: "stars",
            page: pageNo,
        };
        http.get("/search/repositories", params)
            .then((responseData) => {
                let data = responseData.items;
                let dataBlob = [];
                let i = itemNo;

                data.map(function (item) {
                    dataBlob.push({
                        key: i,
                        value: item,
                    });
                    i++;
                });
                itemNo = i;
                // console.log("itemNo:" + itemNo);
                let foot = 0;
                if (pageNo >= totalPage) {
                    foot = 1; //listView底部显示没有更多数据了
                }
                this.setState({
                    //复制数据源
                    dataArray: onRefresh
                        ? dataBlob
                        : this.state.dataArray.concat(dataBlob),
                    isLoading: false,
                    isRefresh: false,
                    showFoot: foot,
                    isRefreshing: false,
                });
                data = null;
                dataBlob = null;
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }
    componentDidMount() {
        //请求数据
        this.fetchData(pageNo);
    }
    //加载等待页
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} color="red" size="large" />
            </View>
        );
    }

    //加载失败view
    renderErrorView() {
        return (
            <View style={styles.container}>
                <Text>Fail</Text>
            </View>
        );
    }
    //返回itemView
    _renderItemView = ({ item }) => {
        // console.log(this.props);
        const navigation = this.props.navigation;
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Details", {
                            article: item,
                            itemId: 10,
                        });
                    }}
                >
                    <Text style={styles.title}>name: {item.value.name}</Text>
                    <Text style={styles.content}>
                        stars: {item.value.stargazers_count}
                    </Text>
                    <Text style={styles.content}>
                        description: {item.value.description}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderData() {
        return (
            <FlatList
                // 定义数据显示效果
                data={this.state.dataArray}
                renderItem={this._renderItemView}
                ItemSeparatorComponent={this._separator}
                // //下拉刷新相关
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.isRefresh}
                // 上拉加载相关
                ListFooterComponent={this._renderFooter.bind(this)}
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={1}
            />
        );
    }
    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }
        //加载数据
        return this.renderData();
    }
    _onRefresh() {
        totalPage = 5;
        pageNo = 0;
        itemNo = 0;
        this.setState({
            isRefresh: true,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false, //下拉控制
        });
        this.fetchData(pageNo, (onRefresh = true));
    }
    _separator() {
        return <View style={{ height: 1, backgroundColor: "#999999" }} />;
    }
    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View
                    style={{
                        height: 30,
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <Text
                        style={{
                            color: "#999999",
                            fontSize: 14,
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }

    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot != 0) {
            return;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if (pageNo != 1 && pageNo >= totalPage) {
            return;
        } else {
            pageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({ showFoot: 2 });
        //获取数据
        this.fetchData(pageNo);
    }
}

export default function Home(props) {
    const navigation = useNavigation();
    return <HomePage {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    title: {
        fontSize: 15,
        color: "blue",
    },
    footer: {
        flexDirection: "row",
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    content: {
        fontSize: 15,
        color: "black",
    },
});
