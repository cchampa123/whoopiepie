import django_filters
from .models import Workout

class WorkoutFilter(django_filters.FilterSet):
    class Meta:
        model = Workout
        
