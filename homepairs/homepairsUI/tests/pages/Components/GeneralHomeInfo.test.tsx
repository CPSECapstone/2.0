import React from 'react';
import {GeneralHomeInfo} from 'homepairs-components';
import { fireEvent, render } from 'react-native-testing-library';
import { Property } from 'homepairs-types';
import strings from 'homepairs-strings';
import {ThinButton} from 'homepairs-elements';

const testProperty: Property = {
    city: 'San Luis Obispo',
    tenants: 5,
    bathrooms: 2,
    bedrooms: 3,
    state: 'CA',
    streetAddress: '200 N. Santa Rosa',
};
const generalHomeStrings = strings.detailedPropertyPage.generalHomeInfo;

describe('General Home Info Test', () => {
    it('Test if default props are correct', () => {
        const {hasEdit, onClick} = GeneralHomeInfo.defaultProps;
        expect(hasEdit).toBeTruthy();
        expect(onClick).toBeDefined();
        expect(onClick()).toBeUndefined();
    });

    describe('has Edit cases', () => {
        const hasEditTrue = [undefined, null, true];
        const editButtonSpy = jest.fn();
        const expectedStreetAddressText = testProperty.streetAddress;
        const expectedCityStateText:string = `${testProperty.city}, ${testProperty.state}`;
        const expectedTenantAmount = '5';
        const expectedBedroomAmount = '3';
        const expectedBathroomAmount = '2';

        const expectedTexts: string[] = [
            expectedStreetAddressText,
            expectedCityStateText,
            expectedTenantAmount,
            expectedBedroomAmount,
            expectedBathroomAmount,
            generalHomeStrings.tenants,
            generalHomeStrings.bedrooms,
            generalHomeStrings.bathrooms,
        ];

        it('hasEdit is false', () => {
            const hasEdit = false;
            const rendered = render(
            <GeneralHomeInfo 
                property={testProperty} 
                hasEdit={hasEdit}
                onClick={editButtonSpy}/>);

            const {queryAllByType, getByText} = rendered;
            expect(queryAllByType(ThinButton)).toHaveLength(0);
            expectedTexts.forEach(text => {
                expect(getByText(text)).toBeDefined();
            });
        });

        it.each(hasEditTrue)('hasEdit is not defined, false, or null', (hasEdit) => {
            const rendered = render(
                <GeneralHomeInfo 
                    property={testProperty} 
                    hasEdit={hasEdit}
                    onClick={editButtonSpy}/>);

            const {getByTestId, getByText} = rendered;

            fireEvent.press(getByTestId('click-thin-button'));
            expect(editButtonSpy).toHaveBeenCalled();
            expectedTexts.forEach(text => {
                expect(getByText(text)).toBeDefined();
            });

        });

    });
});