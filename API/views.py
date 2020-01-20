from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PropertyManager, Tenant, Property
import requests
import json

################################################################################
# CONSTANTS
#
INCORRECT_FIELDS = 'Incorrect fields'
MULTIPLE_ACCOUNTS = 'Multiple Accounts Detected'
STATUS = 'status'
SUCCESS = 'success'
FAIL = 'failure'
ERROR = 'error'
ROOPAIR_ACCOUNT_CREATION_FAILED = 'Failed to create a Roopairs account'
HOMEPAIRS_ACCOUNT_CREATION_FAILED = 'Failed to create a Homepairs account'
TOO_MANY_PROPERTIES = 'Too many properties associated with tenant'
INVALID_PROPERTY = 'Invalid property'
NON_FIELD_ERRORS = 'non_field_errors'
TOKEN = 'token'
RESIDENTIAL_CODE = 1

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
         return returnError(INCORRECT_FIELDS)
      elif TOKEN in info:
         if(not PropertyManager.objects.filter(email=pmEmail).exists()):
            # THen they don't exist in our database
            pmFirstName = info.get('first_name')
            pmLastName = info.get('last_name')
            pmEmail = info.get('email')
            pmPhone = info.get('phone')
            tempPM = PropertyManager(firstName=pmFirstName,
                                     lastName=pmLastName,
                                     email=pmEmail,
                                     phone=pmPhone)
            tempPM.save()
                                           
         pm = getPropertyManager(pmEmail)
         tempDict = getPropertyManager(pmEmail)
         if tempDict[STATUS] == FAIL:
            return returnError('%s: %s' % (HOMEPAIRS_ACCOUNT_CREATION_FAILED, tempDict[ERROR]))
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

   return Response(data=pmTest)

@api_view(['GET', 'POST'])
def tenantRegister(request):
   if ('firstName' in request.data and 'lastName' in request.data and
       'email' in request.data and 'phone' in request.data and
       'password' in request.data and 'streetAddress' in request.data and
       'city' in request.data):
      tenFirstName = request.data.get('firstName')
      tenLastName = request.data.get('lastName')
      tenEmail = request.data.get('email')
      tenPhone = request.data.get('phone')
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
                         phone=tenPhone,
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
       'email' in request.data and 'phone' in request.data and
       'password' in request.data):
      pmFirstName = request.data.get('firstName')
      pmLastName = request.data.get('lastName')
      pmEmail = request.data.get('email')
      pmPhone = request.data.get('phone')
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
                                    email=pmEmail,
                                    phone=pmPhone)
         tempPM.save()
         tempDict = getPropertyManager(pmEmail)
         if tempDict[STATUS] == FAIL:
            return Response(data=returnError(HOMEPAIRS_ACCOUNT_CREATION_FAILED))
         tempDict[TOKEN] = info.get(TOKEN)
         return Response(data=tempDict)
   else:
      return Response(data=returnError(INCORRECT_FIELDS))

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
                                  email='eerongrant@gmail.com',
                                  phone='5558393823')
         tempProperty1 = Property(streetAddress='537 Couper Dr.',
                                  city='San Luis Obispo',
                                  state='CA',
                                  SLID=70,
                                  numBath=2,
                                  numBed=5,
                                  maxTenants=8,
                                  pm=tempPM)
         tempProperty2 = Property(streetAddress='200 N. Santa Rosa',
                                  city='San Luis Obispo',
                                  state='CA',
                                  SLID=69,
                                  numBath=2,
                                  numBed=3,
                                  maxTenants=5,
                                  pm=tempPM)
         tempTenant = Tenant(firstName='Adam',
                             lastName='Berard',
                             email='adamkberard@gmail.com',
                             phone='9092614646',
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
