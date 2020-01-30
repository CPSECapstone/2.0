import React from 'react';
import { HomePairFonts } from 'homepairs-fonts';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Platform,
} from 'react-native';

export type HamburgerButtonProps = {
    key?: any;
    onClick?: () => any;
    onPressIn?: () => any;
    onPressOut?: () => any;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%',
        marginRight: '5%',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
        maxHeight: 45,
        width: 45,
        borderWidth: 1.4,
        borderColor: '#rgba(0,0,0, .08)',
    },
    buttonText: {
        flex:1,
        alignSelf: 'center',
        fontFamily: HomePairFonts.nunito_extrabold,
        color: '#B3C0C2',
        fontSize:  Platform.OS === 'web' ? 45 : 30,
    },
    homePairsHamburgerImage: {
        alignSelf: 'center',
        width: 45,
        height: 45,
    },
    hamburgerStyle: {
        flex: 1,
        marginRight: '3%',
        height: null,
        width: null,
        resizeMode: 'contain',
        maxWidth: 50,
    },
    homePairsHamburgerImageWeb: {
        width: 45,
        height: 45,
    },
    hamburgerStyleWeb: {
        flex: 1,
        marginRight: '3%',
        width: null,
        height: null,
    },
});

 /* *
  * ------------------------------------------------------------
  * Hamburger Button
  * ------------------------------------------------------------
  * A simple button that by default, renders a thin button with a 
  * hamburger (congruence) symbol. This is intended to be used with
  * navigation menus.
  *  
  * @param props 
  * key?: any;
  * onClick?: () => any;
  * onPressIn?: () => any;
  * onPressOut?: () => any;
  */
export default function ThinButton(props: HamburgerButtonProps) {
    // This function will call the parent callback function.
    const {onClick} = props;

    const {container, button, buttonText} = styles;
    function onPress() {
        onClick();
    }

    return (
        <View style={container}>
            <TouchableOpacity
                testID='click-hamburger-button'
                style={button}
                onPress={onPress}
            >
                <Text style={buttonText}>&#8801;</Text>
            </TouchableOpacity>
        </View>
    );
}

ThinButton.defaultProps = {
    onClick: () => {},
};

