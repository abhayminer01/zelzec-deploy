require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDatabase = require('./configs/database');
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors({
    origin : ['http://localhost:5173', 'http://localhost:5174', 'https://zelzec.com', 'https://admin.zelzec.com'],
    credentials : true,
    methods : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : false,
        httpOnly : true
    }
}));
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/admin', require('./routes/admin.route'));
app.use('/api/v1/category', require('./routes/category.routes'));
app.use('/api/v1/product', require('./routes/product.routes'));

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "../uploads", filename);

  if (fs.existsSync(filepath)) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running On Port : ${PORT}`);
    connectDatabase();
});