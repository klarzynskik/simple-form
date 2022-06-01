import { TestConfig } from '../fixtures/testConfig'
import { PageObject } from '../fixtures/pageObjects'
import responseOk from '../fixtures/responseOk.json'
import responseError from '../fixtures/responseError.json'

describe('submission', () => {
    const pageObject = new PageObject()
    const testConfig = new TestConfig()

    beforeEach(() => {
        cy.visit('/')
        cy.get(pageObject.NAME_FIELD_pathID).type(testConfig.validName)
        cy.get(pageObject.EMAIL_FIELD_pathID).type(testConfig.validEmail)
        cy.get(pageObject.SUBJECT_FIELD_pathID).type(testConfig.validSubject)
        cy.get(pageObject.MESSAGE_FIELD_pathID).type(testConfig.validMessage)
    })

    it('Successful', function () {
        // Arrange
        cy.intercept('POST', 'https://api.livechatinc.com/v2/tickets/new', {
            statusCode: 200,
            fixture: 'responseOk.json',
        }).as('stub')

        // Act
        cy.get('button').click()

        // Assert
        cy.wait('@stub')
            .its('response')
            .should('deep.include', {
                statusCode: 200,
                body: {
                    id: responseOk.id,
                },
            })
    })

    it('Unsuccessful', function () {
        // Arrange
        cy.intercept('POST', 'https://api.livechatinc.com/v2/tickets/new', {
            statusCode: 500,
            fixture: 'responseError.json',
        }).as('stub')

        // Act
        cy.get('button').click()

        // Assert
        cy.wait('@stub')
            .its('response')
            .should('deep.include', {
                statusCode: 500,
                body: {
                    error: responseError.error,
                },
            })
    })
})
