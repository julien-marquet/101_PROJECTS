module.exports = {
    type: 'object',
    required: [
        'userId',
    ],
    properties: {
        jobId: {
            type: 'string',
        },
        userId: {
            type: 'number',
        },
    },
    additionalProperties: false,
};

