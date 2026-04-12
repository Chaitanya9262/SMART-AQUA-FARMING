const db = require("../config/db");

// LOGIN FUNCTION
exports.login = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: result[0]
        });

    });
};



// REGISTER FUNCTION
exports.register = (req,res)=>{

const {name,email,password,mobile} = req.body;

const sql = "INSERT INTO users(name,email,password,mobile) VALUES(?,?,?,?)";

db.query(sql,[name,email,password,mobile],(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json({message:"User registered successfully"});

});
};

