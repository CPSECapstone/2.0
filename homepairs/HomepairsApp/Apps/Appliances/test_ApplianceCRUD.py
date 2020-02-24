################################################################################
# Imports
from django.test import TestCase

from .helperFuncsForTesting import getInfo, setUpHelper, tearDownHelper
from .models import Property
from .views import ERROR, FAIL, PROPERTY_DOESNT_EXIST, STATUS, SUCCESS


################################################################################
# Vars

CREATE_APP = 'create_appliance'
VIEW_APP = 'view_appliance'
UPDATE_APP = 'update_appliance'
LOGIN = 'login'

################################################################################
# Tests


class CreateAppliance(TestCase):
    def setUp(self):
        setUpHelper()

    def tearDown(self):
        tearDownHelper()

    @classmethod
    def tearDownClass(self):
        setUpHelper()

    def test_create_appliance_allCorrect(self):
        '''Everything is correct'''
        name = 'Fridge'
        manufacturer = 'Company'
        category = 'cool'
        modelNum = 68
        serialNum = 70
        location = 'Garage'
        propId = Property.objects.filter()[0].id

        data = {
                  'name': name,
                  'manufacturer': manufacturer,
                  'category': category,
                  'modelNum': modelNum,
                  'serialNum': serialNum,
                  'location': location,
                  'propId': propId,
               }
        responseData = getInfo(CREATE_APP, data)
        self.assertEqual(responseData.get(STATUS), SUCCESS)

        appId = responseData.get('id')
        data = {
                  'appId': appId
               }

        responseData = getInfo(VIEW_APP, data)

        self.assertEqual(responseData.get(STATUS), SUCCESS)
        app = responseData.get('app')
        self.assertEqual(app.get('name'), name)
        self.assertEqual(app.get('manufacturer'), manufacturer)
        self.assertEqual(app.get('category'), category)
        self.assertEqual(app.get('modelNum'), modelNum)
        self.assertEqual(app.get('serialNum'), serialNum)
        self.assertEqual(app.get('location'), location)

    # Test that passes bad propId
    def test_CREATE_APP_bad_address(self):
        '''Incorrect Fields Being Sent'''
        name = 'Fridge'
        manufacturer = 'Company'
        category = 'cool'
        modelNum = 68
        serialNum = 70
        location = 'Garage'

        data = {
                  'name': name,
                  'manufacturer': manufacturer,
                  'category': category,
                  'modelNum': modelNum,
                  'serialNum': serialNum,
                  'location': location,
                  'propId': -1,
               }
        responseData = getInfo(CREATE_APP, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
        self.assertEqual(responseData.get(ERROR), PROPERTY_DOESNT_EXIST)


class UpdateAppliance(TestCase):
    def setUp(self):
        setUpHelper()

    def tearDown(self):
        tearDownHelper()

    @classmethod
    def tearDownClass(self):
        setUpHelper()

    def test_update_appliance_allCorrect(self):
        '''Everything is correct, I create the property first, then update it.'''
        name = 'Fridge'
        manufacturer = 'Company'
        category = 'cool'
        modelNum = 68
        serialNum = 70
        location = 'Garage'
        propId = Property.objects.filter()[0].id

        data = {
                  'name': name,
                  'manufacturer': manufacturer,
                  'category': category,
                  'modelNum': modelNum,
                  'serialNum': serialNum,
                  'location': location,
                  'propId': propId,
               }
        responseData = getInfo(CREATE_APP, data)

        self.assertEqual(responseData.get(STATUS), SUCCESS)

        newName = 'freezer'
        newManufacturer = 'different company'
        newCategory = 'really cool'
        newModelNum = 1
        newSerialNum = 2
        newLocation = 'bedroom'
        appId = responseData.get('id')
        data = {
                  'newName': newName,
                  'newManufacturer': newManufacturer,
                  'newCategory': newCategory,
                  'newModelNum': newModelNum,
                  'newSerialNum': newSerialNum,
                  'newLocation': newLocation,
                  'appId': appId,
               }

        responseData = getInfo(UPDATE_APP, data)

        self.assertEqual(responseData.get(STATUS), SUCCESS)

        data = {
                  'appId': appId,
               }

        responseData = getInfo(VIEW_APP, data)

        self.assertEqual(responseData.get(STATUS), SUCCESS)
        app = responseData.get('app')
        self.assertEqual(app.get('name'), newName)
        self.assertEqual(app.get('manufacturer'), newManufacturer)
        self.assertEqual(app.get('category'), newCategory)
        self.assertEqual(app.get('modelNum'), newModelNum)
        self.assertEqual(app.get('serialNum'), newSerialNum)
        self.assertEqual(app.get('location'), newLocation)

    def test_update_app_bad_app_id(self):
        '''Incorrect Fields Being Sent'''
        name = 'Fridge'
        manufacturer = 'Company'
        category = 'cool'
        modelNum = 68
        serialNum = 70
        location = 'Garage'
        propId = Property.objects.filter()[0].id

        data = {
                  'name': name,
                  'manufacturer': manufacturer,
                  'category': category,
                  'modelNum': modelNum,
                  'serialNum': serialNum,
                  'location': location,
                  'propId': propId,
               }
        responseData = getInfo(CREATE_APP, data)

        self.assertEqual(responseData.get(STATUS), SUCCESS)

        newName = 'freezer'
        newManufacturer = 'different company'
        newCategory = 'really cool'
        newModelNum = 1
        newSerialNum = 2
        newLocation = 'bedroom'
        data = {
                  'newName': newName,
                  'newManufacturer': newManufacturer,
                  'newCategory': newCategory,
                  'newModelNum': newModelNum,
                  'newSerialNum': newSerialNum,
                  'newLocation': newLocation,
                  'appId': -1,
               }

        responseData = getInfo(UPDATE_APP, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
