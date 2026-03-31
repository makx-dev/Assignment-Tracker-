const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Student = require('./student.js');

console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? '✅ YES' : '❌ NO');

if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is missing in .env file');
  process.exit(1);
}


const students = [
  { name: 'Aarti Sharma',           rollNo: 2,  email: 'aarti.sharma.it@ghrcemn.raisoni.net',           division: 'I1' },
  { name: 'Aaditi Tiwari',          rollNo: 1,  email: 'aaditi.tiwari.it@ghrcemn.raisoni.net',          division: 'I1' },
  { name: 'Aayush Umekar',          rollNo: 3,  email: 'aayush.umekar.it@ghrcemn.raisoni.net',          division: 'I1' },
  { name: 'Alfesh Zade',            rollNo: 4,  email: 'alfesh.zade.it@ghrcemn.raisoni.net',            division: 'I1' },
  { name: 'Ankita Gabhane',         rollNo: 5,  email: 'ankita.gabhane.it@ghrcemn.raisoni.net',         division: 'I1' },
  { name: 'Arhan Bagwan',           rollNo: 6,  email: 'arhan.bagwan.it@ghrcemn.raisoni.net',           division: 'I1' },
  { name: 'Aryan Gupta',            rollNo: 7,  email: 'aryan.gupta.it@ghrcemn.raisoni.net',            division: 'I1' },
  { name: 'Aryan Pathak',           rollNo: 8,  email: 'aryan.pathak.it@ghrcemn.raisoni.net',           division: 'I1' },
  { name: 'Aryan Tirpude',          rollNo: 9,  email: 'aryan.tirpude.it@ghrcemn.raisoni.net',          division: 'I1' },
  { name: 'Ayush Chirde',           rollNo: 10, email: 'ayush.chirde.it@ghrcemn.raisoni.net',           division: 'I1' },
  { name: 'Ayush Pal',              rollNo: 11, email: 'ayush.pal.it@ghrcemn.raisoni.net',              division: 'I1' },
  { name: 'Bhagyashree Kahalkar',   rollNo: 12, email: 'bhagyashree.kahalkar.it@ghrcemn.raisoni.net',   division: 'I1' },
  { name: 'Dimpal Paliwal',         rollNo: 13, email: 'dimpal.paliwal.it@ghrcemn.raisoni.net',         division: 'I1' },
  { name: 'Dushyant Halmare',       rollNo: 14, email: 'dushyant.halmare.it@ghrcemn.raisoni.net',       division: 'I1' },
  { name: 'Gargi Lanjewar',         rollNo: 15, email: 'gargi.lanjewar.it@ghrcemn.raisoni.net',         division: 'I1' },
  { name: 'Hrithik Sharma',         rollNo: 16, email: 'hrithik.sharma.it@ghrcemn.raisoni.net',         division: 'I1' },
  { name: 'Ishaan Varma',           rollNo: 17, email: 'ishaan.varma.it@ghrcemn.raisoni.net',           division: 'I1' },
  { name: 'Janhavi Ghotekar',       rollNo: 18, email: 'janhavi.ghotekar.it@ghrcemn.raisoni.net',       division: 'I1' },
  { name: 'Jayesh Borikar',         rollNo: 19, email: 'jayesh.borikar.it@ghrcemn.raisoni.net',         division: 'I1' },
  { name: 'Khushi Bokde',           rollNo: 20, email: 'khushi.bokde.it@ghrcemn.raisoni.net',           division: 'I1' },
  { name: 'Krish Kubade',           rollNo: 21, email: 'krish.kubade.it@ghrcemn.raisoni.net',           division: 'I1' },
  { name: 'Krishna Bundele',        rollNo: 22, email: 'krishna.bundele.it@ghrcemn.raisoni.net',        division: 'I1' },
  { name: 'Lokesh Sonwane',         rollNo: 23, email: 'lokesh.sonwane.it@ghrcemn.raisoni.net',         division: 'I1' },
  { name: 'Mahi Shrungarpawar',     rollNo: 24, email: 'mahi.shrungarpawar.it@ghrcemn.raisoni.net',     division: 'I1' },
  { name: 'Malhar Agarkar',         rollNo: 25, email: 'malhar.agarkar.it@ghrcemn.raisoni.net',         division: 'I1' },
  { name: 'Manthan Khotele',        rollNo: 26, email: 'manthan.khotele.it@ghrcemn.raisoni.net',        division: 'I2' },
  { name: 'Mayur Mekratwar',        rollNo: 27, email: 'mayur.mekratwar.it@ghrcemn.raisoni.net',        division: 'I2' },
  { name: 'Mrunali Thombre',        rollNo: 28, email: 'mrunali.thombre.it@ghrcemn.raisoni.net',        division: 'I2' },
  { name: 'Nidhi Borkar',           rollNo: 29, email: 'nidhi.borkar.it@ghrcemn.raisoni.net',           division: 'I2' },
  { name: 'Noesha Sakhare',         rollNo: 30, email: 'noesha.sakhare.it@ghrcemn.raisoni.net',         division: 'I2' },
  { name: 'Paras Jain',             rollNo: 31, email: 'paras.jain.it@ghrcemn.raisoni.net',             division: 'I2' },
  { name: 'Parinita Nikhare',       rollNo: 32, email: 'parinita.nikhare.it@ghrcemn.raisoni.net',       division: 'I2' },
  { name: 'Piyush Shidurkar',       rollNo: 33, email: 'piyush.shidurkar.it@ghrcemn.raisoni.net',       division: 'I2' },
  { name: 'Piyusha Mohod',          rollNo: 34, email: 'piyusha.mohod.it@ghrcemn.raisoni.net',          division: 'I2' },
  { name: 'Prachi Nawghare',        rollNo: 35, email: 'prachi.nawghare.it@ghrcemn.raisoni.net',        division: 'I2' },
  { name: 'Pranay Meshram',         rollNo: 36, email: 'pranay.meshram.it@ghrcemn.raisoni.net',         division: 'I2' },
  { name: 'Pranjal Pangul',         rollNo: 37, email: 'pranjal.pangul.it@ghrcemn.raisoni.net',         division: 'I2' },
  { name: 'Prathamesh Hande',       rollNo: 38, email: 'prathamesh.hande.it@ghrcemn.raisoni.net',       division: 'I2' },
  { name: 'Prathamesh Balki',       rollNo: 39, email: 'prathamesh.balki.it@ghrcemn.raisoni.net',       division: 'I2' },
  { name: 'Princy Bolkuntwar',      rollNo: 40, email: 'princy.bolkuntwar.it@ghrcemn.raisoni.net',      division: 'I2' },
  { name: 'Ritesh Gujar',           rollNo: 41, email: 'ritesh.gujar.it@ghrcemn.raisoni.net',           division: 'I2' },
  { name: 'Ritik Bhende',           rollNo: 42, email: 'ritik.bhende.it@ghrcemn.raisoni.net',           division: 'I2' },
  { name: 'Saish Bhorkar',          rollNo: 43, email: 'saish.bhorkar.it@ghrcemn.raisoni.net',          division: 'I2' },
  { name: 'Samruddhi Dhande',       rollNo: 44, email: 'samruddhi.dhande.it@ghrcemn.raisoni.net',       division: 'I2' },
  { name: 'Sarvesh Bhise',          rollNo: 45, email: 'sarvesh.bhise.it@ghrcemn.raisoni.net',          division: 'I2' },
  { name: 'Satwik Pawar',           rollNo: 46, email: 'satwik.pawar.it@ghrcemn.raisoni.net',           division: 'I2' },
  { name: 'Shlok Bangre',           rollNo: 47, email: 'shlok.bangre.it@ghrcemn.raisoni.net',           division: 'I2' },
  { name: 'Shourya Warjurkar',      rollNo: 48, email: 'shourya.warjurkar.it@ghrcemn.raisoni.net',      division: 'I2' },
  { name: 'Shravani Jadhao',        rollNo: 49, email: 'shravani.jadhao.it@ghrcemn.raisoni.net',        division: 'I2' },
  { name: 'Shravani Talhar',        rollNo: 50, email: 'shravani.talhar.it@ghrcemn.raisoni.net',        division: 'I2' },
  { name: 'Shravani Wankhade',      rollNo: 51, email: 'shravani.wankhade.it@ghrcemn.raisoni.net',      division: 'I3' },
  { name: 'Shravasti Ingole',       rollNo: 52, email: 'shravasti.ingole.it@ghrcemn.raisoni.net',       division: 'I3' },
  { name: 'Shristi Shrivastava',    rollNo: 53, email: 'shristi.shrivastava.it@ghrcemn.raisoni.net',    division: 'I3' },
  { name: 'Siddheshwar Wagh',       rollNo: 54, email: 'siddheshwar.wagh.it@ghrcemn.raisoni.net',       division: 'I3' },
  { name: 'Siddhi Kunjarkar',       rollNo: 55, email: 'siddhi.kunjarkar.it@ghrcemn.raisoni.net',       division: 'I3' },
  { name: 'Smit Bhagat',            rollNo: 56, email: 'smit.bhagat.it@ghrcemn.raisoni.net',            division: 'I3' },
  { name: 'Sumit Rathod',           rollNo: 57, email: 'sumit.rathod.it@ghrcemn.raisoni.net',           division: 'I3' },
  { name: 'Sumit Chavhan',          rollNo: 58, email: 'sumit.chavhan.it@ghrcemn.raisoni.net',           division: 'I3' },
  { name: 'Vedant Irdande',         rollNo: 59, email: 'vedant.irdande.it@ghrcemn.raisoni.net',         division: 'I3' },
  { name: 'Vidisha Fule',           rollNo: 60, email: 'vidisha.fule.it@ghrcemn.raisoni.net',           division: 'I3' },
  { name: 'Vinay Jawake',           rollNo: 61, email: 'vinay.jawake.it@ghrcemn.raisoni.net',           division: 'I3' },
  { name: 'Yukti Bawiskar',         rollNo: 62, email: 'yukti.bawiskar.it@ghrcemn.raisoni.net',         division: 'I3' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Student.deleteMany({});
    console.log('Existing students cleared');

    const result = await Student.insertMany(students);
    console.log(`${result.length} students seeded successfully with I1, I2, I3 divisions`);

  } catch (error) {
    console.error('Seeding Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seed();