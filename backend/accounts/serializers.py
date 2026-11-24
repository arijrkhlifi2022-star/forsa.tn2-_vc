from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'phone', 'password', 'confirm_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"password": "Les mots de passe ne correspondent pas."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # create_user يشفر كلمة السر تلقائياً بـ Argon2
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone'],
            password=validated_data['password'],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # نرجّعوا البيانات الآمنة فقط (أبداً ما نرجّعوش كلمة السر)
        fields = ('id', 'first_name', 'last_name', 'email', 'phone')