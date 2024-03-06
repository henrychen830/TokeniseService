const { expect } = require('chai');
const sinon = require('sinon') ;
const TokeniseService = require('../tokeniseService');

describe('TokeniseService', () => {
    let dbRepoMock, collectionSpy;

    beforeEach(() => {
        dbRepoMock = {
            getCollection: () => {},
            insert: () => {},
            findOne: () => {}
        };

        collectionSpy = {
            getCollection: sinon.spy(dbRepoMock, 'getCollection'),
            insert: sinon.spy(dbRepoMock, 'insert'),
            findOne: sinon.spy(dbRepoMock, 'findOne')
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('tokenise', () => {
        it('should return a new tokenised string and store in db', () => {
            // Arrange
            const tokeniseService = new TokeniseService(dbRepoMock);
            const inputString = "Test String";
            const expectedPrefix = "U2FsdGVkX1";
    
            // Act
            const token = tokeniseService.tokenise(inputString);
            
            // Assert
            expect(token).to.include(expectedPrefix);
            expect(collectionSpy.insert.called).to.be.true;
        });
    
        it('should return an existing tokenised string found in db', () => {
            // Arrange
            const inputString = "Test String";
            const expectedToken = "Test Token";
            dbRepoMock = { 
                insert: () => {},
                findOne: () => { return { cardNumber: inputString, token: expectedToken }; }
            };
            collectionSpy = {
                insert: sinon.spy(dbRepoMock, 'insert'),
                findOne: sinon.spy(dbRepoMock, 'findOne')
            };
            const tokeniseService = new TokeniseService(dbRepoMock);
    
            // Act
            const result = tokeniseService.tokenise(inputString);
            
            // Assert
            expect(result).equals(expectedToken);
            expect(collectionSpy.insert.called).to.be.false;
        });
    });

    describe('detokenise', () => {
        it('should return detokenised string from matching token found in db', () => {
            // Arrange
            const token = "U2FsdGVkX1/CIHg0JqHj18LajD3YusY9xuMNRhgEAfs=";
            const expectedString = "Test String";
            const dbRepoMock = {
                insert: () => {},
                findOne: () => { return { cardNumber: expectedString, token: token } }
            };
            const tokeniseService = new TokeniseService(dbRepoMock);

            // Act
            const result = tokeniseService.detokenise(token);

            // Assert
            expect(result).equals(expectedString);
        });

        it('should return null if no matching token found in db', () => {
            // Arrange
            const token = "Test Token";
            const tokeniseService = new TokeniseService(dbRepoMock);

            // Act
            const result = tokeniseService.detokenise(token);

            // Assert
            expect(result).is.null;
        });
    });
});