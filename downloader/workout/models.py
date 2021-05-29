from django.db import models
from accounts.models import User
from datetime import timedelta

# Create your models here.
class WhoopiePieUser(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key=True)

    def __str__(self):
        return "{} {}".format(self.user.first_name, self.user.last_name)

class CountTypes(models.Model):
    count_type = models.CharField(max_length = 20, primary_key = True)

    def __str__(self):
        return self.count_type

class ScoreTypes(models.Model):
    score_type = models.CharField(max_length = 20, primary_key = True)

    def __str__(self):
        return self.score_type

class MovementClass(models.Model):
    name = models.CharField(primary_key=True, max_length = 100)
    count_types = models.ManyToManyField(CountTypes)
    score_types = models.ManyToManyField(ScoreTypes)

    def __str__(self):
        return self.name

class Workout(models.Model):
    user = models.ForeignKey(WhoopiePieUser, on_delete=models.CASCADE)
    date = models.DateField()
    complete = models.BooleanField(default=False)

    def __str__(self):
        return "{} {} Workout - {}".format(
            self.user.user.first_name,
            self.user.user.last_name,
            self.date
        )

class Section(models.Model):
    ROUND_TYPES = (
        ('A', 'amrap'),
        ('F', 'fortime'),
        ('E', 'emom')
    )
    SECTION_TYPES = (
        ('S', 'strength'),
        ('M', 'metcon')
    )
    user = models.ForeignKey(WhoopiePieUser, on_delete = models.CASCADE)
    workout_id = models.ForeignKey(Workout, on_delete = models.CASCADE)
    section_type = models.CharField(max_length = 1, choices = SECTION_TYPES)
    rounds = models.PositiveIntegerField(default = 1)
    round_duration = models.DurationField(default = timedelta)
    round_type = models.CharField(max_length = 1, choices = ROUND_TYPES)
    score_number = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    score_time = models.DurationField(default = timedelta, blank=True)
    extra_instructions = models.TextField(default = '', blank=True)

    def __str__(self):
        return "{} {} Section {} - {}".format(
            self.user.user.first_name,
            self.user.user.last_name,
            self.id,
            self.workout_id.date
        )

class MovementInstance(models.Model):
    user = models.ForeignKey(WhoopiePieUser, on_delete = models.CASCADE)
    movement_id = models.ForeignKey(MovementClass, on_delete = models.CASCADE)
    workout_id = models.ForeignKey(Workout, on_delete = models.CASCADE)
    section_id = models.ForeignKey(Section, on_delete = models.CASCADE)
    count_type = models.ForeignKey(CountTypes, on_delete = models.CASCADE)
    count = models.DecimalField(max_digits = 10, decimal_places = 2, blank = True, null = True)
    score_type = models.ForeignKey(ScoreTypes, on_delete = models.CASCADE)
    score_number = models.DecimalField(max_digits = 10, decimal_places = 2, blank = True, null=True)
    score_time = models.DurationField(default = timedelta, blank=True)
    superset = models.PositiveIntegerField(default=2)

    def __str__(self):
        return "{} {} Movement {} - {}".format(
            self.user.user.first_name,
            self.user.user.last_name,
            self.id,
            self.workout_id.date
        )
