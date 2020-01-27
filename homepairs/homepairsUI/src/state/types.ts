import { Dimensions } from 'react-native';

/* *-------------------Property Types-------------------* */
export type Property = {
<<<<<<< HEAD
    address: string, 
    city: string, 
    state: string,
    tenants : number, 
    bedrooms: number, 
    bathrooms: number,
}
=======
    address: String;
    tenants: number;
    bedrooms: number;
    bathrooms: number;
};
>>>>>>> 6c0abe500170f7c4f80d6b59e196169385a97584

export type PropertyListState = Property[];

export type AddPropertyAction = {
    type: string;
    userData: Property;
};
export type UpdatePropertyAction = {
    type: string;
    index: number;
    userData: Property;
};
export type RemovePropertyAction = {
    type: string;
    index: number;
};

export type FetchPropertyAction = {
    type: string;
    properties: PropertyListState;
};

/* Union type for the Property Lists. This will be used for the reducer. */
export type PropertyListAction =
    | AddPropertyAction
    | UpdatePropertyAction
    | RemovePropertyAction
    | FetchPropertyAction;
/* *-------------------Property Types-------------------* */

/* *-------------------Account Types-------------------* */

export enum AccountTypes {
    Tenant, 
    Landlord
}

export type Account = {
    accountType: AccountTypes;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
<<<<<<< HEAD
    address: string, 
    city: string,
=======
    address: string;
    city: string;
    companyName: string;
    companyType: string;
>>>>>>> 6c0abe500170f7c4f80d6b59e196169385a97584
    roopairsToken: string;
};

export type LandlordAccount = Account & {
    manId: number;
};

export type TenantAccount = Account & {
    propId: number;
    tenantId: number;
};

export type AccountState = LandlordAccount | TenantAccount;

export type FetchUserAccountAction = {
    type: string;
    username: string;
    password: string;
};

export type FetchUserAccountProfileAction = {
    type: string;
    profile: AccountState;
};

export type AccountStateAction =
    | FetchUserAccountProfileAction
    | FetchUserAccountProfileAction;
/* *-------------------Account Types-------------------* */

/* *-------------------Service Types-------------------* */
export type ServiceProvider = {
    // TODO: Define attributes for service Provider
    name: string;
};

export enum ServiceRequestStatus { 
    Pending, 
    Denied, 
    Accepted
}

export enum ServiceStatus {
    NotAccepted,
    Idle,
    InProgress,
    Completed,
    Canceled
}

export type RequestedService = {
    provider: ServiceProvider;
    status: ServiceRequestStatus;
    // TODO: ADD MORE ATTRIBUTES (i.e Date requested, TenantId)
};
export type AcceptedService = {
    provider: ServiceProvider;
    status: ServiceStatus;
    // TODO: ADD MORE ATTRIBUTES
};

export type Service = RequestedService | AcceptedService;

export type ServiceState = {
    requested: RequestedService[];
    accepted: AcceptedService[];
    closed: Service[];
};

export type RequestServiceAction = {
    type: string;
    request: RequestedService;
};

export type AcceptServiceAction = {
    type: string;
    request: RequestedService;
};

export type DenyServiceAction = {
    type: string;
    request: RequestedService;
};

export type CancelServiceAction = {
    type: string;
    service: Service;
};

export type CompleteServiceAction = {
    type: string;
    service: AcceptedService;
};

export type ServiceAction =
    | RequestServiceAction
    | CompleteServiceAction
    | AcceptServiceAction
    | DenyServiceAction
    | CancelServiceAction;
/* *-------------------Service Types-------------------* */

/* *-------------------Header Types-------------------* */
export type MainAppStackType = {
    title: string;
    navigate: string;
    key: string;
    button?: string;
    onButtonClick?: (arg0?: any) => any;
    doesButtonUseNavigate?: boolean;
};

export type Header = {
    showMenu: boolean;
    isDropDown: boolean;
    currentPage: MainAppStackType;
    showBackButton: boolean;
    menu: string[];
};

export type HeaderState = Header;

export type ToggleMenuAction = {
    type: string;
    showMenu: boolean;
};

export type SwitchDropDownNavBarAction = {
    type: string;
    isDropDown: boolean;
};

export type ShowGoBackOnButtonClick = {
    type: string;
    showBackButton: boolean;
};

export type UpdateSelectedPageAction = {
    type: string;
    selected: MainAppStackType;
};

export type HeaderAction =
    | ToggleMenuAction
    | SwitchDropDownNavBarAction
    | ShowGoBackOnButtonClick
    | UpdateSelectedPageAction;
/* *-------------------Header Types-------------------* */

/* *-------------------Setting Types-------------------* */
export type ConfigurationSettings = {
    areNotificationsActive: boolean;
    isDarkModeActive: boolean;
};

