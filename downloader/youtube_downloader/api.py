from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import YoutubeUrlSerializer
from django.conf import settings
import os

class YoutubeUrlView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = YoutubeUrlSerializer

    def post(self, request):
        if request.data['audio_video'] == 'audio':
            music_root = os.path.join(settings.PLEX_ROOT, 'music')
            if request.data['album'] == '':
                    album = request.data['artist']
            else:
                album = request.data['album']
            path_artist = os.path.join(music_root, request.data['artist'])
            if os.path.exists(path_artist):
                pass
            else:
                os.mkdir(path_artist)
            path_album = os.path.join(path_artist, album)
            if os.path.exists(path_album):
                pass
            else:
                os.mkdir(path_album)

            file_path = os.path.join(path_album, request.data['title'])
            for_command = file_path+".%(ext)s"
            metadata = '''--add-metadata --postprocessor-args '-metadata Title="'''+request.data['title']+'''" -metadata Artist="'''+request.data['artist']+'''" -metadata Album="'''+album+'"'+"'"
            download_command = "cpulimit -l 75 -- youtube-dl -x --audio-format mp3 "+metadata+" -o '"+for_command+"' "+request.data['youtube_url']
            os.system(download_command)
        else:
            tv_root = os.path.join(settings.PLEX_ROOT, 'shows')
            if request.data['season'] == '':
                season = '00'
            else:
                season = request.data['season']
            if request.data['episode'] == '':
                episode = '00'
            else:
                episode = request.data['episode']
            path_show = os.path.join(tv_root, request.data['tv_show'])
            if os.path.exists(path_show):
                pass
            else:
                os.mkdir(path_show)
            path_season = os.path.join(path_show, "Season "+season)
            if os.path.exists(path_season):
                pass
            else:
                os.mkdir(path_season)
            file_path = path_season + "/" + request.data['tv_show']+' - s'+season+'e'+episode
            for_command = file_path+".%(ext)s"
            metadata = '''-f best --add-metadata --postprocessor-args '-metadata Title="'''+request.data['title']+'"'+"'"
            download_command = "cpulimit -l 75 -- youtube-dl "+metadata+" -o '"+for_command+"' "+request.data['youtube_url']
            os.system(download_command)
        return Response(status=status.HTTP_200_OK)
