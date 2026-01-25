// Create new admin with NIK: admin, Password: admin
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createNewAdmin() {
    try {
        // Delete old admin if exists
        await prisma.user.deleteMany({ where: { role: 'ADMIN' } });
        console.log('Old admin deleted');

        // Create new admin
        const password = await bcrypt.hash('admin', 10);

        const admin = await prisma.user.create({
            data: {
                nik: 'admin',
                name: 'Admin SEFILA',
                password: password,
                role: 'ADMIN'
            }
        });

        console.log('✅ New Admin created!');
        console.log('NIK: admin');
        console.log('Password: admin');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createNewAdmin();
