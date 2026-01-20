<?php

namespace ZIPPY_MENU_ORDER\Core;

class Base_Query
{
    protected string $model;
    protected string $select = '*';
    protected string $alias = '';
    protected string $table = '';
    protected array $joins = [];
    protected string $whereSQL = '';
    protected array $andWhereSQL = [];
    protected array $orWhereSQL = [];
    protected array $groupBy = [];
    protected array $bindings = [];
    protected array $havingSQL = [];
    protected array $havingBindings = [];
    protected string $orderBy = '';
    protected ?int $limit = null;
    protected ?int $offset = null;
    protected $db;

    public function __construct($model)
    {
        global $wpdb;
        $this->db = $wpdb;

        $this->model = is_object($model) ? get_class($model) : $model;
        $this->table = $model->table ?? '';
    }

    public function alias($alias)
    {
        $this->alias = $alias;
        return $this;
    }

    public function select($fields)
    {
        $this->select = $fields;
        return $this;
    }

    public function join(string $table, string $on, string $type = 'INNER')
    {
        $this->joins[] = [
            'type'  => strtoupper($type),
            'table' => $table,
            'on'    => $on
        ];

        return $this;
    }

    public function leftJoin(string $table, string $on)
    {
        return $this->join($table, $on, 'LEFT');
    }

    public function rightJoin(string $table, string $on)
    {
        return $this->join($table, $on, 'RIGHT');
    }

    public function innerJoin(string $table, string $on)
    {
        return $this->join($table, $on, 'INNER');
    }

    public function where($operator, $column = null, $value = null)
    {
        $this->whereSQL = '';
        $this->andWhereSQL = [];
        $this->orWhereSQL = [];
        $this->bindings = [];

        [$sql, $bind] = $this->buildCondition($operator, $column, $value);

        $this->whereSQL = $sql;
        $this->bindings = $bind;

        return $this;
    }

    public function andWhere($operator, $column = null, $value = null)
    {
        [$sql, $bind] = $this->buildCondition($operator, $column, $value);

        $this->andWhereSQL[] = $sql;
        $this->bindings = array_merge($this->bindings, $bind);

        return $this;
    }

    public function orWhere($operator, $column = null, $value = null)
    {
        [$sql, $bind] = $this->buildCondition($operator, $column, $value);

        $this->orWhereSQL[] = $sql;
        $this->bindings = array_merge($this->bindings, $bind);

        return $this;
    }

    public function whereNull($column)
    {
        $this->andWhereSQL[] = "{$column} IS NULL";
        return $this;
    }

    public function whereNotNull($column)
    {
        $this->andWhereSQL[] = "{$column} IS NOT NULL";
        return $this;
    }


    /**
     * Adds a WHERE condition to the query (only if the given value is not null and not empty).
     * Example:
     *   ->andFilterWhere(['name' => 'John', 'age' => null])
     *  Or
     *   ->andFilterWhere('=', 'status', 'active')
     * @param mixed $operator
     * @param mixed $column
     * @param mixed $value
     * @return Base_Query
     */
    public function andFilterWhere($condition, $column = null, $value = null)
    {
        if (is_array($condition)) {
            foreach ($condition as $col => $val) {
                if ($val === null || $val === '') {
                    continue;
                }

                [$sql, $bind] = $this->buildCondition([$col => $val]);
                $this->andWhereSQL[] = $sql;
                $this->bindings = array_merge($this->bindings, $bind);
            }
            return $this;
        }

        if ($column === null || $column === '') {
            return $this;
        }

        return $this->andWhere($condition, $column, $value);
    }


    protected function buildCondition($operator, $column = null, $value = null)
    {
        $bindings = [];

        //
        // 1. Array format: where(['name' => 'John', 'age' => 20])
        //
        if (is_array($operator)) {
            $cond = [];

            foreach ($operator as $col => $val) {
                if (strpos($col, ' ') !== false) {
                    [$realCol, $op] = explode(' ', $col, 2);
                    $op = strtoupper($op);
                } else {
                    $realCol = $col;
                    $op = '=';
                }

                $placeholder = is_int($val) ? "%d" : "%s";
                $cond[] = "{$realCol} {$op} {$placeholder}";
                $bindings[] = $val;
            }

            return [implode(" AND ", $cond), $bindings];
        }

        $op = strtoupper($operator);

        //
        // 2. Operators that don't need value
        // Example: where('IS NULL', 'age')
        //
        if (in_array($op, ['IS NULL', 'IS NOT NULL'])) {
            return ["{$column} {$op}", []];
        }

        //
        // 3. IN / NOT IN
        // Example: where('IN', 'age', [18, 20, 30])
        //
        if (in_array($op, ['IN', 'NOT IN']) && is_array($value)) {
            $placeholders = [];

            foreach ($value as $v) {
                $placeholders[] = is_int($v) ? "%d" : "%s";
                $bindings[] = $v;
            }

            return [
                "{$column} {$op} (" . implode(", ", $placeholders) . ")",
                $bindings
            ];
        }

        //
        // 4. BETWEEN / NOT BETWEEN
        // Example: where('BETWEEN', 'age', [18, 30])
        //
        if (in_array($op, ['BETWEEN', 'NOT BETWEEN']) && is_array($value) && count($value) === 2) {

            $ph1 = is_int($value[0]) ? "%d" : "%s";
            $ph2 = is_int($value[1]) ? "%d" : "%s";

            $bindings[] = $value[0];
            $bindings[] = $value[1];

            return [
                "{$column} {$op} {$ph1} AND {$ph2}",
                $bindings
            ];
        }

        //
        // 5. LIKE / NOT LIKE
        // Example: where('LIKE', 'name', '%John%')
        //
        if (in_array($op, ['LIKE', 'NOT LIKE'])) {
            $placeholder = "%s";
            $bindings[] = $value;

            return ["{$column} {$op} {$placeholder}", $bindings];
        }

        //
        // 6. Default: normal operator (=, <>, >, <, >=, <=)
        // Example: where('=', 'age', 30)
        //
        $placeholder = is_int($value) ? "%d" : "%s";
        $bindings[] = $value;

        return ["{$column} {$op} {$placeholder}", $bindings];
    }

