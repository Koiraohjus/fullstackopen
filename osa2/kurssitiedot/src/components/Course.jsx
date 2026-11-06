const Course = ({course}) =>{
  return(
    <>
    <Header name={course.name}/>
    <Content parts={course.parts}/>
    </>
  )
}

const Header = ({name}) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <Total parts={parts}/>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part.name} {props.part.exercises}</p>
    </div>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)
  return (
    <div>
      <p><strong>Total of {total} exercises</strong></p>
    </div>
  )
}

export default Course