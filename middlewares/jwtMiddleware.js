/**
 Viết các hàm trong JWT middleware(requireRole và requireRoles) với các chức năng sau :
 -Lấy jwt Token từ Headers và kiểm tra xem token này có hợp lệ và còn hạn hay không
 -Lấy ra user's id từ token và query xuống db kiểm tra xem user này có bị block hay không
 -Lấy ra các role của user và kiểm tra xem role đó có phù hợp với role đầu vào của các hàm 
 requireRole và requireRoles


 app.get('/api/private', requireRoles(['admin', 'user']), (req, res) => {
    res.send('Dành cho admin và User')
})

 app.get('/api/private', requireRole('admin'), (req, res) => {
    res.send('Chỉ dành cho admin')
})
 */

import { getUserFromToken } from "../helpers/tokenHelper"; // Update the path accordingly

const requireRoles = (rolesRequired) => async (req, res, next) => {
    const user = await getUserFromToken(req, res);
    if (!user) return; // getUserFromToken already handled the error response

    if (user.is_locked === 1) {
        return res.status(403).json({ message: 'User has been block' })
    }
    if (!rolesRequired.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    req.user = user; // Attach user info to request object
    next(); // Proceed to next middleware
};

export { requireRoles };
