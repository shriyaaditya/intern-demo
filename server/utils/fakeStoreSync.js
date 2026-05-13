const axios = require('axios');
const Product = require('../models/Product');

const FAKE_STORE_PRODUCTS_URL = 'https://fakestoreapi.com/products';

function mapFakeStoreCategory(apiCategory) {
  const c = String(apiCategory || '').toLowerCase();
  if (c === 'electronics') return 'electronics';
  if (c.includes('clothing')) return 'clothing';
  if (c === 'jewelery') return 'other';
  return 'other';
}


// converts the coming doc into my mongodb format
function fakeStoreItemToDoc(item) {
  const name = String(item.title || 'Product').slice(0, 100);
  const description = String(item.description || '').slice(0, 2000);
  const image = item.image ? String(item.image) : '';
  return {
    fakeStoreId: item.id,
    name,
    description,
    price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
    images: image ? [image] : ['https://via.placeholder.com/400x300?text=No+Image'],
    category: mapFakeStoreCategory(item.category),
    stock: 50,
    ratings: {
     average: item.rating?.rate ?? 0,
      count: item.rating?.count ?? 0
    },
    featured: Number(item.id) <= 6
  };
}


async function syncFakeStoreProducts() {
  const { data } = await axios.get(FAKE_STORE_PRODUCTS_URL, { timeout: 20000 });
  if (!Array.isArray(data)) {
    throw new Error('FakeStore API returned an error');
  }

  if (data.length === 0) {
    return 0;
  }

  const operations = data.map((item) => ({
    updateOne: {
      filter: { fakeStoreId: item.id },
      update: { $set: fakeStoreItemToDoc(item) },
      upsert: true
    }
  }));

  await Product.bulkWrite(operations);
  return data.length;
}

async function ensureFakeStoreProductsInDb() {
  const n = await Product.countDocuments({ fakeStoreId: { $exists: true, $ne: null } });
  if (n === 0) {
    await syncFakeStoreProducts();
  }
}

module.exports = {
  syncFakeStoreProducts,
  ensureFakeStoreProductsInDb,
  mapFakeStoreCategory,
  fakeStoreItemToDoc
};
