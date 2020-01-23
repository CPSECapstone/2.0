//import { withAuthPage, AuthPassProps, AuthPageInjectedProps, SceneHeader } from 'homepair-components';
import { shallow, ShallowWrapper} from "enzyme";
import * as React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import * as Mocks from "../../fixtures/StoreFixture";
import * as Components from "../../fixtures/DummyComponents";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import jest from "jest";
import {render} from "react-native-testing-library";
//import { NavigationStackScreenProps, createStackNavigator } from 'react-navigation-stack';
//import { NavigationParams } from 'react-navigation';
import {
  withAuthPage,
  AuthPassProps,
  AuthPageInjectedProps,
  withDarkMode,
  SceneHeader,
} from "homepair-components";
import PropertiesScreen from '../../../src/Screens/Main/Properties/PropertiesScreen/PropertiesScreen'
import {AppNavigator} from "../../../src/Routes/Routes"
import { createStackNavigator } from "react-navigation-stack";

/**
 * Here we will test the HOC of withAuthPage. We will pass in some dum parameters
 * and test to see if the component renders. This will be wrapped within a Shallow Wrapper.
 */

const store1 = Mocks.testStore1;
const component1 = Components.SingleViewComponent;
const newNavStack = createStackNavigator({test: PropertiesScreen})
const passProps1: AuthPassProps = {
  button: "Hello",
  subtitle: "This is a test",
  buttonColor: "blue",
  loadingModalText: "I should never appear",
  underButtonText: "This is something to think about",
  highlightedText: "I am highlighted"
};

//const fakeStackNav = createStackNavigator({})
/*
const navStackScrnProp1 : NavigationStackScreenProps<NavigationParams, {}> = {
  theme: 'light',
  navigation: fakeStackNav,
  screenProps: {},
}
const injectProps1 : AuthPageInjectedProps = {
    
}*/

describe("test withAuth Page", () => {
  let store: any;
  //const navigation = jest.fn();
  beforeEach(() => {
    const mockStore = configureMockStore([thunk]);
    // creates the store with any initial state or middleware needed
    store = mockStore(store1);
  });

  //We have renderer working with regular components. Need to figure out how to get this to work with
  //HOCß
  it("Should render the property and have behavior we should examine", () => {
    const Component1 = component1;
    const AuthHOC = withAuthPage(View, passProps1);
    const authObj = <AuthHOC navigation={null} _onChangeModalVisibility={()=>{}}/>
  
    const PropertiesMock = <Provider store={store}>{newNavStack}</Provider>
    const wrapper = shallow(authObj);
    let tree = render(PropertiesMock).toJSON()
    console.log(tree)
    expect(wrapper).not.toBe(null);
    let elements = wrapper.getElements()
    let props = wrapper.getElement()
    console.log(elements)
    wrapper.simulate('setHighlightedClick')
    console.log(wrapper.state())
    //expect(wrapper.find(View)).toHaveLength(5);
    //expect(wrapper.find(TouchableOpacity)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(1);
  });
});

/*
describe('<Auth />', () => {
    beforeEach(() => {
      const mockStore = configureStore();
  
      // creates the store with any initial state or middleware needed
      store = mockStore({
        user: {
          isLoaded: true,
        },
      });
    });
    it('Should render the component only when auth prop is true', () => {
      const Component = <h1>Hola</h1>;
      const ConditionalHOC = Auth(Component);
      const wrapper = shallow(<ConditionalHOC store={store} />);
      expect(wrapper).not.toBe(null);
    });
  });
  */
