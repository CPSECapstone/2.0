import React from 'react';
import {
    Text,
    View,
    Animated,
    StyleSheet,
    TouchableHighlight,
    Image,
} from 'react-native';
import { ThinButtonProps, ThinButton } from 'homepairs-elements';
import { HomePairFonts } from 'homepairs-fonts';
import strings from 'homepairs-strings';
import * as BaseStyles from 'homepairs-base-styles';
import { HomePairsDimensions, Appliance, ApplianceType } from 'homepairs-types';
import { upArrow, downArrow } from 'homepairs-images';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { navigationPages } from '../../Routes/RouteConstants';


export type PanelState = {
    expanded: boolean;
    animation: Animated.Value;
    selectedCategoryIndex: number;
    selectedCategoryString: string;
    minHeight: number;
    maxHeight: number;
};


const initialState: PanelState = {
    expanded: false,
    selectedCategoryIndex: 0,
    selectedCategoryString: 'Choose a Category',
    animation: undefined,
    minHeight: 0,
    maxHeight: 0,
};

type CategoryPanelProps = {
    parentCallBack: (appType: ApplianceType) => any,
};

const categoryStrings = strings.applianceInfo.categories;
const colors = BaseStyles.LightColorTheme;

function setStyles() {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.secondary,
            marginHorizontal: BaseStyles.MarginPadding.large,
            borderRadius: BaseStyles.BorderRadius.small,
            padding: BaseStyles.MarginPadding.large,
            paddingTop: 10,
            paddingBottom: 30,
            width: BaseStyles.ContentWidth.thin,
            alignSelf: 'center',
            borderColor: '#B3C0C2',
            borderWidth: 1,
            overflow: 'hidden',
        },
        titleContainer: {
            flexDirection: 'row',
            backgroundColor: colors.secondary,
            borderBottomColor: colors.veryLightGray,
            borderBottomWidth: 1,
            justifyContent: 'space-between',
            paddingBottom: 15,
        },
        infoRowContainer: {
            alignContent: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            width: BaseStyles.ContentWidth.wide,
            paddingVertical: BaseStyles.MarginPadding.mediumConst,
        },
        titleText: {
            fontSize: BaseStyles.FontTheme.reg,
            fontFamily: HomePairFonts.nunito_regular,
        },
        textContainer: {
            width: BaseStyles.ContentWidth.reg,
            borderBottomColor: colors.veryLightGray,
            paddingBottom: BaseStyles.MarginPadding.mediumConst,
            borderBottomWidth: 1,
        },
        buttonImage: {
            width: 20,
            height: 20,
        },
        body: {
            alignItems: 'center',
            paddingBottom: 35,
            width: '100%',
        },
    });
}

export default class CategoryPanel extends React.Component<CategoryPanelProps, PanelState> {
    styles;

    icons;

    constructor(props: Readonly<CategoryPanelProps>) {
        super(props);
        this.styles = setStyles();
        this.state = {...initialState, animation: new Animated.Value(0)};
        this.toggle = this.toggle.bind(this);
        this.setMaxHeight = this.setMaxHeight.bind(this);
        this.setMinHeight = this.setMinHeight.bind(this);
        this.icons = {
            up: upArrow,
            down: downArrow,
        };
    }

    setMaxHeight(event) {
        this.setState({ maxHeight: event.nativeEvent.layout.height });
    }

    setMinHeight(event) {
        this.setState({ minHeight: event.nativeEvent.layout.height });
    }

    toggle() {
        const { expanded, minHeight, maxHeight, animation } = this.state;
        const initialValue = expanded ? maxHeight + minHeight : minHeight;
        const finalValue = expanded ? minHeight : maxHeight + minHeight;

        this.setState({ expanded: !expanded });

        animation.setValue(initialValue);
        Animated.spring(animation, { toValue: finalValue }).start();
    }

    selectCategory(selected: string) {
        const {parentCallBack} = this.props;
        let appType = ApplianceType.None;
        if (selected === categoryStrings.PLUMBING) {
            appType = ApplianceType.Plumbing;
        } else if (selected === categoryStrings.GA) {
            appType = ApplianceType.GeneralAppliance;
        } else if (selected === categoryStrings.HVAC) {
            appType = ApplianceType.HVAC;
        } else if (selected === categoryStrings.LE) {
            appType = ApplianceType.LightingAndElectric;
        }
        parentCallBack(appType);
        this.setState({selectedCategoryString: selected});
        this.toggle();
    }

    renderBody() {
        return (
            <View style={this.styles.body} onLayout={this.setMaxHeight}>
                <TouchableHighlight 
                    underlayColor="#f1f1f1"
                    onPress={() => this.selectCategory(categoryStrings.PLUMBING)}
                    style={this.styles.infoRowContainer}>
                    <Text style={this.styles.detail}>{categoryStrings.PLUMBING}</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                    underlayColor="#f1f1f1"
                    onPress={() => this.selectCategory(categoryStrings.LE)} 
                    style={this.styles.infoRowContainer}>
                    <Text style={this.styles.detail}>{categoryStrings.LE}</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                    underlayColor="#f1f1f1"
                    onPress={() => this.selectCategory(categoryStrings.HVAC)} 
                    style={this.styles.infoRowContainer}>
                    <Text style={this.styles.detail}>{categoryStrings.HVAC}</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                    underlayColor="#f1f1f1"
                    onPress={() => this.selectCategory(categoryStrings.GA)} 
                    style={this.styles.infoRowContainer}>
                    <Text style={this.styles.detail}>{categoryStrings.GA}</Text>
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        const { up, down } = this.icons;
        const { expanded, animation, selectedCategoryString } = this.state;
        let icon = down;

        if (expanded) {
            icon = up;
        }

        return (
            <Animated.View
                style={[this.styles.container, { height: animation}, {borderColor: expanded ? colors.primary : colors.lightGray}]}
            >
                <View style={this.styles.titleContainer} onLayout={this.setMinHeight}>
                    <Text style={this.styles.titleText}>{selectedCategoryString.toString()}</Text>
                    <TouchableHighlight
                        onPress={this.toggle}
                        underlayColor="#f1f1f1"
                    >
                        <Image style={this.styles.buttonImage} source={icon} />
                    </TouchableHighlight>
                </View>
                {this.renderBody()}
            </Animated.View>
        );
    }
}