import storage from 'redux-persist/lib/storage';
import {createStore} from "redux";
import {persistReducer, persistStore} from 'redux-persist';
import reducers from './reducers';

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export default (()=>{
    const store = createStore(persistedReducer);
    const persistor = persistStore(store);
    return {store, persistor};
})();
