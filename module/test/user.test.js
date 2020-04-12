const {User, Address} = require('../dao')
const {expect} = require('chai')


describe('User Test', () => {

    let result
    let user = {
        name: 'Jaime',
        year: 1984,
        major: null,
        address: ''
    }

    it('Create', async () => {
        const {ops:address} = await Address.insertOne({name: 'Calle marmoles', address: {city:'Malaga'}})

        user.address = address[0]._id

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
        let test = await User.updateOne({name: user.name}, {$set: {major: 'Computer Science'}})

        expect(test.modifiedCount).to.equal(1)
    })

    it('Delete', async () => {
        let test = await User.deleteOne({name: result.name})

        expect(test.deletedCount).to.equal(1)
    })

})
