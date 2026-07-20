from django.urls import path, include

from . import views
urlpatterns = [
    path("", views.all, name="all-vehicles"),
    path("<int:id>/", views.view, name="vehicle-detail"),
    path("create/", views.create, name="create-vehicle"),
    path("update/<int:id>/", views.update, name="update-vehicle"),
    path("delete/<int:id>/", views.delete, name="delete-vehicle"),
    path("register-user/", views.register_user, name="register-user"),
    path("messages/", views.submit_message, name="submit-message"),
]