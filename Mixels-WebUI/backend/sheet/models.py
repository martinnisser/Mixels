"""
sheet models
"""
from django.db import models
import os

class Document(models.Model):
    print("In the documents folder")
    docfile = models.FileField(upload_to='documents')