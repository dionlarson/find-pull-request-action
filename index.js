'use strict'

const core = require('@actions/core')
const { GitHub, context } = require('@actions/github')

const main = async () => {
  const token = core.getInput('github-token')
  const branch = core.getInput('branch')
  const base = core.getInput('base')
  const author = core.getInput('author')

  const query = {
    ...context.repo,
    state: 'open'
  }
  if (branch) {
    query.head =
      branch.indexOf(':') === -1 ? `${context.repo.owner}:${branch}` : branch
  }
  if (base) {
    query.base = base
  }

  const octokit = new GitHub(token)

  const res = await octokit.pulls.list(query)
  const pr = author
    ? res.data.length && res.data.filter(pr => pr.user.login === author)[0]
    : res.data.length && res.data[0]

  core.debug(`pr: ${JSON.stringify(pr, null, 2)}`)
  core.setOutput('number', pr ? pr.number : '')
  core.setOutput('title', pr ? pr.title : '')
  core.setOutput('head-sha', pr ? pr.head.sha : '')
}

main().catch(err => core.setFailed(err.message))
