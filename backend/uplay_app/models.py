from django.db import models
from django.contrib.auth.models import AbstractUser

class Player(AbstractUser):
    # AbstractUser already has first_name, last_name, username, email, password
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    status = models.CharField(
        max_length=10, 
        choices=[('active', 'Active'), ('inactive', 'Inactive')],
        default='active'
    )
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

class Game(models.Model):
    title = models.CharField(max_length=100, unique=True)

    category = models.ForeignKey(
        'Category', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="games"
    )

    def __str__(self):
        return self.title
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Tournament(models.Model):
    title = models.CharField(max_length=200)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="tournaments")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    participants = models.ManyToManyField(Player, related_name="joined_tournaments", blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    is_paid = models.BooleanField(default=False)
    entry_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    prize_pool = models.TextField(blank=True, null=True, help_text="e.g. 1st: $100, 2nd: $50")

    max_participants = models.PositiveIntegerField(default=16)
    
    STATUS_CHOICES = [
        ('open', 'Registration Open'),
        ('full', 'Tournament Full'),
        ('ongoing', 'In Progress'),
        ('completed', 'Finished'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    def __str__(self):
        return self.title