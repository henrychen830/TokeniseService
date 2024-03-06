const Loki = require('lokijs');

class TokenRepository {
    constructor(dbName = 'cards.db') {
        this.db = new Loki(dbName, { autoload: true, autosave: true, autosaveInterval: 4000 });
    }

    // Get or create a collection
    getCollection(name) {
        let collection = this.db.getCollection(name);
        if (!collection) {
            collection = this.db.addCollection(name);
        }
        return collection;
    }

    // Insert a document into a collection
    insert(collectionName, doc) {
        const collection = this.getCollection(collectionName);
        return collection.insert(doc);
    }

    // Find one document in a collection
    findOne(collectionName, doc) {
        const collection = this.getCollection(collectionName);
        return collection.findOne(doc);
    }
}

module.exports = TokenRepository;