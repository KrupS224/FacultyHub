const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../src/models/admin'); // Adjust the path accordingly
const Faculty = require('../src/models/faculty'); // Adjust the path accordingly

describe('Admin Model Constraints', () => {
    it('should not save an admin without required fields', async () => {
        try {
            const admin = new Admin({});
            await admin.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            const errors = error.errors;

            // Check for specific validation errors
            expect(errors.name).toBeDefined();
            expect(errors.university).toBeDefined();
            expect(errors.email).toBeDefined();
            expect(errors.password).toBeDefined();
            expect(errors.phone).toBeDefined();
            expect(errors.address).toBeDefined();
        }
    });

    it('should not save an admin with an invalid email format', async () => {
        try {
            const admin = new Admin({
                name: 'John Doe',
                university: 'Example University',
                email: 'invalid-email',
                password: 'password123',
                phone: 1234567890,
                address: '123 Main Street',
            });
            await admin.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.email).toBeDefined();
        }
    });

    it('should not save an admin with a phone number less than 10 characters', async () => {
        try {
            const admin = new Admin({
                name: 'John Doe',
                university: 'Example University',
                email: 'john-doe@email.com',
                password: '1234567',
                phone: 123456789,
                address: '123 Main Street',
            });
            await admin.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error);
            expect(error).toBeDefined();
        }
    }, 11000);

    it('should not save an admin with a phone number more than 10 characters', async () => {
        try {
            const admin = new Admin({
                name: 'John Doe',
                university: 'Example University',
                email: 'john-doe@email.com',
                password: '1234567',
                phone: 12345678910111,
                address: '123 Main Street',
            });
            await admin.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error);
            expect(error).toBeDefined();
        }
    }, 11000);
});


describe('Faculty Model Constraints', () => {
    it('should not save a faculty without required fields', async () => {
        try {
            const faculty = new Faculty({});
            await faculty.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            const errors = error.errors;

            // Check for specific validation errors
            expect(errors.name).toBeDefined();
            expect(errors.institute).toBeDefined();
            expect(errors.email).toBeDefined();
            expect(errors.password).toBeDefined();
        }
    });

    it('should not save a faculty with an invalid email format', async () => {
        try {
            const faculty = new Faculty({
                name: 'John Doe',
                institute: 'Example University',
                email: 'invalid-email',
                password: 'password123',
                contactNo: 1234567890,
                address: '123 Main Street',
            });
            await faculty.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.email).toBeDefined();
        }
    });

    it('should not save a faculty without name', async () => {
        try {
            const faculty = new Faculty({
                name: '',
                institute: 'Example University',
                email: 'faculty123@email.com',
                password: 'password123',
                contactNo: 1234567890,
                address: '123 Main Street',
            });
            await faculty.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error);
            expect(error).toBeDefined();
        }
    });

    it('should not save a faculty without institute', async () => {
        try {
            const faculty = new Faculty({
                name: 'John Doe',
                university: '',
                email: 'faculty123@email.com',
                password: 'password123',
                contactNo: 1234567890,
                address: '123 Main Street',
            });
            await faculty.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error);
            expect(error).toBeDefined();
        }
    });

    it('should not save a faculty without password', async () => {
        try {
            const faculty = new Faculty({
                name: 'John Doe',
                university: 'Example University',
                email: 'faculty123@email.com',
                password: '',
                contactNo: 1234567890,
                address: '123 Main Street',
            });
            await faculty.save(); // This should throw an error
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error);
            expect(error).toBeDefined();
        }
    });
});
