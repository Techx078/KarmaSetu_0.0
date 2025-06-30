const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { faker } = require('@faker-js/faker');
const ServiceProvider = require("../models/ServiceProvider"); 

// MongoDB connection string - update with your own connection string
const MONGODB_URI = 'mongodb://127.0.0.1:27017/KarmaSetuV';

// Seed data for Indian states, districts, and local areas
const indianStates = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", 
  "Gujarat", "West Bengal", "Rajasthan", "Telangana", "Kerala"
];

const districtsByState = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Delhi": ["Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"]
};

const localAreasByDistrict = {
  "Mumbai": ["Andheri", "Bandra", "Dadar", "Juhu", "Malad"],
  "Pune": ["Kothrud", "Hadapsar", "Baner", "Viman Nagar", "Hinjewadi"],
  "Bangalore": ["Koramangala", "Indiranagar", "Whitefield", "Jayanagar", "HSR Layout"],
  "Chennai": ["T. Nagar", "Adyar", "Anna Nagar", "Velachery", "Mylapore"],
  "Hyderabad": ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Madhapur", "Kukatpally"],
  "Delhi": ["Connaught Place", "Karol Bagh", "Chandni Chowk", "Hauz Khas", "Lajpat Nagar"],
  "Kolkata": ["Park Street", "Salt Lake", "Ballygunge", "New Town", "Gariahat"],
  "Lucknow": ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Mahanagar"],
  "Ahmedabad": ["Navrangpura", "Satellite", "Bodakdev", "Vastrapur", "Maninagar"],
  "Jaipur": ["Malviya Nagar", "C-Scheme", "Mansarovar", "Vaishali Nagar", "Raja Park"]
};

// Service types with realistic pricing
const serviceTypes = [
  { name: "Mason", pricing: { min: 600, max: 1200 } },
  { name: "Plumber", pricing: { min: 500, max: 1000 } },
  { name: "Electrician", pricing: { min: 500, max: 1100 } },
  { name: "Carpenter", pricing: { min: 600, max: 1300 } },
  { name: "Painter", pricing: { min: 550, max: 1200 } },
  { name: "House Cleaner", pricing: { min: 300, max: 700 } },
  { name: "Pest Control Specialist", pricing: { min: 1000, max: 2500 } },
  { name: "Interior Designer", pricing: { min: 1500, max: 5000 } },
  { name: "AC Repair Technician", pricing: { min: 700, max: 1500 } },
  { name: "Car Washer", pricing: { min: 200, max: 500 } },
  { name: "Bike Mechanic", pricing: { min: 400, max: 900 } },
  { name: "Car Mechanic", pricing: { min: 800, max: 2000 } },
  { name: "Auto Electrician", pricing: { min: 600, max: 1300 } },
  { name: "Car Towing Service", pricing: { min: 1000, max: 3000 } },
  { name: "Babysitter", pricing: { min: 300, max: 800 } },
  { name: "Home Nurse", pricing: { min: 800, max: 2000 } },
  { name: "Elderly Caregiver", pricing: { min: 700, max: 1800 } },
  { name: "Fitness Trainer", pricing: { min: 500, max: 1500 } },
  { name: "Yoga Instructor", pricing: { min: 600, max: 1200 } },
  { name: "Massage Therapist", pricing: { min: 800, max: 2000 } },
  { name: "Beautician", pricing: { min: 500, max: 1500 } },
  { name: "Hair Stylist", pricing: { min: 400, max: 1200 } },
  { name: "Makeup Artist", pricing: { min: 1000, max: 5000 } },
  { name: "Photographer", pricing: { min: 1500, max: 5000 } },
  { name: "Videographer", pricing: { min: 2000, max: 6000 } },
  { name: "Wedding Planner", pricing: { min: 5000, max: 20000 } },
  { name: "Event Decorator", pricing: { min: 2000, max: 8000 } },
  { name: "DJ & Sound System Provider", pricing: { min: 3000, max: 10000 } },
  { name: "Catering Services", pricing: { min: 200, max: 500 } }, // per plate
  { name: "Private Tutor", pricing: { min: 300, max: 1000 } },
  { name: "Music Teacher", pricing: { min: 500, max: 1500 } },
  { name: "Dance Instructor", pricing: { min: 500, max: 1500 } },
  { name: "Language Trainer", pricing: { min: 400, max: 1200 } },
  { name: "Computer Repair Technician", pricing: { min: 500, max: 1500 } },
  { name: "Mobile Repair Specialist", pricing: { min: 400, max: 1200 } },
  { name: "CCTV Installation Technician", pricing: { min: 800, max: 2000 } },
  { name: "Smart Home Installation Expert", pricing: { min: 1000, max: 3000 } },
  { name: "Packers & Movers", pricing: { min: 3000, max: 10000 } },
  { name: "Furniture Assembler", pricing: { min: 500, max: 1200 } },
  { name: "Delivery Assistant", pricing: { min: 300, max: 800 } },
  { name: "Legal Consultant", pricing: { min: 1500, max: 5000 } },
  { name: "Tax Consultant", pricing: { min: 1000, max: 3000 } },
  { name: "Financial Advisor", pricing: { min: 1500, max: 4000 } },
  { name: "Security Guard", pricing: { min: 15000, max: 25000 } }, // monthly
  { name: "Bouncer", pricing: { min: 2000, max: 5000 } }, // per event
  { name: "Cook/Chef", pricing: { min: 800, max: 2500 } },
  { name: "Pet Trainer", pricing: { min: 700, max: 2000 } },
  { name: "Gardener", pricing: { min: 400, max: 900 } },
  { name: "Laundry & Ironing Services", pricing: { min: 20, max: 50 } }, // per item
  { name: "Tailor", pricing: { min: 300, max: 1500 } }
];

