from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.urls import path, reverse
from django.views.decorators.csrf import csrf_exempt
from .models import Category, Game, Player, Tournament, PendingRegistration
from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail, EmailMessage

@csrf_exempt
def register_player(request):
    if request.method == 'POST':
        try:
            input_data = json.loads(request.body)
            
            password = input_data.pop('password', None)
            if not password:
                return JsonResponse({"error": "Password is required"}, status=400)
            
            allowed_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
            filtered_data = {k: v for k, v in input_data.items() if k in allowed_fields}

            # Create the user as inactive
            user = Player(**filtered_data)
            user.set_password(password)
            user.is_active = False  
            user.save()

            # Generate Verification Data
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Create the activation link
            # In production,  'localhost:8000' will be replaced with domain link
            path = reverse('activate', kwargs={'uidb64': uid, 'token': token})
            activation_link = f"http://localhost:8000{path}"

            # Send the Email
            subject = "Verify your UPlay Account"
            message = f"Hi {user.username},\n\nPlease click the link below to verify your email and activate your account:\n{activation_link}"
            
            send_mail(
                subject,
                message,
                'noreply@uplay.com',  # From email
                [user.email],         # To email
                fail_silently=False,
            )

            return JsonResponse({
                "message": "Registration successful. Please check your email to verify your account."
            }, status=201)

        except Exception as e:
            # If email fails or other error, handle it
            return JsonResponse({"error": str(e)}, status=400)

def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Player.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, Player.DoesNotExist):
        user = None

    if user is not None:
        # Check if they are already active
        if user.is_active:
            return JsonResponse({"message": "Account already active. Please login."}, status=200)

        # If not active, validate the token
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return JsonResponse({"message": "Account activated successfully."}, status=200)

    # 3. If we reach here, the token is genuinely invalid for an inactive user
    print("DEBUG: Failure because token check failed")
    return JsonResponse({"error": "Activation link is invalid or expired."}, status=400)

@csrf_exempt
def login_player(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                # Check if the email has been verified (is_active)
                if not user.is_active:
                    return JsonResponse({
                        "error": "Account not verified. Please check your email to activate your account."
                    }, status=403)

                # If credentials match and user is active, log them in
                login(request, user)
                return JsonResponse({
                    "message": "Login successful",
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "status": user.status
                    }
                }, status=200)
            else:
                return JsonResponse({"error": "Invalid username or password"}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "POST only"}, status=405)

def get_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized. Please login first."}, status=401)

    user = request.user
    
    joined_tournaments = Tournament.objects.filter(participants=user).values(
        'id', 'title', 'game__title', 'start_date','entry_fee', 'prize_pool'
    )

    return JsonResponse({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone_number": user.phone_number,
        "status": user.status,
        "tournaments": list(joined_tournaments)
    }, status=200)

@cache_page(60 * 15)  # Cache for 15 minutes
def list_tournaments(request):
    if request.method != 'GET':
        return JsonResponse({"error": "GET request required"}, status=405)

    tournaments = Tournament.objects.select_related('game', 'category').all().order_by('start_date')

    paginator = Paginator(tournaments, 8)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    data = []
    for t in page_obj:
        data.append({
            "id": t.id,
            "title": t.title,
            "game": t.game.title,
            "category": t.category.name if t.category else "Uncategorized", # Handle null
            "is_paid": t.is_paid,
            "entry_fee": str(t.entry_fee), # Decimals must be strings for JSON
            "start_date": t.start_date.strftime("%Y-%m-%d %H:%M"),
            "participant_count": t.participants.count(),
            "max_participants": t.max_participants,
            "status": t.status
        })
            
    return JsonResponse({
        "count": paginator.count,
        "total_pages": paginator.num_pages,
        "current_page": page_obj.number,
        "results": data
    }, safe=False)

