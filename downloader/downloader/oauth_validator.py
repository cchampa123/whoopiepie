from oauth2_provider.oauth2_validators import OAuth2Validator
from rest_framework import serializers
from django.contrib.auth.models import Group
from django.core.serializers import json

class CleanSerializer(json.Serializer):
    def get_dump_object(self, obj):
        return self._current['name']

class CustomOAuth2Validator(OAuth2Validator):

    def get_additional_claims(self, request):
        usergroups = request.user.groups.all()
        response = {
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            'groups': [x.name for x in usergroups],
            'full_name':"{} {}".format(request.user.first_name, request.user.last_name)
        }
        return response
