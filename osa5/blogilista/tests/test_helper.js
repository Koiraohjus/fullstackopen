const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'testi blogi',
    'author': 'Joku Tyyppi',
    'url': 'kohjus.fi',
    'likes': 72
  },
  {
    'title': 'toinen blogi',
    'author': 'Joku toinen Tyyppi',
    'url': 'kohjus.fi',
    'likes': 99
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    'title': 'toinen blogi',
    'author': 'Joku toinen Tyyppi',
    'url': 'kohjus.fi',
    'likes': 99
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}