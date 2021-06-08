from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import YDLUser

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class YDLUserSerializer(serializers.ModelSerializer):
    email = serializers.StringRelatedField(source='user.email')
    first_name = serializers.StringRelatedField(source='user.first_name')
    last_name = serializers.StringRelatedField(source='user.last_name')

    class Meta:
        model = YDLUser
        fields = '__all__'

class YoutubeUrlSerializer(serializers.Serializer):
    youtube_url = serializers.CharField(max_length=500)
    artist = serializers.CharField(max_length=100)
    album = serializers.CharField(max_length=100)
    title = serializers.CharField(max_length=300)
