from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, SubCategoryViewSet, LocationViewSet,
    DecorationViewSet, DecorationImageViewSet, BookingViewSet,
    admin_login, admin_stats, category_decorations
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'decorations', DecorationViewSet)
router.register(r'decoration-images', DecorationImageViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('auth/login/', admin_login, name='admin_login'),
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('categories/<int:pk>/decorations/', category_decorations, name='category_decorations'),
    path('', include(router.urls)),
]
