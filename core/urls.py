from django.contrib import admin
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from drf_spectacular.views import (SpectacularAPIView,SpectacularSwaggerView,SpectacularRedocView)

def home(request):
    return HttpResponse(render_to_string('home.html', request=request))

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path("vehicle/", include("core.vehicle.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_view"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),

    path(
        "api/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
