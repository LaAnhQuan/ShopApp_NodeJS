import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './AppRoute'

//config dotenv
dotenv.config()

const app = express()
const port = process?.env?.PORT ?? 3000;

//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Khai bao router
app.use('/api/', apiRoutes)

// app.get('/', (req, res) => {
//     res.send('Hello toi dey hello vn ')
// })


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})


