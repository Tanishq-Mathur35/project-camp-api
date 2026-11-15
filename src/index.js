import dns from "dns"
import dotenv from "dotenv"
import app from "./app.js"
import connectDB from './db/index.js'

dotenv.config({
    path: "./.env"
})

dns.setServers(["8.8.8.8", "8.8.4.4"])

const port = process.env.PORT || 3000


connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })

    })
    .catch((err) => {
        console.error("Mongo DB connection error: ", err)
    })
