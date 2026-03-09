from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import login, authenticate, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages
from .forms import (
    SignUpForm, LoginForm, FriendRequestForm, SquadForm, UserProfileForm,
    UserUpdateForm, UserProfileUpdateForm, GamingIDsForm, PayoutDetailsForm
)
from .models import User, Tournament, PendingRegistration, Friendship, Squad
from django.db.models import Q

# Template Views

def index(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                next_url = request.GET.get('next')
                if next_url:
                    return redirect(next_url)
                return redirect('dashboard')
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful." )
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            return redirect('dashboard')
        messages.error(request, "Unsuccessful registration. Invalid information.")
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def coming_soon(request):
    return render(request, 'coming_soon.html')

def ai_dashboard(request):
    return render(request, 'AI.html')

def ai_dashboard_v2(request):
    return render(request, 'AI2.html')

@login_required
def dashboard(request):
    # Get user's friends and squads for the dashboard
    friends_list = Friendship.objects.filter(
        (Q(sender=request.user) | Q(receiver=request.user)),
        status='accepted'
    )
    squads = request.user.joined_squads.all()
    return render(request, 'dashboard.html', {'friends': friends_list, 'squads': squads})

@login_required
def settings_view(request):
    user = request.user
    profile = user.profile

    if request.method == 'POST':
        action = request.POST.get('action')
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        if action == 'update_profile':
            user_form = UserUpdateForm(request.POST, instance=user)
            profile_form = UserProfileUpdateForm(request.POST, request.FILES, instance=profile)
            if user_form.is_valid() and profile_form.is_valid():
                user_form.save()
                profile_form.save()
                if is_ajax:
                    return JsonResponse({'success': True, 'message': 'Profile updated successfully!'})
                messages.success(request, 'Profile updated successfully!')
                return redirect('settings')
            else:
                if is_ajax:
                    return JsonResponse({'success': False, 'message': 'Invalid profile information.'})
        
        elif action == 'update_gaming_ids':
            gaming_ids_form = GamingIDsForm(request.POST, instance=profile)
            if gaming_ids_form.is_valid():
                gaming_ids_form.save()
                if is_ajax:
                    return JsonResponse({'success': True, 'message': 'Gaming IDs updated successfully!'})
                messages.success(request, 'Gaming IDs updated successfully!')
                return redirect('settings')
            else:
                if is_ajax:
                    return JsonResponse({'success': False, 'message': 'Invalid gaming IDs information.'})
                
        elif action == 'update_password':
            password_form = PasswordChangeForm(user, request.POST)
            if password_form.is_valid():
                user = password_form.save()
                update_session_auth_hash(request, user)
                if is_ajax:
                    return JsonResponse({'success': True, 'message': 'Password updated successfully!'})
                messages.success(request, 'Your password was successfully updated!')
                return redirect('settings')
            else:
                if is_ajax:
                    error_msg = " ".join([error for errors in password_form.errors.values() for error in errors])
                    return JsonResponse({'success': False, 'message': error_msg})
                for error in list(password_form.errors.values()):
                    messages.error(request, error)
                
        elif action == 'update_payout':
            payout_form = PayoutDetailsForm(request.POST, instance=profile)
            if payout_form.is_valid():
                payout_form.save()
                if is_ajax:
                    return JsonResponse({'success': True, 'message': 'Payout details updated successfully!'})
                messages.success(request, 'Payout details updated successfully!')
                return redirect('settings')
            else:
                if is_ajax:
                    return JsonResponse({'success': False, 'message': 'Invalid payout details.'})
                
    else:
        user_form = UserUpdateForm(instance=user)
        profile_form = UserProfileUpdateForm(instance=profile)
        gaming_ids_form = GamingIDsForm(instance=profile)
        password_form = PasswordChangeForm(user)
        payout_form = PayoutDetailsForm(instance=profile)

    context = {
        'user_form': user_form,
        'profile_form': profile_form,
        'gaming_ids_form': gaming_ids_form,
        'password_form': password_form,
        'payout_form': payout_form,
    }
    
    return render(request, 'settings.html', context)

@login_required
def friends(request):
    # Online friends (mocking online status for now based on最近activity or just all accepted)
    accepted_friendships = Friendship.objects.filter(
        (Q(sender=request.user) | Q(receiver=request.user)),
        status='accepted'
    )
    
    friends = []
    for f in accepted_friendships:
        friend = f.receiver if f.sender == request.user else f.sender
        friends.append(friend)
        
    pending_requests = Friendship.objects.filter(receiver=request.user, status='pending')
    
    squads = request.user.joined_squads.all()
    
    # Forms for modals
    friend_form = FriendRequestForm()
    squad_form = SquadForm()
    
    
    context = {
        'friends': friends,
        'pending_requests': pending_requests,
        'squads': squads,
        'friend_form': friend_form,
        'squad_form': squad_form,
    }
    return render(request, 'friends.html', context)

@login_required
def send_friend_request(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        try:
            receiver = User.objects.get(username=username)
            if receiver == request.user:
                return JsonResponse({'success': False, 'message': "You can't add yourself."})
            
            Friendship.objects.get_or_create(sender=request.user, receiver=receiver)
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'})
    return JsonResponse({'success': False}, status=405)

@login_required
def accept_friend_request(request, request_id):
    friendship = get_object_or_404(Friendship, id=request_id, receiver=request.user)
    friendship.status = 'accepted'
    friendship.save()
    return redirect('friends')

@login_required
def create_squad(request):
    if request.method == 'POST':
        form = SquadForm(request.POST)
        if form.is_valid():
            squad = form.save(commit=False)
            squad.leader = request.user
            squad.save()
            form.save_m2m() # Save members
            squad.members.add(request.user) # Ensure leader is a member
            return redirect('friends')
    return redirect('friends')

def tournaments(request):
    tournaments = Tournament.objects.all().order_by('-start_date')
    return render(request, 'tournaments.html', {'tournaments': tournaments})

@login_required
def register_tournament(request):
    if request.method == 'POST':
        tournament_title = request.POST.get('tournament_title')
        receipt = request.FILES.get('receipt')

        if not tournament_title or not receipt:
            return JsonResponse({'success': False, 'message': 'Missing data.'}, status=400)

        tournament = get_object_or_404(Tournament, title=tournament_title)
        
        # Save registration
        PendingRegistration.objects.create(
            player=request.user,
            tournament=tournament,
            receipt=receipt
        )
        
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'message': 'Invalid method.'}, status=405)
