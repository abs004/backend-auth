const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    // 1. Read Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    // 4. Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // 5. Attach decoded payload to req.user
        req.user = decoded;

        // 6. next()
        next();
    });
};

module.exports = protect;