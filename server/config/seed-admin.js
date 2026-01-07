const { db } = require('../config/firebase.config');
const bcrypt = require('bcryptjs');

/**
 * Seed default admin account
 * This runs when the server starts to ensure admin access
 */
async function seedAdmin() {
    try {
        const adminEmail = 'sidaeivarc@gmail.com';
        const adminPassword = 'admin123456';

        // Check if admin already exists
        const adminsSnapshot = await db.collection('admins')
            .where('email', '==', adminEmail)
            .get();

        if (!adminsSnapshot.empty) {
            console.log('✅ Admin account already exists');
            return;
        }

        // Create admin account
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await db.collection('admins').add({
            email: adminEmail,
            passwordHash: hashedPassword,
            role: 'admin',
            name: 'Admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        console.log('✅ Default admin account created successfully');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password: admin123456');
        console.log('🔗 Login at: http://localhost:3000/admin.html');
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    }
}

module.exports = { seedAdmin };
