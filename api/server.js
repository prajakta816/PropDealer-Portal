import 'dotenv/config';
import express from 'express';
import { prisma } from './prisma/prisma';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
      status:"success",
      message:"hello world"
    });
});

app.get('/api/health', (req, res) => {
  res.send('server running successfully');
});

app.get('/api/health/db', async(req,res)=>{
  try{
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status:"success",
      message:"database connectivity successfull"
    });

  }catch(error){
      console.log("there is the error", error);

      res.status(503).json({
        status:"error",
        message:"connectivity failed"
      });
  }
});
app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)});