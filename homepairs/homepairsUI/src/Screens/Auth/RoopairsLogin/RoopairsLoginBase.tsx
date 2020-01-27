import React from 'react';
import {InputFormProps, renderInputForm } from 'homepair-elements';
import strings from 'homepair-strings';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { AuthPageInjectedProps, DarkModeInjectedProps } from 'homepair-components';
import * as BaseStyles from 'homepair-base-styles';
import { StyleSheet } from 'react-native';


export type RoopairsLoginDispatchProps = {
    onFetchAccountProfile: (username: string, password: string,
        modalSetOff: () => any, navigationRouteCallback: () => any) => void
}

export type LoginProps = DarkModeInjectedProps & RoopairsLoginDispatchProps & AuthPageInjectedProps & NavigationStackScreenProps<any,any>
export type LoginState = {
    username: string,
    password: string,
}

const signInStrings = strings.signInPage;
const initialState : LoginState = {
    username : '',
    password : '',
};

function setInputStyles(colorTheme?: BaseStyles.ColorTheme){
    const colors = (colorTheme == null) ? BaseStyles.LightColorTheme : colorTheme;
    return StyleSheet.create({
        formTitle: {
            marginVertical: '3.5%', 
            fontFamily: BaseStyles.FontTheme.primary, 
            color: colors.lightGray,
          },
        input: {
             alignItems: 'center',
             alignSelf: 'center',
             margin: BaseStyles.MarginPadding.xsmallConst,
             minWidth:40,
             width: BaseStyles.ContentWidth.max,
             height: 40,
             color: colors.tertiary,
             borderColor: colors.lightGray,
             borderWidth: 1,
             borderRadius: BaseStyles.BorderRadius.small,
             paddingHorizontal: BaseStyles.MarginPadding.mediumConst,
        },
    });
}

function setInputStyles(colorTheme?: BaseStyles.ColorTheme){
    const colors = (colorTheme == null) ? BaseStyles.LightColorTheme : colorTheme
    return StyleSheet.create({
        formTitle: {
            marginVertical: '3.5%', 
            fontFamily: BaseStyles.FontTheme.primary, 
            color: colors.lightGray,
          },
        input: {
             alignItems: 'center',
             alignSelf: 'center',
             margin: BaseStyles.MarginPadding.xsmallConst,
             minWidth:40,
             width: BaseStyles.ContentWidth.max,
             height: 40,
             color: colors.tertiary,
             borderColor: colors.lightGray,
             borderWidth: 1,
             borderRadius: BaseStyles.BorderRadius.small,
             paddingHorizontal: BaseStyles.MarginPadding.mediumConst,
        },
    })
}

export default class RoopairsLoginBase extends React.Component<LoginProps, LoginState> {
<<<<<<< HEAD
    protected inputFormStyle 

    constructor(props: Readonly<LoginProps>){
        super(props)
        this.inputFormStyle = setInputStyles(props.primaryColorTheme)
        this.getFormUsername = this.getFormUsername.bind(this)
        this.getFormPassword = this.getFormPassword.bind(this)
        this.setModalOff = this.setModalOff.bind(this)
        this.navigateMain = this.navigateMain.bind(this)
        this.clickButton = this.clickButton.bind(this)
        this.clickHighlightedText = this.clickHighlightedText.bind(this)
        this.state = initialState
        
        this.props.clickButton(this.clickButton)
        this.props.clickHighlightedText(this.clickHighlightedText)
    }

    setModalOff(error:string = "Error Message") {
        this.props.showModal(false)
        this.props.setErrorState(true, error)
=======
    inputFormStyle: { formTitle: any; input: any; }

    constructor(props: Readonly<LoginProps>){
        super(props);
        this.inputFormStyle = setInputStyles(props.primaryColorTheme);
        this.getFormUsername = this.getFormUsername.bind(this);
        this.getFormPassword = this.getFormPassword.bind(this);
        this.setModalOff = this.setModalOff.bind(this);
        this.navigateMain = this.navigateMain.bind(this);
        this.clickButton = this.clickButton.bind(this);
        this.clickHighlightedText = this.clickHighlightedText.bind(this);
        this.state = initialState;
        
        props.clickButton(this.clickButton);
        props.clickHighlightedText(this.clickHighlightedText);
    }

    setModalOff(error:string = "Error Message") {
        const {showModal, setErrorState} = this.props;
        showModal(false);
        setErrorState(true, error);
>>>>>>> 6c0abe500170f7c4f80d6b59e196169385a97584
    }

    
    getFormUsername (childData : string) {
        this.setState({username : childData});
    }

    getFormPassword(childData : string){
        this.setState({password : childData});
    }

    navigateMain() {
<<<<<<< HEAD
        this.props.navigation.navigate('Main')
    }

    clickHighlightedText() {
        this.props.navigation.navigate('SignUp')
    }

    clickButton() {
        this.props.showModal(true)
        this.props.onFetchAccountProfile(this.state.username, this.state.password, this.setModalOff, this.navigateMain)
=======
        const {navigation} = this.props;
        navigation.navigate('Main');
    }

    clickHighlightedText() {
        const {navigation} = this.props;
        navigation.navigate('SignUp');
    }

    clickButton() {
        const {showModal, onFetchAccountProfile} = this.props;
        const {username, password} = this.state;
        showModal(true);
        onFetchAccountProfile(username, password, 'Roopairs', this.setModalOff, this.navigateMain);
>>>>>>> 6c0abe500170f7c4f80d6b59e196169385a97584
    } 

    inputFormProps() : {[id: string] : InputFormProps} {
        return {
            email: {
                name: signInStrings.inputForms.email,
                parentCallBack: this.getFormUsername,
                formTitleStyle: this.inputFormStyle.formTitle,
                inputStyle: this.inputFormStyle.input,
            },
            password: {
                name: signInStrings.inputForms.password,
                parentCallBack: this.getFormPassword,
                formTitleStyle: this.inputFormStyle.formTitle,
                inputStyle: this.inputFormStyle.input,
                secureTextEntry: true,
            },
        };
    }

    render() {
        const {email, password} = this.inputFormProps();
        return(
            <>
                {renderInputForm(email)}
                {renderInputForm(password)}
            </>
        );
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 6c0abe500170f7c4f80d6b59e196169385a97584
