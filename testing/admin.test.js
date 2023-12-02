const request = require('supertest');
const baseUrl = 'https://facultyhub.onrender.com';
const Admin = require('../src/models/admin');

jest.mock('../src/models/admin');

