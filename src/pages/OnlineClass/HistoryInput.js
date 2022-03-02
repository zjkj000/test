import React from "react";
import { Autocomplete, AutocompleteItem, Icon } from "@ui-kitten/components";

export default function HistoryInput(props) {
    let historyList = [
        { title: "Star Wars" },
        { title: "Back to the Future" },
        { title: "The Matrix" },
        { title: "Inception" },
        { title: "Interstellar" },
    ];
    historyList = props.historyList ? props.historyList : historyList;
    const [value, setValue] = [props.value, props.setValue];
    const [data, setData] = React.useState(historyList);

    const filter = (item, query) =>
        item.title.toLowerCase().includes(query.toLowerCase());

    const onSelect = (index) => {
        setValue(historyList[index].title);
    };

    const onChangeText = (query) => {
        setValue(query);
        setData(historyList.filter((item) => filter(item, query)));
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
