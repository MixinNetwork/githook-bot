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
    let { action, sender, pull_request, repository } = data,
        name = sender.login,
        pull_request_name = pull_request.url.substring(pull_request.url.indexOf('/pulls/') + 7)
    if (action === 'labeled') return
    if (action === 'closed') action = pull_request.merged ? 'merged' : 'unmerged'
    return `Pull request ${action} by ${name}
> **${name}**
> [**#${pull_request_name} ${pull_request.title}**](${pull_request.html_url})
${pull_request.body}

[**${repository.full_name}**](${repository.html_url})`
}


function get_issue_comment_msg(data) {
    let { action, issue, sender, repository, comment } = data,
        name = sender.login,
        issue_name = issue.url.substring(issue.url.indexOf('/issues/') + 8)
    return `issue comment ${action} by ${name}
> **${name}**
> [**#${issue_name} ${issue.title}**](${issue.html_url})
> ${issue.body}

> [**${comment.body}**](${comment.html_url})
    
[**${repository.full_name}**](${repository.html_url})`
}

function get_issues_msg(data) {
    let { action, issue, sender, repository } = data,
        name = sender.login,
        issue_name = issue.url.substring(issue.url.indexOf('/issues/') + 8)
    return `issue ${action} by ${name}
> **${name}**
> [**#${issue_name} ${issue.title}**](${issue.html_url})
> ${issue.body}

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
> **${name}**
> [**${release.name}**](${release.html_url})
${release.tag_name && '> ' + release.tag_name || ''}

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
        default:
            return undefined
    }
}

module.exports = get_message_transfer
