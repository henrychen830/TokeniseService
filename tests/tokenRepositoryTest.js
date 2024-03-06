const chai = require('chai');
const sinon = require('sinon');
const Loki = require('lokijs');
const TokenRepository = require('../TokenRepository'); // Update the path as necessary

const expect = chai.expect;

describe('TokenRepository', () => {
    let dbMock;
    let collectionMock;
    let tokenRepository;

    beforeEach(() => {
        collectionMock = {
            insert: sinon.stub(),
            findOne: sinon.stub(),
            addCollection: sinon.stub(),
            getCollection: sinon.stub()
        };

        dbMock = sinon.stub(Loki.prototype, 'addCollection').returns(collectionMock);
        sinon.stub(Loki.prototype, 'getCollection').callsFake(name => {
            if (name === 'existingCollection') {
                return collectionMock;
            }
            return null;
        });

        tokenRepository = new TokenRepository('test.db');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('getCollection should create a new collection if it does not exist', () => {
        // Arrange
        // Act
        const newCollection = tokenRepository.getCollection('newCollection');

        // Assert
        expect(dbMock.calledWith('newCollection')).to.be.true;
        expect(newCollection).to.deep.equal(collectionMock);
    });

    it('getCollection should return existing collection', () => {
        // Arrange
        // Act
        const existingCollection = tokenRepository.getCollection('existingCollection');

        // Assert
        expect(collectionMock.getCollection.calledWith('existingCollection')).to.be.false; // Because it directly returns collectionMock in our stub
        expect(existingCollection).to.deep.equal(collectionMock);
    });

    it('insert should add a document to a collection', () => {
        // Arrange
        const doc = { cardNumber: 'Test String', token: 'Test Token' };

        // Act
        tokenRepository.insert('existingCollection', doc);

        // Assert
        expect(collectionMock.insert.calledWith(doc)).to.be.true;
    });

    it('findOne should retrieve a document from a collection', () => {
        // Arrange
        const doc = { cardNumber: 'Test String' };
        collectionMock.findOne.withArgs(doc).returns({ cardNumber: 'Test String', token: 'Test Token' });

        // Act
        const result = tokenRepository.findOne('existingCollection', doc);

        // Assert
        expect(collectionMock.findOne.calledWith(doc)).to.be.true;
        expect(result).to.deep.equal({ cardNumber: 'Test String', token: 'Test Token' });
    });
});

