from .models import MovementClass, Workout, Section, MovementInstance
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .serializers import WorkoutSerializer, SectionSerializer, MovementClassSerializer, MovementInstanceSerializer, LoginSerializer, WhoopiePieUserSerializer
from rest_framework.response import Response
from knox.models import AuthToken
from .models import WhoopiePieUser

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
    queryset = MovementClass.objects.all()
    filterset_fields = {
        'name':['icontains', 'exact']
    }


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

    def list(self, request, *args, **kwargs):
        unique_counts = request.query_params.get('unique_counts', None)
        movement = request.query_params.get('movement_id', None)
        if unique_counts:
            if not movement:
                return Response({'error':'You must specify a movement in order to get the unique movement counts'}, status=status.HTTP_400_BAD_REQUEST)
            data = MovementInstance.objects.filter(movement_id=movement).values('count', 'count_type').distinct()
            return Response(data, status=status.HTTP_200_OK)
        return super().list(request, *args, **kwargs)
