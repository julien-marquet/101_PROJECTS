module.exports = {
    type: 'object',
    required: [
        'title',
        'description',
    ],
    properties: {
        public: {
            type: 'boolean',
        },
        repository: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        title: {
            type: 'string',
        },
        pitch: {
            type: 'string',
        },
        phase: {},
    },
    select: { $data: '0/activePhase' },
    selectCases: {
        1: {
            required: ['phase'],
            properties: {
                phase: {
                    $ref: 'refs/project.post/phase1.schema.ref.json',
                },
            },
        },
        2: {
            required: ['phase'],
            properties: {
                phase: {
                    $ref: 'refs/project.post/phase2.schema.ref.json',
                },
            },
        },
        3: {
            required: ['phase'],
            properties: {
                phase: {
                    $ref: 'refs/project.post/phase3.schema.ref.json',
                },
            },
        },
    },
    additionalProperties: false,
};

