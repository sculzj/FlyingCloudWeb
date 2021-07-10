import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import Body from "./components/Body";
import {PersistGate} from "redux-persist/integration/react";
import Store from './redux/store';
import './index.css';

ReactDOM.render(
    <PersistGate loading={null} persistor={Store.persistor}>
        <BrowserRouter>
            <Body/>
        </BrowserRouter>
    </PersistGate>,
    document.getElementById('root')
);
Store.store.subscribe(() => {
    ReactDOM.render(
        <BrowserRouter>
            <Body/>
        </BrowserRouter>,
        document.getElementById('root')
    );
});
