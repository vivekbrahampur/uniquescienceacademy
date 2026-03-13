import express from 'express';
console.log('>>> server.ts is starting...');
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, addDoc, deleteDoc, query, where, orderBy, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// Read Firebase config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
console.log('Firebase config loaded:', firebaseConfig.projectId);
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Initialize default settings if not exist
async function initSettings() {
  throw new Error('Test error');
  console.log('Initializing settings...');
  try {
    const settingsRef = doc(db, 'settings', 'global');
    const settingsSnap = await getDoc(settingsRef);
    console.log('Settings snapshot exists:', settingsSnap.exists());
    
    if (!settingsSnap.exists()) {
      console.log('Creating default settings...');
      await setDoc(settingsRef, {
        logo_url: 'https://picsum.photos/seed/schoollogo/200/200',
        gallery_images: [
          'https://picsum.photos/seed/school1/800/400',
          'https://picsum.photos/seed/school2/800/400',
          'https://picsum.photos/seed/school3/800/400'
        ],
        contact_address: 'Brahampur, Jale\nDarbhanga, Bihar 847307',
        contact_email: 'info@uniquescienceacademy.in',
        contact_phone: '+91 98765 43210',
        admin_username: 'admin',
        admin_password: 'admin123',
        school_name: 'Unique Science Academy',
        marksheet_heading: 'ANNUAL EXAMINATION RESULT',
        marksheet_subheading: 'Session: 2025-2026',
        marksheet_affiliation_no: '1548G',
        marksheet_school_code: '1548',
        marksheet_address: 'Brahampur, Jale, Darbhanga, Bihar 847307',
        marksheet_phone: '(0542)-XXXXXXX',
        marksheet_website: 'www.uniquescienceacademy.in',
        marksheet_email: 'info@uniquescienceacademy.in',
        hero_title: 'Welcome to Unique Science Academy',
        hero_subtitle: 'Empowering minds, shaping the future.',
        news_ticker: 'Admissions open for 2026-2027 | Annual Sports Meet on 15th March',
        about_title: 'Our Vision & Mission',
        about_text: 'We provide a nurturing environment that encourages students to excel academically, socially, and personally. Our dedicated faculty and modern facilities ensure a holistic development for every child.',
        about_image: 'https://picsum.photos/seed/welcome/800/600',
        principal_name: 'Dr. A. K. Sharma',
        principal_message: 'Education is the most powerful weapon which you can use to change the world. At Unique Science Academy, we strive to provide an environment that fosters intellectual and moral growth, preparing our students to be responsible global citizens.',
        principal_image: 'https://picsum.photos/seed/principal/400/400',
        smtp_host: 'smtp.gmail.com',
        smtp_port: '587',
        smtp_user: 'your-email@gmail.com',
        smtp_pass: '',
        testimonials: [
          {
            id: 1,
            name: 'Rahul Kumar',
            role: 'Parent',
            text: 'Unique Science Academy has transformed my child\'s future. The teachers are incredibly supportive and the environment is perfect for learning.',
            image: 'https://picsum.photos/seed/parent1/150/150'
          },
          {
            id: 2,
            name: 'Priya Sharma',
            role: 'Alumni',
            text: 'The foundation I received here helped me excel in my higher studies. I am forever grateful to the amazing faculty.',
            image: 'https://picsum.photos/seed/alumni1/150/150'
          }
        ]
      });
    }
  } catch (error) {
    console.error('Failed to initialize settings:', error);
  }
}

initSettings().catch(err => console.error('Failed to init settings:', err));

// --- Dual Notification Service (SMS & Email) ---
// TODO: Input your SMS API Key and Sender ID here
const SMS_API_KEY = process.env.SMS_API_KEY || 'YOUR_SMS_API_KEY_HERE';
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || 'YOUR_SENDER_ID_HERE';

