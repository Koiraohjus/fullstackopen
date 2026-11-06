import Person from './Person'

const Persons = ({persons, deletePerson}) => {
  return(
    <>
      {persons.map(person => <Person 
                              key={person.id} 
                              name={person.name} 
                              number={person.number} 
                              deletePerson={() => deletePerson(person.id)}/>)}
    </>
  )
}

export default Persons