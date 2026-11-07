const express = require('express')
const morgan = require('morgan')

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

const app = express()
//Lukee HTTP-pyynnon JSON-datan ja laittaa sen request.body-muuttujaan
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-3334444"
  },
  {
    id: "2",
    name: "Joku Tyyppi",
    number: "040-1234567"
  },
  {
    id: "3",
    name: "Sipuli Kontio",
    number: "040-9876543"
  },
  {
    id: "4",
    name: "Koira Ohjus",
    number: "040-5556666"
  }
]

app.get('/info',(request, response) => {
    const dateTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${dateTime}</p>`)
})

app.get('/api/persons', (request, response) =>{
    response.json(persons)
}) 

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else {
        response.status(404).end()
    }
})

const generateId = () => {
    return String(Math.floor(Math.random() * 100000))
}

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
    }if(persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())){
        return response.status(400).json({ 
            error: 'name must be unique' 
    })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = [...persons, person]
    response.json(person)

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)