
const { getAssignBody, getLabelBody } = require('./github_handle')

function get_push_msg(data) {
  let { sender, commits, repository, ref } = data
  ref = ref.substr(11)
  let name = sender.login
  let count = commits.length
  if (count === 0) return
  let head = `**${name}**
 [**${count} new commit**](${commits[0].url}) **pushed to** [**${ref}**](${repository.html_url}/tree/${ref})\n`
  let middle = ''
  for (let i = 0; i < count; i++) {
    let { id, url, message } = commits[i]
    message = message.replace(/[\n]/g, '\n>')
    message.includes('\n') && (message += '\n>')
    middle += `> [**${id.substr(0, 7)}**](${url}) - ${message}\n`
  }
  let footer = `\n[**${repository.full_name}**](${repository.html_url})`
  return head + middle + footer
}

function get_comment_msg(data) {
  let { action, comment, repository, sender } = data,
    name = sender.login
  return `Commit comment ${action} by ${name}

> **${comment.commit_id.substr(0, 7)}**
> [${comment.body}](${comment.html_url})

[**${repository.full_name}**](${repository.html_url})`
}

function get_pr_msg(data) {
  let { action, number, sender, pull_request, repository } = data,
    name = sender.login,
    pr_desc = `
[**#${number} ${pull_request.title}**](${pull_request.html_url})`,
    content = ''
  switch (action) {
    case 'labeled':
    case 'unlabeled':
      content = getLabelBody(data)
      break
    case 'assigned':
    case 'unassigned':
      content = getAssignBody(data)
      break
    default:
      if (pull_request.body)  {
	let body = pull_request.body.replace(/[\n]/g, '\n>')
        content = `
>${body}
`
      }
      
      break
  }
  if (action === 'closed' && pull_request.merged) action = 'merged'
  return `Pull request ${action} by ${name}
${pr_desc}
${content}
[**${repository.full_name}**](${repository.html_url})`
}


function get_issue_comment_msg(data) {
  let { action, issue, sender, repository, comment } = data,
    name = sender.login,
    issue_name = issue.url.substring(issue.url.indexOf('/issues/') + 8),
    comment_title = comment.html_url.split('#')[1],
    comment_body = comment.body.replace(/[\n]/g, '\n>')
  return `issue comment ${action} by ${name}

[**#${issue_name} ${issue.title}**](${issue.html_url})

>[**${comment_title}**](${comment.html_url})
>${comment_body}

[**${repository.full_name}**](${repository.html_url})`
}

function get_issues_msg(data) {
  let { action, sender, repository, issue } = data,
    name = sender.login,
    issue_name = issue.url.substring(issue.url.indexOf('/issues/') + 8),
    content = '',
    issue_desc = `
[**#${issue_name} ${issue.title}**](${issue.html_url})
`
  switch (action) {
    case 'labeled':
    case 'unlabeled':
      content = getLabelBody(data)
      break
    case 'assigned':
    case 'unassigned':
      content = getAssignBody(data)
      break
    default:
      let body = issue.body.replace(/[\n]/g, '\n>')
      content = `
>${body}
`
  }
  return `issue ${action} by ${name}
${issue_desc}
${content}
  [**${repository.full_name}**](${repository.html_url})`
}

function get_branch_or_tag_msg(data, method) {
  let { sender, ref, ref_type, repository } = data
  return `**${sender.login}**

> ${method}d ${ref_type} [\`${ref}\`](${repository.html_url}/tree/${ref})

[**${repository.full_name}**](${repository.html_url})`
}

function get_release_msg(data) {
  let { action, release, sender, repository } = data,
    name = sender.login
  return `release ${action} by ${name}

> [**${release.name}**](${release.html_url})
${release.tag_name && '> ' + release.tag_name || ''}

[**${repository.full_name}**](${repository.html_url})`
}

function get_check_run_msg(data) {
  let { action, check_run: { name, status, conclusion, html_url }, sender: { login: sender }, repository } = data
  return `check_run ${action} by ${sender}

> [**${name}**](${html_url})
status: ${status}
conclusion: ${conclusion}

[**${repository.full_name}**](${repository.html_url})`
}

function get_check_suite_msg(data) {
  let { action, check_suite: { head_branch, status, conclusion }, sender: { login: sender }, repository } = data
  return `check_suite ${action} by ${sender}

> **${head_branch}**
status: ${status}
conclusion: ${conclusion}

[**${repository.full_name}**](${repository.html_url})`
}

function get_pull_request_review_msg(data) {
  let { action, sender, pull_request, repository, review } = data,
    name = sender.login
  if (action === 'submitted' && !review.body) return
  return `[**Review on #${pull_request.number} ${pull_request.title}**](${review.html_url})
${review.body}

> ${name} ${action} changes on ${pull_request.user.login}'s pull request
[**${repository.full_name}**](${repository.html_url})`
}

function get_pull_request_review_comment_msg(data) {
  let { sender, pull_request, repository, comment } = data,
    name = sender.login
  return `[**Comment on #${pull_request.number} ${pull_request.title}**](${comment.html_url})
${comment.body}

> ${name} requested changes on ${pull_request.user.login}'s pull request
[**${repository.full_name}**](${repository.html_url})`
}


function get_message_transfer(data, type) {
  switch (type) {
    case 'push':
      return get_push_msg(data)
    case 'commit_comment':
      return get_comment_msg(data)
    case 'pull_request':
      return get_pr_msg(data)
    case 'issue_comment':
      return get_issue_comment_msg(data)
    case 'issues':
      return get_issues_msg(data)
    case 'create':
    case 'delete':
      return get_branch_or_tag_msg(data, type)
    case 'release':
      return get_release_msg(data)
    case 'check_run':
      return get_check_run_msg(data)
    case 'check_suite':
      return get_check_suite_msg(data)
    case 'pull_request_review_comment':
      return get_pull_request_review_comment_msg(data)
    case 'pull_request_review':
      return get_pull_request_review_msg(data)
    default:
      return undefined
  }
}

module.exports = get_message_transfer
