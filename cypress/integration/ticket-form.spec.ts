import { TICKET_FORM_DATA } from 'cypress/fixtures/data'
import { TicketFormData } from 'cypress/support/types'

describe('Two simple integration tests', () => {
    const fillForm = (formData: TicketFormData): void => {
        cy.get('#name').type(formData.name)
        cy.get('#email').type(formData.email)
        cy.get('#subject').type(formData.subject)
        cy.get('#message').type(formData.message)
    }
    it('successful submission of the ticket form', () => {
        cy.visit('/')
        fillForm(TICKET_FORM_DATA)
        cy.get('button').click()
        cy.intercept('POST', 'https://api.livechatinc.com/v2/tickets/new', {
            body: {
                id: 'ABCD',
            },
        })
        cy.get('.success').should('have.text', 'Thank you!')
    })
    it('unsuccessful submission of the ticket form', () => {
        cy.visit('/')
        fillForm(TICKET_FORM_DATA)
        cy.get('button').click()
        cy.intercept('POST', 'https://api.livechatinc.com/v2/tickets/new', {
            statusCode: 500,
            body: {
                error: 'Internal Server Error',
            },
        })
        cy.get('.fail').should('have.text', 'Error!')
    })
})
