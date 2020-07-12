from rest_framework import serializers

class YoutubeUrlSerializer(serializers.Serializer):
    youtube_url = serializers.CharField(max_length=500)
    artist = serializers.CharField(max_length=100)
    album = serializers.CharField(max_length=100)
    title = serializers.CharField(max_length=300)
