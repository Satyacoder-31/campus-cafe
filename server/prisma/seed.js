const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Breakfast', icon: '🌅', sortOrder: 1 },
  { name: 'South Indian', icon: '🥘', sortOrder: 2 },
  { name: 'North Indian', icon: '🍛', sortOrder: 3 },
  { name: 'Snacks', icon: '🍟', sortOrder: 4 },
  { name: 'Fast Food', icon: '🍔', sortOrder: 5 },
  { name: 'Chinese', icon: '🍜', sortOrder: 6 },
  { name: 'Beverages', icon: '☕', sortOrder: 7 },
  { name: 'Desserts', icon: '🍰', sortOrder: 8 },
];

const foodItems = [
  // Breakfast
  { name: 'Poha', description: 'Flattened rice cooked with spices, onions & peas', price: 40, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500', isVeg: true, rating: 4.5, ratingCount: 120, isSpecial: true, calories: 250, ingredients: JSON.stringify(['Flattened rice', 'Onion', 'Peas', 'Mustard seeds', 'Curry leaves', 'Lemon']), addOns: JSON.stringify([{ name: 'Extra Peanuts', price: 5 }, { name: 'Sev', price: 5 }]), categoryName: 'Breakfast' },
  { name: 'Bread Omelette', description: 'Fluffy egg omelette served with toasted bread slices', price: 55, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500', isVeg: false, rating: 4.4, ratingCount: 98, calories: 350, ingredients: JSON.stringify(['Egg', 'Bread', 'Onion', 'Green chilli', 'Butter']), addOns: JSON.stringify([{ name: 'Extra Egg', price: 15 }, { name: 'Cheese', price: 20 }]), categoryName: 'Breakfast' },
  { name: 'Upma', description: 'Classic semolina porridge with vegetables & nuts', price: 35, image: 'https://images.unsplash.com/photo-1605197584547-ce028c4e1e65?w=500', isVeg: true, rating: 4.2, ratingCount: 75, calories: 220, ingredients: JSON.stringify(['Semolina', 'Vegetables', 'Cashews', 'Mustard seeds', 'Curry leaves']), addOns: JSON.stringify([{ name: 'Coconut Chutney', price: 10 }]), categoryName: 'Breakfast' },

  // South Indian
  { name: 'Masala Dosa', description: 'Crispy golden dosa filled with spiced potato masala, served with sambar & chutneys', price: 70, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500', isVeg: true, rating: 4.8, ratingCount: 350, isSpecial: true, calories: 380, ingredients: JSON.stringify(['Rice batter', 'Potato', 'Onion', 'Mustard seeds', 'Turmeric', 'Curry leaves']), addOns: JSON.stringify([{ name: 'Extra Sambar', price: 10 }, { name: 'Butter', price: 10 }, { name: 'Ghee', price: 15 }]), categoryName: 'South Indian' },
  { name: 'Idli Sambar', description: 'Soft steamed rice cakes served with hot sambar & coconut chutney', price: 50, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500', isVeg: true, rating: 4.6, ratingCount: 280, calories: 280, ingredients: JSON.stringify(['Rice', 'Urad dal', 'Sambar', 'Coconut chutney']), addOns: JSON.stringify([{ name: 'Extra Sambar', price: 10 }, { name: 'Podi with Ghee', price: 15 }]), categoryName: 'South Indian' },
  { name: 'Medu Vada', description: 'Crispy fried lentil donuts served with sambar & chutney', price: 45, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500', isVeg: true, rating: 4.5, ratingCount: 190, calories: 320, ingredients: JSON.stringify(['Urad dal', 'Ginger', 'Green chilli', 'Curry leaves', 'Pepper']), addOns: JSON.stringify([{ name: 'Extra Chutney', price: 5 }]), categoryName: 'South Indian' },
  { name: 'Rava Dosa', description: 'Thin crispy semolina crepe with onion & green chillies', price: 65, image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500', isVeg: true, rating: 4.4, ratingCount: 145, calories: 300, ingredients: JSON.stringify(['Semolina', 'Maida', 'Onion', 'Green chilli', 'Cumin']), addOns: JSON.stringify([{ name: 'Masala Filling', price: 15 }, { name: 'Onion Filling', price: 10 }]), categoryName: 'South Indian' },

  // North Indian
  { name: 'Paneer Roll', description: 'Soft roomali roti wrapped with spiced paneer bhurji & fresh veggies', price: 80, image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500', isVeg: true, rating: 4.7, ratingCount: 210, isSpecial: true, calories: 420, ingredients: JSON.stringify(['Paneer', 'Roti', 'Onion', 'Capsicum', 'Spices', 'Chutney']), addOns: JSON.stringify([{ name: 'Extra Paneer', price: 20 }, { name: 'Extra Sauce', price: 10 }, { name: 'Cheese', price: 15 }]), categoryName: 'North Indian' },
  { name: 'Chole Bhature', description: 'Fluffy deep-fried bread with spicy chickpea curry', price: 90, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', isVeg: true, rating: 4.6, ratingCount: 175, calories: 580, ingredients: JSON.stringify(['Chickpeas', 'Maida', 'Onion', 'Tomato', 'Spices']), addOns: JSON.stringify([{ name: 'Extra Bhatura', price: 20 }, { name: 'Pickle', price: 5 }]), categoryName: 'North Indian' },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils in buttery tomato gravy', price: 85, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', isVeg: true, rating: 4.5, ratingCount: 160, calories: 380, ingredients: JSON.stringify(['Black lentils', 'Butter', 'Cream', 'Tomato', 'Spices']), addOns: JSON.stringify([{ name: 'Extra Roti', price: 10 }]), categoryName: 'North Indian' },

  // Snacks
  { name: 'Samosa', description: 'Golden crispy pastry filled with spiced potatoes & peas', price: 20, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', isVeg: true, rating: 4.7, ratingCount: 420, isSpecial: true, calories: 250, ingredients: JSON.stringify(['Maida', 'Potato', 'Peas', 'Spices']), addOns: JSON.stringify([{ name: 'Extra Chutney', price: 5 }, { name: 'Chole', price: 20 }]), categoryName: 'Snacks' },
  { name: 'Veg Sandwich', description: 'Grilled sandwich with fresh veggies, cheese & green chutney', price: 55, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500', isVeg: true, rating: 4.4, ratingCount: 200, calories: 320, ingredients: JSON.stringify(['Bread', 'Vegetables', 'Cheese', 'Chutney', 'Butter']), addOns: JSON.stringify([{ name: 'Extra Cheese', price: 15 }, { name: 'Extra Chutney', price: 5 }]), categoryName: 'Snacks' },
  { name: 'Pani Puri', description: 'Crispy hollow puris filled with spiced tangy water & potato', price: 40, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500', isVeg: true, rating: 4.9, ratingCount: 510, calories: 200, ingredients: JSON.stringify(['Puri', 'Potato', 'Chickpeas', 'Imli water', 'Spices']), addOns: JSON.stringify([{ name: 'Extra Puri (6)', price: 10 }]), categoryName: 'Snacks' },
  { name: 'Aloo Tikki', description: 'Crispy potato patties with tangy chutneys & curd', price: 45, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500', isVeg: true, rating: 4.5, ratingCount: 180, calories: 280, ingredients: JSON.stringify(['Potato', 'Spices', 'Curd', 'Chutneys']), addOns: JSON.stringify([{ name: 'Extra Tikki', price: 15 }]), categoryName: 'Snacks' },

  // Fast Food
  { name: 'Veg Burger', description: 'Aloo tikki burger with crispy veggies & special café sauce', price: 75, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', isVeg: true, rating: 4.5, ratingCount: 250, calories: 450, ingredients: JSON.stringify(['Bun', 'Aloo patty', 'Lettuce', 'Tomato', 'Cheese', 'Sauce']), addOns: JSON.stringify([{ name: 'Extra Cheese', price: 20 }, { name: 'Extra Patty', price: 30 }, { name: 'Make it a Meal', price: 40 }]), categoryName: 'Fast Food' },
  { name: 'Margherita Pizza', description: 'Classic thin-crust pizza with tomato sauce & mozzarella', price: 120, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500', isVeg: true, rating: 4.6, ratingCount: 195, isSpecial: true, calories: 600, ingredients: JSON.stringify(['Pizza base', 'Tomato sauce', 'Mozzarella', 'Basil', 'Olive oil']), addOns: JSON.stringify([{ name: 'Extra Cheese', price: 30 }, { name: 'Jalapenos', price: 20 }, { name: 'Olives', price: 20 }]), categoryName: 'Fast Food' },
  { name: 'French Fries', description: 'Golden crispy fries with seasoning & dipping sauce', price: 60, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500', isVeg: true, rating: 4.4, ratingCount: 320, calories: 380, ingredients: JSON.stringify(['Potato', 'Salt', 'Oil']), addOns: JSON.stringify([{ name: 'Cheese Dip', price: 20 }, { name: 'Peri Peri', price: 10 }, { name: 'Schezwan', price: 10 }]), categoryName: 'Fast Food' },
  { name: 'Chicken Burger', description: 'Crispy chicken patty with coleslaw & spicy mayo', price: 110, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500', isVeg: false, rating: 4.7, ratingCount: 280, calories: 520, ingredients: JSON.stringify(['Chicken patty', 'Bun', 'Coleslaw', 'Mayo', 'Lettuce']), addOns: JSON.stringify([{ name: 'Extra Patty', price: 40 }, { name: 'Cheese', price: 20 }]), categoryName: 'Fast Food' },

  // Chinese
  { name: 'Veg Fried Rice', description: 'Wok-tossed rice with fresh vegetables & soy sauce', price: 75, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500', isVeg: true, rating: 4.4, ratingCount: 220, calories: 420, ingredients: JSON.stringify(['Rice', 'Mixed vegetables', 'Soy sauce', 'Ginger', 'Garlic', 'Spring onion']), addOns: JSON.stringify([{ name: 'Extra Veggies', price: 15 }, { name: 'Egg', price: 20 }]), categoryName: 'Chinese' },
  { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables in soy & chilli sauce', price: 80, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500', isVeg: true, rating: 4.5, ratingCount: 265, isSpecial: true, calories: 450, ingredients: JSON.stringify(['Noodles', 'Mixed vegetables', 'Soy sauce', 'Chilli sauce']), addOns: JSON.stringify([{ name: 'Extra Sauce', price: 10 }, { name: 'Paneer', price: 30 }]), categoryName: 'Chinese' },
  { name: 'Manchurian', description: 'Crispy veg balls in tangy Manchurian sauce', price: 90, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500', isVeg: true, rating: 4.6, ratingCount: 190, calories: 380, ingredients: JSON.stringify(['Cabbage', 'Carrot', 'Sauces', 'Spring onion', 'Cornflour']), addOns: JSON.stringify([{ name: 'Dry or Gravy', price: 0 }]), categoryName: 'Chinese' },

  // Beverages
  { name: 'Masala Chai', description: 'Freshly brewed tea with ginger, cardamom & spices', price: 25, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500', isVeg: true, rating: 4.8, ratingCount: 680, isSpecial: true, calories: 80, ingredients: JSON.stringify(['Tea', 'Milk', 'Ginger', 'Cardamom', 'Sugar']), addOns: JSON.stringify([{ name: 'Extra Strong', price: 0 }, { name: 'Cutting Chai', price: -5 }]), categoryName: 'Beverages' },
  { name: 'Cold Coffee', description: 'Chilled blended coffee with milk & cream', price: 70, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500', isVeg: true, rating: 4.7, ratingCount: 340, calories: 220, ingredients: JSON.stringify(['Coffee', 'Milk', 'Cream', 'Sugar', 'Ice']), addOns: JSON.stringify([{ name: 'Extra Shot', price: 15 }, { name: 'Whipped Cream', price: 20 }, { name: 'Ice Cream Scoop', price: 30 }]), categoryName: 'Beverages' },
  { name: 'Fresh Juice', description: 'Freshly squeezed seasonal fruit juice', price: 55, image: 'https://images.unsplash.com/photo-1474679583957-a2c1addfae60?w=500', isVeg: true, rating: 4.6, ratingCount: 210, calories: 130, ingredients: JSON.stringify(['Fresh fruits', 'Sugar', 'Ice']), addOns: JSON.stringify([{ name: 'No Sugar', price: 0 }, { name: 'Salt & Pepper', price: 0 }]), categoryName: 'Beverages' },
  { name: 'Lassi', description: 'Chilled thick yogurt drink — sweet or salted', price: 50, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', isVeg: true, rating: 4.7, ratingCount: 290, calories: 180, ingredients: JSON.stringify(['Curd', 'Sugar/Salt', 'Cardamom', 'Ice']), addOns: JSON.stringify([{ name: 'Mango Flavour', price: 10 }, { name: 'Rose Flavour', price: 10 }]), categoryName: 'Beverages' },

  // Desserts
  { name: 'Brownie', description: 'Warm fudgy chocolate brownie with vanilla ice cream', price: 80, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500', isVeg: true, rating: 4.8, ratingCount: 195, isSpecial: true, calories: 480, ingredients: JSON.stringify(['Chocolate', 'Flour', 'Butter', 'Eggs', 'Sugar', 'Vanilla']), addOns: JSON.stringify([{ name: 'Ice Cream Scoop', price: 30 }, { name: 'Extra Sauce', price: 15 }]), categoryName: 'Desserts' },
  { name: 'Gulab Jamun', description: 'Soft milk solid balls soaked in rose-flavoured syrup', price: 45, image: 'https://images.unsplash.com/photo-1666452854765-9b13a3e4a2de?w=500', isVeg: true, rating: 4.7, ratingCount: 320, calories: 350, ingredients: JSON.stringify(['Khoya', 'Sugar syrup', 'Rose water', 'Cardamom']), addOns: JSON.stringify([{ name: 'With Ice Cream', price: 30 }]), categoryName: 'Desserts' },
  { name: 'Ice Cream', description: 'Premium scoop of ice cream — Vanilla, Chocolate or Strawberry', price: 60, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500', isVeg: true, rating: 4.6, ratingCount: 250, calories: 280, ingredients: JSON.stringify(['Milk', 'Cream', 'Sugar', 'Flavour']), addOns: JSON.stringify([{ name: 'Chocolate Sauce', price: 15 }, { name: 'Nuts', price: 20 }, { name: 'Extra Scoop', price: 40 }]), categoryName: 'Desserts' },
];

const coupons = [
  { code: 'FIRST50', discount: 50, maxDiscount: 50, minOrder: 100, usageLimit: 200, isActive: true },
  { code: 'STUDENT20', discount: 20, maxDiscount: 40, minOrder: 80, usageLimit: 500, isActive: true },
  { code: 'CAMPUS10', discount: 10, maxDiscount: 30, minOrder: 50, usageLimit: 1000, isActive: true },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.inventory.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.name] = created;
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create food items
  for (const item of foodItems) {
    const { categoryName, ...rest } = item;
    await prisma.foodItem.create({
      data: { ...rest, categoryId: createdCategories[categoryName].id },
    });
  }
  console.log(`✅ Created ${foodItems.length} food items`);

  // Create coupons
  for (const coupon of coupons) {
    await prisma.coupon.create({ data: coupon });
  }
  console.log(`✅ Created ${coupons.length} coupons`);

  // Create admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Staff',
      collegeId: 'ADMIN001',
      email: 'admin@campuscafe.edu',
      passwordHash: adminHash,
      phone: '9999999999',
      role: 'admin',
    },
  });

  // Create demo student
  const studentHash = await bcrypt.hash('student123', 10);
  const student = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      collegeId: 'CS2023001',
      email: 'rahul@student.edu',
      passwordHash: studentHash,
      phone: '9876543210',
      role: 'student',
    },
  });
  console.log(`✅ Created admin (admin@campuscafe.edu / admin123) and student (rahul@student.edu / student123)`);

  // Create some sample orders
  const allItems = await prisma.foodItem.findMany();
  const getItem = (name) => allItems.find((i) => i.name === name);

  const sampleOrders = [
    { status: 'completed', items: [{ item: 'Masala Dosa', qty: 2 }, { item: 'Masala Chai', qty: 2 }] },
    { status: 'completed', items: [{ item: 'Veg Burger', qty: 1 }, { item: 'French Fries', qty: 1 }, { item: 'Cold Coffee', qty: 1 }] },
    { status: 'preparing', items: [{ item: 'Paneer Roll', qty: 2 }, { item: 'Lassi', qty: 1 }] },
    { status: 'ready', items: [{ item: 'Brownie', qty: 2 }, { item: 'Cold Coffee', qty: 1 }] },
  ];

  let orderCounter = 1040;
  for (const sample of sampleOrders) {
    const orderItems = sample.items.map((si) => {
      const food = getItem(si.item);
      return { foodItemId: food.id, quantity: si.qty, price: food.price };
    });
    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + tax;

    await prisma.order.create({
      data: {
        orderNumber: `CC-2026-${orderCounter++}`,
        userId: student.id,
        status: sample.status,
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        subtotal,
        tax,
        total,
        estimatedTime: 15,
        items: { create: orderItems },
      },
    });
  }
  console.log(`✅ Created ${sampleOrders.length} sample orders`);

  // Inventory
  const inventoryItems = [
    { ingredient: 'Paneer', currentStock: 2.5, minStock: 5, unit: 'kg', foodItemId: getItem('Paneer Roll').id },
    { ingredient: 'Chicken', currentStock: 8, minStock: 5, unit: 'kg', foodItemId: getItem('Chicken Burger').id },
    { ingredient: 'Potato', currentStock: 20, minStock: 10, unit: 'kg', foodItemId: getItem('Samosa').id },
    { ingredient: 'Rice', currentStock: 30, minStock: 15, unit: 'kg', foodItemId: getItem('Veg Fried Rice').id },
    { ingredient: 'Milk', currentStock: 5, minStock: 10, unit: 'litres', foodItemId: getItem('Masala Chai').id },
    { ingredient: 'Coffee', currentStock: 1.2, minStock: 2, unit: 'kg', foodItemId: getItem('Cold Coffee').id },
    { ingredient: 'Maida', currentStock: 15, minStock: 10, unit: 'kg', foodItemId: getItem('Samosa').id },
  ];
  for (const inv of inventoryItems) {
    await prisma.inventory.create({ data: inv });
  }
  console.log(`✅ Created ${inventoryItems.length} inventory items`);

  // Reviews
  const reviews = [
    { userId: student.id, foodItemId: getItem('Masala Dosa').id, rating: 5, comment: 'Best dosa in the entire campus! Crispy and delicious.' },
    { userId: student.id, foodItemId: getItem('Cold Coffee').id, rating: 5, comment: 'Perfect cold coffee, exactly what I needed after class.' },
    { userId: student.id, foodItemId: getItem('Paneer Roll').id, rating: 4, comment: 'Great paneer roll, slightly less spicy but tasty!' },
    { userId: student.id, foodItemId: getItem('Brownie').id, rating: 5, comment: 'The brownie is absolutely divine. Must try!' },
    { userId: student.id, foodItemId: getItem('Masala Chai').id, rating: 5, comment: 'Perfect chai to start the day. Strong and refreshing.' },
  ];
  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log(`✅ Created ${reviews.length} reviews`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin  → admin@campuscafe.edu / admin123');
  console.log('👤 Student → rahul@student.edu / student123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
