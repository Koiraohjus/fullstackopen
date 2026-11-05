import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / total
  const positivePercentage = (good / total) * 100

  return (
    <div>
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={total} />
          <StatisticsLine text="average" value={average.toFixed(2)} />
          <StatisticsLine text="positive" value={`${positivePercentage.toFixed(2)}%`} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const onGoodClick = () =>{
    setGood(good + 1)
  }

  const onNeutralClick = () =>{
    setNeutral(neutral + 1)
  }

  const onBadClick = () =>{
    setBad(bad + 1)

  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={onGoodClick} text="good" />
      <Button onClick={onNeutralClick} text="neutral" />
      <Button onClick={onBadClick} text="bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App