import React from 'react';
import { InputForm, InputFormProps } from 'homepairs-elements';
import strings from 'homepairs-strings';
import {
    AuthPageInjectedProps,
    DarkModeInjectedProps,
} from 'homepairs-components';
import * as BaseStyles from 'homepairs-base-styles';
import { StyleSheet } from 'react-native';
import { isNullOrUndefined, isEmailSyntaxValid, isPasswordValid} from 'homepairs-utilities';
import { NavigationSwitchProp, NavigationSwitchScreenProps } from 'react-navigation';
import { validate } from 'json-schema';

export type RoopairsLoginDispatchProps = {
    onFetchAccountProfile: (
        username: string, 
        password: string,
        navigation: NavigationSwitchProp,
        modalSetOff: () => any, 
    ) => void
}

export type LoginProps = DarkModeInjectedProps &
    RoopairsLoginDispatchProps &
    AuthPageInjectedProps &
    NavigationSwitchScreenProps;


export type LoginState = {
    username: string;
    password: string;
};

const signInStrings = strings.signInPage;
const initialState: LoginState = {
    username: '',
    password: '',
};

function setInputStyles(colorTheme?: BaseStyles.ColorTheme) {
    const colors = isNullOrUndefined(colorTheme)
        ? BaseStyles.LightColorTheme
        : colorTheme;
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
            minWidth: 40,
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

export default class RoopairsLoginBase extends React.Component<
    LoginProps,
    LoginState
> {
    inputFormStyle;

    loginRef;

    passwordRef;

    constructor(props: Readonly<LoginProps>) {
        super(props);
        this.inputFormStyle = setInputStyles(props.primaryColorTheme);
        this.getFormUsername = this.getFormUsername.bind(this);
        this.getFormPassword = this.getFormPassword.bind(this);
        this.setModalOff = this.setModalOff.bind(this);
        this.clickButton = this.clickButton.bind(this);
        this.clickHighlightedText = this.clickHighlightedText.bind(this);
        this.state = initialState;
        this.loginRef = React.createRef();
        this.passwordRef = React.createRef();

        // Insert the callback functions to the AuthInjected bound functions
        props.clickButton(this.clickButton);
        props.clickHighlightedText(this.clickHighlightedText);
    }

    setModalOff(error: string = 'Error Message') {
        const { onChangeModalVisibility, setErrorState } = this.props;
        onChangeModalVisibility(false);
        setErrorState(true, error);
    }

    getFormUsername(childData: string) {
        this.setState({ username: childData });
    }

    getFormPassword(childData: string) {
        this.setState({ password: childData });
    }

    clickHighlightedText() {
        const {navigation} = this.props;
        navigation.navigate('SignUp');
    }

    validateForms(username: string, password: string) {
        let check = true;
        if (!isEmailSyntaxValid(username)) {
            this.loginRef.current.setError(true);
            check = false;
        }
        if (!isPasswordValid(password)) {
            this.passwordRef.current.setError(true);
            check = false;
        }
        return check;
    }

    resetForms() {
        this.loginRef.current.setError(false);
        this.passwordRef.current.setError(false);
    }

    clickButton() {
        const {onChangeModalVisibility, onFetchAccountProfile, navigation} = this.props;
        const {username, password} = this.state;
        this.resetForms();
        if (this.validateForms(username, password)) {
            onChangeModalVisibility(true);
            onFetchAccountProfile(username, password, navigation, this.setModalOff);
        }
    } 

    render() {
        const inputFormProps = [
            {   
                ref: this.loginRef,
                key: 'email',
                name: signInStrings.inputForms.email,
                parentCallBack: this.getFormUsername,
                formTitleStyle: this.inputFormStyle.formTitle,
                inputStyle: this.inputFormStyle.input,
                errorMessage: 'Invalid username! Must be an email',
            },
            {   
                ref: this.passwordRef,
                key: 'password',
                name: signInStrings.inputForms.password,
                parentCallBack: this.getFormPassword,
                formTitleStyle: this.inputFormStyle.formTitle,
                inputStyle: this.inputFormStyle.input,
                secureTextEntry: true,
                errorMessage: 'Invalid password! Must be at least 6 characters',
            },
        ];

        return inputFormProps.map(properties => {
            return (
                <InputForm
                    ref={properties.ref}
                    key={properties.key}
                    name={properties.name}
                    parentCallBack={properties.parentCallBack}
                    formTitleStyle={properties.formTitleStyle}
                    inputStyle={properties.inputStyle}
                    secureTextEntry={properties.secureTextEntry}
                    errorMessage={properties.errorMessage}
                />
            );
        });
    }
}
