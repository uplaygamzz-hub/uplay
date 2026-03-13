from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('signup/', views.signup_view, name='signup'),
    path('about/', views.coming_soon, name='about'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('friends/', views.friends, name='friends'),
    path('settings/', views.settings_view, name='settings'),
    path('tournaments/', views.tournaments, name='tournaments'),
    path('register-tournament/', views.register_tournament, name='register_tournament'),
    path('coming-soon/', views.coming_soon, name='coming_soon'),
    path('ai-dashboard/', views.ai_dashboard, name='ai_dashboard'),
    path('friends/send/', views.send_friend_request, name='send_friend_request'),
    path('friends/accept/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('squads/create/', views.create_squad, name='create_squad'),
    path('ai-dashboard-v2/', views.ai_dashboard_v2, name='ai_dashboard_v2'),
    path('profile/', login_required(TemplateView.as_view(template_name='profile.html')), name='profile'),
    path('match-finder/', login_required(TemplateView.as_view(template_name='match_finder.html')), name='match_finder'),
    path('wallet/', login_required(TemplateView.as_view(template_name='wallet.html')), name='wallet'),
    path('privacy/', TemplateView.as_view(template_name='privacy.html'), name='privacy'),
    path('terms/', TemplateView.as_view(template_name='terms.html'), name='terms'),
]