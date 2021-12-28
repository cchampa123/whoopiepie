from django.urls import re_path

from oauth2_provider import views
from .views import ProtectedAuthorizationView

app_name = "oauth2_provider"


base_urlpatterns = [
    re_path(r"^authorize/$", ProtectedAuthorizationView.as_view(), name="authorize"),
    re_path(r"^token/$", views.TokenView.as_view(), name="token"),
    re_path(r"^revoke_token/$", views.RevokeTokenView.as_view(), name="revoke-token"),
    re_path(r"^introspect/$", views.IntrospectTokenView.as_view(), name="introspect"),
]

oidc_urlpatterns = [
    re_path(
        r"^\.well-known/openid-configuration/$",
        views.ConnectDiscoveryInfoView.as_view(),
        name="oidc-connect-discovery-info",
    ),
    re_path(r"^\.well-known/jwks.json$", views.JwksInfoView.as_view(), name="jwks-info"),
    re_path(r"^userinfo/$", views.UserInfoView.as_view(), name="user-info"),
]


urlpatterns = base_urlpatterns + oidc_urlpatterns
