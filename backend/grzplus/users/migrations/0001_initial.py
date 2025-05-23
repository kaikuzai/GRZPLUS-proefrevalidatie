# Generated by Django 4.2.20 on 2025-05-06 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('admin', 'Administrator'), ('caregiver', 'Caregiver'), ('patient', 'Patient')], default='patient', max_length=10)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('caregiver_id', models.CharField(max_length=10)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('street_address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100)),
                ('zip_code', models.CharField(max_length=10)),
                ('bsn', models.CharField(max_length=10)),
            ],
        ),
    ]
