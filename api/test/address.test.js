const {Address} = require('../dao')
const {expect} = require('chai')


describe('Address Test', () => {

    before(async () => await Address.injectDB(global.testClient))

    let address = {name: 'Calle marmoles', address: null}
    let result


    it('Create', async () => {
        let {ops} = await Address.insertOne(address)
        result = ops[0]
        expect(result).not.to.equal(null)
    })

    it('Read', async () => {
        let test = await Address.findOne({name: address.name})

        expect(test).not.to.equal(null)
        expect(test.name).to.equal(result.name)

    })

    it('Update', async () => {
        let test = await Address.updateOne({name: address.name}, {$set: {address: 'test_2'}})

        expect(test.modifiedCount).to.equal(1)
    })

    it('Delete', async () => {
        let test = await Address.deleteOne({name: result.name})

        expect(test.deletedCount).to.equal(1)
    })

})