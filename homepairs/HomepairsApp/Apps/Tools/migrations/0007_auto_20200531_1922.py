# Generated by Django 3.0.2 on 2020-05-31 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Tools', '0006_auto_20200514_0431'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='lastAccessed',
            field=models.DateTimeField(),
        ),
    ]
