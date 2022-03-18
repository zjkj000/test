import React from "react";
import { Autocomplete, AutocompleteItem, Icon } from "@ui-kitten/components";
import Toast from "../../utils/Toast/Toast";
import StorageUtil from "../../utils/Storage/Storage";

export default function HistoryInput(props) {
    const [value, setValue] = [props.value, props.setValue];
    const [data, setData] = React.useState([]);

    const filter = (item, query) =>
        item.title.toLowerCase().includes(query.toLowerCase());

    const onSelect = (index) => {
        setValue(data[index].title);
    };
    React.useEffect(() => {
        initData();
    }, []);
    const onChangeText = (query) => {
        setValue(query);
        setData(data.filter((item) => filter(item, query)));
    };
    const initData = async () => {
        try {
            let res = await StorageUtil.get("historyListRemote");
            res = res ? res : [];
            setData(res);
            return res;
        } catch (e) {
            Toast.showDangerToast(e.toString());
        }
    };

    const renderOption = (item, index) => (
        <AutocompleteItem key={index} title={item.title} />
    );

    return (
        <Autocomplete
            accessoryLeft={props.icon ? props.icon : <></>}
            placeholder="Place your Text"
            value={value}
            onSelect={onSelect}
            onChangeText={onChangeText}
            style={props.style}
        >
            {data.map(renderOption)}
        </Autocomplete>
    );
}
