/**
 * Here, we will define all endpoints of the different API's that the 
 * application will be connecting to. Any, endpoint that this application will be 
 * using should be put and referenced from this file.  
 */
import axios from 'axios';
import {AsyncStorage} from 'react-native';
import { categoryToString, isNullOrUndefined, stringToCategory } from 'src/utility';
import { NavigationRouteHandler, ChooseMainPage, navigationPages, getAccountType} from 'src/routes';
import * as HomePairsStateActions from 'homepairs-redux-actions';
import { 
    AccountTypes, 
    Account, 
    Property, 
    AddNewPropertyState, 
    EditPropertyState, 
    Appliance, 
    AddApplianceState, 
    NewServiceRequest, 
    ServiceProvider,
    TenantInfo,
    Contact,
    TenantAccount,
} from 'homepairs-types';
import { addGoogleApiKey } from 'src/state/settings/actions';
import {
    HOMEPAIRS_APPLIANCE_ENDPOINT, 
    HOMEPAIRS_LOGIN_ENDPOINT, 
    HOMEPAIRS_PROPERTY_ENDPOINT, 
    HOMEPAIRS_REGISTER_PM_ENDPOINT, 
    HOMEPAIRS_REGISTER_TENANT_ENDPOINT,
    HOMEPAIRS_SERVICEPROVIDER_GET_ENDPOINT,
    HOMEPAIRS_SERVICE_REQUEST_ENDPOINT,
    HOMEPAIRS_TENANT_EDIT_ENDPOINT,
    HOMEPAIRS_PREFERRED_PROVIDER_ENDPOINT,
    GOOGLE_API_KEY,
} from './constants';

const {AccountActions, PropertyListActions, SessionActions, PreferredProviderActions} = HomePairsStateActions;
const {parseAccount} = AccountActions;
const {fetchProperties, fetchPropertyAndPropertyManager, addProperty, updateProperty} = PropertyListActions;
const {setAccountAuthenticationState} = SessionActions;
const {refreshServiceProviders, removeServiceProvider} = PreferredProviderActions;

/* * JSON KEYS * */
const SUCCESS = 'success';
const PM = 'pm';
/* * JSON KEYS * */

const {SingleProperty, ServiceRequestScreen} = navigationPages;

/**
 * ----------------------------------------------------
 * parsePreferredProviders
 * ---------------------------------------------------- 
 * A helper function that takes in a json array that is intended to have the information recieved 
 * from the fetch request for preferred providers. 
 * @param {any[]} preferredServiceProviderJSON -The array of json objects
 */
export const parsePreferredProviders: (preferredServiceProviderJSON: any[]) => ServiceProvider[] = 
(preferredServiceProviderJSON: any[]) => {
    return preferredServiceProviderJSON.map(serviceProvider => {
        const {provId, name, email, phoneNum, prefId,contractLic, skills, 
            founded, rate, timesHired, earliestHire, logo, address} = serviceProvider;
        return {
            provId, name, email, prefId,
            phoneNum, contractLic, skills, 
            founded, payRate: rate, timesHired, 
            earliestHire: isNullOrUndefined(earliestHire) ? undefined : new Date(earliestHire), 
            logo, address,
        };
    });
};

// Grab Google API Key from the database
export const fetchGoogleApiKey = () => {
    return async (dispatch: (func: any) => void) => {
        await axios.get(GOOGLE_API_KEY)
            .then(async (response) => {
                await AsyncStorage.setItem('googleAPIKey', response.data.apikey);
                dispatch(addGoogleApiKey(response.data.apikey));
        }).catch(err => {
            console.log(err);
        });
    };
};


/** 
* ----------------------------------------------------
* fetchPreferredProviders
* ---------------------------------------------------- 
* Makes a get request to the homepairs backend retrieving all preferred provider from the account 
* associatted with the account. This function calls the dispatch method and updates the store 
* upon success.
* 
* @param {string} pmID - The id of the associated account. This is used to by the backend to 
* determine which account needs the specified provider to be removed
*/
export const fetchPreferredProviders = (token: string) => {
    const endpoint = `${HOMEPAIRS_PREFERRED_PROVIDER_ENDPOINT}`;
    console.log(token);
    return async (dispatch: (func: any) => void) => {
        await axios.get(endpoint, {headers: {Token: token}})
        .then(result => {
            console.log(result);
            const {data} = result;
            const {providers} = data;
            const parsedProviders = parsePreferredProviders(providers);
            console.log(parsedProviders);
            dispatch(refreshServiceProviders(parsedProviders as ServiceProvider[]));
            return result;
        })
        .catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
    };
};

