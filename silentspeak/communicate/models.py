from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [('mute', 'Speech-Impaired User'), ('helper', 'Helper/Listener')]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='mute')
    avatar_initials = models.CharField(max_length=2, blank=True)

    def save(self, *args, **kwargs):
        if not self.avatar_initials and self.user:
            self.avatar_initials = (self.user.first_name[:1] + self.user.last_name[:1]).upper() or self.user.username[:2].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class MessageLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_text = models.TextField()
    translated_output = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.original_text[:40]}"
