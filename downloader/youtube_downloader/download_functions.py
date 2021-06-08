from django.conf import settings
import os
import youtube_dl

music_root = os.path.join(settings.PLEX_ROOT, 'music')
shows_root = os.path.join(settings.PLEX_ROOT, 'shows')

def _get_audio_data(data):
    artist = data['artist']
    song_title = data['title']
    if data['album'] == '':
        album = artist
    else:
        album = data['album']
    return song_title, artist, album

def _get_video_data(data):
    show = data['show']
    season = data['season']
    episode = data['episode']
    title = data['title']
    return show, season, episode, title

def _make_video_path(show, season):
    path_show = os.path.join(shows_root, show)
    if not os.path.exists(path_show):
        os.mkdir(path_show)
    path_season = os.path.join(path_show, "Season {:02d}".format(season))
    if not os.path.exists(path_season):
        os.mkdir(path_season)
    return path_season

def _make_audio_path(artist, album):
    path_artist = os.path.join(music_root, artist)
    if not os.path.exists(path_artist):
        os.mkdir(path_artist)
    path_album = os.path.join(path_artist, album)
    if not os.path.exists(path_album):
        os.mkdir(path_album)
    return path_album

def _download_audio(data, plex):
    song_title, artist, album = _get_audio_data(data)
    download_path = os.path.join(_make_audio_path(artist, album), song_title)
    for_command = download_path+".%(ext)s"
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': for_command,
        'postprocessors': [
            {'key': 'FFmpegExtractAudio'},
            {'key': 'FFmpegMetadata'}
            ],
        'postprocessor_args': ['-metadata', 'Title='+song_title,
                               '-metadata', 'Artist='+artist,
                               '-metadata', 'Album='+album]
        }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([data['youtube_url']])

def _download_video(data , plex):
    show, season, episode, title = _get_video_data(data)
    path_season = _make_video_path(show, season)
    filename = "{} - s{:02d}e{:02d}".format(show, season, episode)
    download_path = os.path.join(path_season, filename)
    for_command = download_path+".%(ext)s"
    ydl_opts = {
        'format': 'best',
        'outtmpl': for_command,
        'postprocessors': [
            {'key': 'FFmpegMetadata',}
            ],
        'postprocessor_args': ['-metadata', 'Title='+title]
        }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([data['youtube_url']])

def process_download(data, plex):
    if data['audio_video']=='audio':
        _download_audio(data, plex)
    else:
        _download_video(data, plex)
