import {ACTIONS} from "../../resource/constant";

const initInfo= {};

export default function userinfo(preState=initInfo,action){
    const {type,data}=action;
    switch (type) {
        case ACTIONS.SAVE_USERINFO:
            return data;
        case ACTIONS.CLEAN_USERINFO:
            return {};
        default:
            return preState;
    }
}