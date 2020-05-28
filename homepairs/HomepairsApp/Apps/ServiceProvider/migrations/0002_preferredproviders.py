# Generated by Django 3.0.2 on 2020-03-12 03:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PropertyManagers', '0001_initial'),
        ('ServiceProvider', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PreferredProviders',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PropertyManagers.PropertyManager')),
                ('provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ServiceProvider.ServiceProvider')),
            ],
        ),
    ]