require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDatabase = require('./configs/database');
const path = require("path");

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
        secure : true,
        httpOnly : true
    }
}));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/admin', require('./routes/admin.route'));
app.use('/api/v1/category', require('./routes/category.routes'));
app.use('/api/v1/product', require('./routes/product.routes'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running On Port : ${PORT}`);
    connectDatabase();
});