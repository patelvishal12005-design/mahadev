from rest_framework import serializers
from .models import Category, SubCategory, Location, Decoration, DecorationImage, Booking

class SubCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = SubCategory
        fields = ['id', 'category', 'category_name', 'name', 'slug', 'description', 'image', 'status', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    decorations_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'status', 'created_at', 'subcategories', 'decorations_count']

    def get_decorations_count(self, obj):
        return obj.decorations.filter(status=True).count()


class LocationSerializer(serializers.ModelSerializer):
    decorations_count = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ['id', 'name', 'slug', 'status', 'created_at', 'decorations_count']

    def get_decorations_count(self, obj):
        return obj.decorations.filter(status=True).count()


class DecorationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DecorationImage
        fields = ['id', 'decoration', 'image', 'caption', 'created_at']


class DecorationSerializer(serializers.ModelSerializer):
    images = DecorationImageSerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    subcategory_name = serializers.ReadOnlyField(source='subcategory.name', default='')
    location_details = LocationSerializer(source='locations', many=True, read_only=True)
    location_ids = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        many=True,
        write_only=True,
        source='locations',
        required=False
    )

    class Meta:
        model = Decoration
        fields = [
            'id', 'category', 'category_name', 'subcategory', 'subcategory_name',
            'name', 'slug', 'description', 'price', 'locations', 'location_details', 'location_ids',
            'main_image', 'images', 'available', 'featured', 'bestseller',
            'rating', 'reviews_count', 'status', 'created_at'
        ]

    def create(self, validated_data):
        locations = validated_data.pop('locations', [])
        decoration = Decoration.objects.create(**validated_data)
        if locations:
            decoration.locations.set(locations)
        return decoration

    def update(self, instance, validated_data):
        locations = validated_data.pop('locations', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if locations is not None:
            instance.locations.set(locations)
        return instance


class BookingSerializer(serializers.ModelSerializer):
    decoration_title = serializers.SerializerMethodField()
    decoration_image = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'decoration', 'decoration_name', 'decoration_title', 'decoration_image',
            'customer_name', 'customer_email', 'customer_phone', 'location',
            'event_date', 'notes', 'status', 'created_at'
        ]

    def get_decoration_title(self, obj):
        if obj.decoration:
            return obj.decoration.name
        return obj.decoration_name or 'General Custom Request'

    def get_decoration_image(self, obj):
        if obj.decoration:
            return obj.decoration.main_image
        return ''