async function sendDualNotification(eventType: string, userDetails: any, eventDetails: any = {}) {
  const { name, email, phone } = userDetails;
  
  let subject = '';
  let plainTextBody = '';
  let htmlContent = '';
  
  const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
  const settings = settingsSnap.data() || {};
  const schoolName = settings.school_name || 'Unique Science Academy';
  const websiteUrl = settings.website_url || 'https://uniquescienceacademy.in';
  const address = settings.contact_address ? settings.contact_address.replace(/\\n/g, ', ') : 'Brahampur, Jale, Darbhanga, Bihar 847307';

  switch (eventType) {
    case 'STUDENT_REGISTRATION':
      subject = `Registration Successful - ${schoolName}`;
      plainTextBody = `Dear ${name}, your registration at ${schoolName} is successful. Class: ${eventDetails.class_name}, Roll No: ${eventDetails.roll_no}. Welcome!`;
      htmlContent = `<p>Dear <strong>${name}</strong>,</p>
                     <p>Your registration at <strong>${schoolName}</strong> has been successfully completed. We are thrilled to have you join us!</p>
                     <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                       <p style="margin: 5px 0;"><strong>Class:</strong> ${eventDetails.class_name}</p>
                       <p style="margin: 5px 0;"><strong>Roll Number:</strong> ${eventDetails.roll_no}</p>
                     </div>
                     <p>You can now log in to the student portal using your Class and Roll Number to access your dashboard, test links, and results.</p>`;
      break;
    case 'FEE_SUBMISSION':
      subject = `Fee Payment Received - ${schoolName}`;
      plainTextBody = `Dear ${name}, we have received your fee payment of Rs. ${eventDetails.amount} on ${eventDetails.date}. Thank you.`;
      htmlContent = `<p>Dear <strong>${name}</strong>,</p>
                     <p>We have successfully received your fee payment.</p>
                     <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                       <p style="margin: 5px 0;"><strong>Amount Received:</strong> Rs. ${eventDetails.amount}</p>
                       <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDetails.date}</p>
                     </div>
                     <p>Thank you for your timely payment.</p>`;
      break;
    case 'ONLINE_TEST_SUBMITTED':
      subject = `Test Submission Successful - ${schoolName}`;
      plainTextBody = `Dear ${name}, your responses for the test "${eventDetails.test_name}" have been successfully submitted.`;
      htmlContent = `<p>Dear <strong>${name}</strong>,</p>
                     <p>Your responses for the online test <strong>"${eventDetails.test_name}"</strong> have been successfully submitted and recorded.</p>
                     <p>You will be notified once the results are declared.</p>`;
      break;
    case 'FINAL_RESULT_PUBLISHED':
      subject = `Final Exam Results Published - ${schoolName}`;
      plainTextBody = `Dear ${name}, your final exam result has been published. Please log in to your student portal at ${websiteUrl} to check your marks.`;
      htmlContent = `<p>Dear <strong>${name}</strong>,</p>
                     <p>Your final exam result has been officially published.</p>
                     <p>Please log in to your <a href="${websiteUrl}" style="color: #1e3a8a; font-weight: bold;">Student Portal</a> to check your detailed marks and performance.</p>`;
      break;
    case 'ONLINE_TEST_RESULT':
      subject = `Online Test Result: ${eventDetails.test_name} - ${schoolName}`;
      plainTextBody = `Dear ${name}, result for online test "${eventDetails.test_name}" is out. You scored ${eventDetails.score} out of ${eventDetails.total}. Check portal for details.`;
      htmlContent = `<p>Dear <strong>${name}</strong>,</p>
                     <p>The result for your recent online test is now available.</p>
                     <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                       <p style="margin: 5px 0;"><strong>Test Name:</strong> ${eventDetails.test_name}</p>
                       <p style="margin: 5px 0;"><strong>Your Score:</strong> <span style="color: #059669; font-weight: bold; font-size: 18px;">${eventDetails.score}</span> / ${eventDetails.total}</p>
                     </div>
                     <p>Keep up the good work! You can view more details on your student portal.</p>`;
      break;
    case 'NEW_TEST_UPLOADED':
      subject = `New Online Test: ${eventDetails.test_name} - ${schoolName}`;
      plainTextBody = `Dear Student, a new online test "${eventDetails.test_name}" has been uploaded. Link: ${eventDetails.link}. Please complete it before the deadline.`;
      htmlContent = `<p>Dear Student,</p>
                     <p>A new online test has been assigned to your class.</p>
                     <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                       <p style="margin: 5px 0;"><strong>Test Name:</strong> ${eventDetails.test_name}</p>
                       <p style="margin: 15px 0 5px 0;">
                         <a href="${eventDetails.link}" style="background-color: #1e3a8a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Test Now</a>
                       </p>
                       <p style="margin: 15px 0 0 0; font-size: 13px; color: #6b7280;">Or copy this link: <a href="${eventDetails.link}">${eventDetails.link}</a></p>
                     </div>
                     <p>Please ensure you complete it before the deadline.</p>`;
      break;
    case 'ATTENDANCE_MARKED':
      subject = `Attendance Update - ${schoolName}`;
      plainTextBody = `Dear ${name}, your attendance for ${eventDetails.date} has been marked as ${eventDetails.status}.`;
      htmlContent = `<p>Dear <strong>${name}</strong>,</p>
                     <p>Your attendance has been updated in our records.</p>
                     <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                       <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDetails.date}</p>
                       <p style="margin: 5px 0;"><strong>Status:</strong> <span style="font-weight: bold; color: ${eventDetails.status === 'Present' ? '#059669' : eventDetails.status === 'Absent' ? '#dc2626' : '#d97706'};">${eventDetails.status}</span></p>
                     </div>`;
      break;
    default:
      return;
  }

  const finalSmsBody = `${plainTextBody}\n\nRegards,\n${schoolName}\n${address}\nWebsite: ${websiteUrl}`;
  
  const finalEmailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1e3a8a; margin: 0; font-size: 28px;">${schoolName}</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); color: #374151; font-size: 15px; line-height: 1.6;">
        ${htmlContent}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">Best Regards,</p>
          <p style="color: #1e3a8a; font-weight: bold; margin: 5px 0 0 0;">School Administration</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 25px; color: #9ca3af; font-size: 12px; line-height: 1.5;">
        <p style="margin: 0;"><strong>${schoolName}</strong></p>
        <p style="margin: 5px 0 0 0;">${address}</p>
        <p style="margin: 5px 0 0 0;"><a href="${websiteUrl}" style="color: #1e3a8a; text-decoration: none;">${websiteUrl}</a></p>
      </div>
    </div>
  `;

  const promises = [];

  // 1. Send Email
  if (email && settings.smtp_user && settings.smtp_pass) {
    const emailPromise = (async () => {
      try {
        const transporter = nodemailer.createTransport({
          host: settings.smtp_host || 'smtp.gmail.com',
          port: parseInt(settings.smtp_port) || 587,
          secure: parseInt(settings.smtp_port) === 465,
          auth: {
            user: settings.smtp_user,
            pass: settings.smtp_pass,
          },
        });

        await transporter.sendMail({
          from: `"${schoolName}" <${settings.smtp_user}>`,
          to: email,
          subject: subject,
          text: finalSmsBody,
          html: finalEmailHtml
        });
        console.log(`Email sent to ${email} for ${eventType}`);
      } catch (error) {
        console.error(`Email failed for ${email}:`, error);
      }
    })();
    promises.push(emailPromise);
  }

  // 2. Send SMS
  if (phone) {
    const smsPromise = (async () => {
      try {
        // Example using Fast2SMS / MSG91 API (Replace with your actual provider)
        /*
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'v3',
            sender_id: SMS_SENDER_ID,
            message: finalSmsBody,
            language: 'english',
            flash: 0,
            numbers: phone
          })
        });
        const result = await response.json();
        console.log(\\\`SMS sent to \${phone}:\\\`, result);
        */
        console.log(`[MOCK] SMS sent to ${phone} for ${eventType}: ${finalSmsBody}`);
      } catch (error) {
        console.error(`SMS failed for ${phone}:`, error);
      }
    })();
    promises.push(smsPromise);
  }

  await Promise.allSettled(promises);
}
// --- End Notification Service ---

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // JWT Middleware
  const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        next();
      });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // API Routes
  app.get('/api/settings', async (req, res) => {
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      const settings = settingsSnap.data() || {};
      console.log('API settings data from Firestore:', settings);
      
      const publicKeys = [
        'logo_url', 'gallery_images', 'testimonials', 'contact_address', 
        'contact_email', 'contact_phone', 'school_name', 'hero_title', 
        'hero_subtitle', 'news_ticker', 'about_title', 'about_text', 
        'about_image', 'principal_name', 'principal_message', 'principal_image'
      ];
      
      const settingsMap = Object.keys(settings).reduce((acc: any, key) => {
        if (publicKeys.includes(key)) {
          acc[key] = settings[key];
        }
        return acc;
      }, {});
      
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      res.json(settingsSnap.data() || {});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // Admin: Login & Credentials
  app.post('/api/admin/login', async (req, res) => {
    const { username, password, token: twoFactorToken } = req.body;
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      const settings = settingsSnap.data() || {};
      
      if (username === settings.admin_username && password === settings.admin_password) {
        if (settings.two_factor_enabled) {
          if (!twoFactorToken) {
            return res.json({ success: true, requires2FA: true });
          }
          
          const verified = speakeasy.totp.verify({
            secret: settings.two_factor_secret,
            encoding: 'base32',
            token: twoFactorToken
          });
          
          if (!verified) {
            return res.status(401).json({ success: false, error: 'Invalid 2FA token' });
          }
        }
        
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/admin/2fa/setup', authenticateAdmin, async (req, res) => {
    try {
      const secret = speakeasy.generateSecret({ name: 'School Admin' });
      const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);
      
      // Store secret temporarily or just send to client
      // We'll send it to client and they will send it back to verify and enable
      res.json({ secret: secret.base32, qrCode: qrCodeUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to setup 2FA' });
    }
  });

  app.post('/api/admin/2fa/verify', authenticateAdmin, async (req, res) => {
    const { secret, token } = req.body;
    try {
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
      });
      
      if (verified) {
        await setDoc(doc(db, 'settings', 'global'), {
          two_factor_enabled: true,
          two_factor_secret: secret
        }, { merge: true });
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Invalid token' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify 2FA' });
    }
  });

  app.post('/api/admin/2fa/disable', authenticateAdmin, async (req, res) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        two_factor_enabled: false,
        two_factor_secret: null
      }, { merge: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to disable 2FA' });
    }
  });

  app.post('/api/admin/credentials', authenticateAdmin, async (req, res) => {
    const { username, password } = req.body;
    try {
      const updates: any = {};
      if (username) updates.admin_username = username;
      if (password) updates.admin_password = password;
      
      if (Object.keys(updates).length > 0) {
        await setDoc(doc(db, 'settings', 'global'), updates, { merge: true });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update credentials' });
    }
  });

  app.post('/api/admin/settings', authenticateAdmin, async (req, res) => {
    const updates = req.body;
    try {
      await setDoc(doc(db, 'settings', 'global'), updates, { merge: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Admin: Students
  app.get('/api/admin/students', authenticateAdmin, async (req, res) => {
    try {
      const studentsSnap = await getDocs(collection(db, 'students'));
      const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });

  app.post('/api/admin/students', authenticateAdmin, async (req, res) => {
    const { name, father_name, mother_name, class_name, roll_no, photo_url } = req.body;
    try {
      // Check if student exists
      const q = query(collection(db, 'students'), where('class_name', '==', class_name), where('roll_no', '==', roll_no));
      const existing = await getDocs(q);
      if (!existing.empty) {
        return res.status(400).json({ error: 'Student already exists with this Class and Roll No' });
      }
      
      const docRef = await addDoc(collection(db, 'students'), {
        name, father_name, mother_name, class_name, roll_no, photo_url,
        createdAt: new Date().toISOString()
      });
      res.json({ id: docRef.id, success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add student' });
    }
  });

  app.post('/api/admin/students/full', authenticateAdmin, async (req, res) => {
    const { name, father_name, mother_name, class_name, roll_no, email, phone, dob, gender, address, photo_url } = req.body;
    try {
      // Check if student exists
      const q = query(collection(db, 'students'), where('class_name', '==', class_name), where('roll_no', '==', roll_no));
      const existing = await getDocs(q);
      if (!existing.empty) {
        return res.status(400).json({ error: 'Student already exists with this Class and Roll No' });
      }
      
      const docRef = await addDoc(collection(db, 'students'), {
        name, father_name, mother_name, class_name, roll_no, email, phone, dob, gender, address, photo_url,
        createdAt: new Date().toISOString()
      });
      
      // Send Dual Notification
      await sendDualNotification('STUDENT_REGISTRATION', { name, email, phone }, { class_name, roll_no });

      res.json({ id: docRef.id, success: true, emailSent: true, emailError: null });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to add student' });
    }
  });

  app.delete('/api/admin/students/:id', authenticateAdmin, async (req, res) => {
    const id = req.params.id as string;
    console.log(`Attempting to delete student: ${id}`);
    try {
      await deleteDoc(doc(db, 'students', id));
      console.log(`Successfully deleted student: ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`Failed to delete student: ${id}`, error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  });

  app.post('/api/admin/students/promote', authenticateAdmin, async (req, res) => {
    const { studentIds, nextClass, targetClass } = req.body;
    const finalClass = targetClass || nextClass;
    console.log(`Attempting to promote students: ${studentIds} to ${finalClass}`);
    
    if (!finalClass) {
      return res.status(400).json({ error: 'Target class is required' });
    }

    try {
      const batch = writeBatch(db);
      for (const id of studentIds) {
        const studentRef = doc(db, 'students', id);
        batch.update(studentRef, { class_name: finalClass });
      }
      await batch.commit();
      console.log(`Successfully promoted students: ${studentIds} to ${finalClass}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`Failed to promote students`, error);
      res.status(500).json({ error: 'Failed to promote students' });
    }
  });

  // Admin: Results
  app.post('/api/admin/results', authenticateAdmin, async (req, res) => {
    const { student_id, results } = req.body;
    try {
      // Delete existing results for this student
      const q = query(collection(db, 'results'), where('studentId', '==', student_id));
      const existing = await getDocs(q);
      const deletePromises = existing.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      
      // Add new results
      const addPromises = results.map((r: any) => addDoc(collection(db, 'results'), {
        studentId: student_id,
        subject: r.subject,
        marks: r.marks,
        total_marks: r.total_marks
      }));
      await Promise.all(addPromises);
      
      // Send Dual Notification
      const studentSnap = await getDoc(doc(db, 'students', student_id));
      if (studentSnap.exists()) {
        const student = studentSnap.data();
        await sendDualNotification('FINAL_RESULT_PUBLISHED', student);
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add result' });
    }
  });

  // Admin: Notice Panel
  app.post('/api/admin/notice', authenticateAdmin, async (req, res) => {
    const { title, pdf_url } = req.body;
    try {
      await addDoc(collection(db, 'notices'), {
        title, pdf_url,
        createdAt: new Date().toISOString()
      });
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add notice' });
    }
  });

  app.delete('/api/admin/notices/:id', authenticateAdmin, async (req, res) => {
    const id = req.params.id;
    try {
      await deleteDoc(doc(db, 'notices', id));
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete notice' });
    }
  });

  // Student: Notices
  app.get('/api/student/notices', async (req, res) => {
    try {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const noticesSnap = await getDocs(q);
      const notices = noticesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(notices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notices' });
    }
  });

  app.post('/api/admin/test-links', authenticateAdmin, async (req, res) => {
    const { class_name, subject, title, link } = req.body;
    try {
      await addDoc(collection(db, 'test_links'), {
        class_name, subject, title, link,
        createdAt: new Date().toISOString()
      });
      
      // Notify all students in the class
      const q = query(collection(db, 'students'), where('class_name', '==', class_name));
      const studentsSnap = await getDocs(q);
      const notifyPromises = studentsSnap.docs.map(doc => {
        const student = doc.data();
        return sendDualNotification('NEW_TEST_UPLOADED', student, { test_name: title, link: link });
      });
      await Promise.allSettled(notifyPromises);

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add test link' });
    }
  });

  app.delete('/api/admin/test-links/:id', authenticateAdmin, async (req, res) => {
    const id = req.params.id as string;
    console.log(`Attempting to delete test link: ${id}`);
    try {
      await deleteDoc(doc(db, 'test_links', id));
      console.log(`Successfully deleted test link: ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`Failed to delete test link: ${id}`, error);
      res.status(400).json({ error: 'Failed to delete test link' });
    }
  });

  app.post('/api/admin/online-test-marks', authenticateAdmin, async (req, res) => {
    const { class_name, roll_no, test_title, score, total } = req.body;
    try {
      const q = query(collection(db, 'students'), where('class_name', '==', class_name), where('roll_no', '==', roll_no));
      const studentSnap = await getDocs(q);
      
      if (studentSnap.empty) {
        return res.status(404).json({ error: 'Student not found with this Class and Roll No' });
      }
      
      const studentId = studentSnap.docs[0].id;
      const studentData = studentSnap.docs[0].data();
      
      await addDoc(collection(db, 'online_test_marks'), {
        studentId, test_title, score, total,
        date: new Date().toISOString()
      });
      
      await sendDualNotification('ONLINE_TEST_RESULT', studentData, { test_name: test_title, score, total });
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add marks' });
    }
  });

  app.post('/api/webhook/test-result', async (req, res) => {
    const { class_name, roll_no, test_title, score, total } = req.body;
    try {
      const q = query(collection(db, 'students'), where('class_name', '==', class_name), where('roll_no', '==', roll_no));
      const studentSnap = await getDocs(q);
      
      if (studentSnap.empty) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      const studentId = studentSnap.docs[0].id;
      const studentData = studentSnap.docs[0].data();
      
      await addDoc(collection(db, 'online_test_marks'), {
        studentId, test_title, score, total,
        date: new Date().toISOString()
      });
      
      await sendDualNotification('ONLINE_TEST_SUBMITTED', studentData, { test_name: test_title });
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add marks via webhook' });
    }
  });

  // Admin: Attendance
  app.post('/api/admin/attendance', authenticateAdmin, async (req, res) => {
    const { records, date, class_name } = req.body;
    try {
      const batch = writeBatch(db);
      for (const [studentId, status] of Object.entries(records)) {
        const docId = `${studentId}_${date}`;
        const docRef = doc(db, 'attendance', docId);
        batch.set(docRef, { studentId, date, status, class_name }, { merge: true });
      }
      await batch.commit();
      
      // Send Dual Notification for Attendance
      const q = query(collection(db, 'students'), where('class_name', '==', class_name));
      const studentsSnap = await getDocs(q);
      const notifyPromises: Promise<any>[] = [];
      
      studentsSnap.docs.forEach(doc => {
        const studentId = doc.id;
        const student = doc.data();
        const status = (records as Record<string, string>)[studentId];
        
        if (status) {
          notifyPromises.push(sendDualNotification('ATTENDANCE_MARKED', student, { date, status }));
        }
      });
      
      await Promise.allSettled(notifyPromises);

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save attendance' });
    }
  });

  app.get('/api/admin/attendance/:class_name/:date', authenticateAdmin, async (req, res) => {
    try {
      const q = query(collection(db, 'attendance'), 
        where('class_name', '==', req.params.class_name),
        where('date', '==', req.params.date)
      );
      const snap = await getDocs(q);
      const records: Record<string, string> = {};
      snap.docs.forEach(doc => {
        records[doc.data().studentId] = doc.data().status;
      });
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  });

  // Admin: Fees
  app.post('/api/admin/fees', authenticateAdmin, async (req, res) => {
    const { studentId, amount, month, date, remarks } = req.body;
    try {
      const receiptNo = `REC-${Date.now().toString().slice(-6)}`;
      await addDoc(collection(db, 'fees'), {
        studentId, amount: Number(amount), month, date, remarks, receiptNo,
        createdAt: new Date().toISOString()
      });
      
      const studentSnap = await getDoc(doc(db, 'students', studentId));
      if (studentSnap.exists()) {
        const student = studentSnap.data();
        await sendDualNotification('FEE_SUBMISSION', student, { amount, date });
      }

      res.json({ success: true, receiptNo });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add fee record' });
    }
  });

  app.get('/api/admin/fees/:studentId', authenticateAdmin, async (req, res) => {
    try {
      const q = query(collection(db, 'fees'), where('studentId', '==', req.params.studentId));
      const snap = await getDocs(q);
      const records = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch fee records' });
    }
  });

  // Student: Login
  app.post('/api/student/login', async (req, res) => {
    const { class_name, roll_no } = req.body;
    try {
      const q = query(collection(db, 'students'), where('class_name', '==', class_name), where('roll_no', '==', roll_no));
      const studentSnap = await getDocs(q);
      
      if (!studentSnap.empty) {
        const student = { id: studentSnap.docs[0].id, ...studentSnap.docs[0].data() };
        res.json({ success: true, student });
      } else {
        res.status(401).json({ success: false, error: 'Invalid Class or Roll Number' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Student: Results
  app.get('/api/student/:id/results', async (req, res) => {
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      const settings = settingsSnap.data() || {};
      
      if (!settings.results_published) {
        return res.json({ published: false, results: [] });
      }

      const q = query(collection(db, 'results'), where('studentId', '==', req.params.id));
      const resultsSnap = await getDocs(q);
      const results = resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ published: true, results });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  });

  // Student: Attendance
  app.get('/api/student/:id/attendance', async (req, res) => {
    try {
      const q = query(collection(db, 'attendance'), where('studentId', '==', req.params.id));
      const snap = await getDocs(q);
      const records = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  });

  // Student: Fees
  app.get('/api/student/:id/fees', async (req, res) => {
    try {
      const q = query(collection(db, 'fees'), where('studentId', '==', req.params.id));
      const snap = await getDocs(q);
      const records = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch fees' });
    }
  });

  // Student: Test Links
  app.get('/api/student/test-links/:class_name', async (req, res) => {
    try {
      const q = query(collection(db, 'test_links'), where('class_name', '==', req.params.class_name));
      const linksSnap = await getDocs(q);
      const links = linksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch test links' });
    }
  });

  app.get('/api/student/:id/online-test-marks', async (req, res) => {
    try {
      const q = query(collection(db, 'online_test_marks'), where('studentId', '==', req.params.id));
      const marksSnap = await getDocs(q);
      const marks = marksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(marks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch online test marks' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> Server is listening on port ${PORT}`);
    console.log(`>>> Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => console.error('Failed to start server:', err));