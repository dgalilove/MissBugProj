import express from "express"
import { bugService } from "./services/bug.service.js"
const app = express()

app.get('/api/bug', (req, res) => {
    bugService.query()
    .then((bugs) => res.send(bugs))
    .catch(err => res.status(500).send("Cannot get bugs"))
})

app.get("/api/bug/save", (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity : +req.query.severity,
        createdAt : +req.query.createdAt
    }
  bugService.save(bugToSave)
  .then((savedBug) => res.send(savedBug))
    .catch(res.status(500).send("Cannot save bug"))
})

app.get("/api/bug/:bugId", (req, res) => {
  const { bugId } = req.params
  bugService.getById(bugId)
  .then((bug) => res.send(bug))
  .catch(res.status(500).send("Cannot get bug"))
})

app.get("/api/bug/:bugId/remove", (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
    .then(() => res.send(`Bug ${bugId} removed successfully!`))
    .catch(res.status(500).send("Cannot get bug"))
})

app.get("/", (req, res) => res.send("Hello theres"))
app.listen(3030, () => console.log("Server ready at port 3030"))