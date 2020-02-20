# Generated by Django 3.0.2 on 2020-02-17 19:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Properties', '0001_initial'),
        ('PropertyManagers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.CharField(max_length=100)),
                ('lastName', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=20)),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Properties.Property')),
                ('pm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PropertyManagers.PropertyManager')),
            ],
        ),
    ]
