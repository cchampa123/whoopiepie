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
        return Section.objects.filter(user=user)

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
        'workout_id':['exact']
    }

    def get_queryset(self):
        user = self.request.user.whoopiepieuser
        return MovementInstance.objects.filter(user=user)

    def create(self, request):
        request.data['user']=request.user.id
        return super().create(request)

    def update(self, request, *args, **kwargs):
        request.data['user']=request.user.id
        return super().update(request, *args, **kwargs)
