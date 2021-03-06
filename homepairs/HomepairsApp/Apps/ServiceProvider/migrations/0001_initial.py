# Generated by Django 3.0.2 on 2020-03-03 21:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ServiceProvider',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=100, null=True)),
                ('phoneNum', models.CharField(max_length=15)),
                ('contractLic', models.CharField(max_length=15, null=True)),
                ('skills', models.CharField(max_length=200, null=True)),
                ('founded', models.DateField(default=datetime.date.today)),
            ],
        ),
    ]
