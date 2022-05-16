import React from 'react';
// the Overlay is rn-overlay
import { View, Button, Overlay } from 'react-native';

export default class LatestPage extends React.Component {
    constructor(props) {
        super(props);
    }

    onOverlayShow() {
        console.log('Overlay shown');
    }

    onOverlayClose() {
        console.log('Overlay closed');
    }

    render() {
        return <View style={{paddingTop: 200}}>
            <Button title="Show a Overlay" onPress={() => this.overlay.show()}/>
            <Overlay
                // ref for the overlay
                ref={ele => this.overlay = ele}
                // callback function when the Overlay shown
                onShow={this.onOverlayShow}
                // callback function when the Overlay closed
                onClose={this.onOverlayClose}
                // style of the Overlay, same as View component
                style={{justifyContent:"center"}}>
                    <View style={{paddingVertical:80, backgroundColor:"white"}}>
                        <Button title="Close the Overlay" onPress={() => this.overlay.close()}/>
                    </View>
            </Overlay>
        </View>;
    }
}