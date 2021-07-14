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

class MovementInstanceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    date = serializers.StringRelatedField(source='workout_id.date', read_only=True)
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
        read_only_fields = ('workout_id', 'section_id', 'user')

    def validate(self, data):
        ThisMovement = MovementClass.objects.get(name=data['movement_id'])
        if data['count_type'] not in ThisMovement.count_types.all():
            return serializers.ValidationError('Cannot select unsupported count type for this movement')
        if data['score_type'] not in ThisMovement.score_types.all():
            return serializers.ValidationError('Cannot select unsupported score type for this movement')
        return super().validate(data)

class SectionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret['score_number']:
            ret['score_number'] = ret['score_number'].strip('0').strip('.')
        return ret

    movementinstance_set = MovementInstanceSerializer(many=True)
    class Meta:
        model = Section
        fields = '__all__'
        read_only_fields = ('id', 'workout_id', 'user')

class WorkoutSerializer(serializers.ModelSerializer):
    section_set = SectionSerializer(many=True)
    class Meta:
        model = Workout
        fields = '__all__'

    def create(self, validated_data):
        sections = validated_data.pop('section_set')
        workout = Workout.objects.create(**validated_data)
        for section in sections:
            movements = section.pop('movementinstance_set')
            section.pop('id', None)
            section_instance = Section.objects.create(
                        **section,
                        workout_id = workout,
                        user = workout.user
                        )
            for movement in movements:
                MovementInstance.objects.create(
                    **movement,
                    section_id = section_instance,
                    workout_id = workout,
                    user = workout.user
                )
        return workout

    def update(self, instance, validated_data):
        sections = validated_data.pop('section_set')
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        keep_sections = []
        for section in sections:
            id = section.pop('id', None)
            movements = section.pop('movementinstance_set', None)
            if id:
                if Section.objects.filter(id=id).exists():
                    section_instance = Section.objects.get(id=id)
                    for key, value in section.items():
                        setattr(section_instance, key, value)
                    section_instance.save()
                    keep_sections.append(id)
            else:
                section_instance = Section.objects.create(
                    **section,
                    workout_id=instance,
                    user = instance.user
                    )
                keep_sections.append(section_instance.id)

            keep_movements = []
            for movement in movements:
                movement_id = movement.pop('id', None)
                if movement_id:
                    if MovementInstance.objects.filter(id=movement_id).exists():
                        movement_instance = MovementInstance.objects.get(id=movement_id)
                        for key, value in movement.items():
                            setattr(movement_instance, key, value)
                        movement_instance.save()
                        keep_movements.append(movement_id)
                else:
                    movement_instance = MovementInstance.objects.create(
                        **movement,
                        workout_id = instance,
                        section_id = section_instance,
                        user = instance.user
                        )
                    keep_movements.append(movement_instance.id)
            for movement in section_instance.movementinstance_set.all():
                if movement.id not in keep_movements:
                    movement.delete()

        for section in instance.section_set.all():
            if section.id not in keep_sections:
                section.delete()

        return instance



    def validate(self, data):
        if (data['complete']) and (data['date'] > date.today()):
            return serializers.ValidationError('Workout cannot be completed before it is listed as occurring')
        return super().validate(data)
