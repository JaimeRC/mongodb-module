const Transactions = require('./Transactions'),
    User = require('./User.dao'),
    Address = require('./Address.dao'),
    Action = require('./Action.dao'),
    Trigger = require('./Trigger.dao')


module.exports = {
    User,
    Address,
    Transactions,
    Trigger,
    Action
}
