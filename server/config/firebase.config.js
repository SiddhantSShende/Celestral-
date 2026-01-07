const admin = require('firebase-admin');

// Check if Firebase credentials are provided
const useRealFirebase = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY);

let db;

if (useRealFirebase) {
    try {
        // Initialize Firebase Admin with real credentials
        if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            // Option 1: Using service account file
            const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase connected using service account file');
        } else {
            // Option 2: Using environment variables
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
                })
            });
            console.log('✅ Firebase connected using environment variables');
        }

        db = admin.firestore();
        console.log('✅ Firestore database initialized');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
        console.log('⚠️  Falling back to MOCK Firebase');
        db = createMockFirebase();
    }
} else {
    console.log('⚠️  Using MOCK Firebase with in-memory storage');
    console.log('⚠️  Data persists during server runtime but will be lost on restart');
    console.log('⚠️  Configure real Firebase in .env for production');
    db = createMockFirebase();
}

// Mock Firebase implementation (fallback)
function createMockFirebase() {
    const mockData = {
        users: new Map(),
        admins: new Map(),
        otps: new Map()
    };

    class MockDocumentReference {
        constructor(collection, id) {
            this.collection = collection;
            this.id = id;
        }

        async get() {
            const data = mockData[this.collection].get(this.id);
            return {
                exists: !!data,
                id: this.id,
                data: () => data
            };
        }

        async set(data) {
            mockData[this.collection].set(this.id, { ...data });
        }

        async update(data) {
            const existing = mockData[this.collection].get(this.id) || {};
            mockData[this.collection].set(this.id, { ...existing, ...data });
        }

        async delete() {
            mockData[this.collection].delete(this.id);
        }
    }

    class MockQuery {
        constructor(collection, filters = []) {
            this.collection = collection;
            this.filters = filters;
        }

        where(field, op, value) {
            return new MockQuery(this.collection, [...this.filters, { field, op, value }]);
        }

        async get() {
            let results = Array.from(mockData[this.collection].entries());

            for (const filter of this.filters) {
                results = results.filter(([id, data]) => {
                    const fieldValue = filter.field.split('.').reduce((obj, key) => obj?.[key], data);
                    if (filter.op === '==') return fieldValue === filter.value;
                    if (filter.op === '!=') return fieldValue !== filter.value;
                    if (filter.op === '>') return fieldValue > filter.value;
                    if (filter.op === '<') return fieldValue < filter.value;
                    if (filter.op === '>=') return fieldValue >= filter.value;
                    if (filter.op === '<=') return fieldValue <= filter.value;
                    return false;
                });
            }

            return {
                empty: results.length === 0,
                docs: results.map(([id, data]) => ({
                    id,
                    exists: true,
                    data: () => data
                })),
                forEach: function (callback) {
                    this.docs.forEach(callback);
                }
            };
        }
    }

    class MockCollectionReference {
        constructor(name) {
            this.name = name;
            if (!mockData[name]) {
                mockData[name] = new Map();
            }
        }

        doc(id) {
            return new MockDocumentReference(this.name, id);
        }

        async add(data) {
            const id = `${this.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            mockData[this.name].set(id, data);
            console.log(`✅ Mock Firebase: Added to ${this.name}: ${id}`);
            return { id };
        }

        where(field, op, value) {
            return new MockQuery(this.name, [{ field, op, value }]);
        }

        async get() {
            const entries = Array.from(mockData[this.name].entries());
            return {
                empty: entries.length === 0,
                docs: entries.map(([id, data]) => ({
                    id,
                    exists: true,
                    data: () => data
                })),
                forEach: function (callback) {
                    this.docs.forEach(callback);
                }
            };
        }
    }

    return {
        collection: (name) => new MockCollectionReference(name)
    };
}

module.exports = { db, admin: useRealFirebase ? admin : null };
