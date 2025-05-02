import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

dotenv.config();
const app = express();
const port = process.env.PORT || 4001;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Setup email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors());
app.use(express.json());

// Setup admin credentials from environment
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env; admin login disabled');
}
console.log('ADMIN_EMAIL from env:', ADMIN_EMAIL);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoolDashboard';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const teacherSchema = new mongoose.Schema({
  name: String,
});

const studentSchema = new mongoose.Schema({
  name: String,
});

const Teacher = mongoose.model('Teacher', teacherSchema);
const Student = mongoose.model('Student', studentSchema);

// Define Mongoose schemas and models
const parentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'parent' },
  children: [String],
  maxChildren: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  verificationCode: String,
  createdAt: { type: Date, default: Date.now },
  partners: [
    {
      name: String,
      email: { type: String },
      password: String,
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

const schoolSchema = new mongoose.Schema({
  schoolName: String,
  adminEmail: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'school' },
  numberOfTeachers: { type: Number, default: 1 },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  verificationCode: String,
  createdAt: { type: Date, default: Date.now }
});

// System Log schema for tracking admin actions
const systemLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['error', 'deletion', 'edit'], required: true },
  message: { type: String, required: true },
  adminEmail: { type: String, required: true },
  targetId: String,  // ID of the affected user/entity
  targetType: String, // Type of entity affected (parent, school, etc.)
  details: mongoose.Schema.Types.Mixed, // Additional details
  timestamp: { type: Date, default: Date.now }
});

const SystemLog = mongoose.model('SystemLog', systemLogSchema);

const Parent = mongoose.model('Parent', parentSchema);
const School = mongoose.model('School', schoolSchema);

// Helper to generate a 6-digit code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Add a login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Debug log for admin login attempts
  console.log('Login attempt:', { email, passwordLength: password ? password.length : 0 });

  try {
    // Check if it's an admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        user: {
          email: ADMIN_EMAIL,
          name: 'Administrator',
          role: 'admin'
        }
      });
    }

    // Check if it's a parent
    const parent = await Parent.findOne({ email, password });
    if (parent) {
      if (!parent.verified) {
        return res.status(403).json({ success: false, error: 'Email not verified' });
      }
      return res.json({
        success: true,
        user: {
          email: parent.email,
          name: parent.name,
          role: 'parent',
          children: parent.children,
          maxChildren: parent.maxChildren
        }
      });
    }

    // Check if it's a school
    const school = await School.findOne({ adminEmail: email, password });
    if (school) {
      if (!school.verified) {
        return res.status(403).json({ success: false, error: 'Email not verified' });
      }
      return res.json({
        success: true,
        user: {
          email: school.adminEmail,
          name: school.schoolName,
          role: 'school'
        }
      });
    }

    res.status(401).json({ success: false, error: 'Invalid email or password' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

// Simple register for Parent
app.post('/api/register/parent', async (req, res) => {
  const { name, email, password, maxChildren } = req.body;

  try {
    const verificationToken = uuidv4();
    const verificationCode = generateVerificationCode();

    const newParent = new Parent({
      name,
      email,
      password,
      maxChildren: Number(maxChildren) || 0,
      verificationToken,
      verificationCode
    });

    await newParent.save();

    // Send verification email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: newParent.email,
      subject: 'Verify your email',
      html: `
        <p>Hi ${newParent.name},</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${FRONTEND_URL}/verify-email?token=${verificationToken}">Verify Email</a></p>
        <p>Or enter this 6‑digit code on the verification page:</p>
        <h2>${verificationCode}</h2>
      `
    });

    res.json({ success: true, message: 'Parent registered. Check your email for verification.' });
  } catch (error) {
    console.error('Error registering parent:', error);
    res.status(500).json({ success: false, error: 'Failed to register parent' });
  }
});

// Simple register for School
app.post('/api/register/school', async (req, res) => {
  const { schoolName, adminEmail, password, numberOfTeachers } = req.body;

  try {
    const newSchool = new School({
      schoolName,
      adminEmail,
      password,
      numberOfTeachers,
      verified: true // Automatically verify admin accounts
    });

    await newSchool.save();

    res.json({ success: true, message: 'School registered successfully.' });
  } catch (error) {
    console.error('Error registering school:', error);
    res.status(500).json({ success: false, error: 'Failed to register school' });
  }
});

