const express=require('express')
const app = express();
const dotenv=require('dotenv')
const morgan=require('morgan');
const helmet=require('helmet')
dotenv.config()
require('./Database/db')
const userRoute=require('./routes/users')
const authRoute=require('./routes/auth')
const postRoute=require('./routes/post')
// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

// router***********************************
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)




app.listen(process.env.PORT, () =>
  console.log('Social media app listening on port ',process.env.PORT),
);