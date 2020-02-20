################################################################################
# Imports

from django.conf import settings
from django.test import TestCase

from ..helperFuncsForTesting import getInfoPost, setUpHelper
from .views import ERROR, FAIL, INCORRECT_CREDENTIALS, INCORRECT_FIELDS, STATUS, SUCCESS


################################################################################
# Vars

globUrl = settings.TEST_URL

# EXTRA URLS
LOGIN = 'tenant_login'

################################################################################
# Tests
# Tenant Login Tests


class TenantLogin(TestCase):

    def setUp(self):
        setUpHelper()

    def test_tenant_allCorrect(self):
        '''Everything is correct'''
        email = 'adamkberard@gmail.com'
        password = 'pass4adam'
        data = {'email': email, 'password': password}

        responseData = getInfoPost(LOGIN, data)

        self.assertEqual(responseData.get(STATUS), SUCCESS)
        tenant = responseData.get('tenant')
        self.assertEqual(tenant.get('firstName'), 'Adam')
        self.assertEqual(tenant.get('lastName'), 'Berard')
        self.assertEqual(tenant.get('email'), 'adamkberard@gmail.com')
        self.assertEqual(tenant.get('password'), 'pass4adam')
        tenProp = responseData.get('properties')[0]
        self.assertEqual(tenProp.get('streetAddress'), '200 N. Santa Rosa')
        self.assertEqual(tenProp.get('city'), 'San Luis Obispo')
        self.assertEqual(tenProp.get('state'), 'CA')
        self.assertEqual(tenProp.get('numBath'), 2)
        self.assertEqual(tenProp.get('numBed'), 3)
        self.assertEqual(tenProp.get('maxTenants'), 5)
        self.assertEqual(tenProp.get('pm'), 'Eeron Grant')
        pm = tenant.get('pm')[0]
        self.assertEqual(pm.get('firstName'), 'Eeron')
        self.assertEqual(pm.get('lastName'), 'Grant')
        self.assertEqual(pm.get('email'), 'eerongrant@gmail.com')

    def test_tenant_incorrectEmail(self):
        '''Incorrect Email'''
        data = {'email': 'damkberard@gmail.com', 'password': 'pass4adam'}
        responseData = getInfoPost(LOGIN, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
        self.assertEqual(responseData.get(ERROR), INCORRECT_CREDENTIALS)

    def test_tenant_incorrectPass(self):
        '''Incorrect Pass'''
        data = {'email': 'adamkberard@gmail.com', 'password': 'adamisNOTcool'}
        responseData = getInfoPost(LOGIN, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
        self.assertEqual(responseData.get(ERROR), INCORRECT_CREDENTIALS)

    def test_tenant_incorrectPassAndEmail(self):
        '''Incorrect Pass & Email'''
        data = {'email': 'adam@m.com', 'password': 'adamisNOTcool'}
        responseData = getInfoPost(LOGIN, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
        self.assertEqual(responseData.get(ERROR), INCORRECT_CREDENTIALS)

    def test_tenant_incorrectEmailField(self):
        '''No Email Field'''
        data = {'gmail': 'adam@m.com', 'password': 'adamisNOTcool'}
        responseData = getInfoPost(LOGIN, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
        self.assertEqual(responseData.get(ERROR), INCORRECT_FIELDS + ": email")

    def test_tenant_incorrectPassField(self):
        '''No Pass Field'''
        data = {'email': 'adam@m.com', 'assword': 'adamisNOTcool'}
        responseData = getInfoPost(LOGIN, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
        self.assertEqual(responseData.get(ERROR), INCORRECT_FIELDS + ": password")

    def test_tenant_incorrectFields(self):
        '''No Correct Fields'''
        data = {'gmail': 'adam@m.com', 'assword': 'adamisNOTcool'}
        responseData = getInfoPost(LOGIN, data)

        self.assertEqual(responseData.get(STATUS), FAIL)
        self.assertEqual(responseData.get(ERROR), INCORRECT_FIELDS + ": email password")
