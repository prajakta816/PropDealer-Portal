
const express = require('express');

const app = express();
const PORT =  5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/health', (req, res) => {
  res.send('server running successfully');
});
app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)});