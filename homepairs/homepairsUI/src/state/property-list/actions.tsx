import {
    AddPropertyAction,
    UpdatePropertyAction,
    RemovePropertyAction,
    FetchPropertiesAction,
    Property,
    HomePairsResponseKeys,
    SetSelectedPropertyAction,
    FetchPropertyAndPropertyManagerAction,
    AccountTypes,
    Contact,
    PropertyDict,
    TenantInfo,
    Appliance,
    StorePropertyApplianceAndTenantAction,
} from '../types';

const propertyKeys = HomePairsResponseKeys.PROPERTY_KEYS;
const accountKeys = HomePairsResponseKeys.ACCOUNT_KEYS;

/**
 * ----------------------------------------------------
 * Property List Action Types
 * ----------------------------------------------------
 * A enumeration of values used to help the reducer distinguish between
 * the different changes it should make to the store. Every potential
 * mutation to the Property List Store should contain a unique value
 * in.
 */
export enum PROPERTY_LIST_ACTION_TYPES {
  ADD_PROPERTY = 'PROPERTY_LIST/ADD_PROPERTY',
  REMOVE_PROPERTY = 'PROPERTY_LIST/REMOVE_PROPERTY',
  UPDATE_PROPERTY = 'PROPERTY_LIST/UPDATE_PROPERTY',
  FETCH_PROPERTY = 'PROPERTY_LIST/FETCH_PROPERTY',
  FETCH_PROPERTY_AND_PROPERTY_MANAGER = 'PROPERTY_LIST/FETCH_PROPERTY_AND_PROPERTY_MANAGER',
  FETCH_PROPERTIES = 'PROPERTY_LIST/FETCH_PROPERTIES',
  SET_SELECTED_PROPERTY = 'PROPERTY_LIST/SET_SELECTED_PROPERTY',
  UPDATE_TENANT = 'PROPERTY_LIST/UPDATE_TENANT',
  STORE_APPLIANCES_AND_TENANTS = 'PROPERTY_LIST/STORE_APPLIANCES_AND_TENANTS' 
}

/**
 * ----------------------------------------------------
 * setSelectedProperty
 * ----------------------------------------------------
 * Action whom indicates to the reducer what property is currently selected
 * to be viewed by the user. This is set to null//undefined if none is currently
 * being view
 * @param {number} index -position of the property in the array of the state
 */
export const setSelectedProperty = (propId: string): SetSelectedPropertyAction => {
  // Set the store the selectedProperty in the local state for useage after the app falls asleep
  return {
    type: PROPERTY_LIST_ACTION_TYPES.SET_SELECTED_PROPERTY,
    propId,
  };
};

/**
 * ----------------------------------------------------
 * addProperty
 * ----------------------------------------------------
 * Action used to add a property to the store. This should be called after postNewProperty
 * @param {Property} newProperty -property that has been added to the database
 * waiting to be added to the store
 */
export const addProperty = (newProperty: Property): AddPropertyAction => {
  return {
    type: PROPERTY_LIST_ACTION_TYPES.ADD_PROPERTY,
    userData: newProperty,
  };
};

/**
 * ----------------------------------------------------
 * updateProperty
 * ----------------------------------------------------
 * Action intended to mutate a specified property after it has been updated
 * in the homepairs servers. Should be called after postUpdatedProperty.
 * @param {number} propertyIndex -location of the updated property in the redux-store
 * @param {Property} updatedProperty -the new contents of the selected property
 */
export const updateProperty = (updatedProperty: Property): UpdatePropertyAction => {
  return {
    type: PROPERTY_LIST_ACTION_TYPES.UPDATE_PROPERTY,
    propId: updatedProperty.propId,
    userData: updatedProperty,
  };
};

/**
 * ----------------------------------------------------
 * removeProperty
 * ----------------------------------------------------
 * Action intended to remove a Property from the list of managed properties
 * for a pm. TODO: create a function that removes a property from the database
 * @param {number} propertyIndex -location of the property to remove from the store
 */
