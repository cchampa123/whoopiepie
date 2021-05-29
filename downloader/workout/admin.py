from django.contrib import admin
from accounts.admin import UserAdmin as BaseUserAdmin
from .models import MovementClass, Workout, Section, MovementInstance, CountTypes, ScoreTypes
from accounts.models import User
from .models import WhoopiePieUser

# Register your models here.
class WhoopiePieUserInline(admin.StackedInline):
    model = WhoopiePieUser

class UserAdmin(BaseUserAdmin):
    inlines = (WhoopiePieUserInline, )

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

admin.site.register(WhoopiePieUser)
admin.site.register(MovementClass)
admin.site.register(Workout)
admin.site.register(Section)
admin.site.register(MovementInstance)
admin.site.register(CountTypes)
admin.site.register(ScoreTypes)
