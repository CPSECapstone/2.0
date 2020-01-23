import React from 'react'; //**For every file that uses jsx, YOU MUST IMPORT REACT  */
import { 
    View, 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    ScrollViewProps, 
    Image, 
    StyleSheet, 
    ImageProps 
} from 'react-native';
import { defaultProperty } from 'homepair-images';
import {GeneralHomeInfo, GeneralHomeInfoProps, AddressSticker } from 'homepair-components';
import { HomepairsPropertyAttributes, PropertyListState, Property, HomePairsDimensions } from 'homepair-types';
import { NavigationStackScreenProps } from 'react-navigation-stack'
import strings from 'homepair-strings';
import * as BaseStyles from 'homepair-base-styles'
import { DarkModeInjectedProps } from 'homepair-components';

const navParams = strings.detailedPropertyPage.navigationParams

export type TenantPropertyStateProps = DarkModeInjectedProps & {
  properties: PropertyListState,
}
/*export type TenantPropertyDispatchProps = {
  onUpdateProperty?: (index : number, address: string, tenants: number, bedrooms: number, bathrooms: number) => void,
  onRemoveProperty?: (index : number) => void;
}*/

type Props = NavigationStackScreenProps & TenantPropertyStateProps //& TenantPropertyDispatchProps
const propertyKeys = HomepairsPropertyAttributes

export default function TenantPropertyScreenBase(props:Props){

    //const id: number = props.navigation.getParam(navParams.propertyIndex)
    const property: Property = props.properties[0] //THIS IS BAD CODING, ASSUMING AN ARRAY IS OF SIZE 1
    let styles = setStyles(props.primaryColorTheme)

    const imageProps : ImageProps = { 
        source: defaultProperty,
        style: Platform.OS === 'web' ? styles.homePairsPropertiesImageWeb : styles.homePairsPropertiesImage,
        resizeMode: 'cover',
    }

    /*const generalHomeInfoProps:  GeneralHomeInfoProps = {
        address: property[propertyKeys.ADDRESS],
        tenants: property[propertyKeys.TENANTS],
        bedrooms: property[propertyKeys.BEDROOMS],
        bathrooms: property[propertyKeys.BATHROOMS],
        onClick: //TO DO: we need a new component for Tenant Properties
        primaryColorTheme: props.primaryColorTheme  
    }*/

    function renderContents(){
        console.log(property)
        return(
        //TO DO (line 65-66 ADD TENANT COMPONENT)
        <ScrollView style={{flexGrow: 1}}>
            <View style={styles.addBottomMargin}>
                <AddressSticker
                address={property[propertyKeys.ADDRESS]}
                primaryColorTheme={props.primaryColorTheme}/>
                <View style={styles.imageWrapper}>
                <View style={styles.imageContainer}>
                    <Image {...imageProps}/>
                    </View>
                </View>
            </View>
        </ScrollView>
        )
    }
    
    return(
        !(Platform.OS === 'ios') ? 
        (
            <View style={styles.container}>
                <View style={styles.pallet}>
                    {renderContents()}
                </View>
            </View>
        ) : (
            <View style={styles.container}>
                <SafeAreaView style={styles.pallet}>
                    {renderContents()}
                </SafeAreaView>
            </View>
    ))

}

function setStyles(colorTheme?:BaseStyles.ColorTheme) { 
    let colors = (colorTheme == null) ? BaseStyles.LightColorTheme : colorTheme
    return (    
        StyleSheet.create({
            container : {
                alignItems: 'center',
                backgroundColor: colors.space,
                width: BaseStyles.ContentWidth.max,
                flex:1,
            },
            pallet:{
                backgroundColor: colors.secondary,
                width: BaseStyles.ContentWidth.max,
                flex: 1,
                maxWidth: HomePairsDimensions.MAX_CONTENT_SIZE,
                alignSelf: 'center',
            },
            imageContainer: {
                width: BaseStyles.ContentWidth.max, 
                height: '100%',
                overflow: 'hidden',
                borderRadius: BaseStyles.BorderRadius.large,  
            },
            imageWrapper: {
                width: BaseStyles.ContentWidth.thin, 
                height: '50%',
                maxHeight: 200,
                borderRadius: BaseStyles.BorderRadius.large,
                backgroundColor: 'white',
                alignSelf:'center',
                alignContent: 'center',
                shadowColor: colors.shadow,
                shadowRadius: 10,
                shadowOffset: {width : 1, height: 1,},
                shadowOpacity: .25,
                elevation: 9,
            },
            scrollViewContentContainer: {
                maxWidth: HomePairsDimensions.MAX_CONTENT_SIZE,
                backgroundColor: colors.secondary,
                alignSelf: 'center',
                width: BaseStyles.ContentWidth.max,
                flexGrow: 1,
            },
            addBottomMargin: {
                flex: 1,
                marginBottom: BaseStyles.MarginPadding.largeConst
            },
            homePairsPropertiesImage: {
                flex: 1,
                alignSelf:'center', 
                width: BaseStyles.ContentWidth.max,
                height: '100%',
                overflow: 'hidden',
            },
            homePairsPropertiesImageWeb: {
                alignSelf:'center', 
                width: BaseStyles.ContentWidth.max,
                height: '100%',
                overflow: 'hidden',
            },
        })
    )};