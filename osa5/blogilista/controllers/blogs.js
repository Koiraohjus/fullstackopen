const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if(blog) response.json(blog)
  else response.status(404).end()
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = await request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const {
    title,
    author,
    url,
    likes
  } = request.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
  if(updatedBlog) response.json(updatedBlog)
  else response.status(404).end()
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if(!blog){
    response.status(404).end()
  }
  const user = request.user

  if (blog.user.toString() !== user.id) {
    return response.status(401).json({
      error: 'user not authorized'
    })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter