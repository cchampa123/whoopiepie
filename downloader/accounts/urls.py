from django.urls import path, include
from .api import LoginAPI, UserAPI
from knox import views as knox_views

urlpatterns = [
    #path('', include('knox.urls')),
    path('login', LoginAPI.as_view()),
    path('user', UserAPI.as_view()),
    path('logout', knox_views.LogoutView.as_view(), name='knox_logout')
]
