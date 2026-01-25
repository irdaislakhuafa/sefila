const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                nik: true,
                name: true,
                role: true,
                birthDate: true,
                email: true
            }
        });

        console.log('\n📋 All users in database:');
        console.log('Total users:', users.length);
        console.log('\n');

        if (users.length === 0) {
            console.log('❌ No users found! Database is empty.');
            console.log('Run: node create-admin.js to create admin user');
        } else {
            users.forEach((user, index) => {
                const bd = user.birthDate ? new Date(user.birthDate) : null;
                const password = bd ?
                    `${String(bd.getDate()).padStart(2, '0')}${String(bd.getMonth() + 1).padStart(2, '0')}${bd.getFullYear()}`
                    : 'N/A';

                console.log(`${index + 1}. ${user.name}`);
                console.log(`   NIK: ${user.nik}`);
                console.log(`   Email: ${user.email || 'N/A'}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Password: ${password}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
