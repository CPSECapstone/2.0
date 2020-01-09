import { AppState } from "homepair-types";
import { PropertyListActions } from "homepair-redux-actions";
import { connect } from "react-redux";
import DetailedPropertyScreenBase, { DetailedPropertyStateProps, DetailedPropertyDispatchProps } from './DetailedPropertyScreenBase';
import { withNavigation } from "react-navigation";
import { withDarkMode } from 'homepair-components';

function mapStateToProps(state: AppState) : DetailedPropertyStateProps {
    return { properties: state.propertyList,}
};
  
const mapDispatchToProps : (dispath: any) => DetailedPropertyDispatchProps = 
(dispatch)=> ({
    onUpdateProperty: (index : number, address: string, tenants: number, bedrooms:number, bathrooms:number) => {
        dispatch(PropertyListActions.updateProperty(index, address, tenants, bedrooms, bathrooms));
    },
    onRemoveProperty: (index: number) => {
        //TODO: Deal with removing properties
    }
});

const DetailedPropertyScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailedPropertyScreenBase);

export default withDarkMode(withNavigation(DetailedPropertyScreen));