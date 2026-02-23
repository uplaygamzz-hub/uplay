from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('about/', views.coming_soon, name='about'),
    path('dashboard/', views.ai_dashboard, name='ai_dashboard'),
    path('dashboard-v2/', views.ai_dashboard_v2, name='ai_dashboard_v2'),
]