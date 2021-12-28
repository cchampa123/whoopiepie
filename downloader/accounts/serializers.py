# from rest_framework import serializers
# from .models import User
# from django.contrib.auth import authenticate
#
# # User serializer
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'email', 'first_name', 'last_name')
#
# # Login serializer
# class LoginSerializer(serializers.Serializer):
#     email = serializers.CharField()
#     password = serializers.CharField()
#
#     def validate(self, data):
#         user = authenticate(**data)
#         if user and user.is_active:
#             return user
#         raise serializers.ValidationError("Incorrect Credentials")
