from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=120, blank=True)
    description = models.TextField(blank=True, default='')
    image = models.TextField(blank=True, default='') # URL or Base64 / media path
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, blank=True)
    description = models.TextField(blank=True, default='')
    image = models.TextField(blank=True, default='')
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "SubCategories"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category.name} -> {self.name}"


class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, max_length=120, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Decoration(models.Model):
    category = models.ForeignKey(Category, related_name='decorations', on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, related_name='decorations', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    locations = models.ManyToManyField(Location, related_name='decorations', blank=True)
    main_image = models.TextField() # Image URL or Base64
    available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    bestseller = models.BooleanField(default=False)
    rating = models.FloatField(default=4.8)
    reviews_count = models.IntegerField(default=15)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class DecorationImage(models.Model):
    decoration = models.ForeignKey(Decoration, related_name='images', on_delete=models.CASCADE)
    image = models.TextField() # Image URL or Base64
    caption = models.CharField(max_length=200, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"Image for {self.decoration.name}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    decoration = models.ForeignKey(Decoration, related_name='bookings', on_delete=models.SET_NULL, null=True, blank=True)
    decoration_name = models.CharField(max_length=200, blank=True, default='') # Fallback if decoration deleted
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField(blank=True, default='')
    customer_phone = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    event_date = models.DateField()
    notes = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} - {self.customer_name} ({self.status})"
