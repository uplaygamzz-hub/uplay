from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, UserProfile, Friendship, Squad

class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=150, required=True)
    last_name = forms.CharField(max_length=150, required=True)
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(max_length=15, required=True, label="WhatsApp No")
    
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={'placeholder': '••••••••'}),
        strip=False,
    )
    password2 = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput(attrs={'placeholder': '••••••••'}),
        strip=False,
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('first_name', 'last_name', 'email', 'phone_number')

class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Username'
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Password'
    }))

class FriendRequestForm(forms.ModelForm):
    class Meta:
        model = Friendship
        fields = ['receiver']
        widgets = {
            'receiver': forms.HiddenInput(),
        }

class SquadForm(forms.ModelForm):
    class Meta:
        model = Squad
        fields = ['name', 'members']
        widgets = {
            'members': forms.CheckboxSelectMultiple(),
        }

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']

class UserProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['avatar', 'bio']

class GamingIDsForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['psn_id', 'xbox_id', 'riot_id', 'activision_id', 'ea_id']

class PayoutDetailsForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['bank_name', 'account_number', 'account_name']
