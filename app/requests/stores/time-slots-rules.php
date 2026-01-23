<?php

namespace ZIPPY_MENU_ORDER\App\Requests\Stores;

use Rakit\Validation\Rule;

class Time_Slots_Rules
{
    public function register($validator)
    {
        $validator->addValidator('after_time', new class extends Rule {
            protected $message = ":attribute must be greater than :other";
            protected $fillableParams = ['other'];

            public function check($value): bool
            {
                $otherKey = $this->params['other'] ?? null;
                if (!$otherKey) return true;

                $attributeParts = explode('.', $this->attribute->getKeyIndexes()[0]);
                $otherKeyResolved = $otherKey;

                if (strpos($otherKey, '*')) {
                    $otherParts = explode('.', $otherKey);

                    foreach ($otherParts as &$part) {
                        if ($part === '*') {
                            $part = $attributeParts[0] ?? 0;
                        }
                    }
                    $otherKeyResolved = implode('.', $otherParts);
                }

                $otherValue = $this->validation->getValue($otherKeyResolved);

                if (!$otherValue || !$value) return true;

                return strtotime($value) > strtotime($otherValue);
            }
        });


        $validator->addValidator('after_time_loop', new class extends Rule {
            protected $message = ":attribute must be greater than :other";
            protected $fillableParams = ['other'];

            public function check($value): bool
            {
                $otherKey = $this->params['other'] ?? null;
                if (!$otherKey) return true;

                // attribute full key: days.0.slots.1.end_time etc
                $attributeIndexes = $this->attribute->getKeyIndexes();
                // Example: ["days", "0", "slots", "1", "end_time"]

                if (empty($attributeIndexes)) {
                    return true;
                }

                // Resolve wildcard mapping
                $otherKeyResolved = $otherKey;

                if (strpos($otherKey, '*') !== false) {
                    $otherParts = explode('.', $otherKey);          // ["days", "*", "slots", "*", "start_time"]
                    $attrParts  = $attributeIndexes;                // ["days","0","slots","1","end_time"]

                    foreach ($otherParts as $index => &$part) {
                        if ($part === '*') {
                            // map same index
                            $part = $attrParts[$index] ?? null;
                        }
                    }
                    unset($part);

                    $otherKeyResolved = implode('.', $otherParts);  // e.g. days.0.slots.1.start_time
                }

                $otherValue = $this->validation->getValue($otherKeyResolved);

                if (!$otherValue || !$value) return true;

                return strtotime($value) > strtotime($otherValue);
            }
        });


        $validator->addValidator('ordered_time_slots', new class extends Rule {
            protected $message = "Time slots must be in ascending order";

            public function check($value): bool
            {
                if (!is_array($value)) return true;

                $prevEnd = null;

                foreach ($value as $slot) {
                    $open = $slot['start_time'] ?? null;
                    $end  = $slot['end_time'] ?? null;

                    if (!$open || !$end) continue;

                    $openTime = strtotime($open);
                    $endTime  = strtotime($end);

                    if ($prevEnd !== null && $openTime < $prevEnd) {
                        return false;
                    }

                    $prevEnd = $endTime;
                }

                return true;
            }
        });
    }
}
