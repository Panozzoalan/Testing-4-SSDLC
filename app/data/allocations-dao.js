const UserDAO = require("./user-dao").UserDAO;

const AllocationsDAO = function(db){

    "use strict";

    if (false === (this instanceof AllocationsDAO)) {
        console.log("Warning: AllocationsDAO constructor called without 'new' operator");
        return new AllocationsDAO(db);
    }

    const allocationsCol = db.collection("allocations");
    const userDAO = new UserDAO(db);

    this.update = (userId, stocks, funds, bonds, callback) => {
        const parsedUserId = parseInt(userId);

        // Create allocations document
        const allocations = {
            userId: userId,
            stocks: stocks,
            funds: funds,
            bonds: bonds
        };

        allocationsCol.update({
            userId: parsedUserId
        }, allocations, {
            upsert: true
        }, err => {

            if (!err) {

                console.log("Updated allocations");

                userDAO.getUserById(userId, (err, user) => {

                    if (err) return callback(err, null);

                    // add user details
                    allocations.userId = userId;
                    allocations.userName = user.userName;
                    allocations.firstName = user.firstName;
                    allocations.lastName = user.lastName;

                    return callback(null, allocations);
                });
            }

            return callback(err, null);
        });
    };

    this.getByUserIdAndThreshold = (userId, threshold, callback) => {
        const parsedUserId = parseInt(userId);

        const searchCriteria = () => {

            if (threshold) {
                return {
                    $where: `this.userId == ${parsedUserId} && this.stocks > '${threshold}'`
                };
            }
            return {
                userId: parsedUserId
            };
        }

        allocationsCol.find(searchCriteria()).toArray((err, allocations) => {
            if (err) return callback(err, null);
            if (!allocations.length) return callback("ERROR: No allocations found for the user", null);

            let doneCounter = 0;
            const userAllocations = [];

            allocations.forEach( alloc => {
                userDAO.getUserById(alloc.userId, (err, user) => {
                    if (err) return callback(err, null);

                    alloc.userName = user.userName;
                    alloc.firstName = user.firstName;
                    alloc.lastName = user.lastName;

                    doneCounter += 1;
                    userAllocations.push(alloc);

                    if (doneCounter === allocations.length) {
                        callback(null, userAllocations);
                    }
                });
            });
        });
    };

}

module.exports.AllocationsDAO = AllocationsDAO;
