import { MainAppStackType } from 'homepairs-types';


export const LOGIN = '/authentication/login';
export const SIGNUP = '/authentication/sign-up';
export const ROOPAIRS_LOGIN = '/authentication/roopairs-login';

export const PROPERTY_LIST = '/admin/properties';
export const TENANT_PROPERTY = '/admin/tenant';
export const PROPERTY = '/admin/property';

export const LOGIN_MODAL = '/authentication/logging-in';
export const CREATE_ACCOUNT_MODAL = '/authentication/creating-account';


/**
 * All keys that can be mapped to any page in the react navigator should 
 * be stored here. This is so there changes to one key can be affect by all
 * files instead of use having to go and individually changing keys. 
 */
export const navigationKeys: {[id:string]: string} = {
    AccountPropertiesStack: 'AccountPropertiesStack',
    AddNewPropertyModal: 'AddNewPropertyModal',
    Loading: 'Loading',
    Main: 'Main',
    Auth: 'Auth',
    AuthStack: 'AuthStack',
    LoadingScreen: 'LoadingScreen',
    PropertiesScreen: 'PropertiesScreen',
    Login: 'Login',
    SignUp: 'SignUp',
    Connect: 'Connect',
    Properties: 'Properties',
    PropertyStack: 'PropertyStack',
    ServiceRequest: 'ServiceRequest',
    ServiceRequestScreen: 'ServiceRequestScreen',
    AccountSettings: 'AccountSettings', 
    Account: 'AccountStack',
    NewRequest: 'NewRequest',
    TenantProperty: 'TenantProperty',
    AccountProperties: 'AccountProperties',
    DetailedProperty: 'DetailedProperty',
    SingleProperty: 'SingleProperty',
    EditPropertyModal: 'EditPropertyModal',
    AddApplianceModal: 'AddApplianceModal', 
    EditApplianceModal: 'EditApplianceModal',


    RoopairsLogin: 'RoopairsLogin',
    RoopairsLoggingInModal: 'RoopairsLoggingInModal',

    SignUpScreen: 'SignUpScreen',
    CreatingAccountModal: 'CreatingAccountModal',

    LoginScreen: 'LoginScreen',
    LoggingInModal: 'LoggingInModal',

    ModalStack: 'ModalStack',

    AddTenantModal: 'AddTenantModal',
    EditTenantModal: 'EditTenantModal',
};

/**
 * These are were all leaves will be stored for quick reference. This should be used when 
 * directly navigating to a page. These leaves should also be stored in the navigationKeys 
 * object as well. 
 */
export const navigationPages = {
    // Property Pages
    PropertiesScreen: PROPERTY_LIST,
    TenantProperty: TENANT_PROPERTY,
    SingleProperty: PROPERTY,
    // Property Stack Modals 
    AddNewPropertyModal: 'AddNewPropertyModal',
    EditPropertyModal: 'EditPropertyModal',
    AddTenantModal: 'AddTenantModal',
    EditTenantModal: 'EditTenantModal',
    AddApplianceModal: 'AddApplianceModal', 
    EditApplianceModal: 'EditApplianceModal',

    // Service Request Pages
    ServiceRequestScreen: 'ServiceRequestScreen',
    NewRequest: 'NewRequest',

    // Account Settings Pages 
    AccountSettings: 'AccountSettings', 

    // Authentication Pages
    LoginScreen: LOGIN,
    RoopairsLogin: ROOPAIRS_LOGIN,
    SignUpScreen: SIGNUP,

    // Authentication Modals
    RoopairsLoggingInModal: LOGIN_MODAL,
    CreatingAccountModal: CREATE_ACCOUNT_MODAL,
    LoggingInModal: LOGIN_MODAL, 

};


export const MainAppStack: Array<MainAppStackType> = [
    {
        title: 'Properties',
        navigate: PROPERTY_LIST,
        key: 'Properties',
        button: 'Add Property',
    },
    {
        title: 'Service Request',
        navigate: navigationPages.ServiceRequestScreen,
        key: 'ServiceRequest',
        button: 'Request Service',
    },
    {
        title: 'Account Settings',
        navigate: navigationPages.AccountSettings,
        key: 'AccountSettings',
    },
    {
        title: 'Log Out',
        navigate: LOGIN,
        key: 'LogOut',
    },
];
