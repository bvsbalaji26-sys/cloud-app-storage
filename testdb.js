const connectDB = require("./db");

async function test() {
    const db = await connectDB();

    if (db) {
        console.log("Database connected successfully!");
    }
}

test();