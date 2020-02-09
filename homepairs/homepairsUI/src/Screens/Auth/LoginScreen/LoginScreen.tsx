import { connect } from "react-redux";
import { AccountActions } from "homepairs-redux-actions";
import {
  withAuthPage,
  AuthPassProps,
  withDarkMode,
  LoggingInModal,
  withModal,
} from "homepairs-components";
import strings from "homepairs-strings";
import HomePairColors from "res/colors";
import { withNavigation, NavigationSwitchProp } from "react-navigation";
import LoginScreenBase, { LoginViewDispatchProps } from "./LoginScreenBase";


const signInStrings = strings.signInPage;
const authPageParam: AuthPassProps = {
  button: signInStrings.button,
  subtitle: signInStrings.subtitle,
  buttonColor: HomePairColors.LightModeColors.blueButton,
  loadingModalText: signInStrings.modal,
  underButtonText: signInStrings.newUserText,
  highlightedText: signInStrings.signUpHighlight,
};
const mapDispatchToProps : (dispatch: any) => LoginViewDispatchProps = (dispatch: any) => ({
    onFetchAccountProfile: (username: string, password: string, 
        modalSetOff: () => any, navigation: NavigationSwitchProp) => {
        dispatch(AccountActions.fetchAccount(username, password, navigation, modalSetOff));
    },
});

const LoginScreen = connect(null, mapDispatchToProps)(LoginScreenBase);
const AuthPage = withAuthPage(LoginScreen, authPageParam);
const AuthPageWithNav = withNavigation(AuthPage);
const AuthWithModal = withModal(AuthPageWithNav, LoggingInModal);
export default withDarkMode(AuthWithModal);
