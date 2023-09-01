function get_push_or_branch_msg(data) {
    let { user_name, commits, project: { homepage, path_with_namespace }, ref, before, after } = data
    ref = ref.substr(11)
    let count = commits.length
    if (count === 0) {
        if (Number(before) === 0) {
            // 创建分支
            return `**${user_name}**
> created branch [\`${ref}\`](${homepage}/-/tree/${ref})

[**${path_with_namespace}**](${homepage})`
        } else if (Number(after) === 0) {
            // 删除分支
            return `**${user_name}**
> deleted branch [\`${ref}\`](${homepage}/-/tree/${ref})

[**${path_with_namespace}**](${homepage})`
        }
        return
    }
    // 推送代码
    let head = `**${user_name}**
 [**${count} new commit**](${commits[0].url}) **pushed to** [**${ref}**](${homepage}/-/tree/${ref})\n`
    let middle = ''
    for (let i = 0; i < count; i++) {
        let { id, url, message } = commits[i]
        message = message.replace(/[\n]/g, '\n>')
        message.includes('\n') && (message += '\n>')
        middle += `> [**${id.substr(0, 7)}**](${url}) - ${message}\n`
    }
    let footer = `\n[**${path_with_namespace}**](${homepage})`
    return head + middle + footer
}

function get_comment_msg(data) {
    let { object_attributes: { noteable_id, commit_id, note, noteable_type, url },
        project: { homepage, path_with_namespace },
        user: { name } } = data
    return `${noteable_type} comment by ${name}
> **${ noteable_id || commit_id.substr(0, 7)}**
> [${note}](${url})

[**${path_with_namespace}**](${homepage})`
}

function get_pr_msg(data) {
    let { user: { name: user_name },
        object_attributes: { url, title, description, state },
        project: { path_with_namespace, homepage }
    } = data
    let num = url.substring(url.indexOf('/merge_requests/') + 16)
    return `Pull request ${state} by ${user_name}
> **${user_name}**
> [**#${num} ${title}**](${url})
${description}

[**${path_with_namespace}**](${homepage})`
}

function get_issues_msg(data) {
    let {
        object_attributes: { iid, title, description, url, state },
        user: { name },
        project: { path_with_namespace, homepage }
    } = data
    return `Issue ${state} by ${name}
> **${name}**
> [**#${iid} ${title}**](${url})
> ${description}

[**${path_with_namespace}**](${homepage})`
}

function get_tag_msg(data) {
    let { user_name,
        ref,
        project: { path_with_namespace, homepage },
        before,
        after
    } = data
    let method
    switch (true) {
        case Number(before) === 0:
            method = 'created'
            break
        case Number(after) === 0:
            method = 'deleted'
            break
        default:
            method = 'push'
            break
    }
    ref = ref.substr(10)
    return `**${user_name}**
> ${method} tag **${ref}**

[**${path_with_namespace}**](${homepage})`
}
function get_message_transfer(data, type) {
    switch (type) {
        case 'Push Hook':
            return get_push_or_branch_msg(data)
        case 'Merge Request Hook':
            return get_pr_msg(data)
        case 'Tag Push Hook':
            return get_tag_msg(data)
        case 'Issue Hook':
            return get_issues_msg(data)
        case 'Note Hook':
            return get_comment_msg(data)
        default:
            return undefined
    }
}

module.exports = get_message_transfer
