import React, { ReactElement } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { HomePairFonts } from "homepair-fonts";

/**To pass types into a component like so:
   *      <View>
   *          <Text>Text Me!</Text>
   *      </View>
   * the ReactPropTypes must be a property of the component. The
   * call these props somewher in your reander like so:
   *      {props.children}
   * This will render all children passed into the component.
   */
export type CardProps = {
  children?: ReactElement[] | ReactElement;
  containerStyle?: {};
  wrapperStyle?: {};
  title?: String;
  titleStyle?: {};
  subtitle?: String;
  subtitleStyle?: {};
  titleContainerStyle?: {};
  closeButtonStyle?: {};
  showCloseButton?: Boolean;
  closeButtonPressedCallBack?: (arg0?: any) => any;
};

export default function Card(props: CardProps) {
  const containerStyle =
    props.containerStyle == null
      ? defaultStyles.container
      : props.containerStyle;
  const titleStyle =
    props.titleStyle == null ? defaultStyles.title : props.titleStyle;
  const subtitleStyle =
    props.subtitleStyle == null ? defaultStyles.subtitle : props.subtitleStyle;
  const titleContainerStyle =
    props.titleContainerStyle == null
      ? defaultStyles.titleContainer
      : props.titleContainerStyle;
  const wrapperStyle =
    props.wrapperStyle == null ? defaultStyles.wrapper : props.wrapperStyle;
  const closeButtonStyle =
    props.closeButtonStyle == null
      ? defaultStyles.closeButton
      : props.closeButtonStyle;

  function renderCloseButton() {
    if (props.showCloseButton) {
      return (
        <TouchableOpacity
          style={defaultStyles.closeButtonContainer}
          onPress={props.closeButtonPressedCallBack}
        >
          <View style={defaultStyles.closeButtonWrapper}>
            <Text style={closeButtonStyle}>X</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return <></>;
  }

  function renderSubtitle() {
    if (props.subtitle == null) return <></>;
    else {
      return <Text style={subtitleStyle}>{props.subtitle}</Text>;
    }
  }

  function renderTitle() {
    if (props.title == null) return <></>;
    else {
      return (
        <View style={defaultStyles.generalIndexContainer}>
          <View style={titleContainerStyle}>
            <Text style={titleStyle}>{props.title}</Text>
            {renderSubtitle()}
          </View>
        </View>
      );
    }
  }

  return (
    <View style={containerStyle}>
      {renderCloseButton()}
      {renderTitle()}
      <View style={wrapperStyle}>{props.children}</View>
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: "5%",
    borderRadius: 7,
    shadowColor: "black",
    shadowRadius: 20,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 100,
    elevation: 9
  },
  generalIndexContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    flex: 1
  },
  title: {
    color: "#00ADE9",
    fontFamily: "nunito-regular",
    fontSize: 32,
    alignSelf: "center"
  },
  subtitle: {
    color: "#00ADE9",
    fontFamily: "nunito-regular",
    fontSize: 20,
    alignSelf: "center"
  },
  titleContainer: {
    width: "95%",
    borderBottomColor: '#AFB3B5',
    paddingVertical: 5,
    borderBottomWidth: 1,
    alignSelf: "center",
    justifyContent: "center"
  },
  wrapper: {
    width: "95%",
    marginVertical: 20,
    alignSelf: "center",
    justifyContent: "center"
  },
  closeButton: {
    fontSize: 20,
    color: '#AFB3B5',
    fontFamily: HomePairFonts.nunito_regular,
    alignSelf: "center"
  },
  closeButtonContainer: {
    alignSelf: "flex-end",
    justifyContent: "center",
    paddingHorizontal: "2.5%",
    paddingVertical: "5%",
    maxHeight: 40,
    marginHorizontal: "5%",
    position: "absolute",
    zIndex: 1 //Needed for absolution position within TouchableOpacity
  },
  titleCloseButtonContainer: {
    flex: 1,
    flexDirection: "column"
  },
  closeButtonWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center"
  }
});
