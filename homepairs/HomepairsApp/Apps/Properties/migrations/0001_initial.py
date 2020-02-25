# Generated by Django 3.0.2 on 2020-02-25 04:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('PropertyManagers', '__first__'),
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
                ('rooId', models.CharField(blank=True, max_length=10)),
                ('pm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PropertyManagers.PropertyManager')),
            ],
        ),
    ]
