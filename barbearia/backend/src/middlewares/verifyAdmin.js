import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;

export const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        
    }
}