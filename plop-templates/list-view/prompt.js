const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a list-view',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'view name plz',
    validate: notEmpty('name')
  },
  {
    type: 'input',
    name: 'apiJS',
    message: 'api js plz, already have prefix @/api/',
    validate: notEmpty('name')
  },
  ],
  actions: data => {
    const name = '{{name}}'
    const apiJS = '{{apiJS}}'
    const actions = [{
      type: 'add',
      path: `src/views/${name}/index.vue`,
      templateFile: 'plop-templates/list-view/index.hbs',
      data: {
        name: name,
        apiJS: apiJS
      }
    }]

    return actions
  }
}
