from django.contrib import admin
from django.urls import path
from .api import YoutubeUrlView

urlpatterns = [
    path('youtube_url/', YoutubeUrlView.as_view()),
]
