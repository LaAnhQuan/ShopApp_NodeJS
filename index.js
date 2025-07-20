import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './AppRoute'
import db from "./models"
import * as os from 'os';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import socketHandler from './socket';

//config dotenv
dotenv.config()

const app = express()
const port = process?.env?.PORT ?? 3000;

const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

socketHandler(io)

// CORS headers
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Cho phép tất cả các nguồn truy cập (có thể thay '*' bằng domain cụ thể)
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE'); // Các phương thức HTTP được phép
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Các headers được phép
    next(); // Tiến hành xử lý tiếp các middleware tiếp theo
});

//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Khai bao router
app.use('/api/', apiRoutes)

// app.get('/', (req, res) => {
//     res.send('Hello toi dey hello vn ')
// })



app.get('/api/healthcheck', async (req, res) => {
    try {
        // Kiểm tra kết nối cơ sở dữ liệu
        await db.sequelize.authenticate();

        // Lấy thông tin tải CPU

        const cpuLoad = os.loadavg();
        console.log("check os", cpuLoad)
        const cpus = os.cpus();
        const cpuPercentage = cpuLoad[0] / cpus.length * 100;

        // Lấy thông tin sử dụng bộ nhớ và chuyển đổi sang megabytes
        const memoryUsage = process.memoryUsage();
        const memoryUsageMB = {
            rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB', // Resident
            heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
            heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
            external: (memoryUsage.external / 1024 / 1024).toFixed(2) + ' MB',
        };

        // Trả về kết quả
        res.status(200).json({
            status: 'OK',
            database: 'Connected',
            cpuLoad: {
                '1min': cpuLoad[0],
                '5min': cpuLoad[1],
                '15min': cpuLoad[2],
                'percentage': cpuPercentage.toFixed(2) + '%'
            },
            memoryUsage: memoryUsageMB
        });
    } catch (error) {
        // Trường hợp có lỗi
        res.status(500).json({
            status: 'Failed',
            message: 'Health check failed',
            error: error.message
        });
    }
});



server.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})


