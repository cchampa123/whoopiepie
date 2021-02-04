from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class MovementClass(models.Model):
    name = models.CharField(max_length=30, blank=True, unique=True)
    metric_type = models.CharField(choices = (('Reps', 'Reps'),
                                          ('Distance', 'Distance'),
                                          ('Calories', 'Calories')),
                              max_length=20)
    metric = models.CharField(choices = (('Weight', 'Weight'),
                                         ('Time', 'Time')),
                              max_length=20)

    def __str__(self):
        return self.name

class Workout(models.Model):
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    scheduled_for = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username + ' ' + str(self.scheduled_for)

class Section(models.Model):
    metric_type = models.CharField(choices = (('AMRAP', 'AMRAP'),
                                              ('For Time', 'For Time')),
                                   max_length=20)
    rounds = models.PositiveIntegerField(default=1)
    time = models.DurationField(blank=True, null=True)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='sections')

class MovementInstance(models.Model):
    name = models.ForeignKey(MovementClass, on_delete=models.CASCADE)
    metric_type_value = models.PositiveIntegerField(blank=True)
    metric_value = models.PositiveIntegerField(blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='movements')

    def __str__(self):
        return self.name.name
