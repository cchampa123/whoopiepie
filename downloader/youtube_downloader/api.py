from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import YoutubeUrlSerializer, LoginSerializer, YDLUserSerializer
from .download_functions import process_download
from plexapi.myplex import MyPlexAccount
import os

account = MyPlexAccount(os.environ['PLEX_USERNAME'], os.environ['PLEX_PASSWORD'])
plex = account.resource(os.environ['PLEX_SERVERNAME']).connect()

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        #import pdb; pdb.set_trace()
        if hasattr(user, 'ydluser'):
            return Response({
                "user": YDLUserSerializer(user.ydluser, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            }, status=status.HTTP_200_OK)
        else:
            message = {'non_field_errors':'Your account is not enabled for access to this app. Contact the administrator.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class UserAPI(generics.GenericAPIView):
    serializer_class = YDLUserSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, *args, **kwargs):
        if hasattr(request.user, 'ydluser'):
            return Response(
                YDLUserSerializer(request.user.ydluser, context=self.get_serializer_context()).data,
                status=status.HTTP_200_OK
            )
        else:
            message = {'non_field_errors':'Your account is not enabled for access to this app. Contact the administrator.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class YoutubeUrlView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = YoutubeUrlSerializer

    def post(self, request):

        process_download(request.data, plex)

        return Response(status=status.HTTP_200_OK)

class PlexPlaylistView(GenericViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def list(self, request, *args, **kwargs):
        return Response([{'title':x.title, 'key':x.key[11:len(x.key)]} for x in plex.playlists()])

    def retrieve(self, request, *args, **kwargs):
        playlist_songs = plex.fetchItem('/playlists/{}'.format(kwargs['pk'])).items()
        songtitles = [x.title for x in playlist_songs]
        songartists = [x.artist().title for x in playlist_songs]

        response_data = [{'title':x, 'artist':y} for x,y in zip(songtitles, songartists)]

        return Response(response_data, status=status.HTTP_200_OK)
