    import express from "express"
    import cookieParser from "cookie-parser"
    import { bugService } from "./services/bug.service.js"
    import { loggerService } from "./services/logger.service.js"

    const app = express()

    app.use(express.static('public'))
    app.use(cookieParser())
    app.use(express.json())


    //bug LIST
    app.get('/api/bug', (req, res) => {
        const { txt = '', severity = '0', description = '',label = '' , pageIdx , sortBy, sortDir = 1 } = req.query

        const filterBy = {
            txt,
            description,
            severity: +severity,
            label,
            pageIdx,
            sortBy, 
            sortDir : +sortDir
        }
        bugService.query(filterBy)
            .then(bugs => {
                res.send(bugs)
            }).catch((err) => {
                loggerService.error('Cannot get bugs', err)
                res.status(400).send('Cannot get bugs')
            })
    })

    //bug READ
    app.get('/api/bug/:id', (req, res) => {
        const  bugId  = req.params.id

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

    //bug CREATE
    app.post('/api/bug', (req, res) => {
        const bugToSave = {
            title: req.body.title,
            description: req.body.description,
            severity: +req.body.severity,
        }
        bugService.save(bugToSave)
            .then(bug => res.send(bug))
            .catch((err) => {
                loggerService.error('Cannot save bug', err)
                res.status(400).send('Cannot save bug')
            })
    })

    //bug UPDATE
    app.put('/api/bug', (req, res) => {
        const bugToSave = {
            title: req.body.title,
            description: req.body.description,
            severity: +req.body.severity,
            _id: req.body._id
        }
        bugService.save(bugToSave)
            .then(bug => res.send(bug))
            .catch((err) => {
                loggerService.error('Cannot save bug', err)
                res.status(400).send('Cannot save bug')
            })
    })


    //bug DELETE
    app.delete('/api/bug/:id', (req, res) => {
        const  bugId  = req.params.id
        bugService.remove(bugId)
            .then(() => {
                loggerService.info(`Bug ${bugId} removed`)
                res.send((bugId))
            }).catch(err => {
                loggerService.error('Cannot get bug', err)
                res.status(400).send('Cannot get bug')
            })
    })



    const PORT = 3030

    app.listen(PORT, () =>
        loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
    )