// Email verification endpoint
app.get('/api/verify-email', async (req, res) => {
  const token = req.query.token;

  try {
    const parent = await Parent.findOne({ verificationToken: token });
    if (parent) {
      parent.verified = true;
      parent.verificationToken = undefined;
      await parent.save();
      return res.json({ success: true, message: 'Email verified successfully' });
    }

    const school = await School.findOne({ verificationToken: token });
    if (school) {
      school.verified = true;
      school.verificationToken = undefined;
      await school.save();
      return res.json({ success: true, message: 'Email verified successfully' });
    }

    res.status(400).json({ success: false, error: 'Invalid or expired token' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ success: false, error: 'Failed to verify email' });
  }
});

// Code verification endpoint
app.post('/api/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const parent = await Parent.findOne({ email, verificationCode: code });
    if (parent) {
      parent.verified = true;
      parent.verificationCode = undefined;
      parent.verificationToken = undefined;
      await parent.save();
      return res.json({ success: true, message: 'Email verified successfully' });
    }

    const school = await School.findOne({ adminEmail: email, verificationCode: code });
    if (school) {
      school.verified = true;
      school.verificationCode = undefined;
      school.verificationToken = undefined;
      await school.save();
      return res.json({ success: true, message: 'Email verified successfully' });
    }

    res.status(400).json({ success: false, error: 'Invalid email or code' });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ success: false, error: 'Failed to verify code' });
  }
});

