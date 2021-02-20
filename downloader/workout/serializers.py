from rest_framework import serializers
from .models import *

class MovementClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovementClass
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = (
            'id',
            'start_time',
            'end_time',
            'scheduled_for',
            'user',
            'sections'
        )

class SectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Section
        fields = (
            'id',
            'metric_type',
            'rounds',
            'time',
            'workout',
            'movements',
            'section_type'
            )

class MovementInstanceSerializer(serializers.ModelSerializer):
    completed_on = serializers.StringRelatedField(source='section.workout.end_time')
    class Meta:
        model = MovementInstance
        fields = '__all__'
