import esbuild from "esbuild"

const entryPoints = [
    'src/sw.js', 
    'src/scripts/scrapper.js', 
    'src/scripts/pop.js', 
    'src/scripts/scrapCandidate.js'
]

esbuild.build({
    entryPoints,
    watch: true,
    bundle: true,
    outdir: 'dist',
    minify: true,
    allowOverwrite: true
})
.then(response => console.log(JSON.stringify(response)))
.catch(err => console.log(err))