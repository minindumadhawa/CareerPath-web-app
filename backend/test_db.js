const mongoose = require('mongoose');
const Enrollment = require('./models/careerAdvicemodel/Enrollment');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vishmiishanka14_db_user:wzLO1AkrRlVEnV4h@cluster0.mjiovjd.mongodb.net/careeradvice';

async function testEnroll() {
    try {
        await mongoose.connect(MONGO_URI);

        // Attempt inserting two different records for the same student
        const enroll1 = new Enrollment({
            studentName: 'Kasun',
            studentEmail: 'kasun@gmail.com',
            programId: new mongoose.Types.ObjectId(),
            programType: 'Leadership'
        });

        await enroll1.save();
        console.log('Enrollment 1 Saved');

        const enroll2 = new Enrollment({
            studentName: 'Kasun',
            studentEmail: 'kasun@gmail.com',
            programId: new mongoose.Types.ObjectId(), // Different programId
            programType: 'TechnicalResource'
        });

        await enroll2.save();
        console.log('Enrollment 2 Saved');

    } catch (err) {
        console.error('Error inserting:', err);
    } finally {
        mongoose.connection.close();
    }
}

testEnroll();
