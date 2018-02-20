module.exports = {
    async constructProject(body, session) {
        const project = {
            ...body,
            collaborators: [{
                userId: session.user.id,
                login: session.user.login,
                rank: 'Creator',
                dateOfEntry: Date.now(),
            }],
        };
        return (project);
    },
};
