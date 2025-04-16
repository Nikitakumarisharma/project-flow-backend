const express= require('express');
const app= express();
const cors= require('cors');

app.use(cors());
app.use(express.json()); // ✅ for parsing JSON payloads

const mongoose= require('mongoose');
mongoose.connect(
    'mongodb+srv://niku2003kumari:niku2003@cmtai-crm-cluster.akuljso.mongodb.net/?retryWrites=true&',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('✅ MongoDB Atlas connected!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

const Post_route= require('../routes/postRoute');
const userRoutes= require('../routes/userRoute');
const authRoutes= require('../routes/authRoute');
const projectRoutes= require('../routes/projectRoute');

app.use('/api',Post_route);
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/projects',projectRoutes);


// app.listen(4000,()=>{
//     console.log('Server is running on port 4000');
// })

module.exports = app;