from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Category, Game, Player, Tournament
from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.paginator import Paginator
from django.db.models import Q

@csrf_exempt
def register_player(request):
    if request.method == 'POST':
        try:
            #  Parse the JSON from the frontend
            input_data = json.loads(request.body)
            
            # Extract the password separately
            password = input_data.pop('password', None)
            if not password:
                return JsonResponse({"error": "Password is required"}, status=400)
            
            allowed_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
            filtered_data = {k: v for k, v in input_data.items() if k in allowed_fields}

            # Create the user
            # **filtered_data unpacks the dictionary into arguments
            user = Player(**filtered_data)
            user.set_password(password) # Handles Bcrypt hashing
            user.save()

            return JsonResponse({"message": "User registered successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def login_player(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            # authenticate() checks the Bcrypt hash in the DB against the input
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)  # This creates a session for the user
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
    
    # Change 'description' to 'prize_pool' (or remove it)
    joined_tournaments = Tournament.objects.filter(participants=user).values(
        'id', 'title', 'game__title', 'start_date', 'prize_pool'
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

    # ase Filter: Only active statuses
    active_statuses = ['open', 'full', 'ongoing']
    queryset = Tournament.objects.select_related('game__category').filter(
        status__in=active_statuses
    )

    # Search Bar Logic: Partial match for Tournament Name
    search_query = request.GET.get('search')
    if search_query:
        queryset = queryset.filter(title__icontains=search_query)

    # Dropdown Logic: Exact match for Game or Category IDs
    game_id = request.GET.get('game_id')
    if game_id:
        queryset = queryset.filter(game_id=game_id)

    category_id = request.GET.get('category_id')
    if category_id:
        queryset = queryset.filter(game__category_id=category_id)

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

        # 1. Check if the tournament is actually open
        if tournament.status != 'open':
            return JsonResponse({"error": f"Registration is currently {tournament.status}"}, status=400)

        # 2. Check Capacity
        current_count = tournament.participants.count()
        if current_count >= tournament.max_participants:
            # Auto-update status if it reached the limit
            tournament.status = 'full'
            tournament.save()
            return JsonResponse({"error": "This tournament is full"}, status=400)

        # 3. Check for duplicates
        if tournament.participants.filter(id=player.id).exists():
            return JsonResponse({"error": "Already registered"}, status=400)

        # 4. Successful Join
        tournament.participants.add(player)
        
        # Check if it became full after this join
        if tournament.participants.count() == tournament.max_participants:
            tournament.status = 'full'
            tournament.save()

        return JsonResponse({"message": f"Successfully joined {tournament.title}"})
    
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
            'id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'status'
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