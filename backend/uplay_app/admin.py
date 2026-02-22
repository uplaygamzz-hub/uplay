from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Player, Game, Tournament, PendingRegistration, Transaction, Category
from django.utils.html import format_html

# Basic Model Registrations
admin.site.register(Player, UserAdmin)
admin.site.register(Game)
admin.site.register(Tournament)
admin.site.register(Category)

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

class TransactionAdmin(admin.ModelAdmin):
    list_display = ['player', 'tournament', 'timestamp']
    readonly_fields = ['player', 'tournament', 'receipt', 'timestamp']
    
    # Transactions should be immutable (read-only for audit)
    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False

admin.site.register(PendingRegistration, PendingRegistrationAdmin)
admin.site.register(Transaction, TransactionAdmin)

class TournamentAdmin(admin.ModelAdmin):
    # 'participant_count' is the custom method we define below
    list_display = ['title', 'game', 'status', 'participant_count', 'max_participants', 'start_date', 'end_date']
    
    filter_horizontal = ('participants',)

    # This function calculates the number of participants for each row
    def participant_count(self, obj):
        return obj.participants.count()

    # This sets the column header name in the admin table
    participant_count.short_description = 'Registered'

# Unregister the simple version and register the enhanced version
admin.site.unregister(Tournament)
admin.site.register(Tournament, TournamentAdmin)