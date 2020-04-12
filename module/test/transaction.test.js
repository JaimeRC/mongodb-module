const {Transactions,User,Address} = require('../dao')
const {expect} = require('chai')


describe('Transactions Test', () => {

    let result
    let user = {
        name: 'Jaime',
        year: 1984,
        major: 'Computer Science',
        address: null
    }
    let address = {address: 'Calle marmoles', number: 5, user: null, city: 'Malaga'}


    it('createUserWithAddress', async () => {
        let result = await Transactions.createUserWithAddress(user, address)

         expect(result).not.to.equal(null)
    })

})
