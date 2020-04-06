const {Action} = require('../dao')
const {expect} = require('chai')


describe('Action Test', () => {

    before(async () => await Action.injectDB(global.testClient))

    let action = {
        action: 'test_application',
        nextLunch: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    it('Create', async () => {
        let {ops} = await Action.insertOne(action)

        expect(ops[0]).not.to.equal(null)
    })

    it('Read', async () => {
        let test = await Action.findOne({action: action.action})

        expect(test).not.to.equal(null)
        expect(test.action).to.equal(action.action)
    })

    it('Update', async () => {
        let test1 = await Action.updateOne({action: action.action}, {$inc: {nextLunch: 10}})

        expect(test1.modifiedCount).to.equal(1)

        let test2 = await Action.findOne({action: action.action})

        expect(test2).to.equal(20)
    })

    it('Delete', async () => {
        let test = await Action.deleteOne({action: action.action})

        expect(test.deletedCount).to.equal(1)
    })

})
