import { AppState } from './types';
import { propertyList } from './property-list/reducer';
import { accountProfile } from './account/reducer';
import { header } from './header/reducer';
import { createStore, combineReducers, AnyAction, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


export default createStore(
    combineReducers<AppState, AnyAction>(
        {   
            header,
            propertyList,
            accountProfile,
            /**REMEMBER TO GO INTO ./types AND UPDATE THE AppState TYPE */
        }
    ),
    applyMiddleware(thunk)
)