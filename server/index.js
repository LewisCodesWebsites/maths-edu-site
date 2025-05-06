import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

dotenv.config();
const app = express();
const port = process.env.PORT || 4002; // Changed from 4001 to 4002 to avoid conflict
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

const allowedOrigins = [
  "http://localhost:3000",
  "https://mathsmastery.onrender.com",
  "https://lewiscodeswebsites.github.io"
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
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

// Define Child schema
const childSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  parentEmail: String, // Reference to parent's email
  year: String, // UK school year
  yearGroup: { type: Number, default: 5 },
  progress: [{ 
    subject: String,
    topic: String, 
    score: Number,
    completedAt: { type: Date, default: Date.now } 
  }],
  createdAt: { type: Date, default: Date.now }
});

const Teacher = mongoose.model('Teacher', teacherSchema);
const Student = mongoose.model('Student', studentSchema);
const Child = mongoose.model('Child', childSchema);

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

// Define Topic schema
const topicSchema = new mongoose.Schema({
  year: { type: String, required: true }, // e.g., 'reception', 'year1', etc.
  section: { type: String, required: true }, // e.g., 'Basic Operators'
  level: { type: String, enum: ['growing', 'exceeding', 'excelling'], required: true },
  title: { type: String, required: true },
  article: { type: String, required: true },
  questions: [
    {
      question: String,
      type: { type: String, enum: ['multiple-choice', 'short-answer', 'true-false'], default: 'multiple-choice' },
      options: [String], // For multiple-choice
      answer: mongoose.Schema.Types.Mixed // Could be string, array, etc.
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Topic = mongoose.model('Topic', topicSchema);

const SystemLog = mongoose.model('SystemLog', systemLogSchema);

const Parent = mongoose.model('Parent', parentSchema);
const School = mongoose.model('School', schoolSchema);

// Helper to generate a 6-digit code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Define salt rounds for bcrypt password hashing
const SALT_ROUNDS = 10;

// Helper function to hash passwords
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Helper function to compare password with hash
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

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
    const parent = await Parent.findOne({ email });
    if (parent) {
      if (!parent.verified) {
        return res.status(403).json({ success: false, error: 'Email not verified' });
      }
      
      // Check if the password is already hashed
      let passwordValid = false;
      if (parent.password.startsWith('$2b$') || parent.password.startsWith('$2a$')) {
        // Password is already hashed, compare with bcrypt
        passwordValid = await comparePassword(password, parent.password);
      } else {
        // Legacy password (not hashed), do a direct comparison
        // This allows existing accounts to keep working
        passwordValid = parent.password === password;
        
        // Upgrade to hashed password for future logins
        if (passwordValid) {
          parent.password = await hashPassword(password);
          await parent.save();
        }
      }
      
      if (!passwordValid) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
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
    const school = await School.findOne({ adminEmail: email });
    if (school) {
      if (!school.verified) {
        return res.status(403).json({ success: false, error: 'Email not verified' });
      }
      
      // Check if the password is already hashed
      let passwordValid = false;
      if (school.password.startsWith('$2b$') || school.password.startsWith('$2a$')) {
        // Password is already hashed, compare with bcrypt
        passwordValid = await comparePassword(password, school.password);
      } else {
        // Legacy password (not hashed), do a direct comparison
        passwordValid = school.password === password;
        
        // Upgrade to hashed password for future logins
        if (passwordValid) {
          school.password = await hashPassword(password);
          await school.save();
        }
      }
      
      if (!passwordValid) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
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

// Child login endpoint
app.post('/api/login/child', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Look for the child in our dedicated Child collection
    const child = await Child.findOne({ username });
    
    if (!child) {
      // For backward compatibility - check parents who might have the child username
      // We'll need to migrate these later
      const parent = await Parent.findOne({ children: username });
      
      if (!parent) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
      
      // For backward compatibility during transition: accept any password
      // This is temporary until all children records are migrated
      console.log('Using backward compatibility mode for child login');
      return res.json({
        success: true,
        user: {
          username: username,
          name: username, // Using username as name in legacy mode
          role: 'child',
          parentEmail: parent.email,
          yearGroup: 5 // Default year group
        }
      });
    }
    
    // Verify child's password
    let passwordValid = false;
    
    // Check if the password is hashed (using bcrypt)
    if (child.password.startsWith('$2b$') || child.password.startsWith('$2a$')) {
      passwordValid = await comparePassword(password, child.password);
    } else {
      // Legacy password not yet hashed
      passwordValid = child.password === password;
      
      // Upgrade to hashed password for future logins
      if (passwordValid) {
        child.password = await hashPassword(password);
        await child.save();
      }
    }
    
    if (!passwordValid) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
    
    return res.json({
      success: true,
      user: {
        username: child.username,
        name: child.name,
        role: 'child',
        parentEmail: child.parentEmail,
        yearGroup: child.yearGroup
      }
    });
  } catch (error) {
    console.error('Child login error:', error);
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

// Add check-email endpoint for two-part login process
app.post('/api/auth/check-email', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if it's an admin
    if (email === ADMIN_EMAIL) {
      return res.json({
        exists: true,
        accountType: 'admin'
      });
    }

    // Check if it's a parent
    const parent = await Parent.findOne({ email });
    if (parent) {
      return res.json({
        exists: true,
        accountType: 'parent'
      });
    }

    // Check if it's a school
    const school = await School.findOne({ adminEmail: email });
    if (school) {
      return res.json({
        exists: true,
        accountType: 'school'
      });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Failed to check email' });
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
  const { parentEmail, name, username, password, year } = req.body;

  try {
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      return res.status(404).json({ success: false, error: "Parent not found" });
    }
    
    // Check if username is already taken
    const existingChild = await Child.findOne({ username });
    if (existingChild) {
      return res.status(400).json({ 
        success: false, 
        error: "Username already exists. Please choose a different username." 
      });
    }

    // Generate a secure password if none is provided
    const childPassword = password || `Duck${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Hash the password
    const hashedPassword = await hashPassword(childPassword);
    
    // Create a new child record in our dedicated Child collection
    const newChild = new Child({
      name,
      username,
      password: hashedPassword,
      parentEmail,
      year, // Store the year/grade level from the UK system
      yearGroup: getYearGroupNumber(year), // Convert UK year to numeric value
      progress: []
    });
    
    await newChild.save();

    // Also add reference in parent's children array
    parent.children.push(username);
    await parent.save();

    res.json({
      success: true,
      child: { 
        username, 
        password: childPassword // Only return plain password once during creation
      }
    });
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ success: false, error: 'Failed to add child' });
  }
});

// Helper function to convert UK school year to numeric value
function getYearGroupNumber(yearString) {
  const yearMap = {
    'reception': 0,
    'year1': 1,
    'year2': 2,
    'year3': 3,
    'year4': 4,
    'year5': 5,
    'year6': 6,
    'year7': 7,
    'year8': 8,
    'year9': 9,
    'year10': 10,
    'year11': 11
  };
  
  return yearMap[yearString] !== undefined ? yearMap[yearString] : 5; // Default to Year 5 if not found
}

// Delete Child Endpoint
app.delete('/api/children/:username', async (req, res) => {
  const { username } = req.params;
  const { parentEmail } = req.body;

  try {
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      return res.status(404).json({ success: false, error: "Parent not found" });
    }

    // Check if this child belongs to this parent
    if (!parent.children.includes(username)) {
      return res.status(403).json({ success: false, error: "Not authorized to remove this child" });
    }

    // Remove child from parent's children array
    parent.children = parent.children.filter(child => child !== username);
    await parent.save();
    
    // Also remove the child from our dedicated Child collection if it exists
    await Child.findOneAndDelete({ username });

    res.json({
      success: true,
      message: 'Child removed successfully'
    });
  } catch (error) {
    console.error('Error removing child:', error);
    res.status(500).json({ success: false, error: 'Failed to remove child' });
  }
});

// Get child details by username (for dashboard)
app.get('/api/children/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const child = await Child.findOne({ username });
    if (!child) {
      return res.status(404).json({ success: false, error: 'Child not found' });
    }
    res.json({ success: true, child });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch child' });
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
    // Fetch child info for each parent
    const allChildren = await Child.find();
    const allUsers = [
      ...parents.map(p => ({
        id: p._id,
        email: p.email,
        name: p.name,
        role: 'parent',
        children: allChildren.filter(c => p.children.includes(c.username)),
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

// Get topics for a given year, grouped by section and level
app.get('/api/topics/:year', async (req, res) => {
  const { year } = req.params;
  try {
    const topics = await Topic.find({ year }).sort({ section: 1, level: 1, title: 1 });
    // Group by section and level
    const grouped = {};
    topics.forEach(topic => {
      if (!grouped[topic.section]) grouped[topic.section] = {};
      if (!grouped[topic.section][topic.level]) grouped[topic.section][topic.level] = [];
      grouped[topic.section][topic.level].push(topic);
    });
    res.json({ success: true, topics: grouped });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch topics' });
  }
});

// Serve static files from the React build directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Catch-all handler: for any request that doesn't match an API route, serve React's index.html
app.get(/^\/((?!api).)*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});