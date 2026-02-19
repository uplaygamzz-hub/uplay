from django.shortcuts import render
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from .models import Tournament, TournamentParticipant

def join_tournament(request, tournament_id):
    if not request.user.is_authenticated:
        messages.error(request, "You must be logged in to join a tournament.")
        return redirect('login') 

    tournament = get_object_or_404(Tournament, id=tournament_id)
    can_join, msg = tournament.can_join(request.user)

    if not can_join:
        messages.error(request, msg)
        return redirect('tournament_list')

    # Create participant
    TournamentParticipant.objects.create(tournament=tournament, user=request.user)
    messages.success(request, f"You have successfully joined {tournament.name}.")
    return redirect('tournament_list')

def tournament_list(request):
    tournaments = Tournament.objects.all()
    return render(request, 'tournaments/list.html', {'tournaments': tournaments})

from django.shortcuts import redirect

def home(request):
    return redirect('tournament_list')
