import { connect } from "react-redux";
import LoginScreenBase from './LoginScreenBase';
import { AccountActions } from 'homepair-redux-actions';
import { LoginViewDispatchProps } from './LoginScreenBase';
import {withAuthPage, AuthPassProps, withDarkMode } from 'homepair-components'
import strings from 'homepair-strings'
import HomePairColors from 'homepair-colors';

const signInStrings = strings.signInPage
const authPageParam : AuthPassProps  = {
    button: signInStrings.button,
    subtitle: signInStrings.subtitle,
    buttonColor: HomePairColors.LightModeColors.blueButton,
    loadingModalText: signInStrings.modal,
    underButtonText: signInStrings.newUserText,
    highlightedText: signInStrings.signUpHighlight,
}
const mapDispatchToProps : (dispatch: any) => LoginViewDispatchProps = (dispatch: any) => ({
    onFetchAccountProfile: (username: string, password: string, 
        modalSetOff: () => any, navigation: any) => {
        dispatch(AccountActions.fetchAccount(username, password, navigation, modalSetOff));
    },
});

const LoginScreen = connect(
    null, 
    mapDispatchToProps)(LoginScreenBase);
const AuthPage = withAuthPage(LoginScreen, authPageParam);
export default withDarkMode(AuthPage)