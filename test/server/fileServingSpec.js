/*jslint node: true */

var frisby = require('frisby');

var URL = 'http://localhost:3000';

frisby.create('GET index.html when visiting application URL')
    .get(URL)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('Juice Shop')
    .toss();

frisby.create('GET index.html when visiting application URL with any path')
    .get(URL + "/whatever")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('Juice Shop')
    .toss();

frisby.create('GET /ftp serves a directory listing')
    .get(URL + "/ftp")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<title>listing directory /ftp</title>')
    .toss();

frisby.create('GET a non-existing Markdown file in /ftp will return a 404 error')
    .get(URL + "/ftp/doesnotexist.md")
    .expectStatus(404)
    .toss();

frisby.create('GET a non-existing PDF file in /ftp will return a 404 error')
    .get(URL + "/ftp/doesnotexist.pdf")
    .expectStatus(404)
    .toss();

frisby.create('GET a non-existing file in /ftp will return a 403 error for invalid file type')
    .get(URL + "/ftp/doesnotexist.exe")
    .expectStatus(403)
    .toss();

frisby.create('GET an existing file in /ftp will return a 403 error for invalid file type .gg')
    .get(URL + "/ftp/eastere.gg")
    .expectStatus(403)
    .toss();

frisby.create('GET existing file /ftp/coupons_2013.md.bak will return a 403 error for invalid file type .bak')
    .get(URL + "/ftp/coupons_2013.md.bak")
    .expectStatus(403)
    .toss();

frisby.create('GET existing file /ftp/package.json.bak will return a 403 error for invalid file type .bak')
    .get(URL + "/ftp/package.json.bak")
    .expectStatus(403)
    .toss();

frisby.create('GET the confidential file in /ftp')
    .get(URL + "/ftp/acquisitions.md")
    .expectStatus(200)
    .expectBodyContains('# Planned Acquisitions')
    .toss();

frisby.create('GET the easter egg file by using an encoded Poison Null Byte attack with .pdf suffix')
    .get(URL + "/ftp/eastere.gg%2500.pdf")
    .expectStatus(200)
    .expectBodyContains('Congratulations, you found the easter egg!')
    .toss();

frisby.create('GET the easter egg file by using an encoded Poison Null Byte attack with .md suffix')
    .get(URL + "/ftp/eastere.gg%2500.md")
    .expectStatus(200)
    .expectBodyContains('Congratulations, you found the easter egg!')
    .toss();

frisby.create('GET the 2013 coupon code file by using an encoded Poison Null Byte attack with .pdf suffix')
    .get(URL + "/ftp/coupons_2013.md.bak%2500.pdf")
    .expectStatus(200)
    .expectBodyContains('n<MibgC7sn')
    .toss();

frisby.create('GET the 2013 coupon code file by using an encoded Poison Null Byte attack with .md suffix')
    .get(URL + "/ftp/coupons_2013.md.bak%2500.md")
    .expectStatus(200)
    .expectBodyContains('n<MibgC7sn')
    .toss();

frisby.create('GET the 2013 coupon code file by appending md_debug parameter with value fulfilling filename validation')
    .get(URL + "/ftp/coupons_2013.md.bak?md_debug=.pdf")
    .expectStatus(200)
    .expectBodyContains('n<MibgC7sn')
    .toss();

frisby.create('GET the package.json file does not fall for appending md_debug parameter with value fulfilling filename validation')
    .get(URL + "/ftp/package.json.bak?md_debug=.md")
    .expectStatus(403)
    .toss();

frisby.create('GET the package.json file by using an encoded Poison Null Byte attack with .pdf suffix')
    .get(URL + "/ftp/package.json.bak%2500.pdf")
    .expectStatus(200)
    .expectBodyContains('"name": "juice-shop",')
    .toss();

frisby.create('GET the package.json file by using an encoded Poison Null Byte attack with .md suffix')
    .get(URL + "/ftp/package.json.bak%2500.md")
    .expectStatus(200)
    .expectBodyContains('"name": "juice-shop",')
    .toss();

frisby.create('GET a restricted file directly from file system path on server by tricking route definitions fails with 403 error')
    .get(URL + "/ftp///eastere.gg")
    .expectStatus(403)
    .toss();

frisby.create('GET a restricted file directly from file system path on server by appending URL parameter fails with 403 error')
    .get(URL + "/ftp/eastere.gg?.md")
    .expectStatus(403)
    .toss();

frisby.create('GET a restricted file directly from file system path on server via Directory Traversal attack loads index.html instead')
    .get(URL + "/public/images/../../ftp/eastere.gg")
    .expectStatus(200)
    .expectBodyContains('<h1 class="hidden">OWASP Juice Shop</h1>')
    .toss();

frisby.create('GET a restricted file directly from file system path on server via URL-encoded Directory Traversal attack loads index.html instead')
    .get(URL + "/public/images/%2e%2e%2f%2e%2e%2fftp/eastere.gg")
    .expectStatus(200)
    .expectBodyContains('<h1 class="hidden">OWASP Juice Shop</h1>')
    .toss();

frisby.create('GET an accessible file directly from file system path on server')
    .get(URL + "/ftp/legal.md")
    .expectStatus(200)
    .expectBodyContains('# Legal Information')
    .toss();

frisby.create('GET an accessible markdown file directly from file system path on server with md_debug parameter')
    .get(URL + "/ftp/legal.md?md_debug=true")
    .expectStatus(200)
    .expectBodyContains('# Legal Information')
    .toss();

frisby.create('GET a non-existing file via direct server file path /ftp will return a 404 error')
    .get(URL + "/ftp/doesnotexist.md")
    .expectStatus(404)
    .toss();

frisby.create('GET the second easter egg by visiting the hidden URL')
    .get(URL + "/the/devs/are/so/funny/they/hid/an/easter/egg/within/the/easter/egg")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<title>Welcome to Planet Orangeuze</title>')
    .toss();

frisby.create('GET Geocities theme CSS is accessible directly from file system path')
    .get(URL + "/css/geo-bootstrap/swatch/bootstrap.css")
    .expectStatus(200)
    .expectBodyContains('Designed and built with all the love in the world @twitter by @mdo and @fat.')
    .toss();

frisby.create('GET tracking image for "Score Board" page access challenge')
    .get(URL + "/public/images/tracking/scoreboard.png")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'image/png')
    .toss();

frisby.create('GET tracking image for "Administration" page access challenge')
    .get(URL + "/public/images/tracking/administration.png")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'image/png')
    .toss();

frisby.create('GET tracking background image for "Geocities Theme" challenge')
    .get(URL + "/public/images/tracking/microfab.gif")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'image/gif')
    .toss();