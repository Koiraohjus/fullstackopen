const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = await new User({ username: 'Jorkkeli', passwordHash }).save()

  token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET
  )

  await Blog.insertMany(
    helper.initialBlogs.map(b => ({ ...b, user: user._id }))
  )
})

describe('when there are initial blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(e => e.title)
    assert.strictEqual(title.includes('testi blogi'), true)
  })

})

describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    assert.deepStrictEqual(resultBlog.body, processedBlogToView)
  })

})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {

    const newBlog = {
      'title': 'Uusi blogi',
      'author': 'Koiraohjus',
      'url': 'kohjus.fi',
      'likes': 666,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Uusi blogi'))
  })

  test('Blog without a title cannot be added', async () => {
    const newBlog = {
      'title': '',
      'author': 'Koiraohjus',
      'url': 'kohjus.fi',
      'likes': 666
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsResponse = await api.get('/api/blogs')

    assert.strictEqual(blogsResponse.body.length, helper.initialBlogs.length)

  })

  test('Blog without a URL cannot be added', async () => {
    const newBlog = {
      'title': 'Joku blogi',
      'author': 'Koiraohjus',
      'url': '',
      'likes': 666
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)

  })
})

describe('default values are used', () => {
  test('If likes are not set, default value of 0 is used', async () => {
    const newBlog = {
      'title': 'Joku blogi',
      'author': 'Koiraohjus',
      'url': 'https://jee.com'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })
})

describe('deletion of a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(b => b.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

})

after(async () => {
  await mongoose.connection.close()
})
