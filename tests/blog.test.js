const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./help_test')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Promise.all(helper.initialBlog.map((blog) => new Blog(blog).save()))
})

test('note are retourned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('default identifiant id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('add new blog', async () => {
  const newblogs = {
    title: 'bienvenu sur mon nouveau blog',
    author: 'mfendem daina',
    url: 'http://mfendemdaina.com',
    likes: 1000,
  }

  await api
    .post('/api/blogs')
    .send(newblogs)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const title = response.body.map((e) => e.title)
  assert(title.includes('bienvenu sur mon nouveau blog'))
  assert.strictEqual(response.body.length, helper.initialBlog.length + 1)
})

test('new block without url and title', async () => {
  const newblogs = {
    author: 'mfendem daina',
    likes: 1000,
  }

  await api
    .post('/api/blogs')
    .send(newblogs)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlog.length)
})

test('verification of like proprieties', async () => {
  const newblogs = {
    title: 'bienvenu sur mon nouveau blog',
    author: 'mfendem daina',
    url: 'http://mfendemdaina.com',
  }
  const response = await api.post('/api/blogs').send(newblogs).expect(201)

  assert.strictEqual(response.body.likes, 0)
})
describe('delection of blog', () => {
  test('succeeds with status 204 if id is valid', async () => {
    const blogAtStart = await helper.blogInDb()
    const blogToDelete = blogAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogAtEnd = await helper.blogInDb()

    const titles = blogAtEnd.map((n) => n.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogAtEnd.length, helper.initialBlog.length - 1)
  })
})

test('update of blog', async () => {
  const nlikes = 100

  const blogToStar = await helper.blogInDb()
  const blogToUpdate = blogToStar[0]
  blogToUpdate.likes = nlikes

  await api.put(`/api/blogs/${blogToUpdate.id}`)
  const blogAtEnd = await helper.blogInDb()
  const likes = blogAtEnd.map((n) => n.likes)

  assert(!likes.includes(blogToUpdate.title))
  assert.strictEqual(blogAtEnd.length, helper.initialBlog.length)
})

after(async () => {
  await mongoose.connection.close()
})
