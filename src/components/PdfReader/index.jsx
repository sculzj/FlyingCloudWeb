import React, {Component} from 'react';
import {Document, Page} from "react-pdf";

import pdfStyle from './index.module.css';
import {Button} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
// require('../../resource/userResource/Tencent_license.pdf');

class PdfReader extends Component {

    state={page:1,pages:0};

    getLicensePages=(pdf)=>{
        this.setState({pages:pdf.numPages})
    }

    pageDown=()=>{
        this.setState({page:this.state.page>0?this.state.page-1:0});
    }

    pageUp=()=>{
        this.setState({page:this.state.page<this.state.pages?this.state.page+1:this.state.pages});
    }

    render() {
        return (
            <div  className={pdfStyle.box} style={{height: this.props.height}}>
                <div className={pdfStyle.content}>
                    <Document file={this.props.file} onLoadSuccess={this.getLicensePages}>
                        <Page pageNumber={this.state.page}/>
                    </Document>
                </div>
                <div className={pdfStyle.nav}>
                    <Button icon={<LeftOutlined />} className={pdfStyle.btu} disabled={this.state.page===1?true:false} onClick={this.pageDown}/>
                    <Button icon={<RightOutlined />} className={pdfStyle.btu} disabled={this.state.page===this.state.pages?true:false} onClick={this.pageUp}/>
                </div>
            </div>

        );
    }
}

export default PdfReader;