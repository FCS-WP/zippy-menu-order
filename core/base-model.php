<?php

namespace ZIPPY_MENU_ORDER\Core;

use Exception;
use ZIPPY_MENU_ORDER\App\Models\Audit_Logs\Audit_Logs_Model;
use ZIPPY_MENU_ORDER\Core\Base_Query;
use ZIPPY_MENU_ORDER\Core\Config;

defined('ABSPATH') || exit;

class Base_Model
{
    protected $db;
    protected string $table;

    protected array $fillable = [];

    protected $attributes = [];
    protected bool $timestamps = true;

    protected bool $shouldAudit = false;
    protected array $original = [];

    protected int $defaultPage;
    protected int $defaultLimit;

    protected $primaryKey = 'id';

    public function __construct($data = [])
    {
        global $wpdb;
        $this->db = $wpdb;
        $this->defaultPage = Config::message('app.pagination.default_page', 1);
        $this->defaultLimit = Config::message('app.pagination.default_limit', 10);
        $this->attributes = $this->castAttributes($data);
        $this->original   = $this->attributes;
    }

    public function __get($key)
    {
        $method = 'get_' . $key;
        if (method_exists($this, $method)) {
            return $this->$method();
        }

        return $this->attributes[$key] ?? null;
    }

    public function __set($key, $value)
    {
        $this->attributes[$key] = $value;
    }

    public static function find()
    {
        return new Base_Query(new static);
    }

    /**
     * Return current MySQL timestamp.
     * Eg: $time = $this->now();
     */
    protected function now()
    {
        return current_time('mysql');
    }

