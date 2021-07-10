import React, {Component} from 'react';
import WikiNav from "../../components/WikiNav";
import wikiStyle from './index.module.css';
import NavCommon from "../../components/NavCommon";
import Footer from "../../components/Footer";

class Wiki extends Component {
    render() {
        return (
            <>
                <NavCommon/>
                <div className={wikiStyle.frame}>
                    <WikiNav/>
                </div>
                <Footer/>
            </>

        );
    }
}

export default Wiki;
