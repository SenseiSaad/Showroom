from django.urls import path, include

from . import views
urlpatterns = [
    path("vehicle/", views.all, name="all-vehicles"),
    path("vehicle/<int:id>/", views.view, name="vehicle-detail"),
    path("vehicle/create/", views.create, name="create-vehicle"),
    path("vehicle/update/<int:id>/", views.update, name="update-vehicle"),
    path("vehicle/delete/<int:id>/", views.delete, name="delete-vehicle"),
]