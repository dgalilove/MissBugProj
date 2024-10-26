const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }
  function handleChange({ target }) {
    let { value, name: field, type } = target
    if (type === "number") value = +value
    setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
  }

  const { txt, severity , label} = filterByToEdit
  return (
    <section className="bug-filter full main-layout">
      <form onSubmit={onSubmitFilter}>
        <label htmlFor="txt">Text:</label>
        <input
          value={txt}
          onChange={handleChange}
          name="txt"
          id="txt"
          type="text"
          placeholder="By Text"
        />

        <label htmlFor="severity">Severity:</label>
        <input
          value={severity}
          onChange={handleChange}
          type="number"
          name="severity"
          id="severity"
          placeholder="By Severity"
        />
        <label htmlFor="desc">Label : </label>
        <input
          type="text"
          id="label"
          name="label"
          value={label}
          onChange={handleChange}
          placeholder="By label"
        />

        <button>Filter Bugs</button>
      </form>
    </section>
  )
}
