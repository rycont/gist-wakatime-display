import "https://deno.land/x/dotenv/load.ts";
  
;(async () => {
  const [WakaTimeURI, GistId, GithubToken] = ['WakaTimeURI', 'GistId', 'GithubToken'].map(Deno.env.get)
  console.log(WakaTimeURI, GistId, GithubToken)
  if (!(WakaTimeURI && GistId && GithubToken)) throw "Requierd env was not provided"
  
  const fetched = (await (await fetch(WakaTimeURI)).json()).data
  // console.log(fetched)
  const printified = fetched.map((e: {
    name: string,
    percent: number
  }, i: number) => `${((['🥇 ', '🥈 ', '🥉 '][i] || '') + e.name).padEnd(14, ' ')}${String(e.percent).padStart(6)}% ${'■'.repeat(Math.ceil(e.percent))}`).join('\n')
  fetch(`https://api.github.com/gists/${GistId}`, {
    headers: {
      'Authorization': `token ${GithubToken}`, 
    },
    body: JSON.stringify({
      "files": {
          "I Code...": {
          "content": `${printified}

Created from Deno with Github Actions!`
          }
      }
    }),
    method: 'PATCH'
  })
})()