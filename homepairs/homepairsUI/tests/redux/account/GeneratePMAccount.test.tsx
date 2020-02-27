import { AccountActions } from 'homepairs-redux-actions';
import { AccountTypes, AccountStateAction, Account, Property, FetchPropertiesAction} from 'homepairs-types';
import { NavigationSwitchProp } from 'react-navigation';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { navigationPages } from 'src/Routes/RouteConstants';
import { propertyManagerMock1 } from '../../fixtures/StoreFixture';
import { PROPERTY_LIST_ACTION_TYPES } from '../../../src/state/property-list/actions';
import { mockSwitchNavigation, navigationSwitchSpyFunction } from '../../fixtures/DummyComponents';

const TYPE = 'ACCOUNT/FETCH_PROFILE';
const URL = 'http://homepairs-alpha.herokuapp.com/API/register/pm/';
const navSpyFunction = navigationSwitchSpyFunction;
const AccountPropertiesPageKey = navigationPages.PropertiesScreen;
const {FETCH_PROPERTIES} = PROPERTY_LIST_ACTION_TYPES;
const testPMAccount1: Account = {
    accountType: AccountTypes.Landlord,
    firstName: 'Jacky',
    lastName: 'Lynne',
    email: 'jackyLynne@gmail.com',
    address: 'ABC Street',
    roopairsToken: '',
};

const testJsonValue1 = {
    pm: {
        firstName: 'Jacky',
        lastName: 'Lynne',
        email: 'jackyLynne@gmail.com',
        manId: 100,
        streetAddress: 'ABC Street',
      },
    token: '1d9f80e98e9b16b94bf76c2dc49fe15b8b30d1a2',
    properties: [{
        maxTenants: 10,
        numBath: 4,
        numBed: 10,
        pm: 'Jacky Lynne',
        streetAddress: 'ABG Street',
    }],
};

const expectedFetchResult1: AccountStateAction = {
    type: TYPE,
    profile:{
        accountType: AccountTypes.Landlord,
        firstName: 'Jacky',
        lastName: 'Lynne',
        email: 'jackyLynne@gmail.com',
        streetAddress: 'ABC Street',
        roopairsToken: '1d9f80e98e9b16b94bf76c2dc49fe15b8b30d1a2',
        manId: 100,
    },
};

const expectedProperties: FetchPropertiesAction ={
    type: FETCH_PROPERTIES,
    properties: [{
      tenants: 10,
      bathrooms: 4,
      bedrooms: 10,
      streetAddress: "ABG Street",
    }],
};

const mockNavigation: NavigationSwitchProp = mockSwitchNavigation;

const createTestProps = (props: Object) => ({
  navigation: mockNavigation,
  ...props,
});


// To test nested actions with an async REST request, we need to call an await on the 
// dispatch methods in order to get an updated state. 
describe('generateAccountForPM Action', () => {
    const password= 'pass4jacky';
    const testProps = createTestProps({});
    const mock = new MockAdapter(axios);

    beforeEach(()=>{
        propertyManagerMock1.clearActions();
    });

    describe('Tests Action when account created successfully', () => {
        
        it('Test when the role is a PM', async () => {
          const data = { 
              status: 'success',
              ...testJsonValue1,
              role: 'pm',
          };
          const spyFunction = jest.fn(() => {});
          mock.onPost(URL).reply(200, data);
          await propertyManagerMock1.dispatch(
            AccountActions.generateAccountForPM(testPMAccount1, password, mockNavigation, spyFunction))
            .then(() => {
                expect(spyFunction.call).toHaveLength(1);
                const actionResults = propertyManagerMock1.getActions();
                expect(actionResults).toHaveLength(2);
                expect(actionResults[0]).toStrictEqual(expectedFetchResult1);
                expect(actionResults[1]).toStrictEqual(expectedProperties);
                expect(navSpyFunction).toBeCalledWith(AccountPropertiesPageKey);
            });
      });
    });


    describe('Test action when authentication is failure', () => {
      beforeEach(()=>{
        propertyManagerMock1.clearActions();
      });

      it('When response has not been returned', async () => {
        const statusFailedSpy = jest.fn(() => {});
        mock.onPost(URL).reply(400, null);
        await propertyManagerMock1.dispatch(
            AccountActions.generateAccountForPM(testPMAccount1, password, testProps.navigation, statusFailedSpy))
            .then(() => {
                expect(statusFailedSpy.call).toHaveLength(1);
                expect(propertyManagerMock1.getActions()).toHaveLength(0);
                expect(statusFailedSpy).toBeCalledWith("Connection to the server could not be established.");
            });
      });

      
      it('When homepairs response returns failure', async () => {
        const data = { 
            status: 'failure',
        };
        const statusFailedSpy = jest.fn(() => {});
        mock.onPost(URL).reply(200, data);
        await propertyManagerMock1.dispatch(AccountActions
            .generateAccountForPM(testPMAccount1, password, testProps.navigation, statusFailedSpy))
            .then(() => {
                expect(propertyManagerMock1.getActions()).toHaveLength(0);
                expect(statusFailedSpy.mock.calls).toHaveLength(1);
                expect(statusFailedSpy).toBeCalledWith("Home Pairs was unable create the account. Please try again.");
            }); 
      });
    });    
});