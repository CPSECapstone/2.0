import { connect } from 'react-redux';
import { AccountActions } from 'homepairs-redux-actions';
import {
    withAuthPage,
    AuthPassProps,
    withDarkMode,
    LoggingInModal,
    withModal,
} from 'homepairs-components';
import strings from 'homepairs-strings';
import HomePairColors from 'homepairs-colors';
import { Image, Text, View } from 'react-native';
import { roopairsLogo } from 'homepairs-images';
import React from 'react';
import { withNavigation } from 'react-navigation';
import RoopairsLoginBase , { RoopairsLoginDispatchProps } from './RoopairsLoginBase';

const roopairsSubtitle = (
    <View style={{ flexDirection: 'row' }}>
        <Image
            style={{ width: 60, height: 60, resizeMode: 'contain' }}
            source={roopairsLogo}
        />
        <Text
            style={{
                color: HomePairColors.LightModeColors.roopairs,
                fontSize: 15,
                alignSelf: 'center',
            }}
        >
            Sign into your Roopairs account
        </Text>
    </View>
);

const signInStrings = strings.signInPage;
const authPageParam: AuthPassProps = {
    button: signInStrings.button,
    subtitle: roopairsSubtitle,
    buttonColor: HomePairColors.LightModeColors.roopairs,
    loadingModalText: signInStrings.modal,
    underButtonText: 'Back to Registration? ',
    highlightedText: 'Click Here',
};

const mapDispatchToProps: (dispatch: any) => RoopairsLoginDispatchProps = (
    dispatch: any,
) => ({
    onFetchAccountProfile: (
        username: string,
        password: string,
        modalSetOff: () => any,
        navigationRouteCallback: () => any,
    ) => {
        dispatch(
            AccountActions.fetchAccount(
                username,
                password,
                modalSetOff,
                navigationRouteCallback,
            ),
        );
    },
});

const RoopairsLogin = connect(null, mapDispatchToProps)(RoopairsLoginBase);
const AuthPage = withAuthPage(RoopairsLogin, authPageParam);
const AuthPageWithNav = withNavigation(AuthPage);
const AuthWithModal = withModal(AuthPageWithNav, LoggingInModal);
export default withDarkMode(AuthWithModal);
