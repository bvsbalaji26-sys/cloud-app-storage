const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');

const User = require('./user');
const File = require('./file');

const app = express();

// MongoDB Connection
mongoose.connect(
  'mongodb+srv://bvsbalaji26_db_user:bandarudokuparthisobharani@cluster0.dyr6sch.mongodb.net/cloudstorage?retryWrites=true&w=majority&appName=Cluster0'
)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'cloudstoragesecret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ======================
// SIGNUP
// ======================
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.redirect('/login.html');
  } catch (err) {
    console.error(err);
    res.send('Signup Failed');
  }
});

// ======================
// LOGIN
// ======================
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send('User not found');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send('Invalid Password');
    }

    req.session.userEmail = user.email;

    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.send('Login Failed: ' + err.message);
  }
});

// ======================
// DASHBOARD
// ======================
app.get('/dashboard', (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/login.html');
  }

  res.sendFile(__dirname + '/public/dashboard.html');
});

// ======================
// LOGOUT
// ======================
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// ======================
// UPLOAD
// ======================
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.userEmail) {
      return res.send('Please login first');
    }

    await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedBy: req.session.userEmail,
      path: req.file.path,
      size: req.file.size
    });

    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.send('Upload Failed');
  }
});

// ======================
// MY FILES
// ======================
app.get('/myfiles', async (req, res) => {
  try {
    if (!req.session.userEmail) {
      return res.json([]);
    }

    const files = await File.find({
      uploadedBy: req.session.userEmail
    });

    res.json(files);

  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

// ======================
// DOWNLOAD
// ======================
app.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.send('File not found');
    }

    res.download(file.path, file.originalName);

  } catch (err) {
    console.error(err);
    res.send('Download Failed');
  }
});

// ======================
// DELETE
// ======================
app.get('/delete/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.send('File not found');
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await File.findByIdAndDelete(req.params.id);

    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.send('Delete Failed');
  }
});

// ======================
// START SERVER
// ======================
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});