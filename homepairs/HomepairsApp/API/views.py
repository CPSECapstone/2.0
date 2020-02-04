from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication
from .models import PropertyManager, Tenant, Property
import requests
import json

################################################################################
# CONSTANTS
#
INCORRECT_FIELDS = 'Incorrect fields'
MULTIPLE_ACCOUNTS = 'Multiple Accounts Detected'
MULTIPLE_PROPERTIES = 'Multiple properties with same address found'
STATUS = 'status'
SUCCESS = 'success'
FAIL = 'failure'
ERROR = 'error'
ROOPAIR_ACCOUNT_CREATION_FAILED = 'Failed to create a Roopairs account'
HOMEPAIRS_ACCOUNT_CREATION_FAILED = 'Failed to create a Homepairs account'
TOO_MANY_PROPERTIES = 'Too many properties associated with tenant'
PROPERTY_SQUISH = 'This address and city are associated with more than one property'
INVALID_PROPERTY = 'Invalid property'
PROPERTY_ALREADY_EXISTS = 'Property given already exists'
NON_FIELD_ERRORS = 'non_field_errors'
PROPERTY_DOESNT_EXIST = 'Property does not exists.'
NOT_PROP_OWNER = 'You are not the property owner'
TOKEN = 'token'
RESIDENTIAL_CODE = 1
INCORRECT_CREDENTIALS = ['Unable to log in with provided credentials.']

BASE_URL = 'https://capstone.api.roopairs.com/v0/'

################################################################################
# Functions
#
def returnError(error):
   return {STATUS: FAIL, ERROR: error}

def getPropertyManager(pmEmail):
   pmList = PropertyManager.objects.filter(email=pmEmail)
   if pmList.exists():
      if pmList.count() == 1:
         thisPM = pmList[0]
         propertyList = Property.objects.filter(pm=thisPM)
         sendPropList = []
         for prop in propertyList:
            tempProp = prop.toDictNoRecurs()
            sendPropList.append(tempProp)
         return {
                   STATUS: SUCCESS,
                   'pm': thisPM.toDict(),
                   'properties': sendPropList,
                }
      return returnError(MULTIPLE_ACCOUNTS)
   return returnError(INCORRECT_FIELDS)

def getTenant(tenantEmail, tenantPassword):
   tenantList = Tenant.objects.filter(email=tenantEmail, password=tenantPassword)
   if tenantList.exists():
      if tenantList.count() == 1:
         tenant = tenantList[0]
         tenantProperty = tenant.place
         return {
                   STATUS: SUCCESS,
                   'tenant': tenant.toDict(),
                }
      return {STATUS: FAIL, ERROR: MULTIPLE_ACCOUNTS}
   return {STATUS: FAIL, ERROR: INCORRECT_FIELDS}

def getProperty(pmEmail, streetAddress, city, state):
    pmList = PropertyManager.objects.filter(email=pmEmail)
    if pmList.exists() and pmList.count() == 1:
      pm = pmList[0]
      propList = Property.objects.filter(streetAddress=streetAddress, city=city, state=state, pm=pm)
      if propList.exists():
         if propList.count() == 1:
            prop = propList[0]
            return {
                      STATUS: SUCCESS,
                      'prop': prop.toDictNoRecurs(),
                   }
         return {STATUS: FAIL, ERROR: MULTIPLE_PROPERTIES}
      return {STATUS: FAIL, ERROR: INCORRECT_FIELDS}
    return {STATUS: FAIL, ERROR: INCORRECT_FIELDS}

