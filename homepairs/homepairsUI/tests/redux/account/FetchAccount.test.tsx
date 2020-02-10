import { AccountActions } from 'homepairs-redux-actions';
import { AccountTypes, AccountStateAction, FetchPropertiesAction, FetchPropertyAction } from 'homepairs-types';
import { NavigationSwitchProp } from 'react-navigation';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { propertyManagerMock1 } from '../../fixtures/StoreFixture';

const TYPE = 'ACCOUNT/FETCH_PROFILE';
const spyFunction = jest.fn((arg:string) => {return arg;});

const expectedResults: {[id:string]: AccountStateAction} = {
  PM_WITHOUT_TOKEN: { // PM Account w/out token 
    type: TYPE,
    profile: {
      accountType: AccountTypes.Landlord,
      firstName: 'Jack',
      streetAddress: undefined,
      city: undefined,
      lastName: 'profile[accountKeys.LASTNAME]',
      email: 'jacklame@gmail.com',
      roopairsToken: '',
      manId: 102449555,
    },
  },
  PM_WITH_TOKEN: { // PM Account with token
    type: TYPE,
    profile: {
      accountType: AccountTypes.Landlord,
      firstName: 'Jack',
      streetAddress: 'lifelike line Apt. 3',
      city: undefined,
      lastName: 'profile[accountKeys.LASTNAME]',
      email: 'jacklame@gmail.com',
      roopairsToken: '8f2974bdc4c19c5d0276f0a51b163087a23f9e42',
      manId: 102449555,
    },
  },
  TENANT_WITH_TOKEN: { // Tenant account with Token 
    type: TYPE,
    profile: {
      accountType: AccountTypes.Tenant,
      firstName: 'Kyle',
      streetAddress: undefined,
      city: undefined,
      lastName: 'Lion',
      email: 'kylelion@gmail.com',
      roopairsToken: '8f2974bdc4c19c5d0276f0a51b163087a23f9e42',
      tenantId: 20,
      propId: 99,
    },
  },
  TENANT_WITHOUT_TOKEN: { // Tenant account with Token 
    type: TYPE,
    profile: {
      accountType: AccountTypes.Tenant,
      firstName: 'Kyle',
      streetAddress: 'lifelike line Apt. 3',
      city: 'San Luis Obispo',
      lastName: 'Lion',
      email: 'kylelion@gmail.com',
      roopairsToken: '',
      tenantId: 20,
      propId: 99,
    },
  },
  NO_TOKEN_DEFINED: { // Account of a response with no token
    type: TYPE,
    profile: {
      accountType: AccountTypes.Landlord,
      firstName: 'Jack',
      streetAddress: undefined,
      city: undefined,
      lastName: 'profile[accountKeys.LASTNAME]',
      email: 'jacklame@gmail.com',
      roopairsToken: undefined,
      manId: 102449555,
    },
  },
};

const expectedEmptyTenant: FetchPropertiesAction = {
  type: "PROPERTY_LIST/FETCH_PROPERTIES",
  properties: [],
};

const expectedTenantProperty : FetchPropertyAction = {
  type: "PROPERTY_LIST/FETCH_PROPERTY",
  property: [{
    city: "San Luis Obispo",
    tenants: 5,
    bathrooms: 2,
    bedrooms: 3,
    state: "CA",
    streetAddress: "200 N. Santa Rosa",
  }],
};

const testJsonValues: {[id:string]: any} =
{
  PM_WITHOUT_TOKEN: { // PM without token
    pm: {
      accountType: AccountTypes.Landlord,
      firstName: 'Jack',
      lastName: 'profile[accountKeys.LASTNAME]',
      email: 'jacklame@gmail.com',
      manId: 102449555,
    },
    token: '',
  },
  PM_WITH_TOKEN: { // PM with token
    pm: {
      accountType: AccountTypes.Tenant,
      firstName: 'Jack',
      lastName: 'profile[accountKeys.LASTNAME]',
      email: 'jacklame@gmail.com',
      streetAddress: 'lifelike line Apt. 3',
      manId: 102449555,
    },
    token: '8f2974bdc4c19c5d0276f0a51b163087a23f9e42',
  },
  TENANT_WITH_TOKEN: {
    tenant: {
      accountType: AccountTypes.Tenant,
      firstName: 'Kyle',
      lastName: 'Lion',
      email: 'kylelion@gmail.com',
      propId: 99,
      tenantID: 20,
      place:{
        city: "San Luis Obispo",
        maxTenants: 5,
        numBath: 2,
        numBed: 3,
        pm: "Eeron Grant",
        state: "CA",
        streetAddress: "200 N. Santa Rosa",
      },
    },
    token: '8f2974bdc4c19c5d0276f0a51b163087a23f9e42',
  },
  TENANT_WITHOUT_TOKEN: { // Tenant without a token
    tenant: {
      accountType: AccountTypes.Tenant,
      firstName: 'Kyle',
      lastName: 'Lion',
      streetAddress: 'lifelike line Apt. 3',
      city: 'San Luis Obispo',
      email: 'kylelion@gmail.com',
      propId: 99,
      tenantID: 20,
    },
    token: '',
  },
  NO_TOKEN_DEFINED: { // Response with no token key
    pm: {
      accountType: AccountTypes.Landlord,
      firstName: 'Jack',
      lastName: 'profile[accountKeys.LASTNAME]',
      email: 'jacklame@gmail.com',
      manId: 102449555,
    },
  },
};



