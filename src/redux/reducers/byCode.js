import {ACTIONS} from "../../resource/constant";

export default function code(preState='',action){
    const {type,data}=action;
    switch (type){
        case ACTIONS.SAVE_CODE:
            return data;
        case ACTIONS.CLEAN_CODE:
            return '';
        default:
            return preState;
    }
}
