from django.contrib import admin
from .models import Vehicle, Brand, Category, ContactMessage

admin.site.register(Vehicle)
admin.site.register(Brand)
admin.site.register(Category)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
	list_display = ("name", "email", "subject", "created_at")
	search_fields = ("name", "email", "subject", "message")
	list_filter = ("created_at",)