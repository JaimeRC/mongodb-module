const {Trigger} = require('../dao')
const {expect} = require('chai')


describe('Trigger Test', () => {

    let trigger = {},
        result
    before(async () => {
        await Trigger.injectDB(global.testClient)
        let expireAt = new Date()
        expireAt.setSeconds(expireAt.getSeconds() + 10)
        trigger = {expireAt}
    })


    it('Create', async () => {
        let {ops} = await Trigger.insert(trigger)

        expect(ops[0]).not.to.equal(null)
    })

    it('Read', async () => {
        let test = await Trigger.find({expireAt: trigger.expireAt})

        expect(test).not.to.equal(null)
        expect(test.expireAt).to.equal(trigger.expireAt)
    })

    it('Update', async () => {
        let test1 = await Trigger.update({expireAt: trigger.expireAt}, {$inc: {expireAt: 10}})

        expect(test1.modifiedCount).to.equal(1)

        let test2 = await Trigger.find({expireAt: 15})

        expect(test2).not.to.equal(null)
    })

    it('Delete', async () => {
        let test = await Trigger.deleteOne({_id: result._id})

        expect(test.deletedCount).to.equal(1)
    })

    it('Expire Document', async (done) => {

        let expireAt = new Date()
        expireAt.setSeconds(t.getSeconds() + 5)

        let triggerExpire = {expireAt}

        let {ops} = await Trigger.insert(triggerExpire)

        expect(ops[0]).not.to.equal(null)

        setTimeout(async () => {
            let test = await Trigger.findOne({triggerExpire})
            expect(test).to.equal(null)
            done()
        }, 10000)
    })
})