/** 
* ----------------------------------------------------
* fetchNetworkProviders
* ---------------------------------------------------- 
* Makes a get request to the homepairs backend retrieving all network providers from the account 
* associatted with the account email. This function calls the dispatch method and updates the store 
* upon success.
* 
* @param {string} accountEmail -The email of the associated account. This is used to by the backend to 
* determine which account needs the specified provider to be removed
*/
export const fetchNetworkProviders = (accountEmail: string) => {
    const endpoint = `${HOMEPAIRS_SERVICEPROVIDER_GET_ENDPOINT}${accountEmail}/`;
    return async (dispatch: (func: any) => void) => {
        await axios.get(endpoint)
        .then(result => {
            const {data} = result;
            const {status, serviceProviders, error} = data;
            if(status === SUCCESS){
                const parsedProviders = parsePreferredProviders(serviceProviders);
                dispatch(refreshServiceProviders(parsedProviders as ServiceProvider[]));
            } else {
                console.log(error);
                return Promise.reject(error);
            } 
            return result;
        })
        .catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
    };
};

/**
 * ----------------------------------------------------
 * postPreferredProvider
 * ---------------------------------------------------- 
 * Makes a post request to the homepairs backend adding a preferred provider from the account 
 * associatted with the account Email. Returns the result of the request upon completion. 
 * 
 * @param {string} pmId  -The id of the associated account. This is used to by the backend to 
 * determine which account needs the specified provider to be added.
 * @param {ServiceProvider} phoneNum - The string used to resolve the provider. Each service provider 
 * will have a unique phone number
 * @param {(error:string) => any} onError -An optional callback function that will handle an error 
 * thrown if the api request fails.
 */
export const postPreferredProvider = async (
    token: string, phoneNum: string,  onError: (error:string) => any = console.log) => {
    console.log(token);
    const endpoint = `${HOMEPAIRS_PREFERRED_PROVIDER_ENDPOINT}`;
    await axios.post(endpoint, {phoneNum}, {headers: {Token: token}})
    .then(response => {
        const {data} = response;
        const {status} = data;
        if (status !== SUCCESS) {
            const {error} = data;
            onError(error);
        }
        return response;
    });
};

 
/**
 * ----------------------------------------------------
 * deletePreferredProvider
 * ---------------------------------------------------- 
 * Makes a delete request to the homepairs backend removing a preferred provider from the account 
 * associatted with the account Email. Returns the result upon completion. This function calls 
 * a dispatch method and removes the service provider from the store upon success and handles the 
 * error upon failure.
 * 
 * @param {string} accountEmail -The email of the associated account. This is used to by the backend to 
 * determine which account needs the specified provider to be removed
 * @param {ServiceProvider} serviceProvider -The object holding in the service provider to be removed
 * @param {(error:string) => any} onError -An optional callback function that will handle an error 
 * thrown if the api request fails
 */
export const deletePreferredProvider = (
    token: string,
    serviceProvider: ServiceProvider, 
    displayError: (error:string) => void,
    navigation: NavigationRouteHandler) => {
    const {prefId} = serviceProvider;
    const endpoint = `${HOMEPAIRS_PREFERRED_PROVIDER_ENDPOINT}`;
    // Simply print the error if no error function was defined, otherwise use the defined function
    return async (dispatch: (func: any) => void) => { 
        console.log(token);
        await axios.delete(endpoint, {data: {prefId}, headers: {Token: token}})
        .then(response => {
            const {data} = response;
            const {status} = data;
            if(status === SUCCESS) {
                dispatch(removeServiceProvider(serviceProvider));
                navigation.resolveModalReplaceNavigation(ServiceRequestScreen);
            } else {
                const {error} = data;
                displayError(error);
            }
        }).catch(error => {
            console.log(error);
        });
    };
};


