/**
 * ------------------------------------------------------------
 * Elements 
 * ------------------------------------------------------------
 * Elements are designed to be the base level components akin to React.Elements.
 * These components have hard coded values included into them are intended to be the 
 * building blocks of larger components. 
 * 
 * ------------------------------------------------------------
 * About aliases:
 *      index.js file intended to act as an alias to the Components packages. 
 *      It is in this file where all general purpose components (components common 
 *      are shared between multiple Screens/Scenes/ParenentComponents) should be 
 *      defined and exported. 
 * 
 *      An example of using this would be: 
 *          import { HomePairsHeader, SceneHeader } from 'homepairs-components';
 *          import AddressSticker from './AddressSticker';
 * 
 *      * Note, for any components specific to the scene (i.e. not used by any other scene), 
 *        please define a Components folder for the topmost parent and define it there. 
 */

import { InputFormProps as IFP, renderInputForm } from './Forms/InputForm';
import { ThinButtonProps as TBP } from './Buttons/ThinButton';
import { CardProps as CP} from './Cards/Card';
import { StickerProps as SP} from './Stickers/Sticker';

export {default as InputForm } from './Forms/InputForm';
export {default as ThinButton} from './Buttons/ThinButton';
export {default as LoginButton} from './Buttons/LoginButton';
export {default as Card } from './Cards/Card';
export {default as Sticker} from './Stickers/Sticker';
export {default as HamburgerButton} from './Buttons/HamburgerButton';

/** A hack that works when exporting types */
export type InputFormProps = IFP;
export type ThinButtonProps = TBP;
export type CardProps =  CP;
export type StickerProps = SP;

export {renderInputForm};