from django.contrib import admin
from django.urls import path, include
from .api import WorkoutViewSet, MovementInstanceViewSet, MovementClassViewSet, SectionViewSet, LoginAPI
from rest_framework import routers

router = routers.DefaultRouter()
router.register('movement_instance', MovementInstanceViewSet, basename='MovementInstance')
router.register('movement_class', MovementClassViewSet, basename='MovementClass')
router.register('workout', WorkoutViewSet, basename='Workout')
router.register('section', SectionViewSet, basename='Section')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPI.as_view())
]
