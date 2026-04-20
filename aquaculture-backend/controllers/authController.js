const db = require("../config/db");
const bcrypt = require("bcrypt");

// ================= REGISTER =================
exports.register = (req, res) => {

    let { username, email, password, confirmPassword, mobile } = req.body;

    // ✅ TRIM INPUTS
    username = username?.trim();
    email = email?.trim();
    mobile = mobile?.trim();

    // ✅ VALIDATION
    if (!username || !email || !password || !mobile) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match"
        });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `
        INSERT INTO users (username, email, password, mobile)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [username, email, hashedPassword, mobile], (err) => {

        if (err) {

            console.log("REGISTER ERROR:", err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    message: "Username or Email already exists"
                });
            }

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(201).json({
            message: "User registered successfully"
        });
    });
};


// ================= LOGIN =================
exports.login = (req, res) => {

    let { username, password } = req.body;

    username = username?.trim();

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password required"
        });
    }

    const sql = "SELECT * FROM users WHERE username=?";

    db.query(sql, [username], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // ✅ REMOVE PASSWORD BEFORE SENDING
        const { password: _, ...safeUser } = user;

        res.status(200).json({
            message: "Login successful",
            user: safeUser
        });

    });
};