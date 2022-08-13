import { db } from "./config/conexion.dexie"

async function inyectScript(path, tabId){
    const options = {
        target: {tabId},
        files: [path]
    }
    return chrome.scripting.executeScript(options)
}

async function inyectScrapCandidates (tabId){
    return inyectScript("scripts/scrapCandidate.js", tabId)
}

chrome.action.onClicked.addListener((tab)=>{
    console.log('click')
    inyectScrapCandidates(tab.id)    
})

chrome.runtime.onConnect.addListener((port)=>{
    if(!(port.name === 'secureChannelScrap'))
        throw new Error('Not secure Channel')
    
    port.onMessage.addListener(async (msg, {sender: {tab: {id: tabId, url: tabUrl}}}) =>{
        console.log('🚀 ~ file: sw.js ~ line 14 ~ port.onMessage.addListener ~ error', msg);
        const originalUrlParams = new URLSearchParams(tabUrl.match(/\?.+/)[0].replace('?',''))
        const page = originalUrlParams.has('page') ? originalUrlParams.get('page') : 2

        //await chrome.tabs.update(tabId, {url: tabUrl+'$page='+page})

        db.urlsCandidate.add({
            urls : msg.urlsCandidate
        })

        const {id} = await chrome.tabs.create({url: msg.urlsCandidate[0]})

        inyectScript('scripts/scrapper.js')
  
        //inyectScrapCandidates(tabId)
    });
})