def addNewProperties(pmEmail, token):
   # This is for requesting properties from them
   url = BASE_URL + "service-locations/"
   tokenSend = "Token " + token
   properties = requests.get(url, headers={"Authorization": tokenSend})

   # Now check each of the properties against the database to see if
   # any of them are new
   # For now we will just assign them a default bed, bath and tenants
   # of 1 since front end is not set up to ask them yet
   for prop in properties.json():
      addy = prop.get('physical_address_formatted').split(',')
      tempStreetAddress = addy[0].strip()
      tempCity = addy[1].strip()
      tempState = addy[2].strip().split(' ')[0].strip()
      others = Property.objects.filter(streetAddress=tempStreetAddress,
                                       city = tempCity,
                                       state = tempState)
      if not others.exists():
         # We know the pm account exists in our database and only ours
         # since we checked earlier and it didn't fail so we don't have
         # to check it
         tempPM = PropertyManager.objects.filter(email=pmEmail)[0]

         # That means the property is not already in the database
         prop = Property(streetAddress=tempStreetAddress,
                         city=tempCity,
                         state=tempState,
                         numBed=1,
                         numBath=1,
                         maxTenants=1,
                         pm = tempPM)
         prop.save()

def pmLogin(request):
   url = BASE_URL + 'auth/login/'

   if 'email' in request.data and 'password' in request.data:
      pmEmail = request.data.get('email')
      pmPass = request.data.get('password')
      data = {
                'username': pmEmail,
                'password': pmPass
             }
      response = requests.post(url, json=data)

      info = json.loads(response.text)

      if NON_FIELD_ERRORS in info:
         return returnError(info.get(NON_FIELD_ERRORS))
      elif TOKEN in info:

         if(not PropertyManager.objects.filter(email=pmEmail).exists()):
            # THen they don't exist in our database
            pmFirstName = info.get('first_name')
            pmLastName = info.get('last_name')
            pmEmail = info.get('email')
            tempPM = PropertyManager(firstName=pmFirstName,
                                     lastName=pmLastName,
                                     email=pmEmail)
            tempPM.save()

         tempDict = getPropertyManager(pmEmail)

         if tempDict[STATUS] == FAIL:
            return returnError('%s: %s' % (HOMEPAIRS_ACCOUNT_CREATION_FAILED, tempDict[ERROR]))

         addNewProperties(pmEmail, info.get(TOKEN))

         tempDict = getPropertyManager(pmEmail)
         tempDict[TOKEN] = info.get(TOKEN)
         return tempDict
   else:
      return returnError(INCORRECT_FIELDS)

def tenantLogin(request):
   if 'email' in request.data and 'password' in request.data:
      tenantEmail = request.data.get('email')
      tenantPass = request.data.get('password')
      return getTenant(tenantEmail, tenantPass)
   else:
      return returnError(INCORRECT_FIELDS)

################################################################################
# Views / API Endpoints
#

@api_view(['GET', 'POST'])
def login(request):
   tenantTest = tenantLogin(request)
   if tenantTest.get(STATUS) == SUCCESS:
      tenantTest['role'] = 'tenant'
      return Response(data=tenantTest)

   pmTest = pmLogin(request)
   if pmTest.get(STATUS) == SUCCESS:
      pmTest['role'] = 'pm'

   return Response(data=pmTest)

@api_view(['GET', 'POST'])
def tenantRegister(request):
   if ('firstName' in request.data and 'lastName' in request.data and
       'email' in request.data and
       'password' in request.data and 'streetAddress' in request.data and
       'city' in request.data):
      tenFirstName = request.data.get('firstName')
      tenLastName = request.data.get('lastName')
      tenEmail = request.data.get('email')
      tenStreet = request.data.get('streetAddress')
      tenCity = request.data.get('city')
      tenPass = request.data.get('password')
      tenPropList = Property.objects.filter(streetAddress=tenStreet, city=tenCity)
      if tenPropList.exists():
         if tenPropList.count() < 2:
            tenProp = tenPropList[0]
            tenPM = tenProp.pm
            ten = Tenant(firstName=tenFirstName,
                         lastName=tenLastName,
                         email=tenEmail,
                         password=tenPass,
                         place=tenProp,
                         pm = tenPM)
            ten.save()

            return Response(data=tenantLogin(request))
         else:
            return Response(data=returnError(TOO_MANY_PROPERTIES))
      else:
         return Response(data=returnError(INVALID_PROPERTY))
   else:
      return Response(data=returnError(INCORRECT_FIELDS))

