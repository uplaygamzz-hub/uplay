from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Game, Tournament, PendingRegistration, Transaction, Category, Friendship, Squad, UserProfile
from django.utils.html import format_html

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone_number',)}),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'psn_id', 'xbox_id', 'bank_name', 'account_number']
    search_fields = ['user__username', 'bank_name']

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ['title', 'category']
    search_fields = ['title', 'category__name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.action(description='Approve and Move to Transactions')
def approve_and_record(modeladmin, request, queryset):
    count = 0
    for pending in queryset:
        # Archive the data into the Transaction model
        Transaction.objects.create(
            player=pending.player,
            tournament=pending.tournament,
            receipt=pending.receipt,
        )

        # Add player to the actual tournament
        pending.tournament.participants.add(pending.player)
        
        # Handle 'Full' status logic
        if pending.tournament.participants.count() >= pending.tournament.max_participants:
            pending.tournament.status = 'full'
            pending.tournament.save()
        
        # Delete the pending request
        pending.delete()
        count += 1
    
    modeladmin.message_user(request, f"Successfully approved {count} players. Records moved to Transactions.")

@admin.register(PendingRegistration)
class PendingRegistrationAdmin(admin.ModelAdmin):
    list_display = ['player', 'tournament', 'view_receipt_thumbnail', 'submitted_at']
    actions = [approve_and_record]
    
    readonly_fields = ['player', 'tournament', 'receipt', 'submitted_at']
    fields = ['player', 'tournament', 'receipt', 'view_receipt_thumbnail', 'submitted_at']

    def has_add_permission(self, request):
        return False

    def view_receipt_thumbnail(self, obj):
        if obj.receipt:
            return format_html(
                '<a href="{0}" target="_blank"><img src="{0}" style="width: 100px; height: auto; border: 1px solid #ddd;" /></a>',
                obj.receipt.url
            )
        return "No Receipt"
    
    view_receipt_thumbnail.short_description = 'Receipt Preview'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['player', 'tournament', 'timestamp']
    readonly_fields = ['player', 'tournament', 'receipt', 'timestamp']
    
    # Transactions should be immutable (read-only for audit)
    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False

@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['sender__username', 'receiver__username']

@admin.register(Squad)
class SquadAdmin(admin.ModelAdmin):
    list_display = ['name', 'leader', 'created_at']
    filter_horizontal = ('members',)
    search_fields = ['name', 'leader__username']

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    # 'participant_count' is the custom method we define below
    list_display = ['title', 'game', 'status', 'participant_count', 'max_participants', 'start_date', 'end_date']
    
    filter_horizontal = ('participants',)

    # This function calculates the number of participants for each row
    def participant_count(self, obj):
        return obj.participants.count()

    # This sets the column header name in the admin table
    participant_count.short_description = 'Registered'