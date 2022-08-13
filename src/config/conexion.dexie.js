import Dexie from "dexie";

export const db = new Dexie('myDatabase');
db.version(1).stores({
    urlsCandidate: '++id, urls',
});

db.version(1).stores({
    profiles: '++id, name, contactInfo, experienceTitles, educationTitles'
})