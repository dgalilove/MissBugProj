

const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyBug,
    getDefaultFilter,
    getFilterFromParams
}


function query(filterBy = getDefaultFilter()) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
            }

            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            if (filterBy.label) {
                const regExp = new RegExp(filterBy.label, 'i')
                bugs = bugs.filter(bug => bug.labels.some(label => regExp.test(label)))
            }
            return bugs
        })
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err)
        })
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}


function save(bug){
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        txt: searchParams.get('txt') || defaultFilter.txt,
        severity: searchParams.get('severity') || defaultFilter.severity,
    }
}


function getEmptyBug() {
    return { title: '', description: '', severity: 5 }
}

function getDefaultFilter() {
    return { txt: '', severity: '' , label:'' }
}





