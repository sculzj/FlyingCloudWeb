import {ACTIONS} from "../../resource/constant";

export const saveUserInfo = (userInfo) => ({type: ACTIONS.SAVE_USERINFO, data: userInfo});
export const clearUserInfo = () => ({type: ACTIONS.CLEAN_USERINFO, data: ''});