import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create a manager
    const manager = await prisma.user.create({
        data: {
            email: 'manager@example.com',
            password: await bcrypt.hash('password123', 10),
            name: 'John Manager',
            role: 'MANAGER',
        },
    });

    console.log('✅ Created manager:', manager.email);

    // Create employees under the manager
    const employee1 = await prisma.user.create({
        data: {
            email: 'employee1@example.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Alice Employee',
            role: 'EMPLOYEE',
            managerId: manager.id,
        },
    });

    console.log('✅ Created employee:', employee1.email);

    const employee2 = await prisma.user.create({
        data: {
            email: 'employee2@example.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Bob Employee',
            role: 'EMPLOYEE',
            managerId: manager.id,
        },
    });

    console.log('✅ Created employee:', employee2.email);

    // Create a standalone employee (no manager)
    const employee3 = await prisma.user.create({
        data: {
            email: 'employee3@example.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Charlie Employee',
            role: 'EMPLOYEE',
        },
    });

    console.log('✅ Created employee:', employee3.email);

    // Create sample requests
    const request1 = await prisma.request.create({
        data: {
            title: 'Setup Development Environment',
            description: 'Please setup the development environment for the new project including IDE, dependencies, and database.',
            createdById: employee3.id,
            assignedToId: employee1.id,
            status: 'PENDING',
        },
    });

    console.log('✅ Created request:', request1.title);

    const request2 = await prisma.request.create({
        data: {
            title: 'Code Review Required',
            description: 'Need code review for the authentication module. Please review and provide feedback.',
            createdById: employee3.id,
            assignedToId: employee2.id,
            status: 'PENDING',
        },
    });

    console.log('✅ Created request:', request2.title);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Manager: manager@example.com / password123');
    console.log('Employee 1: employee1@example.com / password123');
    console.log('Employee 2: employee2@example.com / password123');
    console.log('Employee 3: employee3@example.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
