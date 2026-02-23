from django.shortcuts import render

# Template Views

def index(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

def signup_view(request):
    return render(request, 'signup.html')

def coming_soon(request):
    return render(request, 'coming_soon.html')

def ai_dashboard(request):
    return render(request, 'AI.html')

def ai_dashboard_v2(request):
    return render(request, 'AI2.html')
