const express = require("express");
const Todo = require("../models/todo.js");
const { userAuth } = require("../middleware/auth.js");

const router = express.Router();


// creating todos
router.post("/todos", userAuth, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = new Todo({
      title,
      description,
      completed,
      userId: req.user._id,
    });
    await todo.save();
    console.log(todo);
   return res.status(201).json(todo);
  } catch (error) {
    return res.status(400).send("Error: " + error.message);
  }
});

// get all todos

router.get("/todos",userAuth,async(req,res) => {
  try{
   const todos= await Todo.find({userId:req.user._id})
   console.log(todos);
   return res.send(todos)
  }
  catch(error){
    return res.status(400).send("Error: "+error.message)
  }
})


router.get("/todos/:id",userAuth,async(req,res) => {
  try {
    const todos=await Todo.findOne({
      _id:req.params.id,
      userId:req.user._id
    });
    if(!todos){
      return res.status(404).send("todo not found")
    }
    console.log(todos)
    return res.status(200).send(todos)
  } catch (error) {
    return res.status(400).send("Error: "+error.message)
  }
})


router.patch("/todos/:id",userAuth,async(req,res) => {
  const data=req.body;
  try{
    const todo=await Todo.findOneAndUpdate({
      _id:req.params.id,
      userId:req.user._id
    },data,{
     new:true,
      runValidators: true,
    })
    if(!todo){
      return res.status(404).send("todo not found")
    }
    console.log(todo)
    return res.json(todo)
  }
  catch(error){
    return res.status(400).send("Error: "+error.message)
  }
})

router.delete("/todos/:id",userAuth,async(req,res) =>{
  try{
   const todo=await Todo.findOneAndDelete({
    _id:req.params.id,
    userId:req.user._id
   })
   if(!todo){
    return res.status(404).send("todo not found")
  }
  console.log(todo)
    return res.send("deleted successfully")
  }
  catch(error){
    return res.status(400).send("Error: "+error.message)
  }
})



module.exports=router;