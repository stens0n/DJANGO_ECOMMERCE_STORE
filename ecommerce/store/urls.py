from django.urls import path
from . import views


urlpatterns = [
    path('', views.store, name="store"), #empty string for base url
    path('cart/', views.cart, name="cart"),
    path('checkout/', views.checkout, name="checkout")
]