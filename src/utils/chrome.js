export async function inyectScript(path, tabId) {
    const options = {
        target: {tabId},
        files: [path]
    };
    return chrome.scripting.executeScript(options)
}

export async function inyectScrapCandidates (tabId) {
    return inyectScript("scripts/scrapCandidate.js", tabId)
}
export async function deleteAndCreateTab(oldId, url) {
    try {
        chrome.tabs.remove(oldId);

        const { id } = await chrome.tabs.create( { url });
        return id;
        
    } catch (error) {
        console.log('🚀 ~ chrome.js ~ line 20 ~ deleteAndCreateTab ~ error', error);
        throw error;
    }
}