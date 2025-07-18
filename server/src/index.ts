import express,{Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import quizRoutes from './routes/QuizRoutes';
import rateLimit from 'express-rate-limit';
dotenv.config();

const PORT = process.env.PORT;
const app:Express = express();
const corsOptions = {
    origin: ['http://localhost:3000', !process.env.ORIGIN],
    methods: ['POST']

}
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    limit: 10,                
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
          success: false,
          message: `Rate limit exceeded. Try again after ${Math.ceil(options.windowMs / 60000)} minutes.`,
          remaining: 0,
        });
    },
  });
app.use(express.json());
app.use(cors(corsOptions))
app.use(limiter);

app.use('/quiz', quizRoutes)

export default app;