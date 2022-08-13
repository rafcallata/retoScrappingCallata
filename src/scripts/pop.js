import { $ } from "../utils/selectors";

$('search-form').addEventListener('submit', async (e)=>{
    e.preventDefault()
    const keyword = $('#to-search', e.target).value
    const url = 'https://www.linkedin.com/search/people/?keywords='+keyword
    const { id } = await chrome.tabs.create({url})

    const options = {
        target: { tabId: tab.id},
        files: ["scripts/scraCandidate.js"]
    }

    chrome.scripting.executeScript(options)
})