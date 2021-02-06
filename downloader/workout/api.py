from rest_framework import permissions, status
from rest_framework import viewsets, mixins
from rest_framework.response import Response
from datetime import datetime
from .serializers import *
from .models import *

class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class=WorkoutSerializer
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]
    filterset_fields = {
        'start_time':['gte', 'lte', 'exact', 'isnull'],
        'end_time':['gte', 'lte', 'exact', 'isnull'],
        'scheduled_for':['gte', 'lte', 'exact']
    }

    def get_queryset(self):
        user_queryset = Workout.objects.all() #filter(user=self.request.user.id)
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
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]

class MovementInstanceViewSet(viewsets.ModelViewSet):
    serializer_class=MovementInstanceSerializer
    queryset=MovementInstance.objects.all()
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]

class SectionViewSet(viewsets.ModelViewSet):
    serializer_class=SectionSerializer
    queryset=Section.objects.all()
