from django.apps import AppConfig


class UplayAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'uplay_app'

    def ready(self):
        import uplay_app.signals