/**
 * ----------------------------------------------------
 * updateTenant
 * ---------------------------------------------------- 
 * Makes an POST request to the homepairs backend overwriting a tenants information.
 * Upon completion the result of the request is printed to the console.
 * 
 * @param {object} props -List of information used to define the tenant. Expected 
 * information follows: propId, email, firstName, lastName, phoneNumber
 */
export const updateTenant = async (token: string, tenant: TenantInfo & {propId: string},
    displayError: (error:string) => void = console.log) => {
    const {propId, email, firstName, lastName, phoneNumber} = tenant;
    await axios.post(HOMEPAIRS_TENANT_EDIT_ENDPOINT, 
        {email, propId, firstName, lastName, phoneNumber}, {headers: {Token: token}}).then(response =>{
        const {data} = response;
        const {status, error} = data;
        if (status !== SUCCESS){
            displayError(error);
        }
    }).catch(error =>{
        displayError(error.toString());
        throw error;
    });
};

/**
 * ----------------------------------------------------
 * fetchServiceRequests
 * ---------------------------------------------------- 
 * Makes a GET request to the homepairs backend and retrieves as list of service 
 * request objects for a specified property
 * 
 * @param {string} propId -Identity of the the property service request will fetch
 */
export const fetchServiceRequests = async (propId: string, token: string) => {
    const completedEndpoint = `${HOMEPAIRS_SERVICE_REQUEST_ENDPOINT}${propId}/`;
    const results = await axios.get(completedEndpoint, {headers: {Token: token}});
    return results;
};

/**
 * ----------------------------------------------------
 * fetchPropertyAppliancesAndTenants
 * ---------------------------------------------------- 
 * Makes a fetch requests to the homepairs server retrieving the data for the tenants 
 * and appliances related to a specific property. Upon failure, this function will
 * throw an error.
 * 
 * @param propId -Identity of the property to fetch the information from
 */
export const fetchPropertyAppliancesAndTenants = async (propId: string, token: string) => {
    const results = await axios.get(`${HOMEPAIRS_PROPERTY_ENDPOINT}${propId}`, {headers: {Token : token}}).then((result) => {
        console.log(result);
        const {tenants, appliances} = result.data;
        const tenantInfo: TenantInfo[] = [];
        const applianceInfo: Appliance[] = [];

        tenants.forEach(tenant => {
            const {firstName, lastName, email, phoneNumber} = tenant;
            tenantInfo.push({
                firstName,
                lastName,
                email,
                phoneNumber,
            });
        });

        appliances.forEach(appliance => {
            const {appId, category, name, manufacturer, modelNum, serialNum, location} = appliance;

            applianceInfo.push({
                applianceId: appId,
                category: stringToCategory(category), 
                appName: name, manufacturer, modelNum, serialNum, location,
            });
        });

        return {
            tenants: tenantInfo,
            appliances: applianceInfo,
        };

    }).catch(error => console.log(error));
    return results;
};


/**
 * ----------------------------------------------------
 * fetchAccount
 * ----------------------------------------------------
 * Sends a post requests to the homepairs login endpoint. Upon success, this 
 * function will dispatch the parseAccount action and then navigate to a 
 * different page. If not, it will call the the modalSetOffCallBack method if 
 * defined and return to the parent component.
 * 
 * Dispatches to redux store. No need to make it async!!
 * 
 * @param {string} Email -Credential passed to the endpoint
 * @param {string} Password -Credential passed to the endpoint
 * @param {NavigationRouteHandler} navigation -Navigator passed from the component
 * @param {modalSetOffCallBack} modalSetOffCallBack -Optional callback that will close 
 * the calling modal if it exists
 * */
