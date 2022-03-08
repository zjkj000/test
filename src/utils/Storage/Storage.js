import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageUtil {
    /**
     * 获取
     * @param key
     */
    static get(key) {
        return AsyncStorage.getItem(key)
            .then((value) => {
                if (value && value != "") {
                    const jsonValue = JSON.parse(value);
                    return jsonValue;
                }
                return null;
            })
            .catch(() => null);
    }

    /**
     * 保存
     * @param key
     * @param value
     */
    static save(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * 更新
     * @param key
     * @param value
     */
    static update(key, value) {
        return AsyncStorage.get(key).then((item) => {
            value =
                typeof value === "string"
                    ? value
                    : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }

    /**
     * 删除
     * @param key
     */
    static delete(key) {
        return AsyncStorage.removeItem(key);
    }

    // 删除选择的json
    static deleteOptional(array) {
        array.map((item, index) => AsyncStorage.removeItem(item));
    }

    /**
     * 删除所有配置数据
     */
    static clear() {
        return AsyncStorage.clear();
    }
}

export default StorageUtil;
