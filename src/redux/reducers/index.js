import {combineReducers} from 'redux';
import token from './byToken';
import userinfo from "./byUserInfo";
import code from './byCode';

export default combineReducers({token,userinfo,code});
