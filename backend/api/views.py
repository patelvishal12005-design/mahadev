from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Count
from .models import Category, SubCategory, Location, Decoration, DecorationImage, Booking
from .serializers import (
    CategorySerializer, SubCategorySerializer, LocationSerializer,
    DecorationSerializer, DecorationImageSerializer, BookingSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all()
        # If customer site calls with active_only=true or non-admin mode
        active_only = self.request.query_params.get('active_only', None)
        if active_only == 'true':
            queryset = queryset.filter(status=True)
        return queryset


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

    def get_queryset(self):
        queryset = SubCategory.objects.all()
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        active_only = self.request.query_params.get('active_only', None)
        if active_only == 'true':
            queryset = queryset.filter(status=True)
        return queryset


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_queryset(self):
        queryset = Location.objects.all()
        active_only = self.request.query_params.get('active_only', None)
        if active_only == 'true':
            queryset = queryset.filter(status=True)
        return queryset


class DecorationViewSet(viewsets.ModelViewSet):
    queryset = Decoration.objects.all()
    serializer_class = DecorationSerializer

    def get_queryset(self):
        queryset = Decoration.objects.all()

        # Filters
        active_only = self.request.query_params.get('active_only', None)
        if active_only == 'true':
            queryset = queryset.filter(status=True)

        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)

        subcategory = self.request.query_params.get('subcategory', None)
        if subcategory:
            queryset = queryset.filter(subcategory_id=subcategory)

        location = self.request.query_params.get('location', None)
        if location:
            # Matches location by slug or name or ID
            queryset = queryset.filter(
                Q(locations__id=location) | Q(locations__name__iexact=location) | Q(locations__slug=location)
            ).distinct()

        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(featured=True)

        bestseller = self.request.query_params.get('bestseller', None)
        if bestseller == 'true':
            queryset = queryset.filter(bestseller=True)

        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search) |
                Q(subcategory__name__icontains=search)
            ).distinct()

        min_price = self.request.query_params.get('min_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Ordering
        ordering = self.request.query_params.get('ordering', None)
        if ordering == 'price_low':
            queryset = queryset.order_by('price')
        elif ordering == 'price_high':
            queryset = queryset.order_by('-price')
        elif ordering == 'rating':
            queryset = queryset.order_by('-rating')
        elif ordering == 'latest':
            queryset = queryset.order_by('-created_at')

        return queryset


class DecorationImageViewSet(viewsets.ModelViewSet):
    queryset = DecorationImage.objects.all()
    serializer_class = DecorationImageSerializer

    def get_queryset(self):
        queryset = DecorationImage.objects.all()
        decoration_id = self.request.query_params.get('decoration', None)
        if decoration_id:
            queryset = queryset.filter(decoration_id=decoration_id)
        return queryset


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = Booking.objects.all()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        # Check if username is email
        try:
            user_obj = User.objects.get(email=username)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def admin_stats(request):
    total_categories = Category.objects.count()
    total_subcategories = SubCategory.objects.count()
    total_decorations = Decoration.objects.count()
    total_images = DecorationImage.objects.count()
    total_locations = Location.objects.count()
    total_bookings = Booking.objects.count()
    total_users = User.objects.count()

    recent_decorations = DecorationSerializer(Decoration.objects.order_by('-created_at')[:5], many=True).data
    recent_bookings = BookingSerializer(Booking.objects.order_by('-created_at')[:5], many=True).data

    # Booking status count
    pending_bookings = Booking.objects.filter(status='Pending').count()
    confirmed_bookings = Booking.objects.filter(status='Confirmed').count()
    completed_bookings = Booking.objects.filter(status='Completed').count()
    cancelled_bookings = Booking.objects.filter(status='Cancelled').count()

    return Response({
        'total_categories': total_categories,
        'total_subcategories': total_subcategories,
        'total_decorations': total_decorations,
        'total_images': total_images,
        'total_locations': total_locations,
        'total_bookings': total_bookings,
        'total_users': total_users,
        'booking_stats': {
            'pending': pending_bookings,
            'confirmed': confirmed_bookings,
            'completed': completed_bookings,
            'cancelled': cancelled_bookings,
        },
        'recent_decorations': recent_decorations,
        'recent_bookings': recent_bookings,
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def category_decorations(request, pk=None):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    decorations = Decoration.objects.filter(category=category, status=True)
    serializer = DecorationSerializer(decorations, many=True)
    category_serializer = CategorySerializer(category)

    return Response({
        'category': category_serializer.data,
        'decorations': serializer.data
    })
