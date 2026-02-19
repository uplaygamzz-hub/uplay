from django.urls import path
from . import views

urlpatterns = [
    path('', views.tournament_list, name='tournament_list'),
    path('join/<int:tournament_id>/', views.join_tournament, name='join_tournament'),
]