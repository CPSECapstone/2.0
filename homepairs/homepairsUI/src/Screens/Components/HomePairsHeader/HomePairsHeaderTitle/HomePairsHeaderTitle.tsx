import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image,
    Platform,} from 'react-native';
import React from 'react'
import { hamburger } from 'homepair-images';
import HomePairColors from 'homepair-colors';
import { HomePairFonts } from 'homepair-fonts';
import { DarkModeInjectedProps } from '../../WithDarkMode/WithDarkMode';

export type HomePairsHeaderTitleProps = DarkModeInjectedProps & {
    /**
     * This callBack function is intended to notify the parent header of when the 
     * hamburger icon has been clicked. The parameter intended to be passed should 
     * be this components showMenu property. 
    */
    toggleMenuCallBack?: (arg0?: any) => any
    showGoBackButton: boolean
    isDropDown: boolean
}

/**
 * This class is intended to hold all information for the first component of the header. There are a few 
 * conditions. This page is essentially the same if running as a native app or if the web page window has 
 * a resolution of less than 600px. 
 * 
 * This page has an optional props to send information back to the parent. This is function is intended to
 * help toggle the drop down menu of the header when the hamburger menu is present. 
 */
export class HomePairsHeaderTitle extends React.Component<HomePairsHeaderTitleProps>{
    hamburgerStyle: any // = (Platform.OS === 'web') ? this.state.styles.hamburgerStyleWeb : this.state.styles.hamburgerStyle
    hamburgerImageStyle: any //= (Platform.OS === 'web') ? this.state.styles.homePairsHamburgerImageWeb : this.state.styles.homePairsHamburgerImage
    colorScheme: any

    constructor(props: Readonly<HomePairsHeaderTitleProps>){
        super(props)
        this.colorScheme = (props.allColors == null) ? HomePairColors.LightModeColors : props.allColors
        styles = setColorScheme(this.colorScheme, baseStyles)
        this.getProperTitleStyle = this.getProperTitleStyle.bind(this)
        
        this.hamburgerStyle = (Platform.OS === 'web') ? styles.hamburgerStyleWeb : styles.hamburgerStyle
        this.hamburgerImageStyle = (Platform.OS === 'web') ? styles.homePairsHamburgerImageWeb : styles.homePairsHamburgerImage
    }

    
    getProperTitleStyle(){
        return (this.props.isDropDown) ? styles.homePairsTitleContainer : styles.homePairsTitleContainerNavSet
    }
   
    dropDownRender(){
        return (
            <TouchableOpacity
            onPress={() => this.props.toggleMenuCallBack()}
            style={this.hamburgerStyle}>
                <Image 
                style={this.hamburgerImageStyle} 
                source={hamburger}/>
            </TouchableOpacity> 
        )
    }

    chooseWideRender(){
        /**
         * Case 1: If window is large, show all navigation options next to title
         * Else:: If window is tiny, show hamburger menu for dropdown navigation
         */
        if(this.props.isDropDown){
            return this.dropDownRender()
        }
        return(
            <View style={{height:'0%', width:'0%'}}></View>
        )
    }
    render() {
        return (
           <View style={this.getProperTitleStyle()}>
               <Text style={styles.homePairsTitle}>HomePairs</Text>
               {this.chooseWideRender()}
           </View>
        )
    }
}


const setColorScheme = (colorScheme:any, baseStyles: any) => {
    let newStyle = StyleSheet.create({
        homePairsTitleContainer: {...baseStyles.homePairsTitleContainer, backgroundColor: colorScheme.primary},
        homePairsTitleContainerNavSet: {...baseStyles.homePairsTitleContainerNavSet, backgroundColor: colorScheme.primary},
        homePairsTitle: {...baseStyles.homePairsTitle, color: colorScheme.title},
        homePairsHamburgerImage: {...baseStyles.homePairsHamburgerImage},

        hamburgerStyle: {...baseStyles.hamburgerStyle},
        homePairsHamburgerImageWeb: {...baseStyles.homePairsHamburgerImageWeb},
        hamburgerStyleWeb: {...baseStyles. hamburgerStyleWeb},

    })
    return newStyle
}
var styles = null
const baseStyles = {
    homePairsTitleContainer : {
        flexDirection: 'row', 
        padding: 15,
        paddingRight: 0,
        height: 80,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1
    },
    homePairsTitleContainerNavSet: {
        flexDirection: 'row', 
        padding: 15,
        paddingRight: 0,
        height: 80,
        minWidth: 175,
        maxWidth: 185,
        justifyContent: 'center',
        alignContent: 'center',
        flex: 5
    },
    homePairsTitle: {
        fontFamily: HomePairFonts.nunito_regular, 
        fontSize: 32,
        flex: 6,
    },
    homePairsHamburgerImage: {
        alignSelf:'center', 
        width: 45,
        height: 45,
    },
    hamburgerStyle: {
       flex: 2,
       marginRight: "3%",
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
        marginRight: "3%",
        width: null,
        height: null,
    },

}