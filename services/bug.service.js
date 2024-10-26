import fs from "fs"
import { utilService } from "./util.service.js"
import { loggerService } from "./logger.service.js"

const bugs = utilService.readJsonFile("data/bug.json")
const PAGE_SIZE = 3

export const bugService = {
  query,
  getById,
  remove,
  save,
}

function query(filterBy) {
  return Promise.resolve(bugs).then((bugs) => {
    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, "i")
      bugs = bugs.filter((bug) => regex.test(bug.txt))
    }
    if (filterBy.severity) {
      bugs = bugs.filter((bug) => bug.severity >= filterBy.severity)
    }
    if (filterBy.desc) {
      const regex = new RegExp(filterBy.desc, "i")
      bugs = bugs.filter((bug) => regex.test(bug.desc))
    }
    if (filterBy.labels) {
        const regex = new RegExp(filterBy.labels, "i")
        filteredBugs = filteredBugs.filter((bug) => bug.labels.some(label => regex.test(label)))
      }
    if (filterBy.pageIdx !== undefined) {
      const startIdx = +filterBy.pageIdx * PAGE_SIZE
      bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return bugs
  })
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject(`Cannot find bug with id ${bugId}`)
    return Promise.resolve(bug)
}

function remove(bugId) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
  bugs.splice(bugIdx, 1)
  return _saveBugsToFile()
}

function save(bug) {
  if (bug._id) {
    const idx = bugs.findIndex((currBug) => currBug._id === bug._id)
    bugs[idx] = { ...bugs[idx], ...bug }
  } else {
    bug._id = utilService.makeId()
    bug.description = utilService.makeLorem()
    bug.createdAt = Date.now()
    bug.labels = [utilService.makeLorem(1),utilService.makeLorem(1)]
    bugs.unshift(bug)
  }
  return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2)
    fs.writeFile("data/bug.json", data, (err) => {
      if (err) {
        loggerService.error("Cannot write to bugs file", err)
        return reject(err)
      }
      console.log("The file was saved!")
      resolve()
    })
  })
}
