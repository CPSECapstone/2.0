import React from "react";
import { InputForm, InputFormProps } from "src/Elements/Elements";
import strings from "homepair-strings";
import { NavigationStackScreenProps } from "react-navigation-stack";
import {
  AuthPageInjectedProps,
  DarkModeInjectedProps
} from "homepair-components";
import * as BaseStyles from "homepair-base-styles";
import { StyleSheet } from "react-native";
import { isEmailSyntaxValid, isPasswordValid } from "homepair-helpers";

export type LoginViewDispatchProps = {
  onFetchAccountProfile: (
    username: string,
    password: string,
    modalSetOff: () => any,
    navigationRouteCallback: () => any
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
  username: "",
  password: ""
};

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
    this._clickButton = this._clickButton.bind(this);
    this._clickHighlightedText = this._clickHighlightedText.bind(this);
    this.state = initialState;

    this.props._clickButton(this._clickButton);
    this.props._clickHighlightedText(this._clickHighlightedText);
  }

  /**
   * Sets the state of the modal to hidden and then displays an error message. If none is passed
   * defaults to 'Error Message'
   */
  setModalOff(error: string = "Error Message") {
    this.props._onChangeModalVisibility(false)
    //this.props._showModal(false);
    this.props._setErrorState(true, error);
  }
  navigateMain() {
    this.props.navigation.navigate("Main");
  }

  getFormUsername(childData: string) {
    this.setState({ username: childData });
  }
  getFormPassword(childData: string) {
    this.setState({ password: childData });
  }
  _clickHighlightedText() {
    this.props.navigation.navigate("SignUp");
  }

  _clickButton() {
    this.props._onChangeModalVisibility(true)
    if (!isEmailSyntaxValid(this.state.username)) {
      this.setModalOff("Invalid Username! Must be an email");
    } else if (!isPasswordValid(this.state.password)) {
      this.setModalOff("You have entered an invalid password.");
    } else {
      this.props.onFetchAccountProfile(
        this.state.username,
        this.state.password,
        this.setModalOff,
        this.navigateMain
      );
    }
  }

  inputFormProps(): { [id: string]: InputFormProps } {
    return {
      email: {
        name: signInStrings.inputForms.email,
        parentCallBack: this.getFormUsername,
        formTitleStyle: this.inputFormStyle.formTitle,
        inputStyle: this.inputFormStyle.input
      },
      password: {
        name: signInStrings.inputForms.password,
        parentCallBack: this.getFormPassword,
        formTitleStyle: this.inputFormStyle.formTitle,
        inputStyle: this.inputFormStyle.input,
        secureTextEntry: true
      }
    };
  }

  render() {
    return (
      <>
        <InputForm {...this.inputFormProps().email} />
        <InputForm {...this.inputFormProps().password} />
      </>
    );
  }
}

function setInputStyles(colorTheme?: BaseStyles.ColorTheme) {
  let colors = colorTheme == null ? BaseStyles.LightColorTheme : colorTheme;
  return StyleSheet.create({
    formTitle: {
      marginVertical: "3.5%",
      fontFamily: BaseStyles.FontTheme.primary,
      color: colors.lightGray
    },
    input: {
      alignItems: "center",
      alignSelf: "center",
      margin: BaseStyles.MarginPadding.xsmallConst,
      minWidth: 40,
      width: BaseStyles.ContentWidth.max,
      height: 40,
      color: colors.tertiary,
      borderColor: colors.lightGray,
      borderWidth: 1,
      borderRadius: BaseStyles.BorderRadius.small,
      paddingHorizontal: BaseStyles.MarginPadding.mediumConst
    }
  });
}
