import axios from "axios";

 export default function getItemFromLocalStorage(key){
    const itemStr = localStorage.getItem(key);
    if (itemStr) {
        return JSON.parse(itemStr);
    }else return false;
};
