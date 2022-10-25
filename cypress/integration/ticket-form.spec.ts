// Your tests go in here. Happy coding! 🤓

describe('Ticket Form', () => {
    const licence_id = 13329102
    const testName = 'Test Name'
    const testEmail = 'test@email.com'
    const testSubject = 'Test Subject'
    const testMessage = 'Test Message'

    beforeEach(() => {
        cy.visit('/')
    })

    it('User receives Thank you! message after submitting the form with valid values', () => {
        cy.intercept('POST', '/v2/tickets/new', {
            statusCode: 200,
            body: {
                id: 'ABCD',
            },
        }).as('createTicket')

        cy.get('#name').type(testName)
        cy.get('#email').type(testEmail)
        cy.get('#subject').type(testSubject)
        cy.get('#message').type(testMessage)
        cy.contains('button', 'Submit').click()

        cy.wait('@createTicket').then((interception) => {
            expect(interception.request.body).to.deep.include({
                group: 0,
                licence_id: licence_id,
                requester: {
                    name: testName,
                    mail: testEmail,
                },
                subject: testSubject,
                offline_message: testMessage,
                ticket_message: testMessage,
                visitor_id: testEmail,
            })
        })
        cy.get('h1').should('contain', 'Thank you!')
    })

    it('User receives error message if submit request fails', () => {
        cy.intercept('POST', '/v2/tickets/new', {
            statusCode: 500,
            body: {
                error: 'Internal server error',
            },
        })

        cy.get('#name').type(testName)
        cy.get('#email').type(testEmail)
        cy.get('#subject').type(testSubject)
        cy.get('#message').type(testMessage)
        cy.contains('button', 'Submit').click()

        cy.get('h1').should('contain', 'Error!')
    })
})
