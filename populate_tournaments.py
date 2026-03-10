import os
import django
from django.utils import timezone
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from uplay_app.models import Tournament, Game, Category

def populate():
    # Ensure categories exist
    general_cat, _ = Category.objects.get_or_create(name="General", description="General gaming tournaments")
    
    # Ensure games exist
    pes, _ = Game.objects.get_or_create(title="eFootball PES", category=general_cat)
    valorant, _ = Game.objects.get_or_create(title="Valorant", category=general_cat)
    codm, _ = Game.objects.get_or_create(title="COD Mobile", category=general_cat)
    eafc, _ = Game.objects.get_or_create(title="EA FC 24", category=general_cat)

    # Current year for dates
    current_year = timezone.now().year

    # 1. PES Open
    Tournament.objects.update_or_create(
        title="PES 2024 Masters Open - Africa",
        defaults={
            'game': pes,
            'start_date': timezone.make_aware(datetime(current_year, 10, 25, 14, 0)),
            'end_date': timezone.make_aware(datetime(current_year, 10, 25, 20, 0)),
            'prize_pool': "₦500,000",
            'entry_fee': 5000,
            'is_paid': True,
            'tournament_format': "1v1 Bracket",
            'status': 'open',
            'banner_image': "https://images.unsplash.com/photo-1518605368461-1ebce51f67f2?q=80&w=600&auto=format&fit=crop"
        }
    )

    # 2. Valorant Campus Clash
    Tournament.objects.update_or_create(
        title="Valorant Campus Clash Series",
        defaults={
            'game': valorant,
            'start_date': timezone.make_aware(datetime(current_year, 10, 28, 18, 0)),
            'end_date': timezone.make_aware(datetime(current_year, 10, 28, 23, 0)),
            'prize_pool': "₦150,000",
            'entry_fee': 2000,
            'is_paid': True,
            'tournament_format': "5v5 Squads",
            'status': 'open',
            'banner_image': "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"
        }
    )

    # 3. CODM Weekly (Live)
    Tournament.objects.update_or_create(
        title="CODM Weekly Battle Royale",
        defaults={
            'game': codm,
            'start_date': timezone.now(),
            'end_date': timezone.now() + timezone.timedelta(hours=4),
            'prize_pool': "₦50,000",
            'entry_fee': 0,
            'is_paid': False,
            'tournament_format': "100 Player BR",
            'status': 'live',
            'banner_image': "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?q=80&w=600&auto=format&fit=crop"
        }
    )

    # 4. EA FC Weekend League
    Tournament.objects.update_or_create(
        title="EA FC Weekend League Draft",
        defaults={
            'game': eafc,
            'start_date': timezone.make_aware(datetime(current_year, 10, 15, 10, 0)),
            'end_date': timezone.make_aware(datetime(current_year, 10, 15, 18, 0)),
            'prize_pool': "₦0",
            'entry_fee': 0,
            'is_paid': False,
            'tournament_format': "Draft",
            'status': 'completed',
            'banner_image': "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop"
        }
    )

    print("Populated demo tournaments successfully!")

if __name__ == "__main__":
    populate()
