import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React
const { Link } = ReactRouterDOM


export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())


    useEffect(() => {
        loadBugs()
        showSuccessMsg('Welcome to bug index!')
      }, [filterBy])
    

      function loadBugs() {
        bugService.query(filterBy)
          .then(setBugs)
          .catch((err) => {
            console.log('Had issued in Bug Index:', err)
            showErrorMsg('Cannot get bugs')
          })
      }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                showErrorMsg('Cannot remove bug')
            })
    }


    function onSetFilter(filterBy) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
      }

    return (
        <main>
            <section className='info-actions'>
                <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
                <Link to="/bug/edit">Add Bug</Link>
            </section>
            <main>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug}  />
            </main>
        </main>
    )
}
