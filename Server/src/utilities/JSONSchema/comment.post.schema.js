module.exports = {
    type: 'object',
    required: [
        'phase',
        'content',
    ],
    properties: {
        activePhase: {
            type: 'number',
            minimum: 1,
            maximum: 3,
        },
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

