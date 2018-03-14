module.exports = (api, controller, access, sender) => {
    api.post('project/', access.check(['Student', 'Admin']), controller.post, sender);
    api.del('project/:projectId', access.check(['Student', 'Admin']), controller.delete, sender);
    api.get('project/:projectId', access.check(['*']), controller.get, sender);
    api.put('project/:projectId', access.check(['Student', 'Admin']), controller.put, sender);
    api.put('project/phase/:projectId', access.check(['Student', 'Admin']), controller.phase.put, sender);
};
