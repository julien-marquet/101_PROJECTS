module.exports = (api, controller, access, sender) => {
    api.get('project/list', access.check(['*']), controller.list.get, sender);
    api.post('project/application/invite/:projectId', access.check(['Student', 'Admin']), controller.application.invite.post, sender);
    api.post('project/application/apply/:projectId', access.check(['Student', 'Admin']), controller.application.apply.post, sender);
    api.get('project/application/:projectId', access.check(['Student', 'Admin']), controller.application.get, sender);
    api.post('project/upvote/:projectId', access.check(['Student', 'Admin']), controller.upvote.post, sender);
    api.del('project/upvote/:projectId', access.check(['Student', 'Admin']), controller.upvote.delete, sender);
    api.post('project/', access.check(['Student', 'Admin']), controller.post, sender);
    api.del('project/:projectId', access.check(['Student', 'Admin']), controller.delete, sender);
    api.get('project/:projectId', access.check(['*']), controller.get, sender);
    api.put('project/:projectId', access.check(['Student', 'Admin']), controller.put, sender);
};
