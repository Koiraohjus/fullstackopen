import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  //Lähettä GET-pyynnon ja tallentaa Promisen muuttujaan request
  const request = axios.get(baseUrl)
  //Odottaa vastaustausta ja palauttaa vain datan
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove}