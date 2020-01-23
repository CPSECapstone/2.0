import { connect } from "react-redux";
import RoopairsLoginBase from "./RoopairsLoginBase";
import { AccountActions } from "homepair-redux-actions";
import { RoopairsLoginDispatchProps } from "./RoopairsLoginBase";
import {
  withAuthPage,
  AuthPassProps,
  withDarkMode,
  withModal,
  LoginLoadingModal
} from "homepair-components";
import strings from "homepair-strings";
import HomePairColors from "homepair-colors";
import { Image, Text, View } from "react-native";
import { roopairsLogo } from "homepair-images";
import React from "react";
import { withNavigation } from 'react-navigation';

const roopairsSubtitle = (
  <View style={{ flexDirection: "row" }}>
    <Image
      style={{ width: 60, height: 60, resizeMode: "contain" }}
      source={roopairsLogo}
    />
    <Text
      style={{
        color: HomePairColors.LightModeColors.roopairs,
        fontSize: 15,
        alignSelf: "center"
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
  underButtonText: "Back to Registration? ",
  highlightedText: "Click Here"
};

const mapDispatchToProps: (dispatch: any) => RoopairsLoginDispatchProps = (
  dispatch: any
) => ({
  onFetchAccountProfile: (
    username: string,
    password: string,
    type: string,
    modalSetOff: () => any,
    navigationRouteCallback: () => any
  ) => {
    dispatch(
      AccountActions.fetchAccount(
        username,
        password,
        modalSetOff,
        navigationRouteCallback
      )
    );
  }
});

const ReduxRoopairsLogin = connect(null, mapDispatchToProps)(RoopairsLoginBase);
const NavigationAuthPage = withNavigation(ReduxRoopairsLogin)
const FormattedComponent = withAuthPage(NavigationAuthPage, authPageParam);
const ComponentWithModal = withModal(FormattedComponent, LoginLoadingModal);
export default withDarkMode(ComponentWithModal);
