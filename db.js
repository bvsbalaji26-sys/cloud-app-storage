const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://bvsbalaji26_db_user:bandarudokuparthisobharani@cluster0.dyr6sch.mongodb.net/?appName=Cluster0'
)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log(err));