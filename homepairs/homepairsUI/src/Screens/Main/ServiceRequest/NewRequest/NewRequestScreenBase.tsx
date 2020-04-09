import React, {Component} from 'react'; //* *For every file that uses jsx, YOU MUST IMPORT REACT  */
import {Property, ApplianceType, NewServiceRequest, HomePairsDimensions, Appliance, ServiceProvider } from 'homepairs-types';
import Colors from 'homepairs-colors';
// import './styles.css';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { NavigationRouteScreenProps, stringToCategory, isEmptyOrSpaces, categoryToString, isPositiveWholeNumber } from 'homepairs-utilities';
import {AddressPanel, InputForm, InputFormProps, ThinButton, ThinButtonProps, ServiceTypePanel} from 'homepairs-elements';
import * as BaseStyles from 'homepairs-base-styles';
import {ChooseServiceCategory, ChooseAppliance, ChooseServiceProvider} from 'homepairs-components';
import {DateTimePicker} from 'react-widgets';
import {DatePicker} from 'react-native-datepicker';
import {HelperText} from 'react-native-paper';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import axios from 'axios';
import { HOMEPAIRS_SERVICEPROVIDER_GET_ENDPOINT,  HOMEPAIRS_PROPERTY_ENDPOINT, postNewServiceRequest } from 'homepairs-endpoints';

Moment.locale('en');
momentLocalizer();

type NewRequestScreenProps = {
    properties: Property[]
    token: string,
    pmId: number,
};

type NewRequestState = {
    address: string,
    propId: string,
    serviceCategory: ApplianceType,
    applianceId: string,
    providerId: number, 
    serviceType: string, 
    details: string, 
    serviceDate: Date, 
    clientName: string, 
    phoneNumber: string, 
    appliances: Appliance[],
    errorMsg: string,
    errorCheck: boolean,
    serviceProviders: ServiceProvider[],
};

const initialState : NewRequestState = {
    address: '', 
    propId: '',
    serviceCategory: ApplianceType.None, 
    applianceId: '', //BAD NAME CHOSEN APPLIANCE
    providerId: -1, //BAD NAME CHOSEN PROVidER
    serviceType: '',
    details: '', 
    serviceDate: null, 
    clientName: '', 
    phoneNumber: '',
    appliances: [],
    errorMsg: '',
    errorCheck: false,
    serviceProviders: [],
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: BaseStyles.MarginPadding.large,
    },
    formTitle: {
        fontFamily: BaseStyles.FontTheme.primary,
        fontSize: BaseStyles.FontTheme.reg,
        color: '#AFB3B5',
        paddingVertical: BaseStyles.MarginPadding.medium,
    },
    datePickerContainer: {
        padding: BaseStyles.MarginPadding.medium,
        backgroundColor: 'red',
    },
    iconImage: {
        height: 20, 
        width: 20, 
    },
    errorStyle: {
        fontFamily: BaseStyles.FontTheme.secondary, 
        fontSize: 16,
    },
});

type Props = NavigationRouteScreenProps & NewRequestScreenProps;


export default class ServiceRequestBase extends Component<Props, NewRequestState> {

    addressRef;

    serviceCategoryRef;

    applianceIdRef;

    serviceProviderRef;

    serviceTypeRef;

    descriptionRef;

    serviceDateRef;

    clientNameRef;

    phoneNumberRef;

    formProps : InputFormProps = {
        inputStyle: {
            alignItems: 'center',
            alignSelf: 'center',
            margin: 1,
            minWidth: 40,
            width: '100%',
            height: 100,
            borderColor: '#AFB3B5',
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 10,
        },
        numberOfLines: 3, 
        multiline: true,
        maxLength: 500,
    }

