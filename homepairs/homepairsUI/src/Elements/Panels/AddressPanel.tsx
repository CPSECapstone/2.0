import React from 'react';
import {
    Text,
    View,
    Animated,
    StyleSheet,
    TouchableHighlight,
    Image,
} from 'react-native';
import { HomePairFonts } from 'homepairs-fonts';
import * as BaseStyles from 'homepairs-base-styles';
import { upArrow, downArrow } from 'homepairs-images';
import {Property} from 'homepairs-types';


export type PanelState = {
    expanded: boolean;
    animation: Animated.Value;
    selectedIndex: number;
    selectedString: string;
    minHeight: number;
    maxHeight: number;
    clicked: boolean;
};


const initialState: PanelState = {
    expanded: false,
    selectedIndex: 0,
    selectedString: 'Choose an Address',
    animation: undefined,
    minHeight: 0,
    maxHeight: 0,
    clicked: false,
};

type PanelProps = {
    properties: Property[],
    parentCallBack: (child: string, propId: string) => any
};

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

export default class ApplianceCategoryPanel extends React.Component<PanelProps, PanelState> {
    styles;

    icons;

    constructor(props: Readonly<PanelProps>) {
        super(props);
        this.styles = setStyles();
        this.state = {...initialState, 
            animation: new Animated.Value(0)};
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

    selectAddress(property: Property) {
        const {parentCallBack} = this.props;
        parentCallBack(property.address, property.propId);
        this.setState({
            selectedString: property.address, 
            clicked: true,
        });
        this.toggle();
    }

    renderBody() {
        const {properties} = this.props;
        return (
            <View style={this.styles.body} onLayout={this.setMaxHeight}>
                <>{properties.map((property) => 
                    <TouchableHighlight 
                        testID='click-plumbing'
                        underlayColor="#f1f1f1"
                        onPress={() => this.selectAddress(property)}
                        style={this.styles.infoRowContainer}>
                        <Text style={this.styles.detail}>{property.address}</Text>
                    </TouchableHighlight>)}</>
            </View>
        );
    }

    render() {
        const { up, down } = this.icons;
        const { expanded, animation, selectedString, clicked } = this.state;
        let icon = down;
        if (expanded) {
            icon = up;
        }

        return clicked ? 
            (
                <View style={{alignSelf: 'center', width: BaseStyles.ContentWidth.reg}}>
                    <Text style={this.styles.titleText}>{selectedString}</Text>
                </View>
            ) : (<Animated.View
                    style={[this.styles.container, { height: animation}, {borderColor: expanded ? colors.primary : colors.lightGray}]}>
                    <View style={this.styles.titleContainer} onLayout={this.setMinHeight}>
                        <Text style={this.styles.titleText}>{selectedString}</Text>
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