    public function one()
    {
        $sql = $this->buildSQL() . " LIMIT 1";
        $prepared = $this->db->prepare($sql, $this->bindings);

        $row = $this->db->get_row($prepared, ARRAY_A);
        return $row ? new $this->model($row) : null;
    }

    public function all()
    {
        $sql = $this->buildSQL();
        $prepared = $this->db->prepare($sql, $this->bindings);

        $rows = $this->db->get_results($prepared, ARRAY_A);

        return array_map(fn($r) => new $this->model($r), $rows);
    }

    public function asArray(): array
    {
        $sql = $this->buildSQL();
        $prepared = $this->db->prepare($sql, $this->bindings);

        $rows = $this->db->get_results($prepared, ARRAY_A);

        if (empty($rows)) return [];

        return array_map(fn($r) => (new $this->model($r))->toArray(), $rows);
    }


    public function count($column = null)
    {
        $column = $column ?? (new $this->model())->primaryKey ?? 'id';
        $sql = $this->buildSQL("COUNT({$column}) AS cnt");
        $prepared = $this->db->prepare($sql, $this->bindings);

        return (int) $this->db->get_var($prepared);
    }

    public function groupBy($columns)
    {
        if (is_array($columns)) {
            $this->groupBy = $columns;
        } else {
            $this->groupBy = explode(',', str_replace(' ', '', $columns));
        }
        return $this;
    }

    public function having($condition, $bindings = [])
    {
        $this->havingSQL[] = $condition;
        $this->havingBindings = array_merge($this->havingBindings, $bindings);
        return $this;
    }


    public function orderBy($column, $direction = 'ASC')
    {
        $this->orderBy = $column . ' ' . strtoupper($direction);
        return $this;
    }

    public function limit($limit, $offset = null)
    {
        $this->limit = (int) $limit;
        $this->offset = $offset !== null ? (int) $offset : null;
        return $this;
    }

    public function paginate($page = 1, $limit = 10)
    {
        $_this = clone $this;
        $this->limit($limit, ($page - 1) * $limit);
        $data = $this->asArray();
        $total_items = $_this->count();

        return [
            'data' => $data,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total_pages' => $total_items > 0 ? ceil($total_items / $limit) : 0,
                'total_items' => (int) $total_items,
            ]
        ];
    }

    protected function buildSQL($replaceSelect = null)
    {
        if ($replaceSelect !== null) {
            $this->select = $replaceSelect;
        }
        $table = $this->alias ? "{$this->table} AS {$this->alias}" : $this->table;

        $sql = "SELECT {$this->select} FROM {$table}";

        //Joins
        foreach ($this->joins as $join) {
            $sql .= " {$join['type']} JOIN {$join['table']} ON {$join['on']}";
        }

        //Where
        $conditions = [];

        if ($this->whereSQL) {
            $conditions[] = $this->whereSQL;
        }

        if (!empty($this->andWhereSQL)) {
            foreach ($this->andWhereSQL as $cond) {
                $conditions[] = $cond;
            }
        }

        if (!empty($this->orWhereSQL)) {
            $conditions[] = "(" . implode(" OR ", $this->orWhereSQL) . ")";
        }

        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        if (!empty($this->groupBy)) {
            $sql .= " GROUP BY " . implode(", ", $this->groupBy);
        }

        if (!empty($this->havingSQL)) {
            $sql .= " HAVING " . implode(" AND ", $this->havingSQL);
            $this->bindings = array_merge($this->bindings, $this->havingBindings);
        }

        if ($this->orderBy) {
            $sql .= " ORDER BY {$this->orderBy}";
        }

        if ($this->limit !== null) {
            $sql .= " LIMIT " . $this->limit;
            if ($this->offset !== null) {
                $sql .= " OFFSET " . $this->offset;
            }
        }

        if (!empty($this->bindings)) {
            $sql = $this->db->prepare($sql, $this->bindings);
        }

        return $sql;
    }
}
