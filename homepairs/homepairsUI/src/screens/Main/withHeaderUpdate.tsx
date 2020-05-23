import React from 'react';
import { MainAppStack, MainAppStackTenant, HOME_INDEX } from 'homepairs-routes';
import {updateSelectedPage} from 'homepairs-redux-actions';
import { connect } from 'react-redux';
import { AppState, MainAppStackType, AccountTypes } from 'homepairs-types';


type WithHeaderUpdateProps = {
    onUpdateHeader: () => void;
} & any;

/**
 * -----------------------------------------------
 * withHeaderUpdate
 * -----------------------------------------------
 * 
 * A High Order Component that maps the component with the menu item in the 
 * homepairs header reducer.
 * 
 * @param {any} WrappedComponent - Page component attached to header
 * @param {number} pageIndex - Referenced value on the app page index. If the page does not have a 
 * proper mapping, set it to -1 so nothing is selected.
 * @param {boolean} withRef - Defines if the Connected Component should be accessed using react 
 * references. 
 */
export default function withHeaderUpdate(WrappedComponent: any, pageIndex: number = HOME_INDEX, withRef?: boolean){

    // Define the updateHeader function so the Smart Component can be returned 
    function mapStateToProps(state: AppState) {
        const {accountProfile} = state;
        return {
            accountType: accountProfile.accountType,
        };
    }

    const mapDispatchToProps = dispatch => ({
        onUpdateHeader: (page: MainAppStackType) => {
            dispatch(updateSelectedPage(page));
        },
    });

    class UpdateHeaderComponent extends React.Component<WithHeaderUpdateProps>{
        MainAppStack: MainAppStackType[];

        constructor(props: Readonly<WithHeaderUpdateProps>){
            super(props);
            this.MainAppStack = props.accountType === AccountTypes.PropertyManager ? MainAppStack : MainAppStackTenant;
        };

        componentDidMount(){
            const {onUpdateHeader} = this.props;
            onUpdateHeader(this.MainAppStack[pageIndex]);
        };
        
        render(){
            return <WrappedComponent {...this.props}/>;
        };
    };

    return connect(mapStateToProps, mapDispatchToProps, null, {withRef})(UpdateHeaderComponent);
}