const mockNavigation: NavigationSwitchProp = {
  navigate: (routeNameOrOptions)=>{
    spyFunction(routeNameOrOptions);
    return true;
  },
  state: undefined,
  dispatch: undefined, 
  goBack: undefined,
  dismiss: undefined,
  openDrawer:undefined,
  closeDrawer: undefined, 
  toggleDrawer: undefined, 
  getParam: undefined,
  setParams: undefined,
  emit: undefined, 
  addListener: undefined, 
  isFocused: undefined, 
  isFirstRouteInParent: undefined, 
  dangerouslyGetParent: undefined,
  jumpTo: undefined,
};

const createTestProps = (props: Object) => ({
  navigation: mockNavigation,
  ...props,
});


// To test nested actions with an async REST request, we need to call an await on the 
// dispatch methods in order to get an updated state. 
describe('FetchAccount Action', () => {
    const email = 'jacky@gmail.com';
    const password= 'pass4jacky';
    const testProps = createTestProps({});
    const mock = new MockAdapter(axios);

    describe('Tests Action when response returned is success', () => {
        beforeEach(()=>{
          propertyManagerMock1.clearActions();
        });

        it('Test when the role is a PM', async () => {
          const data = { 
              status: 'success',
              ...testJsonValues.PM_WITH_TOKEN,
              role: 'pm',
          };
          mock.onPost('https://homepairs-alpha.herokuapp.com/API/login/').reply(200, data);
          await propertyManagerMock1.dispatch(
            AccountActions.fetchAccount(email, password, testProps.navigation))
            .then(() => {
              expect(spyFunction.call).toHaveLength(1);
              const actionResults = propertyManagerMock1.getActions();
              expect(actionResults).toHaveLength(2);
              expect(actionResults[0]).toStrictEqual(expectedResults.PM_WITH_TOKEN);
              expect(actionResults[1]).toStrictEqual(expectedEmptyTenant);
            });
      });

      it('Test when the role is a Tenant with a property', async () => {
        const data = { 
            status: 'success',
            ...testJsonValues.TENANT_WITH_TOKEN,
            role: 'tenant',
        };
        mock.onPost('https://homepairs-alpha.herokuapp.com/API/login/').reply(200, data);
        await propertyManagerMock1.dispatch(AccountActions.fetchAccount(email, password, testProps.navigation)).then(() => {
          expect(spyFunction.call).toHaveLength(1);
          const actionResults = propertyManagerMock1.getActions();
          expect(actionResults).toHaveLength(2);
          expect(actionResults[1]).toStrictEqual(expectedTenantProperty);
        });
    });

    describe('Test action when authentication is a failure', () => {
      beforeEach(()=>{
        propertyManagerMock1.clearActions();
      });
      
      it('When response has not been returned', async () => {
        const statusFailedSpy = jest.fn((error?:string) => {});
        mock.onPost('https://homepairs-alpha.herokuapp.com/API/login/').reply(400, null);
        await propertyManagerMock1.dispatch(AccountActions.fetchAccount(email, password, testProps.navigation, statusFailedSpy))
        .then(() => {
          expect(spyFunction.call).toHaveLength(1);
          expect(statusFailedSpy).toBeCalledWith("Unable to establish a connection with HomePairs servers");
        });

      });

      it('When response returns failure', async () => {
        const data = { 
            status: 'failure',
        };
        const statusFailedSpy = jest.fn(() => {});
        mock.onPost('https://homepairs-alpha.herokuapp.com/API/login/').reply(200, data);
        await propertyManagerMock1.dispatch(AccountActions.fetchAccount(email, password, testProps.navigation, statusFailedSpy)).then(() => {
          expect(propertyManagerMock1.getActions()).toHaveLength(0);
          expect(statusFailedSpy.mock.calls).toHaveLength(1);
          expect(statusFailedSpy).toBeCalledWith("Home Pairs was unable to log in. Please try again.");
        }); 
      });

    });
  });
});