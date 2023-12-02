const request = require('supertest');
const baseUrl = 'https://facultyhub.onrender.com';

const pagesWithoutAuthorization = [
    '/',
    '/forgotlink',
    '/search',
    '/signin',
    '/signup',
    '/university',
    '/signup/verifyotp',
];

const pagesWithAuthorization = [
    '/admin-profile/6560566bf9ee98b289119a01',
    '/change-password',
    '/addfaculty',
    '/faculty-profile/6560568cf9ee98b289119a0a',
];

const describePageTests = (pages, status) => {
    describe(`GET Pages ${status} Authorization`, () => {
        for (const page of pages) {
            test(`Should return status ${status} for ${page}`, async () => {
                const response = await request(baseUrl).get(page);
                expect(response.status).toBe(status);
            }, 10000);
        }
    });
};

describePageTests(pagesWithoutAuthorization, 200);
describePageTests(pagesWithAuthorization, 302);