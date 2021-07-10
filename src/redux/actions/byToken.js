import {ACTIONS} from '../../resource/constant';

export const saveToken = token => ({type: ACTIONS.SAVE_TOKEN, data: token});
export const cleanToken = () => ({type: ACTIONS.CLEAN_TOKEN, data: ''});