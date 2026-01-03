import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Hash default admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create Super Admin
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@biashara360.com' },
        update: {},
        create: {
            email: 'admin@biashara360.com',
            password: hashedPassword,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
        },
    });

    console.log('✅ Super Admin created:', admin.email);
    console.log('   Email: admin@biashara360.com');
    console.log('   Password: admin123');
    console.log('');

    // Create a demo business
    const demoBusinessPassword = await bcrypt.hash('demo123', 10);
    const demoBusiness = await prisma.business.upsert({
        where: { businessName: 'DemoStore' },
        update: {},
        create: {
            businessName: 'DemoStore',
            businessEmail: 'demo@business.com',
            password: demoBusinessPassword,
            phone: '+254712345678',
            description: 'Demo business for testing',
            status: 'ACTIVE',
        },
    });

    console.log('✅ Demo Business created:', demoBusiness.businessName);
    console.log('   Business Name: DemoStore');
    console.log('   Email: demo@business.com');
    console.log('   Password: demo123');
    console.log('');

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
