from django.db import models
from accounts.models import User

# Create your models here.
class YDLUser(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key=True)

    def __str__(self):
        return "{} {}".format(self.user.first_name, self.user.last_name)
