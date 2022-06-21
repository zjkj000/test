import React from "react";
import { Button, MenuItem, OverflowMenu } from "@ui-kitten/components";
import { TouchableOpacity, Image } from "react-native";
import http from "../../../utils/http/request";
import { styles } from "./styles";

export default function ClassList(props) {
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [classList, setClassList] = React.useState(["暂无内容"]);

    const onItemSelected = (index) => {
        setSelectedIndex(index); // 设置选中项
        remoteControl("openRes", "openRes", index); // 发送消息
        setVisible(false); // 设置隐藏
    };
    const renderListButton = () => {
        return (
            <TouchableOpacity onPress={getListItem}>
                <Image
                    style={styles.smallImg}
                    source={require("../../../assets/image2/top/skbcd.png")}
                ></Image>
            </TouchableOpacity>
        );
    };
    const remoteControl = (action, actionType, desc = "") => {
        const {
            ipAddress,
            userName,
            resId,
            resPath,
            learnPlanId,
            resRootPath,
        } = props;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_sendMessageByRn.do";
        let params = {
            type: 0,
            userType: "teacher",
            userNum: "one",
            source: userName,
            target: 0,
            messageType: 0,
            action,
            actionType,
            resId: resId ? resId : "",
            resPath: resPath ? resPath : null,
            learnPlanId: learnPlanId ? learnPlanId : null,
            resRootPath: resRootPath
                ? resRootPath
                : "C:/ZJKJ/SKYDT/zhihuiketang",
            desc: desc,
        };
        // params = { messageJson: JSON.stringify(params) };
        http.post(url, params)
            .then((res) => {
                console.log(
                    "ControllerSender===================================="
                );
                console.log(url);
                console.log(params);
                // console.log(this.props);
                console.log("actionType: " + actionType);
                console.log("action: " + action);
                console.log(res);
                console.log("Success!");
                console.log("====================================");
            })
            .catch((error) => {
                console.log(
                    "ControllerSender===================================="
                );
                console.log(params);
                console.log("actionType: " + actionType);
                console.log("action: " + action);
                console.log("Failed Because: " + error.toString);
                console.log("====================================");
            });
    };
    const getListItem = () => {
        const { ipAddress } = props;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_getPeriodList.do";
        // params = { messageJson: JSON.stringify(params) };
        http.get(url)
            .then((res) => {
                console.log(
                    "RenderListItem===================================="
                );
                console.log(url);
                console.log(res);
                console.log("Success!");
                console.log("====================================");
                resJson = JSON.parse(res);
                if (resJson.list.length !== 0) {
                    setClassList(resJson.list);
                }
            })
            .catch((error) => {
                console.log(
                    "RenderListItem===================================="
                );
                // console.log(params);
                // console.log("actionType: " + actionType);,,,
                // console.log("action: " + action);
                console.log("Failed Because: " + error.toString);
                console.log("====================================");
            });
        setVisible(true);
    };
    const renderListItem = () => {
        return classList.map((item, index) => {
            return <MenuItem key={`classList-${index}`} title={item} />;
        });
    };
    return (
        <OverflowMenu
            anchor={renderListButton}
            visible={visible}
            onSelect={onItemSelected}
            selectedIndex={selectedIndex}
            onBackdropPress={() => {
                setVisible(false);
            }}
        >
            {renderListItem()}
        </OverflowMenu>
    );
}
