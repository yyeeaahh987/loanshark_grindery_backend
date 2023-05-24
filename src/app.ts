import express, { Application, Request, Response } from "express"
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bodyParser from "body-parser";
import workflowRouter from './router/workflowRouter';
import emailRouter from './router/emailRouter';
import discordRouter from './router/discordRouter';
import fs from 'fs';
import https from 'https'

const app: Application = express()
const port: number = 8080
const httpsPort: number = 8443
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

console.log(__dirname )
const key=fs.readFileSync(`${__dirname}/private.key`)
const cert=fs.readFileSync(`${__dirname}/certificate.crt`)

const cred = {
    key,
    cert
}
if (process.env.DATABASE_URL) {
    console.log(`${process.env.DATABASE_URL}`)
    mongoose.connect(`${process.env.DATABASE_URL}`)
    const db = mongoose.connection
    console.log(`connecting database`)
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
}


app.get("/toto", (req: Request, res: Response) => {
    res.send("Hello toto")
})

app.use('/email', emailRouter);
app.use('/discord', discordRouter);
app.use('/workflow', workflowRouter);

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})


const httpsServer = https.createServer(cred, app)
httpsServer.listen(httpsPort)
console.log(`https App is listening on port ${httpsPort} !`)


