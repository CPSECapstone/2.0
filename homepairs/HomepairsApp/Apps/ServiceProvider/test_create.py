################################################################################
# Imports
from unittest import mock

from django.conf import settings
from django.test import TestCase

from ..helperFuncsForTesting import getInfoPost, getInfoGet, setUpHelper
# from ..Properties.models import Property
# from ..PropertyManagers.models import PropertyManager
from .views import STATUS, SUCCESS
# from .views import FAIL

################################################################################
# Vars

globUrl = settings.TEST_URL

# EXTRA URLS
PRO_VIEW = 'service_provider_view'

################################################################################
# Tests


class CreateServiceProvider(TestCase):
    def setUp(self):
        setUpHelper()

    mockVal = {"token": "cb3e47056453b655d9f9052f7368dfe170e91f39"}
    mockVal2 = {'id': 'd1oDOK5', 'physical_address_formatted': '130 Grand Ave, San Luis Obispo, CA 93405, USA'}
    @mock.patch('Apps.PropertyManagers.views.postRooAPI', return_value=mockVal, autospec=True)
    @mock.patch('Apps.Properties.views.postRooTokenAPI', return_value=mockVal2, autospec=True)
    def test_create_provider_allCorrect(self):
        '''Everything is correct'''
        name = 'McDs'
        email = 'mcds@gmail.com'
        phoneNum = '8007733030'
        contractLic = '681234'
        skills = 'can cook burgers okay'
        founded = '2014-04-07'

        data = {
                  'name': name,
                  'email': email,
                  'phoneNum': phoneNum,
                  'contractLic': contractLic,
                  'skills': skills,
                  'founded': founded,
               }
        responseData = getInfoPost(PRO_VIEW, data)
        self.assertEqual(responseData.get(STATUS), SUCCESS)

        phoneNum = responseData.get('phoneNum')
        data = {
                  'phoneNum': phoneNum
               }

        responseData = getInfoGet(PRO_VIEW, data)

        self.assertEqual(responseData.get(STATUS), SUCCESS)

        pro = responseData.get('pro')
        self.assertEqual(pro.get('name'), name)
        self.assertEqual(pro.get('email'), email)
        self.assertEqual(pro.get('phoneNum'), phoneNum)
        self.assertEqual(pro.get('contractLic'), contractLic)
        self.assertEqual(pro.get('skills'), skills)

    # Test that passes bad propId
    # def test_create_pro_bad_date(self):
    #     '''Incorrect Fields Being Sent'''
    #     name = 'McDs'
    #     email = 'mcds@gmail.com'
    #     phoneNum = '8007733030'
    #     contractLic = '681234'
    #     skills = 'can cook burgers okay'
    #     founded = 'bad'
    #
    #     data = {
    #               'name': name,
    #               'email': email,
    #               'phoneNum': phoneNum,
    #               'contractLic': contractLic,
    #               'skills': skills,
    #               'founded': founded,
    #            }
    #     responseData = getInfoPost(PRO_VIEW, data)
    #
    #     self.assertEqual(responseData.get(STATUS), FAIL)
    #     self.assertEqual(responseData.get(ERROR), PROPERTY_DOESNT_EXIST)
