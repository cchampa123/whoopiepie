from .models import MovementClass, Workout, Section, MovementInstance, ScoreTypes, CountTypes
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .serializers import WorkoutSerializer, SectionSerializer, MovementClassSerializer, MovementInstanceSerializer, LoginSerializer, WhoopiePieUserSerializer
from rest_framework.response import Response
from knox.models import AuthToken
from .models import WhoopiePieUser
from django.db.models.aggregates import Max, Min
from django.db.models import Q, F

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        #import pdb; pdb.set_trace()
        if hasattr(user, 'whoopiepieuser'):
            return Response({
                "user": WhoopiePieUserSerializer(user.whoopiepieuser, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            })
        else:
            message = {'non_field_errors':'Your account is not enabled for access to this app. Contact the administrator.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class UserAPI(generics.GenericAPIView):
    serializer_class = WhoopiePieUserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if hasattr(request.user, 'whoopiepieuser'):
            return Response(
                WhoopiePieUserSerializer(request.user.ydluser, context=self.get_serializer_context()).data,
                status=status.HTTP_200_OK
            )
        else:
            message = {'non_field_errors':'Your account is not enabled for access to this app. Contact the administrator.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class WorkoutViewSet(ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = {
        'date':['gt', 'lt', 'exact', 'gte', 'lte']
    }

    def get_queryset(self):
        user = self.request.user.whoopiepieuser
        return Workout.objects.filter(user=user).order_by('date', 'id')

    def create(self, request):
        request.data['user']=request.user.id
        return super().create(request)

    def update(self, request, *args, **kwargs):
        request.data['user']=request.user.id
        return super().update(request, *args, **kwargs)

class SectionViewSet(ModelViewSet):
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = {
        'workout_id':['exact']
    }

    def get_queryset(self):
        user = self.request.user.whoopiepieuser
        return Section.objects.filter(user=user).order_by('order')

    def create(self, request):
        request.data['user']=request.user.id
        return super().create(request)

    def update(self, request, *args, **kwargs):
        request.data['user']=request.user.id
        return super().update(request, *args, **kwargs)

class MovementClassViewSet(ModelViewSet):
    serializer_class = MovementClassSerializer
    permission_classes = [IsAuthenticated]
    queryset = MovementClass.objects.all().order_by('name')
    filterset_fields = {
        'name':['icontains', 'exact']
    }

    @action(detail=True)
    def unique_counts(self, request, pk=None):
        movement = self.get_object()
        movement_instances = movement.movementinstance_set\
                              .filter(user=request.user.whoopiepieuser)\
                              .exclude(Q(score_time='00:00:00') & Q(score_number=None))\
                              .values('count', 'count_type', 'score_type').distinct()
        return Response(movement_instances, status=status.HTTP_200_OK)

    @action(detail=True)
    def max_score(self, request, pk=None):
        movement = self.get_object()
        movement_instances = movement.movementinstance_set.filter(user=request.user.whoopiepieuser)
        best_lbs = movement_instances.exclude(score_number=None)\
                    .filter(score_type=ScoreTypes('lbs'))\
                    .values('count_type', 'count')\
                    .annotate(score_number=Max('score_number'))
        best_time = movement_instances.exclude(score_time='00:00:00')\
                    .filter(score_type=ScoreTypes('time'))\
                    .values('count_type', 'count')\
                    .annotate(score_time=Min('score_time'))
        return Response({
            'lbs':best_lbs,
            'time':best_time,
        }, status=status.HTTP_200_OK)

    @action(detail=True)
    def progression(self, request, pk=None):
        movement = self.get_object()
        movement_instances = movement.movementinstance_set\
                .filter(user=request.user.whoopiepieuser)\
                .exclude(Q(score_number=None) & Q(score_time='00:00:00'))\
                .annotate(date=F('workout_id__date'))\
                .values('date', 'count_type', 'count')\
                .annotate(score_number = Max('score_number'),
                          score_time = Min('score_time'))
        return Response(movement_instances, status=status.HTTP_200_OK)


class MovementInstanceViewSet(ModelViewSet):
    serializer_class = MovementInstanceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = {
        'workout_id':['exact'],
        'score_type':['exact'],
        'count_type':['exact'],
        'count':['exact'],
        'movement_id':['exact']
    }

    def get_queryset(self):
        user = self.request.user.whoopiepieuser
        return MovementInstance.objects.filter(user=user).order_by('superset', 'order')

    def create(self, request):
        request.data['user']=request.user.id
        return super().create(request)

    def update(self, request, *args, **kwargs):
        request.data['user']=request.user.id
        return super().update(request, *args, **kwargs)
