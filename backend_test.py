import requests
import sys
import json
from datetime import datetime

class BuildConnectAPITester:
    def __init__(self, base_url="https://taskpros-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.customer_token = None
        self.vendor_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_service_categories(self):
        """Test service categories endpoint"""
        success, response = self.run_test(
            "Get Service Categories",
            "GET",
            "services/categories",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"Found {len(response)} service categories")
            return True
        return False

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@buildconnect.com", "password": "admin123"}
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"Admin logged in successfully")
            return True
        return False

    def test_customer_registration(self):
        """Test customer registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        customer_data = {
            "email": f"customer{timestamp}@test.com",
            "password": "password123",
            "full_name": "Test Customer",
            "phone": "9876543210",
            "role": "customer"
        }
        
        success, response = self.run_test(
            "Customer Registration",
            "POST",
            "auth/register",
            200,
            data=customer_data
        )
        if success and 'token' in response:
            self.customer_token = response['token']
            self.customer_data = customer_data
            print(f"Customer registered successfully")
            return True
        return False

    def test_vendor_registration(self):
        """Test vendor registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        vendor_data = {
            "email": f"vendor{timestamp}@test.com",
            "password": "password123",
            "full_name": "Test Vendor",
            "phone": "9876543211",
            "role": "vendor"
        }
        
        success, response = self.run_test(
            "Vendor Registration",
            "POST",
            "auth/register",
            200,
            data=vendor_data
        )
        if success and 'token' in response:
            self.vendor_token = response['token']
            self.vendor_data = vendor_data
            print(f"Vendor registered successfully")
            return True
        return False

    def test_create_booking(self):
        """Test booking creation"""
        if not self.customer_token:
            print("❌ Cannot test booking - no customer token")
            return False
            
        booking_data = {
            "service_name": "Plumber",
            "service_category": "Repair & Maintenance",
            "booking_date": "2024-12-31",
            "time_slot": "9:00 AM - 11:00 AM",
            "location": "123 Test Street, Test City",
            "pincode": "123456",
            "description": "Fix leaking tap",
            "pricing_type": "fixed",
            "estimated_price": 499
        }
        
        success, response = self.run_test(
            "Create Booking",
            "POST",
            "bookings",
            200,
            data=booking_data,
            headers={"Authorization": f"Bearer {self.customer_token}"}
        )
        if success and 'id' in response:
            self.booking_id = response['id']
            print(f"Booking created with ID: {self.booking_id}")
            return True
        return False

    def test_get_bookings(self):
        """Test getting bookings"""
        if not self.customer_token:
            print("❌ Cannot test get bookings - no customer token")
            return False
            
        success, response = self.run_test(
            "Get Customer Bookings",
            "GET",
            "bookings",
            200,
            headers={"Authorization": f"Bearer {self.customer_token}"}
        )
        if success and isinstance(response, list):
            print(f"Found {len(response)} bookings for customer")
            return True
        return False

    def test_vendor_profile_creation(self):
        """Test vendor profile creation"""
        if not self.vendor_token:
            print("❌ Cannot test vendor profile - no vendor token")
            return False
            
        profile_data = {
            "services": ["Plumber", "Electrician"],
            "experience_years": 5,
            "bio": "Experienced professional with 5 years in the field",
            "availability": {"monday": "9-17", "tuesday": "9-17"},
            "hourly_rate": 500,
            "fixed_rate": 1000
        }
        
        success, response = self.run_test(
            "Create Vendor Profile",
            "POST",
            "vendors/profile",
            200,
            data=profile_data,
            headers={"Authorization": f"Bearer {self.vendor_token}"}
        )
        if success and 'id' in response:
            self.vendor_profile_id = response['id']
            print(f"Vendor profile created with ID: {self.vendor_profile_id}")
            return True
        return False

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        if not self.admin_token:
            print("❌ Cannot test admin stats - no admin token")
            return False
            
        success, response = self.run_test(
            "Get Admin Stats",
            "GET",
            "admin/stats",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        if success and 'total_users' in response:
            print(f"Admin stats: {response.get('total_users', 0)} users, {response.get('total_bookings', 0)} bookings")
            return True
        return False

    def test_admin_get_vendors(self):
        """Test admin get all vendors"""
        if not self.admin_token:
            print("❌ Cannot test admin vendors - no admin token")
            return False
            
        success, response = self.run_test(
            "Get All Vendors (Admin)",
            "GET",
            "admin/vendors",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        if success and isinstance(response, list):
            print(f"Found {len(response)} vendors")
            return True
        return False

    def test_vendor_approval(self):
        """Test vendor approval by admin"""
        if not self.admin_token or not hasattr(self, 'vendor_profile_id'):
            print("❌ Cannot test vendor approval - missing tokens or profile")
            return False
            
        success, response = self.run_test(
            "Approve Vendor",
            "PATCH",
            f"admin/vendors/{self.vendor_profile_id}/approve",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        return success

def main():
    print("🚀 Starting BuildConnect API Tests...")
    tester = BuildConnectAPITester()
    
    # Test sequence
    tests = [
        tester.test_service_categories,
        tester.test_admin_login,
        tester.test_customer_registration,
        tester.test_vendor_registration,
        tester.test_create_booking,
        tester.test_get_bookings,
        tester.test_vendor_profile_creation,
        tester.test_admin_stats,
        tester.test_admin_get_vendors,
        tester.test_vendor_approval,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
    
    # Print results
    print(f"\n📊 Test Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"  - {failure}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())