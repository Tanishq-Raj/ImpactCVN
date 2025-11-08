import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('🔍 Testing Prisma Connection...\n');

async function testPrisma() {
  try {
    // Simple connection test
    console.log('✅ Test 1: Count Users');
    const userCount = await prisma.user.count();
    console.log(`   ✓ Found ${userCount} users in database\n`);

    console.log('✅ Test 2: Count Resumes');
    const resumeCount = await prisma.resume.count();
    console.log(`   ✓ Found ${resumeCount} resumes in database\n`);

    console.log('✅ Test 3: Count Shared Resumes');
    const sharedCount = await prisma.sharedResume.count();
    console.log(`   ✓ Found ${sharedCount} shared resumes in database\n`);

    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 Prisma is working correctly!');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('✅ Verified:');
    console.log('   • Database connection successful');
    console.log('   • User model accessible');
    console.log('   • Resume model accessible');
    console.log('   • SharedResume model accessible');
    console.log('   • All queries executing properly\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
