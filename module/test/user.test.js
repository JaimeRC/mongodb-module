const {User} = require('../dao')
const {expect} = require('chai')


describe('User Test', () => {

    before(async () => await User.injectDB(global.testClient))

    let result
    let user = {
        name: 'Jaime',
        year: 1984,
        major: 'Computer Science',
        address: {
            city: 'Malaga',
            street: 'Calle Marmoles'
        }
    }

    it('Create', async () => {
        let {ops} = await User.insertOne(user)
        result = ops[0]

        expect(result).not.to.equal(null)
    })

    it('Read', async () => {
        let test = await User.findOne({name: user.name})

        expect(test).not.to.equal(null)
        //expect(test.name).to.equal(result.name)
    })

    it('Update', async () => {
        let test = await User.updateOne({name: user.name}, {$set: {'address.city': 'Cartama'}})

        expect(test.modifiedCount).to.equal(1)
    })

    it('Delete', async () => {
        let test = await User.deleteOne({name: result.name})

        expect(test.deletedCount).to.equal(1)
    })

})