import {ACTIONS} from '../../resource/constant';

/**
 * 初始化token值
 * @type {string}
 */
const initToken='';

export default function token(preState=initToken,action){
    const {type,data}=action;
    switch (type){
        case ACTIONS.SAVE_TOKEN:
            return data;
        case ACTIONS.CLEAN_TOKEN:
            return '';
        default:
            return preState;
    }
}