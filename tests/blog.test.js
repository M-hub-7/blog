const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const api = supertest(app)

const initialBlog = [
  {
    title: 'mon blog de test',
    author: 'camine queen',
    url: 'caminequeen@gmail.com',
    likes: 20,
  },
  {
    title: 'mon blog de test',
    author: 'camine queen',
    url: 'caminequeen@gmail.com',
    likes: 20,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlog)
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
    console.log(blog.id)
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

after(async () => {
  await mongoose.connection.close()
})
