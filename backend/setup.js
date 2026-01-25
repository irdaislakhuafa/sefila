const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function setup() {
    console.log('🚀 SEFILA Setup Script\n');

    try {
        // Step 1: Generate Prisma Client
        console.log('📦 Generating Prisma Client...');
        await execPromise('npx prisma generate');
        console.log('✅ Prisma Client generated\n');

        // Step 2: Run migrations
        console.log('🗄️  Running database migrations...');
        console.log('NOTE: Make sure MySQL is running and database "sefila_db" exists!\n');

        try {
            await execPromise('npx prisma migrate deploy');
            console.log('✅ Migrations completed\n');
        } catch (migrateError) {
            console.log('⚠️  Migration failed. Trying with migrate dev...');
            await execPromise('npx prisma migrate dev --name init');
            console.log('✅ Migrations completed\n');
        }

        console.log('✅ Setup completed successfully!\n');
        console.log('📝 Next steps:');
        console.log('   1. Make sure MySQL is running');
        console.log('   2. Create database: CREATE DATABASE sefila_db;');
        console.log('   3. Update backend/.env with your MySQL credentials');
        console.log('   4. Run: npm run dev\n');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n📋 Manual setup required:');
        console.log('   1. Install MySQL and create database "sefila_db"');
        console.log('   2. Update backend/.env with correct DATABASE_URL');
        console.log('   3. Run: npx prisma migrate dev --name init');
        console.log('   4. Run: npx prisma generate');
    }
}

setup();
