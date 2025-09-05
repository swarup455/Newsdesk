import dotenv from "dotenv"
import connectDB from "./db/database.js"
dotenv.config({path: './.env'})
import {app} from "./app.js"

connectDB()
.then(() => {
    // Listen for any error events emitted by the Express app (or underlying server)
    app.on("error", (err) => {
        console.error("Server error:", err);
    });
    
    const currPort = process.env.PORT || 8000;
    app.listen(currPort, () => {
        console.log(`server is running at port: ${currPort}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed!!!", err)
})