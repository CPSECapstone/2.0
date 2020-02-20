# Generated by Django 3.0.2 on 2020-02-13 04:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('streetAddress', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=255)),
                ('numBath', models.FloatField()),
                ('numBed', models.IntegerField()),
                ('maxTenants', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='PropertyManager',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.CharField(max_length=100)),
                ('lastName', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.CharField(max_length=100)),
                ('lastName', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=20)),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.Property')),
                ('pm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.PropertyManager')),
            ],
        ),
        migrations.AddField(
            model_name='property',
            name='pm',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.PropertyManager'),
        ),
        migrations.CreateModel(
            name='Appliance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=255)),
                ('rooAppId', models.IntegerField()),
                ('location', models.CharField(max_length=100)),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.Property')),
            ],
        ),
    ]