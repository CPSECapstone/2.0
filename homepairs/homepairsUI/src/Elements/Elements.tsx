/**
 * index.js file intended to act as an alias to the Components packages. 
 * It is in this file where all general purpose components (components common 
 * are shared between multiple Screens/Scenes/ParenentComponents) should be 
 * defined and exported. 
 * 
 * An example of using this would be: 
 *  import { HomePairsHeader, SceneHeader } from 'homepair-components';
import AddressSticker from './AddressSticker';
 * 
 * *Note, for any components specific to the scene (i.e. not used by any other scene), 
 *  please define a Components folder for the topmost parent and define it there. 
 */


 /**
  * -----------------------
  * Elements.tsx 
  * -----------------------
  * Elements are designed to be very basic components whose purpose is fulfill 
  * a small amount of use cases. Homepair Elements tend to be slightly more advanced 
  * than React Components but are still limited in their use. These elements should help
  * make up larger Components. 
  */

import { InputFormProps as IFP } from './Forms/InputForm';
import { ThinButtonProps as TBP } from './Buttons/ThinButton';
import { CardProps as CP} from './Cards/Card';
import { LoadingModalProps as LMP} from './Modals/LoadingModal';
import { StickerProps as SP} from './Stickers/Sticker';

export {default as InputForm } from './Forms/InputForm';
export {default as ThinButton} from './Buttons/ThinButton';
export {default as LoginButton} from './Buttons/LoginButton';
export {default as Card } from './Cards/Card';
export {default as LoadingModal} from './Modals/LoadingModal'
export {default as Sticker} from './Stickers/Sticker';

//**A hack that works when exporting types */
export type InputFormProps = IFP
export type ThinButtonProps = TBP
export type CardProps =  CP
export type LoadingModalProps = LMP
export type StickerProps = SP

