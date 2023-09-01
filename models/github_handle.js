
exports.getLabelBody = function (data) {
  let { action, label, repository, sender } = data
  let { name: label_name, description: label_desc } = label
  let l_desc = action === 'labeled' ? 'added' : 'removed'
  return `
**${sender.login}** ${l_desc} label [**${label_name}**](${repository.html_url}/labels/${label_name})
> ${label_desc}
`
}



exports.getAssignBody = function (data) {
  let { action, assignee, sender } = data
  let a_desc = action === 'assigned' ? 'added' : 'removed'
  let { login, html_url } = assignee
  return `
**${sender.login}** ${a_desc} assignee [**${login}**](${html_url})
`
}