import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { BugFilter } from "../cmps/BugFilter.jsx"
import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

export function BugIndex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [bugs, setBugs] = useState(null)
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(searchParams)
  )

  useEffect(() => {
    showSuccessMsg("Welcome to bug index!")
  }, [])

  useEffect(() => {
    setSearchParams(filterBy)
    loadBugs()
  }, [filterBy])

  const debouncedFilterBy = useRef(utilService.debounce(onSetFilter, 300))

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => {
      if (prevFilter.pageIdx !== undefined) prevFilter.pageIdx = 0
      return { ...prevFilter, ...fieldsToUpdate }
    })
  }

  function togglePagination() {
    setFilterBy((prevFilter) => {
      return {
        ...prevFilter,
        pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined,
      }
    })
  }

  function onChangePage(diff) {
    if (filterBy.pageIdx === undefined) return

    setFilterBy((prevFilter) => {
      let nextPageIdx = prevFilter.pageIdx + diff
      if (nextPageIdx < 0) nextPageIdx = 0

      return { ...prevFilter, pageIdx: nextPageIdx }
    })
  }

  function loadBugs() {
    bugService
      .query(filterBy)
      .then((bugs) => setBugs(bugs))
      .catch((err) => {
        console.log("Had issued in Bug Index:", err)
        showErrorMsg("Cannot get bugs")
      })
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg(`Bug removed successfully (${bugId})`)
      })
      .catch((err) => {
        console.log("Had issues removing car", err)
        showErrorMsg(`Could not remove (${bugId})`)
      })
  }

  function onUpdateBug(bugToUpdate) {
    bugService
      .save(bugToUpdate)
      .then((savedBug) => {
        setBugs((prevBugs) =>
          prevBugs.map((bug) => (bug._id === savedBug._id ? savedBug : bug))
        )
        showSuccessMsg(`Bug updated successfully (${bugToUpdate.id})`)
      })
      .catch((err) => {
        console.log("Had issues with updating bug", err)
        showErrorMsg(`Could not update bug (${bugToUpdate.id})`)
      })
  }

  const { txt, severity, label } = filterBy
  if (!bugs) return <div>loading...</div>

  return (
    <main>
      <section className="info-actions">
        <BugFilter
          onSetFilter={debouncedFilterBy.current}
          filterBy={{ txt, severity, label }}
        />
        <Link to="/bug/edit">Add Bug</Link>
      </section>
      <section>
        <button onClick={togglePagination}>Toggle Pagination</button>
        <button onClick={() => onChangePage(-1)}>-</button>
        {filterBy.pageIdx + 1 || "No Pagination"}
        <button onClick={() => onChangePage(1)}>+</button>
      </section>
      <main>
        <BugList
          bugs={bugs}
          onRemoveBug={onRemoveBug}
          onUpdateBug={onUpdateBug}
        />
      </main>
    </main>
  )
}