@cache_page(60 * 15)  # Cache for 15 minutes
def list_active_tournaments(request):
    if request.method != 'GET':
        return JsonResponse({"error": "GET request required"}, status=405)

    # Filter: Only active statuses
    active_statuses = ['open', 'full', 'ongoing']
    queryset = Tournament.objects.select_related('game__category').filter(
        status__in=active_statuses
    )

    # 1. Search Bar Logic: Partial match for Tournament Name
    search_query = request.GET.get('search')
    if search_query:
        queryset = queryset.filter(title__icontains=search_query)

    # 2. Game Dropdown Logic: Search by Game Name (icontains)
    game_name = request.GET.get('game')
    if game_name:
        # Traverses relationship: Tournament -> Game -> Title
        queryset = queryset.filter(game__title__icontains=game_name)

    # 3. Category Dropdown Logic: Search by Category Name (icontains)
    category_name = request.GET.get('category')
    if category_name:
        # Traverses relationship: Tournament -> Game -> Category -> Name
        queryset = queryset.filter(game__category__name__icontains=category_name)

    # Sorting and Pagination
    queryset = queryset.order_by('start_date')
    paginator = Paginator(queryset, 8)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    results = []
    for t in page_obj:
        results.append({
            "id": t.id,
            "title": t.title,
            "game": t.game.title,
            "category": t.game.category.name if t.game.category else "General",
            "is_paid": t.is_paid,
            "entry_fee": str(t.entry_fee),
            "prize_pool": t.prize_pool,
            "start_date": t.start_date.strftime("%Y-%m-%d %H:%M"),
            "participant_count": t.participants.count(),
            "max_participants": t.max_participants,
            "status": t.status
        })

    return JsonResponse({
        "count": paginator.count,
        "total_pages": paginator.num_pages,
        "current_page": page_obj.number,
        "has_next": page_obj.has_next(),
        "results": results
    })

@csrf_exempt
def join_tournament(request, tournament_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required"}, status=401)

    if request.method == 'POST':
        tournament = get_object_or_404(Tournament, id=tournament_id)
        player = request.user

        # Check if already registered or already has a pending request
        if tournament.participants.filter(id=player.id).exists():
            return JsonResponse({"error": "Already registered"}, status=400)
        
        if PendingRegistration.objects.filter(player=player, tournament=tournament, is_approved=False).exists():
            return JsonResponse({"error": "Your payment is currently under review. Kindly wait for approval"}, status=400)

        # Logic for FREE Tournaments
        if not tournament.is_paid:
            tournament.participants.add(player)
            return JsonResponse({"message": f"Successfully joined {tournament.title}"})

        # Logic for PAID Tournaments
        else:
            receipt = request.FILES.get('receipt')
            if not receipt:
                return JsonResponse({"error": "Payment receipt is required"}, status=400)

            # Save to Database
            pending = PendingRegistration.objects.create(
                player=player,
                tournament=tournament,
                receipt=receipt
            )

            # Send Email to Admin to notify admin will be implemented in later updates
            
            return JsonResponse({"message": "Receipt uploaded. Pending admin approval."})
    
@csrf_exempt
def update_status(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player = get_object_or_404(Player, username=data['username'])
        
        new_status = data.get('status')
        if new_status in ['active', 'inactive']:
            player.status = new_status
            player.save()
            return JsonResponse({"message": f"Status updated to {new_status}"})
        
        return JsonResponse({"error": "Invalid status"}, status=400)

@csrf_exempt
def logout_player(request):
    if request.method == 'POST':
        # This removes the session from the database and clears the user's cookie
        logout(request)
        return JsonResponse({"message": "Successfully logged out"}, status=200)
    
    return JsonResponse({"error": "POST request required"}, status=405)

def view_all_players(request):
    if request.method == 'GET':
        players = Player.objects.all().values(
            'username', 'status'
        )
        return JsonResponse(list(players), safe=False)
    
    return JsonResponse({"error": "Only GET requests allowed"}, status=405)

def get_dropdown_data(request):
    """Returns IDs and Names for the frontend dropdowns"""
    categories = list(Category.objects.all().values('id', 'name'))
    games = list(Game.objects.all().values('id', 'title'))
    
    return JsonResponse({
        "categories": categories,
        "games": games
    })

@csrf_exempt
def request_password_reset(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        user = Player.objects.filter(email=email).first()

        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            # This link should point to your Frontend's reset page
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

            send_mail(
                "Password Reset Request",
                f"Click the link below to reset your password:\n{reset_link}",
                "noreply@uplay.com",
                [user.email],
            )
        
        # We return 200 even if user doesn't exist for security (privacy)
        return JsonResponse({"message": "If an account exists with this email, a reset link has been sent."})

@csrf_exempt
def reset_password_confirm(request, uidb64, token):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_password = data.get('password')
            
            uid = urlsafe_base64_decode(uidb64).decode()
            user = Player.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return JsonResponse({"message": "Password has been reset successfully."})
            else:
                return JsonResponse({"error": "Invalid or expired token."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)