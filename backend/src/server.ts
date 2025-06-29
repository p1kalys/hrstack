import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import userRouter from './routes/userRoutes';
import blogRouter from './routes/blogRoutes';



const app = express();

(async () => {
    await connectDB();
})();

//Middlewares
app.use(cors())
app.use(express.json())

app.use('/api/profile', userRouter)
app.use('/api/blog', blogRouter)

app.get('/', (req: Request, res: Response) => res.send("API is working"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server is running on port ' + PORT))

export default app