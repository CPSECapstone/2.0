import React from 'react';
import {Image} from 'react-native';
import { render } from 'react-native-testing-library';
import {bolt} from 'homepairs-images';
import {ImageTile, TextTile} from './Tiles';

jest.mock('homepairs-images');

describe('A very simple test just making sure that ImageTiles is rendered properly', () => {
    const rendered = render(<ImageTile image={bolt} />);
    const renderedLarge = render(<ImageTile image={bolt} enlarge/>);

    it('Check if all properties render', () => {
        const {getByType} = rendered;
        expect(getByType(Image)).toBeDefined();
    });

    it('Check if all properties render', () => {
        const {getByType} = renderedLarge;
        expect(getByType(Image)).toBeDefined();
    });

});

describe('A very simple test just making sure that TextTiles is rendered properly', () => {
    const PLUS = '+';
    const rendered = render(<TextTile text={PLUS} />);
    const {getByText} = rendered;

    it('Check if all properties render', () => {
        expect(getByText(PLUS)).toBeDefined();
    });

});
