<?php

namespace ZIPPY_MENU_ORDER\App\Models\Audit_Logs;

use ZIPPY_MENU_ORDER\Core\Base_Model;

/**
 * @property string $action
 * @property string $table_name
 * @property int $record_id
 * @property string|null $old_values
 * @property string|null $new_values
 */
class Audit_Logs_Model extends Base_Model
{
    public string $table;

    protected array $fillable = [
        'action',
        'table_name',
        'record_id',
        'old_values',
        'new_values',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = DB_MENU_ORDER_PREFIX . AUDIT_LOGS_TABLE;
    }

    /**
     * DEFINE MODEL METHODS HERE
     */

    public static function log_action($action, $table_name, $record_id, $old_values = null, $new_values = null)
    {
        $log = new self();
        $log->action = $action;
        $log->table_name = $table_name;
        $log->record_id = $record_id;
        $log->old_values = $old_values ? json_encode($old_values) : null;
        $log->new_values = $new_values ? json_encode($new_values) : null;
        $log->save();
    }
}
