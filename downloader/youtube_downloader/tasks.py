from celery import shared_task
from .download_functions import process_download
from plexapi.myplex import MyPlexAccount
import os

@shared_task
def process_async_download(data):
    account = MyPlexAccount(os.environ['PLEX_USERNAME'], os.environ['PLEX_PASSWORD'])
    plex = account.resource(os.environ['PLEX_SERVERNAME']).connect()
    process_download(data, plex)
