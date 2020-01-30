import { connect } from "react-redux";
import { PropertyListActions } from 'homepairs-redux-actions';
import { Property, AppState } from 'src/state/types';
import EditPropertyModalBase, {EditPropertyDispatchProps, EditPropertyState} from './EditPropertyModalBase';

const mapDispatchToProps : (dispatch: any) => EditPropertyDispatchProps = (dispatch: any) => ({
    onEditProperty: (editProperty: Property, info: EditPropertyState, onChangeModalVisiblity: (check: boolean) => void) => {
        dispatch(PropertyListActions.postUpdatedProperty(editProperty, info, onChangeModalVisiblity));
    },
});

function mapStateToProps(state: AppState) : any {
    const propIndex = state.propertyList.selectedPropertyIndex;
    return {
        email: state.accountProfile.email, 
        index: propIndex, oldProp: state.propertyList.properties[propIndex],
        roopairsToken: state.accountProfile.roopairsToken,
    };
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps)(EditPropertyModalBase);

