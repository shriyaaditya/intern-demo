const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const connectDB = require('./config/db');
const { syncFakeStoreProducts } = require('./utils/fakeStoreSync');

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    const count = await syncFakeStoreProducts();

    console.log('Database seeded from FakeStore API.');
    console.log(`${count} products upserted.`);

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();