    buttonProps: ThinButtonProps = {
        name: 'Send Request', 
        containerStyle: {
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: BaseStyles.MarginPadding.largeConst,
            marginBottom: BaseStyles.MarginPadding.xlarge,
            minHeight: 50,
        }, 
        buttonStyle: {
            alignItems: 'center',
            backgroundColor: Colors.LightModeColors.transparent,
            padding: BaseStyles.MarginPadding.mediumConst,
            maxWidth: HomePairsDimensions.MAX_BUTTON_WIDTH,
            minWidth: HomePairsDimensions.MIN_BUTTON_WIDTH,
            borderRadius: BaseStyles.BorderRadius.large,
            borderWidth: 1,
            borderColor: Colors.LightModeColors.blueButton,
        },
        buttonTextStyle: {
            color: Colors.LightModeColors.blueButtonText, 
            fontSize: BaseStyles.FontTheme.reg,
            alignSelf: 'center',
        },
    }

    constructor(props: Readonly<Props>) {
        super(props);
        
        this.getFormAddress = this.getFormAddress.bind(this);
        this.getFormCategory = this.getFormCategory.bind(this);
        this.getFormAppliance = this.getFormAppliance.bind(this);
        this.getFormServiceType = this.getFormServiceType.bind(this);
        this.getFormServiceProvider = this.getFormServiceProvider.bind(this);
        this.getFormDescription = this.getFormDescription.bind(this);
        this.getFormDate = this.getFormDate.bind(this);
        this.getFormClientName = this.getFormClientName.bind(this);
        this.getFormPhoneNumber = this.getFormPhoneNumber.bind(this);
        this.fetchAppliances = this.fetchAppliances.bind(this);
        this.displayError = this.displayError.bind(this);
        this.fetchServiceProviders = this.fetchServiceProviders.bind(this);
        this.state = initialState;
        this.addressRef = React.createRef();
        this.serviceCategoryRef = React.createRef();
        this.applianceIdRef = React.createRef();
        this.serviceProviderRef = React.createRef();
        this.serviceTypeRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.serviceDateRef = React.createRef();
        this.clientNameRef = React.createRef();
        this.phoneNumberRef = React.createRef();
    }

    componentDidMount() {
        this.fetchServiceProviders();
    }

    async getFormAddress(childData : string, propId: string) {
        this.setState({address: childData, propId});
        await this.fetchAppliances(propId);
    }

    getFormCategory(childData : ApplianceType) {
        this.setState({serviceCategory: childData});
    }

    getFormAppliance(childData: string) {
        this.setState({applianceId: childData});
    }

    getFormServiceProvider(childData: number) {
        this.setState({providerId: childData});
    }

    getFormServiceType(childData: string) {
        this.setState({serviceType: childData});
    }

    getFormDescription(childData: string) {
        this.setState({details: childData});
    }

    getFormDate(childData: Date) {
        this.setState({serviceDate: childData});
    }

    getFormClientName(childData: string) {
        this.setState({clientName: childData});
    }

    getFormPhoneNumber(childData: string) {
        this.setState({phoneNumber: childData});
    }

    fetchAppliances = async (propId: string) => {
        if (propId !== '') {
            await axios.get(`${HOMEPAIRS_PROPERTY_ENDPOINT}${propId}`).then((result) =>{
                const {appliances} = result.data;
                const applianceInfo: Appliance[] = [];

                appliances.forEach(appliance => {
                    const {appId, category, name, manufacturer, modelNum, serialNum, location} = appliance;

                    applianceInfo.push({
                        applianceId: appId,
                        category: stringToCategory(category), 
                        appName: name, manufacturer, modelNum, serialNum, location,
                    });
                });
                this.setState({appliances: applianceInfo});
            });  
        }   
    };

    fetchServiceProviders = async () => {
            const {pmId} = this.props;
            await axios.get(`${HOMEPAIRS_SERVICEPROVIDER_GET_ENDPOINT}${pmId}/`).then((result) =>{
                const {providers} = result.data;
                const providerInfo: ServiceProvider[] = [];
                providers.forEach(provider => {
                    const { provId, name, email, phoneNum, contractLic, skills, founded } = provider;
                    providerInfo.push({provId, name, email, phoneNum, contractLic, skills, founded});
                });
                this.setState({serviceProviders: providerInfo});
            });  
    };

    displayError(msg: string) {
        this.setState({errorMsg: msg, errorCheck: true});
    }

