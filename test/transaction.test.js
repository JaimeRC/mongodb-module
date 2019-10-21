const {Transactions,User,Address} = require('../dao')
const {expect} = require('chai')


describe('Transactions Test', () => {

    before(async () => {
        await Transactions.injectDB(global.nixi1Client)
        await User.injectDB(global.nixi1Client)
        await Address.injectDB(global.nixi1Client)
    })

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
        console.log(result)
        // expect(result).not.to.equal(null)
    })

})