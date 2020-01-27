import React from 'react';
import { InputForm } from 'homepairs-elements';
import strings from 'homepairs-strings';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import {
    AuthPageInjectedProps,
    DarkModeInjectedProps,
} from 'homepairs-components';
import * as BaseStyles from 'homepairs-base-styles';
import { StyleSheet } from 'react-native';
import {
    isEmailSyntaxValid,
    isPasswordValid,
    isNullOrUndefined,
} from 'homepairs-utilities';

export type LoginViewDispatchProps = {
    onFetchAccountProfile: (
        username: string,
        password: string,
        modalSetOff: () => any,
        navigationRouteCallback: () => any,
    ) => void;
};

export type LoginProps = DarkModeInjectedProps &
    LoginViewDispatchProps &
    AuthPageInjectedProps &
    NavigationStackScreenProps<any, any>;
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

export default class LoginScreenBase extends React.Component<
    LoginProps,
    LoginState
> {
    protected inputFormStyle;

    constructor(props: Readonly<LoginProps>) {
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

    /**
     * Sets the state of the modal to hidden and then displays an error message. If none is passed
     * defaults to 'Error Message'
     */
    setModalOff(error: string = 'There was an error logging in.') {
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
        const { navigation } = this.props;
        navigation.navigate('SignUp');
    }

    clickButton() {
        const { onChangeModalVisibility, onFetchAccountProfile } = this.props;
        const { username, password } = this.state;
        onChangeModalVisibility(true);
        if (!isEmailSyntaxValid(username)) {
            this.setModalOff('Invalid Username! Must be an email');
        } else if (!isPasswordValid(password)) {
            this.setModalOff('You have entered an invalid password.');
        } else {
            onFetchAccountProfile(
                username,
                password,
                this.setModalOff,
                this.navigateMain,
            );
        }
    }

    navigateMain() {
        const { navigation } = this.props;
        navigation.navigate('Main');
    }

    render() {
        const inputFormProps = [
            {
                key: signInStrings.inputForms.email,
                name: signInStrings.inputForms.email,
                parentCallBack: this.getFormUsername,
                formTitleStyle: this.inputFormStyle.formTitle,
                inputStyle: this.inputFormStyle.input,
            },
            {
                key: signInStrings.inputForms.password,
                name: signInStrings.inputForms.password,
                parentCallBack: this.getFormPassword,
                formTitleStyle: this.inputFormStyle.formTitle,
                inputStyle: this.inputFormStyle.input,
                secureTextEntry: true,
            },
        ];
        return inputFormProps.map(properties => {
            return (
                <InputForm
                    key={properties.key}
                    name={properties.name}
                    parentCallBack={properties.parentCallBack}
                    formTitleStyle={properties.formTitleStyle}
                    inputStyle={properties.inputStyle}
                    secureTextEntry={properties.secureTextEntry}
                />
            );
        });
    }
}
