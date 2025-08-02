import jwt from 'jsonwebtoken'; // Import the jwt module

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).send({ message: 'Session expired' });
        req.user = user;
        next();
    });
}

export default authenticateToken; // Ensure you export this function