// Pricing models
const pricingModels = ['Hourly', 'Fixed'];

// Function to generate random Indian phone number
function generateIndianPhoneNumber() {
  const operators = ['9', '8', '7', '6'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)];
  const restOfNumber = faker.string.numeric(9);
  return randomOperator + restOfNumber;
}

// Function to get random Indian location with address and coordinates
function getRandomIndianLocation() {
  const state = indianStates[Math.floor(Math.random() * indianStates.length)];
  const districtsForState = districtsByState[state] || districtsByState["Maharashtra"];
  const district = districtsForState[Math.floor(Math.random() * districtsForState.length)];
  
  // Get local areas for this district, or default to Mumbai areas if not found
  const localAreasForDistrict = localAreasByDistrict[district] || localAreasByDistrict["Mumbai"];
  const local = localAreasForDistrict[Math.floor(Math.random() * localAreasForDistrict.length)];
  
  // Create approximate coordinates based on the state
  // These are very approximate ranges for demonstration
  let latitude, longitude;
  
  switch(state) {
    case "Maharashtra":
      latitude = faker.number.float({ min: 18.0, max: 21.0, precision: 0.0001 });
      longitude = faker.number.float({ min: 72.5, max: 79.0, precision: 0.0001 });
      break;
    case "Delhi":
      latitude = faker.number.float({ min: 28.4, max: 28.8, precision: 0.0001 });
      longitude = faker.number.float({ min: 76.8, max: 77.4, precision: 0.0001 });
      break;
    case "Karnataka":
      latitude = faker.number.float({ min: 12.5, max: 15.5, precision: 0.0001 });
      longitude = faker.number.float({ min: 74.5, max: 78.0, precision: 0.0001 });
      break;
    default:
      // Default coordinates covering most of India
      latitude = faker.number.float({ min: 8.0, max: 34.0, precision: 0.0001 });
      longitude = faker.number.float({ min: 68.0, max: 97.0, precision: 0.0001 });
  }
  
  return {
    Address: {
      State: state,
      District: district,
      Local: local
    },
    location: {
      latitude,
      longitude
    }
  };
}

async function generateServiceProviders(count = 80) {
  // Hash a default password
  const hashedPassword = await bcrypt.hash('password123', 10);
  const serviceProviders = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const randomService = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const randomPricingModel = pricingModels[Math.floor(Math.random() * pricingModels.length)];
    const locationData = getRandomIndianLocation();
    
    // Random experience between 1 and 15 years
    const experience = Math.floor(Math.random() * 15) + 1;
    
    // Random earnings between 0 and 50000
    const earnings = Math.floor(Math.random() * 50000);
    
    // 80% chance of being verified
    const isVerified = Math.random() < 0.8;
    
    // Profile image (placeholder)
    const profileImage = {
      url: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${i % 99}.jpg`,
      filename: `profile_${i}.jpg`
    };
  
    // New: Generate average rating and total ratings
    const averageRating = parseFloat((Math.random() * 4 + 1).toFixed(1)); // Random rating between 1 and 5
    const totalRatings = Math.floor(Math.random() * 100); // Random total ratings count

    const serviceProvider = {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
      phone: generateIndianPhoneNumber(),
      password: hashedPassword, // Already hashed password
      profileImage,
      experience,
      Address: locationData.Address,
      location: locationData.location,
      service: {
        name: randomService.name,
        pricingModel: randomPricingModel,
        price: faker.number.int({ min: randomService.pricing.min, max: randomService.pricing.max })
      },
      availability: Math.random() < 0.8, // 80% chance of being available
      bookings: [],
      earnings,
      reviews: [],
      notifications: [],
      isVerified,
      isActive: Math.random() < 0.9, // 90% chance of being active
      // New fields for ratings
      rating: {
        average: averageRating,
        totalRatings: totalRatings
      }
    };

    serviceProviders.push(serviceProvider);
  }

  return serviceProviders;
}
// Connect to MongoDB and insert data
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
  
    
    // Check if collection already has data
    const count = await ServiceProvider.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} records. Clearing existing data.`);
      await ServiceProvider.deleteMany({});
    }
    
    const serviceProviders = await generateServiceProviders(80);
    await ServiceProvider.insertMany(serviceProviders);
    
    console.log('80 service providers added successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase();