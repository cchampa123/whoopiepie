from django.contrib import admin
from django.urls import path, include
from .api import YoutubeUrlView, LoginAPI, UserAPI, PlexPlaylistView
from rest_framework import routers

router = routers.DefaultRouter()
router.register('playlist', PlexPlaylistView, basename='PlexPlaylist')

urlpatterns = [
    path('youtube_url/', YoutubeUrlView.as_view()),
    path('login/', LoginAPI.as_view()),
    path('user/', UserAPI.as_view()),
    path('', include(router.urls))

]
