// Quick script to create admin user for testing
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Create admin user
        // NIK: admin
        // Password: admin

        const password = await bcrypt.hash('admin', 10);

        const admin = await prisma.user.create({
            data: {
                nik: 'admin',
                name: 'Admin SEFILA',
                birthDate: new Date('1990-01-01'),
                email: 'admin@sefila.com',
                phoneNumber: '628123456789',
                password: password,
                role: 'ADMIN'
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log('=====================================');
        console.log('NIK: admin');
        console.log('Password: admin');
        console.log('Role: ADMIN');
        console.log('=====================================');
        console.log('You can now login at http://localhost:5173/login');

        // Also list all users with their NIKs
        console.log('\n📋 All users in database:');
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                nik: true,
                name: true,
                birthDate: true,
                role: true
            }
        });

        allUsers.forEach(user => {
            const bd = user.birthDate ? new Date(user.birthDate) : null;
            const password = bd ?
                `${String(bd.getDate()).padStart(2, '0')}${String(bd.getMonth() + 1).padStart(2, '0')}${bd.getFullYear()}`
                : 'N/A';
            console.log(`\n- ID: ${user.id}`);
            console.log(`  NIK: ${user.nik}`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Password (from birthDate): ${password}`);
        });

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️ Admin user already exists!');
            console.log('\nFetching existing users...\n');

            const allUsers = await prisma.user.findMany({
                select: {
                    id: true,
                    nik: true,
                    name: true,
                    birthDate: true,
                    role: true
                }
            });

            allUsers.forEach(user => {
                const bd = user.birthDate ? new Date(user.birthDate) : null;
                const password = bd ?
                    `${String(bd.getDate()).padStart(2, '0')}${String(bd.getMonth() + 1).padStart(2, '0')}${bd.getFullYear()}`
                    : 'N/A';
                console.log(`\n- ID: ${user.id}`);
                console.log(`  NIK: ${user.nik}`);
                console.log(`  Name: ${user.name}`);
                console.log(`  Role: ${user.role}`);
                console.log(`  Password (from birthDate): ${password}`);
            });
        } else {
            console.error('Error:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
