const request = require('supertest');
const baseUrl = 'https://facultyhub.onrender.com';
const Admin = require('../src/models/admin');
const SigninCount = require('../src/models/signinCount');
const lockUser = require('../src/models/lockUser');

jest.mock('../src/models/admin');  // Mock the entire module
jest.mock('../src/models/signinCount');
jest.mock('../src/models/lockUser');
jest.mock('../src/functions/otpFunctions');


// test cases for signin page
describe("GET /signin", () => {
    test("Should return status 200 and render the signin page", async () => {
        const response = await request(baseUrl).get('/signin');
        expect(response.status).toBe(200);
    });
});

describe("POST /signin", () => {

    test("Should return status 200 and set access token cookie on successful sign-in", async () => {
        const mockUser = {
            email: 'krups224@gmail.com',
            verified: 1,
            password: 'Daiict@224',
        };

        const mockSigninCount = {
            ip: '127.0.0.1',
            email: 'krups224@gmail.com',
            count: 0,
        };

        Admin.findOne.mockResolvedValue(mockUser);
        SigninCount.findOne.mockResolvedValue(mockSigninCount);

        const response = await request(baseUrl)
            .post('/signin')
            .send({
                role: 'admin',
                username: 'krups224@gmail.com',
                password: 'Daiict@224',
            });

        expect(response.status).toBe(302);
        expect(response.header['set-cookie']).toBeTruthy();
    });

    test("Should return an alert message for invalid details", async () => {
        // Mock the database response for invalid credentials
        Admin.findOne.mockResolvedValue(null);

        // Make the request with invalid credentials
        const response = await request(baseUrl)
            .post('/signin')
            .send({
                role: 'admin',
                username: 'invalid@example.com',
                password: 'invalidpassword',
            });

        // Assert the expected outcomes
        expect(response.status).toBe(401);
        // expect(response.text).toContain('Invalid Details');
    });

    const testCases = [
        {
            description: 'Missing role field',
            requestBody: {
                username: 'krups224@gmail.com',
                password: 'Daiict@224',
            },
        },
        {
            description: 'Missing username field',
            requestBody: {
                role: 'admin',
                password: 'Daiict@224',
            },
        },
    ];

    for (const testCase of testCases) {
        test(`Should return status 401 for ${testCase.description}`, async () => {
            const response = await request(baseUrl)
                .post('/signin')
                .send(testCase.requestBody);

            // Assert the expected outcome
            expect(response.status).toBe(401);
            // expect(response.text).toContain('Invalid Details');
        });
    }
});


// test cases for unlock account page