import express from "express"
import cookieParser from "cookie-parser"
import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        }).catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    loggerService.debug('req.query', req.query)

    const { title, description, severity, _id } = req.query

    const bug = {
        _id,
        title,
        description,
        severity: +severity,
    }

    bugService.save(bug)
        .then((savedBug) => {
            res.send(savedBug)
        }).catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })

})



app.get('/api/bug/:bugId/remove', (req, res) => {
    console.log('req.params:', req.params)
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send('Removed!')
        }).catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})


app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    console.log('req.cookies:', req.cookies)

    const { visitedBugs = [] } = req.cookies 

    console.log('visitedBugs', visitedBugs)

    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
        else visitedBugs.push(bugId)

        console.log('visitedBugs', visitedBugs)
        res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })
    }


    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
            })
})

const PORT = 3030

app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)

