const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); 
const expect = chai.expect;
const sinon = require('sinon') ;

chai.use(chaiHttp);

describe('Tokenisation Service', () => {
    let dbMock, collectionSpy;

    beforeEach(function() {
        const mockCollection = {
          insert: () => {},
          findOne: () => {}
        };

        collectionSpy = {
          insert: sinon.spy(mockCollection, 'insert'),
          findOne: sinon.spy(mockCollection, 'findOne')
        };

        dbMock = { addCollection: sinon.stub().returns(mockCollection) };
    });

    afterEach(function() {
        sinon.restore();
    });


    describe('POST /tokenise endpoint', () => {
        it('should tokenise string inputs', (done) => {
            // Arrange
            const request = ['Test String 1', 'Test String 2'];

            // Act
            // Assert
            chai.request(server)
                .post('/tokenize')
                .send(request)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body.length).equals(2);
                    done();
                });
        });

        [
            { expectedMessage: 'Card number is required', input: [] },
            { expectedMessage: 'Invalid card number', input: ['Short 1', 'Short 2'] },
        ].forEach(testCase => {
            it('should return 400 bad request response with error message', () => {
                // Act
                // Assert
                chai.request(server)
                .post('/tokenize')
                .send(testCase.input)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.text).equals(testCase.expectedMessage);
                });
            });
        });
    });

    describe('POST /detokenise endpoint', () => {
        [
            { expectedStatusCode: 400, expectedMessage: 'Token is required', input: [] },
            { expectedStatusCode: 404, expectedMessage: 'Token Short 1 not found', input: ['Short 1', 'Short 2'] },
        ].forEach(testCase => {
            it('should return bad request response with error message', () => {
                chai.request(server)
                .post('/detokenize')
                .send(testCase.input)
                .end((_, res) => {
                    expect(res).to.have.status(testCase.expectedStatusCode);
                    expect(res.text).equals(testCase.expectedMessage);
                });
            });
        });
    });
});