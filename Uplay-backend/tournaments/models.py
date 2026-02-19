from django.db import models
from django.contrib.auth.models import User
from games.models import Game

class Tournament(models.Model):
    STATUS_CHOICES = (
        ('UPCOMING', 'Upcoming'),
        ('ONGOING', 'Ongoing'),
        ('COMPLETED', 'Completed'),
    )
    name = models.CharField(max_length=200)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def can_join(self, user):
        """Check if the user can join this tournament."""
        if self.status != 'UPCOMING':
            return False, "Tournament is not open for joining."
        if self.start_date <= timezone.now():
            return False, "Tournament has already started."
        if TournamentParticipant.objects.filter(tournament=self, user=user).exists():
            return False, "You have already joined this tournament."
        return True, "You can join this tournament."

class TournamentParticipant(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tournament', 'user')  # prevents duplicate joins

    def __str__(self):
        return f"{self.user.username} in {self.tournament.name}"