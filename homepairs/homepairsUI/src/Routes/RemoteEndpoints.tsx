/**
 * Here, we will define all endpoints of the different API's that the 
 * application will be connecting to. Any, endpoint that this application will be 
 * using should be put and referenced from this file.  
 */
import axios from 'axios';

export const HOMEPAIRS_LOGIN_ENDPOINT = 'https://homepairs-mytest.herokuapp.com/login/';
export const HOMEPAIRS_REGISTER_TENANT_ENDPOINT = 'https://homepairs-mytest.herokuapp.com/tenant/register/';
export const HOMEPAIRS_REGISTER_PM_ENDPOINT = 'https://homepairs-mytest.herokuapp.com/pm/register';

export const HOMEPAIRS_PROPERTY_ENDPOINT = 'https://homepairs-mytest.herokuapp.com/property/';
export const HOMEPAIRS_APPLIANCE_ENDPOINT = 'https://homepairs-mytest.herokuapp.com/appliance/';
export const HOMEPAIRS_TENANT_EDIT_ENDPOINT = "https://homepairs-mytest.herokuapp.com/tenant/update/";

export const HOMEPAIRS_SERVICE_REQUEST_ENDPOINT = 'https://homepairs-mytest.herokuapp.com/servicerequest/';


export const updateTenant = async ({...props}) => {
    const {propId, email, firstName, lastName} = props;
    await axios.post(HOMEPAIRS_TENANT_EDIT_ENDPOINT, {email, propId, firstName, lastName}).then((result) =>{
        console.log(result);
    }).catch(error =>{
        console.log(error);
    });
};

export const fetchServiceRequests = async (propId: string) => {
    const completedEndpoint = `${HOMEPAIRS_SERVICE_REQUEST_ENDPOINT}${propId}/`;
    console.log(completedEndpoint);
    const results = await axios.get(completedEndpoint);
    return results;
};