export const fetchAccount = (
    Email: string, Password: string, navigation: NavigationRouteHandler, 
    modalSetOffCallBack: (error?:String) => void = (error: String) => {}) => 
    {
        return async (dispatch: (arg0: any) => void) => {
        await axios.post(HOMEPAIRS_LOGIN_ENDPOINT, {
            email: Email,
            password: Password,
            })
            .then((response) => {
            const {data} = response;
            const {status, role} = data;
            const accountType = getAccountType(data);
            if(status === SUCCESS){
                console.log(data);
                const {token} = data;
                // Set the login state of the application to authenticated
                dispatch(setAccountAuthenticationState(true));
                dispatch(parseAccount(data));
                
                if(role === PM){
                    const {properties, pm} = data;
                    dispatch(fetchProperties(properties));
                    dispatch(fetchPreferredProviders(token));
                } else { // Assume role = tenant
                    const {properties, tenant} = data;
                    const {pm} = tenant;
                    const {email, firstName, lastName} = pm[0];
                    const pmAccountType = AccountTypes.PropertyManager;
                    const pmContact = {accountType:pmAccountType, firstName, lastName, email };
                    dispatch(fetchPropertyAndPropertyManager(properties, pmContact));
                    dispatch(fetchPreferredProviders(token));
                }
                // Navigate page based on the Account Type
                ChooseMainPage(accountType, navigation);
            }else{
                modalSetOffCallBack("Home Pairs was unable to log in. Please try again.");
            }
            })
            .catch((error) => {
                modalSetOffCallBack("Unable to establish a connection with HomePairs servers");
                console.log(error);
            });
        }; 
};

/**
 * ----------------------------------------------------
 * generateAccountForTenant
 * ----------------------------------------------------
 * Takes in information from the component and sends a request to the 
 * homepairs django api. This specifically will generate a tenant account and 
 * then return a response allowing the user access to the API.
 * 
 * Dispatches to redux store. No need to make it async!!
 * 
 * @param {Account} accountDetails -Details passed from user input 
 * @param {String} password - Password input that the user want for their account
 * @param {NavigationPropType} navigation -Navigation prop passed from component
 * @param {modalSetOffCallBack} modalSetOffCallBack - *Optional callback that will close 
 * the calling modal if it exists
 */
export const generateAccountForTenant = (accountDetails: TenantAccount, password: String, 
    navigation: NavigationRouteHandler, modalSetOffCallBack?: (error?:String) => void) => {
    const {firstName, lastName, email, address, phoneNumber} = accountDetails;
    return async (dispatch: (arg0: any) => void) => {
        await axios.post(HOMEPAIRS_REGISTER_TENANT_ENDPOINT, {
          firstName, 
          lastName,
          email, 
          address, 
          password, 
          phoneNumber,
        })
        .then((response) => {
          const {data} = response;
          const {status} = data;
          if(status === SUCCESS){
            dispatch(setAccountAuthenticationState(true));
            dispatch(parseAccount(data));
            /* same as 
               dispatch(fetchProperty(response[responseKeys.DATA][TENANT][responseKeys.PROPERTIES]));
            */
            const {properties, tenant} = response.data;
            const {pm} = tenant;
            const pmInfo = pm[0];
  
            dispatch(fetchPropertyAndPropertyManager(properties, pmInfo));
            ChooseMainPage(AccountTypes.Tenant, navigation);
          } else {
            modalSetOffCallBack("Home Pairs was unable create the account. Please try again.");
          }
        })
        .catch(error => {
          modalSetOffCallBack("Connection to the server could not be established.");
        });
    };
  };
  
  /**
   * ----------------------------------------------------
   * generateAccountForPM
   * ----------------------------------------------------
   * Takes in information from the component and sends a request to the 
   * homepairs django api. This specifically will generate a property 
   * manager account and then return a response allowing the user access 
   * to the API.
   * 
   * Dispatches to redux store. No need to make it async!!
   * 
   * @param {Account} accountDetails - Details passed from user input 
   * @param {String} password - Password input that the user want for their account
   * @param {NavigationPropType} navigation - Navigation prop passed from component
   * @param {modalSetOffCallBack} modalSetOffCallBack - *Optional callback to 
   * close/navigate from the modal
   */
  export const generateAccountForPM = (
      accountDetails: Account, 
      password: String, 
      navigation: NavigationRouteHandler, 
      modalSetOffCallBack?: (error?:String) => void, 
      displayError?: (msg: string) => any) => {
      return async (dispatch: (arg0: any) => void) => {
        await axios.post(HOMEPAIRS_REGISTER_PM_ENDPOINT, {
            firstName: accountDetails.firstName, 
            lastName: accountDetails.lastName,
            email: accountDetails.email, 
            password,
          })
          .then((response) => {
            const {data} = response;
            const {status, properties} = data;
            if(status === SUCCESS){
              dispatch(setAccountAuthenticationState(true));
              dispatch(parseAccount(data));
              dispatch(fetchProperties(properties));
              ChooseMainPage(AccountTypes.PropertyManager, navigation);
            } else {
              displayError(response.data);
              modalSetOffCallBack("Home Pairs was unable create the account. Please try again.");
            }
          })
          .catch((error) => {
            displayError(error);
            modalSetOffCallBack("Connection to the server could not be established.");
          });
      };
  };

  /**
 * ----------------------------------------------------
 * postNewProperty
 * ----------------------------------------------------
 * Sends an request to the homepairs backend attempting to mutate the data of an exisiting property. It takes in
 * the previous property (TODO: Update this to be propId when backend resolves properties from propId) and sends this 
 * data to backend in order for it to resolve which property is to be updated. The intitial state of the component is invoked 
 * and the modal navigates to back to the previous page upon a success. 
 *  
 * Dispatches to redux store. No need to make it async!!
 * 
 * @param {Property} newProperty -Property to add to the homepairs database
 * @param {AddNewPropertyState} info -Information used to indicate the property manager of the property
 * @param {setIntialState} setInitialState -Sets state of calling component to its original state. Should be used for forms
 * @param {onChangeModalVisibility} onChangeModalVisibility -Changes the visibility of the modal of the calling component
 */
