import { HomePairsDimensions } from 'homepairs-types';
import { HomePairFonts } from '../fonts';

export type ColorTheme = {
    primary: string
    secondary: string
    tertiary: string
    space: string
    transparent: string
    red: string
    gray: string
    lightGray: string,
    veryLightGray: string,
    shadow: string
}
export const LightColorTheme : ColorTheme = {
    primary: '#00ADE9',
    secondary: 'white',
    tertiary: '#374245',
    space: '#1177B0',
    transparent: 'transparent',
    red: '#C70000',
    gray: 'rgba(0,0,0,.5)',
    lightGray: 'rgba(55,66,69,.5)',
    veryLightGray: '#E9ECEF',
    shadow: 'black',
};

export const DarkColorTheme : ColorTheme = {
    primary: '#00ADE9',
    secondary: '#1E1F21',
    tertiary: 'white',
    space: '#1177B0',
    transparent: 'transparent',
    red: '#C70000',
    gray: 'rgba(255,255,255,.75)',
    lightGray: 'rgba(255,255,255,.9)',
    veryLightGray: 'rgba(100,100,100, .50)',
    shadow: 'white',
};

export const FontTheme = {
    title: 40,
    xlg: 32,
    lg: 24,
    reg: 16,
    small: 14,
    xsmal: 12,
    button: HomePairsDimensions.MAX_CONTENT_SIZE > 300 ? 22 : 18,
    subtitle: 20,
    
    primary: HomePairFonts.nunito_regular,
    secondary: HomePairFonts.nunito_bold,
    tertiary: HomePairFonts.nunito_light,
};

export const MarginPadding = {
    small: '1%',
    medium: '2.5%',
    inputForm: '3.5%',
    large: '5%',
    xlarge: '10%',

    xsmallConst: 2.5,
    smallConst: 5,
    mediumConst: 10,
    largeConst: 20,
    xlargConst: 25,
};

export const ContentWidth = {
    half: '50%',
    thin: '90%',
    reg: '95%',
    wide: '97.5%',
    max: '100%',
    buttonWide: '20%',
    buttonReg: '15%',
    buttonThin: '10%',
};

export const BorderRadius = {
    medium: 6,
    large: 8,
    small: 4,
};
