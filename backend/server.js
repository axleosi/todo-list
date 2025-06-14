import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/users.js'
import todoRoutes from './routes/todo.js';
dotenv.config()

const app=express();
const PORT=process.env.PORT || 3000;
const MONGO_URI=process.env.MONGO_URI;

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true, 
}));

app.use(express.json())

app.use('/api', userRouter)
app.use('/api', todoRoutes);

const connectDB= async()=>{
    try {
        mongoose.connection.on('connected', ()=> {console.log('Database connected');}
        )
        await mongoose.connect(`${MONGO_URI}/todo`)
    } catch (error) {
        console.error('connection error:', error);
    }
}

await connectDB()




app.get('/', (req,res)=>{
    res.send('Hello world')
})

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`)
})