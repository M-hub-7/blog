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
  await Promise.all(initialBlog.map((blog) => new Blog(blog).save()))
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
  assert.strictEqual(response.body.length, initialBlog.length + 1)
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

  assert.strictEqual(response.body.length, initialBlog.length)
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

after(async () => {
  await mongoose.connection.close()
})
