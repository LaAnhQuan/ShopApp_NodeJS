// delayMiddleware.js
const delayMiddleware = (req, res, next) => {
    // Lấy độ trễ từ tham số URL (ví dụ: /login/:delay)
    const { delay } = req.headers;  // Chú ý: header là "req.headers", không phải "req.header"

    const delayTime = parseInt(delay, 10) || 0; // Default là 0ms nếu không có tham số delay

    setTimeout(() => {
        next(); // Sau khi hết thời gian delay, tiếp tục với middleware tiếp theo hoặc route handler
    }, delayTime); // Đặt thời gian delay theo tham số URL
};

export default delayMiddleware;
