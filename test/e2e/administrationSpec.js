'use strict';

describe('/#/administration', function () {

    describe('challenge "adminSection"', function () {

        it('should be possible to access administration section even when not authenticated', function () {
            browser.get('/#/administration');
            expect(browser.getLocationAbsUrl()).toMatch(/\/administration/);
        });

        protractor.expect.challengeSolved({challenge: 'adminSection'});

    });

    describe('challenge "fiveStarFeedback"', function () {

        protractor.beforeEach.login({email: 'jim@juice-sh.op', password: 'ncc-1701'});

        it('should be possible for any logged-in user to delete feedback', function () {
            browser.get('/#/administration');


            element.all(by.repeater('feedback in feedbacks')).first().element(by.css('.fa-trash')).click();
            browser.wait(protractor.ExpectedConditions.stalenessOf($('span[aria-valuenow="5"]')), 5000);
        });

        protractor.expect.challengeSolved({challenge: 'fiveStarFeedback'});

    });

});
