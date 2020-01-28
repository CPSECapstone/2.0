/**
 * @jest-environment jsdom
 */

import {InputForm, InputFormProps, renderInputForm} from 'homepairs-elements';
import { shallow} from 'enzyme';
import * as React from 'react';
import { View, Text, TextInput} from 'react-native';
import {fireEvent, render} from 'react-native-testing-library';


const testProps: InputFormProps = {
    name: null,
};
const testProps2: InputFormProps = {
    name: 'Hi',
};

describe("InputForm", () => {
  const testfunc = (child:string) => {return child;};
  const spyFunction = jest.fn(testfunc);
 
  const wrapper = shallow(<InputForm/>);
  const wrapper2 = shallow(<InputForm name='Test' parentCallBack={spyFunction} secureTextEntry={true}/>);
  const wrapper3 = shallow(renderInputForm(testProps));
  const wrapper4 = shallow(renderInputForm(testProps2));

  const rendered = render(<InputForm name='Test' parentCallBack={spyFunction} secureTextEntry={true}/>);

  it('Test defaultProps for InputForm', () =>{
    expect(InputForm.defaultProps.name).toBeNull();
    expect(InputForm.defaultProps.parentCallBack).toBeDefined();
    expect(InputForm.defaultProps.secureTextEntry).toBeDefined();
    expect(InputForm.defaultProps.secureTextEntry).toBeFalsy();

    expect(InputForm.defaultProps.formTitleStyle).toBeDefined();
    expect(InputForm.defaultProps.containerStyle).toBeDefined();
    expect(InputForm.defaultProps.inputStyle).toBeDefined();

    expect(InputForm.defaultProps.parentCallBack("Hellow")).toBe("Hellow");

  });

  it("Test for proper Components", () => {
    expect(wrapper.find(View)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(0);
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper2.find(View)).toHaveLength(1);
    expect(wrapper2.find(Text)).toHaveLength(1);
    expect(wrapper2.find(TextInput)).toHaveLength(1);
  });

  it("Test renderInputForm Helper", () => {
    expect(wrapper3.find(View)).toHaveLength(1);
    expect(wrapper3.find(Text)).toHaveLength(0);
    expect(wrapper3.find(TextInput)).toHaveLength(1);
    expect(wrapper4.find(View)).toHaveLength(1);
    expect(wrapper4.find(Text)).toHaveLength(1);
    expect(wrapper4.find(TextInput)).toHaveLength(1);
  });


  it("Method Test: Checks the onClick Method and checks to see if the image was updated", () => {
    const {getByTestId, getByType} = rendered;
    const messageText = 'My Message';
    const messageText2 = 'Hello World';
    // Use getByType to get the instance of the type. However, we should not unit test components. 
    // React Developers highly suggest that we test for input about what a user would want. We should 
    // only unit test when not dealing with direct components. 
    const instance = getByType(InputForm);
    // We will need to go into elements that we want to examine and give them test ids
    fireEvent.changeText(getByTestId('userTextInput'), messageText);
    expect(spyFunction).toHaveBeenCalledWith(messageText);
    

    instance.props.parentCallBack(messageText2);
    expect(spyFunction).toHaveBeenCalledWith(messageText2);
    expect(spyFunction.mock.calls).toHaveLength(2);
    expect(spyFunction.mock.results[0].value).toBe(messageText);
    expect(spyFunction.mock.results[1].value).toBe(messageText2);

    // Test to make sure no unexpected changes occured. This is an element so this should always pass
    expect(rendered.toJSON()).toMatchSnapshot();
  });
  
});