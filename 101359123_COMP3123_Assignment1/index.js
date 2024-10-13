const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;

const employeeRoutes = require('./employee'); // Import the router
const userRoutes = require('./users')

app.use(express.json());

const start = async() => {
    try{
        await mongoose.connect("mongodb+srv://aayanf3942:MxiGu4Yrf7yOZWz8@cluster0.wmu4k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

        app.listen(SERVER_PORT, () => {
            console.log(`Server is running on port ${SERVER_PORT}`);
        });
    }
    catch(error){
        console.log(error.message);
    }
};

start();

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp/employees', employeeRoutes);

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening on Port", port);
});

