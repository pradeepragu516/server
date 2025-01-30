// const http = require("http")

// const server = http.createServer((req,res) => {
//     res.end("jawahar mavaneeee")
// });
// const PORT= 8000;
// server.listen(PORT, () => {
//     console.log(`My server is running at http://localhost:${PORT}`);
// });

const express = require("express");//imported express
const app = express();//instance of express
app.use(express.json())//parsing the data
const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const PORT= 8000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
app.use(cor());


    //  const students=[
    //     {id:1,name:"pradeep"},
    //     {id:2,name:"sam"},
    //     {id:3,name:"majid"},
    //     {id:4,name:"pranesh kumareeee"},
    //     {id:5,name:"khalid"}
    //  ]
    

// app.get("/:id", (req, res) => {
//    const { id } = req.params;
//    if(id)
//    {
//       const result = students.find((item) => item.id==id)
//       res.json(result);
//    }else{
//     res.json(students);
//    }
// });

// app.get("/:name",(req,res)=>{
//     const {name} = req.params;

//     if(name){
//         const result = students.find((item)=>item.name===name)
//         res.json(result);
//     }
//     else{
//         res.json(students);
//     }
// });


const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true},
    title: { type: String, required: true},
    amount:{ type: Number, required:true},
});

const expenseModel = mongoose.model("expense-tracker", expenseSchema);// collection name, schema name


// app.post("/api/expenses", async (req, res) => {
//     const { title, amount} = req.body;
//     const newExpense = new expenseModel({
//         id: uuidv4(),
//         title: title,
//         amount: amount
//     });

//     const savedExpense = await newExpense.save();
//     res.status(200).json(savedExpense);
// });

//getby id
app.get("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const expense = await expenseModel.find({id});
    res.status(200).json(expense);
});

// //getby all
// app.get("/api/expenses", async (req, res) => {
//     const expense = await expenseModel.find().limit(2);
//     res.status(200).json(expense);
// });

//get by index
// app.get("/api/expenses/:index", async (req, res) => {
//     const { index } = req.params;
//     const expense = await expenseModel.find().skip(index-1).limit(2);
//     res.status(200).json(expense);
// });

//put operation
app.put("/api/expenses/:id", async (req, res) => {
        const { id } = req.params; 
        const { title, amount } = req.body;
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { 
               id:id ,
            },
            { 
                title : title, 
                amount : amount, 
            }
        );
        res.status(200).json(updatedExpense); 
    
});

app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const deleteExpense = await expenseModel.findAndDelete({id});
    console.log(deleteExpense);
    res.status(200).json(deleteExpense);
});

app.delete("/api/expense",async(req,res)=>{
    const deleteAll = await expenseModel.deleteMany();
    res.status(200).json(deleteAll);
});

/Authentication/

//Schema
const userSchema = new mongoose.Schema({
    username: {type:String,required:true,unique:true},
    password:{type:String,required:true},
    });

//Model
const User = mongoose.model("User",userSchema);

//Register api
app.post("/api/user/register",async(req,res)=>{
    const {username,password} = req.body;
//Validation
    if(!username || !password){
        return res.status(400).json({message:"Username is required"});
    }
//Check if user already exists
    const ExsistingUser = await User.find({username});
    if(!ExsistingUser){
        return res.status(400).json({message:"User already exists"});
    }
//Hash the password
    const hashedpass = await bcrypt.hash(password,8);

//Create new user
    const newUser = new User({
        username,
        password:hashedpass,
    })

    await newUser.save();

    return res.status(200).json({message:"User registered successfully"});
})

//Login api
app.post("/api/user/login",async(req,res)=>{
    const {username,password} = req.body;
//Validation
    if(!username || !password){
        return res.status(400).json({message:"Username and password is required"});
    }

//Check if user exists
    const user = await User.findOne({username});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
//Check if password is correct
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    
    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const secret = "learn_nodejs";
    const token = jwt.sign({username},secret,{expiresIn:"1h"});

    return res.status(200).json(
        {message:"Login successful",
        token:token,
        }
    );
    
})

//middleware process
function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
  
    if (!token) return res.status(401);
  
    jwt.verify(token, "learn_nodejs", (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  
  app.get("/api/user/getAll", authenticateToken, async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
  });


const mongourl = "mongodb+srv://pradeepragu:<db_password>@cluster0.15ndn.mongodb.net/practice"
mongoose.connect(mongourl) .then(() => {
    console.log("mongodb connected")
    app.listen(PORT, () => {
    console.log(`My server is running at http://localhost:${PORT}`);
    })

});