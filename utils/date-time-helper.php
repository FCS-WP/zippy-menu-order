<?php

namespace ZIPPY_MENU_ORDER\Utils;

class Date_Time_Helper
{
    public static function getSingaporeTime(): string
    {
        $date = new \DateTime('now', new \DateTimeZone('Asia/Singapore'));
        return $date->format('H:i:s');
    }

    public static function getSingaporeDate(?string $dateStr = null): string
    {
        $date = new \DateTime($dateStr ?? 'now', new \DateTimeZone('Asia/Singapore'));
        return $date->format('Y-m-d');
    }
}
