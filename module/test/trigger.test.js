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

    it('Expire Document', async () => {

        let expireAt = new Date()
        expireAt.setSeconds(expireAt.getSeconds() + 5)

        let triggerExpire = {_id: 'test_2', expireAt}

        let {ops} = await Trigger.insert(triggerExpire)

        expect(ops[0]).not.to.equal(null)

        const timeout = (fn, delay) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        fn();
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }, delay);
            });
        }

        return timeout(async () => {
            const test = await Trigger.find({_id: triggerExpire._id})
            expect(test.length).to.equal(0)
        }, 8000);
    })
})
