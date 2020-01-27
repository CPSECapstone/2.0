import {ThinButton} from 'homepairs-elements';
import { shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import { View, TouchableOpacity, Text} from 'react-native';


const createTestProps = (props: Object) => ({
  onClick: jest.fn()
});


describe("ThinButton", () => {
  let wrapper: ShallowWrapper;
  let test : number = 0;
  const testfunc = () => {test++;};
  const mockFunction = jest.fn(testfunc);

  wrapper = shallow(<ThinButton />);

  it("test for basic rendering", () => {
    expect(wrapper.find(View)).toHaveLength(1);
    expect(wrapper.find(TouchableOpacity)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(1);
  });

  testfunc(); testfunc();
  const wrapper2 = shallow(<ThinButton name='Test' onClick={testfunc}/>);
  const name = wrapper2.find(Text).first().props().children;
  // console.log(wrapper2.instance().onPress())
  // console.log(test)
  describe('Test for defaults', () => {
    expect(name).toBe('Test');
    // expect(wrapper2.instance().onPress()).toBe(11)
  });
  
});