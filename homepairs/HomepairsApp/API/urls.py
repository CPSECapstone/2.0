from django.urls import path

from . import views


urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/tenant/', views.tenantRegister, name='tenant_registration'),
    path('register/pm/', views.pmRegister, name='property_manager_registration'),
    path('property/create/', views.createProperty, name='create_prop'),
    path('property/view/', views.viewProperty, name='view_prop'),
    path('property/update/', views.updateProperty, name='update_prop'),
    path('setUpTests/', views.setUpTests, name='setup'),
    path('tearDownTests/', views.tearDownTests, name='teardown'),
]
