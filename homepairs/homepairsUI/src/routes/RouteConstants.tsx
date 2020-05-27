import { MainAppStackType } from 'homepairs-types';

export const LOGIN = 'LoginScreen';
export const SIGNUP = 'SignUp';
export const ROOPAIRS_LOGIN = 'RoopairsLogin';
export const LOGIN_MODAL = 'LoggingInModal';
export const CREATE_ACCOUNT_MODAL = 'CreatingAccountModal';
export const ROOPAIRS_LOGIN_MODAL = 'RoopairsLoggingInModal';

export const PROPERTY_LIST = 'PropertiesScreen';
export const TENANT_PROPERTY = 'TenantProperty';
export const PROPERTY = 'SingleProperty';

export const ADD_PROPERTY_MODAL = 'AddNewPropertyModal';
export const EDIT_PROPERTY_MODAL = 'EditPropertyModal';
export const ADD_TENANT_MODAL = 'AddTenantModal';
export const EDIT_TENANT_MODAL = 'EditTenantModal';
export const ADD_APPLIANCE_MODAL = 'AddApplianceModal';
export const EDIT_APPLIANCE_MODAL = 'EditApplianceModal';


export const SERVICE_REQUEST = 'ServiceRequestScreen';
export const NEW_SERVICE_REQUEST = 'NewRequest';
export const SERVICE_REQUEST_INFO_MODAL = 'ServiceRequestModal';
export const ADD_SERVICE_PROVIDER_MODAL = 'AddServiceProviderModal';
export const PREFERRED_PROVIDER_MODAL = 'PreferredProviderModal';

export const ACCOUNT_SETTINGS = 'AccountSettings';

export const navigationPages = {
    // Property Pages
    PropertiesScreen: 'PropertiesScreen',
    TenantProperty: 'TenantProperty',
    SingleProperty: 'SingleProperty',

    // Property Stack Modals 
    AddNewPropertyModal: 'AddNewPropertyModal',
    EditPropertyModal: 'EditPropertyModal',
    AddTenantModal: 'AddTenantModal',
    EditTenantModal: 'EditTenantModal',
    AddApplianceModal: 'AddApplianceModal', 
    EditApplianceModal: 'EditApplianceModal',
    AddServiceProviderModal: 'AddServiceProviderModal',
    PreferredProviderModal: 'PreferredProviderModal',

    // Service Request Pages
    ServiceRequestScreen: 'ServiceRequestScreen',
    NewRequest: 'NewRequest',
    ServiceRequestModal: 'ServiceRequestModal',

    // Account Settings Pages 
    AccountSettings: 'AccountSettings', 

    // Authentication Pages
    LoginScreen: 'LoginScreen',
    RoopairsLogin: 'RoopairsLogin',
    SignUpScreen: 'SignUpScreen',

    // Authentication Modals
    RoopairsLoggingInModal: 'RoopairsLoggingInModal',
    CreatingAccountModal: 'CreatingAccountModal',
    LoggingInModal: 'LoggingInModal', 

};

/**
 * All keys that can be mapped to any page in the react navigator should 
 * be stored here. This is so there changes to one key can be affect by all
 * files instead of use having to go and individually changing keys. 
 */
export const navigationKeys: {[id:string]: string} = {
    ...navigationPages,

    AccountPropertiesStack: 'AccountPropertiesStack',
    Loading: 'Loading',
    Main: 'Main',
    Auth: 'Auth',
    AuthStack: 'AuthStack',
    LoadingScreen: 'LoadingScreen',
    Login: 'Login',
    SignUp: 'SignUp',
    Connect: 'Connect',
    Properties: 'Properties',
    PropertyStack: 'PropertyStack',
    ServiceRequest: 'ServiceRequest',
    Account: 'AccountStack',
    AccountProperties: 'AccountProperties',
    DetailedProperty: 'DetailedProperty',

    ModalStack: 'ModalStack',
};



/* * Indices used to reference the MainAppStack * */
export const NOMAP_INDEX = -1;
export const HOME_INDEX = 0;
export const SERVICE_INDEX = 1;
export const SETTING_INDEX = 2;
export const LOGOUT_INDEX = 3;



export const MainAppStack: MainAppStackType[] = [
    {
        title: 'My Properties',
        navigate: navigationPages.PropertiesScreen,
        button: 'Add Property',
    },
    {
        title: 'Service Request',
        navigate: navigationPages.ServiceRequestScreen,
        button: 'Request Service',
    },
    {
        title: 'Account Settings',
        navigate: navigationPages.AccountSettings,
    },
    {
        title: 'Log Out',
        navigate: navigationPages.LoginScreen,
    },
];

export const MainAppStackTenant: MainAppStackType[] = [
    {
        title: 'My Home',
        navigate: TENANT_PROPERTY,
    },
    {
        title: 'Service Request',
        navigate: navigationPages.ServiceRequestScreen,
        button: 'Request Service',
    },
    {
        title: 'Log Out',
        navigate: navigationPages.LoginScreen,
    },
];
