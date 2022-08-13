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
    const secureChannels = ['secureChannelScrap', 'secureChannelScrapProfile']
    if(!secureChannels.includes(port.name))
        throw new Error('Not secure Channel')
    
    switch (port.name) {
        case secureChannels[0]:{
            port.onMessage.addListener(async (msg, {sender: {tab: {id: tabId, url: tabUrl}}}) =>{
                console.log('🚀 ~ file: sw.js ~ line 14 ~ port.onMessage.addListener ~ error', msg);
                const originalUrlParams = new URLSearchParams(tabUrl.match(/\?.+/)[0].replace('?',''))
                const page = originalUrlParams.has('page') ? originalUrlParams.get('page') : 2
        
                //await chrome.tabs.update(tabId, {url: tabUrl+'$page='+page})
        
                db.urlsCandidate.add({
                    urls : msg.urlsCandidate
                })
        
                const {id} = await chrome.tabs.create({url: msg.urlsCandidate[0]})
        
                inyectScript('scripts/scrapper.js', id)
                //inyectScript('scripts/scrapper.js')
          
                //inyectScrapCandidates(tabId)
            });
            break;}
        case secureChannels[1]:{
            port.onMessage.addListener(async ({profile}, {sender : {tab: {id: tabId}}}) =>{                        
                db.profiles.add(profile)
                const {urlsRaw} = await db.urlsCandidate.toArray()
                await chrome.tabs.update(tabId, {url: urlsRaw.urls[1]})
                inyectScript('scripts/scrapper.js', tabId)
            });
            break;}
        default:
            break;
    }
})