export const removeProperty = (
  propertyIndex: string,
): RemovePropertyAction => ({
  type: PROPERTY_LIST_ACTION_TYPES.REMOVE_PROPERTY,
  propId: propertyIndex,
});

/**
 * ----------------------------------------------------
 * fetchPropertyManager
 * ----------------------------------------------------
 * Function used to extract a single property and its owner from fetching an account profile. 
 * This should be called after generating a new account or authentication for specifically
 * Tenants 
 * @param {Contact} linkedPropertyManager -Property Manager recieved from the homepairs servers  
 */
export const fetchPropertyAndPropertyManager = (linkedProperties: Property[], linkedPropertyManager: Contact): FetchPropertyAndPropertyManagerAction => {
  const linkedProperty = linkedProperties[0];
  const fetchedPropertyManager: Contact = {
    email: linkedPropertyManager[accountKeys.EMAIL],
    firstName: linkedPropertyManager[accountKeys.FIRSTNAME],
    lastName: linkedPropertyManager[accountKeys.LASTNAME],
    accountType: AccountTypes.PropertyManager,
  };

  const fetchedProperties: PropertyDict = {};
  const fetchedProperty = {
    propId: linkedProperty[propertyKeys.PROPERTYID],
    address: linkedProperty[propertyKeys.ADDRESS],
    tenants: linkedProperty[propertyKeys.TENANTS],
    bedrooms: linkedProperty[propertyKeys.BEDROOMS],
    bathrooms: linkedProperty[propertyKeys.BATHROOMS],
  };

  fetchedProperties[fetchedProperty.propId] = fetchedProperty;
  return {
    type: PROPERTY_LIST_ACTION_TYPES.FETCH_PROPERTY_AND_PROPERTY_MANAGER,
    property: fetchedProperties,
    propertyManager: fetchedPropertyManager,
  };
};

/**
 * ----------------------------------------------------
 * fetchProperties
 * ----------------------------------------------------
 * Function used to extract an array of properties from the fetching of an account profile.
 * This should be called after generating a new account or authentication for specifically
 * PROPERTY MANAGERS
 * @param linkedProperties -Array of objects that contain the data for properties
 */
export const fetchProperties = (linkedProperties: Array<any>): FetchPropertiesAction => {
  const fetchedProperties: PropertyDict = {};
  linkedProperties?.forEach(linkedProperty => {
    const parsedProperty: Property = {
      propId: linkedProperty[propertyKeys.PROPERTYID],
      address: linkedProperty[propertyKeys.ADDRESS],
      tenants: linkedProperty[propertyKeys.TENANTS],
      bedrooms: linkedProperty[propertyKeys.BEDROOMS],
      bathrooms: linkedProperty[propertyKeys.BATHROOMS],
    };
    fetchedProperties[parsedProperty.propId] = parsedProperty;
  });
  return {
    type: PROPERTY_LIST_ACTION_TYPES.FETCH_PROPERTIES,
    properties: fetchedProperties,
  };
};

/**
 * ----------------------------------------------------
 * Store Property Appliance and Tenants
 * ----------------------------------------------------
 * Simple function for updating the reducer for when a single property has been selected. It will provide 
 * the reducer the information of appliances and tenant information needed for a single property
 * 
 * @param {TenantInfo[]} tenants -Array of objects that contain the data for Tenants of a single property
 * @param {Appliance[]} appliances -Array of objects that contain the data for Appliance of a single property
 */
export const storePropertyApplianceAndTenants = (tenants: TenantInfo[],
   appliances: Appliance[]): StorePropertyApplianceAndTenantAction => {
  return {
    type: PROPERTY_LIST_ACTION_TYPES.STORE_APPLIANCES_AND_TENANTS,
    tenants,
    appliances,
  };
};

