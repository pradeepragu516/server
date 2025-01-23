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


app.post("/api/expenses", async (req, res) => {
    const { title, amount} = req.body;
    const newExpense = new expenseModel({
        id: uuidv4(),
        title: title,
        amount: amount
    });

    const savedExpense = await newExpense.save();
    res.status(200).json(savedExpense);
});

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

const mongourl = "mongodb+srv://pradeepragu:Pradeep.ragu16@cluster0.15ndn.mongodb.net/test"
mongoose.connect(mongourl) .then(() => {
    console.log("mongodb connected")
    app.listen(PORT, () => {
    console.log(`My server is running at http://localhost:${PORT}`);
    })

});