export const postNewProperty = (
    newProperty: Property,
    info: AddNewPropertyState,
    displayError: (msg: string) => void = console.log,
) => {
    return async (dispatch: (arg0: any) => void) => {
        await axios
            .post( HOMEPAIRS_PROPERTY_ENDPOINT,
                {
                    longAddress: newProperty.address,
                    numBed: newProperty.bedrooms,
                    numBath: newProperty.bathrooms,
                    maxTenants: newProperty.tenants,
                    pm: info.email,
                    
                },
                {
                    headers: {
                        Token: info.roopairsToken,
                    },
                },
            )
            .then(response => {
                const {data} = response;
                const {status, propId} = data;
                if ( status === SUCCESS ) {
                    const newProp : Property = {
                      propId,
                      address: newProperty.address,
                      bedrooms: newProperty.bedrooms, 
                      bathrooms: newProperty.bathrooms, 
                      tenants: newProperty.tenants,
                    };
                    dispatch(addProperty(newProp));
                } else {
                    const {error} = data;
                    displayError(error);
                }
            })
            .catch(error => console.log(error));
    };
};

/**
 * ----------------------------------------------------
 * postUpdatedProperty
 * ----------------------------------------------------
 * Sends a request to the homepairs API to update a selected property. On success,
 * it updates the redux-store and invokes a callback intended to close the modal
 * of the calling component. Upon failure, an error message should be sent.
 * 
 * Dispatches to redux store. No need to make it async!!
 * 
 * @param {Property} editProperty -Contents of the property to be updated
 * @param {EditPropertyState} info -Information passed to the api to help determine which property in the
 * servers to update
 * @param {onChangeModalVisibility} onChangeModalVisibility -Changes the visibility of the modal
 * of the calling component
 */
