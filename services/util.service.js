import fs from 'fs'
import http from 'http'
import https from 'https'

export const utilService = {
    readJsonFile,
    download,
    httpGet,
    makeId,
    makeLorem,
    debounce,
    throttle
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, (content) => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}

function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET'
    }

    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', (err) => {
            reject(err)
        })
        req.end()
    })

}

function makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}
function makeLorem(size = 100) {
    var words = ['sky', 'above', 'port', 'was', 'television', 'tuned', 'to', 'channel', 'All', 'happened', 'less',  'I', 'had', 'the story', 'bit', 'people', 'and', 'generally', 'happens', 'cases', 'time', 'it', 'was', 'story', 'It', 'was', 'pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function debounce(fn, wait) {
    let timerId
    return function (...args) {
        if (timerId) clearTimeout(timerId)
        timerId = setTimeout(() => {
            fn(...args)
        }, wait)
    }
}

function throttle(fn, wait) {
    let timer
    return function (...args) {
        if (timer) return
        timer = setTimeout(() => {
            fn(...args)
            timer = undefined
        }, wait)
    }
}