    public function hasOne($relatedClass, $foreignKey, $localKey = 'id')
    {
        $related = new $relatedClass;

        $value = $this->{$localKey} ?? null;
        if (!$value) return null;

        global $wpdb;
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$related->table} WHERE $foreignKey = %d LIMIT 1",
                $value
            ),
            ARRAY_A
        );

        if (!$row) return null;

        return new $relatedClass($row);
    }

    public function hasMany($relatedClass, $foreignKey, $localKey = 'id')
    {
        $related = new $relatedClass;

        $value = $this->{$localKey} ?? null;
        if (!$value) return [];

        global $wpdb;
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$related->table} WHERE $foreignKey = %d",
                $value
            ),
            ARRAY_A
        );

        $result = [];
        foreach ($rows as $row) {
            $result[] = new $relatedClass($row);
        }

        return $result;
    }

    /**
     * Insert a single row.
     * Auto adds timestamps if enabled.
     * Returns inserted row attributes.
     *
     * Example:
     * $model->create([
     *     'name' => 'Store A',
     *     'address' => 'HCM',
     * ]);
     */
    public function create(array $data)
    {
        $data = $this->mutateAttributes($data);
        $data = $this->filterFillable($data);

        if ($this->timestamps) {
            $now = $this->now();
            $data['created_at'] = $now;
            $data['updated_at'] = $now;
        }

        $inserted = $this->db->insert($this->table, $data);

        if (!$inserted) {
            return null;
        }

        $data[$this->primaryKey] = $this->db->insert_id;

        $model = new static($this->castAttributes($data));

        if ($this->shouldAudit) {
            Audit_Logs_Model::log_action(
                'create',
                $this->table,
                $data[$this->primaryKey],
                null,
                $data
            );
        }

        return $model;
    }

    /**
     * Insert multiple rows in a transaction.
     * Rolls back on any failure.
     *
     * Example:
     * $model->insert([
     *     ['name' => 'A'],
     *     ['name' => 'B'],
     * ]);
     */
    public function insert(array $rows)
    {
        if (empty($rows)) {
            return false;
        }

        $this->db->query('START TRANSACTION');

        $results = [];

        foreach ($rows as $row) {
            $row = $this->mutateAttributes($row);
            $row = $this->filterFillable($row);

            if ($this->timestamps) {
                $row['created_at'] = $this->now();
                $row['updated_at'] = $this->now();
            }

            $inserted = $this->db->insert($this->table, $row);

            if (!$inserted) {
                $this->db->query('ROLLBACK');
                return false;
            }

            $row[$this->primaryKey] = $this->db->insert_id;

            // cast attributes for response
            $results[] = $this->castAttributes($row);
        }

        $this->db->query('COMMIT');

        return new static($results);
    }

    public function updateMany(array $rows)
    {
        if (empty($rows)) {
            return false;
        }

        $updatedRecords = [];

        $this->db->query('START TRANSACTION');

        foreach ($rows as $row) {

            if (empty($row[$this->primaryKey])) {
                $this->db->query('ROLLBACK');
                return false;
            }

            $id = $row[$this->primaryKey];

            $row = $this->mutateAttributes($row);
            $row = $this->filterFillable($row);

            if ($this->timestamps) {
                $row['updated_at'] = $this->now();
            }

            unset($row[$this->primaryKey]);

            if (!empty($row)) {
                $updated = $this->db->update(
                    $this->table,
                    $row,
                    [$this->primaryKey => $id]
                );

                if ($updated === false) {
                    $this->db->query('ROLLBACK');
                    return false;
                }
            }

            // select lại record vừa cập nhật
            $fresh = $this->db->get_row(
                $this->db->prepare(
                    "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = %s",
                    $id
                ),
                ARRAY_A
            );

            if (!$fresh) {
                $this->db->query('ROLLBACK');
                return false;
            }

            $updatedRecords[] = $fresh;
        }

        $this->db->query('COMMIT');

        return $updatedRecords;
    }


    /**
     * Update a row by conditions.
     * Returns updated attributes if success.
     *
     * Example:
     * $model->update(['name' => 'Updated'], ['id' => 5]);
     */
    public function update(array $data)
    {
        if (!isset($this->attributes[$this->primaryKey])) {
            throw new Exception("Cannot update: ID not set in this object.");
        }

        $old = $this->original;
        $data = $this->mutateAttributes($data);
        $data = $this->filterFillable($data);

        if ($this->timestamps) {
            $data['updated_at'] = $this->now();
        }

        $updated = $this->db->update(
            $this->table,
            $data,
            [$this->primaryKey => $this->attributes[$this->primaryKey]]
        );

        if (!$updated) {
            return null;
        }

        $merged = array_merge($this->attributes, $data);
        $new = $this->castAttributes($merged);

        $this->writeAuditLog('update', $old, $new);

        return new static($new);
    }

    /**
     * Soft delete a row by id.
     * Eg: $model->softDelete($id);
     */
    public function softDelete()
    {
        if (!isset($this->attributes[$this->primaryKey])) {
            throw new Exception("Cannot delete: ID not set in this object.");
        }

        $old = $this->attributes;

        $data = [];
        if ($this->timestamps) {
            $data['deleted_at'] = $this->now();
        }

        $deleted = $this->db->update(
            $this->table,
            $data,
            [$this->primaryKey => $this->attributes[$this->primaryKey]]
        );

        if ($deleted) {
            $new = array_merge($old, $data);

            $this->writeAuditLog('delete', $old, $new);
            return $this->attributes[$this->primaryKey];
        }

        return false;
    }


    public function restore()
    {
        if (empty($this->attributes[$this->primaryKey])) {
            throw new Exception("Cannot restore: ID not set in this object.");
        }

        $old = $this->attributes;

        $restored = $this->db->update(
            $this->table,
            ['deleted_at' => null],
            [$this->primaryKey => $this->attributes[$this->primaryKey]]
        );

        if ($restored) {
            $new = array_merge($old, ['deleted_at' => null]);
            $this->writeAuditLog('restore', $old, $new);
            return true;
        }

        return false;
    }


    /**
     * Hard delete a row by id.
     * Eg: $model->hardDelete($id);
     */
    public function hardDelete()
    {
        if (empty($this->attributes[$this->primaryKey])) {
            throw new Exception("Cannot hard delete: ID not set in this object.");
        }

        return $this->db->delete($this->table, [$this->primaryKey => $this->attributes[$this->primaryKey]]);
    }

    /**
     * Filter input array so only fillable fields remain.
     * Eg: $this->filterFillable($_POST);
     */
    protected function filterFillable(array $data)
    {
        return array_intersect_key($data, array_flip($this->fillable));
    }


    /**
     * Mutate attributes before insert/update.
     * Eg: serialize field.
     */
    public function mutateAttributes(array $data): array
    {
        return $data;
    }


    /**
     * Cast attributes after fetching from DB.
     * Eg: unserialize fields.
     */
    public function castAttributes(array $data): array
    {
        return $data;
    }

    public function toArray(): array
    {
        return $this->attributes ?? [];
    }

    protected function writeAuditLog(string $action, ?array $old, array $new)
    {
        $changes = [];

        if ($old) {
            foreach ($new as $key => $value) {
                if (!array_key_exists($key, $old)) continue;
                if ($old[$key] !== $value) {
                    $changes[$key] = [
                        'old' => $old[$key],
                        'new' => $value,
                    ];
                }
            }
        }

        if ($action === 'update' && empty($changes)) {
            return;
        }

        Audit_Logs_Model::log_action(
            $action,
            $this->table,
            $new[$this->primaryKey] ?? null,
            $old,
            $changes ?: $new
        );
    }

    public function save()
    {
        $isUpdate = isset($this->attributes[$this->primaryKey]);

        $result = $isUpdate
            ? $this->update($this->attributes)
            : $this->create($this->attributes);

        return $result;
    }

    public function audit()
    {
        $this->shouldAudit = true;
        return $this;
    }
}
