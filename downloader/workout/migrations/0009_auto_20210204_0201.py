# Generated by Django 3.0.8 on 2021-02-04 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workout', '0008_auto_20210204_0158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workout',
            name='scheduled_for',
            field=models.DateField(blank=True, null=True),
        ),
    ]