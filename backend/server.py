from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= MODELS =============

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: str
    role: str = "customer"  # customer, vendor, admin

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    full_name: str
    phone: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class ServiceCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    icon: str
    services: List[str]

class ServiceProvider(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    services: List[str]
    experience_years: int
    bio: str
    availability: dict
    hourly_rate: Optional[float] = None
    fixed_rate: Optional[float] = None
    approval_status: str = "pending"  # pending, approved, rejected
    rating: float = 0.0
    total_reviews: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ServiceProviderCreate(BaseModel):
    services: List[str]
    experience_years: int
    bio: str
    availability: dict
    hourly_rate: Optional[float] = None
    fixed_rate: Optional[float] = None

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    vendor_id: Optional[str] = None
    service_name: str
    service_category: str
    booking_date: str
    time_slot: str
    location: str
    pincode: str
    description: str
    status: str = "pending"  # pending, assigned, confirmed, in_progress, completed, cancelled
    pricing_type: str = "fixed"  # fixed, hourly, inspection
    estimated_price: float
    final_price: Optional[float] = None
    payment_status: str = "unpaid"  # unpaid, paid
    payment_method: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BookingCreate(BaseModel):
    service_name: str
    service_category: str
    booking_date: str
    time_slot: str
    location: str
    pincode: str
    description: str
    pricing_type: str = "fixed"
    estimated_price: float

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    vendor_id: Optional[str] = None
    final_price: Optional[float] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str
    customer_id: str
    vendor_id: str
    rating: int  # 1-5
    comment: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReviewCreate(BaseModel):
    booking_id: str
    vendor_id: str
    rating: int
    comment: str

# ============= UTILITIES =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    user = await db.users.find_one({"id": payload['user_id']}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

async def get_vendor_user(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'vendor':
        raise HTTPException(status_code=403, detail="Vendor access required")
    return current_user

# ============= AUTH ROUTES =============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    user_dict = {
        "id": user_id,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "role": user_data.role,
        "password_hash": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_token(user_id, user_data.email, user_data.role)
    
    # Return response
    user_response = UserResponse(
        id=user_id,
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=user_data.role,
        created_at=user_dict["created_at"]
    )
    
    return TokenResponse(token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create token
    token = create_token(user['id'], user['email'], user['role'])
    
    user_response = UserResponse(
        id=user['id'],
        email=user['email'],
        full_name=user['full_name'],
        phone=user['phone'],
        role=user['role'],
        created_at=user['created_at']
    )
    
    return TokenResponse(token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# ============= SERVICES ROUTES =============

@api_router.get("/services/categories")
async def get_categories():
    categories = await db.service_categories.find({}, {"_id": 0}).to_list(100)
    return categories

@api_router.get("/services/search")
async def search_services(category: Optional[str] = None, query: Optional[str] = None):
    filter_query = {}
    if category:
        filter_query["slug"] = category
    
    categories = await db.service_categories.find(filter_query, {"_id": 0}).to_list(100)
    return categories

# ============= BOOKINGS ROUTES =============

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate, current_user: dict = Depends(get_current_user)):
    booking_dict = booking_data.model_dump()
    booking_dict['id'] = str(uuid.uuid4())
    booking_dict['customer_id'] = current_user['id']
    booking_dict['status'] = 'pending'
    booking_dict['payment_status'] = 'unpaid'
    booking_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.bookings.insert_one(booking_dict)
    return Booking(**booking_dict)

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(current_user: dict = Depends(get_current_user)):
    if current_user['role'] == 'admin':
        bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    elif current_user['role'] == 'vendor':
        bookings = await db.bookings.find({"vendor_id": current_user['id']}, {"_id": 0}).to_list(1000)
    else:
        bookings = await db.bookings.find({"customer_id": current_user['id']}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check access
    if current_user['role'] not in ['admin'] and booking['customer_id'] != current_user['id'] and booking.get('vendor_id') != current_user['id']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return Booking(**booking)

@api_router.patch("/bookings/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, update_data: BookingUpdate, current_user: dict = Depends(get_current_user)):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Build update dict
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.bookings.update_one({"id": booking_id}, {"$set": update_dict})
        booking.update(update_dict)
    
    return Booking(**booking)

# ============= VENDOR ROUTES =============

@api_router.post("/vendors/profile", response_model=ServiceProvider)
async def create_vendor_profile(profile_data: ServiceProviderCreate, current_user: dict = Depends(get_current_user)):
    # Check if profile exists
    existing = await db.service_providers.find_one({"user_id": current_user['id']}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Vendor profile already exists")
    
    profile_dict = profile_data.model_dump()
    profile_dict['id'] = str(uuid.uuid4())
    profile_dict['user_id'] = current_user['id']
    profile_dict['approval_status'] = 'pending'
    profile_dict['rating'] = 0.0
    profile_dict['total_reviews'] = 0
    profile_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.service_providers.insert_one(profile_dict)
    
    # Update user role to vendor
    await db.users.update_one({"id": current_user['id']}, {"$set": {"role": "vendor"}})
    
    return ServiceProvider(**profile_dict)

@api_router.get("/vendors/profile")
async def get_vendor_profile(current_user: dict = Depends(get_current_user)):
    profile = await db.service_providers.find_one({"user_id": current_user['id']}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    return profile

@api_router.get("/vendors")
async def get_vendors(service: Optional[str] = None, approved_only: bool = True):
    filter_query = {}
    if approved_only:
        filter_query['approval_status'] = 'approved'
    if service:
        filter_query['services'] = service
    
    vendors = await db.service_providers.find(filter_query, {"_id": 0}).to_list(1000)
    return vendors

@api_router.get("/vendors/bookings")
async def get_vendor_bookings(current_user: dict = Depends(get_vendor_user)):
    bookings = await db.bookings.find({"vendor_id": current_user['id']}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.get("/vendors/earnings")
async def get_vendor_earnings(current_user: dict = Depends(get_vendor_user)):
    # Calculate earnings from completed bookings
    bookings = await db.bookings.find({
        "vendor_id": current_user['id'],
        "status": "completed",
        "payment_status": "paid"
    }, {"_id": 0}).to_list(1000)
    
    total_earnings = sum(b.get('final_price', b.get('estimated_price', 0)) for b in bookings)
    commission_rate = 0.15  # 15% platform commission
    platform_commission = total_earnings * commission_rate
    net_earnings = total_earnings - platform_commission
    
    return {
        "total_bookings": len(bookings),
        "total_earnings": total_earnings,
        "platform_commission": platform_commission,
        "net_earnings": net_earnings,
        "commission_rate": commission_rate
    }

# ============= REVIEWS ROUTES =============

@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user: dict = Depends(get_current_user)):
    # Verify booking exists and belongs to user
    booking = await db.bookings.find_one({"id": review_data.booking_id, "customer_id": current_user['id']}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking['status'] != 'completed':
        raise HTTPException(status_code=400, detail="Can only review completed bookings")
    
    # Check if review already exists
    existing = await db.reviews.find_one({"booking_id": review_data.booking_id}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Review already submitted")
    
    review_dict = review_data.model_dump()
    review_dict['id'] = str(uuid.uuid4())
    review_dict['customer_id'] = current_user['id']
    review_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.reviews.insert_one(review_dict)
    
    # Update vendor rating
    vendor_reviews = await db.reviews.find({"vendor_id": review_data.vendor_id}, {"_id": 0}).to_list(1000)
    avg_rating = sum(r['rating'] for r in vendor_reviews) / len(vendor_reviews)
    await db.service_providers.update_one(
        {"user_id": review_data.vendor_id},
        {"$set": {"rating": avg_rating, "total_reviews": len(vendor_reviews)}}
    )
    
    return Review(**review_dict)

@api_router.get("/reviews/vendor/{vendor_id}")
async def get_vendor_reviews(vendor_id: str):
    reviews = await db.reviews.find({"vendor_id": vendor_id}, {"_id": 0}).to_list(1000)
    return reviews

# ============= ADMIN ROUTES =============

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: dict = Depends(get_admin_user)):
    total_users = await db.users.count_documents({})
    total_bookings = await db.bookings.count_documents({})
    total_vendors = await db.service_providers.count_documents({})
    pending_vendors = await db.service_providers.count_documents({"approval_status": "pending"})
    
    # Calculate revenue
    completed_bookings = await db.bookings.find({
        "status": "completed",
        "payment_status": "paid"
    }, {"_id": 0}).to_list(10000)
    
    total_revenue = sum(b.get('final_price', b.get('estimated_price', 0)) for b in completed_bookings)
    commission_rate = 0.15
    platform_revenue = total_revenue * commission_rate
    
    return {
        "total_users": total_users,
        "total_bookings": total_bookings,
        "total_vendors": total_vendors,
        "pending_vendors": pending_vendors,
        "total_revenue": total_revenue,
        "platform_revenue": platform_revenue
    }

@api_router.patch("/admin/vendors/{vendor_id}/approve")
async def approve_vendor(vendor_id: str, current_user: dict = Depends(get_admin_user)):
    result = await db.service_providers.update_one(
        {"id": vendor_id},
        {"$set": {"approval_status": "approved"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"message": "Vendor approved"}

@api_router.patch("/admin/vendors/{vendor_id}/reject")
async def reject_vendor(vendor_id: str, current_user: dict = Depends(get_admin_user)):
    result = await db.service_providers.update_one(
        {"id": vendor_id},
        {"$set": {"approval_status": "rejected"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"message": "Vendor rejected"}

@api_router.get("/admin/vendors")
async def get_all_vendors(current_user: dict = Depends(get_admin_user)):
    vendors = await db.service_providers.find({}, {"_id": 0}).to_list(1000)
    # Populate user details
    for vendor in vendors:
        user = await db.users.find_one({"id": vendor['user_id']}, {"_id": 0, "password_hash": 0})
        if user:
            vendor['user_details'] = user
    return vendors

@api_router.get("/admin/bookings")
async def get_all_bookings(current_user: dict = Depends(get_admin_user)):
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.on_event("startup")
async def startup_seed_data():
    # Seed service categories if empty
    count = await db.service_categories.count_documents({})
    if count == 0:
        categories = [
            {
                "id": str(uuid.uuid4()),
                "name": "Repair & Maintenance",
                "slug": "repair-maintenance",
                "description": "Expert repair and maintenance services for your home and office",
                "icon": "Wrench",
                "services": ["Plumber", "Electrician", "Carpenter", "Handyman", "AC Technician", "Refrigerator Repair", "Washing Machine Repair", "Microwave Repair", "Geyser Repair", "RO Technician", "Inverter Repair"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Cleaning & Housekeeping",
                "slug": "cleaning-housekeeping",
                "description": "Professional cleaning services for spotless spaces",
                "icon": "Sparkles",
                "services": ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Bathroom Cleaning", "Kitchen Cleaning", "Sofa Cleaning", "Carpet Cleaning", "Water Tank Cleaning", "Pest Control"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Painting & Renovation",
                "slug": "painting-renovation",
                "description": "Transform your space with expert painting and renovation",
                "icon": "PaintBucket",
                "services": ["Interior Painting", "Exterior Painting", "Wall Putty", "Tile Installation", "Flooring", "False Ceiling", "Waterproofing", "Wallpaper Installation"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Security & Safety",
                "slug": "security-safety",
                "description": "Keep your property secure with professional security services",
                "icon": "Shield",
                "services": ["Security Guard", "CCTV Installation", "Alarm System", "Fire Safety Equipment", "Smart Locks"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Personal & Domestic",
                "slug": "personal-domestic",
                "description": "Reliable domestic help for your daily needs",
                "icon": "Home",
                "services": ["Maid", "Cook", "Babysitter", "Elder Care", "Driver"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Office Services",
                "slug": "office-services",
                "description": "Professional office support services",
                "icon": "Briefcase",
                "services": ["IT Support", "Computer Repair", "Printer Repair", "Network Setup", "Facility Management"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Moving & Logistics",
                "slug": "moving-logistics",
                "description": "Safe and efficient moving and storage solutions",
                "icon": "Truck",
                "services": ["Packers & Movers", "House Shifting", "Office Relocation", "Storage Services"]
            }
        ]
        await db.service_categories.insert_many(categories)
        logger.info("Seeded service categories")
    
    # Create admin user if doesn't exist
    admin_exists = await db.users.find_one({"role": "admin"}, {"_id": 0})
    if not admin_exists:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@buildconnect.com",
            "full_name": "Admin User",
            "phone": "9999999999",
            "role": "admin",
            "password_hash": hash_password("admin123"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info("Created admin user: admin@buildconnect.com / admin123")