@api_view(['GET', 'POST'])
def pmRegister(request):
   url = BASE_URL + 'auth/register/'

   if ('firstName' in request.data and 'lastName' in request.data and
       'email' in request.data and 'password' in request.data):
      pmFirstName = request.data.get('firstName')
      pmLastName = request.data.get('lastName')
      pmEmail = request.data.get('email')
      pmPass = request.data.get('password')
      pmCompanyName = '%s %s Property Rental' % (pmFirstName, pmLastName)
      data = {
                'first_name': pmFirstName,
                'last_name': pmLastName,
                'email': pmEmail,
                'password': pmPass,
                'internal_client': {
                                      'name': pmCompanyName,
                                      'industry_type': RESIDENTIAL_CODE
                                   }
             }
      response = requests.post(url, json=data)
      info = json.loads(response.text)

      if NON_FIELD_ERRORS in info:
         return Response(returnError(ROOPAIR_ACCOUNT_CREATION_FAILED))
      elif TOKEN in info:
         tempPM = PropertyManager(
                                    firstName=pmFirstName,
                                    lastName=pmLastName,
                                    email=pmEmail)
         tempPM.save()
         tempDict = getPropertyManager(pmEmail)
         if tempDict[STATUS] == FAIL:
            return Response(data=returnError(HOMEPAIRS_ACCOUNT_CREATION_FAILED))
         tempDict[TOKEN] = info.get(TOKEN)
         return Response(data=tempDict)
      else:
         return Response(data=info)
   else:
      return Response(data=returnError(INCORRECT_FIELDS))

@api_view(['GET', 'POST'])
def createProperty(request):
   url = BASE_URL + 'service-locations/'

   if ('streetAddress' in request.data and 'city' in request.data and 'state' in request.data
    and 'pm' in request.data and 'numBed' in request.data and 'numBath' in request.data
    and 'maxTenants' in request.data and 'token' in request.data):
      streetAddress = request.data.get('streetAddress')
      city = request.data.get('city')
      state = request.data.get('state')
      pm = request.data.get('pm')
      numBed = request.data.get('numBed')
      numBath = request.data.get('numBath')
      maxTenants = request.data.get('maxTenants')
      token = request.data.get('token')
      sendAddress = streetAddress + ", " + city + ", " + state

      #data = {
      #          'physical_address': sendAddress
      #       }
      #sendToken = "Token " + token
      #response = requests.post(url, json=data, headers={"Authorization": sendToken})
      #print("HERE 1")
      #print(response.text)
      #print("HERE 2")
      #info = json.loads(response.text)
      #print("HERE 3")
      #if NON_FIELD_ERRORS in info:
      #    return Response(returnError(info.get(NON_FIELD_ERRORS)))
      #elif TOKEN in info:
      #    addy = response.get('physical_address_formatted').split(',')
      #    tempStreetAddress = addy[0].strip()
      #    tempCity = addy[1].strip()
      #    tempState = addy[2].strip().split(' ')[0].strip()
      #    isMade = Property.objects.filter(streetAddress=streetAddress, city=city, state=state)
      #    if not isMade.exists():
      #      pmList = PropertyManager.objects.filter(email=pm)
      #      if pmList.exists() and pmList.count() == 1:
      #        pm = pmList[0]
      #        prop = Property(streetAddress=streetAddress,
      #                   city=city,
      #                   state=state,
      #                   numBed=numBed,
      #                   numBath=numBath,
      #                   maxTenants=maxTenants,
      #                   pm = pm)
      #        prop.save()
      #        data = {
      #                STATUS: SUCCESS
      #               }
      #        return Response(data=data)
      #      else:

      #        return Response(data=returnError(INCORRECT_FIELDS))
      #    else:
      #      return Response(data=returnError(PROPERTY_ALREADY_EXISTS))

      isMade = Property.objects.filter(streetAddress=streetAddress, city=city, state=state)
      if not isMade.exists():
        pmList = PropertyManager.objects.filter(email=pm)
        if pmList.exists() and pmList.count() == 1:
          pm = pmList[0]
          prop = Property(streetAddress=streetAddress,
                     city=city,
                     state=state,
                     numBed=numBed,
                     numBath=numBath,
                     maxTenants=maxTenants,
                     pm = pm)
          prop.save()
          data = {
                  STATUS: SUCCESS
                 }
          return Response(data=data)
        else:

          return Response(data=returnError(INCORRECT_FIELDS))
      else:
        return Response(data=returnError(PROPERTY_ALREADY_EXISTS))
   else:
      return Response(data=returnError(INCORRECT_FIELDS))

