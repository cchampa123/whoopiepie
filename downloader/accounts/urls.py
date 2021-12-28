from django.urls import path, include
#from .api import LoginAPI, UserAPI
from two_factor.views import (
    LoginView, QRGeneratorView, SetupView
)
from .views import ForceSetupBeforeLogin, InlineSetupView
app_name='accounts'
urlpatterns = [
    path(
        'login/',
        ForceSetupBeforeLogin.as_view(),
        name='login',
    ),
    path(
        'two_factor/setup/',
        InlineSetupView.as_view(),
        name='setup',
    ),
    path(
        'two_factor/qrcode/',
        QRGeneratorView.as_view(),
        name='qr',
    ),
]
