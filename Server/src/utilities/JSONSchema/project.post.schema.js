module.exports = {
    type: 'object',
    required: [
        'activePhase',
        'phase',
    ],
    properties: {
        activePhase: {
            type: 'number',
            minimum: 1,
            maximum: 2,
        },
    },
    select: { $data: '0/activePhase' },
    selectCases: {
        1: {
            required: ['phase'],
            properties: {
                phase: {
                    $ref: 'refs/project/phase1.schema.ref.json',
                },
            },
        },
        2: {
            required: ['phase'],
            properties: {
                phase: {
                    $ref: 'refs/project/phase2.schema.ref.json',
                },
            },
        },
        3: {
            required: ['phase'],
            properties: {
                phase: {
                    $ref: 'refs/project/phase3.schema.ref.json',
                },
            },
        },
        4: {
            required: ['phase'],
            properties: {
                phase: {
                    $ref: 'refs/project/phase4.schema.ref.json',
                },
            },
        },
    },
    additionalProperties: true,
};

