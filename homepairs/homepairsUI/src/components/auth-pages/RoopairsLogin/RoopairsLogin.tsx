import { connect } from 'react-redux';
import strings from 'homepairs-strings';
import HomePairColors from 'homepairs-colors';
import { Image, Text, View } from 'react-native';
import { roopairsLogo } from 'homepairs-images';
import React from 'react';
import { fetchAccount, fetchGoogleApiKey } from 'homepairs-endpoints';
import { prepareNavigationHandlerComponent } from 'src/routes';
import { RoopairsLoginBase, RoopairsLoginDispatchProps } from './RoopairsLoginBase';
import {
    AuthPassProps,
    withAuthPage,
} from '../AuthPage/WithAuthPage';

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
    onFetchAccount: (username: string,password: string,navigation,modalSetOff: () => any) => 
    {
        dispatch(fetchGoogleApiKey());
        dispatch(fetchAccount( username, password, navigation, modalSetOff));
    },
});

const RoopairsLogin = connect(null, mapDispatchToProps)(RoopairsLoginBase);
const NavigableAuthPage = prepareNavigationHandlerComponent(RoopairsLogin);
const AuthPage = withAuthPage(NavigableAuthPage, authPageParam);

export default AuthPage;