    clickSubmitButton() {
        const { serviceCategory, applianceId, providerId, serviceType, details, serviceDate, propId} = this.state;
        const {navigation, token} = this.props;
        this.setState({errorCheck: false});
        if (this.validateForms()) {
            const newServiceRequest : NewServiceRequest = {
                token,
                propId, 
                appId: applianceId, 
                providerId, 
                serviceType,
                serviceCategory: categoryToString(serviceCategory), 
                serviceDate: serviceDate.toISOString(), 
                details,
            };
            postNewServiceRequest(newServiceRequest, this.displayError, navigation);
        }
    }

    validateForms() {
        const {address, serviceCategory, applianceId, providerId, serviceType, serviceDate} = this.state;
        let check = true;
        if (isEmptyOrSpaces(address)) {
            check = false;
        }
        if (serviceCategory === ApplianceType.None) {
            check = false;
        }
        if (isEmptyOrSpaces(applianceId)) {
            check = false;
        }
        if (serviceDate === null) {
            check = false;
        }
        if (isEmptyOrSpaces(serviceType)) {
            check = false;
        }
        if (!isPositiveWholeNumber(providerId.toString())) {
            check = false;
        }
        return check;
    }

    renderDatePicker() {
        const {serviceDate} = this.state;
        const startDate = new Date();
        const maxDate = new Date();
        startDate.setHours(0, 0, 0);
        maxDate.setDate(startDate.getDate() + 90);
        maxDate.setHours(0, 0, 0);
        if (Platform.OS === 'web') {
            return <DateTimePicker 
                key='web datetime picker'
                dropDown
                value={serviceDate}
                onChange={value => this.getFormDate(value)}
                min={startDate}
                time
            />;
        }
        return <DatePicker 
            key='mobile datetime picker'
            minDate={startDate}
            maxDate={startDate.setDate(startDate.getDate() + 90)}
            onDateChange={(date) => this.getFormDate(date)}
            mode='datetime'
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'    
        />;
    }

    renderError() {
        const {errorMsg, errorCheck} = this.state;
        return <View style={{alignSelf:'center'}}>
            <HelperText type='error' visible={errorCheck} style={styles.errorStyle}>{errorMsg}</HelperText>
        </View>;
    }

    render() {
        const {properties} = this.props;
        const {appliances, serviceCategory, serviceProviders} = this.state;
        return (
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.formTitle}>ADDRESS</Text>
                <AddressPanel properties={properties} parentCallBack={this.getFormAddress}/>
                <Text style={styles.formTitle}>SERVICE CATEGORY</Text>
                <ChooseServiceCategory onPress={this.getFormCategory}/>
                <Text style={styles.formTitle}>APPLIANCE (IF APPLICABLE)</Text>
                <ChooseAppliance parentCallBack={this.getFormAppliance} applianceType={serviceCategory} appliances={appliances}/>
                <Text style={styles.formTitle}>SERVICE PROVIDER</Text>
                <ChooseServiceProvider serviceProviders={serviceProviders} parentCallBack={this.getFormServiceProvider}/>
                <Text style={styles.formTitle}>SERVICE TYPE</Text>
                <ServiceTypePanel parentCallBack={this.getFormServiceType}/>
                <Text style={styles.formTitle}>WHAT HAPPENED?</Text>
                <InputForm 
                    parentCallBack={this.getFormDescription}
                    numberOfLines={this.formProps.numberOfLines} 
                    inputStyle={this.formProps.inputStyle}
                    multiline={this.formProps.multiline}
                    maxLength={this.formProps.maxLength}
                    />
                <Text style={styles.formTitle}>WHEN DO YOU WANT IT TO BE FIXED?</Text>
                <>{this.renderDatePicker()}</>
                {this.renderError()}
                <ThinButton 
                    name={this.buttonProps.name}
                    onClick={() => this.clickSubmitButton()}
                    containerStyle={this.buttonProps.containerStyle}
                    buttonStyle={this.buttonProps.buttonStyle}
                    buttonTextStyle={this.buttonProps.buttonTextStyle}
                />
            </ScrollView>
        );
    }
}