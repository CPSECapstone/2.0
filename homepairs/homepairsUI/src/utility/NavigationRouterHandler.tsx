/* eslint-disable react/jsx-props-no-spreading */
import { NavigationStackProp } from 'react-navigation-stack';
import { RouteProps, withRouter} from 'react-router-dom';
import { NavigationSwitchProp, withNavigation } from 'react-navigation';
import { isNullOrUndefined } from 'src/utility/ParameterChecker';
import { Platform } from 'react-native';
import React from 'react';
import {navigationPages} from 'homepairs-routes';

type Navigators = NavigationStackProp | RouteProps | NavigationSwitchProp

const {PropertiesScreen, TenantProperty, ServiceRequestScreen, AccountSettings} = navigationPages;
const BASE_ROUTES: string[] = [PropertiesScreen, TenantProperty, ServiceRequestScreen, AccountSettings]

/**
 * ---------------------------------------------------
 * Prepare Route Helper
 * ---------------------------------------------------
 * A helper function that takes in the parameters passed into the navigator and appends these 
 * objects into url string. It first sorts the object into alphabetical order and then adds the 
 * values to the string.This function is intended to be used for react-router-dom objects
 * @param route -the base route passed 
 * @param params -values to be appended to the route
 */
export function prepareRoute(route:string, params?:any){
    // We need to proccess any potential params passed in via web router. This is achieved through sorting and 
    // appending the value of the params through the string. All values are sorted in ASCII order. 
    const passedParams = isNullOrUndefined(params) ? {} : params;
    const sortedItems = Object.entries(passedParams).sort((a, b) => b[0].localeCompare(a[0]));
    let fullRoute = `${route}`;
    sortedItems.forEach(item => {
        const [, value] = item;
        if(!isNullOrUndefined(value)){
            fullRoute = `${fullRoute}/${typeof value === 'object' ? JSON.stringify(value) : value}`;
        }
    });
    return fullRoute;
}

/**
 * ---------------------------------------------------
 * Navigation-Route Handler  
 * ---------------------------------------------------
 * Since the Homepairs application is going to be a PWA, it is necessary for the application to be able to run on 
 * both mobile and webdevices. Using expo, we initially decided that it would be wise to use react-navigation. This 
 * works perfectly for mobile, however, this does not allow us to navigate the web application with its fullest potential.
 * Therefore, we are forced to use both navigation-stack and react-router to achieve the full functionality of what is needed.
 * This will take the types provided from withNavigation or withRouter and property define an object that has the functionality 
 * to invoke actions based on what is passed. 
 * @param {NavigationStackProp | RouteProps | NavigationSwitchProp} navigation -a router that allows the application 
 * to navigate across endpoints/paths/screens of mobile and web apps 
 */
export default class NavigationRouteHandler{

    /**
     * Object that will hold the instance of the router or navigation objects 
     */
    navigation;

    /**
     * ---------------------------------------------------
     * createFromProps 
     * ---------------------------------------------------
     * A helper method that renders a navigation Route Handler object from props passed/injected into a react component. 
     * This function assumes that the user is passing in the correct property for the platform that they are using. Otherwise, 
     * a instance of the NavigationRouteHandler object will be built with an undefined object 
     * @param {any} props 
     */
    static createFromProps(props:any){
        const {navigation, history, match, location } = props;
        const navObject = Platform.OS === 'web' ? {history, match, location} : {navigation};
        // Case if the navigation has already been converted to a NavigationRouteHandler.
        if(!isNullOrUndefined(navigation) && navigation instanceof NavigationRouteHandler){
            return navigation;
        }
        
        return new NavigationRouteHandler(navObject);
    }

    constructor(navigation: Navigators){
        this.navigation = navigation; 
    }

    /**
     * Invokes a forward navigation to a page on the navigation route stack. 
     * @param {string} route -the route a navigator should go to
     * @param {any} params -the data to be stored into the url for proper rendering
     * @param {boolean} asBackground -Indicates if the state of the navigation object should be a modal only 
     * works for react-router
     */
    // TODO: pass in state param to allow user to pass in state for router 
    navigate(route:string, params?:any, asBackground?:boolean){
        if(isNullOrUndefined(this.navigation.navigate)){
            const {location, history} = this.navigation;
            const fullRoute = prepareRoute(route, params);
           
            if(asBackground)
                history.push(fullRoute, {background: location});
            else
                history.push(fullRoute);
        } else {
          this.navigation.navigate(route, params);  
        }
    }

