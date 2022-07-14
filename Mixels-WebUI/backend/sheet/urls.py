"""
sheet url patterns
"""
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('download_matrix', views.download_matrix, name='download_matrix'),
    path('upload_file', views.upload_file, name='upload_file'),
    path('construct_matrix', views.construct_matrix, name="construct_matrix"),
    path('construct_cell', views.construct_cell, name="construct_cell"),
    path('upload_cell', views.upload_cell, name="upload_cell")
]