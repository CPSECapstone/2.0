import React from 'react';

import {createBrowserApp} from '@react-navigation/web';
import { createAppContainer, SafeAreaView, withNavigation } from 'react-navigation';
import { createStackNavigator, NavigationStackConfig, NavigationStackOptions } from 'react-navigation-stack';
import {
    MainAppPages, AuthenticationPages,
} from 'homepairs-pages';
import { Platform } from 'react-native';
import { HomePairsHeader, AddNewPropertyModal, EditPropertyModal, LoggingInModal, CreatingAccountModal, EditTenantModal, AddTenantModal} from 'homepairs-components';
import { LightColorTheme} from 'homepairs-base-styles';
import { navigationKeys, navigationPages } from './RouteConstants';

/** Set Up our configuration for the navigation routes */

// First, determine if the platform is web or not, this will determine which type of AppContainer is used  
const isWeb = Platform.OS === 'web';
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
};

const serviceRequestStackConfig = {
    initialRouteName: navigationPages.ServiceRequestScreen,
    ...innerStackConfig,
};
const accountStackConfig = {
    initialRouteName: navigationPages.AccountSettings,
    ...innerStackConfig,
};

/** Define the Navigation Stacks now that our configuration is ready */
const PropertyStack = createStackNavigator(
    {
        [navigationKeys.PropertiesScreen]: MainAppPages.PropertyPages.PropertiesScreen,
        [navigationKeys.TenantProperty]: MainAppPages.PropertyPages.TenantPropertiesScreen,
        [navigationKeys.SingleProperty]: MainAppPages.PropertyPages.DetailedPropertyScreen,
    },
    propertyStackConfig,
);
const ServiceRequestStack = createStackNavigator(
    {
      [navigationKeys.ServiceRequestScreen]: MainAppPages.ServiceRequestPages.ServiceRequestScreen, 
      [navigationKeys.NewRequest]: MainAppPages.ServiceRequestPages.NewRequestScreen,
    }, 
  serviceRequestStackConfig);
const AccountStack = createStackNavigator(
    {
        [navigationKeys.AccountSettings]: MainAppPages.AccountPages.AccountScreen,
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

        // Add all modals here. This way, the page will overlay the entire page including the header
        [navigationKeys.AddNewPropertyModal]: AddNewPropertyModal,
        [navigationKeys.EditPropertyModal]: EditPropertyModal,
        [navigationKeys.EditTenantModal]: EditTenantModal,
        [navigationKeys.AddTenantModal]: AddTenantModal,
    },
    {
        initialRouteName: navigationKeys.Properties,
        ...navigationConfiguration,
    },
);

const AuthStack = createStackNavigator(
    {
        [navigationKeys.LoginScreen]: AuthenticationPages.LoginScreen,
        [navigationKeys.LoggingInModal]: LoggingInModal,
        [navigationKeys.RoopairsLogin]: AuthenticationPages.RoopairsLogin,
        [navigationKeys.RoopairsLoggingInModal]: LoggingInModal,
        [navigationKeys.SignUpScreen]: AuthenticationPages.SignUpScreen,
        [navigationKeys.CreatingAccountModal]: CreatingAccountModal,
    },
    {
        initialRouteName: navigationKeys.LoginScreen,
        ...navigationConfiguration,
    },
);

const container = createStackNavigator(
    {
        [navigationKeys.Main]: MainStack,
        [navigationKeys.Auth]: AuthStack,
    },
    {
        initialRouteName: navigationKeys.Auth,
        headerMode: 'none',
    },
    
);

/** Now We have the root Navigator. We use a differnt type for web since it will be URL/URI based */
export const AppNavigator = isWeb ? createBrowserApp(container): createAppContainer(container);

export { MainStack, AuthStack };