export const postUpdatedProperty = (
    editProperty: Property,
    info: EditPropertyState,
    displayError: (msg: string) => void,
) => {
    return async (dispatch: (arg0: any) => void) => {
        return axios
            .put(HOMEPAIRS_PROPERTY_ENDPOINT,
                {
                  propId: editProperty.propId,
                  longAddress: editProperty.address,
                  numBed: editProperty.bedrooms,
                  numBath: editProperty.bathrooms,
                  maxTenants: editProperty.tenants,
                  pm: info.email,
                  
                },
                {
                    headers: {
                        Token : info.roopairsToken,
                    },
                },
            )
            .then(response => {
                const {data} = response;
                const {status} = data;
                if ( status === SUCCESS) {
                    dispatch(updateProperty(editProperty));
                } else {
                    const {error} = data;
                    displayError(error);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
};

/**
 * Callback is intended to set the input forms of the component used to send
 * the request back to the base values. This could be empty or predetermined.
 * @callback setInitialState */
/**
 * Callback is intended to change the state of a modal of the calling component
 * after the request has been sent. This should be optional.
 * @callback onChangeModalVisibility
 * @param {boolean} check -Determines if the components modal should be visible */

// make docs
export const postNewAppliance = async (
    newAppliance: Appliance,
    displayError: (msg: string) => void,
    info: AddApplianceState,
) => {
    await axios
        .post(HOMEPAIRS_APPLIANCE_ENDPOINT,
            {
                propId: info.property.propId,
                name: newAppliance.appName, 
                manufacturer: newAppliance.manufacturer, 
                category: categoryToString(newAppliance.category),
                modelNum: newAppliance.modelNum, 
                serialNum: newAppliance.serialNum, 
                location: newAppliance.location, 
            },
            {
                headers: {
                    Token: info.token,
                },
            },
        )
        .then(response => {
            const {data} = response;
            const {status} = data;
            if (status !== SUCCESS) {
                const {error} = data;
                displayError(error);
                throw Error(error);
            }
        })
        .catch(error => console.log(error));
};

/**
 * ----------------------------------------------------
 * postUpdatedProperty
 * ----------------------------------------------------
 * Sends a request to the homepairs API to update a selected property. On success,
 * it updates the redux-store and invokes a callback intended to close the modal
 * of the calling component. Upon failure, an error message should be sent.
 * @param {Property} editProperty -contents of the property to be updated
 * @param {EditPropertyState} info -information passed to the api to help 
 * determine which property in the servers to update
 * @param {onChangeModalVisibility} onChangeModalVisibility -changes the 
 * visibility of the modal of the calling component
 */
export const postUpdatedAppliance = async (
    token: string,
    propId: string,
    editAppliance: Appliance,
    displayError: (msg: string) => void,
) => {
        await axios
            .put( HOMEPAIRS_APPLIANCE_ENDPOINT,
                {
                    appId: editAppliance.applianceId,
                    newName: editAppliance.appName, 
                    newManufacturer: editAppliance.manufacturer, 
                    newCategory: categoryToString(editAppliance.category),
                    newModelNum: editAppliance.modelNum, 
                    newSerialNum: editAppliance.serialNum, 
                    newLocation: editAppliance.location,
                },
                {
                    headers: {
                        Token: token,
                    },
                },
            )
            .then(response => {
                const {data} = response;
                const {status} = data;
                if (status !== SUCCESS) {
                    const {error} = data;
                    displayError(error);
                    throw Error(error);
                }
            })
            .catch(error => console.log(error));
};

/**
* ----------------------------------------------------
 * postNewServiceRequest
 * ----------------------------------------------------
 * @param newServiceRequest 
 * @param displayError 
 * @param navigation 
 * @param isPm 
 */
export const postNewServiceRequest = async (
    newServiceRequest: NewServiceRequest, 
    displayError: (msg: string) => void, 
    navigation: NavigationRouteHandler,
    isPm: boolean,
) => {
        await axios
        .post(HOMEPAIRS_SERVICE_REQUEST_ENDPOINT, 
        {
            propId: newServiceRequest.propId, 
            phoneNumber : newServiceRequest.phoneNumber,
            appId: newServiceRequest.appId, 
            provId: newServiceRequest.providerId, 
            serviceType: newServiceRequest.serviceType,
            serviceCategory: newServiceRequest.serviceCategory, 
            serviceDate: newServiceRequest.serviceDate, 
            details: newServiceRequest.details,
            poc: newServiceRequest.poc, 
            pocName: newServiceRequest.pocName,
            isPm,
        }, 
        {
            headers: {
                Token: newServiceRequest.token,
            },
        })
        .then(response => {
            console.log(response);
            const {data} = response;
            const {status} = data;
            if (status === SUCCESS) {
                navigation.resolveModalReplaceNavigation(ServiceRequestScreen);
            } else {
                const {error} = data;
                console.log(error);
                displayError(error);
            }
        }).catch(error => {
            console.log(error);
        });
};


// For accepting or denying a service request from the PM perspective
export const changeServiceRequestStatus = async (
    status: string,
    reqId: number,
    token: string,
    navigation: NavigationRouteHandler,
    ) => {
        await axios.put(HOMEPAIRS_SERVICE_REQUEST_ENDPOINT, { reqId, status}, {headers: {Token: token}})
        .then((response) => {
            if (response.data.status === "success") {
                navigation.resolveModalReplaceNavigation(ServiceRequestScreen);
                setTimeout(() => navigation.reload(), 1000);
            }
        })
        .catch(err => console.log(err));

};