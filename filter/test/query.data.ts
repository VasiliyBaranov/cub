import { SortOrderByEnum } from '../input-dvo/filter.order-by.input-type';

export const queryData = [
  {
    id: 'Простой запрос с одним условием',
    scheme: [{
      'operator': 'and',
      'items': [{ 'condition': '(task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count31', 'conditionParam': { '_scalarAttrs.count31': 4 } }],
    }],
    allAttrs: [{ 'key': 'count3', 'categoryKey': 'IntScalar' }],
    order: [{ 'key': '_scalarAttrs.count3', 'sort': SortOrderByEnum.asc }],
    expect: 'SELECT * FROM "task" "task" ' +
      'WHERE ((task."_scalarAttrs"->>\'count3\')::int = $1) AND task.isDeleted = false ' +
      'ORDER BY (task."_scalarAttrs"->>\'count3\')::int ASC, task.id ASC',
  },
  {
    id: 'Сложный запрос с вложенными условиями',
    scheme: [{
      'operator': 'and',
      'items': [
        {
          'condition': '(task."_scalarAttrs"->>\'count2\')::int = :_scalarAttrs.count21',
          'conditionParam': { '_scalarAttrs.count21': 180 },
        },
        {
          'operator': 'or', 'items': [
            {
              'condition': '(task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count32',
              'conditionParam': { '_scalarAttrs.count32': 30 },
            },
            {
              'condition': '(task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count33',
              'conditionParam': { '_scalarAttrs.count33': 300 },
            },
            {
              'condition': '(task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count34',
              'conditionParam': { '_scalarAttrs.count33': 100 },
            },
            {
              'condition': '(task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count35',
              'conditionParam': { '_scalarAttrs.count33': 250 },
            },
            {
              'condition': '(task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count36',
              'conditionParam': { '_scalarAttrs.count33': 400 },
            }, {
              'operator': 'and', 'items': [
                {
                  'condition': '(task."_scalarAttrs"->>\'state\')::boolean = :_scalarAttrs.state7',
                  'conditionParam': { '_scalarAttrs.state7': true },
                },
                {
                  'operator': 'or', 'items': [
                    {
                      'condition': '(task."_scalarAttrs"->>\'startDate\')::int IN ( :..._scalarAttrs.startDate8 )',
                      'conditionParam': { '_scalarAttrs.startDate8': [20, 30, 40, 50, 60, 70, 80, 100, 200, 300, 400, 500, 600] },
                    },
                    {
                      'condition': '(task."_scalarAttrs"->>\'endDate\')::int IN ( :..._scalarAttrs.startDate9 )',
                      'conditionParam': { '_scalarAttrs.startDate9': [20, 30, 40, 50, 60, 70, 80, 100, 200, 300, 400, 500, 600] },
                    },
                    {
                      'condition': '(task."_scalarAttrs"->>\'startDate3\')::int IN ( :..._scalarAttrs.startDate310 )',
                      'conditionParam': { '_scalarAttrs.startDate310': [20, 30, 40, 50, 60, 70, 80, 100, 200, 300, 400, 500, 600] },
                    },
                    {
                      'condition': '(task."_scalarAttrs"->>\'endDate4\')::int IN ( :..._scalarAttrs.endDate411 )',
                      'conditionParam': { '_scalarAttrs.endDate411': [20, 30, 40, 50, 60, 70, 80, 100, 200, 300, 400, 500, 600] },
                    },
                    {
                      'condition': '(task."_scalarAttrs"->>\'startDate5\')::int IN ( :..._scalarAttrs.startDate512 )',
                      'conditionParam': { '_scalarAttrs.startDate512': [20, 30, 40, 50, 60, 70, 80, 100, 200, 300, 400, 500, 600] },
                    },
                    {
                      'condition': '(task."_scalarAttrs"->>\'endDate2\')::int IN ( :..._scalarAttrs.endDate213 )',
                      'conditionParam': { '_scalarAttrs.endDate213': [20, 30, 40, 50, 60, 70, 80, 100, 200, 300, 400, 500, 600] },
                    },
                    {
                      'operator': 'or', 'items': [
                        {
                          'condition': '(task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count314',
                          'conditionParam': { '_scalarAttrs.count33': 400 },
                        },
                        {
                          'condition': '(task."_scalarAttrs"->>\'isVisible\')::int = :_scalarAttrs.isVisible15',
                          'conditionParam': { '_scalarAttrs.isVisible15': true },
                        },
                        {
                          'condition': '(task."_scalarAttrs"->>\'isActive2\')::int = :_scalarAttrs.isActive216',
                          'conditionParam': { '_scalarAttrs.isActive216': false },
                        },
                        {
                          'operator': 'and', 'items': [
                            {
                              'condition': '(task."_scalarAttrs"->>\'isVisible4\')::boolean = :_scalarAttrs.isVisible417',
                              'conditionParam': { '_scalarAttrs.isVisible417': false },
                            },
                            {
                              'condition': '(task."_scalarAttrs"->>\'isVisible3\')::boolean NOT IN ( :..._scalarAttrs.isVisible318 )',
                              'conditionParam': { '_scalarAttrs.isVisible318': [true, true] },
                            },
                            {
                              'operator': 'or',
                              'items': [
                                {
                                  'condition': '(task."_scalarAttrs"->>\'count7\')::int = :_scalarAttrs.count719',
                                  'conditionParam': { '_scalarAttrs.count719': 356 },
                                },
                                {
                                  'condition': '(task."_scalarAttrs"->>\'count8\')::int = :_scalarAttrs.count820',
                                  'conditionParam': { '_scalarAttrs.count820': 356 },
                                },
                                {
                                  'operator': 'and',
                                  'items': [
                                    {
                                      'condition': '(task."_scalarAttrs"->>\'isActive7\')::boolean = :_scalarAttrs.isActive721',
                                      'conditionParam': { '_scalarAttrs.isActive721': true },
                                    },
                                    {
                                      'operator': 'or',
                                      'items': [
                                        {
                                          'condition': '(task."_scalarAttrs"->>\'endDate2\')::int IN ( :..._scalarAttrs.endDate222 )',
                                          'conditionParam': { '_scalarAttrs.endDate222': [20, 30, 40, 50, 60, 70, 80, 100, 200, 300, 400, 500, 600] },
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    ],
    allAttrs: [{ 'key': 'count3', 'categoryKey': 'IntScalar' }],
    order: [{ 'key': '_scalarAttrs.count3', 'sort': SortOrderByEnum.asc }],
    expect: 'SELECT * FROM "task" "task" WHERE ((task."_scalarAttrs"->>\'count2\')::int = $1 ' +
      'AND (((task."_scalarAttrs"->>\'count3\')::int = $2 ' +
      'OR (task."_scalarAttrs"->>\'count3\')::int = $3 ' +
      'OR (task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count34 ' +
      'OR (task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count35 ' +
      'OR (task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count36 ' +
      'OR (((task."_scalarAttrs"->>\'state\')::boolean = $4 ' +
      'AND (((task."_scalarAttrs"->>\'startDate\')::int IN ( $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17 ) ' +
      'OR (task."_scalarAttrs"->>\'endDate\')::int IN ( $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30 ) ' +
      'OR (task."_scalarAttrs"->>\'startDate3\')::int IN ( $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43 ) ' +
      'OR (task."_scalarAttrs"->>\'endDate4\')::int IN ( $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56 ) ' +
      'OR (task."_scalarAttrs"->>\'startDate5\')::int IN ( $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69 ) ' +
      'OR (task."_scalarAttrs"->>\'endDate2\')::int IN ( $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82 ) ' +
      'OR (((task."_scalarAttrs"->>\'count3\')::int = :_scalarAttrs.count314 ' +
      'OR (task."_scalarAttrs"->>\'isVisible\')::int = $83 ' +
      'OR (task."_scalarAttrs"->>\'isActive2\')::int = $84 ' +
      'OR (((task."_scalarAttrs"->>\'isVisible4\')::boolean = $85 ' +
      'AND (task."_scalarAttrs"->>\'isVisible3\')::boolean NOT IN ( $86, $87 ) ' +
      'AND (((task."_scalarAttrs"->>\'count7\')::int = $88 ' +
      'OR (task."_scalarAttrs"->>\'count8\')::int = $89 ' +
      'OR (((task."_scalarAttrs"->>\'isActive7\')::boolean = $90 ' +
      'AND (((task."_scalarAttrs"->>\'endDate2\')::int IN ( $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, $101, $102, $103 )))))))))))))))))) ' +
      'AND task.isDeleted = false ' +
      'ORDER BY (task."_scalarAttrs"->>\'count3\')::int ASC, task.id ASC',
  },
];
