describe('', () => {
    it('a', () => {
        cy.visit('/')
        cy.get('#name').type('a')
        cy.get('#email').type('b@b.pl')
        cy.get('#subject').type('c')
        cy.get('#message').type('d')
        cy.get('button').click()
        cy.intercept('POST', 'https://api.livechatinc.com/v2/tickets/new', {
            statusCode: 500,
            body: {
                error: 'Internal Server Error',
            },
        })
    })
})
