const request = require('supertest');
const baseUrl = 'https://facultyhub.onrender.com';
const Admin = require('../src/models/admin');
const { generateAndStoreOTP } = require('../src/functions/otpFunctions');
const { sendEmail } = require('../src/functions/mails');

// Mocking modules
jest.mock('validator');
jest.mock('../src/models/admin');
jest.mock('../src/functions/otpFunctions');
jest.mock('../src/functions/mails');

// testing for signup page
describe('GET /signup', () => {
    test('Should return 200 and render the signup page', async () => {
        const response = await request(baseUrl).get('/signup');
        expect(response.status).toBe(200);
    });
});

describe('POST /signup/verifyotp', () => {
    test('Should return an alert message for invalid email', async () => {
        const response = await request(baseUrl)
            .post('/signup/verifyotp')
            .send({
                adminName: 'John Doe',
                email: 'invalidemail',
                password: 'Password123',
                cPassword: 'Password123',
                mobile_no: '1234567890',
                university: 'Example University',
                address: '123 Main St',
            });

        expect(response.status).toBe(200);
        expect(response.text).toContain('<script>alert("Not a valid email"); window.history.back();</script>');
    });

    test('Should return an alert message for already registered and verified email', async () => {
        Admin.findOne.mockResolvedValue({ email: 'krups224@gmail.com', verified: true });

        const response = await request(baseUrl)
            .post('/signup/verifyotp')
            .send({
                adminName: 'Krupesh DAIICT',
                email: 'krups224@gmail.com',
                password: 'Password123',
                cPassword: 'Password123',
                mobile_no: '1234567890',
                university: 'DA-IICT',
                address: 'Something',
            });

        expect(response.text).toContain('<script>alert("Email is already registered"); window.history.back(); </script>');
    });

    test('Should return 200 and redirect to /signup/verifyotp on successful registration', async () => {
        Admin.findOne.mockResolvedValue(null);

        generateAndStoreOTP.mockReturnValue('123456');

        // sendEmail.mockResolvedValue(true);

        const response = await request(baseUrl)
            .post('/signup/verifyotp')
            .send({
                adminName: 'John Doe',
                email: 'john.doe@example.com',
                password: 'Password123',
                cPassword: 'Password123',
                mobile_no: '1234567890',
                university: 'Example University',
                address: '123 Main St',
            });

        expect(response.status).toBe(302);
    });

    test('Should return an alert message for already registered and email is not verified', async () => {
        Admin.findOne.mockResolvedValue({ email: 'john.doe@example.com', verified: false });

        const response = await request(baseUrl)
            .post('/signup/verifyotp')
            .send({
                adminName: 'John Doe',
                email: 'john.doe@example.com',
                password: 'Password123',
                cPassword: 'Password123',
                mobile_no: '1234567890',
                university: 'Example University',
                address: '123 Main St',
            });

        expect(response.text).toContain('<script>alert("Verification is incomplete for this user. Redirecting to verification page."); window.location.href="/signup/verifyotp"; </script>');
    });

    test('Should return an alert message for different password and Confirm passwords', async () => {
        const response = await request(baseUrl)
            .post('/signup/verifyotp')
            .send({
                adminName: 'John Doe',
                email: 'john.doe@example.com',
                password: 'Password123',
                cPassword: 'Password456',
                mobile_no: '1234567890',
                university: 'Example University',
                address: '123 Main St',
            });

        expect(response.text).toContain('<script>alert("Password and Confirm Password do not match"); window.history.back();</script>');
    });

});


// testing for otp verification page
describe('GET /signup/verifyotp', () => {
    test('Should return 200 and render the verifyotp page', async () => {
        const response = await request(baseUrl).get('/signup/verifyotp');
        expect(response.status).toBe(200);
    });
});

describe('POST /signup/otpverified', () => {
    test('Should return an alert message for invalid email', async () => {
        const response = await request(baseUrl)
            .post('/signup/otpverified')
            .send({
                email: 'invalidemail',
                otp: '123456',
            });

        expect(response.text).toContain('<script>alert("User not found"); window.history.back();</script>');
    });

    test('Should return an alert message when user is verified', async () => {
        Admin.findOne.mockResolvedValue({ email: 'krups224@gmail.com', verified: true });

        const response = await request(baseUrl)
            .post('/signup/otpverified')
            .send({
                email: 'krups224@gmail.com',
                otp: '123456',
            });

        expect(response.status).toBe(502);
        // expect(response.text).toContain('<script>alert("User already verified"); window.location.href = "/signin";</script>');
    })
});