// Billing for Parent (Stripe Checkout session)
app.post('/api/create-checkout-session', async (req, res) => {
  const { email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Maths Learning Plan',
          },
          unit_amount: 1000, // $10/month
        },
        quantity: 1,
      }],
      mode: 'subscription',
      customer_email: email,
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Teacher
app.post('/api/teachers', async (req, res) => {
  const { name } = req.body;
  try {
    const teacher = new Teacher({ name });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Student
app.post('/api/students', async (req, res) => {
  const { name } = req.body;
  try {
    const student = new Student({ name });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Child Endpoint
app.post('/api/children', async (req, res) => {
  const { parentEmail, name, username } = req.body;

  try {
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      return res.json({ success: false, error: "Parent not found" });
    }

    const password = `Duck${Math.floor(1000 + Math.random() * 9000)}`;
    const newChild = {
      id: uuidv4(),
      name,
      username,
      password,
      parentEmail,
      progress: []
    };

    parent.children.push(username);
    await parent.save();

    res.json({
      success: true,
      child: { username, password }
    });
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ success: false, error: 'Failed to add child' });
  }
});

// Get parent's children
app.get('/api/parents/:email/children', async (req, res) => {
  const { email } = req.params;

  try {
    const parent = await Parent.findOne({ email });
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    res.json({
      success: true,
      children: parent.children
    });
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch children' });
  }
});

// Admin endpoints for user management
app.get('/api/admin/users', async (req, res) => {
  try {
    const parents = await Parent.find();
    const schools = await School.find();

    const allUsers = [
      ...parents.map(p => ({
        id: p._id,
        email: p.email,
        name: p.name,
        role: 'parent',
        children: p.children,
        maxChildren: p.maxChildren,
        createdAt: p.createdAt
      })),
      ...schools.map(s => ({
        id: s._id,
        email: s.adminEmail,
        name: s.schoolName,
        role: 'school',
        numberOfTeachers: s.numberOfTeachers,
        createdAt: s.createdAt
      }))
    ];

    res.json({ success: true, users: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// Add System Log endpoints for admin
app.get('/api/admin/system-logs', async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch system logs' });
  }
});

// Create system log helper function
const createSystemLog = async (type, message, adminEmail, targetId = null, targetType = null, details = {}) => {
  try {
    const log = new SystemLog({
      type,
      message,
      adminEmail,
      targetId,
      targetType,
      details,
      timestamp: new Date()
    });
    await log.save();
    return true;
  } catch (error) {
    console.error('Error creating system log:', error);
    return false;
  }
};

// Delete user endpoint
app.delete('/api/admin/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const adminEmail = req.headers['admin-email'] || 'Unknown admin';

  try {
    const parent = await Parent.findById(userId);
    if (parent) {
      await Parent.findByIdAndDelete(userId);
      await createSystemLog(
        'deletion', 
        `Parent account deleted: ${parent.email}`, 
        adminEmail,
        userId,
        'parent',
        { email: parent.email, name: parent.name }
      );
      return res.json({
        success: true,
        message: 'Parent removed successfully'
      });
    }

    const school = await School.findById(userId);
    if (school) {
      await School.findByIdAndDelete(userId);
      await createSystemLog(
        'deletion', 
        `School account deleted: ${school.adminEmail}`, 
        adminEmail,
        userId,
        'school',
        { email: school.adminEmail, name: school.schoolName }
      );
      return res.json({
        success: true,
        message: 'School removed successfully'
      });
    }

    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    await createSystemLog(
      'error', 
      `Error deleting user ID: ${userId}`, 
      adminEmail,
      userId,
      'unknown',
      { error: error.message }
    );
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

// Update parent endpoint
app.put('/api/admin/update-parent/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email, maxChildren } = req.body;
  const adminEmail = req.headers['admin-email'] || 'Unknown admin';

  try {
    const parent = await Parent.findById(userId);
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' });
    }

    // Don't allow reducing maxChildren below current number of children
    if (maxChildren < (parent.children?.length || 0)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot reduce maximum children below current number of children'
      });
    }
    
    const originalData = {
      name: parent.name,
      email: parent.email,
      maxChildren: parent.maxChildren
    };

    parent.name = name;
    parent.email = email;
    parent.maxChildren = maxChildren;
    await parent.save();
    
    await createSystemLog(
      'edit', 
      `Parent account updated: ${email}`, 
      adminEmail,
      userId,
      'parent',
      { 
        before: originalData, 
        after: { name, email, maxChildren } 
      }
    );

    res.json({
      success: true,
      message: 'Parent updated successfully'
    });
  } catch (error) {
    console.error('Error updating parent:', error);
    await createSystemLog(
      'error', 
      `Error updating parent ID: ${userId}`, 
      adminEmail,
      userId,
      'parent',
      { error: error.message }
    );
    res.status(500).json({ success: false, error: 'Failed to update parent' });
  }
});

// Update school endpoint
app.put('/api/admin/update-school/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email, numberOfTeachers } = req.body;

  try {
    const school = await School.findById(userId);
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    school.schoolName = name;
    school.adminEmail = email;
    school.numberOfTeachers = numberOfTeachers;
    await school.save();

    res.json({
      success: true,
      message: 'School updated successfully'
    });
  } catch (error) {
    console.error('Error updating school:', error);
    res.status(500).json({ success: false, error: 'Failed to update school' });
  }
});

// Update parent settings endpoint to use email instead of ID
app.put('/api/parent/settings/:parentEmail', async (req, res) => {
  const { parentEmail } = req.params;
  const { name } = req.body;

  try {
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' });
    }

    parent.name = name;
    await parent.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      user: {
        email: parent.email,
        name: parent.name,
        role: 'parent',
        children: parent.children,
        maxChildren: parent.maxChildren,
        partners: parent.partners
      }
    });
  } catch (error) {
    console.error('Error updating parent settings:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// Update add managing partner endpoint to use email instead of ID
app.post('/api/parent/partners/:parentEmail', async (req, res) => {
  const { parentEmail } = req.params;
  const { name, email, password } = req.body;

  try {
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' });
    }

    if (!parent.partners) {
      parent.partners = [];
    }

    if (parent.partners.length >= 4) {
      return res.status(400).json({ success: false, error: 'Maximum of 4 managing partners allowed' });
    }

    // Check if partner email already exists
    if (parent.partners.some(p => p.email === email)) {
      return res.status(400).json({ success: false, error: 'Partner with this email already exists' });
    }

    // Ensure password is provided
    if (!password || password.trim() === '') {
      return res.status(400).json({ success: false, error: 'Password is required for partner' });
    }

    parent.partners.push({
      name,
      email,
      password, // Store the password for the partner
      addedAt: new Date()
    });

    await parent.save();

    res.json({
      success: true,
      message: 'Partner added successfully',
      partners: parent.partners.map(p => ({
        name: p.name,
        email: p.email,
        addedAt: p.addedAt
      })) // Don't return passwords in the response
    });
  } catch (error) {
    console.error('Error adding partner:', error);
    res.status(500).json({ success: false, error: 'Failed to add partner' });
  }
});

// Update remove managing partner endpoint to use email instead of ID
app.delete('/api/parent/partners/:parentEmail/:partnerEmail', async (req, res) => {
  const { parentEmail, partnerEmail } = req.params;

  try {
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' });
    }

    parent.partners = parent.partners.filter(p => p.email !== partnerEmail);
    await parent.save();

    res.json({
      success: true,
      message: 'Partner removed successfully',
      partners: parent.partners
    });
  } catch (error) {
    console.error('Error removing partner:', error);
    res.status(500).json({ success: false, error: 'Failed to remove partner' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});