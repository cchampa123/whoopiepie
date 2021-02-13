from rest_framework import permissions, status
from rest_framework import viewsets, mixins
from rest_framework.response import Response
from django.db.models import Prefetch
from datetime import datetime
from .serializers import *
from .models import *

class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class=WorkoutSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    filterset_fields = {
        'start_time':['gte', 'lte', 'exact', 'isnull'],
        'end_time':['gte', 'lte', 'exact', 'isnull'],
        'scheduled_for':['gte', 'lte', 'exact']
    }

    def update(self, request, *args, **kwargs):
        user_to_share_with = request.query_params.get('user_to_share_with')
        if user_to_share_with:
            workout_to_share = Workout.objects.get(id=self.kwargs['pk'])
            relevant_sections = workout_to_share.sections.all()
            workout_to_share.pk = None
            workout_to_share.start_time = None
            workout_to_share.end_time = None
            workout_to_share.user = User.objects.get(id=user_to_share_with)
            workout_to_share.save()
            for section in relevant_sections:
                relevant_movements = section.movements.all()
                section.pk = None
                section.workout=workout_to_share
                section.save()
                for movement_instance in relevant_movements:
                    movement_instance.pk = None
                    movement_instance.section = section
                    movement_instance.save()
            return Response(WorkoutSerializer(workout_to_share).data)
        else:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

    def get_queryset(self):
        user_queryset = Workout.objects.filter(user=self.request.user.id).order_by('id')
        order_by = self.request.query_params.get('order_by', None)
        if order_by:
            return user_queryset.order_by(order_by)
        return user_queryset

    def create(self, request):
        data_dict = request.data
        data_dict['user'] = request.user.id
        serializer = WorkoutSerializer(data=data_dict)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

class MovementClassViewSet(viewsets.ModelViewSet):
    serializer_class=MovementClassSerializer
    queryset = MovementClass.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]

class MovementInstanceViewSet(viewsets.ModelViewSet):
    serializer_class=MovementInstanceSerializer
    queryset=MovementInstance.objects.all().order_by('id')
    permission_classes = [
        permissions.IsAuthenticated
    ]

class SectionViewSet(viewsets.ModelViewSet):
    serializer_class=SectionSerializer
    queryset=Section.objects.prefetch_related(Prefetch(
        'movements',
        queryset=MovementInstance.objects.order_by('id')
    )).order_by('id')
    permission_classes = [
        permissions.IsAuthenticated
    ]
