const puppeteer = require('puppeteer')

const BASE_URL = 'https://10fastfingers.com/typing-test'

const USER = 'bathanggayk18@gmail.com'
const PASS = '123456789'

/**
 * @param {Millisecond} time
 */
function delay(time) {

    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

/**
 * Random INT in range (min, max)
 * Using for adjust WPM (Words per min)
 * @param {Millisecond} min
 * @param {Millisecond} max
 */
function getRandomInt(min, max) {

    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min) + min)
}

(async() => {

        // Display browser
        const browser = await puppeteer.launch({headless: false})
        console.log('Browser opened');

        // Access to BASE_URL and wait for loaded
        const page = await browser.newPage();
        await page.goto(BASE_URL, {
            waitUntil: 'networkidle0',
        });

        await page.setViewport({ width: 1540, height: 880});

        console.log('Page loaded');

        // System login

        // Wait for loaded
        await page.click("div.col-md-6.col-sm-8.col-xs-12 div.btn-group a.btn.btn-primary")
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });

        const usn = await page.$('#UserEmail')
        const psw = await page.$('#UserPassword')

        await usn.type(USER)
        await psw.type(PASS)

        // Wait for loaded
        await page.click("#login-form-submit")
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });

        // Box type text and array of words
        const searchBox = await page.$('#inputfield')
        const wordsHTML = await page.$$('#row1')

        // Array of words
        let words = []

        for(let i = 0; i < wordsHTML.length; i++){

            const text = await page.evaluate(element => element.innerText, wordsHTML[i])
            words.push(text)
        }

        words = words[0].split(' ')
        console.log(words)

        for(let i = 0; i < words.length; i++){

            // Check end time (1 min): appear a dialog
            const endSign = await page.$('#result-table')
            if(endSign) break

            await searchBox.type(words[i])
            await searchBox.press(String.fromCharCode(32))

            // Random delay each word
            await delay(getRandomInt(350, 850))
        }
})();