@api_view(['GET', 'POST'])
def updateProperty(request):
   if ('streetAddress' in request.data and 'city' in request.data and 'state' in request.data
    and 'pm' in request.data and 'numBed' in request.data and 'numBath' in request.data
    and 'maxTenants' in request.data and 'oldStreetAddress' in request.data
    and 'oldCity' in request.data):
      oldStreetAddress = request.data.get('oldStreetAddress')
      oldCity = request.data.get('oldCity')
      streetAddress = request.data.get('streetAddress')
      city = request.data.get('city')
      state = request.data.get('state')
      pm = request.data.get('pm')
      numBed = request.data.get('numBed')
      numBath = request.data.get('numBath')
      maxTenants = request.data.get('maxTenants')

      # The Property
      thePropertyList = Property.objects.filter(streetAddress=oldStreetAddress, city=oldCity)

      if thePropertyList.exists():
        if thePropertyList.count() == 1:
           theProperty = thePropertyList[0]
           if theProperty.pm.email == pm:
              theProperty.city = city
              theProperty.state = state
              theProperty.numBed = numBed
              theProperty.numBath = numBath
              theProperty.maxTenants = maxTenants
              theProperty.streetAddress = streetAddress
              theProperty.save()
              return Response(data={STATUS: SUCCESS})
           else:
              return Response(data=returnError(NOT_PROP_OWNER))
        else:
          return Response(data=returnError(PROPERTY_SQUISH))
      else:
        return Response(data=returnError(PROPERTY_DOESNT_EXIST))
   else:
      return Response(data=returnError(INCORRECT_FIELDS))

@api_view(['GET', 'POST'])
def viewProperty(request):
   if ('streetAddress' in request.data and 'city' in request.data and 'state' in request.data
    and 'pm' in request.data):
      streetAddress = request.data.get('streetAddress')
      city = request.data.get('city')
      state = request.data.get('state')
      pmEmail = request.data.get('pm')
      prop = getProperty(pmEmail, streetAddress, city, state)
      return Response(data=prop)

@api_view(['GET', 'POST'])
def setUpTests(request):
   if ('email' in request.data and 'password' in request.data):
      inEmail = request.data.get('email')
      inPass = request.data.get('password')
      if(inEmail=='adamkberard@gmail.com' and inPass == 'pass4testing'):
         PropertyManager.objects.all().delete()
         Property.objects.all().delete()
         Tenant.objects.all().delete()
         tempPM = PropertyManager(firstName='Eeron',
                                  lastName='Grant',
                                  email='eerongrant@gmail.com')
         tempProperty1 = Property(streetAddress='537 Couper Dr.',
                                  city='San Luis Obispo',
                                  state='CA',
                                  numBath=2,
                                  numBed=5,
                                  maxTenants=8,
                                  pm=tempPM)
         tempProperty2 = Property(streetAddress='200 N. Santa Rosa',
                                  city='San Luis Obispo',
                                  state='CA',
                                  numBath=2,
                                  numBed=3,
                                  maxTenants=5,
                                  pm=tempPM)
         tempTenant = Tenant(firstName='Adam',
                             lastName='Berard',
                             email='adamkberard@gmail.com',
                             password='pass4adam',
                             place=tempProperty2,
                             pm=tempPM)
         tempPM.save()
         tempProperty1.save()
         tempProperty2.save()
         tempTenant.save()

      return Response()

@api_view(['GET', 'POST'])
def tearDownTests(request):
   if ('email' in request.data and 'password' in request.data):
      inEmail = request.data.get('email')
      inPass = request.data.get('password')
      if(inEmail=='adamkberard@gmail.com' and inPass == 'pass4testing'):
         PropertyManager.objects.all().delete()
         Property.objects.all().delete()
         Tenant.objects.all().delete()
   return Response()