from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Category, SubCategory, Location, Decoration, DecorationImage, Booking
import datetime

class Command(BaseCommand):
    help = "Seed database with initial categories, subcategories, locations, decorations, gallery photos, and admin user"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting Database Seeding..."))

        # 1. Create Superuser / Admin User
        admin_user, created = User.objects.get_or_create(username="admin")
        if created:
            admin_user.set_password("admin123")
            admin_user.email = "admin@decorations.com"
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created admin user: admin / admin123"))
        else:
            admin_user.set_password("admin123")
            admin_user.save()
            self.stdout.write("Admin user refreshed.")

        # 2. Create Locations
        locations_data = [
            "Ahmedabad", "Gandhinagar", "Kadi", "Mehsana",
            "Surat", "Vadodara", "Rajkot", "Mumbai", "Pune"
        ]
        location_objs = {}
        for loc_name in locations_data:
            loc, _ = Location.objects.get_or_create(name=loc_name)
            location_objs[loc_name] = loc
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(location_objs)} locations."))

        # 3. Create Categories & Subcategories
        categories_structure = [
            {
                "name": "Birthday Decoration",
                "image": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
                "description": "Vibrant and festive birthday decor for all ages.",
                "subcategories": [
                    "Balloon Decoration", "Room Decoration", "Kids Birthday",
                    "Rose Gold Theme", "Golden Theme", "Car Boot Decor"
                ]
            },
            {
                "name": "Anniversary Decoration",
                "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
                "description": "Romantic room setups, candle lights, and elegant balloon backdrops.",
                "subcategories": [
                    "Romantic Decoration", "Room Decoration", "Candle Light", "Couple Decoration"
                ]
            },
            {
                "name": "Wedding Decoration",
                "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
                "description": "Grand wedding stage, mandap, haldi & mehendi venue styling.",
                "subcategories": [
                    "Stage Decoration", "Flower Decoration", "Mandap Decoration", "Haldi & Mehendi"
                ]
            },
            {
                "name": "Baby Shower & Welcome",
                "image": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
                "description": "Adorable welcome home baby and baby shower balloon setups.",
                "subcategories": [
                    "Baby Shower Balloon Setup", "Welcome Baby Boy", "Welcome Baby Girl", "Cute Bear Theme"
                ]
            },
            {
                "name": "Proposal & Romance",
                "image": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
                "description": "Unforgettable Marry Me setups with LED letters & roses.",
                "subcategories": [
                    "Marry Me LED Setup", "Rooftop Romantic Setup", "Cabana Decor"
                ]
            }
        ]

        cat_objs = {}
        subcat_objs = {}

        for cat_data in categories_structure:
            cat, _ = Category.objects.get_or_create(
                name=cat_data["name"],
                defaults={
                    "image": cat_data["image"],
                    "description": cat_data["description"],
                    "status": True
                }
            )
            cat_objs[cat.name] = cat
            for sub_name in cat_data["subcategories"]:
                sub, _ = SubCategory.objects.get_or_create(
                    category=cat,
                    name=sub_name,
                    defaults={
                        "image": cat_data["image"],
                        "description": f"Custom {sub_name} styling",
                        "status": True
                    }
                )
                subcat_objs[f"{cat.name}->{sub_name}"] = sub

        self.stdout.write(self.style.SUCCESS(f"Seeded categories and subcategories."))

        # 4. Create Rich Decorations with Multi-Image Galleries
        decorations_seed = [
            {
                "name": "Rose Gold Birthday Balloon Arch Setup",
                "cat": "Birthday Decoration",
                "subcat": "Rose Gold Theme",
                "price": 2499,
                "description": "Premium rose gold metallic balloon arch with LED neon 'Happy Birthday' sign, sequin backdrop curtain, and floating helium balloon clusters.",
                "featured": True,
                "bestseller": True,
                "rating": 4.9,
                "reviews_count": 34,
                "main_image": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Mumbai", "Pune"]
            },
            {
                "name": "Royal Gold & Black Room Decoration",
                "cat": "Birthday Decoration",
                "subcat": "Golden Theme",
                "price": 1999,
                "description": "Elegant black and metallic gold ceiling balloon drops, foil stars, LED fairy lights string, and personalized photo clips.",
                "featured": True,
                "bestseller": False,
                "rating": 4.8,
                "reviews_count": 22,
                "main_image": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Kadi", "Mehsana", "Surat", "Vadodara", "Rajkot"]
            },
            {
                "name": "Romantic Candle Light & Red Rose Bedroom Decor",
                "cat": "Anniversary Decoration",
                "subcat": "Romantic Decoration",
                "price": 2999,
                "description": "Surprise your soulmate with a pathway of red rose petals, heart-shaped helium balloon ceiling, floor candles, and glowing LED 'LOVE' letters.",
                "featured": True,
                "bestseller": True,
                "rating": 5.0,
                "reviews_count": 58,
                "main_image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Rajkot", "Mumbai", "Pune"]
            },
            {
                "name": "Luxury Cabana Canopy Candlelight Dinner Setup",
                "cat": "Anniversary Decoration",
                "subcat": "Candle Light",
                "price": 4999,
                "description": "Private romantic rooftop or lawn cabana draped with sheer white curtains, warm fairy lights, flower centerpiece table, and champagne glasses setup.",
                "featured": True,
                "bestseller": True,
                "rating": 4.9,
                "reviews_count": 41,
                "main_image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Surat", "Vadodara", "Mumbai", "Pune"]
            },
            {
                "name": "Pastel Unicorn Theme Kids Birthday Setup",
                "cat": "Birthday Decoration",
                "subcat": "Kids Birthday",
                "price": 3499,
                "description": "Magical pastel organic balloon arch with custom printed Unicorn backdrop stand, cutouts, birthday age LED number, and cake table decoration.",
                "featured": False,
                "bestseller": True,
                "rating": 4.9,
                "reviews_count": 27,
                "main_image": "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Gandhinagar", "Kadi", "Mehsana", "Surat", "Vadodara", "Rajkot", "Mumbai"]
            },
            {
                "name": "Grand Floral Mandap & Wedding Stage Decor",
                "cat": "Wedding Decoration",
                "subcat": "Stage Decoration",
                "price": 14999,
                "description": "Bespoke wedding stage setup featuring fresh orchid & rose floral pillars, plush royal sofas, LED stage backdrop wash lights, and carpeted walkway.",
                "featured": True,
                "bestseller": False,
                "rating": 5.0,
                "reviews_count": 19,
                "main_image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Rajkot", "Mumbai", "Pune"]
            },
            {
                "name": "Cute Baby Shower Organic Garland Setup",
                "cat": "Baby Shower & Welcome",
                "subcat": "Baby Shower Balloon Setup",
                "price": 2799,
                "description": "Charming baby shower balloon garland in soft white, gold, and pastel hues, completed with teddy bear props and 'Oh Baby' neon sign.",
                "featured": False,
                "bestseller": False,
                "rating": 4.8,
                "reviews_count": 14,
                "main_image": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Mumbai"]
            },
            {
                "name": "Marry Me Illuminated LED Letter Proposal",
                "cat": "Proposal & Romance",
                "subcat": "Marry Me LED Setup",
                "price": 5999,
                "description": "Spell out your love with 3ft giant illuminated 'MARRY ME' letters, red carpet runner, cold spark fireworks effect, and fresh rose petals.",
                "featured": True,
                "bestseller": True,
                "rating": 5.0,
                "reviews_count": 46,
                "main_image": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80"
                ],
                "locations": ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Mumbai", "Pune"]
            }
        ]

        for d_data in decorations_seed:
            cat = cat_objs[d_data["cat"]]
            subcat = subcat_objs.get(f"{d_data['cat']}->{d_data['subcat']}")

            decor, created = Decoration.objects.get_or_create(
                name=d_data["name"],
                defaults={
                    "category": cat,
                    "subcategory": subcat,
                    "price": d_data["price"],
                    "description": d_data["description"],
                    "main_image": d_data["main_image"],
                    "featured": d_data["featured"],
                    "bestseller": d_data["bestseller"],
                    "rating": d_data["rating"],
                    "reviews_count": d_data["reviews_count"],
                    "available": True,
                    "status": True
                }
            )

            # Assign Locations
            loc_list = [location_objs[loc_n] for loc_n in d_data["locations"] if loc_n in location_objs]
            decor.locations.set(loc_list)

            # Assign Gallery Images
            for img_url in d_data["gallery"]:
                DecorationImage.objects.get_or_create(
                    decoration=decor,
                    image=img_url
                )

        self.stdout.write(self.style.SUCCESS("Seeded decorations and multi-image galleries."))

        # 5. Create Sample Bookings
        decor_list = list(Decoration.objects.all())
        sample_bookings = [
            {
                "decor": decor_list[0] if len(decor_list) > 0 else None,
                "name": "Priya Sharma",
                "phone": "+91 98765 43210",
                "email": "priya@gmail.com",
                "location": "Ahmedabad",
                "date": datetime.date.today() + datetime.timedelta(days=5),
                "status": "Pending",
                "notes": "Please deliver by 4 PM at Satellite, Ahmedabad."
            },
            {
                "decor": decor_list[2] if len(decor_list) > 2 else None,
                "name": "Rahul Verma",
                "phone": "+91 98123 45678",
                "email": "rahul.v@yahoo.com",
                "location": "Surat",
                "date": datetime.date.today() + datetime.timedelta(days=2),
                "status": "Confirmed",
                "notes": "Surprise anniversary party setup in bedroom."
            },
            {
                "decor": decor_list[3] if len(decor_list) > 3 else None,
                "name": "Ananya Patel",
                "phone": "+91 99000 11223",
                "email": "ananya@patel.com",
                "location": "Vadodara",
                "date": datetime.date.today() + datetime.timedelta(days=10),
                "status": "Completed",
                "notes": "Rooftop cabana dinner booking."
            }
        ]

        for b_data in sample_bookings:
            Booking.objects.create(
                decoration=b_data["decor"],
                decoration_name=b_data["decor"].name if b_data["decor"] else "Custom Decor",
                customer_name=b_data["name"],
                customer_phone=b_data["phone"],
                customer_email=b_data["email"],
                location=b_data["location"],
                event_date=b_data["date"],
                status=b_data["status"],
                notes=b_data["notes"]
            )

        self.stdout.write(self.style.SUCCESS(f"Seeded sample bookings."))
        self.stdout.write(self.style.SUCCESS("Database Seeding Completed Successfully!"))
