// imports the express module in Node.js 
const express = require('express')
// initialize server using express module
const app = express()
// import the MongoClient module class from the mongodb module 
const MongoClient = require('mongodb').MongoClient
// declares a constant variable and assigns the value to 2121
const PORT = 2121
// loads the configuration from a .env file into the Node.js
require('dotenv').config()

//declaring the database variable, the connection to the string from the .env file and the db name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
 // This code establishes a connection to a MongoDB server using the MongoClient from the MongoDB driver.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// will handle the resolved promise and the successful connection to the MongoDB server.
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// sets the view engine for the Express application to use EJS as the template engine.   
app.set('view engine', 'ejs')
//This line tells our app to use the public folder for static files.This means that all of the files in our public folder are served up automatically.
app.use(express.static('public'))
// This line tells our app to use the body-parser middleware. This is how we can get the data from the text.
app.use(express.urlencoded({ extended: true }))
// This will automatically parses the JSON payload of incoming requests and populates the req.body property with the parsed data
app.use(express.json())

// Add a custom request handler to the 'GET' method of the '/' path.
app.get('/',async (request, response)=>{
//declaring a todoItems variable and putting the todos collection into an array    
    const todoItems = await db.collection('todos').find().toArray()
//declaring a itemsLeft variable and putting the documents that are not completed in it    
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// Tell express to render the 'index.ejs' view with the options of the 'todoItems' and 'itemsLeft' variables, which EJS will use as variables in the view.    
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Add a custom request handler to the 'POST' method of the '/addTodo' path.
app.post('/addTodo', (request, response) => {
// When someone adds a Todo using the client-side form, the app.post method goes to the 'todos' collection, inserts the new Todo using the MongoDB .insertOne method and then refreshes the client-side (leading to a new app.get request) so that the new Todo is listed along with the previous Todos.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
//then we console log so we can make sure that the item is added, and then we refresh    
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
//making sure we catch an error if there is one    
    .catch(error => console.error(error))
})

// Add a custom request handler to the 'PUT' method of the '/markComplete' path.
app.put('/markComplete', (request, response) => {
// Access the 'todos' collection from the connected database, calling 'updateOne' with a filter object containing the property 'thing' set to the value of the 'request.body.itemFromJS' property - parsed by the 'json' middleware.    
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// UpdateFilter containing the '$set' Update Operator, telling MongoDB to setting the 'completed' property to 'true'.        
        $set: {
            completed: true
          }
    },{
//additional options to the update operation ,sorting the most recently added documents first        
        sort: {_id: -1},
//setting the upsert to false specifies to not create a new document if there is no matching document found        
        upsert: false
    })
//then we console log to make sure the update was successful, and we send a json to inform the client the update was successful
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
//if error occurs during the update it will be logged to the console    
    .catch(error => console.error(error))

})

// Add a custom request handler to the 'PUT' method of the '/markUnComplete' path.
app.put('/markUnComplete', (request, response) => {
//accessing the todos collection and telling it to perform an update, the first argument is to match the thing to the itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// UpdateFilter containing the '$set' Update Operator, telling MongoDB to setting the 'completed' property to 'false'.
        $set: {
            completed: false
          }
    },{
//sorts the ids n descending order, meaning most recently added ones are first       
        sort: {_id: -1},
//if there is not matching document to not create one        
        upsert: false
    })
//then we console log marked complete to make sure it is updated and send a json response to the client    
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
//if error occurs during the update it will be logged to the console    
    .catch(error => console.error(error))

})

// Add a custom request handler to the 'DELETE' method of the '/deleteTodo' path.
app.delete('/deleteItem', (request, response) => {
// goes to the database collection, uses the .deleteOne method to delete the item which was clicked, then the page is refreshed with the deleted item not showing any longer.     
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
//console log todo deleted message to make sure we performed the method correctly        
        console.log('Todo Deleted')
//sending json response with a message to do deleted        
        response.json('Todo Deleted')
    })
//if error occurs during the update it will be logged to the console    
    .catch(error => console.error(error))

})

// Start the server listening on either the PORT provided by the environment variable or the default port stored in the PORT variable.
app.listen(process.env.PORT || PORT, ()=>{
//logging a message to the console to indicate that the server is running on the port with the number we put in the port variable    
    console.log(`Server running on port ${PORT}`)
})