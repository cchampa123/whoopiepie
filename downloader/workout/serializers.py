from rest_framework import serializers
from .models import *
from datetime import date
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class WhoopiePieUserSerializer(serializers.ModelSerializer):
    email = serializers.StringRelatedField(source='user.email')
    first_name = serializers.StringRelatedField(source='user.first_name')
    last_name = serializers.StringRelatedField(source='user.last_name')

    class Meta:
        model = WhoopiePieUser
        fields = '__all__'

class MovementClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovementClass
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

    def validate(self, data):
        if (data['complete']) and (data['date'] > date.today()):
            return serializers.ValidationError('Workout cannot be completed before it is listed as occurring')
        return super().validate(data)

class SectionSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret['score_number']:
            ret['score_number'] = ret['score_number'].strip('0').strip('.')
        return ret

    class Meta:
        model = Section
        fields = '__all__'

class MovementInstanceSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        print(ret)
        if ret['score_number']:
            ret['score_number'] = ret['score_number'].strip('0').strip('.')
        if ret['count']:
            ret['count'] = ret['count'].strip('0').strip('.')
        return ret

    class Meta:
        model = MovementInstance
        fields = '__all__'

    def validate(self, data):
        ThisMovement = MovementClass.objects.get(name=data['movement_id'])
        if data['count_type'] not in ThisMovement.count_types.all():
            return serializers.ValidationError('Cannot select unsupported count type for this movement')
        if data['score_type'] not in ThisMovement.score_types.all():
            return serializers.ValidationError('Cannot select unsupported score type for this movement')
        if data['section_id'].workout_id != data['workout_id']:
            return serializers.ValidationError('Movement cannot belong to a section that does not correspond to the same workout as the movement')
        return super().validate(data)
