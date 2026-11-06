import { useState, useEffect} from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState('success')

  const fetchPersons = () => {
    personService
      .getAll()
      .then(initialPersons=> {
        setPersons(initialPersons)
      })
  }

  useEffect(fetchPersons, [])

  if(!persons) return null

  const addPerson = (event) =>{
    event.preventDefault()

    const existingPerson = persons.find(person => person.name.toLocaleLowerCase() === newName.toLocaleLowerCase())
    if(existingPerson){
      if(window.confirm(`${newName} is already added to phonebook. Update number?`)){
        updateNumber(existingPerson)
      }
    return
    }
    const personObject = {
    name: newName,
    number: newNumber
    }
    personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons([...persons, returnedPerson])
      setNewName('')
      setNewNumber('')
      setMessage('Succesfully added a person', 'success')
    }) 
    }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)

    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    personService
    .remove(id)
    .then( () => {
      setPersons(persons.filter(person => person.id !== id))
      setMessage('Succesfully removed person', 'success')
    })
    .catch(() => {
      notificationClass = 'error'
      setMessage(`${person.name} has already been removed`)
      setPersons(persons.filter(person => person.id !== id))
      
    })
  }

  const updateNumber = (person) => {
    const updatedPerson = { ...person, number: newNumber }
    personService
    .update(person.id, updatedPerson)
    .then(returnedPerson => {
      setPersons(
        persons.map(person =>
          person.id !== returnedPerson.id
            ? person
            : returnedPerson
      ))
      setNewName('')
      setNewNumber('')
      setMessage('Succesfully updated number', 'success')
    }).catch(() => {
      setMessage(`${person.name} has already been removed from the server`, 'error')
    })
  }

    const setMessage = (message, notificationClass) => {
    setNotificationClass(notificationClass)
    setNotificationMessage(
        message
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  } 

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  } 

  const handleFilterChange = (event) => {
    setSearchFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} style={notificationClass}/>
      <Filter text='filter shown with ' onChange={handleFilterChange} />
      <h2>add new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )

}

export default App