import React from 'react';
import { createAppContainer, SafeAreaView, withNavigation } from 'react-navigation';
import { createStackNavigator, NavigationStackConfig, NavigationStackOptions } from 'react-navigation-stack';
import {
    NewRequestScreen,
    ServiceRequestScreen,
    LoginScreen,
    SignUpScreen,
    RoopairsLogin,
    AccountScreen,
    DetailedPropertyScreen,
    PropertiesScreen,
    TenantPropertiesScreen,
} from 'homepairs-pages';
import { Platform } from 'react-native';
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
} from 'homepairs-modals';
import { HomePairsHeader } from 'homepairs-components';
import { LightColorTheme } from 'homepairs-base-styles';
import { navigationKeys, navigationPages } from 'homepairs-routes';

/** Set Up our configuration for the navigation routes */

// Give the homepairs header a navigation object so it can actually change pages as intended
const HomePairsHeaderWithNav = withNavigation(HomePairsHeader);

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


// TODO: Render navigation header for andriod devices!!!
const navigationHeader = () => ({
    header: () => {
        return Platform.OS === 'ios' ? (
            <SafeAreaView style={{ backgroundColor: LightColorTheme.primary, flex: 1 }}>
                <HomePairsHeaderWithNav />
            </SafeAreaView>
        ) : <HomePairsHeaderWithNav />;
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
        [navigationKeys.PropertiesScreen]: PropertiesScreen,
        [navigationKeys.TenantProperty]: TenantPropertiesScreen,
        [navigationKeys.SingleProperty]: DetailedPropertyScreen,

        // [navigationKeys.EditPropertyModal]: EditPropertyModal,
        // [navigationKeys.AddApplianceModal]: AddApplianceModal, 
        // [navigationKeys.EditApplianceModal]: EditApplianceModal,
        // [navigationKeys.EditTenantModal]: EditTenantModal,
        // [navigationKeys.AddTenantModal]: AddTenantModal,
    },
    propertyStackConfig,
);

const ServiceRequestStack = createStackNavigator(
    {
      [navigationKeys.ServiceRequestScreen]: ServiceRequestScreen, 
      [navigationKeys.NewRequest]: NewRequestScreen,

      // [navigationKeys.ServiceRequestModal]: ServiceRequestModal,

    }, 
  serviceRequestStackConfig);
  
const AccountStack = createStackNavigator(
    {
        [navigationKeys.AccountSettings]: AccountScreen,
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

    },
    {
        initialRouteName: navigationKeys.Properties,
        ...navigationConfiguration,
    },
);

const AuthStack = createStackNavigator(
    {
        [navigationKeys.LoginScreen]: LoginScreen,
        // [navigationKeys.LoggingInModal]: LoggingInModal,
        [navigationKeys.RoopairsLogin]: RoopairsLogin,
        // [navigationKeys.RoopairsLoggingInModal]: LoggingInModal,
        [navigationKeys.SignUpScreen]: SignUpScreen,
        // [navigationKeys.CreatingAccountModal]: CreatingAccountModal,
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
