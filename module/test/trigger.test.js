const {Trigger} = require('../dao')
const {expect} = require('chai')


describe('Trigger Test', () => {

    let trigger = {_id: 'test_1'}

    it('Create', async () => {
        let expireAt = new Date()
        expireAt.setSeconds(expireAt.getSeconds() + 10)
        trigger.expireAt = expireAt
        let {ops} = await Trigger.insert(trigger)

        expect(ops[0]).not.to.equal(null)
    })

    it('Read', async () => {
        let test = await Trigger.find({_id: trigger._id})
        expect(test).not.to.equal(null)
        expect(test[0]._id).to.equal(trigger._id)
    })

    it('Update', async () => {
        let newExpireAt = new Date()
        newExpireAt.setSeconds(newExpireAt.getSeconds() + 10)
        let test1 = await Trigger.update({_id: trigger._id}, {$set: {expireAt: newExpireAt}})

        expect(test1.modifiedCount).to.equal(1)
    })

    it('Delete', async () => {
        let test = await Trigger.deleteOne({_id: trigger._id})

        expect(test.deletedCount).to.equal(1)
    })

    it('Expire Document', async function (done) {

        let expireAt = new Date()
        expireAt.setSeconds(expireAt.getSeconds() + 3)

        let triggerExpire = {_id: 'test_3', expireAt}

        let {ops} = await Trigger.insert(triggerExpire)

        expect(ops[0]).not.to.equal(null)

        setTimeout(async function(){
            const test = await Trigger.find({_id: triggerExpire._id})
            expect(test.length).to.equal(0)
            done()
        },10000)

    })
})
