import express from 'express';

const app = express();

app.get("/api/appfood", (req, res) => {
  res.status(200).json({
    success: true,
    });
});

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
  console.log('Server is running on', PORT);
});