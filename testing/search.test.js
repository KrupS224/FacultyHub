const request = require('supertest');
const baseUrl = 'https://facultyhub.onrender.com';

jest.mock('../src/routers/searchFaculty');

describe("GET /search", () => {
    test("Should return status 200 and render the search page", async () => {
        const response = await request(baseUrl).get('/search');
        expect(response.status).toBe(200);
    });
});

describe("Search Functionality", () => {
    test('Empty search results display empty message', async () => {
        const response = await request(baseUrl).get('/search-faculty?course=Chemical+Engineering&university=DA-IICT');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Your search yielded no results.'); // Adjust this based on your actual empty message
    });

    test('Non-empty search results display data', async () => {
        const response = await request(baseUrl).get('/search-faculty?university=DA-IICT');
        expect(response.status).toBe(200);
        expect(response.text).not.toContain('Your search yielded no results.'); // Ensure the empty message is not present
    }, 10000);
});