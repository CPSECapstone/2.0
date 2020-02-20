import React from 'react'; //* *For every file that uses jsx, YOU MUST IMPORT REACT  */
import { StyleSheet, Text } from 'react-native';
import { Sticker } from 'homepairs-elements';
import { FontTheme, ContentWidth, MarginPadding} from 'homepairs-base-styles';

import * as BaseStyles from 'homepairs-base-styles';

export type AddressStickerProps = {
    /**
     * Slightly greyed text to represent street address.
     */
    address: string

    /**
     * Piece one of the bolden text, represents city.
     */
    city: string

    /**
     * Piece two of the bolden text, represents state.
     */
    state: string
}

const colors = BaseStyles.LightColorTheme;
const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.veryLightGray,
        width: ContentWidth.thin,
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: MarginPadding.xlargConst,
        padding: MarginPadding.largeConst,
        borderRadius: 5,
    },
    cityStateText: {
        color: colors.tertiary,
        fontSize: FontTheme.reg,
        fontFamily: FontTheme.primary,
    },
    streetText: {
        fontSize: FontTheme.reg,
        fontFamily: FontTheme.primary,
        color: colors.lightGray,
    },
    textContainer: {
        width: ContentWidth.reg,
        paddingBottom: MarginPadding.mediumConst,
        borderBottomWidth: 1,
    },
});


/**
 * ---------------------------------------------------
 * Address Sticker 
 * ---------------------------------------------------
 * A very simple component that essentiall formats text components into a stylized
 * visual. It only takes 3 properties for address, city, and state. 
 * */
export default function AddressSticker(props: AddressStickerProps) {
    const {address, state, city} = props;
    return(
       <Sticker style={styles.container}>
            <Text style={styles.cityStateText}>
            {city},{" "}{state}{" "} 
            <Text style={styles.streetText}>/{` ${address}`}</Text>
            </Text>
        </Sticker>
    );
}