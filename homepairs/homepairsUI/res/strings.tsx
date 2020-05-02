const propertyMutationForm = {
        address: 'ADDRESS',
        maxTenants: 'MAX TENANTS',
        bedrooms: 'BEDROOMS',
        bathrooms: 'BATHROOMS',
        city: 'CITY',
        state: 'STATE',
};

const strings = {
    title: 'HomePairs',
    serviceRequestPage: {
        title: 'Service Requests',
        button: 'New Request',
        tabA: 'Current Requests',
        tabB: 'Archived Requests',
        tabA1: 'Pending',
        tabA2: 'Scheduled',
        tabA3: 'In Progress',
        tabB1: 'Completed',
        tabB2: 'Canceled',
        tabB3: 'Declined',
    },
    serviceRequestModal: {
        title: 'Service Request',
        status: 'STATUS',
        address: 'ADDRESS', 
        serviceType: 'SERVICE TYPE',
        technician: 'ASSIGNED TECHNICIAN', 
        startDate: 'STARTED ON',
        poc: 'POINT OF CONTACT', 
        details: 'DETAILS', 
        appliance: 'APPLIANCE',
    },
    connectAccountPage: {
        title: 'Account Settings',
        tokenFailed: 'failure',
        accountConnected: {
            accountConnectedCard: {
                title: 'Account Connected',
                subtitle:
                    'Your roopairs account is ready for on-demand service',
                button: 'Disconnect Account',
            },
        },
        accountNotConnected: {
            connectAccountCard: {
                title: 'Connect Roopairs Account',
                subtitle: 'Connect your roopairs account for on-demand service',
                button: 'Connect Account',
            },
        },
    },
    propertiesPage: {
        title: 'Properties',
        button: 'Add Property',
        addProperty: {
            title: 'Add Property',
            inputForm: propertyMutationForm,
            button: 'Add',
        },
        viewPropertyCardButton: 'View Property',
    },
    detailedPropertyPage: {
        navigationParams: {
            propertyIndex: 'propertyIndex',
        },
        generalHomeInfo: {
            button: 'Edit Property',
            tenants: 'Max Tenants',
            bedrooms: 'Bedrooms',
            bathrooms: 'Bathrooms',
        },
        editProperty: {
            title: 'Edit Property',
            inputForm: propertyMutationForm,
            button: 'Save',
        },
        primaryContact: {
            title: 'Primary Contact',
            subtitle: 'Questions about this property? Contact the landlord:',
            name: 'NAME',
            email: 'EMAIL',
            phone: 'PHONE',
        },
        serviceRequestCount: {
            title: 'Service Requests',
            pending: 'Pending',
            scheduled: 'Scheduled',
            inProgress: 'In Progress', 
            button: 'View Requests',
        },
    },
    signInPage: {
        subtitle: 'Sign in to your Account',
        inputForms: {
            email: 'EMAIL',
            password: 'PASSWORD',
        },
        button: 'Sign In',
        signUpHighlight: 'Sign Up',
        newUserText: 'New to HomePairs? ',
        modal: 'Logging In...',
    },
    signUpPage: {
        subtitle: 'Create your account',
        accountTypeRadioButton: {
            name: 'ACCOUNT TYPE',
            tenant: 'Tenant',
            propertyManager: 'Property Manager',
        },
        inputForms: {
            firstName: 'FIRST NAME',
            lastName: 'LAST NAME',
            email: 'EMAIL',
            phone: 'PHONE',
            password: 'PASSWORD',
            confirmPassword: 'CONFIRM PASSWORD',
            address: 'ADDRESS',
            city: 'CITY',
            state: 'STATE',
            companyName: 'COMPANY NAME',
            maxTenants: 'MAX NUMBER OF TENANTS',
            numBed: 'NUMBER OF BEDS',
            numBath: 'NUMBER OF BATHS',
        },
        button: 'Sign Up',
        currentUserText: 'Already have an account? ',
        signUpHighlight: 'Sign In',
        modal: 'Signing Up...',
    },
    logOut: 'Log Out',
    applianceInfo: {
        title: 'Appliances', 
        categories: {
            HVAC: 'Heating, Ventilation, and AC', 
            PLUMBING: 'Plumbing', 
            GA: 'General Appliance', 
            LE: 'Lighting and Electric',
        },
        applianceModal: {
            addTitle: 'Add Appliance',
            editTitle: 'Edit Appliance',
            category: 'CATEGORY', 
            name: 'DISPLAY NAME', 
            manufacturer: 'MANUFACTURER (optional)', 
            modelNum: 'MODEL NUMBER (optional)', 
            serialNum: 'SERIAL NUMBER (optional)', 
            location: 'LOCATION',
            add: 'Add', 
            editSave: 'Save', 
            
        },
        button: {
            title: 'Add Appliance',
        },
        details: {
            manufacturer: 'MANUFACTURER', 
            modelNum: 'MODEL NUMBER', 
            location: 'LOCATION', 
            serialNum: 'SERIAL NUMBER', 
            lastServiceBy: 'LAST SERVICE BY', 
            lastServiceDate: 'LAST SERVICE DATE',
        },
    },
    addServiceProvider: {
        title: "Add Preferred Provider",
        add: "Add", 
        phoneNumber: "PHONE NUMBER",
    },
    preferredProviderModal: {
        title: 'Preferred Provider', 
        overview: 'OVERVIEW', 
        companyEmail: 'COMPANY EMAIL', 
        phoneNum: 'COMPANY PHONE NUMBER', 
        license: 'CONTRACTOR\'S LICENCE',
        skills: 'SKILLS', 
    },
};

export default strings;
