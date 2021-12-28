from django.urls import path, include
#from .api import LoginAPI, UserAPI
from two_factor.urls import urlpatterns as tf_urls
from two_factor.views import (
    BackupTokensView, DisableView, LoginView, PhoneDeleteView, PhoneSetupView,
    ProfileView, QRGeneratorView, SetupCompleteView, SetupView,
)
from .views import ForceSetupBeforeLogin, RedirectSetupCompleteView, InlineSetupView
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
    path(
        'two_factor/setup/complete/',
        RedirectSetupCompleteView.as_view(),
        name='setup_complete',
    ),
]