export type SettingsState = ConfigurationSettings;

export type ToggleNotificationActivationAction = {
    type: string;
    areNotificationsActive: boolean;
};

export type ToggleDarkModeActivationAction = {
    type: string;
    isDarkModeActive: boolean;
};

export type SettingsActions = ToggleDarkModeActivationAction &
    ToggleNotificationActivationAction;
/* *-------------------Setting Types-------------------* */

/* *-------------------App State-------------------* */
export type AppState = {
    propertyList: PropertyListState;
    accountProfile: AccountState;
    header: HeaderState;
    serviceRequests: ServiceState;
    settings: SettingsState;
    // add future state slices here
<<<<<<< HEAD
}
/**-------------------App State-------------------**/


/**-------------------Misc Types-------------------**/
export enum HomePairsDimensions {
    DROP_MENU_WIDTH = 700,
    MAX_PALLET = 700,
    MIN_PALLET = 360,
    MAX_CONTENT_SIZE = 500,
    MIN_CONTENT_SIZE = 300,
    MAX_BUTTON_WIDTH = 300,
    MIN_BUTTON_WIDTH = 200,
    MIN_PALLET_HEIGHT = Dimensions.get('window').height
}

enum HOMEPAIRS_ACCOUNT_KEYS{
    TYPE = 'accountType',
    PM = 'pm',
    TENANT = 'tenant',
    FIRSTNAME = 'firstName',
    LASTNAME = 'lastName',
    EMAIL = 'email',
    MANID = 'manId',
    PASSWORD = 'password',
    PHONE = 'phone',
    ADDRESS = 'address', 
    CITY = 'city',
    PLACE = 'place', 
    PROPID = 'propId',
    TENANTID = 'tenantID', 
}

enum HOMEPAIRS_LOGIN_STATUS {
    SUCCESS = 'success',
    FAILURE = 'failure',
}

enum HOMEPAIRS_PROPERTY_KEYS {
    ADDRESS = 'address',
    CITY = 'city', 
    STATE = 'state',
    TENANTS = 'maxTenants',
    BEDROOMS = 'numBed',
    BATHROOMS = 'numBath',
}

export enum HomepairsPropertyAttributes{
    ADDRESS = 'address',
    CITY = 'city', 
    state = 'state',
    TENANTS = 'tenants',
    BEDROOMS = 'bedrooms',
    BATHROOMS = 'bathrooms',
}
=======
};
/* *-------------------App State-------------------* */

/* *-------------------Misc Types-------------------* */

export const HomePairsDimensions = {
    DROP_MENU_WIDTH: 700,
    MAX_PALLET: 700,
    MIN_PALLET: 360,
    MAX_CONTENT_SIZE: 500,
    MIN_CONTENT_SIZE: 300,
    MAX_BUTTON_WIDTH: 300,
    MIN_BUTTON_WIDTH: 200,
    MIN_PALLET_HEIGHT: Dimensions.get('window').height,
};

const HOMEPAIRS_ACCOUNT_KEYS = {
    TYPE: 'accountType',
    PM: 'pm',
    TENANT: 'tenant',
    FIRSTNAME: 'firstName',
    LASTNAME: 'lastName',
    EMAIL: 'email',
    MANID: 'manId',
    PASSWORD: 'password',
    PHONE: 'phone',
    ADDRESS: 'address',
    CITY: 'city',
    PLACE: 'place',
    PROPID: 'propId',
    TENANTID: 'tenantID',
    COMPANY_TYPE: 'companyType',
    COMPANY_NAME: 'companyName',
};

const COMPANY_TYPES = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    INDUSTRIAL: 'industrial',
};

const HOMEPAIRS_LOGIN_STATUS = {
    SUCCESS: 'success',
    FAILURE: 'failure',
};

const HOMEPAIRS_PROPERTY_KEYS = {
    ADDRESS: 'address',
    TENANTS: 'maxTenants',
    BEDROOMS: 'numBed',
    BATHROOMS: 'numBath',
};

export const HomepairsPropertyAttributes = {
    ADDRESS: 'address',
    TENANTS: 'tenants',
    BEDROOMS: 'bedrooms',
    BATHROOMS: 'bathrooms',
};
>>>>>>> 6c0abe500170f7c4f80d6b59e196169385a97584

export const HomePairsResponseKeys = {
    DATA: 'data',
    ACCOUNT_KEYS: HOMEPAIRS_ACCOUNT_KEYS,
    PROPERTIES: 'properties',
    PROPERTY_KEYS: HOMEPAIRS_PROPERTY_KEYS,
    ROOPAIRS: 'roopairs',
    STATUS: 'status',
    STATUS_RESULTS: HOMEPAIRS_LOGIN_STATUS,
};

export type DarkModeProperties = {
    isDarkModeActive?: boolean;
};
