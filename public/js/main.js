//creating a variable and assigning it to a selection of all elements with a class of trash can
const deleteBtn = document.querySelectorAll('.fa-trash')
//creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const item = document.querySelectorAll('.item span')
//creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from deleteBtn variable and iterate through each element and adds an event listener to each element
Array.from(deleteBtn).forEach((element)=>{
//when clicked it will call the deleteItem function    
    element.addEventListener('click', deleteItem)
})

// create an array from item variable and iterate though each element and add an event listener to each element
Array.from(item).forEach((element)=>{
// that when clicked it will call the deleteItem function    
    element.addEventListener('click', markComplete)
})

// create an array from itemCompleted variable and iterate though each element and add an event listener to each element
Array.from(itemCompleted).forEach((element)=>{
// that when clicked it will call the deleteItem function    
    element.addEventListener('click', markUnComplete)
})

//declares deleteItem() async function
async function deleteItem(){
//declares itemText variable and stores the text of the first child node of 'this' parent. The text should be the todo item.    
    const itemText = this.parentNode.childNodes[1].innerText
    try{
// create a variable that waits for a fetch via the /deleteItem route to get data from server.js response        
        const response = await fetch('deleteItem', {
//delete method is used to delete the item from the database.            
            method: 'delete',
//headers are used to tell the server what kind of data we are sending.            
            headers: {'Content-Type': 'application/json'},
// convert body of message to JSON string            
            body: JSON.stringify({
//sets the content of the body to the inner text of the list item, and naming it 'itemFromJS'                
              'itemFromJS': itemText
            })
          })
// create a variable that waits for server.js response and converts it JSON          
        const data = await response.json()
// prints response to the console        
        console.log(data)
//reloads(refreshes) the page, thereby generating another app.get request.        
        location.reload()

// if there is an error, pass the error message to catch block        
    }catch(err){
// print error message to the console        
        console.log(err)
    }
}

// create an asynchronous function for marking items complete
async function markComplete(){
//parentNode = li, childNode = span. From index.ejs. The innerText is whatever is added into the span. This function runs when the item span is clicked.     
    const itemText = this.parentNode.childNodes[1].innerText
    try{
// create a variable that waits for a fetch via the /markComplete route to get data from server.js response        
        const response = await fetch('markComplete', {
//setting the CRUD method to "update: for the route"            
            method: 'put',
//specifying the type of content expected, which is JSON            
            headers: {'Content-Type': 'application/json'},
// convert body of message to JSON string            
            body: JSON.stringify({
// set itemFromJS property to the itemText variable that hold the text of the first child in the parent element                
                'itemFromJS': itemText
            })
          })
// create a variable that waits for server.js response and converts it JSON          
        const data = await response.json()
//console.log(data) prints the data in the console        
        console.log(data)
//reloads(refreshes) the page, thereby generating another app.get request.        
        location.reload()

//if something goes wrong this code gives you an error message        
    }catch(err){
//the error message is logged to the console.        
        console.log(err)
    }
}

// create an asynchronous function for marking items uncomplete
async function markUnComplete(){
// create a variable that selects the text of the first child element in the parent element of what was clicked     
    const itemText = this.parentNode.childNodes[1].innerText
    try{
// create a variable that waits for a fetch via the /markUnComplete route to get data from server.js response        
        const response = await fetch('markUnComplete', {

// Update method is used to update the database            
            method: 'put',
//specifying the type of content expected, which is JSON            
            headers: {'Content-Type': 'application/json'},
// convert body of message to JSON string            
            body: JSON.stringify({
// set itemFromJS property to the itemText variable that hold the text of the first child in the parent element                
                'itemFromJS': itemText
            })
          })
// create a variable that waits for server.js response and converts it JSON          
        const data = await response.json()
//console log the response
        console.log(data)
//refresh the page triggering a new GET (READ) request
        location.reload()

// if there is an error, pass the error message to catch block        
    }catch(err){
// print error message to the console        
        console.log(err)
    }
}