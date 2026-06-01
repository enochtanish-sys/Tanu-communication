from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from .forms import LoginForm, RegisterForm
from .models import UserProfile, MessageLog


def index(request):
    logout(request)
    return redirect('login')


def login_view(request):
    logout(request)

    form = LoginForm(request, data=request.POST or None)

    if request.method == 'POST':
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f'Welcome back, {user.first_name or user.username}!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'communicate/login.html', {'form': form})

def register_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    form = RegisterForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'Account created! Welcome, {user.first_name}!')
            return redirect('dashboard')
    return render(request, 'communicate/register.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, 'You have been signed out.')
    return redirect('login')


@login_required
def dashboard(request):
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    recent_logs = MessageLog.objects.filter(user=request.user)[:5]
    return render(request, 'communicate/dashboard.html', {
        'profile': profile,
        'recent_logs': recent_logs,
    })


@login_required
@require_POST
def save_message(request):
    try:
        data = json.loads(request.body)
        text = data.get('text', '').strip()
        if text:
            log = MessageLog.objects.create(
                user=request.user,
                original_text=text,
                translated_output=text  # same text, spoken via browser TTS
            )
            return JsonResponse({'status': 'ok', 'id': log.id})
        return JsonResponse({'status': 'error', 'msg': 'Empty text'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': str(e)}, status=500)


@login_required
def history(request):
    logs = MessageLog.objects.filter(user=request.user)
    return render(request, 'communicate/history.html', {'logs': logs})
