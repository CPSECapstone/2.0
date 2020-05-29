/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { createStackNavigator, NavigationStackConfig, NavigationStackOptions } from 'react-navigation-stack';
import { Platform, View } from 'react-native';
import { LightColorTheme } from 'homepairs-base-styles';
import { navigationKeys, navigationPages } from 'src/routes';
import { AppState, AccountTypes } from 'homepairs-types';
import { connect } from 'react-redux';
import {
    LoginScreen,
    SignUpScreen,
    RoopairsLogin,
} from './auth-pages';
import {
    NewRequest,
    ServiceRequest,
    Account,
    DetailedProperty,
    Properties,
    TenantProperty,
} from './main-pages';
import { HomePairsHeader } from './nav-header';
import { 
    AddNewPropertyModal, 
    EditPropertyModal, 
    LoggingInModal, 
    CreatingAccountModal, 
    AddApplianceModal, 
    EditApplianceModal, 
    EditTenantModal,
    AddTenantModal,
    ServiceRequestModal,
    AddServiceProviderModal,
    PreferredProviderModal,
} from './modals';

// Add margin offset for Page components 
function offSetForHeader(Offsetted: any){
    const OffSettedComponent = (props:any) => {
        let marginTop = 70;
        marginTop = Platform.OS === 'android' ? 0 : marginTop;
        return <View style={{flex:1, marginTop}}><Offsetted {...props}/></View>;
    };
    return OffSettedComponent;      
};

const NewRequestPage = offSetForHeader(NewRequest);
const ServiceRequestPage = offSetForHeader(ServiceRequest);

const AccountPage = offSetForHeader(Account);
const DetailedPropertyPage = offSetForHeader(DetailedProperty);
const PropertiesPage = offSetForHeader(Properties);
const TenantPropertiesPage = offSetForHeader(TenantProperty);

/** Set Up our configuration for the navigation routes */

// Define the navigation configurations for all of the stacks 
const defaultNavigationOptions: NavigationStackOptions = {
    cardOverlayEnabled: true,
    cardStyle: { 
        backgroundColor: 'rgba(0,0,0,.4)',
     },
    gestureEnabled: false,
    animationEnabled:false,
};

const modalStackConfig: NavigationStackConfig = {
    mode: 'modal',
    headerMode: 'none',
};

const navigationConfiguration = {
    defaultNavigationOptions,
    ...modalStackConfig,
};


const navigationHeader = () => ({
    header: () => {
        return Platform.OS === 'ios' ? (
            <SafeAreaView style={{ backgroundColor: LightColorTheme.primary}}>
                <View style={{height: 1}}>
                    {/* For some reason, need to define a style with a height to get shadow working in iOS */}
                    <HomePairsHeader />
                </View>
            </SafeAreaView>
        ) : <HomePairsHeader />;
    },
    headerStyle: {
        backgroundColor: LightColorTheme.primary,
    },
    headerMode: 'float',
    gestureEnabled: false,
});

const innerStackConfig: any = {
    defaultNavigationOptions: navigationHeader,
    animationEnabled:false,
};

const propertyStackConfig = {
    initialRouteName: navigationPages.PropertiesScreen,
    ...innerStackConfig,
    mode: 'modal',
};

const serviceRequestStackConfig = {
    initialRouteName: navigationPages.ServiceRequestScreen,
    ...innerStackConfig,
    mode: 'modal',
};
const accountStackConfig = {
    initialRouteName: navigationPages.AccountSettings,
    ...innerStackConfig,
    mode: 'modal',
};

/** Define the Navigation Stacks now that our configuration is ready */
const PropertyStack = createStackNavigator(
    {
        [navigationKeys.PropertiesScreen]: PropertiesPage,
        [navigationKeys.TenantProperty]: TenantPropertiesPage,
        [navigationKeys.SingleProperty]: DetailedPropertyPage,
    },
    propertyStackConfig,
);

const ServiceRequestStack = createStackNavigator(
    {
      [navigationKeys.ServiceRequestScreen]: ServiceRequestPage, 
      [navigationKeys.NewRequest]: NewRequestPage,
    }, 
  serviceRequestStackConfig);
  
const AccountStack = createStackNavigator(
    {
        [navigationKeys.AccountSettings]: AccountPage,
    },
  accountStackConfig);


/**
 * If you wish to add a modal to the stack, do so HERE!
 */
const MainStack = createStackNavigator(
    {
        [navigationKeys.Properties]: PropertyStack,
        [navigationKeys.ServiceRequest]: ServiceRequestStack,
        [navigationKeys.Account]: AccountStack,

        [navigationKeys.AddNewPropertyModal]: AddNewPropertyModal,
        [navigationKeys.EditPropertyModal]: EditPropertyModal,
        [navigationKeys.AddApplianceModal]: AddApplianceModal, 
        [navigationKeys.EditApplianceModal]: EditApplianceModal,
        [navigationKeys.EditTenantModal]: EditTenantModal,
        [navigationKeys.AddTenantModal]: AddTenantModal,
        [navigationKeys.ServiceRequestModal]: ServiceRequestModal,
        [navigationKeys.AddServiceProviderModal]: AddServiceProviderModal,
        [navigationKeys.PreferredProviderModal]: PreferredProviderModal,
    },
    {
        initialRouteName: navigationKeys.Properties,
        ...navigationConfiguration,
    },
);

const AuthStack = createStackNavigator(
    {
        [navigationKeys.LoginScreen]: LoginScreen,
        [navigationKeys.RoopairsLogin]: RoopairsLogin,
        [navigationKeys.SignUpScreen]: SignUpScreen,
    },
    {
        initialRouteName: navigationKeys.LoginScreen,
        ...navigationConfiguration,
    },
);

// NOTE: All authentication modals should be defined at the highest parent navigator. This permits the modal to be replaced 
// from any page in the program. It is just safer to define all modals up here. 
const container = createStackNavigator(
    {
        [navigationKeys.Main]: MainStack,
        [navigationKeys.Auth]: AuthStack,
        [navigationKeys.LoginScreen]: LoginScreen,
        [navigationKeys.RoopairsLogin]: RoopairsLogin,
        [navigationKeys.SignUpScreen]: SignUpScreen,
        [navigationKeys.CreatingAccountModal]: CreatingAccountModal,
        [navigationKeys.RoopairsLoggingInModal]: LoggingInModal,
        [navigationKeys.LoggingInModal]: LoggingInModal,
    },
    {
        initialRouteName: navigationKeys.Auth,
        ...navigationConfiguration,
    },
    
);

export const AppNavigator = createAppContainer(container);
export { MainStack, AuthStack};
