const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')
const person = require('./models/person')

const app = express()
//Lukee HTTP-pyynnon JSON-datan ja laittaa sen request.body-muuttujaan
app.use(express.json())
app.use(express.static('dist'))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})


app.get('/info',(request, response) => {
    const dateTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${dateTime}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons =>{
    response.json(persons)
  })
}) 

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
     if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name){
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
    if(!body.number){
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    Person.findOne({
      name: body.name
    })
      .then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })

})

app.put('/api/persons/:id', (request, response) => {
  const{name, number} = request.body
  
  if(!number){
        return response.status(400).json({ 
            error: 'number cannot be empty' 
    })
  }
  const person = {
    name,
    number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(person.params.id).then(() =>{
      response.status(204).end()
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})