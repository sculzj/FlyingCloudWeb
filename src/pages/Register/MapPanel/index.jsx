import React, {Component} from 'react';
import Map, {MapApiLoaderHOC} from 'react-bmapgl/Map';
import {NavigationControl, ZoomControl} from "react-bmapgl";
import {Input} from "antd";

class MapPanel extends Component {

    state = {center: {lng: 116.404449, lat: 39.914889}}

    componentDidMount() {
        const {map} = this.map;
        map.loadMapStyleFiles(() => {
            new window.BMapGL.LocalCity({renderoptions: {map: map}}).get(city => {
                this.setState({center: city.center}, () => {
                    map.addControl(new window.BMapGL.CityListControl({
                        anchor: window.BMapGL.BMAP_ANCHOR_TOP_LEFT,
                        offset: new window.BMapGL.Size(10, 5)
                    }));
                })
            });
        });
    }

    location = (value, _) => {
        const {map} = this.map;
        const handel=new window.BMapGL.LocalSearch(map, {
            renderOptions: {map: map, panel: this.panel, pageCapacity: 1}
        });
        handel.search(value);
    }

    getLocationInfo=()=>{
        const {map}=this.map;
        const info=map.getInfoWindow().getContent();
        const address=info.split('&nbsp;</td><td>')[1].split('&nbsp')[0];
        this.result.setState({value:address},()=>{
            this.props.saveAddress(address);
        });
    }

    render() {
        return (
            <div style={{width: '700px', height: '500px', margin: '0 auto'}}>
                <div style={{marginBottom: '10px'}}><Input.Search onSearch={this.location} ref={element=>{this.result=element}}/></div>
                <Map center={this.state.center} zoom={12} ref={element => {
                    this.map = element
                }} maxZoom={20} style={{width: '700px', height: '500px'}}>
                    <NavigationControl/>
                    <ZoomControl/>
                </Map>
                <div style={{
                    width: '700px',
                    height: '200px',
                    marginTop: '10px',
                    overflow: 'hidden scroll',
                    border: 'solid #999999 1px '
                }} ref={element => {
                    this.panel = element
                }} onClick={this.getLocationInfo}/>
            </div>
        );
    }
}

export default MapApiLoaderHOC({ak: 'mIbTq9DtaAPuV7g7Oy1ZuedzWUGir765'})(MapPanel);
