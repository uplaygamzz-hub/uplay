from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('about/', views.coming_soon, name='about'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('friends/', views.friends, name='friends'),
    path('tournaments/', views.tournaments, name='tournaments'),
    path('coming-soon/', views.coming_soon, name='coming_soon'),
    path('ai-dashboard/', views.ai_dashboard, name='ai_dashboard'),
    path('ai-dashboard-v2/', views.ai_dashboard_v2, name='ai_dashboard_v2'),
]