    /**
     * Invokes a standard push to the navigation route stack. On switch navigators, it simply navigates
     * @param {string} route -the route a navigator should go to
     * @param {any} params -the data to be stored into the url for proper rendering
     * @param {boolean} asBackground -Indicates if the state of the navigation object should be a modal only 
     */
    push(route:string, params?:any, asBackground?:boolean){
        if(isNullOrUndefined(this.navigation.navigate)){
            const fullRoute = prepareRoute(route, params);
            const {location, history} = this.navigation;
            if(asBackground){
                history.push(fullRoute, {background: location});
            }
            else{
                history.push(fullRoute);
            }
        } else if(!isNullOrUndefined(this.navigation.push)){
            this.navigation.push(route, {params});
        } else { // TODO: Might want to throw error instead 
            this.navigation.navigate(route);
        }
    }

    /**
     * Invokes the goBackFunction. All possible router objects have built in goBack Functions. 
     */
    goBack(){
        if(isNullOrUndefined(this.navigation.navigate)){
            this.navigation.history.goBack();
            return;
        }
        this.navigation.goBack();
    }

    /**
     * Invokes the pop action an a navigation stack object or goes back the equivalent amount on a router object 
     * If this is invoked on a navigation switch object, an error is printed
     * @param {number} amount -Amount of pages to navigate backwards from 
     * @param {any} params -Parameters to passed when navigating backward
     */
    pop(amount?:number, params?:any){
        if(!isNullOrUndefined(this.navigation.pop)){
            (this.navigation as NavigationStackProp).pop(amount);
        } else if(isNullOrUndefined(this.navigation.navigate)){
            (this.navigation.history as RouteProps).go(amount * -1);
        } else { // TODO: Might want to throw error instead 
            console.log('Error: Will not call prop on an undefined function. Most likely you are attempting to pop a navigationSwitch object');
        }
    }

    /**
     * Retrieves a value from the navigation state or url. This is initally passed before navigation
     * @param {string} param -key of the parameter stored 
     */
    getParam(param:string){
        if(!isNullOrUndefined(this.navigation.navigate))
            return this.navigation.getParam(param);
        let value = this.navigation.match.params[param];
        try{
            value = JSON.parse(value);
        }catch(error){
            console.log('This is not a valid object');
        }
        return value;
    }

    /**
     * Checks to see if the base homepairs route is the current location of the navigator. Returns a 
     * boolean value based on the result. The Base Routes are pre-defined. 
     */
    isNavigatorAtBaseRoute(){
        let route: string;
        if(isNullOrUndefined(this.navigation.navigate))
            route = this.navigation.location.pathName;
        else 
            route = this.navigation.state.routeName;
        return BASE_ROUTES.includes(route);
    };
}

/**
 * ---------------------------------------------------
 * With Navigation-Route Handler  
 * ---------------------------------------------------
 * A high order component that injects a NavigationRouteHandler object into a component. This should be called 
 * first and expects itself to be passed a NavigationSwitch, NavigationStack, or Route object. 
 * @param {any} Component 
 */
export function withNavigationRouteHandler(Component: any){
    return function BaseComponent(props:any){
        const navigation = NavigationRouteHandler.createFromProps(props);
        return(
            <Component {...props} navigation={navigation} />
        );
    };
}

/**
 * ---------------------------------------------------
 * Prepare Navigation Handler Component
 * ---------------------------------------------------
 * A helper function that prepares a component for navigation whether is it render for website or mobile 
 * applications. This function is only intended to be used with components that will actually use these 
 * objects.
 * @param {any} Component -the component that will be able to use router or navigation objects 
 */
export function prepareNavigationHandlerComponent(Component: any){
    const NavigableComponent = withNavigationRouteHandler(Component);
    return Platform.OS === 'web' ? withRouter(NavigableComponent) : withNavigation(NavigableComponent);
} 