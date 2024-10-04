import mongoose from 'mongoose';
require('dotenv').config();

function connectDB() {
    mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Database Connection Error: "));
    db.once("open", function () {
        console.log("Database Connected Successfully");
    });
}

export default connectDB;
