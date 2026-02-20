from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Player, Game, Tournament

# Registering models makes them appear in the /admin dashboard
admin.site.register(Player, UserAdmin)
admin.site.register(Game)
admin.site.register(Tournament)