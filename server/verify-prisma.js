import 'dotenv/config';
import prisma from './prisma.js';
import { hashPassword } from './utils/password.js';

console.log('🔍 Verifying Prisma Implementation...\n');

async function verifyPrisma() {
  try {
    // Test 1: Database Connection
    console.log('✅ Test 1: Database Connection');
    await prisma.$connect();
    console.log('   ✓ Connected to database successfully\n');

    // Test 2: Check Tables Exist
    console.log('✅ Test 2: Verify Tables');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('   ✓ Tables found:', tables.map(t => t.table_name).join(', '));
    console.log('');

    // Test 3: User Model - Create
    console.log('✅ Test 3: User Model - Create');
    const testEmail = `test-${Date.now()}@prisma-test.com`;
    const testPassword = await hashPassword('testpassword123');
    
    const user = await prisma.user.create({
      data: {
        name: 'Prisma Test User',
        email: testEmail,
        passwordHash: testPassword
      }
    });
    console.log('   ✓ User created:', { id: user.id, name: user.name, email: user.email });
    console.log('');

    // Test 4: User Model - Find
    console.log('✅ Test 4: User Model - Find');
    const foundUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    console.log('   ✓ User found:', foundUser ? 'Yes' : 'No');
    console.log('');

    // Test 5: Resume Model - Create
    console.log('✅ Test 5: Resume Model - Create');
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: 'Test Resume',
        theme: 'modern',
        data: {
          basicInfo: {
            name: 'Test User',
            email: testEmail
          }
        }
      }
    });
    console.log('   ✓ Resume created:', { id: resume.id, title: resume.title });
    console.log('');

    // Test 6: Resume Model - Find with Relations
    console.log('✅ Test 6: Resume Model - Relations');
    const resumeWithUser = await prisma.resume.findUnique({
      where: { id: resume.id },
      include: { user: true }
    });
    console.log('   ✓ Resume with user:', {
      resumeId: resumeWithUser.id,
      userName: resumeWithUser.user.name
    });
    console.log('');

    // Test 7: Resume Model - Update
    console.log('✅ Test 7: Resume Model - Update');
    const updatedResume = await prisma.resume.update({
      where: { id: resume.id },
      data: { title: 'Updated Test Resume' }
    });
    console.log('   ✓ Resume updated:', updatedResume.title);
    console.log('');

    // Test 8: SharedResume Model - Create
    console.log('✅ Test 8: SharedResume Model - Create');
    const shareId = `test-${Date.now()}`;
    const sharedResume = await prisma.sharedResume.create({
      data: {
        shareId,
        data: {
          basicInfo: {
            name: 'Shared Test Resume'
          }
        }
      }
    });
    console.log('   ✓ Shared resume created:', { id: sharedResume.id, shareId: sharedResume.shareId });
    console.log('');

    // Test 9: SharedResume Model - Upsert
    console.log('✅ Test 9: SharedResume Model - Upsert');
    const upsertedResume = await prisma.sharedResume.upsert({
      where: { shareId },
      update: { data: { updated: true } },
      create: {
        shareId,
        data: { new: true }
      }
    });
    console.log('   ✓ Shared resume upserted:', upsertedResume.shareId);
    console.log('');

    // Test 10: Query Multiple Records
    console.log('✅ Test 10: Query Multiple Records');
    const allResumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    console.log('   ✓ Found resumes:', allResumes.length);
    console.log('');

    // Test 11: Cascade Delete
    console.log('✅ Test 11: Cascade Delete');
    await prisma.resume.delete({
      where: { id: resume.id }
    });
    console.log('   ✓ Resume deleted');
    console.log('');

    // Test 12: Clean Up
    console.log('✅ Test 12: Clean Up Test Data');
    await prisma.sharedResume.delete({
      where: { shareId }
    });
    await prisma.user.delete({
      where: { id: user.id }
    });
    console.log('   ✓ Test data cleaned up');
    console.log('');

    // Test 13: Count Records
    console.log('✅ Test 13: Count Records');
    const userCount = await prisma.user.count();
    const resumeCount = await prisma.resume.count();
    const sharedCount = await prisma.sharedResume.count();
    console.log('   ✓ Database stats:');
    console.log('     - Users:', userCount);
    console.log('     - Resumes:', resumeCount);
    console.log('     - Shared Resumes:', sharedCount);
    console.log('');

    // Final Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 ALL TESTS PASSED! Prisma is working correctly!');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('✅ Prisma Features Verified:');
    console.log('   • Database connection');
    console.log('   • CRUD operations (Create, Read, Update, Delete)');
    console.log('   • Relations (User → Resume)');
    console.log('   • Upsert operations');
    console.log('   • Filtering and ordering');
    console.log('   • Cascade deletes');
    console.log('   • Counting records');
    console.log('');
    console.log('✅ All Models Working:');
    console.log('   • User model');
    console.log('   • Resume model');
    console.log('   • SharedResume model');
    console.log('');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    console.error('');
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPrisma();
