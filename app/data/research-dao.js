function ResearchDAO(db) {

    "use strict";

    if (false === (this instanceof ResearchDAO)) {
        console.log("Warning: ResearchDAO constructor called without 'new' operator");
        return new ResearchDAO(db);
    }

    this.getBySymbol = (symbol, callback) => {

        const searchCriteria = () => {

            if (symbol) {
                console.log("in if symbol");
                return {
                    symbol
                };
            }
        }
    }
}

module.exports = { ResearchDAO };
