const n=`{\r
    "ezTuneRate": {\r
        "message": "Скорость вращения"\r
    },\r
    "pidTuning_Rates_Roll": {\r
        "message": "Крен (°/с)"\r
    },\r
    "gpsSignalStr": {\r
        "message": "Мощность сигнала"\r
    },\r
    "active": {\r
        "message": "Активен"\r
    },\r
    "configurationGyroLpfTitle": {\r
        "message": "Частота среза ФНЧ гироскопа"\r
    },\r
    "osdElement_RSSI_DBM": {\r
        "message": "RX RSSI (dBm)"\r
    },\r
    "sitlSerialParity": {\r
        "message": "Паритет"\r
    },\r
    "BLACKBOX_FEATURE_MOTORS": {\r
        "message": "Данные с моторов"\r
    },\r
    "osd_use_pilot_logo": {\r
        "message": "Использовать лого пилота"\r
    },\r
    "receiverHelpDeadband": {\r
        "message": "Эти значения (в us, мкс) показывают, насколько может колебаться входной сигнал RC-приёмника, прежде чем он будет считаться действительными. Для передатчиков с джиттером на выходах это значение можно увеличить, если входные сигналы RC подрагивают в режиме ожидания."\r
    },\r
    "adjustmentsHelp": {\r
        "message": "Настройте переключатели регулировки. Для большей информации смотри главу \\"in-flight adjustments\\" руководства. Изменения, вносимые функциями регулировки, не сохраняются автоматически. Доступно 4 слота. Каждый переключатель, используемый для одновременной регулировки, требует эксклюзивного использования одного слота."\r
    },\r
    "firmwareFlasherReleaseSummaryHead": {\r
        "message": "Информация о выпуске"\r
    },\r
    "BLOCKED_SYSTEM_OVERLOADED": {\r
        "message": "Загрузка процессора"\r
    },\r
    "gpsOptions": {\r
        "message": "Опции GPS"\r
    },\r
    "osd_switch_indicator_settings": {\r
        "message": "Параметры отображения переключателей"\r
    },\r
    "failedToFlash": {\r
        "message": "Прошивка <span style=\\"color: red\\">не удалась</span>"\r
    },\r
    "pidTuning_FW_TPATimeConstantHelp": {\r
        "message": "Постоянная времени сглаживания и задержки TPA, отражающая не мгновенную реакцию самолёта на скорость/тягу."\r
    },\r
    "ledStripClearSelectedButton": {\r
        "message": "Очистить выбранное"\r
    },\r
    "yawPLimit": {\r
        "message": "Лимит P-составляющей рыскания"\r
    },\r
    "escRefreshRatelHelp": {\r
        "message": "ESC должен поддерживать частоту обновления. Изменяйте частоту обновления только в том случае, если вы уверены, что ESC её поддерживает!"\r
    },\r
    "osd_rssi_dbm_alarm_HELP": {\r
        "message": "Индикатор RSSI будет мигать, если значение ниже указанного. Диапазон значений: [-130,0]. 0 отключает это предупреждение."\r
    },\r
    "ledStripModeColorsModeBlinkBg": {\r
        "message": "Мигать в фоне"\r
    },\r
    "OnboardSDCard": {\r
        "message": "Встроенная SD-карта"\r
    },\r
    "serialPortUnrecoverable": {\r
        "message": "Невосстановимый <span style=\\"color: red\\">отказ</span> последовательного соединения, отключение..."\r
    },\r
    "initialSetupButtonResetZaxisValue": {\r
        "message": "Сбросить ось Z, смещение: $1°"\r
    },\r
    "setMixerProfile": {\r
        "message": "Настройки профиля микшера: <strong style=\\"color: #37a8db\\">$1</strong>"\r
    },\r
    "missionMultiAddNewMission": {\r
        "message": "Добавить новую миссию"\r
    },\r
    "targetPrefetchFailDFU": {\r
        "message": "Невозможно определить полётный контроллер: полётный контроллер в DFU"\r
    },\r
    "motorMixer": {\r
        "message": "Микшер моторов"\r
    },\r
    "adjustmentsFunction16": {\r
        "message": "Регулировка D-коэффициента крена"\r
    },\r
    "configurationAsyncMode": {\r
        "message": "Асинхронный режим"\r
    },\r
    "osd_font_impact": {\r
        "message": "Impact"\r
    },\r
    "failsafeStageTwoSettingsTitle": {\r
        "message": "Настройки"\r
    },\r
    "warning": {\r
        "message": "Предупреждение"\r
    },\r
    "dfu_erased_kilobytes": {\r
        "message": "<span style=\\"color: #37a8db\\">Успешно</span> стёрто $1 kB flash-памяти"\r
    },\r
    "stm32TimedOut": {\r
        "message": "STM32 - не отвечает, процесс прошивки: СБОЙ"\r
    },\r
    "servosLiveMode": {\r
        "message": "Включить live режим"\r
    },\r
    "GROUND_SPEED": {\r
        "message": "Скорость отн. земли/путевая скорость"\r
    },\r
    "mainHideLog": {\r
        "message": "Скрыть журнал"\r
    },\r
    "osdElement_MAP_SCALE_HELP": {\r
        "message": "Масштаб отображаемой в данный момент карты/радара."\r
    },\r
    "configurationSensorAlignmentMagYaw": {\r
        "message": "Рыскание"\r
    },\r
    "BLACKBOX_FEATURE_ATTITUDE": {\r
        "message": "Ориентация"\r
    },\r
    "configurationVTX": {\r
        "message": "VTX"\r
    },\r
    "stepTitle2": {\r
        "message": "Шаг 2"\r
    },\r
    "rthHomeAltitudeLabel": {\r
        "message": "Высота точки RTH"\r
    },\r
    "configurationEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранено</span>: Конфигурация"\r
    },\r
    "osd_left_sidebar_scroll": {\r
        "message": "Прокрутка левой панели"\r
    },\r
    "firmwareFlasherRecoveryHead": {\r
        "message": "<strong>Восстановление/потеря связи</strong>"\r
    },\r
    "osd_dji_HD_FPV": {\r
        "message": "DJI HD FPV"\r
    },\r
    "firmwareFlasherOptionLabelSelectFirmwareVersionFor": {\r
        "message": "Выберите версию прошивки для"\r
    },\r
    "colorMintGreen": {\r
        "message": "мятно-зелёный"\r
    },\r
    "configurationVoltageSource": {\r
        "message": "Источник питания для использования в системах оповещения и телеметрии"\r
    },\r
    "sitlSerialReceiverHelp": {\r
        "message": "Использовать приёмник (SBUS/CRSF/прочее.), подключённый к хосту через USB-to-UART адаптер или прокси полётного контроллера."\r
    },\r
    "portsTelemetryDisabled": {\r
        "message": "Отключено"\r
    },\r
    "portsFunction_OPFLOW": {\r
        "message": "Оптический поток"\r
    },\r
    "configurationBatterySettings": {\r
        "message": "Настройки батареи"\r
    },\r
    "receiverHelp": {\r
        "message": "Пожалуйста, прочтите главу документации о приёмнике. При необходимости настройте последовательный порт, режим приёмника (последовательный/ppm/pwm), провайдера (для последовательных приёмников), привяжите приёмник, установите карту каналов, настройте конечные точки/диапазон каналов на передатчике так, чтобы все каналы находились в диапазоне от ~1000 до ~2000. Установите среднюю точку (по умолчанию 1500), обрежьте каналы до 1500, настройте мёртвую зону стика, проверьте поведение, когда передатчик (TX) выключен или находится вне зоны действия. Убедитесь, что значения всех каналов увеличиваются, когда вы двигаете стики вверх и вправо. Если нет, инвертируйте канал в TX. Не применяйте никаких других миксов в TX.<br /><span style=\\"color: red\\">ВАЖНО:</span> Перед полётом прочтите главу документации по Failsafe и настройте его."\r
    },\r
    "featureGPSTip": {\r
        "message": "Сначала настройте сценарий порта"\r
    },\r
    "multimission_active_index_saved_eeprom": {\r
        "message": "Индекс активной миссии сохранён"\r
    },\r
    "minRthDistance": {\r
        "message": "Мин. расстояние RTH"\r
    },\r
    "brakingBoostDisengageSpeedTip": {\r
        "message": "Усиление торможения прекратится, когда скорость упадёт ниже этого значения"\r
    },\r
    "portsFunction_TELEMETRY_FRSKY": {\r
        "message": "FrSky"\r
    },\r
    "adjustmentsExample1": {\r
        "message": "Используйте слот 1 и 3-позиционный переключатель на CH5 для выбора между P, I и D (для тангажа/крена), а также ещё один 3-позиционный переключатель на CH6 для увеличения или уменьшения значения при удержании в верхнем или нижнем положении."\r
    },\r
    "ledStripWarningsOverlay": {\r
        "message": "Предупреждения"\r
    },\r
    "osd_baro_temp_alarm_min": {\r
        "message": "Минимальная температура барометра"\r
    },\r
    "tabGPS": {\r
        "message": "GPS"\r
    },\r
    "geozoneActionNone": {\r
        "message_en": "None",\r
        "message": "Ничего"\r
    },\r
    "osdElement_GPS_MAX_SPEED_HELP": {\r
        "message": "Показывает максимальную путевую скорость по GPS."\r
    },\r
    "adjustmentsEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранено</span>: корректировки"\r
    },\r
    "adjustmentsFunction37": {\r
        "message": "Регулировка I-коэффициента уровня"\r
    },\r
    "sensorsTemperature3": {\r
        "message": "Температура 3, °C"\r
    },\r
    "brakingSpeedThresholdTip": {\r
        "message": "Торможение будет включено только в том случае, если фактическая скорость превышает пороговое значение"\r
    },\r
    "adjustmentsFunction56": {\r
        "message": "Регулировка плавности управления"\r
    },\r
    "logPwmOutputDisabled": {\r
        "message": "Выход PWD отключен. Моторы и сервоприводы не будут работать. Чтобы включить используйте вкладку <u>«Моторы»</u>!"\r
    },\r
    "pidTuning_HeadingHold_Rate": {\r
        "message": "Скорость удержания курса (°/с)"\r
    },\r
    "connectionConnected": {\r
        "message": "Подключен к: $1"\r
    },\r
    "BLACKBOX_FEATURE_NAV_POS": {\r
        "message": "Оценка навигационного положения"\r
    },\r
    "colorMagenta": {\r
        "message": "пурпурный"\r
    },\r
    "stm32LocalEraseExtended": {\r
        "message": "Выполняется локальная очистка (путём расширенного стирания) ..."\r
    },\r
    "initialSetupBatteryDetectedCellsValue": {\r
        "message": "$1"\r
    },\r
    "servosChangeDirection": {\r
        "message": "Изменить направление в передатчике для соответствия"\r
    },\r
    "ledStripClearAllButton": {\r
        "message": "Очистить всё"\r
    },\r
    "functionId": {\r
        "message": "#"\r
    },\r
    "currentLanguage": {\r
        "message": "ru"\r
    },\r
    "failsafeFeaturesHelpOld": {\r
        "message": "Конфигурация Failsafe существенно изменилась. Используйте последнюю версию INAV"\r
    },\r
    "gsDeactivated": {\r
        "message": "Режим наземной стации деактивирован"\r
    },\r
    "initialSetupOpflowCalibStarted": {\r
        "message": "Калибровка оптического потока начата"\r
    },\r
    "maintenance": {\r
        "message": "Обслуживание"\r
    },\r
    "osdElement_PAN_SERVO_CENTRED_HELP": {\r
        "message": "Показывает, отцентрирован ли сервопривод панорамирования (0) или смещён (стрелки). Проверьте настройки <b>osd_pan_servo_</b> (\\"Настройки OSD сервопривода панорамирования\\") для конфигурации сервопривода панорамирования."\r
    },\r
    "configurationLaunchIdleThrHelp": {\r
        "message": "Холостая тяга - тяга, которая должна быть установлена до инициализации последовательности запуска. Если значение тяги установлено ниже минимального, это приведёт к принудительной остановке моторов или установит их на холостой ход (в зависимости от того, включена ли опция MOTOR_STOP). Если установлено выше минимального значения тяги, то будет принудительно установлено к этому значению (если MOTOR_STOP включен, оно будет обрабатываться в соответствии с положением стика газа). По умолчанию: 1000 [1000-2000]"\r
    },\r
    "uploadingCharacters": {\r
        "message": "Загрузка..."\r
    },\r
    "configurationSPIProtocol": {\r
        "message": "Протокол RX SPI"\r
    },\r
    "wpTrackingAngleHelp": {\r
        "message": "Угол, под которым аппарат приближается к линии маршрута (треку) путевых точек. Более низкие значения делают заход более протяжённым, тогда как более высокие могут вызвать промах (перелёт) путевой точки. Значение 60° является хорошей отправной точкой [30−80]."\r
    },\r
    "osd_custom_element_settings_HELP": {\r
        "message": "Чтобы получить подробную информацию о том, как использовать пользовательские элементы OSD, нажмите на значок ?"\r
    },\r
    "cliInputPlaceholder": {\r
        "message": "Напишите вашу команду здесь. Нажмите Tab для автодополнения."\r
    },\r
    "ledStripDirU": {\r
        "message": "U"\r
    },\r
    "emergencyDescentRate": {\r
        "message": "Скорость аварийной посадки"\r
    },\r
    "configurationThrottleMid": {\r
        "message": "Средняя тяга [центральное значение входов RC]"\r
    },\r
    "pidTuning_Other": {\r
        "message": "Прочее"\r
    },\r
    "ledStripS": {\r
        "message": "S"\r
    },\r
    "osd_dji_hide_unsupported": {\r
        "message": "Скрыть неподдерживаемые элементы"\r
    },\r
    "MagGainXText": {\r
        "message": "Прирост X"\r
    },\r
    "initialSetupBatteryHead": {\r
        "message": "Батарея"\r
    },\r
    "sensorsAirspeed": {\r
        "message": "Воздушная скорость, см/с"\r
    },\r
    "accCalibrationStartTitle": {\r
        "message": "Калибровка акселерометра"\r
    },\r
    "landSlowdownMinAlt": {\r
        "message": "Когда аппарат снизится до <i>этой</i> высоты, он замедлится до скорости приземления."\r
    },\r
    "osdElement_ESC_RPM": {\r
        "message": "Обороты мотора по данным телеметрии ESC"\r
    },\r
    "missionTemplateHead": {\r
        "message": "Шаблон миссии"\r
    },\r
    "wpEnforceAlt": {\r
        "message": "Принудительное соблюдение высоты на путевой точке"\r
    },\r
    "osd_adsb_distance_alert": {\r
        "message": "Оповещение о расстоянии ADSB"\r
    },\r
    "search": {\r
        "message": "Поиск"\r
    },\r
    "fwLandFinalApproachPitch2throttle": {\r
        "message": "Поправочный коэффициент соотношения тангажа к тяге на финальном участке захода на посадку"\r
    },\r
    "cliSaveToFileCompleted": {\r
        "message": "Вывод CLI успешно сохранён в файл"\r
    },\r
    "initialSetupVoltageScale": {\r
        "message": "Шкала напряжения:"\r
    },\r
    "receiverRcYawExpo": {\r
        "message": "RC экспонента по рысканию"\r
    },\r
    "geozoneSafehomeAsInclusive": {\r
        "message": "Считать Safehome включительным"\r
    },\r
    "osdElement_AZIMUTH_HELP": {\r
        "message": "Азимут — это направление движения аппарата относительно домашней точки. Он полезен для поддержания аппарата на правильном курсе или для удержания его перед фиксированной направленной антенной."\r
    },\r
    "fsMissionDelayHelp": {\r
        "message": "Определяет задержку в секундах, в течение которой INAV должен ждать, прежде чем будет активирован Failsafe RTH, если воздушное судно выполняет полёт по путевым точкам. Установите значение -1, чтобы полностью отключить failsafe. [Диапазон: 0-600с]"\r
    },\r
    "servoEmptyTableInfo": {\r
        "message": "Сервоприводы не настроены. Добавьте их, используя вкладку Микшер."\r
    },\r
    "featureRSSI_ADC": {\r
        "message": "Аналоговый вход RSSI"\r
    },\r
    "missionTotalInfoDistance": {\r
        "message": "Расстояние (м):"\r
    },\r
    "sitlSimulator": {\r
        "message": "Симулятор"\r
    },\r
    "firmwareFlasherFlashFirmware": {\r
        "message": "Прошить прошивку"\r
    },\r
    "osd_craft_name": {\r
        "message": "Название судна"\r
    },\r
    "ezTuneSnappiness": {\r
        "message": "Отзывчивость"\r
    },\r
    "firmwareFlasherFlashDevelopmentFirmware": {\r
        "message": "Использовать разрабатываемую прошивку"\r
    },\r
    "featureRSSI_ADCTip": {\r
        "message": "RSSI — это измерение уровня сигнала. По нему можно понять когда ваше судно выходит за пределы зоны действия или испытывает радиочастотные помехи."\r
    },\r
    "configurationAccelerometerFrequencyHelp": {\r
        "message": "Для акро-полёта это значение можно снизить"\r
    },\r
    "firmwareFlasherFullChipEraseDescription": {\r
        "message": "Очищает все данные о настройках, хранящиеся в памяти полётного контроллера."\r
    },\r
    "presetApplyHead": {\r
        "message": "Применятся следующие настройки:"\r
    },\r
    "osd_time_alarm": {\r
        "message": "Время полета (минуты)"\r
    },\r
    "osd_font_bold": {\r
        "message": "Жирный"\r
    },\r
    "osdElement_GLIDESLOPE_HELP": {\r
        "message": "Отношение горизонтального пройденного расстояния к единице потерянной высоты"\r
    },\r
    "failsafeProcedureItemSelect4": {\r
        "message": "Ничего не делать"\r
    },\r
    "osdElement_GPS_SATS_HELP": {\r
        "message": "Показывает количество спутников GPS, обнаруженных GPS-приёмником."\r
    },\r
    "configurationLaunchEndTime": {\r
        "message": "Время плавного завершения"\r
    },\r
    "initialSetupButtonBackup": {\r
        "message": "Резервное копирование"\r
    },\r
    "configMigrationSuccessful": {\r
        "message": "Миграция конфигурации завершена, миграции применены: $1"\r
    },\r
    "brakingBoostFactor": {\r
        "message": "Фактор усиления"\r
    },\r
    "sitlDemoMode": {\r
        "message": "Демо режим"\r
    },\r
    "failsafeRxMaxUsecItem": {\r
        "message": "Максимальная длительность"\r
    },\r
    "configurationLaunchSpinupTimeHelp": {\r
        "message": "Время для увеличения мощности с минимального газа до тяги запуска, чтобы избежать большой нагрузки на ECS и большого крутящего момента от пропеллера. По умолчанию: 100 [0-1000]"\r
    },\r
    "initialSetupRSSIValue": {\r
        "message": "$1 %"\r
    },\r
    "osdElement_WIND_SPEED_HORIZONTAL_HELP": {\r
        "message": "Показывает расчётную горизонтальную скорость и направление ветра."\r
    },\r
    "sensorStatusGyroShort": {\r
        "message": "Гиро.",\r
        "description": "Текст для иконок датчиков вверху. Сделайте его кратким."\r
    },\r
    "functionOperand": {\r
        "message": "Операнд"\r
    },\r
    "osd_decimals_distance": {\r
        "message": "Точность расстояния"\r
    },\r
    "fcFirmwareUpdateRequired": {\r
        "message": "Для использования этой функции необходимо обновить прошивку полётного контроллера до последней версии"\r
    },\r
    "missionTitleLoadMissionFile": {\r
        "message": "Загрузить файл миссии"\r
    },\r
    "missionTitleSaveEepromMission": {\r
        "message": "Сохранить миссию Eeprom"\r
    },\r
    "sensorAccelerometer": {\r
        "message": "Акселерометр"\r
    },\r
    "defaultDonateHead": {\r
        "message": "Открытый код / Пожертвования"\r
    },\r
    "stepTitle3": {\r
        "message": "Шаг 3"\r
    },\r
    "serialPortOpened": {\r
        "message": "MSP соединение <span style=\\"color: #37a8db\\">успешно</span> открыто с ID: $1"\r
    },\r
    "firmwareFlasherOnlineSelectBoardDescription": {\r
        "message": "Выберите свою плату, чтобы просмотреть доступные онлайн-версии прошивок. Выберите правильную прошивку, подходящую для вашей платы. Обратите внимание, что <strong>Автоматический выбор полётного контроллера</strong> будет работать только для прошивок INAV 5.0 и новее."\r
    },\r
    "stm32LocalErase": {\r
        "message": "Выполняется локальное стирание ..."\r
    },\r
    "ledStripEnableStrobeLightEffectText": {\r
        "message": "Включить стробоскопический эффект"\r
    },\r
    "pidTuning_Expo_Yaw": {\r
        "message": "Рыскание (%)"\r
    },\r
    "sensorsAltitudeSelect": {\r
        "message": "Барометр"\r
    },\r
    "multirotorBrakingConfiguration": {\r
        "message": "Настройка режима торможения коптера"\r
    },\r
    "sitlStopped": {\r
        "message": "SITL остановлен\\n"\r
    },\r
    "featurePWM_SERVO_DRIVERTip": {\r
        "message": "Используйте внешний PWM-драйвер PCA9685 для подключения до 16 сервоприводов к полётному контроллеру. Для включения этой функции необходимо подключить PCA9685."\r
    },\r
    "showAdvancedPIDs": {\r
        "message": "Показать расширенные настройки PID-регулятора"\r
    },\r
    "missionActionMenuHead": {\r
        "message": "Меню действий"\r
    },\r
    "wpTrackingAccuracy": {\r
        "message": "Точность следования по путевым точкам"\r
    },\r
    "mappingTableFunction": {\r
        "message": "Функция"\r
    },\r
    "configurationReceiver": {\r
        "message": "Режим приёмника"\r
    },\r
    "pidTuningTPABreakPointHelp": {\r
        "message": "Ослабление PID-регулятора по тяге начинается, когда положение тяги превышает это значение. "\r
    },\r
    "adjustmentsFunction4": {\r
        "message": "Регулировка коэффициентов скорости крена и тангажа"\r
    },\r
    "configurationVTXChannel": {\r
        "message": "Канал"\r
    },\r
    "usbDeviceCloseFail": {\r
        "message": "<span style=\\"color: red\\">Сбой</span> при отключении USB устройства"\r
    },\r
    "waypointRadiusHelp": {\r
        "message": "Этот параметр задаёт расстояние от путевой точки, при достижении которого (аппаратом) она считается пройденной (достигнутой)."\r
    },\r
    "osdElement_ONTIME_FLYTIME_HELP": {\r
        "message_en": "Shows \\"On Time\\" while unarmed and \\"Fly Time\\" while armed.",\r
        "message_inav": "Показывает «Ontime», если не запущен, и «Flytime», если запущен.",\r
        "message": "Показывает «On Time», если не взведён, и «Fly Time», если взведён."\r
    },\r
    "AccBtn": {\r
        "message": "Калибровать акселерометр"\r
    },\r
    "accNotchHzHelp": {\r
        "message": "Разрешает установку одиночного режекторного фильтра для данных акселерометра. Должен быть настроен так же, как режекторный фильтр гироскопа, если акселерометр фиксирует пик шума выше, чем ФНЧ акселерометра"\r
    },\r
    "mixerApplyModalTitle": {\r
        "message": "Подтвердить"\r
    },\r
    "options_title": {\r
        "message": "Настройки приложения"\r
    },\r
    "pidTuning_dtermLpfCutoffFrequencyHelp": {\r
        "message": "Фильтр нижних частот для D-составляющей для всех PID-регуляторов"\r
    },\r
    "configurationAttitudeFrequencyTitle": {\r
        "message_en": "Attitude task frequency",\r
        "message_inav": "Частота задач на отношение",\r
        "message": "Частота задачи ориентации"\r
    },\r
    "dataflashSavingTitle": {\r
        "message": "Сохранение dataflash в файл"\r
    },\r
    "receiverChannelMapTitle": {\r
        "message": "Вы можете определить Вашу собственную карту каналов нажав на это поле"\r
    },\r
    "sitlUseImuHelp": {\r
        "message": "Используйте данные датчика IMU из симулятора вместо использования данных об ориентации напрямую из симулятора (экспериментальный вариант, не рекомендуется)."\r
    },\r
    "configurationGPS": {\r
        "message": "Конфигурация"\r
    },\r
    "configurationLaunchMinTimeHelp": {\r
        "message": "Разрешить режиму запуска выполняться как минимум это время [мс] и игнорировать движения стиков. По умолчанию: 0 [0-60000]"\r
    },\r
    "sensorDataFlashNotFound": {\r
        "message_beta": "Отсутствует <br>модуль памяти",\r
        "message": "Отсутствует <br>модуль памяти"\r
    },\r
    "firmwareFlasherReleaseDate": {\r
        "message": "Дата:"\r
    },\r
    "MissionPlannerJumpTargetRemoval": {\r
        "message": "Вы не можете удалить маршрутную точку, которая определена как цель команды JUMP! \\nСначала вам нужно удалить цель на путевой точке, запускающей JUMP."\r
    },\r
    "missionGroundDist": {\r
        "message": "Расстояние по земле (м):"\r
    },\r
    "statusbar_packet_error": {\r
        "message": "Ошибки пакетов:"\r
    },\r
    "sitlSerialProtocoll": {\r
        "message": "Предустановка настроек последовательного порта для RX протокола подключённого приёмника"\r
    },\r
    "motorStopWarning": {\r
        "message": "Должен быть включен на самолётах, роверах и лодках. Не следует включать на мультикоптерах! На мультикоптерах, когда активен режим Airmode, моторы не останоаятся."\r
    },\r
    "gyroLpfCutoffFrequency": {\r
        "message": "Частота среза ФНЧ гироскопа"\r
    },\r
    "navmcAltholdThrottle": {\r
        "message": "Положение стика для зависания в режиме удержания высоты"\r
    },\r
    "minThrottleDownPitch": {\r
        "message_en": "Min Throttle Down Pitch",\r
        "message_inav": "Мин. шаг газа вниз",\r
        "message": "Мин. тангаж для снижения газа"\r
    },\r
    "rthSafeHomeDistance": {\r
        "message": "Максимальное расстояние для безопасного дома"\r
    },\r
    "osdElement_GPS_SPEED": {\r
        "message": "Путевая скорость"\r
    },\r
    "magnetometerHead": {\r
        "message": "Инструмент выравнивания"\r
    },\r
    "osdElement_GVAR_3": {\r
        "message": "Глобальная переменная 3"\r
    },\r
    "portsPeripherals": {\r
        "message": "Периферия"\r
    },\r
    "options_unit_type": {\r
        "message": "Выберете способ отображения единиц (только в конфигураторе)"\r
    },\r
    "maxDiveAngleHelp": {\r
        "message": "Максимальный угол снижения в навигационных режимах. Ограничено максимальным углом тангажа на вкладке «PID настройки»."\r
    },\r
    "mixerNotConfigured": {\r
        "message": "Микшер не настроен. Настроить его можно на вкладке <u>«Микшер»</u>."\r
    },\r
    "missionDefaultSafeRangeSH": {\r
        "message": "Радиус (м): "\r
    },\r
    "logicOperandB": {\r
        "message": "Операнд B"\r
    },\r
    "logicStatus": {\r
        "message": "Статус"\r
    },\r
    "pidTuning_PIDmain": {\r
        "message_en": "Main PID Gains",\r
        "message": "Основные PID-коэффициенты"\r
    },\r
    "firmwareFlasherOptionLabelSelectFirmware": {\r
        "message": "Выбрать прошивку / плату"\r
    },\r
    "configurationAccelTrims": {\r
        "message": "Триммирование акселерометра"\r
    },\r
    "weight": {\r
        "message": "Вес (%)"\r
    },\r
    "pidTuning_MatrixFilterType": {\r
        "message": "Тип матричного фильтра"\r
    },\r
    "configurationHeadtrackerRollRatio": {\r
        "message": "Коэффициент движения крена трекера головы"\r
    },\r
    "mcWpSlowdownHelp": {\r
        "message": "Если эта функция включена, двигатель NAV будет замедляться при переходе к следующей путевой точке. Это отдаёт приоритет повороту, а не поступательному движению. Если отключено, двигатель NAV продолжит движение к следующей путевой точке и развернётся по ходу движения."\r
    },\r
    "ledStripModeColorsModeHeadfree": {\r
        "message": "Headfree"\r
    },\r
    "brakingBankAngleTip": {\r
        "message": "Максимальный угол крена, допустимый во время фазы торможения"\r
    },\r
    "mixerSaved": {\r
        "message": "Микшер <span style=\\"color: #37a8db\\">сохранен</span>"\r
    },\r
    "osdElement_MESSAGES": {\r
        "message": "Системные сообщения"\r
    },\r
    "pidTuning_Rates_Stabilized": {\r
        "message": "Стабилизированные расходы"\r
    },\r
    "osd_hud_wp_disp": {\r
        "message": "Макс. количество путевых точек на экране."\r
    },\r
    "servosMid": {\r
        "message": "Сер."\r
    },\r
    "osd_hud_settings": {\r
        "message": "Настройки индикатора полётных данных"\r
    },\r
    "sitlIpHelp": {\r
        "message": "IP-адрес компьютера, на котором запущен симулятор. Если симулятор работает на том же компьютере, оставьте значение «127.0.0.1»"\r
    },\r
    "osdElement_IMU_TEMPERATURE": {\r
        "message": "Температура IMU"\r
    },\r
    "configurationCurrentOffset": {\r
        "message": "Смещение в милливольтных шагах"\r
    },\r
    "osdElement_GVAR_0": {\r
        "message": "Глобальная переменная 0"\r
    },\r
    "adjustmentsGroupPIDTuning": {\r
        "message": "Настройка PID"\r
    },\r
    "sensorsAccelerometer": {\r
        "message": "Акселерометр, g"\r
    },\r
    "connectionBleInterrupted": {\r
        "message": "Связь неожиданно прервалась."\r
    },\r
    "mappingTableTitle": {\r
        "message": "Сопоставление выходов"\r
    },\r
    "featureBAT_PROFILE_AUTOSWITCH": {\r
        "message": "Автоматический выбор профиля батареи"\r
    },\r
    "adjustmentsFunction26": {\r
        "message": "Ручная регулировка RC-экспоненты"\r
    },\r
    "looptimeNotAdvised": {\r
        "message": "PID-контур может быть нестабильным при использовании GPS"\r
    },\r
    "boardInfoReceived": {\r
        "message": "Плата: <strong>$1</strong>, версия: <strong>$2</strong>"\r
    },\r
    "geozoneAvoidAltitudeRangeHelp": {\r
        "message": "Диапазон высот, в котором предпринимается попытка избежать прохождения геозоны с набором высоты"\r
    },\r
    "osdElement_GLIDESLOPE": {\r
        "message": "Глиссада"\r
    },\r
    "throttle_scale_help": {\r
        "message": "Позволяет ограничить эффективную мощность, подаваемую на моторы. Значение 1.0 означает отсутствие ограничения мощности. 0.5 — что сигнал тяги будет уменьшен вдвое перед его передачей на моторы."\r
    },\r
    "pidTuning_MaxRollAngle": {\r
        "message": "Макс. угол крена"\r
    },\r
    "gyroLpfNotAdvisedMessage": {\r
        "message": "Рекомендуется выбрать более высокую частоту среза"\r
    },\r
    "configuration3dDeadbandLow": {\r
        "message": "Мёртвая зона реверсивных моторов, нижний предел"\r
    },\r
    "receiverRcRate": {\r
        "message": "RC коэффициент"\r
    },\r
    "featurePWM_OUTPUT_ENABLETip": {\r
        "message": "Включение этой опции необходимо для того, чтобы INAV отправлял сигналы на ESC. Это мера предосторожности, которая предотвращает повреждение сервоприводов сразу после прошивки контроллера полёта."\r
    },\r
    "pidD": {\r
        "message": "D-коэффициент"\r
    },\r
    "missionWpType": {\r
        "message": "Тип:"\r
    },\r
    "initialSetupBatteryVoltage": {\r
        "message": "Напряжение батареи:"\r
    },\r
    "sitlSimIP": {\r
        "message": "IP симулятора"\r
    },\r
    "BLACKBOX_FEATURE_GYRO_PEAKS_ROLL": {\r
        "message": "Пиковая частота шума гироскопа. Крен"\r
    },\r
    "configurationGimbalRollChannel": {\r
        "message": "Канал крена"\r
    },\r
    "geozoneUnableToSave": {\r
        "message": "Не удалось сохранить геозоны: некорректные зоны"\r
    },\r
    "missionTotalInformationHead": {\r
        "message": "Общая информация"\r
    },\r
    "osdElement_MAIN_BATT_REMAINING_PERCENTAGE": {\r
        "message": "Заряд батареи (%)"\r
    },\r
    "tabPorts": {\r
        "message": "Порты"\r
    },\r
    "communityRCGroupsSupport": {\r
        "message": "Поддержка RC группами"\r
    },\r
    "colorBlack": {\r
        "message": "чёрный"\r
    },\r
    "gyroLpfSuggestedMessage": {\r
        "message": "Это рекомендуемая настройка для всех мультироторов с размером пропеллеров менее 8&quot;. Всегда проверяйте температуру моторов после первого полёта"\r
    },\r
    "configurationAutoDisarmDelayHelp": {\r
        "message": "Используется только для взведения стиками (т.е. не с помощью тумблера)"\r
    },\r
    "featureDYNAMIC_FILTERSTip": {\r
        "message": "Использовать автоматический анализ гироскопа с помощью FFT (быстрого преобразования Фурье), чтобы настроить режекторные фильтры для подавления шума гироскопа. Должен быть включён постоянно!"\r
    },\r
    "SafehomeAlt": {\r
        "message": "Высота"\r
    },\r
    "loiterDirectionLabel": {\r
        "message": "Направление ожидания"\r
    },\r
    "adjustmentsSlot0": {\r
        "message": "Слот 1"\r
    },\r
    "configurationWiggleWakeIdleHelp": {\r
        "message": "Если эта функция включена, то \\"пошевелив\\" (качнув) аппарат по оси рыскания, можно \\"пробудить\\" моторы из холостого хода.<br />0: Отключено (по умолчанию)<br />1: 1 \\"шевеление\\" — Эта настройка имеет более высокий порог обнаружения, для самолётов без хвостового оперения, которые легко перемещаются.<br />2: 2 \\"шевеления\\" — Эта настройка имеет более низкий порог обнаружения, но требует повторного действия. Это предназначено для более крупных моделей и самолётов с хвостом"\r
    },\r
    "osdElement_COURSE_NEXT_GEOZONE": {\r
        "message": "Курс до следующей геозоны"\r
    },\r
    "osdElement_MAP_NORTH": {\r
        "message": "Карта (Север наверху)"\r
    },\r
    "osdElement_LQ_DOWNLINK": {\r
        "message": "Качество исходящего канала связи RX (%)"\r
    },\r
    "featureSOFTSERIALTip": {\r
        "message": "После включения настройте порты во вкладке «Порты»."\r
    },\r
    "portsIdentifier": {\r
        "message": "Идентификатор"\r
    },\r
    "ezTuneStabilityTips": {\r
        "message": "Определяет силу долговременной стабилизации. Большинство современных квадрокоптеров должны выдерживать «стабильность» даже до 120-130. Обычно вообще не требует настройки. Если БПЛА страдает от турбулентного потока от пропеллеров во время вертикального снижения, снижение параметра «Стабилизация» может помочь. Это эквивалент I-составляющей"\r
    },\r
    "pidTuning_Max_Pitch": {\r
        "message": "Тангаж (°/10)"\r
    },\r
    "savingDefaults": {\r
        "message": "Устройство - <span style=\\"color: red\\">Сохранение настроек по умолчанию</span>"\r
    },\r
    "getRunningOS": {\r
        "message": "Запущен на ОС: <strong>"\r
    },\r
    "osdElement_G_FORCE_Z": {\r
        "message": "Вертикальная перегрузка в системе координат аппарата (по оси Z)"\r
    },\r
    "ezTuneRatePreviewAxis": {\r
        "message": "Ось"\r
    },\r
    "osdUnitUK": {\r
        "message": "Британские единицы"\r
    },\r
    "portsConfiguration": {\r
        "message": "Данные"\r
    },\r
    "fixedWingLandingConfiguration": {\r
        "message": "Параметры посадки для аппаратов самолётного типа"\r
    },\r
    "configurationButtonSave": {\r
        "message": "Сохранить и перезагрузить"\r
    },\r
    "failsafeDelayItem": {\r
        "message": "Время задержки активации после потери сигнала [В децисекундах (дс): 1дс = 0.1 сек.]"\r
    },\r
    "missionEllipsoidEarthDEMModel": {\r
        "message": "Использовать эллипсоид вместо SL DEM: "\r
    },\r
    "tabFilteringAdvanced": {\r
        "message": "Другие фильтры"\r
    },\r
    "osd_pan_servo_settings_HELP": {\r
        "message": "В этом разделе включается и настраивается функция смещения сервопривода панорамирования. Он используется для того, чтобы элементы OSD, такие как стрелка домой и POI, указывали в правильном направлении даже когда вы поворачиваете камеру."\r
    },\r
    "configurationFeaturesHelp": {\r
        "message": "<strong>Примечание:</strong> не все комбинации функций действительны. Когда прошивка полётного контроллера обнаруживает недопустимые комбинации функций, конфликтующие функции будут отключены.<br /><strong>Примечание:</strong> настройте последовательные порты <span style=\\"color: red\\">перед</span> включением функций, которые будут использовать порты."\r
    },\r
    "initialSetupEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранён</span>: настройки"\r
    },\r
    "configurationBatteryScale": {\r
        "message": "Масштаб напряжения"\r
    },\r
    "w_xy_gps_v": {\r
        "message": "Коэффициент доверия GPS для горизонтальной скорости"\r
    },\r
    "firmwareFlasherNoReboot": {\r
        "message": "Без перезагрузки"\r
    },\r
    "pidTuning_ManualPitchRate": {\r
        "message": "Ручная скорость тангажа"\r
    },\r
    "notifications_click_here_to_start_app": {\r
        "message": "Нажмите сюда, чтобы запустить приложение"\r
    },\r
    "osd_switch_indicators_align_left": {\r
        "message": "Выровнять имена переключателей слева от переключателей"\r
    },\r
    "featureONESHOT125": {\r
        "message": "Поддержка ONESHOT ESC"\r
    },\r
    "configurationHeadtracker": {\r
        "message": "Система слежения за головой"\r
    },\r
    "osd_plus_code_digits": {\r
        "message": "Точность Plus Code"\r
    },\r
    "configurationCurrentScaleHelp": {\r
        "message": "Масштабирование выходного напряжения до миллиампер [1/10 мВ/А]"\r
    },\r
    "loggingSamplesSaved": {\r
        "message": "Сохранено семплов:"\r
    },\r
    "configurationLaunchVelocityHelp": {\r
        "message": "Пороговое значение скорости движения вперёд для обнаружения запуска с размаха. По умолчанию: 300 [100-10000]"\r
    },\r
    "rthEnergyMarginHelp": {\r
        "message": "Требуемый запас энергии (в процентах от полной ёмкости аккумулятора), который должен остаться после возвращения домой. Используется при расчёте оставшегося времени/расстояния полета."\r
    },\r
    "options_showProfileParameters": {\r
        "message": "Подсвечивать параметры, которые изменяются при переключении батареи или профилей управления"\r
    },\r
    "loadedReleaseInfo": {\r
        "message": "Загружена информация о выпуске с GitHub."\r
    },\r
    "osdUnitUKTip": {\r
        "message": "Использовать британские единицы, за исключением температуры, которая отображается в градусах Цельсия."\r
    },\r
    "editPointButtonSave": {\r
        "message": "Сохранить"\r
    },\r
    "sensorStatusSonar": {\r
        "message": "Сонар/Дальномер"\r
    },\r
    "ledStripFunctionGPSOption": {\r
        "message": "GPS"\r
    },\r
    "altControlResponseHelp": {\r
        "message": "Регулирует реакцию системы управления высотой аппарата с фиксированным крылом по мере приближения к целевой высоте. Более высокие значения обостряют реакцию управления высотой, но могут также привести к чрезмерному перелёту (промаху) или нестабильности по тангажу, если установлены слишком высоко."\r
    },\r
    "ledStripBlinkTitle": {\r
        "message": "Мигание"\r
    },\r
    "featureREVERSIBLE_MOTORS": {\r
        "message": "Режим реверсивных двигателей (для использования с реверсивными ECS)"\r
    },\r
    "missionGeozoneReboot": {\r
        "message": "Вы хотите сохранить и перезагрузить?"\r
    },\r
    "adjustmentsFunction21": {\r
        "message": "Регулировка CD/FF-коэффициентов рыскания"\r
    },\r
    "cliInfo": {\r
        "message": "<strong>Примечание:</strong> Выход из вкладки CLI или нажатие «Отключить» <strong>автоматически</strong> пошлёт команду \\"<strong>exit</strong>\\" в полётный контроллер. С последней прошивкой это вызовет его <span style=\\"color: red\\">перезагрузку</span> и несохранённые изменения будут <span style=\\"color: red\\">потеряны</span>."\r
    },\r
    "dterm_lpf_type_help": {\r
        "message": "BIQUAD обеспечивает лучшее подавление шума ценой более высокой задержки. PT1 имеет меньшее ослабление шума, но обеспечивает меньшую задержку."\r
    },\r
    "multiRotorNavigationConfiguration": {\r
        "message": "Настройки навигации мультикоптера"\r
    },\r
    "apiVersionReceived": {\r
        "message": "<span style=\\"color: #37a8db\\">Получена</span> версия MultiWii API: <strong>$1</strong>"\r
    },\r
    "mixerProfile1": {\r
        "message": "Профиль микшера 1"\r
    },\r
    "startSendingSafehomePoints": {\r
        "message": "Начало отправки точек Safehome"\r
    },\r
    "configurationEscFeatures": {\r
        "message": "Настройки ESC/Моторов"\r
    },\r
    "portsFunction_RUNCAM_DEVICE_CONTROL": {\r
        "message": "Устройство RunCam"\r
    },\r
    "ledStripFunctionSection": {\r
        "message": "LED функции"\r
    },\r
    "geozoneMinAlt": {\r
        "message": "Мин. высота (см):"\r
    },\r
    "initialSetupButtonResetZaxis": {\r
        "message": "Сбросить ось Z, смещение: 0°"\r
    },\r
    "SafehomeSafeRadius": {\r
        "message": "Безопасный радиус (м):"\r
    },\r
    "dataflashButtonSaveFile": {\r
        "message": "Сохранено в файл..."\r
    },\r
    "cliSaveToFileFailed": {\r
        "message": "Не удалось сохранить вывод CLI в файл"\r
    },\r
    "auxiliaryEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранено</span>"\r
    },\r
    "mcWpSlowdown": {\r
        "message": "Снижать скорость при приближении к путевой точке"\r
    },\r
    "sensorProfile1": {\r
        "message": "PID профиль 1"\r
    },\r
    "landSlowdownMaxAlt": {\r
        "message": "Когда аппарат снизится до <i>этой</i> высоты, он начнёт замедляться для приземления."\r
    },\r
    "cliSaveSettingsBtn": {\r
        "message": "Сохранить настройки"\r
    },\r
    "osd_crosshairs_style": {\r
        "message": "Стиль перекрестия"\r
    },\r
    "sitlLog": {\r
        "message": "Журнал"\r
    },\r
    "servosMin": {\r
        "message": "Мин."\r
    },\r
    "osd_dji_speed_source": {\r
        "message": "Источник <i>3D скорости</i>"\r
    },\r
    "osdElement_TX_POWER_UPLINK": {\r
        "message": "Мощность TX (мВт)"\r
    },\r
    "errorWritingFileXml2jsNotFound": {\r
        "message": "<span style=\\"color: red\\">Ошибка записи файла (xml2js не найден)</span>"\r
    },\r
    "sensorsTemperatureValue": {\r
        "message": "значение:"\r
    },\r
    "configurationBatteryCells": {\r
        "message": "Количество ячеек (0 = авто)"\r
    },\r
    "fwLandMaxTailwindHelp": {\r
        "message": "Это значение используется, когда посадка против встречного ветра невозможна. При этом скорости ветра ниже указанного значения игнорируются (чтобы исключить ошибки измерения ветра в системе INAV)."\r
    },\r
    "sensorProfile3": {\r
        "message": "PID профиль 3"\r
    },\r
    "missionFwLandingSettings": {\r
        "message": "Параметры посадки с фиксированным крылом:"\r
    },\r
    "gpsMapHead": {\r
        "message": "Текущее местоположение"\r
    },\r
    "osdElement_RTC_TIME": {\r
        "message": "Текущее время"\r
    },\r
    "geozoneSafehomeZoneAction": {\r
        "message": "Действие в зоне safehome"\r
    },\r
    "geozoneInfiniteAlt": {\r
        "message": "0 = Бесконечная высота"\r
    },\r
    "initialSetupBatteryRemainingCapacityValue": {\r
        "message": "$1 $2"\r
    },\r
    "osd_home_position_arm_screen": {\r
        "message": "Позиция «Дом» на экране взведения"\r
    },\r
    "softSerialWarning": {\r
        "message": "Не рекомендуется использовать SoftSerial для устройств, критически важных для полёта, таких как GPS или приёмник, а также для устройств с высокой интенсивностью трафика, таких как MSP DisplayPort."\r
    },\r
    "ledStripEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранено</span>: LED"\r
    },\r
    "escProtocolExperimental": {\r
        "message": "Экспериментальный протокол ESC, используйте на свой страх и риск"\r
    },\r
    "pidTuning_PIDother": {\r
        "message": "Дополнительные PID-коэффициенты"\r
    },\r
    "yawItermIgnoreRate": {\r
        "message": "Скорость игнорирования I-составляющей по рысканию"\r
    },\r
    "cliMscBtn": {\r
        "message": "Blackbox (MSC)"\r
    },\r
    "BLOCKED_ACCELEROMETER_NOT_CALIBRATED": {\r
        "message": "Акселерометр откалиброван"\r
    },\r
    "brakingTimeoutTip": {\r
        "message": "Мера безопасности. Это самый длительный период времени, в течение которого может быть активно торможение."\r
    },\r
    "serialPortOpenFail": {\r
        "message": "<span style=\\"color: red\\">Не удалось</span> открыть MSP соединение"\r
    },\r
    "missionGeozoneTypeCircular": {\r
        "message": "Круг"\r
    },\r
    "initialSetupMaxCellV": {\r
        "message": "Макс. напряжение ячейки:"\r
    },\r
    "dterm_lpf2_hz_help": {\r
        "message": "Частота среза ФНЧ для D-составляющей по осям крена и тангажа. 0 означает, что фильтр отключен"\r
    },\r
    "firmwareFlasherShowDevelopmentReleasesDescription": {\r
        "message": "Показать rc-версии (кандидаты для выпуска) и разрабатываемые версии."\r
    },\r
    "geozoneInvalidLat": {\r
        "message": "Некорректная широта"\r
    },\r
    "osd_custom_element_settings": {\r
        "message": "Пользовательские элементы OSD"\r
    },\r
    "pidTuning_Basic": {\r
        "message": "Базовый/Акро"\r
    },\r
    "missionDefaultSettingsHead": {\r
        "message": "Настройки по умолчанию"\r
    },\r
    "autoConnect": {\r
        "message": "Автоподключение"\r
    },\r
    "servosEepromSave": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранён</span>"\r
    },\r
    "defaultsDialogInfo": {\r
        "message": "INAV Configurator хотел бы узнать, какой тип БПЛА вы настраиваете. На основе этой информации он изменит некоторые значения по умолчанию, чтобы обеспечить наилучшие полётные характеристики. "\r
    },\r
    "configurationLaunchThrHelp": {\r
        "message": "Тяга запуска – тяга, которая будет установлена во время запуска. По умолчанию: 1700 [1000-2000]"\r
    },\r
    "reset": {\r
        "message": "Сброс"\r
    },\r
    "tabSitl": {\r
        "message": "SITL"\r
    },\r
    "missionTotalInfoMissionValid": {\r
        "message": "Миссия действительна"\r
    },\r
    "missionFwApproachAlt": {\r
        "message": "Высота захода на посадку (см):"\r
    },\r
    "proxyLayer": {\r
        "message": "Слой MapProxy"\r
    },\r
    "programmingEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранено</span>: Программирование"\r
    },\r
    "osd_neg_alt_alarm": {\r
        "message": "Отрицательная высота"\r
    },\r
    "posholdMaxSpeed": {\r
        "message": "Максимальная скорость навигации"\r
    },\r
    "initialSetupMixerHead": {\r
        "message": "Тип микшера"\r
    },\r
    "fcInfoReceived": {\r
        "message": "Информация о полётном контроллере, идентификатор: <strong>$1</strong>, версия: <strong>$2</strong>"\r
    },\r
    "sensorDataFlashFreeSpace": {\r
        "message": "Флеш-память:<br />пуста "\r
    },\r
    "defaultSponsorsHead": {\r
        "message": "INAV поддерживается"\r
    },\r
    "cliConfirmSnippetNote": {\r
        "message": "<strong>Примечание</strong>: Вы можете просматривать и редактировать команды перед выполнением."\r
    },\r
    "dataflashNote": {\r
        "message": "Журнал (логи) полёта может быть записан на встроенную память вашего полётного контроллера."\r
    },\r
    "firmwareFlasherProgress": {\r
        "message": "Прогресс:"\r
    },\r
    "startSendPoint": {\r
        "message": "Начало отправки точек"\r
    },\r
    "missionMultiUpdateAll": {\r
        "message": "Обновить все"\r
    },\r
    "dterm_lpf2_type_help": {\r
        "message": "BIQUAD обеспечивает лучшее подавление шума ценой более высокой задержки. PT1 имеет меньшее ослабление шума, но обеспечивает меньшую задержку."\r
    },\r
    "firmwareFlasherReleaseNotes": {\r
        "message": "Примечания к выпуску:"\r
    },\r
    "tabEzTune": {\r
        "message": "Ez Tune"\r
    },\r
    "pidTuning_Rates_Yaw": {\r
        "message": "Рыскание (°/с)"\r
    },\r
    "ezTuneResponse": {\r
        "message": "Отклик"\r
    },\r
    "firmwareFlasherPath": {\r
        "message": "Путь:"\r
    },\r
    "missionRTHsettingsTitle": {\r
        "message": "Настройки RTH"\r
    },\r
    "pidTuning_LoadedProfile": {\r
        "message": "Загруженный профиль: <strong style=\\"color: #37a8db\\">$1</strong>"\r
    },\r
    "gyroLpfWhyNotSlightlyHigherMessage": {\r
        "message": "Если нет проблем с вибрацией и моторы не перегреваются, попробуйте установить 188Гц вместо текущего значения"\r
    },\r
    "pitchToThrottleThreshold": {\r
        "message": "Порог мгновенной корректировки тяги"\r
    },\r
    "pitchToThrottleThresholdHelp": {\r
        "message": "Автопилот будет мгновенно без сглаживания корректировать уровень тяги в соответствии с отношения тангажа к тяге, если угол тангажа отклоняется от фильтрованного значения на величину, превышающую это число (в сантиградусах, сотых долях градуса)."\r
    },\r
    "adjustmentsFunction19": {\r
        "message": "Регулировка I-коэффициента рыскания"\r
    },\r
    "MagGainZText": {\r
        "message": "Прирост Z"\r
    },\r
    "connectionBleType": {\r
        "message": "Тип устройства BLE: $1"\r
    },\r
    "failsafeUseMinimumDistanceHelp": {\r
        "message": "Включите эту опцию, если вам требуется альтернативное поведение Failsafe, когда аппарат находится близко к дому. Например, разработчик этой функции использовал её для самолёта, который переходит в Failsafe при отсоединении крыльев во время посадки, когда процедура возврата домой (RTH), обычно необходимая в полёте, уже не нужна или нежелательна."\r
    },\r
    "BLOCKED_HARDWARE_FAILURE": {\r
        "message": "Состояние оборудования"\r
    },\r
    "minThrottleDownPitchHelp": {\r
        "message": "Автоматический угол снижения тангажа при нулевой тяге в режиме ANGLE. Применяется прогрессивно в диапазоне между крейсерской тягой и нулевой тягой."\r
    },\r
    "outputStatsTableCurrent": {\r
        "message": "Ток [A]"\r
    },\r
    "cliSaveToFileAborted": {\r
        "message": "Сохранение вывода CLI в файл было прервано"\r
    },\r
    "accLpfCutoffFrequency": {\r
        "message": "Частота среза ФНЧ акселерометра"\r
    },\r
    "connectionUdpTimeout": {\r
        "message": "Время ожидания UDP-соединения истекло."\r
    },\r
    "rthHomeAltitudeHelp": {\r
        "message": "Используется, когда вы не приземляетесь в домашней точке. По прибытии домой, аппарат замедлится и изменит высоту на высоту точки RTH. По умолчанию установлено значение 0, что означает, что функция отключена."\r
    },\r
    "posholdMaxClimbRate": {\r
        "message": "Макс. скорость набора высоты при навигации [см/с]"\r
    },\r
    "configurationLaunchSpinupTime": {\r
        "message": "Время раскрутки двигателя"\r
    },\r
    "tabMissionControl": {\r
        "message": "Управление миссией"\r
    },\r
    "pidTuning_fw_level_pitch_trim_help": {\r
        "message": "Триммирование по тангажу для режимов полета с автовыравниванием. В градусах. +5 означает, что нос самолёта должен быть поднят на 5 градусов относительно горизонта"\r
    },\r
    "yawJumpPreventionLimit": {\r
        "message": "Предотвращение скачка по рысканию"\r
    },\r
    "adjustmentsFunction1": {\r
        "message": "Регулировка коэффициентов RC"\r
    },\r
    "gyroStage2LpfCutoffFrequency": {\r
        "message": "Частота среза ФНЧ гироскопа, этап 2"\r
    },\r
    "failsafeKillSwitchHelp": {\r
        "message": "Установите этот параметр, чтобы переключатель Failsafe, настроенный на вкладке «Режимы», действовал как прямое аварийное отключение, минуя выбранную процедуру Failsafe. <strong>Примечание:</strong> взведение блокируется, когда аварийный выключатель Failsafe находится во включеном положении"\r
    },\r
    "paste": {\r
        "message": "Вставить"\r
    },\r
    "colorOrange": {\r
        "message": "оранжевый"\r
    },\r
    "cliClearOutputHistoryBtn": {\r
        "message": "Очистить экран"\r
    },\r
    "osd_pilot_name": {\r
        "message": "Имя пилота"\r
    },\r
    "backupFileUnmigratable": {\r
        "message": "Предоставленный файл резервной копии был создан предыдущей версией конфигуратора и не подлежит миграции. Извините."\r
    },\r
    "controlSmoothness": {\r
        "message": "Плавность управления"\r
    },\r
    "cliConfirmSnippetDialogTitle": {\r
        "message": "Просмотр загруженных команд"\r
    },\r
    "SafehomeLat": {\r
        "message": "Широта"\r
    },\r
    "configurationFeatures": {\r
        "message": "Прочие функции"\r
    },\r
    "firmwareFlasherFlashOnConnect": {\r
        "message": "Прошить при подключении"\r
    },\r
    "magnetometerInfo": {\r
        "message": "2. Выберите пресет (align_mag) или создайте собственную конфигурацию с помощью ползунков.<br>(align_mag_roll, align_mag_pitch, align_mag_yaw)"\r
    },\r
    "pidTuning_RateDynamics_Correction": {\r
        "message": "Корректировка"\r
    },\r
    "loggingNote": {\r
        "message": "Информация будет логироваться <span style=\\"color: red\\">только</span> на этой вкладке. Если вы покинете эту вкладку, логирование <span style=\\"color: red\\">отменится</span> и приложение вернётся в нормальное состояние <strong>конфигуратора</strong>.<br /> Вы можете выбрать глобальный период обновления, при этом информация будет записываться в файл лога каждую <strong>1</strong> секунду по соображениям производительности."\r
    },\r
    "geozoneMaxAlt": {\r
        "message": "Макс. высота (см):"\r
    },\r
    "configurationVTXPower": {\r
        "message": "Уровень мощности"\r
    },\r
    "altControlResponse": {\r
        "message": "Коэффициент реакции (отклика) системы управления высотой"\r
    },\r
    "missionTitleAdd": {\r
        "message": "Добавить"\r
    },\r
    "servo": {\r
        "message": "Сервопривод"\r
    },\r
    "pidTuning_Mag": {\r
        "message": "Магнитометр/курс"\r
    },\r
    "configurationCurrentScale": {\r
        "message": "Масштаб амперметра"\r
    },\r
    "osd_unsupported_msg2": {\r
        "message": "Обратите внимание, что некоторые полётные контроллеры имеют встроенный <a href=\\"https://www.youtube.com/watch?v=ikKH_6SQ-Tk\\" target=\\"_blank\\">MinimOSD</a>, который можно прошить и настроить с помощью <a href=\\"https://github.com/ShikOfTheRa/scarab-osd/releases/latest\\" target=\\"_blank\\">scarab-osd</a>, однако MinimOSD не может быть настроен через данный интерфейс."\r
    },\r
    "ledStripFunctionTitle": {\r
        "message": "Функция"\r
    },\r
    "osdElement_MAH_DRAWN": {\r
        "message": "Израсходованная ёмкость (в мА·ч)"\r
    },\r
    "failsafePaneTitleOld": {\r
        "message": "Failsafe приёмника"\r
    },\r
    "failsafeOffDelayItem": {\r
        "message": "Задержка выключения двигателей в режиме Failsafe [В децисекундах (дс): 1дс = 0,1 сек.]"\r
    },\r
    "osdElement_EFFICIENCY_MAH": {\r
        "message": "Эффективность (мА·ч/км)"\r
    },\r
    "adjustmentsFunction10": {\r
        "message": "Регулировка P-коэффициента тангажа"\r
    },\r
    "controlAxisYaw": {\r
        "message": "Рыскание [R]"\r
    },\r
    "sensorsGyroscope": {\r
        "message": "Гироскоп, °/с"\r
    },\r
    "adjustmentsFunction17": {\r
        "message": "Регулировка CD/FF-коэффициентов крена"\r
    },\r
    "osd_hud_radar_disp": {\r
        "message": "Макс. количество элементов радара на экране."\r
    },\r
    "soarPitchDeadbandHelp": {\r
        "message": "Мёртвая зона угла тангажа (в градусах), когда включен режим парения. В пределах этой мертвой зоны режим стабилизации угла неактивен, позволяя тангажу свободно плавать во время парения."\r
    },\r
    "sitlSave": {\r
        "message": "Сохранить"\r
    },\r
    "rthEnergyMargin": {\r
        "message": "Запас АКБ для RTH"\r
    },\r
    "stm32NotReadProtected": {\r
        "message": "Защита чтения не установлена"\r
    },\r
    "gpsSats": {\r
        "message": "Количество спутников:"\r
    },\r
    "mixerWizardMotorPosition": {\r
        "message": "Расположение мотора"\r
    },\r
    "throttle_scale": {\r
        "message": "Масштаб тяги"\r
    },\r
    "failsafeProcedureItemSelect3": {\r
        "message": "RTH (возврат домой)"\r
    },\r
    "colorLightBlue": {\r
        "message": "светло-голубой"\r
    },\r
    "mainShowLog": {\r
        "message": "Показать журнал"\r
    },\r
    "configurationI2cSpeed": {\r
        "message": "Скорость I2C"\r
    },\r
    "pidTuning_advancedFilters": {\r
        "message": "Расширенные фильтры гироскопа"\r
    },\r
    "osdElement_VARIO_NUM": {\r
        "message": "Значение вариометра"\r
    },\r
    "geozoneDetectionDistanceHelp": {\r
        "message": "Расстояние, с которого определяется геозона"\r
    },\r
    "cliExitBtn": {\r
        "message": "Выход"\r
    },\r
    "adjustmentsFunction36": {\r
        "message": "Регулировка P-коэффициента уровня"\r
    },\r
    "backupFileIncompatible": {\r
        "message": "Предоставленный файл резервной копии был создан для предыдущей версии конфигуратора и несовместим с этой версией конфигуратора. Извините"\r
    },\r
    "featureBAT_PROFILE_AUTOSWITCHTip": {\r
        "message": "Автоматический выбор профиля батареи на основе напряжения батареи, когда батарея подключена"\r
    },\r
    "brakingBoostSpeedThresholdTip": {\r
        "message": "Усиление торможения будет включено только в том случае, если фактическая скорость превышает пороговое значение"\r
    },\r
    "ledStripRemainingText": {\r
        "message": "Осталось"\r
    },\r
    "defaultChangelogHead": {\r
        "message": "Configurator — Журнал изменений"\r
    },\r
    "osd_adsb_distance_warning": {\r
        "message": "Предупреждение о расстоянии ADSB"\r
    },\r
    "posholdMaxManualClimbRate": {\r
        "message": "Макс. скорость набора высоты в режиме удержания высоты (ALTHOLD) [см/с]"\r
    },\r
    "ledStripFunctionBatteryOption": {\r
        "message": "Батарея"\r
    },\r
    "waypointRadius": {\r
        "message": "Радиус путевой точки"\r
    },\r
    "failsafeMinDistanceHelp": {\r
        "message": "Аппарат будет использовать альтернативное поведение failsafe, когда он находится на расстоянии от 0 до этого минимального значения (в сантиметрах) от дома. Например, если установлено значение 2000 сантиметров (20 метров), и аппарат находится на расстоянии 13 метров, будет соблюдена процедура «Failsafe на минимальном безопасном расстоянии». Когда судно находится на расстоянии 25 метров, будет выполняться обычная процедура failsafe. Если установлено значение 0, всегда будет использоваться обычная процедура failsafe. "\r
    },\r
    "gpsDistToHome": {\r
        "message": "Расстояние до дома:"\r
    },\r
    "stm32AddressLoadFailed": {\r
        "message": "Не удалось загрузить адрес для сектора байтов опций. Вероятнее всего, из-за защиты от чтения."\r
    },\r
    "osd_airspeed_max_alarm": {\r
        "message": "Макс. воздушная скорость"\r
    },\r
    "ledStripModeColorsModeOrientation": {\r
        "message": "Ориентация"\r
    },\r
    "pidTuning_Manual_Roll": {\r
        "message": "Крен (%)"\r
    },\r
    "accCalibrationStopTitle": {\r
        "message": "Калибровка завершена"\r
    },\r
    "osdElement_SENSOR2_TEMPERATURE": {\r
        "message": "Датчик температуры 2"\r
    },\r
    "initialSetupMaximum": {\r
        "message": "Максимум:"\r
    },\r
    "pitchToThrottle": {\r
        "message": "Отношение тангажа к тяге"\r
    },\r
    "osd_dji_GPS_source": {\r
        "message": "Источник <i>скорости GPS</i>"\r
    },\r
    "pidTuning_ShowAllPIDs": {\r
        "message": "Показать все PID'ы"\r
    },\r
    "w_z_baro_p_help": {\r
        "message": "Если для этого значения установлено значение <strong>0</strong>, барометр не используется для расчёта высоты"\r
    },\r
    "stm32ContactingBootloaderFailed": {\r
        "message": "Сбой связи с загрузчиком"\r
    },\r
    "configurationLaunchIdleDelayHelp": {\r
        "message": "Установите задержку по времени между поднятием тяги для запуска и запуском двигателя на холостом ходу. По умолчанию: 0 [0-60000]"\r
    },\r
    "osdUnitMetricMPHTip": {\r
        "message": "Использовать метрические единицы, за исключением скорости, которая отображается в милях в час."\r
    },\r
    "missionSafehomeAvailableSafehomes": {\r
        "message": "Доступные Safehome:"\r
    },\r
    "initialSetupCalibrateAccelText": {\r
        "message": "6-точечная калибровка акселерометра. Для получения дополнительной информации, перейдите на вики для INAV и следуйте инструкциям по калибровке датчика"\r
    },\r
    "missionWpLon": {\r
        "message": "Долгота:"\r
    },\r
    "osdElement_GPS_MAX_SPEED": {\r
        "message": "Максимальная скорость по GPS"\r
    },\r
    "initialSetupInstrumentsHead": {\r
        "message": "Инструменты"\r
    },\r
    "gezoneInvalidReasonComplex": {\r
        "message": "Комплекс причин"\r
    },\r
    "configurationLaunchMinTime": {\r
        "message": "Минимальное время запуска"\r
    },\r
    "gyroNotchCutoff2": {\r
        "message": "Частота среза второго режекторного фильтра гироскопа"\r
    },\r
    "receiverHelpYawDeadband": {\r
        "message": "Эти значения (в us, мкс) показывают, насколько может колебаться входной сигнал RC-приёмника, прежде чем он будет считаться действительными. Для передатчиков с джиттером на выходах это значение можно увеличить, если входные сигналы RC подрагивают в режиме ожидания. <strong>Эта настройка предназначена только для рыскания (Yaw).</strong>"\r
    },\r
    "useOnlyStandalone": {\r
        "message": "Используйте отдельное приложение.<br> Посетите <a href=\\"https://github.com/iNavFlight/inav-configurator/releases\\" target=\\"_blank\\">веб-сайт</a>, чтобы ознакомиться с примечаниями к выпуску и загрузить программу."\r
    },\r
    "startGettingSafehomePoints": {\r
        "message": "Начало сбора/определения точек Safehome"\r
    },\r
    "osdElement_G_FORCE_Y": {\r
        "message": "Поперечная перегрузка в системе координат аппарата (по оси Y)"\r
    },\r
    "minThrottle": {\r
        "message": "Мин. тяга"\r
    },\r
    "landMinAltVspdHelp": {\r
        "message": "Это значение — финальная скорость касания земли. Дрон будет плавно замедляться на всём пути от <strong>высоты замедления</strong> (где он летел с <strong>начальной скоростью посадки</strong>) и достигнет этой финальной скорости ровно в момент, когда он доберётся до <strong>финальной высоты захода на посадку</strong> (то есть почти у самой земли)"\r
    },\r
    "osdElement_PILOT_LOGO_HELP": {\r
        "message": "В заданной вами позиции показывает ваш небольшой логотип пилота в OSD. Для этого требуется пользовательских шрифт с вашим логотипом."\r
    },\r
    "auxiliaryAutoChannelSelect": {\r
        "message": "АВТО"\r
    },\r
    "adjustmentsFunction8": {\r
        "message": "D-коэффициент крена и тангажа"\r
    },\r
    "sitlPort": {\r
        "message": "Порт симулятора"\r
    },\r
    "servosRate": {\r
        "message": "Скорость (%)"\r
    },\r
    "adjustmentsFunction11": {\r
        "message": "Регулировка I-коэффициента тангажа"\r
    },\r
    "stm32Verifying": {\r
        "message": "Проверка ..."\r
    },\r
    "geozoneInvalidzone": {\r
        "message": "Обнаружены некорректные геозоны:"\r
    },\r
    "configurationGyroSyncDenominator": {\r
        "message": "Знаменатель гироскопа"\r
    },\r
    "communityFacebookSupport": {\r
        "message": "Группа в Facebook"\r
    },\r
    "osd_horizon_offset_help": {\r
        "message": "Перемещает HUD (индикатор полетных данных) и AHI (авиагоризонт) вверх или вниз по экранному меню, чтобы выровнять их с фактическим горизонтом. Отображение AHI может выглядеть завышенным или заниженным в зависимости от угла наклона камеры в полете. <span style='color:red;'>ПРИМЕЧАНИЕ: </span> Эта функция не работает с OSD типа Pixel. Для этого воспользуйтесь командой <code>osd_ahi_vertical_offset</code> в CLI."\r
    },\r
    "cruisePower": {\r
        "message": "Крейсерская мощность"\r
    },\r
    "osdPanServoPwm2centideg_HELP": {\r
        "message": "Градусы вращения сервопривода панорамирования. Сервоприводам с диапазоном поворота 180 градусов при PWM от 1000 до 2000 мкс обычно нужно установить значение 180. Сделайте значение отрицательным, чтобы инвертировать направление."\r
    },\r
    "tabOutputs": {\r
        "message": "Моторы"\r
    },\r
    "configurationVTXLowPowerDisarmValue_2": {\r
        "message": "До первого взведения"\r
    },\r
    "osd_font_load_file": {\r
        "message": "Открыть файл шрифта"\r
    },\r
    "posholdDefaultSpeed": {\r
        "message": "Скорость навигации по умолчанию"\r
    },\r
    "initialSetupMagCalibStarted": {\r
        "message": "Калибровка магнитометра начата"\r
    },\r
    "stepTitle6": {\r
        "message": "Шаг 6"\r
    },\r
    "dtermNotchHz": {\r
        "message": "Частота режекторного фильтра D-составляющей."\r
    },\r
    "soarMotorStop": {\r
        "message": "Остановка моторов в режиме парения"\r
    },\r
    "osdAlarmGFORCE_AXIS_MAX_HELP": {\r
        "message": "Элементы перегрузки на осях начнут мигать, когда перегрузка поднимется выше этого значения"\r
    },\r
    "ezTuneExpoTips": {\r
        "message": "Определяет экспоненту RC-входа. Более низкие значения делают стик более чувствительным в центре. Более высокие значения приводят к менее чувствительному центру и более быстрому отклику по краям стика. Значение 0 эквивалентно 0 экспонирования, 100 — 0.7 экспонирования, 200 — 1.0 экспонирования."\r
    },\r
    "portsFunction_BLACKBOX": {\r
        "message": "Запись в Blackbox"\r
    },\r
    "pidTuning_Max_Inclination_Angle": {\r
        "message": "Максимальный угол наклона"\r
    },\r
    "osdElement_OSD_RANGEFINDER": {\r
        "message": "Расстояние дальномера"\r
    },\r
    "missionParameter2": {\r
        "message": "Параметр 2:"\r
    },\r
    "missionTitleSave": {\r
        "message": "Сохранить"\r
    },\r
    "configurationBatteryCapacityUnit": {\r
        "message": "Единицы ёмкости батареи"\r
    },\r
    "adjustmentsFunction25": {\r
        "message": "Регулировка RC-экспоненты рыскания"\r
    },\r
    "adjustmentsFunction59": {\r
        "message": "Регулировка индекса мульти-миссии"\r
    },\r
    "SafehomeLon": {\r
        "message": "Долгота"\r
    },\r
    "dfu_device_flash_info": {\r
        "message": "Обнаружено устройство с суммарным размером flash-памяти $1 KiB"\r
    },\r
    "servosButtonSave": {\r
        "message": "Сохранить"\r
    },\r
    "configurationGimbalPanChannel": {\r
        "message": "Канал панорамирования (рыскание)"\r
    },\r
    "initialSetupBatteryPercentage": {\r
        "message": "Осталось заряда батареи:"\r
    },\r
    "targetPrefetchFailNonINAV": {\r
        "message": "Невозможно определить полётный контроллер: полётный контроллер с не-INAV прошивкой"\r
    },\r
    "configurationSensorAlignmentMag": {\r
        "message": "Выравнивание магнитометра"\r
    },\r
    "firmwareFlasherReleaseFileUrl": {\r
        "message": "Загрузить вручную."\r
    },\r
    "configurationGimbal": {\r
        "message": "Последовательный подвес"\r
    },\r
    "osd_elements": {\r
        "message": "Элементы"\r
    },\r
    "configMigrationFrom": {\r
        "message": "Миграция файла конфигурации, созданного конфигуратором: $1"\r
    },\r
    "mainLogoText": {\r
        "message": "Версия конфигуратора"\r
    },\r
    "endSendingSafehomePoints": {\r
        "message": "Окончание отправки точек Safehome"\r
    },\r
    "initialSetupMinCommand": {\r
        "message": "Мин. команда:"\r
    },\r
    "brakingBoostFactorTip": {\r
        "message": "Определяет, насколько сильным будет усиление торможения. 100% означает, что навигационный движок может удвоить скорость и ускорение крена"\r
    },\r
    "configuration3dDeadbandHigh": {\r
        "message": "Мёртвая зона реверсивных моторов, верхний предел"\r
    },\r
    "logicId": {\r
        "message": "#"\r
    },\r
    "pidTuning_Expo_Manual": {\r
        "message": "Ручная экспонента"\r
    },\r
    "sitlSerialUART": {\r
        "message": "Последовательный приёмник настроен на UART от SITL"\r
    },\r
    "axisPitch": {\r
        "message": "Тангаж"\r
    },\r
    "initialSetupDrawn": {\r
        "message": "Израсходованная ёмкость:"\r
    },\r
    "rthAltitudeHelp": {\r
        "message": "Используется в режимах высоты RTH: Extra, Fixed и At Least"\r
    },\r
    "mixerWizard": {\r
        "message": "Мастер микшера"\r
    },\r
    "configurationBatteryCapacityCritical": {\r
        "message": "Критическая ёмкость (оставшийся %)"\r
    },\r
    "osdElement_GPS_HDOP_HELP": {\r
        "message": "Отображает горизонтальный коэффициент геометрического ослабления точности (HDOP) от GPS. Чем ниже это значение, тем точнее определено местоположение по GPS."\r
    },\r
    "itermRelax": {\r
        "message": "Ослабление I-составляющей"\r
    },\r
    "configurationLaunchClimbAngleHelp": {\r
        "message": "Угол набора высоты (положение модели, а не наклон подъёма) для последовательности запуска (градусы) также ограничивается глобальным параметром max_angle_inclination_pit. По умолчанию: 18 [5-45]"\r
    },\r
    "firmwareFlasherWarningHead": {\r
        "message": "Предупреждение"\r
    },\r
    "osdElement_MAIN_BATT_CELL_VOLTAGE": {\r
        "message": "Напряжение ячейки батареи"\r
    },\r
    "osd_hud_radar_range_min": {\r
        "message": "Мин. дальность действия радара"\r
    },\r
    "stm32InvalidHex": {\r
        "message": "Неверный hex"\r
    },\r
    "RX_MSP": {\r
        "message": "Вход MSP приёмника (управление через порт MSP)"\r
    },\r
    "LevBtn": {\r
        "message": "Калибровка уровня"\r
    },\r
    "firmwareFlasherButtonLoading": {\r
        "message": "Загрузка..."\r
    },\r
    "sensorOpticalFlowShort": {\r
        "message": "Поток"\r
    },\r
    "drNavigationHelp": {\r
        "message": "Позволяет INAV продолжать навигацию (по путевым точкам, RTH, круиз, удержание курса и т.д.) во время коротких отключений GPS. Для этой функции необходимо включить компас и датчик воздушной скорости на аппаратах с фиксированным крылом."\r
    },\r
    "servoMixerAdd": {\r
        "message": "Добавить новое правило микшера"\r
    },\r
    "w_xy_gps_p": {\r
        "message": "Коэффициент доверия GPS для горизонтальной позиции"\r
    },\r
    "geozoneActionRTH": {\r
        "message": "RTH/Возврат домой"\r
    },\r
    "pidTuning_GPS": {\r
        "message": "GPS-навигация"\r
    },\r
    "sensorBarometer": {\r
        "message": "Барометр"\r
    },\r
    "WaypointOptionP1": {\r
        "message": "P1"\r
    },\r
    "pidTuning_magHoldYawRate": {\r
        "message": "Ограничение скорости удержания курса"\r
    },\r
    "featureSOFTSPI": {\r
        "message": "SPI на базе процессора"\r
    },\r
    "pidTuning_MatrixFilterQFactor": {\r
        "message": "Добротность матричного фильтра (Q-фактор)"\r
    },\r
    "osdElement_VARIO_NUM_HELP": {\r
        "message": "Показывает вертикальную скорость в виду числа"\r
    },\r
    "missionTitleSaveMissionFile": {\r
        "message": "Сохранить файл миссии"\r
    },\r
    "gyroLpfNotFlyableMessage": {\r
        "message": "Эта настройка, вероятно, сделает дрон непригодным для полёта"\r
    },\r
    "geozoneExcusive": {\r
        "message": "Геозона внутри границ"\r
    },\r
    "initialSetup_Wh_drawnValue": {\r
        "message": "$1 Втч"\r
    },\r
    "motor_direction_isInverted": {\r
        "message": "Обратное направление вращения моторов / Props-Out конфигурация"\r
    },\r
    "configurationVTXPowerHelp": {\r
        "message": "Уровень мощности видеопередатчика. Точная мощность в мВт (или дБм) будет зависеть от конкретного оборудования. Проверьте руководство вашего видеопередатчика."\r
    },\r
    "waypointConfiguration": {\r
        "message": "Настройки навигации по путевым точкам"\r
    },\r
    "rthUseLinearDescentHelp": {\r
        "message": "Если эта функция включена, дрон будет медленно снижаться до высоты точки RTH во время возвращения по курсу в режиме RTH."\r
    },\r
    "confirm_reset_settings": {\r
        "message": "Вы действительно хотите сбросить все настройки?\\nВНИМАНИЕ: Все настройки будут потеряны! После этой операции вам придётся полностью настроить летательный аппарат!"\r
    },\r
    "language": {\r
        "message": "Язык"\r
    },\r
    "gpsMapMessage2": {\r
        "message": "Ожидание 3D фиксации GPS…"\r
    },\r
    "gpsAssistnowUpdate": {\r
        "message": "AssistNow отправил сообщение."\r
    },\r
    "portsFunction_HEADTRACKER": {\r
        "message": "Последовательный трекер головы"\r
    },\r
    "initialSetupMagCalibEnded": {\r
        "message": "Калибровка магнитометра <span style=\\"color: #37a8db\\">завершена</span>"\r
    },\r
    "geozoneEdit": {\r
        "message": "Редактировать геозону "\r
    },\r
    "stepTitle1": {\r
        "message": "Шаг 1"\r
    },\r
    "osdGroupMapsAndRadars_HELP": {\r
        "message": "Карты и радары позволяют размещать поверх них дополнительные элементы, при условии, что эти элементы не перекрывают какие-либо части карты, видимые в окне предварительного просмотра."\r
    },\r
    "configurationLaunchTimeoutHelp": {\r
        "message": "Максимальное время выполнения последовательности запуска. По истечении этого времени режим LAUNCH будет отключен и вступит в силу обычный режим полёта. По умолчанию: 5000 [0-60000]"\r
    },\r
    "dterm_lpf2_type": {\r
        "message": "Тип ФНЧ D-составляющей, Этап 2"\r
    },\r
    "mainLogoTextFirmware": {\r
        "message": "Версия прошивки FC"\r
    },\r
    "configurationThrottleMinimum": {\r
        "message": "Минимальная тяга"\r
    },\r
    "closeUpdateBtn": {\r
        "message": "Закрыть"\r
    },\r
    "logicEnabled": {\r
        "message": "Включено"\r
    },\r
    "osdElement_SAG_COMP_MAIN_BATT_CELL_VOLTAGE_HELP": {\r
        "message": "Расчётное среднее напряжение ячейки, при котором должна находиться батарея без нагрузки (имитация идеальной батареи)"\r
    },\r
    "osdElement_SENSOR5_TEMPERATURE": {\r
        "message": "Датчик температуры 5"\r
    },\r
    "fwLandFlareAlt": {\r
        "message": "Начальная высота фазы выравнивания"\r
    },\r
    "ezTuneStability": {\r
        "message": "Стабилизация"\r
    },\r
    "osdElement_ROLL_PIDS": {\r
        "message": "PID'ы крена"\r
    },\r
    "osdAlarmDIST_HELP": {\r
        "message": "Индикатор расстояния до дома будет мигать, когда расстояние превышает это значение. 0 отключает этот сигнал тревоги."\r
    },\r
    "adjustmentsFunction14": {\r
        "message": "Регулировка P-коэффициента крена"\r
    },\r
    "configurationSensorAlignmentMagPitch": {\r
        "message": "Тангаж"\r
    },\r
    "adjustmentsFunction42": {\r
        "message": "Регулировка P-коэффициента положения Z"\r
    },\r
    "mainPortOverrideLabel": {\r
        "message": "Порт: "\r
    },\r
    "osdElement_SWITCH_INDICATOR_1": {\r
        "message": "Индикатор переключателя 2"\r
    },\r
    "ezTuneAggressiveness": {\r
        "message": "Агрессивность"\r
    },\r
    "dataflashButtonSaveCancel": {\r
        "message": "Отмена"\r
    },\r
    "pitchToThrottleHelp": {\r
        "message": "В навигационных режимах каждый градус набора высоты будет добавлять заданное количество единиц к крейсерской тяге. И наоборот, каждый градус снижения будет вычитать это количество единиц из тяги."\r
    },\r
    "tabMisc": {\r
        "message": "Разное"\r
    },\r
    "maxBankAngleHelp": {\r
        "message": "Максимальный угол крена в навигационных режимах. Ограничено максимальным углом крена на вкладке «PID настройки»."\r
    },\r
    "rthUseLinearDescent": {\r
        "message": "Использовать линейное снижение"\r
    },\r
    "fwLandGlideAltHelp": {\r
        "message": "На этой высоте (измеряемой относительно высоты точки посадки) двигатель выключается, и с этой точки аппарат начинает планировать (скользить)."\r
    },\r
    "missionTitleDelete": {\r
        "message": "Удалить"\r
    },\r
    "featureAIRMODE": {\r
        "message": "Включить AIRMODE по умолчанию"\r
    },\r
    "featureTELEMETRY": {\r
        "message": "Выход телеметрии"\r
    },\r
    "configurationGPSubxSbas": {\r
        "message": "Тип наземной помощи"\r
    },\r
    "osdGroupGPS": {\r
        "message": "GPS"\r
    },\r
    "portsFunction_ESC": {\r
        "message": "Выход/телеметрия ECS"\r
    },\r
    "rthLinearDescentStart": {\r
        "message": "Дистанция начала линейного снижения"\r
    },\r
    "failsafeChannelFallbackSettingsTitle": {\r
        "message": "Fallback настройки канала"\r
    },\r
    "mixerProfile2": {\r
        "message": "Профиль микшера 2"\r
    },\r
    "configurationAutoDisarmDelay": {\r
        "message": "Секунд до дизарма из-за низкой тяги"\r
    },\r
    "ledStripColorModifierTitle": {\r
        "message": "Модификатор цвета"\r
    },\r
    "adjustmentsSlot1": {\r
        "message": "Слот 2"\r
    },\r
    "portColumnSensors": {\r
        "message": "Сенсоры"\r
    },\r
    "posholdMaxBankAngle": {\r
        "message": "Макс. угол крена мультикоптера"\r
    },\r
    "osdElement_G_FORCE_Z_HELP": {\r
        "message": "Показывает перегрузку по оси Z (вертикальной)"\r
    },\r
    "osdElement_FORMATION_FLIGHT_HELP": {\r
        "message": "Ближайший аппарат с радара INAV/групповом полёте"\r
    },\r
    "firmwareFlasherButtonLoadOnline": {\r
        "message": "Загрузить прошивку [Online]"\r
    },\r
    "WaypointOptionSelected": {\r
        "message": "+"\r
    },\r
    "portsFunction_TELEMETRY_IBUS": {\r
        "message": "iBUS"\r
    },\r
    "confirm_select_defaults": {\r
        "message": "Это позволит выбрать новые значения по умолчанию для всех настроек. Существующая настройка PID и другие настройки могут быть потеряны!\\nПродолжить?"\r
    },\r
    "servoMixerDelete": {\r
        "message": "Удалить"\r
    },\r
    "logicOperandA": {\r
        "message": "Операнд A"\r
    },\r
    "rollPitchItermIgnoreRateHelp": {\r
        "message": "I-составляющая PID-регулятора игнорируется при превышении этой скорости вращения. Это предотвращает накопление I-составляющей во время манёвров"\r
    },\r
    "osdElement_AZIMUTH": {\r
        "message": "Азимут"\r
    },\r
    "configurationLaunchClimbAngle": {\r
        "message": "Угол набора высоты"\r
    },\r
    "gpsEPH": {\r
        "message": "EPH:"\r
    },\r
    "adjustmentsFunction5": {\r
        "message": "Регулировка коэффициентов рыскания"\r
    },\r
    "ledStripFunctionModesOption": {\r
        "message": "Режимы и ориентация"\r
    },\r
    "portsFunction_TELEMETRY_MSP": {\r
        "message": "MSP"\r
    },\r
    "ledStripDirE": {\r
        "message": "В"\r
    },\r
    "osdElement_GVAR_1": {\r
        "message": "Глобальная переменная 1"\r
    },\r
    "osdElement_PAN_SERVO_CENTRED": {\r
        "message": "Центрирование сервопривода панорамирования"\r
    },\r
    "itermRelaxHelp": {\r
        "message": "Определяет активацию алгоритма «Ослабление I-составляющей». PR означает, что он активен по осям крена и тангажа (Roll и Pitch). PRY означает, что он также активен по оси рыскания (Yaw)."\r
    },\r
    "rollPitchItermIgnoreRate": {\r
        "message": "Скорость игнорирования I-составляющей крена/тангажа"\r
    },\r
    "tabLogicConditions": {\r
        "message": "Логические условия"\r
    },\r
    "sitlNewProfile": {\r
        "message": "Новый профиль SITL"\r
    },\r
    "missionTitleLoadMissionFromFC": {\r
        "message": "Загрузить миссию из полётного контроллера"\r
    },\r
    "adjustmentsFunction58": {\r
        "message": "Триммирование горизонта (для самолёта)"\r
    },\r
    "translation_version": {\r
        "message": "0"\r
    },\r
    "firmwareFlasherNoRebootDescription": {\r
        "message": "Включите, если при включении полётного контроллера перемычка замыкает контакты загрузчика или на полётном контроллере нажата кнопка BOOT."\r
    },\r
    "receiverRssiSource": {\r
        "message": "Источник RSSI"\r
    },\r
    "adjustmentsFunction43": {\r
        "message": "Регулировка I-коэффициента положения Z"\r
    },\r
    "pidTuning_RateDynamics": {\r
        "message": "Динамика расходов"\r
    },\r
    "RX_PPM": {\r
        "message": "Вход PPM приёмника"\r
    },\r
    "sensorOpticalFlow": {\r
        "message": "Оптический поток"\r
    },\r
    "autoConnectDisabled": {\r
        "message": "Автоподключение: отключено - пользователю необходимо выбрать нужный последовательный порт и самостоятельно нажать кнопку «Подключиться»"\r
    },\r
    "axisRoll": {\r
        "message": "Крен"\r
    },\r
    "gpsSpeed": {\r
        "message": "Скорость:"\r
    },\r
    "receiverThrottleExpo": {\r
        "message": "Экспоненциальная кривая тяги"\r
    },\r
    "sensorsTemperature0": {\r
        "message": "Температура 0, °C"\r
    },\r
    "usbDeviceOpenFail": {\r
        "message": "<span style=\\"color: red\\">Сбой</span> подключения к USB устройству!"\r
    },\r
    "ledStripBlinkLandingOverlay": {\r
        "message": "Мигать при приземлении"\r
    },\r
    "blackboxNotSupported": {\r
        "message": "Прошивка вашего полётного контроллера не поддерживает запись в Blackbox или функция Blackbox не включена"\r
    },\r
    "ledStripModeColorsModeHorizon": {\r
        "message": "Горизонт"\r
    },\r
    "wpLoadBoot": {\r
        "message": "Загрузить путевые точки при включении"\r
    },\r
    "ledStripModeColorsModeDisarmed": {\r
        "message": "Не взведён"\r
    },\r
    "osdElement_G_FORCE_HELP": {\r
        "message": "Показывает перегрузку с учётом всех осей"\r
    },\r
    "ledStripDirD": {\r
        "message": "D"\r
    },\r
    "osdLayoutDefault": {\r
        "message": "Расположение по умолчанию"\r
    },\r
    "osdElement_BARO_TEMPERATURE_HELP": {\r
        "message": "Температура барометра"\r
    },\r
    "featureINFLIGHT_ACC_CAL": {\r
        "message": "Калибровка в полёте"\r
    },\r
    "logicActivator": {\r
        "message": "Активен при"\r
    },\r
    "configurationCurrentMeterType": {\r
        "message": "Тип датчика тока"\r
    },\r
    "receiverManualRcExpo": {\r
        "message": "Ручная RC экспонента"\r
    },\r
    "osdElement_MC_VEL_Z_PID_OUTPUTS": {\r
        "message": "Значение скорости по оси Z PID (мультикоптер)"\r
    },\r
    "sitlUseImu": {\r
        "message": "Использовать IMU"\r
    },\r
    "osdElement_ESC_TEMPERATURE": {\r
        "message": "Температура ECS"\r
    },\r
    "clear": {\r
        "message": "Очистить"\r
    },\r
    "osdElement_MSL_ALTITUDE_HELP": {\r
        "message": "Высота над средним уровнем моря (MSL)"\r
    },\r
    "WaypointOptionAction": {\r
        "message": "Тип"\r
    },\r
    "osdGroupAltitude": {\r
        "message": "Высота"\r
    },\r
    "dataflashSavingNote": {\r
        "message": "Сохранение может занять несколько минут, пожалуйста, подождите."\r
    },\r
    "statusbar_port_utilization": {\r
        "message": "Загруженность порта:"\r
    },\r
    "osdElement_G_FORCE_X": {\r
        "message": "Продольная перегрузка в системе координат аппарата (по оси X)"\r
    },\r
    "osdElement_PLUS_CODE": {\r
        "message": "Plus Code (широта + долгота)"\r
    },\r
    "failsafePulsrangeTitle": {\r
        "message": "Настройка допустимого диапазона импульсов"\r
    },\r
    "brakingDisengageSpeed": {\r
        "message": "Скорость отключения торможения"\r
    },\r
    "w_z_gps_p_help": {\r
        "message": "Этот параметр используется только в том случае, если барометр не установлен и настроен <strong>inav_use_gps_no_baro</strong>."\r
    },\r
    "pidTuning_Proportional": {\r
        "message": "Пропорциональный"\r
    },\r
    "rthTwoStageAltHelp": {\r
        "message": "Установка высоты для первого этапа поэтапного RTH. Установите значение 0, чтобы отключить двухэтапный RTH [0–65000см]"\r
    },\r
    "initialSetupBackupAndRestoreApiVersion": {\r
        "message": "<span style=\\"color: red\\">Функция резервного копирования и восстановления отключена.</span> У вас есть прошивка с версией API <span style=\\"color: red\\">$1</span>, для резервного копирования и восстановления требуется <span style=\\"color: #37a8db\\">$2</span>. Пожалуйста, сделайте резервную копию ваших настроек через CLI, процедуру смотрите в документации INAV."\r
    },\r
    "missionTitleCancel": {\r
        "message": "Отменить"\r
    },\r
    "ledStripFunctionNoneOption": {\r
        "message": "Нет"\r
    },\r
    "pidTuning_YawRate": {\r
        "message": "Скорость рыскания"\r
    },\r
    "configurationSystem": {\r
        "message": "Системные настройки"\r
    },\r
    "navAutoClimbRateHelp": {\r
        "message": "Максимальная скорость набора/снижения высоты, которую может достигать БПЛА в навигационных режимах. [см/с]"\r
    },\r
    "firmwareFlasherManualBaud": {\r
        "message": "Задать вручную скорость передачи данных"\r
    },\r
    "missionTitleLoadEepromSafehome": {\r
        "message": "Загрузить Safehome из Eeprom"\r
    },\r
    "osdAlarmGFORCE_HELP": {\r
        "message": "Перегрузка начнет мигать, когда значение превысит заданное значение"\r
    },\r
    "gpsHead": {\r
        "message": "Позиция"\r
    },\r
    "language_de": {\r
        "message": "Deutsch",\r
        "_comment": "Don't translate!",\r
        "comment": "Don't translate!"\r
    },\r
    "motors": {\r
        "message": "Моторы"\r
    },\r
    "saveFileMissionButton": {\r
        "message": "Сохранить файл"\r
    },\r
    "sitlOptions": {\r
        "message": "Опции SITL"\r
    },\r
    "landSlowdownMaxAltHelp": {\r
        "message": "При достижении этой высоты аппарат начёт замедление, которое будет линейно изменяться от <strong>начальной скорости посадки</strong> до <strong>конечной скорости посадки</strong>, чтобы достичь её на <strong>финальной высоте захода на посадку</strong>"\r
    },\r
    "mixerLoadPresetRules": {\r
        "message": "Загрузить микшер"\r
    },\r
    "sensorBatteryProfile2": {\r
        "message": "Профиль батареи 2"\r
    },\r
    "osd_sidebar_scroll_arrows": {\r
        "message": "Стрелки прокрутки панели"\r
    },\r
    "configurationHeadtrackerType": {\r
        "message": "Тип трекера головы"\r
    },\r
    "tabPidTuning": {\r
        "message": "PID настройки"\r
    },\r
    "blackboxButtonSave": {\r
        "message": "Сохранить и перезагрузить"\r
    },\r
    "pidTuning_antigravityGain": {\r
        "message": "Антигравитационное усиление"\r
    },\r
    "fwLandGlidePitch": {\r
        "message": "Значение тангажа для фазы планирования"\r
    },\r
    "rthTrackBackDistance": {\r
        "message": "Дистанция следования по обратному маршруту (RTH)"\r
    },\r
    "rthTrackBackHelp": {\r
        "message": "При включении аппарат сначала полетит обратно по своему последнему маршруту, прежде чем напрямую направиться к дому. Аппараты с фиксированным крылом будут лететь обратно по маршруту, с набором высоты, но без снижения. Режимы использования для следования по обратному маршруту. OFF = отключено, ON = нормальный и failsafe RTH, FS = только failsafe RTH."\r
    },\r
    "connecting": {\r
        "message": "Подключение"\r
    },\r
    "colorYellow": {\r
        "message": "жёлтый"\r
    },\r
    "soarMotorStopHelp": {\r
        "message": "Останавливает моторы при включенном режиме парения."\r
    },\r
    "soarPitchDeadband": {\r
        "message": "Мёртвая точка по тангажу в режиме парения"\r
    },\r
    "fixedValue": {\r
        "message": "Фиксированное значение (мкс)"\r
    },\r
    "geozoneNoWayHomeAction": {\r
        "message": "Действие при невозможности возврата домой"\r
    },\r
    "configurationSensorMagPreset": {\r
        "message": "Ориентация задана с помощью: PRESET (align_mag)"\r
    },\r
    "adjustmentsExamples": {\r
        "message": "Примеры"\r
    },\r
    "configurationLoopTimeHelp": {\r
        "message": "В целом, чем выше значение, тем лучше. При асинхронном гироскопе оно должно быть ниже частоты обновления гироскопа. Максимально практическое значение зависит от аппаратного обеспечения. Если установить слишком высокое значение, плата может работать некорректно. Следите за загрузкой процессора."\r
    },\r
    "tzOffset": {\r
        "message": "Смещение часового пояса"\r
    },\r
    "fwLandMaxTailwind": {\r
        "message": "Максимально допустимый попутный ветер"\r
    },\r
    "pidTuning_LevelP": {\r
        "message": "Сила"\r
    },\r
    "configurationLaunchAccelHelp": {\r
        "message": "Пороговое ускорение движения вперёд для запуска с банджи (эластичного шнура) или броска, 1G = 981 см/с/с. По умолчанию: 1863 [1000-20000]"\r
    },\r
    "portsFunction_TELEMETRY_SMARTPORT": {\r
        "message": "SmartPort"\r
    },\r
    "": {\r
        "message": ""\r
    },\r
    "configurationBatteryCapacityValue": {\r
        "message": "Ёмкость"\r
    },\r
    "configuration3d": {\r
        "message": "Реверсивные двигатели"\r
    },\r
    "pidTuning_ControlDerivative": {\r
        "message": "Производная управления"\r
    },\r
    "sensorOpflow": {\r
        "message": "Оптический поток"\r
    },\r
    "adsbVehicleTotalMessages": {\r
        "message": "Сообщения БПЛА"\r
    },\r
    "timerOutputs": {\r
        "message": "Выходы таймера"\r
    },\r
    "adjustmentsFunction54": {\r
        "message": "Регулировка ослабления PID-коэффициентов тяги (TPA)"\r
    },\r
    "portsFunction_MSP": {\r
        "message": "MSP"\r
    },\r
    "osdElement_PLIMIT_REMAINING_BURST_TIME": {\r
        "message": "Оставшееся время работы при пиковой нагрузке"\r
    },\r
    "adjustmentsColumnThenApplyFunction": {\r
        "message": "то применить"\r
    },\r
    "FileSaved": {\r
        "message": "Файл сохранён"\r
    },\r
    "mainHelpFailsafe": {\r
        "message": "Режим Failsafe"\r
    },\r
    "options_cliAutocomplete": {\r
        "message": "Расширенное автодополнение в CLI"\r
    },\r
    "osd_mah_precision": {\r
        "message": "Точность mAh"\r
    },\r
    "axisAccelerationLimitYawHelp": {\r
        "message": "Это максимальная скорость углового ускорения, которую пилот может требовать от БПЛА. БПЛА должен быть в состоянии удовлетворить эту скорость ускорения. Как правило, чем больше БПЛА, тем меньшее ускорение он может выдержать"\r
    },\r
    "wpEnforceAltHelp": {\r
        "message": "Эта функция гарантирует, что высота каждой путевой точки будет достигнута до начала движения к следующей. Аппарат будет удерживать позицию (для коптеров) или барражировать (для самолётного типа), поднимаясь или опускаясь, пока его текущая высота не окажется в пределах заданного диапазона [1–2000 см] от высоты путевой точки. Установка значения [0] отключает эту функцию. Для аппаратов самолётного типа (фиксированное крыло) не рекомендуется устанавливать значение ниже 500 см."\r
    },\r
    "reversibleEscWarning": {\r
        "message": "При использовании реверсивных моторов, установите мощность холостого хода на 0%"\r
    },\r
    "idlePowerHelp": {\r
        "message": "Потребляемая мощность при нулевой тяге, используемая для оценки оставшегося времени/расстояния полёта в единицах 0,01Вт"\r
    },\r
    "osdElement_WIND_SPEED_HORIZONTAL": {\r
        "message": "Горизонтальная скорость ветра"\r
    },\r
    "failedToOpenSerialPort": {\r
        "message": "<span style=\\"color: red\\">Не удалось</span> открыть последовательный порт"\r
    },\r
    "configurationGPSUseGlonass": {\r
        "message": "GPS использует спутники Глонасс (RU)"\r
    },\r
    "initialSetupBatteryDetectedCells": {\r
        "message": "Количество ячеек батареи:"\r
    },\r
    "posholdHoverThrottle": {\r
        "message": "Тяга зависания"\r
    },\r
    "osd_coordinate_digits": {\r
        "message": "Точность координат"\r
    },\r
    "osd_esc_rpm_precision": {\r
        "message": "Точность оборотов ESC"\r
    },\r
    "axisAccelerationLimitRollPitchHelp": {\r
        "message": "Это максимальная скорость углового ускорения, которую пилот может требовать от БПЛА. БПЛА должен быть в состоянии удовлетворить эту скорость ускорения. Как правило, чем больше БПЛА, тем меньшее ускорение он может выдержать"\r
    },\r
    "serialrx_halfduplex": {\r
        "message": "Полудуплексный последовательный приёмник"\r
    },\r
    "tabSetup": {\r
        "message": "Система"\r
    },\r
    "configurationGimbalTiltChannel": {\r
        "message": "Канал наклона (тангажа)"\r
    },\r
    "LevCalText": {\r
        "message": "Пожалуйста, поместите текст сюда…"\r
    },\r
    "missionMultiMissionHead": {\r
        "message": "Мультимиссии"\r
    },\r
    "gpsTotalMessages": {\r
        "message": "Всего сообщений:"\r
    },\r
    "initialSetupCalibrateMagText": {\r
        "message": "Покрутите мультикоптер по крайней мере на <strong>360</strong> градусов по всем осям вращения. На выполнение этой операции у вас есть 30 секунд"\r
    },\r
    "failsafeChannelFallbackSettingsAuto": {\r
        "message": "<strong>Auto</strong> означает что крен, тангаж и рыскание будут установлены в центр и тяга на низкий уровень. <strong>Hold</strong> - сохранение последнего полученного корректного значения"\r
    },\r
    "adjustmentsFunction29": {\r
        "message": "Ручная регулировка скорости крена"\r
    },\r
    "osdElement_SENSOR7_TEMPERATURE": {\r
        "message": "Датчик температуры 7"\r
    },\r
    "initialSetupRestoreSuccess": {\r
        "message": "Конфигурация <span style=\\"color: #37a8db\\"> успешно</span> восстановлена"\r
    },\r
    "gpsFix2D": {\r
        "message": "<span class=\\"fix2d\\">2D</span>"\r
    },\r
    "decimals": {\r
        "message": "Формат десятичных чисел (количество чисел после точки)"\r
    },\r
    "osdElement_VTX_CHANNEL_HELP": {\r
        "message": "Показывает текущий диапазон и канал видеопередатчика. Требуется либо видеопередатчик с SmartAudio или Tramp, либо видеопередатчик, встроенный в полётный контроллер."\r
    },\r
    "portsFunction_MSP_DISPLAYPORT": {\r
        "message": "MSP DisplayPort"\r
    },\r
    "pidTuning_LevelD": {\r
        "message": "Переход (Горизонт)"\r
    },\r
    "sitlHelp": {\r
        "message": "SITL (Software in the loop - программное обеспечение в цикле) позволяет полностью запускать INAV с программным обеспечением на ПК без использования полётного контроллера и полностью моделировать полёты FPV. Для этого INAV компилируется обычным компилятором для ПК. Датчики заменяются данными, предоставляемыми симулятором.<br/>На данный момент поддерживаются:<br/><ul><li><a href=\\"https://www.realflight.com\\" target=\\" _blank\\">RealFlight</a><br/></li><li><a href=\\"https://www.x-plane.com\\" target=\\"_blank\\">X-Plane </a></li></ul>"\r
    },\r
    "gyroStage2LpfCutoffFrequencyHelp": {\r
        "message": "ФНЧ гироскопа 2 этапа, эквивалентный не-Кальмановскому фильтру 2 этапа в Betaflight. Он должен быть настроен выше, чем ФНЧ гироскопа первого этапа. Для 5&quot; и 6&quot; миниквадрокоптеров это обычно означает значение выше 150 Гц. Для 7&quot; — выше 125 Гц."\r
    },\r
    "adjustmentsFunction57": {\r
        "message": "Постоянная времени TPA (для самолёта)"\r
    },\r
    "osd_alt_alarm": {\r
        "message": "Высота"\r
    },\r
    "osd_alarms": {\r
        "message": "Предупреждения"\r
    },\r
    "osdElement_MAP_SCALE": {\r
        "message": "Масштаб карты"\r
    },\r
    "loggingStart": {\r
        "message": "Начать запись лога"\r
    },\r
    "pidTuning_fwLevelTrimMechanics": {\r
        "message": "Механика фиксированного крыла"\r
    },\r
    "presetsApplyHeader": {\r
        "message": "Предупреждение"\r
    },\r
    "failsafePulsrangeHelp": {\r
        "message": "Импульсы короче минимального или длиннее максимального недействительны и вызывают применение индивидуальных fallback настроек для радиоканалов или переход на этап 1 для полётных каналов"\r
    },\r
    "missionSafehomeMaxSafehomesReached": {\r
        "message": "Достигнуто максимальное число safehome."\r
    },\r
    "motorWizard2": {\r
        "message": "Задний левый"\r
    },\r
    "osdElement_SENSOR6_TEMPERATURE": {\r
        "message": "Датчик температуры 6"\r
    },\r
    "receiverType": {\r
        "message": "Тип приёмника"\r
    },\r
    "tabSwitchWaitForOperation": {\r
        "message": "Вы <span style=\\"color: red\\">не можете</span> сделать это прямо сейчас, пожалуйста, дождитесь завершения текущей операции ..."\r
    },\r
    "setBatteryProfile": {\r
        "message": "Установка профиля батареи: <strong style=\\"color: #37a8db\\">$1</strong>"\r
    },\r
    "BLACKBOX_FEATURE_GYRO_PEAKS_PITCH": {\r
        "message": "Пиковая частота шума гироскопа. Тангаж"\r
    },\r
    "RX_SERIAL": {\r
        "message": "Последовательный приёмник (SPEKSAT, SBUS, SUMD)"\r
    },\r
    "configurationThrottleMinimumCommand": {\r
        "message": "Минимальная команда"\r
    },\r
    "tzAutomaticDST": {\r
        "message": "Автоматический переход на летнее время"\r
    },\r
    "deviceRebooting": {\r
        "message": "Устройство - <span style=\\"color: red\\">Перезагружается</span>"\r
    },\r
    "featureTX_PROF_SEL": {\r
        "message": "Выбор профиля с помощью команды стика TX"\r
    },\r
    "pidId": {\r
        "message": "#"\r
    },\r
    "gsTelemetrySats": {\r
        "message": "Спутники"\r
    },\r
    "missionGeozoneWarning": {\r
        "message": "Как минимум одна миссия и геозона сконфигурированы. Пожалуйста, убедитесь в том, что миссия не нарушает границы геозоны."\r
    },\r
    "i2cSpeedTooLow": {\r
        "message": "Это слишком низкая скорость I2C!"\r
    },\r
    "eeprom_saved_ok": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранён</span>"\r
    },\r
    "adjustmentsFunction0": {\r
        "message": "Без изменений"\r
    },\r
    "controlAxisThrottle": {\r
        "message": "Тяга [T]"\r
    },\r
    "sensorsMagSelect": {\r
        "message": "Магнитометр"\r
    },\r
    "portsSerialRx": {\r
        "message": "RX"\r
    },\r
    "missionFwLandHeading1": {\r
        "message": "Курс 1 (°):"\r
    },\r
    "configurationLaunchDetectTimeHelp": {\r
        "message": "Время, в течение которого необходимо преодолеть пороговые значения, чтобы считать запуск состоявшимся. По умолчанию: 40 [10-1000]"\r
    },\r
    "osd_camera_fov_h_help": {\r
        "message": "Горизонтальный угол обзора камеры в градусах. Он используется для расчёта положения элементов на дисплее HUD."\r
    },\r
    "osdElement_ESC_TEMPERATURE_HELP": {\r
        "message": "Температура ECS считывается из телеметрии DSHOT"\r
    },\r
    "osdAlarmBATT_CAP": {\r
        "message": "Использование батареи"\r
    },\r
    "osd_airspeed_min_alarm": {\r
        "message": "Минимальная воздушная скорость"\r
    },\r
    "firmwareFlasherDate": {\r
        "message": "Дата:"\r
    },\r
    "osdElement_SNR_DB": {\r
        "message": "SNR восходящего канала RX (дБ)"\r
    },\r
    "configurationAsyncModeHelp": {\r
        "message": "Подробности см. в документации по прошивке в разделе «Looptime»"\r
    },\r
    "initialSetupAccelTrimsHead": {\r
        "message": "Триммирование акселерометра"\r
    },\r
    "MissionPlannerAltitudeChangeReset": {\r
        "message": "Высота ниже уровня земли. Изменение игнорируется"\r
    },\r
    "sitlStdProfileCantOverwritten": {\r
        "message": "Стандартный профиль SITL нельзя перезаписать. Пожалуйста, создайте новый."\r
    },\r
    "yawLpfCutoffFrequencyHelp": {\r
        "message": "Частота среза ФНЧ P-составляющей рыскания"\r
    },\r
    "adjustmentsFunction40": {\r
        "message": "Регулировка I-коэффициента положения XY"\r
    },\r
    "usbDeviceOpened": {\r
        "message": "USB устройство <span style=\\"color: #37a8db\\">успешно</span> подключено. ID подключения: $1"\r
    },\r
    "sensorStatusMagShort": {\r
        "message": "Компас",\r
        "description": "Текст для иконок датчиков вверху. Сделайте его кратким."\r
    },\r
    "tabCLI": {\r
        "message": "Командная строка"\r
    },\r
    "language_uk": {\r
        "message": "українська",\r
        "_comment": "Don't translate!"\r
    },\r
    "cruiseThrottle": {\r
        "message": "Крейсерская тяга"\r
    },\r
    "configurationAccelTrimPitch": {\r
        "message": "Триммирование акселерометра по тангажу"\r
    },\r
    "rthAltControlOverride": {\r
        "message": "Переопределение высоты RTH и настроек набора высоты с помощью стиков крена/тангажа"\r
    },\r
    "navMotorStopHelp": {\r
        "message": "Этот параметр управляет тем, будет ли навигационная система брать на себя управление двигателями. «OFF»: Навигационная система не будет брать на себя управление двигателями при низком уровне тяги (двигатели остановятся). «OFF_ALWAYS»: Навигационная система не будет брать на себя управление двигателями при низком уровне тяги даже при срабатывании режима Failsafe. «AUTO_ONLY»: Навигационная система будет брать на себя управление тягой только в автономных режимах навигации (по путевым точкам и RTH). «ALL_NAV» (по умолчанию): Навигационная система полностью возьмёт на себя управление двигателями и никогда не позволит им остановиться, даже при низком уровне тяги.<br/><br/>Этот параметр влияет только на те режимы навигации, которые берут на себя управление тягой в сочетании с включенным параметром «MOTOR_STOP». Если для моделей с фиксированным крылом выбрано значение, отличное от «ALL_NAV», это, вероятно, приведёт к сваливанию, если параметр «Мин. тангаж для снижения газа» настроен неверно или неверно оценивается тангаж."\r
    },\r
    "firmwareFlasherFailedToLoadOnlineFirmware": {\r
        "message": "Не удалось загрузить из сети прошивку"\r
    },\r
    "sensorStatusAccelShort": {\r
        "message": "Аксел.",\r
        "description": "Текст для иконок датчиков вверху. Сделайте его кратким."\r
    },\r
    "firmwareFlasherReleaseVersionUrl": {\r
        "message": "Перейти на страницу выпуска."\r
    },\r
    "OpflowScaleText": {\r
        "message": "Масштаб"\r
    },\r
    "rthAltControlOverrideHELP": {\r
        "message": "Если эта функция включена, набор высоты в режиме RTH можно отменить: для этого нужно удерживать стик тангажа полностью вниз в течение >1 секунды, чтобы аппарат полетел домой на текущей высоте. На самолётах настройку «Набор высоты перед RTH» можно отменить, удерживая стик крена полностью влево или вправо в течение > 1 секунды, чтобы самолёт немедленно развернулся в сторону дома."\r
    },\r
    "confirm_multimission_file_load": {\r
        "message": "Это файл с мультимиссией. Загрузка перезапишет текущую мультимиссию.\\nПродолжить?"\r
    },\r
    "geozoneMrStopDistance": {\r
        "message": "Расстояние остановки коптера"\r
    },\r
    "pidTuning_MatrixFilterMinFrequencyHelp": {\r
        "message": "Минимальная частота матричного фильтра. Значение должно зависеть от размера пропеллера. 150 Гц отлично работает с 5&quot; и меньше. Для 7&quot; и выше понизьте даже ниже 100Гц."\r
    },\r
    "tabLanding": {\r
        "message": "Добро пожаловать"\r
    },\r
    "osdElement_MC_POS_XYZ_P_OUTPUTS": {\r
        "message": "Значение P-регуляторов позиционирования XYZ (мультикоптер)"\r
    },\r
    "output_modeTitle": {\r
        "message": "Режим вывода"\r
    },\r
    "BLOCKED_COMPASS_NOT_CALIBRATED": {\r
        "message": "Компас откалиброван"\r
    },\r
    "osdAlarmMAX_NEG_ALTITUDE_HELP": {\r
        "message": "Индикатор высоты будет мигать, если высота отрицательна и её абсолютное значение превышает это значение. Полезно при взлёте с возвышенностей. 0 отключает этот сигнал тревоги."\r
    },\r
    "adjustmentsFunction13": {\r
        "message": "Регулировка CD/FF-коэффициентов тангажа"\r
    },\r
    "osdPanServoIndex": {\r
        "message": "Выход сервопривода панорамирования"\r
    },\r
    "pidTuning_UnicornFilterQFactor": {\r
        "message": "Добротность фильтра Unicorn"\r
    },\r
    "connectionBleNotSupported": {\r
        "message": "<span style=\\"color: red\\">Ошибка подключения:</span> Прошивка не поддерживает BLE-соединение. Отмена."\r
    },\r
    "osdElement_MC_VEL_X_PID_OUTPUTS": {\r
        "message": "PID: скорость по оси X (мультикоптер)"\r
    },\r
    "ezTuneDampingTips": {\r
        "message": "Описывает силу, которая противодействует любому изменению скорости вращения. Оно смягчает ускорение по крену и тангажу и обеспечивает более плавный и стабильный полёт. Ваша задача во время тюнинга — выяснить, насколько можно увеличить это значение до появления негативных симптомов: перегрева моторов, слышимые осцилляций, перерегулирование. Большинство современных квадрокоптеров должны принимать значение демпфирования до 150-180. Это эквивалент D-составляющей."\r
    },\r
    "ALTITUDE": {\r
        "message": "Высота"\r
    },\r
    "configurationMagnetometerHelp": {\r
        "message": "<strong>Примечание:</strong> не забудьте настроить последовательный порт (на вкладке «Порты») при использовании магнитометра."\r
    },\r
    "osd_font_clarity_medium": {\r
        "message": "Clarity medium"\r
    },\r
    "missionGezoneShape": {\r
        "message": "Форма"\r
    },\r
    "osd_dji_ESC_temp": {\r
        "message": "Источник <i>температуры ESC</i>"\r
    },\r
    "missionParameter1": {\r
        "message": "Параметр 1:"\r
    },\r
    "motorWizard0": {\r
        "message": "Задний правый"\r
    },\r
    "configurationLaunchThr": {\r
        "message": "Тяга запуска"\r
    },\r
    "configurationGimbalSensitivity": {\r
        "message": "Чувствительность подвеса"\r
    },\r
    "MagCalText": {\r
        "message": "После нажатия кнопки у вас есть 30 секунд, чтобы держа модель в воздухе вращать её так, чтобы каждая сторона (передняя, задняя, левая, правая, верхняя и нижняя) была направлена вниз к земле. Убедитесь, что при установке в аппарат или выполнении калибровки, ваш компас не находится вблизи магнитов или электромагнитов."\r
    },\r
    "platformType": {\r
        "message": "Тип платформы"\r
    },\r
    "osdElement_SENSOR1_TEMPERATURE": {\r
        "message": "Датчик температуры 1"\r
    },\r
    "osdElement_SWITCH_INDICATOR_0": {\r
        "message": "Индикатор переключателя 1"\r
    },\r
    "stm32RebootingToBootloader": {\r
        "message": "Перезапуск в режим загрузчика..."\r
    },\r
    "RX_SPI": {\r
        "message": "Приёмник на основе SPI (NRF24L01, RFM22)"\r
    },\r
    "servoMixer": {\r
        "message": "Микшер сервопривода"\r
    },\r
    "pidTuning_ButtonRefresh": {\r
        "message": "Обновить"\r
    },\r
    "fsMissionDelay": {\r
        "message": "Задержка миссии failsafe"\r
    },\r
    "drNavigation": {\r
        "message": "Навигация по счислению пути"\r
    },\r
    "receiverRssiChannel": {\r
        "message": "RSSI канал"\r
    },\r
    "BLACKBOX_FEATURE_ACC": {\r
        "message": "Акселерометр"\r
    },\r
    "featurePWM_OUTPUT_ENABLE": {\r
        "message": "Включить выходы двигателя и сервопривода"\r
    },\r
    "adjustmentsFunction32": {\r
        "message": "Регулировка крейсерской скорости (для самолёта)"\r
    },\r
    "osdElement_G_FORCE": {\r
        "message": "Перегрузка"\r
    },\r
    "sensorBatteryVoltage": {\r
        "message": "Напряжение батареи"\r
    },\r
    "controlAxisRoll": {\r
        "message": "Крен [A]"\r
    },\r
    "firmwareFlasherFlashDevelopmentFirmwareDescription": {\r
        "message": "Прошить самую свежую (не тестированную) разрабатываемую прошивку."\r
    },\r
    "ledStripLarsonscannerText": {\r
        "message": "Сканер Ларсона"\r
    },\r
    "notAWAYPOINT": {\r
        "message": "Предыдущая точка не была путевой!"\r
    },\r
    "gyroNotchCutoff2Help": {\r
        "message": "Определяет полосу режекторного фильтра. <br><br>Должна быть ниже частоты режекторного фильтра."\r
    },\r
    "adjustmentsFunction49": {\r
        "message": "Регулировка P-коэффициента скорости Z"\r
    },\r
    "cliSaveToFileBtn": {\r
        "message": "Сохранить в файл"\r
    },\r
    "firmwareFlasherOptionLabelSelectFirmwareVersion": {\r
        "message": "Выберите версию прошивки"\r
    },\r
    "adjustmentsFunction34": {\r
        "message": "Корректировка крена платы"\r
    },\r
    "colorBlue": {\r
        "message": "синий"\r
    },\r
    "sitlStart": {\r
        "message": "Старт"\r
    },\r
    "armingFailureReasonTitle": {\r
        "message": "Проверки перед взведением"\r
    },\r
    "osdGroupMapsAndRadars": {\r
        "message": "Карты и радары"\r
    },\r
    "geozoneDetectionDistance": {\r
        "message": "Расстояние обнаружения"\r
    },\r
    "pidTuning_d_boost_min": {\r
        "message": "Минимальный коэффициент усиления D-составляющей"\r
    },\r
    "defaultsDialogTitle": {\r
        "message": "Значения по умолчанию"\r
    },\r
    "pidTuning_gyro_dyn_lpf_curve_expo": {\r
        "message": "Экспонента кривой динамического ФНЧ гироскопа"\r
    },\r
    "unexpectedError": {\r
        "message": "Непредвиденная ошибка: $1"\r
    },\r
    "osdElement_VARIO_HELP": {\r
        "message": "Показывает вертикальную скорость с помощью стрелок вверх или вниз. Каждая стрелка соответствует 10 см (~ 4 дюйма) в секунду."\r
    },\r
    "osdElement_RC_SOURCE_HELP": {\r
        "message": "Показывает текущий источник RC, STD или MSP (полезно при использовании переопределения MSP)"\r
    },\r
    "gezoneInvalidReasonMinMaxAlt": {\r
        "message_en": "Max. Alt <= Min. Alt",\r
        "message": "Макс. высота <= мин. высоты"\r
    },\r
    "rc_filter_auto": {\r
        "message": "Использовать автоматическое сглаживание RC"\r
    },\r
    "osdLayoutAlternative": {\r
        "message": "Альтернативное расположение #$1"\r
    },\r
    "maxClimbAngle": {\r
        "message": "Макс. угол набора высоты при навигации"\r
    },\r
    "missionGeozoneSaveAndReboot": {\r
        "message": "Сохранить геозоны в Eeprom и перезагрузить"\r
    },\r
    "portsMSPHelp": {\r
        "message": "<strong>Примечание:</strong> <span style=\\"color: red\\">НЕ ОТКЛЮЧАЙТЕ</span> MSP на первом последовательном порту, если вы не знаете, что делаете. Иначе вам возможно придётся перепрошить и стереть вашу конфигурацию."\r
    },\r
    "tabAdvancedTuningGenericTitle": {\r
        "message": "Общие настройки"\r
    },\r
    "firmwareFlasherFirmwareNotLoaded": {\r
        "message": "Прошивка не загружена"\r
    },\r
    "osdElement_SNR_DB_HELP": {\r
        "message": "Отображается только в том случае, если SNR опускается ниже уровня предупреждения. При 0дБ уровень принимаемого сигнала равен минимальному уровню шума."\r
    },\r
    "osd_dji_RSSI_source": {\r
        "message": "Источник <i>RSSI</i>"\r
    },\r
    "pidTuning_d_boost_max": {\r
        "message": "Максимальный коэффициент усиления D-составляющей"\r
    },\r
    "failsafeKillSwitchItem": {\r
        "message": "Аварийный переключатель Failsafe (мгновенно дизармит дрон при failsafe)"\r
    },\r
    "motorsEnableControl": {\r
        "message": "Я понимаю риски, пропеллеры сняты. Включить управление двигателем."\r
    },\r
    "OpflowCalBtn": {\r
        "message": "Калибровать датчика оптического потока"\r
    },\r
    "configHelp2": {\r
        "message": "Произвольный поворот платы (в градусах), позволяющий установить её боком/вверх ногами/под углом и т. д. При использовании внешних сенсоров используйте настройки выравнивания сенсоров (гироскоп, акселерометр, магнитометр) для определения их положения независимо от ориентации платы. "\r
    },\r
    "ezTuneFilterHz": {\r
        "message": "Фильтр, Гц"\r
    },\r
    "logicFlags": {\r
        "message": "Флаги"\r
    },\r
    "receiverButtonSticks": {\r
        "message": "Стики управления"\r
    },\r
    "mixer_pid_profile_linking": {\r
        "message": "Профиль PID будет использовать тот же индекс, что и индекс профиля микшера"\r
    },\r
    "posholdMaxManualSpeedHelp": {\r
        "message": "Максимальная горизонтальная скорость, разрешённая для ручного управления пилотом в режимах POSHOLD/CRUISE"\r
    },\r
    "editPointHead": {\r
        "message": "Редактировать точку"\r
    },\r
    "errorParsingFile": {\r
        "message": "<span style=\\"color: red\\">Ошибка анализа файла</span>"\r
    },\r
    "firmwareFlasherOnlineSelectFirmwareVersionDescription": {\r
        "message": "Выберите версию прошивки для вашей платы.<br />Примечание: хотя с помощью этого конфигуратора вы можете прошить разные версии прошивок, при настройке полётного контроллера вы должны использовать одинаковые мажорную и минорную (MAJOR.MINOR.PATCH) версию как для прошивки, так и для конфигуратора."\r
    },\r
    "navManualClimbRateHelp": {\r
        "message": "Максимальная скорость набора/снижения высоты, разрешённая прошивке при обработке команд пилота в режиме управления ALTHOLD [см/с]"\r
    },\r
    "speed": {\r
        "message": "Скорость (10 мкс/с)"\r
    },\r
    "osdElement_MAP_REFERENCE": {\r
        "message": "Направление карты"\r
    },\r
    "initialSetupResetText": {\r
        "message": "Восстановить настройки <strong>по умолчанию</strong>"\r
    },\r
    "motor_poles": {\r
        "message": "Количество полюсов мотора (количество магнитов)"\r
    },\r
    "configurationLaunchMaxAltitudeHelp": {\r
        "message": "Высота, на которой режим LAUNCH будет отключен и вступит в силу обычный режим полёта. По умолчанию: 0 [0-60000]"\r
    },\r
    "fwLandApproachLength": {\r
        "message": "Длина финального участка захода на посадку"\r
    },\r
    "featureGPS": {\r
        "message": "GPS для навигации и телеметрии"\r
    },\r
    "receiverRefreshRateTitle": {\r
        "message": "Частота обновления графика"\r
    },\r
    "adjustmentsFunction23": {\r
        "message": "Коэффициент скорости тангажа"\r
    },\r
    "sensorsTemperature2": {\r
        "message": "Температура 2, °C"\r
    },\r
    "statusbar_cycle_time": {\r
        "message": "Время цикла:"\r
    },\r
    "osd_preview_title": {\r
        "message": "Предпросмотр <span>(перетащите, чтобы изменить положение)</span>"\r
    },\r
    "tabAuxiliary": {\r
        "message": "Режимы"\r
    },\r
    "portsFunction_DJI_FPV": {\r
        "message": "DJI FPV VTX"\r
    },\r
    "initialSetupButtonSave": {\r
        "message": "Сохранить"\r
    },\r
    "waypointSafeDistance": {\r
        "message": "Безопасное расстояние от путевой точки"\r
    },\r
    "sitlProfileExists": {\r
        "message": "Профиль с таким именем уже существует."\r
    },\r
    "sensorsDebugSelect": {\r
        "message": "Отладка"\r
    },\r
    "fwLandGlidePitchHelp": {\r
        "message": "Этот угол тангажа удерживается во время фазы планирования."\r
    },\r
    "sitlEnableSim": {\r
        "message": "Включить симулятор"\r
    },\r
    "SafehomeEnabled": {\r
        "message": "Включено"\r
    },\r
    "pidTuning_d_boost_max_at_acceleration_help": {\r
        "message": "D-Boost полностью активен, когда угловое ускорение (обнаруженное гироскопом или заданное целью по скорости) достигает указанного значения. В промежутке от 0 до этого значения коэффициент D-Boost масштабируется линейно."\r
    },\r
    "osdSwitchInd2": {\r
        "message": "Переключатель 3"\r
    },\r
    "osdGroupPowerLimits": {\r
        "message": "Ограничения мощности"\r
    },\r
    "cliReboot": {\r
        "message": "Обнаружена перезагрузка CLI"\r
    },\r
    "featureGEOZONETip": {\r
        "message": "Виртуальные периметры для географических зон (также называемых геозонами) с автоматически запускаемыми действиями при нарушении границ."\r
    },\r
    "motorsMaster": {\r
        "message": "Мастер"\r
    },\r
    "functionLogicId": {\r
        "message": "Условие активации"\r
    },\r
    "firmwareFlasherFlashOnConnectDescription": {\r
        "message": "Попробовать автоматически прошить плату (при обнаружении нового последовательного порта)."\r
    },\r
    "posholdDefaultSpeedHelp": {\r
        "message": "Скорость по умолчанию во время возврата домой. Также используется для навигации по путевым точкам (WP), если для участка WP не установлена скорость. Ограничена максимальной скоростью навигации"\r
    },\r
    "ledStripHelp": {\r
        "message": "Полётный контроллер может управлять цветом и эффектами отдельных светодиодов на ленте.<br />Настройте светодиоды на сетке, задайте порядок их подключения, а затем прикрепите светодиоды к вашему аппарату в соответствии с позициями на сетке. Светодиоды без заданного порядкового номера подключения не будут сохранены.<br />Дважды щёлкните по цвету, чтобы изменить значения HSV."\r
    },\r
    "configurationGyroLpfHelp": {\r
        "message": "Аппаратная частота среза для гироскопа. В целом, чем больше значение, тем лучше, но делает БПЛА более чувствительным к вибрациям"\r
    },\r
    "osdUnitGA": {\r
        "message": "Авиация общего назначения (АОН)"\r
    },\r
    "communityTelegramSupport": {\r
        "message": "Telegram канал"\r
    },\r
    "cruisePowerHelp": {\r
        "message": "Потребляемая мощность при крейсерской тяге, используемая для оценки оставшегося времени/расстояния полёта в единицах 0,01Вт"\r
    },\r
    "sensorStatusBaroShort": {\r
        "message": "Баро.",\r
        "description": "Текст для иконок датчиков вверху. Сделайте его кратким."\r
    },\r
    "cruiseYawRateLabel": {\r
        "message": "Крейсерская скорость рыскания"\r
    },\r
    "calibrationHead5": {\r
        "message": "Калибровка оптического потока"\r
    },\r
    "sitlSerialPort": {\r
        "message": "Последовательный порт/прокси FC подключен к последовательному порту хоста"\r
    },\r
    "brakingBoostTimeout": {\r
        "message": "Макс. продолжительность усиления торможения"\r
    },\r
    "waypointSafeDistanceHelp": {\r
        "message": "Максимальное расстояние между домашней точкой и первой путевой точкой."\r
    },\r
    "newVersionAvailable": {\r
        "message": "Доступна новая версия!"\r
    },\r
    "autoConnectEnabled": {\r
        "message": "Автоподключение: включено - конфигуратор будет автоматически пытаться подключиться при обнаружении нового порта"\r
    },\r
    "configurationSerialRXHelp": {\r
        "message": "<strong>Примечание:</strong> не забудьте настроить последовательный порт (на вкладке «Порты») для последовательного приёмника"\r
    },\r
    "w_z_gps_p": {\r
        "message": "Коэффициент доверия GPS для вертикальной позиции"\r
    },\r
    "gpsMapMessage1": {\r
        "message": "Пожалуйста, проверьте подключение к интернету"\r
    },\r
    "pidTuning_Limits": {\r
        "message": "Лимиты"\r
    },\r
    "mixerThrottleWarning": {\r
        "message": "Предупреждение: значение выходит за пределы нормального рабочего диапазона."\r
    },\r
    "ledStripFunctionColorOption": {\r
        "message": "Цвет"\r
    },\r
    "osdElement_BARO_TEMPERATURE": {\r
        "message": "Температура барометра"\r
    },\r
    "axisAccelerationLimitYaw": {\r
        "message": "Предел ускорения рыскания"\r
    },\r
    "mappingTableOutput": {\r
        "message": "Вывод (таймер)"\r
    },\r
    "yawJumpPreventionLimitHelp": {\r
        "message": "Предотвращение рывков по рысканию при остановке или резких изменении команд рыскания. Чтобы отключить, установите значение 500. Регулируйте эту настройку, если ваш аппарат «заносит». Более высокие значения повышают управляемость по рысканию, но могут вызвать нестабильность по крену/тангажу на недостаточно мощных дронах. Более низкие значения делают корректировку рыскания более плавной, но дрон может быть не в состоянии удерживать заданный курс"\r
    },\r
    "startGetPoint": {\r
        "message": "Начало получения точек"\r
    },\r
    "proxyURL": {\r
        "message": "URL MapProxy"\r
    },\r
    "gpsLon": {\r
        "message": "Долгота:"\r
    },\r
    "portsFunction_IRC_TRAMP": {\r
        "message": "IRC Tramp"\r
    },\r
    "failsafeOffDelayHelp": {\r
        "message": "Время, отведённое на режим приземления, до отключения моторов и дизарма аппарата"\r
    },\r
    "dataflashSavingNoteAfter": {\r
        "message": "Сохранение закончено! Нажмите «Ок» для продолжения."\r
    },\r
    "logicClose": {\r
        "message": "Закрыть"\r
    },\r
    "stm32ContactingBootloader": {\r
        "message": "Подключение к загрузчику ..."\r
    },\r
    "configurationLaunchMotorDelay": {\r
        "message": "Задержка двигателя"\r
    },\r
    "ezTuneSnappinessTips": {\r
        "message": "Помогает добиться более отзывчивого управления стиками. При высоком значении отзывчивости любое быстрое движение стика ускорит реакцию дрона. Это касается как начала, так и завершения манёвра. Попробуйте разные значения, чтобы найти то, которое подходит лучше всего."\r
    },\r
    "configurationWiggleWakeIdle": {\r
        "message": "Активация по движению"\r
    },\r
    "osdElement_VEL_Z_PIDS": {\r
        "message": "PID: Скорость Z"\r
    },\r
    "initialSetupPitch": {\r
        "message": "Тангаж:"\r
    },\r
    "adjustmentsFunction24": {\r
        "message": "Коэффициент скорости крена"\r
    },\r
    "missionNA": {\r
        "message": "Н/Д"\r
    },\r
    "sensorsRefresh": {\r
        "message": "Частота:"\r
    },\r
    "gpsHDOP": {\r
        "message": "HDOP:"\r
    },\r
    "outputStatsTableVoltage": {\r
        "message": "Напряжение [В]"\r
    },\r
    "pidTuning_gyro_main_lpf_hz": {\r
        "message": "Частота среза основного гирофильтра"\r
    },\r
    "ledStripWiring": {\r
        "message": "Схема подключения светодиодной ленты"\r
    },\r
    "BLOCKED_UAV_NOT_LEVEL": {\r
        "message": "БПЛА выровнен"\r
    },\r
    "initialSetupBackupSuccess": {\r
        "message": "Резервная копия <span style=\\"color: #37a8db\\">успешно сохранена</span>"\r
    },\r
    "pidTuning_RateDynamics_Sensitivity": {\r
        "message": "Чувствительность"\r
    },\r
    "osdSettingMainVoltageDecimals": {\r
        "message": "Знаков после запятой основного напряжения"\r
    },\r
    "osdPanServoOffcentreWarning_HELP": {\r
        "message": "Градусы по обе стороны от центра сервопривода панорамирования, когда камера, по умолчанию направленная вперёд, отклоняется от положения 0. Если отклонение находится в этом диапазоне и не равно 0 дольше 10 секунд, элемент OSD, отображающий смещение сервопривода панорамирования, начнет мигать. 0 означает, что это предупреждение отключено."\r
    },\r
    "portsFunction_TELEMETRY_MAVLINK": {\r
        "message": "MAVLink"\r
    },\r
    "ErrorWritingFile": {\r
        "message": "<span style=\\"color: red\\">Ошибка записи файла</span>"\r
    },\r
    "BLOCKED_NAVIGATION_SAFETY": {\r
        "message": "Навигация безопасна"\r
    },\r
    "configurationCalculatedCyclesSec": {\r
        "message": "Циклы/сек. (Гц)"\r
    },\r
    "portsFunction_RANGEFINDER": {\r
        "message": "Дальномер"\r
    },\r
    "ledStripWiringMessage": {\r
        "message": "Светодиоды без порядкового номера подключения не будут сохранены."\r
    },\r
    "missionGeozoneMaxVerticesReached": {\r
        "message": "Достигнуто максимальное количество вершин геозоны."\r
    },\r
    "configurationGPSUseBeidou": {\r
        "message": "GPS использует спутники BeiDou (CN)"\r
    },\r
    "osd_esc_rpm_precision_help": {\r
        "message": "Количество цифр, отображаемых для оборотов (RPM). Если число оборотов превышает количество цифр, оно будет отображаться в тысячах RPM с максимально допустимым количеством десятичных знаков."\r
    },\r
    "maxClimbAngleHelp": {\r
        "message": "Максимальный угол набора высоты в навигационных режимах. Ограничено максимальным углом тангажа на вкладке «PID настройки»."\r
    },\r
    "sensorsSonar": {\r
        "message": "Сонар, см"\r
    },\r
    "osd_link_quality_alarm": {\r
        "message": "Предупреждение о качестве канал связи"\r
    },\r
    "sensorAirspeed": {\r
        "message": "Воздушная скорость"\r
    },\r
    "configurationGPSBaudrate": {\r
        "message": "Скорость передачи данных"\r
    },\r
    "configurationThrottleMaximum": {\r
        "message": "Максимальная тяга"\r
    },\r
    "geozoneSafehomeAsInclusiveHelp": {\r
        "message": "Рассматривать ближайший safehome как включающую геозону"\r
    },\r
    "osdElement_POS_Z_PIDS": {\r
        "message": "PID: Позиция Z"\r
    },\r
    "rthSafeHome": {\r
        "message": "Режим безопасного дома"\r
    },\r
    "noConfigurationReceived": {\r
        "message": "Не получено никаких настроек в течение <span style=\\"color: red\\">10 секунд </span>, связь <span style=\\"color: red\\">прервана</span>"\r
    },\r
    "brakingBoostTimeoutTip": {\r
        "message": "Мера безопасности. Это максимальный период времени, в течение которого может быть активно торможение."\r
    },\r
    "osd_font_vision": {\r
        "message": "Vision"\r
    },\r
    "tabMAGNETOMETER": {\r
        "message": "Магнитометр/компас"\r
    },\r
    "pidTuning_dtermFilters": {\r
        "message": "Фильтры D-составляющей"\r
    },\r
    "osdElement_THROTTLE_POSITION_HELP": {\r
        "message": "Показывает положение стика тяги в тех режимах полёта, где <i>он</i> контролирует мощность тяги. В навигационных режимах отображается значение тяги, заданное INAV."\r
    },\r
    "osd_video_format": {\r
        "message": "Формат видео"\r
    },\r
    "osdElement_SAG_COMP_MAIN_BATT_VOLTAGE": {\r
        "message": "Напряжение батареи с компенсацией просадки"\r
    },\r
    "adjustmentsFunction46": {\r
        "message": "Регулировка P-коэффициента скорости XY"\r
    },\r
    "statusbar_arming_flags": {\r
        "message": "Флаги арминга:"\r
    },\r
    "configurationLaunchAccel": {\r
        "message": "Пороговое ускорение"\r
    },\r
    "firmwareFlasherReleaseStatusReleaseCandidate": {\r
        "message": "<span style=\\"color: red\\">ВАЖНО: Эта версия прошивки в настоящее время помечена как кандидат на выпуск (rc). Пожалуйста, немедленно сообщайте о любых проблемах.</span>"\r
    },\r
    "axisTableTitleAxis": {\r
        "message": "Ось"\r
    },\r
    "osdAlarmGFORCE_AXIS_MIN_HELP": {\r
        "message": "Элементы перегрузки на осях начнут мигать, когда перегрузка опускается ниже этого значения"\r
    },\r
    "MagGainYText": {\r
        "message": "Прирост Y"\r
    },\r
    "serialLoggingSupportedNote": {\r
        "message": "Вы можете логировать на внешнее устройство (такое как OpenLog или совместимый клон) используя последовательный порт. Сконфигурируйте порт во вкладке «Порты»."\r
    },\r
    "mainHelpLink": {\r
        "message": "Статус последовательного соединения"\r
    },\r
    "ledStripModeColorsModeArmed": {\r
        "message": "Взведён"\r
    },\r
    "missionTitleSaveMissionToFC": {\r
        "message": "Сохранить миссию в полётный контроллер"\r
    },\r
    "usbDeviceClosed": {\r
        "message": "USB устройство <span style=\\"color: #37a8db\\">успешно</span> отключено"\r
    },\r
    "positionEstimatorConfiguration": {\r
        "message": "Оценщик положения"\r
    },\r
    "dataflashFileWriteFailed": {\r
        "message": "Не удалось выполнить запись в выбранный вами файл. Есть ли права на эту директорию?"\r
    },\r
    "osdLayoutPasteFromClipboard": {\r
        "message": "Расположение восстановлено из буфера обмена"\r
    },\r
    "stm32Flashing": {\r
        "message": "Прошивка ..."\r
    },\r
    "maintenanceFlushSettingsCache": {\r
        "message": "Сбросить кеш настроек"\r
    },\r
    "pidTuning_RollPitchRate": {\r
        "message": "Скорости крена и тангажа"\r
    },\r
    "adjustmentsFunction45": {\r
        "message": "Настройка P-коэффициента курса"\r
    },\r
    "tabAdvancedTuningTitle": {\r
        "message": "Расширенная настройка"\r
    },\r
    "magnetometerElementToShow": {\r
        "message": "Элемент для отображения: модель магнитометра или чип, или оси"\r
    },\r
    "SafehomeId": {\r
        "message": "#"\r
    },\r
    "servosName": {\r
        "message": "Название"\r
    },\r
    "receiverEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранён</span>: приёмник"\r
    },\r
    "missionGeozone": {\r
        "message": "-геозона "\r
    },\r
    "missionTitleSaveEepromSafehome": {\r
        "message": "Сохранить Safehome в Eeprom"\r
    },\r
    "osd_pan_servo_settings": {\r
        "message": "Настройки OSD сервопривода панорамирования"\r
    },\r
    "failsafeFeatureItem": {\r
        "message": "Включено"\r
    },\r
    "loggingAutomaticallyRetained": {\r
        "message": "Автоматически загружен предыдущий лог-файл: <strong>$1</strong>"\r
    },\r
    "osd_switch_indicator_settings_HELP": {\r
        "message": "Рекомендуется использовать Настраиваемые элементы OSD в качестве замены индикаторам переключателей. Они обладают гораздо большей функциональностью. Нажмите, чтобы увидеть пример."\r
    },\r
    "statusbar_usage_upload": {\r
        "message": "U: $1%"\r
    },\r
    "failsafeMinDistanceProcedureHelp": {\r
        "message": "Это процедура failsafe, которая будет выполнена, когда аппарат находится ближе к дому, чем граница минимального расстояния failsafe."\r
    },\r
    "communitySlackSupport": {\r
        "message": "Чат поддержки в Slack"\r
    },\r
    "loggingErrorOneProperty": {\r
        "message": "Выберите по крайней мере одно свойство для логирования"\r
    },\r
    "adjustmentsFunction39": {\r
        "message": "Регулировка P-коэффициента положения XY"\r
    },\r
    "rthSafeHomeDistanceHelp": {\r
        "message": "Чтобы можно было использовать безопасный дом, он должен находиться на расстоянии менее этого [в см] от точки запуска."\r
    },\r
    "loggingStop": {\r
        "message": "Остановить запись лога"\r
    },\r
    "serialPortClosedOk": {\r
        "message": "MSP соединение <span style=\\"color: #37a8db\\">успешно</span> закрыто"\r
    },\r
    "motorWizard3": {\r
        "message": "Передний левый"\r
    },\r
    "logicOperation": {\r
        "message": "Операция"\r
    },\r
    "osdPanServoPwm2centideg": {\r
        "message": "Общий угол поворота сервопривода панорамирования в градусах"\r
    },\r
    "osdSettingCRSF_LQ_FORMAT_HELP": {\r
        "message": "TYPE1 показывает LQ%, используемый оборудованием TBS.<br/>TYPE2 показывает режимы радиочастотного профиля (RF Profile Modes) (с частотами обновления 2 = 150 Гц, 1 = 50 Гц, 0 = 4 Гц) и LQ % [0..100%].<br/>Tracer показывает RFMode 1 (1=250 Гц) и LQ % [0..100%]."\r
    },\r
    "initialSetupRSSI": {\r
        "message": "RSSI:"\r
    },\r
    "settings": {\r
        "message": "Настройки"\r
    },\r
    "osdElement_VTX_POWER_HELP": {\r
        "message": "Показывает текущий уровень мощности видеопередатчика. Мигает, когда на пульте выбран соответствующий параметр регулировки"\r
    },\r
    "geozoneSafehomeZoneActionHelp": {\r
        "message": "Действие при пересечении зоны safehome"\r
    },\r
    "initialSetupBatteryThresholds": {\r
        "message": "Пороговое значение использования батареи"\r
    },\r
    "tabLogging": {\r
        "message": "Логирование через кабель"\r
    },\r
    "loggingLogSize": {\r
        "message": "Размер журнала:"\r
    },\r
    "pidTuning_TPABreakPoint": {\r
        "message": "Порог срабатывания TPA"\r
    },\r
    "pidTuning_FeedForward": {\r
        "message": "Упреждающая связь"\r
    },\r
    "mixerWizardModalApply": {\r
        "message": "Применить"\r
    },\r
    "osdGroupTimers": {\r
        "message": "Таймеры"\r
    },\r
    "i2cSpeedSuggested800khz": {\r
        "message": "Пожалуйста, переключитесь на 800кГц, если подключенное оборудование позволяет это"\r
    },\r
    "featureFW_LAUNCH": {\r
        "message": "Постоянно включить режим LAUNCH для фиксированного крыла"\r
    },\r
    "sensorRangefinder": {\r
        "message": "Дальномер"\r
    },\r
    "ouptputsConfiguration": {\r
        "message": "Конфигурация"\r
    },\r
    "escProtocolHelp": {\r
        "message": "ESC должен поддерживать выбранный протокол. Изменяйте протокол только в том случае, если вы уверены, что ESC его поддерживает!"\r
    },\r
    "pitchToThrottleSmoothingHelp": {\r
        "message": "Насколько плавно автопилот регулирует уровень тяги в ответ на изменение угла тангажа [0-9]."\r
    },\r
    "sensorsAirSpeedSelect": {\r
        "message": "Воздушная скорость"\r
    },\r
    "loadedMixerProfile": {\r
        "message": "Загруженный профиль микшера: <strong style=\\"color: #37a8db\\">$1</strong>. Выберите \\"Профиль микшера 2\\" в переключателе профилей, если вы не видите изменений"\r
    },\r
    "configurationGyroFrequencyHelp": {\r
        "message": "В целом, более высокое значение лучше, но делает БПЛА более чувствительным к вибрациям. Должно поддерживаться выше частоты «Времени цикла контроллера полета». Максимально практическое значение зависит от аппаратного обеспечения. Если установить слишком высокое значение, плата может работать неправильно. Следите за нагрузкой процессора."\r
    },\r
    "vtxDisclaimer": {\r
        "message": "Используйте только те диапазоны, каналы и уровни мощности, которые разрешены в том месте, где вы летаете! Всегда обращайтесь к руководству пользователя видеопередатчика и местным нормам!"\r
    },\r
    "configurationLaunchMaxAngleHelp": {\r
        "message": "Максимальный угол броска (комбинированный по тангажу и крену), позволяющий считать запуск успешным. Установите значение 180, чтобы полностью отключить. По умолчанию: 45 [5-180]"\r
    },\r
    "fwLandGlideAlt": {\r
        "message": "Начальная высота фазы планирования"\r
    },\r
    "appUpdateNotificationDescription": {\r
        "message": "Посетите <a href=\\"https://github.com/iNavFlight/inav-configurator/releases\\" target=\\"_blank\\">веб-сайт</a>, чтобы прочитать примечания к выпуску и загрузить его."\r
    },\r
    "osd_font_manager": {\r
        "message": "Менеджер шрифтов"\r
    },\r
    "failsafeChannelFallbackSettingsHold": {\r
        "message": "<strong>Hold</strong> означает сохранение последнего полученного корректного значения.<strong>Set</strong> - использование указанного значения"\r
    },\r
    "cliDocsBtn": {\r
        "message": "Документация команд"\r
    },\r
    "failsafeMinDistanceItem": {\r
        "message": "Минимальное расстояние failsafe"\r
    },\r
    "appUpdateNotificationHeader": {\r
        "message": "Доступна новая версия конфигуратора."\r
    },\r
    "pidTuning_YawExpo": {\r
        "message": "Экспонента рыскания"\r
    },\r
    "pidTuning_itermBankAngleFreeze": {\r
        "message": "Угол крена для заморозки I-составляющей рыскания"\r
    },\r
    "osdElement_AIR_MAX_SPEED": {\r
        "message": "Максимальная воздушная скорость"\r
    },\r
    "stm32WrongResponse": {\r
        "message": "Сбой связи с STM32, неправильный ответ, ожидалось: $1 (0x$2), получено: $3 (0x$4)"\r
    },\r
    "osdElement_HOR_DIST_TO_NEXT_GEOZONE": {\r
        "message": "Расстояние по горизонтали до следующей геозоны"\r
    },\r
    "configurationBatteryWarning": {\r
        "message": "Напряжение ячейки для получения предупреждения"\r
    },\r
    "pidTuning_d_boost_min_help": {\r
        "message": "Определяет максимально допустимое ослабление D-составляющей во время фазы ускорения стика. Значение 1.0 означает, что D-составляющая не ослабляется. 0.5 означает, что ей разрешено уменьшиться наполовину. Более низкие значения приводят к более быстрой реакции во время быстрых движений стика."\r
    },\r
    "firmwareFlasherLoadFirmwareFile": {\r
        "message": "Пожалуйста, загрузите файл прошивки"\r
    },\r
    "MissionPlannerRTHSettingsCheck": {\r
        "message": "Настройка RTH некорректна: должно быть 0 или 1. Проверьте её ещё раз!\\nПроизводится принудительная установка значения 0, то есть БЕЗ ПОСАДКИ после RTH!"\r
    },\r
    "firmwareFlasherFullChipErase": {\r
        "message": "Полное стирание микроконтроллера"\r
    },\r
    "tabOnboardLogging": {\r
        "message": "Чёрный ящик"\r
    },\r
    "osd_hud_radar_range_min_help": {\r
        "message": "Летательные аппараты, расположенные ближе указанного расстояния, не будут отображаться в HUD."\r
    },\r
    "configurationGyroFrequencyTitle": {\r
        "message": "Частота задач гироскопа"\r
    },\r
    "geozoneActionPosHold": {\r
        "message": "Удержание позиции"\r
    },\r
    "featureONESHOT125Tip": {\r
        "message": "Перед включением отсоедините летную батарею и снимите пропеллеры."\r
    },\r
    "pidTuning_PitchRate": {\r
        "message": "Скорость тангажа"\r
    },\r
    "rthTwoStageAlt": {\r
        "message": "Высота первого этапа набора высоты"\r
    },\r
    "adjustmentsSlot3": {\r
        "message": "Слот 4"\r
    },\r
    "ledStripColorSetupTitle": {\r
        "message": "Настройка цвета"\r
    },\r
    "sensorStatusBaro": {\r
        "message": "Барометр"\r
    },\r
    "osdElement_SENSOR3_TEMPERATURE": {\r
        "message": "Датчик температуры 3"\r
    },\r
    "ledStripV": {\r
        "message": "V"\r
    },\r
    "rthAbortThresholdHelp": {\r
        "message": "Функция проверки работоспособности RTH отслеживает, увеличивается ли расстояние до дома во время RTH. Если это расстояние превышает порог, заданный этим параметром, вместо продолжения RTH БПЛА выполнит в аварийную посадку. Значение по умолчанию — 500м, что достаточно безопасно как для мультикоптеров, так и для самолётов."\r
    },\r
    "osdElement_MAP_TAKEOFF": {\r
        "message": "Карта (взлёт вверху)"\r
    },\r
    "armingCheckFail": {\r
        "message": "<div class=\\"checksfail\\"></div>"\r
    },\r
    "configurationBatteryCellDetectVoltageHelp": {\r
        "message": "Максимальное напряжение ячейки, используемое для автоматического определения количества ячеек. Должно быть выше максимального напряжения ячейки, чтобы учесть возможный дрейф измеренного напряжения и обеспечить точность определения количества ячеек."\r
    },\r
    "BLACKBOX_FEATURE_RC_DATA": {\r
        "message": "Данные пульта"\r
    },\r
    "gsTelemetryFix": {\r
        "message": "Местоположение"\r
    },\r
    "sensorsSonarSelect": {\r
        "message": "Сонар"\r
    },\r
    "osd_crsf_lq_format": {\r
        "message": "Формат Crossfire LQ"\r
    },\r
    "maxBankAngle": {\r
        "message": "Макс. угол крена при навигации"\r
    },\r
    "adjustmentsFunction35": {\r
        "message": "Корректировка тангажа платы"\r
    },\r
    "firmwareFlasherHash": {\r
        "message": "Хэш:"\r
    },\r
    "cliCopyToClipboardBtn": {\r
        "message": "Копировать в буфер обмена"\r
    },\r
    "configurationAccelTrimRoll": {\r
        "message": "Триммирование акселерометра по крену"\r
    },\r
    "mixerPreset": {\r
        "message": "Пресет микшера"\r
    },\r
    "gps_min_sats": {\r
        "message": "Минимум спутников GPS для определения точного местоположения"\r
    },\r
    "navMotorStop": {\r
        "message": "Переопределение остановки моторов в режиме навигации"\r
    },\r
    "loadFileMissionButton": {\r
        "message": "Загрузить файл"\r
    },\r
    "missionFwLandAlt": {\r
        "message": "Высота приземления (см):"\r
    },\r
    "configurationVTXNoBandHelp": {\r
        "message": "Частота VTX установлена вручную. Выбор диапазона приведёт к перезаписи настроенной частоты."\r
    },\r
    "firmwareFlasherReleaseTarget": {\r
        "message": "Целевая платформа:"\r
    },\r
    "ledStripDirW": {\r
        "message": "З"\r
    },\r
    "adjustmentsFunction9": {\r
        "message": "Регулировка CD/FF-коэффициентов крена и тангажа"\r
    },\r
    "servoRefreshRatelHelp": {\r
        "message": "Сервопривод должен поддерживать частоту обновления. Изменяйте частоту обновления только в том случае, если вы уверены, что сервопривод поддерживает указанную частоту. Слишком высокая частота обновления может повредить сервоприводы!"\r
    },\r
    "tabAdvancedTuningAirplaneTuningTitle": {\r
        "message": ": с фиксированным крылом"\r
    },\r
    "sensorBatteryProfile3": {\r
        "message": "Профиль батареи 3"\r
    },\r
    "writePermissionsForFile": {\r
        "message": "У вас нет <span style=\\"color: red\\">прав на запись</span> для этого файла"\r
    },\r
    "tabSwitchUpgradeRequired": {\r
        "message": "Вам необходимо <strong>обновить</strong> свою прошивку, прежде чем вы сможете использовать вкладку $1."\r
    },\r
    "missionGeozoneEdit": {\r
        "message": "Редактирование геозоны $1"\r
    },\r
    "missionSettingsCancel": {\r
        "message": "Отмена"\r
    },\r
    "sensorsDebugTrace": {\r
        "message": "Открыть Debug Trace"\r
    },\r
    "ReceiveTime": {\r
        "message": "Время получения: "\r
    },\r
    "blackboxConfiguration": {\r
        "message": "Конфигурация Blackbox"\r
    },\r
    "stm32AddressLoadSuccess": {\r
        "message": "Загрузка адреса для сектора байтов опций выполнена успешно."\r
    },\r
    "maxThrottle": {\r
        "message": "Макс. тяга"\r
    },\r
    "portsFunction_TBS_SMARTAUDIO": {\r
        "message": "TBS SmartAudio"\r
    },\r
    "missionTitleMoveToCenterView": {\r
        "message": "Установить дом в центре отображаемой карты"\r
    },\r
    "ledStripIndecatorOverlay": {\r
        "message": "Индикатор"\r
    },\r
    "errorReadingFile": {\r
        "message": "<span style=\\"color: red\\">Ошибка чтения файла</span>"\r
    },\r
    "ledStripSelectChannelFromColorList": {\r
        "message": "Выберите канал из списка цветов"\r
    },\r
    "osdalarmLQ_HELP": {\r
        "message": "Для Crossfire используйте 70%. Для Tracer используйте 50%."\r
    },\r
    "firmwareFlasherTargetWarning": {\r
        "message": "<span style=\\"color: red\\">ВАЖНО</span>: Убедитесь, что файл прошивки соответствует вашему полётному контроллеру. Прошивка, залитая в неподходящий для неё полётный контроллер может привести к <span style=\\"color: red\\">серьёзным</span> проблемам."\r
    },\r
    "osdElement_GPS_HDOP": {\r
        "message": "GPS HDOP"\r
    },\r
    "osdElement_LQ_UPLINK_HELP": {\r
        "message": "При использовании CRSF используйте настройку формата Crossfire LQ для выбора типа формата."\r
    },\r
    "featureOSD": {\r
        "message": "OSD (On Screen Display, отображение данных поверх изображения камеры)"\r
    },\r
    "osdElement_G_FORCE_X_HELP": {\r
        "message": "Показывает перегрузку по оси X (продольной)"\r
    },\r
    "gyroNotchHz2Help": {\r
        "message": "Должна быть настроена на частоту двигателя.<br><br>Значение должно быть выше частоты среза и ниже частоты первого режекторного фильтра гироскопа.<br><br><i>0</i> отключает фильтр"\r
    },\r
    "configurationLaunchIdleThr": {\r
        "message": "Холостая тяга"\r
    },\r
    "pidTuning_Filters": {\r
        "message": "Фильтры"\r
    },\r
    "initialSetupPowerDraw": {\r
        "message": "Потребляемая мощность:"\r
    },\r
    "colorRed": {\r
        "message": "красный"\r
    },\r
    "documentation": {\r
        "message": "Документация"\r
    },\r
    "osdElement_SAG_COMP_MAIN_BATT_VOLTAGE_HELP": {\r
        "message": "Расчётное напряжение, при котором должна находиться батарея без нагрузки (имитация идеальной батареи)"\r
    },\r
    "osd_dji_use_craft_name_elements": {\r
        "message": "<span>Использовать название аппарата в сообщениях и дополнительных элементах.</span><br/>Элементы, выделенные <span class=\\"blue\\">синим цветом</span>, отображаются в имени аппарата."\r
    },\r
    "pidEnabled": {\r
        "message": "Включено"\r
    },\r
    "gyroNotchCutoff1": {\r
        "message": "Частота среза первого режекторного фильтра гироскопа"\r
    },\r
    "stm32UnprotectUnplug": {\r
        "message": "ТРЕБУЕТСЯ ДЕЙСТВИЕ: Отключите и снова подключите полётный контроллер в DFU-режиме, чтобы попробовать его снова прошить!"\r
    },\r
    "configurationVTXBand": {\r
        "message": "Диапазон"\r
    },\r
    "magnetometerOrientationPreset": {\r
        "message": "Предустановка ориентации (align_mag) относительно ориентации полётного контроллера"\r
    },\r
    "missionGeozoneMaxZonesReached": {\r
        "message": "Достигнуто максимальное количество геозон."\r
    },\r
    "pidTuning_dTermMechanics": {\r
        "message": "Механика D-составляющей"\r
    },\r
    "adjustmentsFunction33": {\r
        "message": "Влияние тангажа на тягу (для самолёта)"\r
    },\r
    "sitlProfiles": {\r
        "message": "Профили SITL"\r
    },\r
    "accCalibrationStartBody": {\r
        "message": "Разместите полётный контроллер так, как показано на изображении, затем снова нажмите кнопку <strong>«Калибровать акселерометр»</strong>. Повторите это для каждого из 6 шагов. Держите его неподвижно во время калибровки."\r
    },\r
    "osdSettingPLUS_CODE_DIGITS_HELP": {\r
        "message": "Точность на экваторе: 10=13,9х13,9м; 11=2,8х3,5м; 12=56х87см; 13=11х22см."\r
    },\r
    "sensorsScale": {\r
        "message": "Масштаб:"\r
    },\r
    "missionTotalInfoFilenameLoaded": {\r
        "message": "Загруженный файл:"\r
    },\r
    "rc_filter_lpf_hz": {\r
        "message": "Ручной ФНЧ, Гц"\r
    },\r
    "configurationSensorMagAngles": {\r
        "message": "Ориентация задана с помощью: ANGLES (align_mag_roll, align_mag_pitch, align_mag_yaw)"\r
    },\r
    "adjustmentsFunction18": {\r
        "message": "Регулировка P-коэффициента рыскания"\r
    },\r
    "w_z_baro_p": {\r
        "message": "Коэффициент доверия барометру для вертикальной позиции"\r
    },\r
    "osdElement_VTX_POWER": {\r
        "message": "Уровень мощности видеопередачи"\r
    },\r
    "accCalibrationStopBody": {\r
        "message": "Калибровка акселерометра завершена, проверьте, что значения сохранились."\r
    },\r
    "sensorAirspeedShort": {\r
        "message": "Скорость"\r
    },\r
    "sensorPitot": {\r
        "message": "Трубка Пито"\r
    },\r
    "pidTuningTPAHelp": {\r
        "message": "Коэффициент ослабления PID-регулятора по тяге. Усиления PID-регулятора будут линейно уменьшаться, начиная с 0 в точке срабатывания TPA по тяге (TPA Breakpoint) до значения TPA Factor на максимальной тяге."\r
    },\r
    "initialSetup_Wh_drawn": {\r
        "message": "Израсходованная ёмкость:"\r
    },\r
    "yawPLimitHelp": {\r
        "message": "Ограничивает P-составляющую рыскания. Увеличение этого параметра улучшает устойчивость по рысканью, но может вызвать нестабильность по крену и тангажу."\r
    },\r
    "failsafeSubTitle1": {\r
        "message": "Процедура"\r
    },\r
    "osdGroupRx": {\r
        "message": "Статистика передатчика"\r
    },\r
    "configurationSensors": {\r
        "message": "Сенсоры и шины"\r
    },\r
    "failsafeFeatureHelp": {\r
        "message": "<strong>Примечание.</strong> Когда этап 2 ОТКЛЮЧЕН, то для всех полетных каналов (крен, тангаж, рыскание и тяга) вместо пользовательской будет использоваться резервная настройка <strong>Auto</strong>."\r
    },\r
    "missionTitlEditMission": {\r
        "message": "Редактировать миссию"\r
    },\r
    "adjustmentsFunction20": {\r
        "message": "Регулировка D-коэффициента рыскания"\r
    },\r
    "sitlStdProfileCantDeleted": {\r
        "message": "Стандартный профиль SITL не может быть удалён."\r
    },\r
    "geozoneSafeAltitudeDistanceHelp": {\r
        "message": "Вертикальная дистанция, которую необходимо соблюдать относительно верхней и нижней границ зоны."\r
    },\r
    "featureGEOZONE": {\r
        "message_en": "Geozone",\r
        "message": "Геозоны"\r
    },\r
    "osd_gforce_alarm": {\r
        "message": "Перегрузка"\r
    },\r
    "osdElement_MAIN_BATT_VOLTAGE": {\r
        "message": "Напряжение батареи"\r
    },\r
    "BLOCKED_SENSORS_CALIBRATING": {\r
        "message": "Калибровка во время работы"\r
    },\r
    "brakingDisengageSpeedTip": {\r
        "message": "Торможение закончится, когда скорость упадёт ниже этого значения"\r
    },\r
    "initialSetupBatteryMahValue": {\r
        "message": "$1 мАч"\r
    },\r
    "targetPrefetchFailNoPort": {\r
        "message": "Невозможно определить полётный контроллер: нет подключения"\r
    },\r
    "pidTuning_gyro_dyn_lpf_max_hz_help": {\r
        "message": "Определяет частоту среза ФНЧ гироскопа при максимальной тяге. Когда тяга уменьшается, частота среза ФНЧ также уменьшается, вплоть до минимальной частоты среза."\r
    },\r
    "osd_font_large": {\r
        "message": "Large"\r
    },\r
    "pidTuning_d_boost_max_help": {\r
        "message": "Определяет максимальное усиление D-составляющей, когда достигнуто максимальное угловое ускорение. 1.0 означает, что усиление D-составляющей отключено, 2.0 означает, что D-составляющей разрешено увеличиться на 100%. Значения между 1.5 и 1.7 обычно являются оптимальными."\r
    },\r
    "BLACKBOX_FEATURE_GYRO_PEAKS_YAW": {\r
        "message": "Пиковая частота шума гироскопа. Рыскание"\r
    },\r
    "initialSetupBatteryRemainingCapacity": {\r
        "message": "Оставшаяся ёмкость аккумулятора"\r
    },\r
    "onboardLoggingBlackboxRate": {\r
        "message": "Часть итераций цикла полета для журналирования (скорость журналирования)"\r
    },\r
    "navMaxAltitudeHelp": {\r
        "message": "Максимально допустимая высота (выше домашней точки), которая применяется ко всем режимам навигации (включая удержание высоты). 0 означает, что лимит отключен"\r
    },\r
    "gpsTimeouts": {\r
        "message": "Таймауты:"\r
    },\r
    "osdElement_PLIMIT_ACTIVE_CURRENT_LIMIT": {\r
        "message": "Действующее ограничение тока"\r
    },\r
    "osdElement_G_FORCE_Y_HELP": {\r
        "message": "Показывает перегрузку по оси Y (поперечной)"\r
    },\r
    "receiverButtonRefresh": {\r
        "message": "Обновить"\r
    },\r
    "saveMissionButton": {\r
        "message": "Сохранить миссию в полётный контроллер"\r
    },\r
    "dtermNotchHzHelp": {\r
        "message": "Должна быть установлена между первой и второй частотой режекторного фильтра гироскопа.<br><br>Должна быть выше частоты среза.<br><br><i>0</i> отключает фильтр"\r
    },\r
    "configurationVTXLowPowerDisarmValue_0": {\r
        "message": "Отключен"\r
    },\r
    "serialReceiver": {\r
        "message": "Последовательный приёмник"\r
    },\r
    "osdElement_REMAINING_FLIGHT_DISTANCE_HELP": {\r
        "message": "Расчётное оставшееся расстояние полета до того, как аппарату потребуется вернуться домой, основанное на оставшемся заряде батареи, средней мощности и расстояния до дома. Только для аппаратов с фиксированным крылом. Пожалуйста, ознакомьтесь с документацией"\r
    },\r
    "landMaxAltVspd": {\r
        "message": "Аппарат начнёт снижаться с этой скоростью, как только достигнет точки <strong>«Дом»</strong>."\r
    },\r
    "WaypointOptionId": {\r
        "message": "#"\r
    },\r
    "configurationBatteryVoltage": {\r
        "message": "Напряжение батареи"\r
    },\r
    "osd_current_alarm": {\r
        "message": "Потребляемый ток (A)"\r
    },\r
    "firmwareFlasherManualBaudDescription": {\r
        "message": "Ручной выбор скорости передачи данных для плат, которые не поддерживают скорость по умолчанию, или для прошивки через Bluetooth.<br /><span style=\\"color: red\\">Примечание:</span> не используется при прошивке через USB DFU"\r
    },\r
    "sitlSerialStopbits": {\r
        "message": "Стопбиты"\r
    },\r
    "GeozoneSettings": {\r
        "message": "Настройки геозоны"\r
    },\r
    "osdElement_MAIN_BATT_REMAINING_CAPACITY": {\r
        "message": "Оставшаяся ёмкость батареи"\r
    },\r
    "auxiliaryToggleUnused": {\r
        "message": "Скрыть неиспользуемые режимы"\r
    },\r
    "sitlSimInput": {\r
        "message": "Ввод симулятора"\r
    },\r
    "initialSetupAccelCalibStarted": {\r
        "message": "Калибровка акселерометра начата"\r
    },\r
    "failsafeUseMinimumDistanceItem": {\r
        "message": "Использовать альтернативную процедуру Failsafe на минимальном расстоянии, когда находитесь рядом с домом"\r
    },\r
    "dataflashButtonEraseCancel": {\r
        "message": "Отмена"\r
    },\r
    "cliCopySuccessful": {\r
        "message": "Скопировано!"\r
    },\r
    "confirm_reset_pid": {\r
        "message": "Это сбросит все настройки PID до значений по умолчанию из прошивки и сохранит их.\\nПродолжить?"\r
    },\r
    "configurationBatteryMinimum": {\r
        "message": "Минимальное напряжение ячейки"\r
    },\r
    "accGain": {\r
        "message": "Усиление акселерометра"\r
    },\r
    "configurationAccelerometerFrequencyTitle": {\r
        "message": "Частота задач акселерометра"\r
    },\r
    "SendTime": {\r
        "message": "Время отправки: "\r
    },\r
    "geozoneNoWayHomeActionHelp": {\r
        "message": "Действие, если RTH с активными геозонами не может рассчитать курс до дома. RTH: Вернуться к дому и игнорировать любые геозоны."\r
    },\r
    "osd_hud_wp_disp_help": {\r
        "message": "Количество путевых точек, отображаемых на экране. 0 отключает эту функцию."\r
    },\r
    "missionGeozoneAvailableZones": {\r
        "message": "Доступные геозоны:"\r
    },\r
    "dataflashConfirmEraseTitle": {\r
        "message": "Подтвердите стирание dataflash"\r
    },\r
    "autoLandingSettings": {\r
        "message": "Настройки автоматического приземления"\r
    },\r
    "gsTelemetry": {\r
        "message": "Телеметрия"\r
    },\r
    "osdElement_GPS_SPEED_HELP": {\r
        "message": "Показывает путевую скорость по GPS."\r
    },\r
    "gpsMessageRate": {\r
        "message": "Время обновления:"\r
    },\r
    "gsTelemetryLongitude": {\r
        "message": "Долгота"\r
    },\r
    "osdElement_ACTIVE_PROFILE": {\r
        "message": "Показать активный профиль"\r
    },\r
    "initialSetupDeclination": {\r
        "message": "Склонение:"\r
    },\r
    "usbDeviceUdevNotice": {\r
        "message": "Правильно ли установлены <strong>udev-правила</strong>? Смотрите инструкцию в документации"\r
    },\r
    "endGettingSafehomePoints": {\r
        "message": "Окончание получения точек Safehome"\r
    },\r
    "featureBLACKBOXTip": {\r
        "message": "После включения настроить через вкладку «Чёрный ящик»."\r
    },\r
    "fwLandFinalApproachPitch2throttleHelp": {\r
        "message": "Это значение умножается на коэффициент «тангаж к тяге» во время финального захода. Позволяет снизить путевую скорость."\r
    },\r
    "gyroLpfWhyNotHigherMessage": {\r
        "message": "Если моторы не перегреваются, попробуйте установить 256Гц вместо текущего значения"\r
    },\r
    "dataflashEraseing": {\r
        "message": "Выполняется стирание, пожалуйста, подождите..."\r
    },\r
    "targetPrefetchFail": {\r
        "message": "Невозможно определить полётный контроллер: "\r
    },\r
    "ledStripWiringMode": {\r
        "message": "Режим порядка цепи"\r
    },\r
    "dtermNotchCutoff": {\r
        "message": "Частота среза режекторного фильтра D-составляющей."\r
    },\r
    "adjustmentsColumnEnable": {\r
        "message": "Если включено"\r
    },\r
    "pidTuning_MatrixFilterMinFrequency": {\r
        "message": "Минимальная частота матричного фильтра"\r
    },\r
    "configurationLaunchDetectTime": {\r
        "message": "Время обнаружения"\r
    },\r
    "configurationGyroSyncTitle": {\r
        "message": "Синхронизировать время цикла с гироскопом"\r
    },\r
    "cliCommandsHelp": {\r
        "message": "Вводите или вставляйте команды в поле слева. Вы можете использовать клавиши со стрелками вверх и вниз для переключения между ранее введёнными командами. Введите 'help' или щёлкните этот значок, чтобы получить дополнительную информацию."\r
    },\r
    "gps_map_center": {\r
        "message": "Центр"\r
    },\r
    "osd_unsupported_msg1": {\r
        "message": "Ваш полётный контроллер не отвечает на команды OSD. Вероятно, это означает, что у него нет встроенного OSD."\r
    },\r
    "configurationFeatureDescription": {\r
        "message": "Описание"\r
    },\r
    "featureBLACKBOX": {\r
        "message": "Чёрный ящик"\r
    },\r
    "sensorsBarometer": {\r
        "message": "Барометр, метры"\r
    },\r
    "featurePWM_SERVO_DRIVER": {\r
        "message": "Внешний PWM-драйвер сервоприводов"\r
    },\r
    "gyroNotchHz2": {\r
        "message": "Частота второго режекторного фильтра гироскопа"\r
    },\r
    "axisTableTitleValue": {\r
        "message": "Значение [°]"\r
    },\r
    "missionTotalInfoAvailablePoints": {\r
        "message": "Доступные точки"\r
    },\r
    "gsActivated": {\r
        "message": "Режим наземной стации активирован"\r
    },\r
    "motorWizard1": {\r
        "message": "Передний правый"\r
    },\r
    "throttleIdle": {\r
        "message": "Мощность моторов на холостом ходу [%]"\r
    },\r
    "missionTitleUpdateAll": {\r
        "message": "Обновить всё"\r
    },\r
    "adjustmentsFunction47": {\r
        "message": "Регулировка I-коэффициента скорости XY"\r
    },\r
    "tabRawSensorData": {\r
        "message": "Датчики"\r
    },\r
    "wpRestartMission": {\r
        "message": "Перезапустить миссию по путевым точкам"\r
    },\r
    "posholdMaxManualSpeed": {\r
        "message": "Максимальная крейсерская скорость"\r
    },\r
    "cruiseSpeedHelp": {\r
        "message": "Скорость самолёта/крыла на крейсерской тяге, используемая для оценки оставшегося времени/расстояния полёта в см/с"\r
    },\r
    "onboardLoggingBlackbox": {\r
        "message": "Устройство для записи в чёрный ящик"\r
    },\r
    "rthClimbFirstHelp": {\r
        "message": "Если установлено значение ON или ON_FW_SPIRAL, воздушное судно сначала наберёт высоту до значения параметра «Высота возврат домой» (на вкладке «Расширенная настройка»), прежде чем повернуть в сторону дома. Если установлено значение OFF, аппарат немедленно повернёт и начнёт движение к дому, набирая высоту по пути. Для самолётов ON будет использовать линейный набор высоты, ON_FW_SPIRAL будет использовать набор высоты по спирали. Скорость набора высоты задаётся параметром nav_auto_climb_rate, а скорость поворота параметром nav_fw_loiter_radius (ON_FW_SPIRAL — это настройка фиксированного крыла, которая ведет себя так же, как ON для мультикоптера)."\r
    },\r
    "osd_dji_adjustments": {\r
        "message": "Показать корректировки в названии аппарата"\r
    },\r
    "sensorsMagnetometer": {\r
        "message": "Магнитометр, Ga"\r
    },\r
    "failsafeChannelFallbackSettingsHelp": {\r
        "message": "Эти настройки применяются к отдельным недействительным радиоканалам или ко всем каналам при переходе на этап 1. <strong>Примечание</strong>: значения сохраняются с шагом 25 мкс, поэтому небольшие изменения не будут учтены"\r
    },\r
    "osdalarmSNR_HELP": {\r
        "message": "Отношение SNR (сигнал/шум) отображается только ниже указанного значения. 0 дБ (соотношение 1:1) означает, что уровень принимаемого сигнала равен уровню шума."\r
    },\r
    "firmwareFlasherMessage": {\r
        "message": "Сообщение:"\r
    },\r
    "stm32ProgrammingFailed": {\r
        "message": "Прошивка: СБОЙ"\r
    },\r
    "missionTitleSetActive": {\r
        "message": "Активировать"\r
    },\r
    "firmwareFlasherRecoveryText": {\r
        "message": "Если вы потеряли связь с платой, выполните следующие действия, чтобы восстановить связь: <ul><li>Выключите питание</li><li>Включите «Без перезагрузки», включите «Полное стирание чипа».</li><li >Перемкните контакты BOOT или удерживайте кнопку BOOT.</li><li>Включите питание (светодиод активности НЕ будет мигать, если всё сделано правильно).</li><li>Если необходимо, установите все драйверы STM32 и Zadig (см. раздел <a href =\\"https://github.com/iNavFlight/inav/blob/master/docs/USB%20Flashing.md\\"target=\\"_blank\\">\\"USB Flashing\\"</a> руководства INAV).</ li><li>Закройте конфигуратор, закройте все запущенные экземпляры Chrome, закройте все приложения Chrome, перезапустите конфигуратор.</li><li>Отпустите кнопку BOOT, если она есть на вашем полётном контроллере.</li><li>Прошейте правильную прошивку (вручную установите скорость передачи данных, если это указано в руководстве вашего полётного контроллера).</li><li>Выключите питание.</li><li>Удалите перемычку BOOT.</li><li>Включите питание (светодиод активности должен мигать).</li><li>Нормально подключайтесь.</li></ul>"\r
    },\r
    "missionSafehomeHead": {\r
        "message": "Менеджер SafeHome"\r
    },\r
    "pidTuning_ButtonSave": {\r
        "message": "Сохранить"\r
    },\r
    "SafehomeFwAppraoch": {\r
        "message": "Заход на посадку (самолёт):"\r
    },\r
    "fcNotConnected": {\r
        "message": "Не подключен"\r
    },\r
    "yawItermIgnoreRateHelp": {\r
        "message": "I-составляющая PID-регулятора игнорируется при превышении этой скорости вращения. Это предотвращает накопление I-составляющей во время манёвров"\r
    },\r
    "yawLpfCutoffFrequency": {\r
        "message": "Частота среза ФНЧ рыскания"\r
    },\r
    "servoOutput": {\r
        "message": "Вывод"\r
    },\r
    "sensorStatusMag": {\r
        "message": "Магнитометр"\r
    },\r
    "tabSwitchConnectionRequired": {\r
        "message": "Прежде чем увидеть любую из вкладок, вам нужно <strong>подключиться</strong>."\r
    },\r
    "landMinAltVspd": {\r
        "message": "Это скорость приземления."\r
    },\r
    "sitlSerialTcpEnable": {\r
        "message": "Включен"\r
    },\r
    "tzAutomaticDSTHelp": {\r
        "message": "Автоматически добавлять летнее время ко времени GPS, когда это необходимо или игнорировать его. Включает предустановки для ЕС и США — если вы живёте за пределами этих регионов, рекомендуется управлять летним временем вручную через tz_offset. (По умолчанию = OFF)"\r
    },\r
    "osdElement_WIND_SPEED_VERTICAL": {\r
        "message": "Вертикальная скорость ветра"\r
    },\r
    "mixer_pid_profile_linking_hint": {\r
        "message": "mixer_pid_profile_linking: включите на обоих профилях микшера, если вы хотите, чтобы переключение профилей управления обрабатывалось переключением профилей микшера. (Рекомендуется для VTOL/аппаратов со смешанным типом платформы)"\r
    },\r
    "gpsLoadAssistnowOfflineButton": {\r
        "message": "Загрузить AssistNow Offline"\r
    },\r
    "gsTelemetryLatitude": {\r
        "message": "Широта"\r
    },\r
    "pidTuning_Derivative": {\r
        "message": "Дифференциальный"\r
    },\r
    "pidTuning_gyro_dyn_lpf_min_hz": {\r
        "message": "Динамический ФНЧ гироскопа, мин. частота отсечки"\r
    },\r
    "dataflashButtonEraseConfirm": {\r
        "message": "Да, стереть dataflash"\r
    },\r
    "firmwareFlasherButtonLeave": {\r
        "message": "Выйти из программатора"\r
    },\r
    "geozone": {\r
        "message": "Геозона"\r
    },\r
    "ezTuneAxisRatio": {\r
        "message": "Соотношение осей"\r
    },\r
    "throttleIdleDigitalInfo": {\r
        "message": "Для цифровых протоколов мощность холостого хода можно снизить даже до 5-7% без остановки моторов в воздухе. Если дрон раскачивается после того, как вы нажали на стик тяги, попробуйте увеличить мощность IDLE, чтобы устранить это поведение."\r
    },\r
    "adjustmentsFunction60": {\r
        "message": "Регулировка реакции высоты (для самолёта)"\r
    },\r
    "initialSetupGPSHead": {\r
        "message": "GPS"\r
    },\r
    "ezTuneFilterHzTips": {\r
        "message": "Этот параметр задаёт базовую частоту среза для всех фильтров гироскопов и D-составляющей в INAV. Более высокие значения приведут к меньшей задержке фильтра и лучшей стабилизации. Однако через фильтры будет проходить больше шума, а двигатели будут нагреваться, появятся осцилляции и потеряется управляемость БПЛА. Ваша цель — увеличить до максимально возможного уроня, прежде чем появятся какие-либо негативные эффекты. К отрицательным эффектам относятся: перегрев моторов, слышимые осцилляции, сильная тряска БПЛА, самопроизвольный набор высоты. Обычные начальные значения для 'Фильтр, Гц: <strong>3&quot; пропеллеры</strong>: 90, <strong>5&quot; пропеллеры</strong>: 110, <strong>7&quot; пропеллеры</strong>: 90, <strong>10&quot; пропеллеры</strong>: 75, <strong>12&quot; пропеллеры</strong>: 60. Используйте Blackbox и здравый смысл, чтобы найти значение, наиболее подходящее для вашего БПЛА."\r
    },\r
    "stm32GlobalEraseExtended": {\r
        "message": "Выполняется глобальная очистка чипа (через расширенное стирание) ..."\r
    },\r
    "osdElement_AIR_MAX_SPEED_HELP": {\r
        "message": "Показывает максимальную воздушную скорость."\r
    },\r
    "sensorProfile2": {\r
        "message": "PID профиль 2"\r
    },\r
    "ezTuneNote": {\r
        "message": "<strong>Важно</strong> Ez Tune активирован. Все настройки на этой вкладке задаются и контролируются Ez Tune. Чтобы использовать вкладку «PID настройки», вам необходимо отключить Ez Tune. Для этого выключите переключатель <strong>Включено</strong> на вкладке Ez Tune."\r
    },\r
    "sitlStop": {\r
        "message": "Стоп"\r
    },\r
    "gpsAssistnowStart": {\r
        "message": "Начало передачи данных AssistNow..."\r
    },\r
    "osdSwitchInd0": {\r
        "message": "Переключатель 1"\r
    },\r
    "osdElement_RSSI_VALUE_HELP": {\r
        "message": "Показывает качество сигнала, принимаемого от пульта (чем выше, тем лучше)."\r
    },\r
    "pidFF": {\r
        "message": "FF-коэффициент"\r
    },\r
    "initialSetupButtonRestore": {\r
        "message": "Восстановление"\r
    },\r
    "missionFwApproachDir": {\r
        "message": "Направление захода на посадку:"\r
    },\r
    "navAutoClimbRate": {\r
        "message": "Макс. скорость набора высоты при навигации"\r
    },\r
    "adsbHeartbeatTotalMessages": {\r
        "message": "Сообщения пульса"\r
    },\r
    "wpTrackingAngle": {\r
        "message": "Угол отслеживания путевых точек"\r
    },\r
    "initialSetupPowerDrawValue": {\r
        "message": "$1 Вт"\r
    },\r
    "portsFunction_GIMBAL": {\r
        "message": "Последовательный подвес"\r
    },\r
    "rthConfiguration": {\r
        "message": "Настройки RTH"\r
    },\r
    "firmwareFlasherCommiter": {\r
        "message": "Автор:"\r
    },\r
    "receiverYawDeadband": {\r
        "message": "Мёртвая зона рыскания"\r
    },\r
    "targetPrefetchsuccessful": {\r
        "message": "Полётный контроллер выбран успешно: "\r
    },\r
    "osd_hud_radar_range_max": {\r
        "message": "Макс. радиус действия радара"\r
    },\r
    "stm32UnprotectInitFailed": {\r
        "message": "Не удалось запустить процедуру снятия защиты"\r
    },\r
    "illegalStateRestartRequired": {\r
        "message": "Недопустимое состояние. Требуется перезагрузка."\r
    },\r
    "osd_hud_settings_HELP": {\r
        "message": "Этот раздел позволяет настроить поведение элементов HUD."\r
    },\r
    "adjustmentsFunction30": {\r
        "message": "Ручная регулировка скорости тангажа"\r
    },\r
    "ledStripModeColorsModeAngle": {\r
        "message": "Угол"\r
    },\r
    "portsFunction_GSM_SMS": {\r
        "message": "GSM SMS"\r
    },\r
    "pidTuning_Altitude": {\r
        "message": "Барометр и сонар/высота"\r
    },\r
    "mixerApplyDescription": {\r
        "message": "Это действие отменяет все текущие настройки микшера и заменяет их значениями по умолчанию. Отмена («Undo») невозможна!"\r
    },\r
    "osdAlarmADSB_MAX_DISTANCE_ALERT": {\r
        "message": "Расстояние, на котором мигают данные ADSB для предупреждения о приближении"\r
    },\r
    "dataflashConfirmEraseNote": {\r
        "message": "Сотрутся все журналы Blackbox и другие данные, содержащиеся в dataflash. Стирание займёт около 20 секунд. Вы уверены?"\r
    },\r
    "functionAction": {\r
        "message": "Действие"\r
    },\r
    "adjustmentsGroupNavigationFlight": {\r
        "message": "Навигация и полет"\r
    },\r
    "osdPanServoIndex_HELP": {\r
        "message": "Установите значение, соответствующее номеру выхода сервопривода панорамирования; как показано в таблице выходов микшера. Например выход S6."\r
    },\r
    "receiverManualRcYawExpo": {\r
        "message": "Ручная RC экспонента по рысканию"\r
    },\r
    "generalNavigationSettings": {\r
        "message": "Общие настройки навигации"\r
    },\r
    "gpsFix": {\r
        "message": "Тип фиксации:"\r
    },\r
    "AccResetBtn": {\r
        "message": "Сброс калибровки акселерометра"\r
    },\r
    "ledStripStrobeText": {\r
        "message": "Стробоскоп"\r
    },\r
    "escProtocol": {\r
        "message": "Протокол ESC"\r
    },\r
    "failsafeThrottleItem": {\r
        "message": "Значение тяги, используемое при приземлении"\r
    },\r
    "gezoneInvalidReasonNotCC": {\r
        "message": "Не против часовой стрелки"\r
    },\r
    "stm32ResponseBootloaderFailed": {\r
        "message": "Загрузчик не отвечает, процесс прошивки: СБОЙ"\r
    },\r
    "receiverButtonSave": {\r
        "message": "Сохранить"\r
    },\r
    "osd_font_upload": {\r
        "message": "Загрузить шрифт"\r
    },\r
    "pitchToThrottleSmoothing": {\r
        "message": "Сглаживание тяги"\r
    },\r
    "initialSetupInfoHead": {\r
        "message": "Информация о системе"\r
    },\r
    "serialPortClosedFail": {\r
        "message": "<span style=\\"color: red\\">Не удалось</span> закрыть MSP соединение"\r
    },\r
    "initialSetupButtonCalibrateMag": {\r
        "message": "Калибровка магнитометра"\r
    },\r
    "gpsAssistnowLoadDataError": {\r
        "message": "Ошибка загрузки данных AssistNow."\r
    },\r
    "adjustmentsSlot2": {\r
        "message": "Слот 3"\r
    },\r
    "featureCURRENT_METER": {\r
        "message": "Мониторинг тока батареи"\r
    },\r
    "pidTuning_RollAndPitchExpo": {\r
        "message": "Экспонента по крену и тангажу"\r
    },\r
    "geozoneAvoidAltitudeRange": {\r
        "message": "Избегать перепада высот"\r
    },\r
    "ledStripModeColorsModeMag": {\r
        "message": "Компас"\r
    },\r
    "targetPrefetchFailOld": {\r
        "message": "Невозможно определить полётный контроллер: прошивка INAV слишком старая"\r
    },\r
    "configurationSerialRX": {\r
        "message": "Провайдер последовательного приёмника"\r
    },\r
    "tabServos": {\r
        "message": "Сервоприводы"\r
    },\r
    "deviceReady": {\r
        "message": "Устройство - <span style=\\"color: #37a8db\\">Готово</span>"\r
    },\r
    "osd_snr_alarm": {\r
        "message": "Уровень предупреждения SNR"\r
    },\r
    "configurationBatterySettingsHelp": {\r
        "message": "Эти настройки применяются к выбранному в данный момент профилю батареи "\r
    },\r
    "gpsPort": {\r
        "message": "Последовательный порт"\r
    },\r
    "rthClimbFirst": {\r
        "message": "Подъём перед RTH"\r
    },\r
    "initialSetupButtonReset": {\r
        "message": "Сбросить настройки"\r
    },\r
    "configurationVTXLowerPowerDisarmHelp": {\r
        "message": "Включение этой опции заставит видеопередатчик использовать самую низкую мощность, пока аппарат не взведён. Используйте «До первого взведения», чтобы он использовал самую низкую мощность только до тех пор, пока вы не взведёте его в первый раз."\r
    },\r
    "gpsEPV": {\r
        "message": "EPV:"\r
    },\r
    "osdUnitImperial": {\r
        "message": "Имперские единицы"\r
    },\r
    "osdElement_WIND_SPEED_VERTICAL_HELP": {\r
        "message": "Показывает расчётную вертикальную скорость и направление ветра (вверх или вниз)."\r
    },\r
    "ledStripBlinkAlwaysOverlay": {\r
        "message": "Всегда мигать"\r
    },\r
    "osdAlarmCURRENT_HELP": {\r
        "message": "Элемент начнёт мигать, когда потребление превысит заданное значение. 0 отключает этот сигнал тревоги."\r
    },\r
    "language_ja": {\r
        "message": "日本語",\r
        "_comment": "Don't translate!"\r
    },\r
    "gpsAssistnowDone": {\r
        "message": "Передача данных AssistNow завершена."\r
    },\r
    "pidTuning_Level": {\r
        "message": "Угол/Горизонт"\r
    },\r
    "errorReadingFileXml2jsNotFound": {\r
        "message": "<span style=\\"color: red\\">Ошибка чтения файла (xml2js не найден)</span>'"\r
    },\r
    "missionSettingsSave": {\r
        "message": "Сохранить"\r
    },\r
    "initialSetupCurrentDraw": {\r
        "message": "Потребляемый ток:"\r
    },\r
    "language_en": {\r
        "message": "English",\r
        "_comment": "Don't translate!"\r
    },\r
    "brakingBoostSpeedThreshold": {\r
        "message": "Мин. порог скорости усиления"\r
    },\r
    "presetApplyDescription": {\r
        "message": "<p style='color: darkred;'>Перед применением любых пресетов убедитесь, что <strong>микшер</strong> был настроен!</p><p>Пресет перезаписывает выбранные значения конфигурации, включая микшер, фильтрацию, PID и другие параметры. Такие настройки, как режимы полёта, настройки радиоуправления, failsafe и OSD, останутся без изменений. Применяемые значения <strong>НЕ</strong> следует рассматривать как окончательные, а только как отправные точки для окончательной настройки. <br> Всегда проверяйте новую конфигурацию перед полётом!</p>"\r
    },\r
    "mainManual": {\r
        "message": "Выбранный вручную"\r
    },\r
    "missionDefaultPointSpeed": {\r
        "message": "Скорость (см/с): "\r
    },\r
    "osd_camera_fov_h": {\r
        "message": "Гориз. угол обзора камеры"\r
    },\r
    "portsFunction_SBUS_OUTPUT": {\r
        "message": "Выход SBus"\r
    },\r
    "initialSetupBackupRestoreText": {\r
        "message": "Сделайте <strong>резервную копию</strong> вашей конфигурации на случай аварии, настройки, заданные в <strong>командной строке</strong>, <span style=\\"color: red\\">не</span> будут сохранены. См. команду 'dump' командной строки"\r
    },\r
    "pidTuning_Mechanics": {\r
        "message": "Механика"\r
    },\r
    "configurationLaunch": {\r
        "message": "Настройки автоматического запуска с фиксированным крылом"\r
    },\r
    "osdElement_3D_SPEED": {\r
        "message": "3D скорость"\r
    },\r
    "sensorsTemperature7": {\r
        "message": "Температура 7, °C"\r
    },\r
    "adjustmentsFunction51": {\r
        "message": "Регулировка D-коэффициента скорости Z"\r
    },\r
    "geozoneMrStopDistanceHelp": {\r
        "message": "Расстояние, на котором коптер остановится перед границей"\r
    },\r
    "loadedBatteryProfile": {\r
        "message": "Загруженный профиль батареи: <strong style=\\"color: #37a8db\\">$1</strong>"\r
    },\r
    "initialSetupMinCellV": {\r
        "message": "Мин. напряжение ячейки:"\r
    },\r
    "disconnecting": {\r
        "message": "Отключение..."\r
    },\r
    "pidTuning_TPA": {\r
        "message": "Ослабление PID-регулятора по тяге (TPA)"\r
    },\r
    "WaypointOptionP2": {\r
        "message": "P2"\r
    },\r
    "firmwareFlasherGithubInfoHead": {\r
        "message": "Информация о прошивке на Github"\r
    },\r
    "pidTuning_itermRelaxCutoffHelp": {\r
        "message": "Более низкие значения открывают более длительное временное окно для работы ослабления I-составляющей и более сильное его подавление. Более высокие значения сокращают временные окна и уменьшают подавление."\r
    },\r
    "osdSettingPLUS_CODE_SHORT_HELP": {\r
        "message": "Для восстановления координат при удалении 2, 4 или 6 ведущих цифр требуется опорная точка в радиусе ∼800, ∼40 или ∼2 км соответственно."\r
    },\r
    "cruiseManualThrottleHelp": {\r
        "message": "Включение этой опции позволит вам переопределить автоматическое управление тягой во всех навигационных режимах. Вы не сможете опуститься ниже значения автоматической тяги, за исключением остановки моторов при нулевом газе."\r
    },\r
    "pidTuning_MaxPitchAngle": {\r
        "message": "Макс. угол тангажа"\r
    },\r
    "portsFunction_TELEMETRY_HOTT": {\r
        "message": "HoTT"\r
    },\r
    "confirm_delete_all_points": {\r
        "message": "Вы действительно хотите удалить все точки?"\r
    },\r
    "pidTuning_Max_Roll": {\r
        "message": "Крен (°/10)"\r
    },\r
    "geozoneActionAvoid": {\r
        "message": "Обход"\r
    },\r
    "cliDiffAllBtn": {\r
        "message": "Все изменения"\r
    },\r
    "gsTelemetryAltitudeShort": {\r
        "message": "Высота"\r
    },\r
    "sitlNew": {\r
        "message": "Новый"\r
    },\r
    "configurationFeatureName": {\r
        "message": "Функции"\r
    },\r
    "eeprom_load_ok": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">загружен</span>"\r
    },\r
    "missionTitleRemoveAll": {\r
        "message": "Удалить все"\r
    },\r
    "stm32ReadProtected": {\r
        "message": "Видимо плата защищена от чтения. Снимаю защиту от чтения. Не отключайте устройство!"\r
    },\r
    "ledStripWiringClearControl": {\r
        "message": "Очистить выбранное"\r
    },\r
    "defaultButtonFirmwareFlasher": {\r
        "message": "Программатор"\r
    },\r
    "ezTuneRatePreviewRate": {\r
        "message": "Скорость"\r
    },\r
    "osdElement_SENSOR8_TEMPERATURE": {\r
        "message": "Датчик температуры 8"\r
    },\r
    "ledStripFunctionRingOption": {\r
        "message": "Кольцо"\r
    },\r
    "osd_camera_fov_v_help": {\r
        "message": "Вертикальный угол обзора камеры в градусах. Он используется для расчёта положения элементов на дисплее HUD."\r
    },\r
    "stm32AddressLoadUnknown": {\r
        "message_beta": "Сбой чтения адреса для option bytes с неизвестной ошибкой. Отмена ...",\r
        "message": "Сбой чтения адреса для сектора байтов опций с неизвестной ошибкой. Отмена."\r
    },\r
    "osdElement_SCALED_THROTTLE_POSITION_HELP": {\r
        "message": "Показывает положение стика тяги в режимах полёта, где <i>он</i> контролирует мощность тяги. В режимах навигации отображается значение тяги, заданное INAV. Это значение масштабируется на основе значений тяги при холостом ходе и максимальной тяге."\r
    },\r
    "osdElement_GPS_SATS": {\r
        "message": "GPS-спутники"\r
    },\r
    "osdElement_3D_SPEED_HELP": {\r
        "message": "Показывает полную (векторную) скорость с учётом как горизонтальной, так и вертикальной скоростей."\r
    },\r
    "gpsAltitude": {\r
        "message": "Высота:"\r
    },\r
    "MissionPlannerJumpSettingsCheck": {\r
        "message": "Настройки JUMP некорректны: проверьте их ещё раз!\\nПроизводится принудительный переход к путевой точке 1!"\r
    },\r
    "magnetometerStatHead": {\r
        "message": "Статистика магнитометра"\r
    },\r
    "confirm_overwrite_multimission_file_load_option": {\r
        "message": "Это перезапишет текущую мультимиссию.\\nПродолжить?"\r
    },\r
    "adjustmentsColumnViaChannel": {\r
        "message": "через канал"\r
    },\r
    "missionMultiMissionsInfo": {\r
        "message": "Информация о миссиях:"\r
    },\r
    "calibrationHead4": {\r
        "message": "Калибровка компаса"\r
    },\r
    "loggingErrorLogFile": {\r
        "message": "Пожалуйста, выберите лог-файл"\r
    },\r
    "sensorsTemperature1": {\r
        "message": "Температура 1, °C"\r
    },\r
    "pidTuning_ManualRollRate": {\r
        "message": "Ручная скорость крена"\r
    },\r
    "adjustmentsFunction28": {\r
        "message": "Ручная регулировка скорости тангажа и крена"\r
    },\r
    "featureFAILSAFE": {\r
        "message": "Применить настройки failsafe при потере сигнала с приёмника"\r
    },\r
    "missionGeozoneAvailableVertices": {\r
        "message": "Доступные вершины:"\r
    },\r
    "dynamic_gyro_notch_enabled_help": {\r
        "message": "Матричный гирофильтр — это новое поколение динамических режекторных фильтров гироскопа, доступных в INAV. Рекомендуется включать его на всех мультироторных сборках с полётными контроллерами F4 и F7."\r
    },\r
    "osd_font_clarity": {\r
        "message": "Clarity"\r
    },\r
    "receiverThrottleMid": {\r
        "message": "Тяга, средняя точка"\r
    },\r
    "MagYText": {\r
        "message": "Y0"\r
    },\r
    "colorDeepPink": {\r
        "message": "тёмно-розовый"\r
    },\r
    "portsFunction_FRSKY_OSD": {\r
        "message": "FrSky OSD"\r
    },\r
    "pidTuning_gyro_dyn_lpf_min_hz_help": {\r
        "message": "Определяет частоту среза ФНЧ гироскопа при минимальной тяге. Когда тяга увеличивается, частота среза ФНЧ также увеличивается вплоть до максимальной частоты среза."\r
    },\r
    "loggingBack": {\r
        "message": "Выйти из журнала/отключиться"\r
    },\r
    "osdElement_SAG_COMP_MAIN_BATT_CELL_VOLTAGE": {\r
        "message": "Напряжение ячейки батареи с компенсацией просадки"\r
    },\r
    "firmwareFlasherHexCorrupted": {\r
        "message": "HEX-файл повреждён"\r
    },\r
    "pidI": {\r
        "message": "I-коэффициент"\r
    },\r
    "rc_filter_smoothing_factor": {\r
        "message": "Коэффициент автоматического сглаживания"\r
    },\r
    "ledStripFunctionRSSIOption": {\r
        "message": "RSSI"\r
    },\r
    "rcSmoothing": {\r
        "message": "Сглаживание RC-сигнала"\r
    },\r
    "AIRCRAFT": {\r
        "message": "Воздушное судно"\r
    },\r
    "configurationFeatureEnabled": {\r
        "message": "Включено"\r
    },\r
    "sensorStatusSonarShort": {\r
        "message": "Сонар",\r
        "description": "Текст для иконок датчиков вверху. Сделайте его кратким."\r
    },\r
    "ledStripModeColorsModeAnimation": {\r
        "message": "Анимация"\r
    },\r
    "eepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранено</span>"\r
    },\r
    "ledStripModesSpecialColorsTitle": {\r
        "message": "Цвета индикации"\r
    },\r
    "stm32UnprotectSuccessful": {\r
        "message": "Защита от чтения успешно снята."\r
    },\r
    "configurationBatteryCellsHelp": {\r
        "message": "Установите это значение равным количеству ячеек вашей батареи, чтобы отключить автоматическое определение количества ячеек или сделать возможным автоматическое переключение профилей батареи. Батареи 7S, 9S и 11S не могут быть определены автоматически."\r
    },\r
    "osdSwitchInd3": {\r
        "message": "Переключатель 4"\r
    },\r
    "calibrationHead3": {\r
        "message": "Калибровка уровня"\r
    },\r
    "osdUnitMetricMPH": {\r
        "message": "Метрические единицы + MPH"\r
    },\r
    "communityDiscordServer": {\r
        "message": "Discord сервер"\r
    },\r
    "pidTuning_MaxPitchAngleHelp": {\r
        "message": "Максимальный угол тангажа в режиме ANGLE. Это также ограничивает максимальный набор высоты и снижение в навигационных режимах."\r
    },\r
    "osdElement_3D_MAX_SPEED": {\r
        "message": "Макс. 3D скорость"\r
    },\r
    "sensorsGyroSelect": {\r
        "message": "Гироскоп"\r
    },\r
    "osd_plus_code_short": {\r
        "message_inav": "Плюс-код удаления ведущих цифр",\r
        "message": "Удаление ведущих разрядов Plus Code"\r
    },\r
    "sitlProfilesHelp": {\r
        "message": "Профили сохраняются локально. Профили содержат не только все данные этой вкладки, но и файл конфигурации («EEPROM») самого INAV. <br><span style=\\"color: red\\">Примечание:</span><br>стандартные профили невозможно перезаписать. Чтобы сохранить изменения, создайте новый профиль. "\r
    },\r
    "portsFunction_VTX_FFPV": {\r
        "message": "FuriousFPV Vtx"\r
    },\r
    "tabLedStrip": {\r
        "message": "LED лента"\r
    },\r
    "controlAxisMotor": {\r
        "message": "Мотор"\r
    },\r
    "featureDASHBOARD": {\r
        "message": "OLED дисплей"\r
    },\r
    "tabAdvancedTuningMultirotorTuningTitle": {\r
        "message": ": Мультикоптеры"\r
    },\r
    "osd_video_HELP": {\r
        "message": "Для HD: красные линии показывают экран 4:3<br/>HDZero: для более высокой частоты обновления оставайтесь в синей рамке<br/>AUTO/PAL: зеленая линия — ограничение NTSC."\r
    },\r
    "missionSeaLevelRef": {\r
        "message": "От уровня моря: "\r
    },\r
    "magnetometerHelp": {\r
        "message": "1. Отрегулируйте ориентацию полётного контроллера так, чтобы она соответствовала физической ориентации на дроне <u>в соответствии со \\"стрелкой\\" направления на полётном контроллере</u>.<br/>2. Отрегулируйте ориентацию магнитометра в соответствии с физической ориентацией на самолёте в соответствии со стрелкой \\"направления компаса\\" или метками оси на магнитометре.<br/><strong>Примечание:</strong> предустановленная ориентация магнитометра (align_mag ) относительно полётного контроллера. Обязательно сначала выровняйте полётный контроллер (align_board_pitch, align_board_roll, align_board_yaw).<br/>Если предустановка не используется (ориентация задаётся с помощью align_mag_roll, align_mag_pitch и align_mag_yaw), то ориентация магнитометра независима."\r
    },\r
    "pidTuning_RateDynamics_End": {\r
        "message": "Конец"\r
    },\r
    "failsafeProcedureItemSelect1": {\r
        "message": "Приземление"\r
    },\r
    "dterm_lpf_type": {\r
        "message": "Тип ФНЧ D-составляющей"\r
    },\r
    "language_zh_CN": {\r
        "message": "简体中文",\r
        "_comment": "Don't translate!"\r
    },\r
    "rthAllowLanding": {\r
        "message": "Приземлиться после RTH"\r
    },\r
    "tabFailsafe": {\r
        "message": "Failsafe"\r
    },\r
    "pidTuning_Manual_Yaw": {\r
        "message": "Рыскание (%)"\r
    },\r
    "cruiseYawRateHelp": {\r
        "message": "Это скорость поворота в режимах Cruise и 3D Cruise."\r
    },\r
    "mixerRefreshCurrentRules": {\r
        "message": "Обновить микшер"\r
    },\r
    "portsFirmwareUpgradeRequired": {\r
        "message": "<span style=\\"color: red\\">Требуется</span> обновление прошивки."\r
    },\r
    "osd_font_impact_mini": {\r
        "message": "Impact mini"\r
    },\r
    "osdElement_3D_MAX_SPEED_HELP": {\r
        "message": "Показывает самую высокую полную скорость, учитывая как горизонтальную, так и вертикальную скорости."\r
    },\r
    "sensorStatusGPS": {\r
        "message": "GPS"\r
    },\r
    "pidTuning_fw_level_pitch_trim": {\r
        "message": "Триммирование уровня [°]"\r
    },\r
    "initialSetupMagHead": {\r
        "message": "Магнитометр"\r
    },\r
    "dfu_error_image_size": {\r
        "message": "<span style=\\"color: red\\">Ошибка</span>: Этот прошивка больше, чем доступная в этом чипе flash-память! Размер прошивки: $1 kiB, предельный размер: $2 kiB"\r
    },\r
    "getConfiguratorVersion": {\r
        "message": "INAV Configurator: <strong>"\r
    },\r
    "pidTuningEepromSaved": {\r
        "message": "EEPROM <span style=\\"color: #37a8db\\">сохранено</span>: настройка PID"\r
    },\r
    "ledStripButtonSave": {\r
        "message": "Сохранить"\r
    },\r
    "controlSmoothnessHelp": {\r
        "message": "Насколько плавно автопилот управляет аппаратом, чтобы исправить ошибку навигации [0-9]."\r
    },\r
    "firmwareFlasherUrl": {\r
        "message": "Перейдите на GitHub, чтобы просмотреть этот коммит..."\r
    },\r
    "pidTuning_ResetPIDController": {\r
        "message": "Сброс PID-регулятора"\r
    },\r
    "configurationLaunchEndTimeHelp": {\r
        "message": "Время плавного перехода в конце запуска (мс). Это добавляется к тайм-ауту запуска. По умолчанию: 2000 [0-5000]"\r
    },\r
    "failsafeFeatureItemOld": {\r
        "message": "Настройки failsave при потере сигнала с приёмника"\r
    },\r
    "missionMultiActiveMission": {\r
        "message": "Активная миссия:"\r
    },\r
    "osd_decimals_altitude": {\r
        "message_en": "Altitude Decimals",\r
        "message": "Точность высоты"\r
    },\r
    "osdGroupGeneral": {\r
        "message": "Общие"\r
    },\r
    "adjustmentsColumnWhenChannel": {\r
        "message": "когда канал"\r
    },\r
    "options_render": {\r
        "message": "Параметры рендеринга конфигуратора"\r
    },\r
    "gpsLoadAssistnowOnlineButton": {\r
        "message": "Загрузить AssistNow Online"\r
    },\r
    "missionGeozoneHead": {\r
        "message": "Геозоны"\r
    },\r
    "missionTitlRemove": {\r
        "message": "Удалить"\r
    },\r
    "osdElement_LEVEL_PIDS": {\r
        "message": "Уровни PID-регуляторов"\r
    },\r
    "configuration3dDeadbandThrottle": {\r
        "message": "Реверсивные моторы: мёртвая зона тяги"\r
    },\r
    "selectedTarget": {\r
        "message": "Выбранный полётный контроллер: "\r
    },\r
    "sensorStatusGyro": {\r
        "message": "Гироскоп"\r
    },\r
    "rthTrackBack": {\r
        "message": "Режим следования по обратному маршруту (RTH)"\r
    },\r
    "pidTuning_gyro_main_lpf_hz_help": {\r
        "message": "Более высокие значения обеспечивают меньшую задержку, но больше шума. Более низкие значения обеспечивают меньший шум, но большую задержку при обработке гироскопа"\r
    },\r
    "firmwareFlasherSize": {\r
        "message": "Размер:"\r
    },\r
    "osd_use_large_pilot_logo_help": {\r
        "message": "Использовать большой логотип пилота вместе с логотипом INAV или вместо него. Для этого требуется пользовательский шрифт с вашим логотипом. Отображается на экране взведения."\r
    },\r
    "tabAdvancedTuning": {\r
        "message": "Расширенная настройка"\r
    },\r
    "receiverRcExpo": {\r
        "message": "RC экспонента"\r
    },\r
    "stm32UnprotectFailed": {\r
        "message": "Не удалось снять с платы защиту от чтения"\r
    },\r
    "gpsErrors": {\r
        "message": "Ошибки:"\r
    },\r
    "pidTuning_RateDynamics_Center": {\r
        "message": "Центр"\r
    },\r
    "onboardLoggingFlashLogger": {\r
        "message": "Встроенный чип флеш-памяти"\r
    },\r
    "brakingTimeout": {\r
        "message": "Макс. продолжительность торможения"\r
    },\r
    "geozoneSafeAltitudeDistance": {\r
        "message": "Безопасная дистанция по высоте"\r
    },\r
    "initialSetupCurrentDrawValue": {\r
        "message": "$1 А"\r
    },\r
    "featureTHR_VBAT_COMP": {\r
        "message": "Компенсация напряжения тяги"\r
    },\r
    "stm32UsbDfuNotFound": {\r
        "message": "USB DFU не найден"\r
    },\r
    "ezTunePidPreview": {\r
        "message": "Предпросмотр PID"\r
    },\r
    "dataflashFirmwareUpgradeRequired": {\r
        "message": "Чип памяти требует прошивку &gt;= 1.8.0."\r
    },\r
    "osdPanServoIndicatorShowDegrees": {\r
        "message": "Показывать градусы смещения рядом с индикатором панорамирования"\r
    },\r
    "adjustmentsFunction55": {\r
        "message": "Настройка точек срабатывания TPA"\r
    },\r
    "osdElement_VERT_DIST_TO_NEXT_GEOZONE": {\r
        "message": "Вертикальное расстояние до следующей геозоны"\r
    },\r
    "configurationBatteryCellDetectVoltage": {\r
        "message": "Максимальное напряжение ячейки для обнаружения количества ячеек"\r
    },\r
    "firmwareVersion": {\r
        "message": "Версия прошивки: <strong>$1</strong>"\r
    },\r
    "missionExclusive": {\r
        "message": "Искл."\r
    },\r
    "pidSetpoint": {\r
        "message": "Заданное значение"\r
    },\r
    "osd_imu_temp_alarm_max": {\r
        "message": "Максимальная температура IMU"\r
    },\r
    "configurationLaunchVelocity": {\r
        "message": "Пороговая скорость"\r
    },\r
    "accNotchCutoffHelp": {\r
        "message": "Должно быть меньше частоты режекторного фильтра акселерометра"\r
    },\r
    "configurationHeadtrackerTiltRatio": {\r
        "message_en": "Head tracker tilt movement ratio",\r
        "message": "Коэффициент движения наклона трекера головы"\r
    },\r
    "geozoneVerices": {\r
        "message": "Вершины:"\r
    },\r
    "fwLandApproachLengthHelp": {\r
        "message": "Длина финального участка захода, которая включает в себя также фазы планирования и перехвата (траектории). Это расстояние от точки «Safe Home» до точки начала финального разворота."\r
    },\r
    "osd_airspeed_max_alarm_HELP": {\r
        "message": "Индикатор воздушной скорости будет мигать, когда воздушная скорость превысит этот порог. 0 отключает этот сигнал тревоги."\r
    },\r
    "wirelessModeSwitch": {\r
        "message": "Беспроводной режим"\r
    },\r
    "tabModeSelection": {\r
        "message": "Переключение режимов"\r
    },\r
    "osdElement_RTC_TIME_HELP": {\r
        "message": "Показывает текущее время, полученное с помощью GPS или установленное через пульт."\r
    },\r
    "adjustmentsFunction52": {\r
        "message": "Угол тангажа вниз для мин. тяги (для самолёта)"\r
    },\r
    "adjustmentsFunction53": {\r
        "message": "Регулировка уровня мощности VTX"\r
    },\r
    "pidTuning_Expo_Stabilized": {\r
        "message": "Стабилизированная экспонента"\r
    },\r
    "missionHomeHead": {\r
        "message": "Место взлёта (\\"Дом\\")"\r
    },\r
    "receiverDeadband": {\r
        "message": "RC Мёртвая зона"\r
    },\r
    "controlAxisPitch": {\r
        "message": "Тангаж [E]"\r
    },\r
    "serialLogging": {\r
        "message": "Внешний последовательный логгер"\r
    },\r
    "osdElement_RSSI_VALUE": {\r
        "message": "RSSI (Сила сигнала)"\r
    },\r
    "osdElement_OSD_RX_POWER_DOWNLINK": {\r
        "message": "Мощность RX (мВт)"\r
    },\r
    "input": {\r
        "message": "Вход"\r
    },\r
    "rthTailFirst": {\r
        "message": "Хвостом вперёд"\r
    },\r
    "portsFunction_TELEMETRY_LTM": {\r
        "message": "LTM"\r
    },\r
    "tabHelp": {\r
        "message": "Документация и поддержка"\r
    },\r
    "loggingErrorNotConnected": {\r
        "message": "Сперва вам нужно <strong>подключиться</strong>"\r
    },\r
    "pidP": {\r
        "message": "P-коэффициент"\r
    },\r
    "configurationLoopTime": {\r
        "message": "Время цикла полётного контроллера"\r
    },\r
    "auxiliaryHelp": {\r
        "message": "Используйте диапазоны, чтобы назначить переключатели на вашем передатчике соответствующим режимам. Канал приёмника, показание которого попадает в диапазон (мин./макс.), будет активировать режим. Не забудьте сохранить настройки, нажав кнопку «Сохранить»."\r
    },\r
    "ledStripDirS": {\r
        "message": "Ю"\r
    },\r
    "featureVBAT": {\r
        "message": "Контроль напряжения аккумулятора"\r
    },\r
    "custom_element": {\r
        "message": "Пользовательский элемент"\r
    },\r
    "geozoneAction": {\r
        "message": "Действие:"\r
    },\r
    "pidMeasurement": {\r
        "message": "Измерение"\r
    },\r
    "sitlOSNotSupported": {\r
        "message": "SITL не поддерживается в этой операционной системе."\r
    },\r
    "ledStripModeColorsTitle": {\r
        "message": "Цвета режимов"\r
    },\r
    "stepTitle5": {\r
        "message": "Шаг 5"\r
    },\r
    "uniqueDeviceIdReceived": {\r
        "message": "<span style=\\"color: #37a8db\\">Получен</span> уникальный ID устройства - <strong>0x$1</strong>"\r
    },\r
    "pidTuning_Manual_Pitch": {\r
        "message": "Тангаж (%)"\r
    },\r
    "osd_baro_temp_alarm_max": {\r
        "message": "Максимальная температура барометра"\r
    },\r
    "fwLandFlarePitch": {\r
        "message": "Значение тангажа для фазы выравнивания"\r
    },\r
    "pidTuning_Integral": {\r
        "message": "Интегральный"\r
    },\r
    "ezTuneRatePreview": {\r
        "message": "Предпросмотр скорости"\r
    },\r
    "safehomeEdit": {\r
        "message": "Редактировать Safehome"\r
    },\r
    "wpTurnSmoothing": {\r
        "message": "Плавность прохождения поворотов на путевых точках"\r
    },\r
    "osd_units": {\r
        "message": "Единицы измерения"\r
    },\r
    "options_improve_configurator": {\r
        "message": "Отправлять команде разработчиков анонимные данные об использовании"\r
    },\r
    "dataflashButtonSaveDismiss": {\r
        "message": "Ок"\r
    },\r
    "mixerPresetTitle": {\r
        "message": "Пресет микшера"\r
    },\r
    "motorsNotice": {\r
        "message": "<strong>Уведомление о режиме тестирования двигателя:</strong><br />Перемещение ползунков привёдет к тому, что двигатели <strong>начнут крутиться</strong>.<br />Во избежание травм <strong style=\\"color: red\\">снимите ВСЕ пропеллеры</strong> перед использованием этой функции.<br />"\r
    },\r
    "loadMissionButton": {\r
        "message": "Загрузить миссию из полётного контроллера"\r
    },\r
    "colorGreen": {\r
        "message": "зелёный"\r
    },\r
    "osdElement_MSL_ALTITUDE": {\r
        "message": "Высота над уровнем моря (MSL)"\r
    },\r
    "configurationBatteryCapacityWarning": {\r
        "message": "Предупреждение о ёмкости (оставшийся %)"\r
    },\r
    "pidTuning_RollRate": {\r
        "message": "Скорость крена"\r
    },\r
    "ezTuneResponseTips": {\r
        "message": "Этот параметр определяет, насколько быстро БПЛА будет реагировать на движения стиков и сигналы гироскопа. Более высокие значения приведут к более быстрой реакции, но также к большему количеству выбросов и колебаний. Если БПЛА кажется вялым или медленно раскачивается, увеличьте отклик. Если у него перегреваются моторы, есть слышимые осцилляции, слишком выбрасывает или дрон кажется слишком \\"нервным\\", уменьшите отклик. Большинство современных квадрокоптеров с мощными моторами будут лучше всего летать с откликом ниже 80. Их следует настраивать вместе с демпфированием. Это эквивалент P-составляющей."\r
    },\r
    "osdGroupSwitchIndicators": {\r
        "message": "Индикаторы переключения"\r
    },\r
    "ledStripFunctionArmOption": {\r
        "message": "Состояние взведения"\r
    },\r
    "osdElement_FW_POS_PID_OUTPUTS": {\r
        "message": "PID: позиция (самолёт)"\r
    },\r
    "featureFW_AUTOTRIM": {\r
        "message": "Постоянно балансировать сервоприводы на фиксированном крыле"\r
    },\r
    "MissionPlannerFwLAndingAltitudeChangeReset": {\r
        "message": "Высота ниже минимальной высоты для посадки. Изменение проигнорировано"\r
    },\r
    "endGetPoint": {\r
        "message": "Конец получения точек"\r
    },\r
    "ezTuneEnabledTips": {\r
        "message": "При активации <strong>Ez Tune</strong> переопределит множество настроек INAV, чтобы упростить процесс тюнинга. Вместо того, чтобы устанавливать каждый PID и настройку фильтрации по отдельности, вам нужно работать всего с 7 ползунками. Ez Tune автоматически скорректирует все остальные настройки в соответствии с вашими потребностями. Ez Tune — отличная отправная точка для новых пользователей и отличный способ быстро настроить новый БПЛА. Не рекомендуется использовать Ez Tune в продвинутых сборках, так как он переопределит все ваши настройки, и вы не сможете выполнить тонкую настройку своего БПЛА. Когда Ez Tune активирован, настройки на вкладке <strong>PID настройки</strong> будут переопределены EzTune."\r
    },\r
    "sensorsTemperature6": {\r
        "message": "Температура 6, °C"\r
    },\r
    "servosReverse": {\r
        "message": "Инвертировать"\r
    },\r
    "pidTuning_Expo_RollPitch": {\r
        "message": "Крен и тангаж (%)"\r
    },\r
    "statusbar_i2c_error": {\r
        "message": "Ошибки I2C:"\r
    },\r
    "osdElement_FW_ALT_PID_OUTPUTS": {\r
        "message": "PID: высота (самолёт)"\r
    },\r
    "sensorMagnetometer": {\r
        "message": "Магнитометр"\r
    },\r
    "ezTuneDamping": {\r
        "message": "Демпфирование"\r
    },\r
    "notifications_app_just_updated_to_version": {\r
        "message": "Приложение обновлено до версии: $1"\r
    },\r
    "tabProgramming": {\r
        "message": "Программирование"\r
    },\r
    "adjustmentsFunction3": {\r
        "message": "Корректировка экспоненты тяги"\r
    },\r
    "osd_hud_radar_disp_help": {\r
        "message": "Это используется для режима Radar/FormationFlight INAV. Значение 0 отключает эту функцию."\r
    },\r
    "adjustmentsMax": {\r
        "message": "Макс."\r
    },\r
    "fixedWingNavigationConfiguration": {\r
        "message": "Настройки навигации для аппаратов самолётного типа"\r
    },\r
    "saveEepromMissionButton": {\r
        "message": "Сохранить миссию Eeprom"\r
    },\r
    "firmwareFlasherButtonLoadLocal": {\r
        "message": "Загрузить прошивку [Local]"\r
    },\r
    "pidTuning_MaxRollAngleHelp": {\r
        "message": "Максимальный угол крена в режиме ANGLE. Это также ограничивает максимальный наклон в навигационных режимах."\r
    },\r
    "pidTuning_MagHoldYawRateHelp": {\r
        "message": "Максимальная скорость вращения по рысканию, которую контроллер MagHold может запросить у БПЛА. Используется только при включенном режиме MagHold, во время возврата домой (RTH) и навигации по маршрутным точкам (WAYPOINT). Значения ниже 30°/c дают приятные «кинематографические» повороты"\r
    },\r
    "stepTitle4": {\r
        "message": "Шаг 4"\r
    },\r
    "radioChannelShort": {\r
        "message": "Канал "\r
    },\r
    "osdElement_SWITCH_INDICATOR_2": {\r
        "message": "Индикатор переключателя 3"\r
    },\r
    "osdGroupPIDOutputs": {\r
        "message": "Выходы PID-регуляторов"\r
    },\r
    "configurationSensorAlignmentMagRoll": {\r
        "message": "Крен"\r
    },\r
    "osd_horizon_offset": {\r
        "message": "Смещение AHI и HUD"\r
    },\r
    "initialSetupAccelCalibEnded": {\r
        "message": "Калибровка акселерометра <span style=\\"color: #37a8db\\">завершена</span>"\r
    },\r
    "PIDControllers": {\r
        "message": "PID контроллеры"\r
    },\r
    "defaultWelcomeText": {\r
        "message": "Исходный код прошивки можно скачать <a href=\\"https://github.com/iNavFlight\\" title=\\"www.github.com\\" target=\\"_blank\\">здесь</a>.<br />Новейшая прошивка доступна<a href=\\"https://github.com/iNavFlight/inav/releases\\" title=\\"www.github.com\\" target=\\"_blank\\">здесь</a>.<br /><br />Последнюю версию <strong>STM USB VCP Drivers</strong> можно скачать <a href=\\"http://www.st.com/web/en/catalog/tools/PF257938\\" title=\\"http://www.st.com\\" target=\\"_blank\\">здесь</a>.<br />Последний <strong>Zadig</strong> для Windows DFU программатора можно скачать <a href=\\"http://zadig.akeo.ie/\\" title=\\"http://zadig.akeo.ie\\" target=\\"_blank\\">здесь</a>.<br />"\r
    },\r
    "osdElement_MC_VEL_Y_PID_OUTPUTS": {\r
        "message": "PID: скорость по оси Y (мультикоптер)"\r
    },\r
    "defaultWelcomeIntro": {\r
        "message": "Добро пожаловать в <strong>INAV Configurator</strong>, утилиту, предназначенную для упрощения обновления, конфигурирования и настройки вашего полётного контроллера."\r
    },\r
    "osdElement_PITCH_PIDS": {\r
        "message": "PID'ы тангажа"\r
    },\r
    "connectionBleCliEnter": {\r
        "message": "Соединение через BLE активно, вывод может быть медленнее, чем обычно."\r
    },\r
    "osd_airspeed_min_alarm_HELP": {\r
        "message": "Индикатор воздушной скорости будет мигать, когда воздушная скорость опустится ниже этого порога. 0 отключает этот сигнал тревоги."\r
    },\r
    "stm32ProgrammingSuccessful": {\r
        "message": "Прошивка: УСПЕШНО"\r
    },\r
    "initialSetupRoll": {\r
        "message": "Крен:"\r
    },\r
    "firmwareFlasherButtonAutoSelect": {\r
        "message": "Автоматический выбор полётного контроллера"\r
    },\r
    "pidTuning_rpm_gyro_filter_enabled": {\r
        "message": "Фильтры гироскопа по оборотам моторов (требуется телеметрия ECS)"\r
    },\r
    "ezTuneExpo": {\r
        "message": "Экспонента"\r
    },\r
    "pidTuningDataRefreshed": {\r
        "message": "Данные PID <strong>обновлены</strong>"\r
    },\r
    "gyroNotchHz1": {\r
        "message": "Частота первого режекторного фильтра гироскопа"\r
    },\r
    "osdSettingsSaved": {\r
        "message": "Настройки OSD сохранены"\r
    },\r
    "MagBtn": {\r
        "message": "Калибровать компас"\r
    },\r
    "featureFW_AUTOTRIMTip": {\r
        "message": "При полете в стабилизированном режиме постоянно регулируйте средние точки сервоприводов, чтобы самолёт продолжал лететь прямо при переключении в ручной режим. Требуется GPS."\r
    },\r
    "auxiliaryAcroEnabled": {\r
        "message": "ACRO"\r
    },\r
    "ezTuneRateTips": {\r
        "message": "Определяет, насколько быстро ваш БПЛА будет вращаться вокруг осей крена, тангажа и рыскания. Более высокая скорость приводит к более быстрому вращению. Значение 0 соответствует 300°/с, 100 — 600°/с, 200 — 900°/c."\r
    },\r
    "ledStripModeColorsModeGPSLocked": {\r
        "message": "GPS: местоположение определено"\r
    },\r
    "tabFirmwareFlasher": {\r
        "message": "Программатор"\r
    },\r
    "osdElement_MAP_REFERENCE_HELP": {\r
        "message": "Ориентир карты (направление, которое указывает вверх). N - север, T - направление взлёта."\r
    },\r
    "outputStatsTableAcc": {\r
        "message": "RMS шум акселерометра"\r
    },\r
    "mapProvider": {\r
        "message": "Поставщик карт"\r
    },\r
    "failsafeMinDistanceProcedureItem": {\r
        "message": "Процедура «Failsafe на минимальном расстоянии»"\r
    },\r
    "loiterDirectionHelp": {\r
        "message": "Эта настройка позволяет вам выбрать направление барражирования. Выбор опции «Рыскание» («YAW») позволяет вам изменить направление движения с помощью стика рыскания."\r
    },\r
    "pidTuning_gyro_dyn_lpf_max_hz": {\r
        "message": "Динамический ФНЧ гироскопа, макс. частота отсечки"\r
    },\r
    "featureSERVO_TILT": {\r
        "message": "Сервоподвес"\r
    },\r
    "osdElement_VTX_CHANNEL": {\r
        "message": "Диапазон и канал видеопередатчика"\r
    },\r
    "initialSetupFailsafe": {\r
        "message": "Failsafe:"\r
    },\r
    "servosNormal": {\r
        "message": "Нормальный"\r
    },\r
    "firmwareVersionNotSupported": {\r
        "message": "Эта версия прошивки <span style=\\"color: red\\">не поддерживается</span>. Эта версия конфигуратора поддерживает прошивки от $1 до $2 (не включительно)"\r
    },\r
    "brakingBankAngle": {\r
        "message": "Макс. угол крена"\r
    },\r
    "osd_gforce_axis_alarm_min": {\r
        "message": "Мин. значение по оси перегрузки"\r
    },\r
    "adjustmentsFunction50": {\r
        "message": "Регулировка I-коэффициента скорости Z"\r
    },\r
    "defaultDonateText": {\r
        "message": "Эта утилита имеет полностью <strong>открытый исходный код</strong> и доступна бесплатно всем пользователям <strong>INAV</strong>.<br />Если вы нашли INAV или INAV Configurator полезными, рассмотрите <strong>поддержку</strong> его развитие путём пожертвований."\r
    },\r
    "cruiseSpeed": {\r
        "message": "Крейсерская скорость"\r
    },\r
    "BLACKBOX_FEATURE_MAG": {\r
        "message": "Магнитометр"\r
    },\r
    "boardInfo": {\r
        "message": "1. Выберите выравнивание полётного контроллера<br>(align_board_roll, align_board_pitch, align_board_yaw)"\r
    },\r
    "adjustmentsMin": {\r
        "message": "Мин."\r
    },\r
    "dataflashNotPresentNote": {\r
        "message": "Ваш полётный контроллер не имеет совместимого чипа памяти."\r
    },\r
    "configurationMixer": {\r
        "message": "Микшер"\r
    },\r
    "missionTitleHide": {\r
        "message": "Скрыть"\r
    },\r
    "mapApiKey": {\r
        "message": "API ключ карт"\r
    },\r
    "pidTuning_mainFilters": {\r
        "message": "Фильтры гироскопа"\r
    },\r
    "gpsFixNone": {\r
        "message": "<span class=\\"fixnone\\">Без фиксации</span>"\r
    },\r
    "receiverDataRefreshed": {\r
        "message": "Данные настроек RC <strong>обновлены</strong>"\r
    },\r
    "logicSave": {\r
        "message": "Сохранить"\r
    },\r
    "osdElement_REMAINING_FLIGHT_TIME_HELP": {\r
        "message": "Расчётное оставшееся время полета до того, как аппарату потребуется вернуться домой, основанное на оставшемся заряде батареи, средней мощности и расстояния до дома. Только для аппаратов с фиксированным крылом. Пожалуйста, ознакомьтесь с документацией"\r
    },\r
    "escRefreshRate": {\r
        "message": "Частота обновления ESC"\r
    },\r
    "failsafeThrottleItemOld": {\r
        "message": "Тяга failsafe"\r
    },\r
    "pidTuning_Name": {\r
        "message": "Название"\r
    },\r
    "BLACKBOX_FEATURE_NAV_ACC": {\r
        "message": "Навигационный акселерометр"\r
    },\r
    "configurationGPSProtocol": {\r
        "message": "Протокол"\r
    },\r
    "tabReceiver": {\r
        "message": "Приёмник"\r
    },\r
    "osdElement_SENSOR4_TEMPERATURE": {\r
        "message": "Датчик температуры 4"\r
    },\r
    "calibrationHead1": {\r
        "message": "Калибровка акселерометра"\r
    },\r
    "pidOutput": {\r
        "message": "Вывод"\r
    },\r
    "sensorsInfo": {\r
        "message": "Имейте в виду, что использование быстрых периодов обновления и одновременное отображение нескольких графиков требуют больше ресурсов и при использовании ноутбука быстрее съедают батарею.<br />Мы рекомендуем выводить только те графики, которые вам интересны, используя при этом разумные периоды обновления."\r
    },\r
    "configurationRSSI": {\r
        "message": "RSSI (Уровень сигнала)"\r
    },\r
    "MagXText": {\r
        "message": "X0"\r
    },\r
    "portsTelemetryOut": {\r
        "message": "Телеметрия"\r
    },\r
    "configurationVoltageMeterType": {\r
        "message": "Тип датчика напряжения"\r
    },\r
    "sensorsTemperature5": {\r
        "message": "Температура 5, °C"\r
    },\r
    "missionGeozoneTypePolygon": {\r
        "message": "Многоугольник"\r
    },\r
    "osdAlarmBATT_CAP_HELP": {\r
        "message": "Индикатор израсходованной ёмкости батареи (потреблённых мА·ч) начнет мигать, когда общая потреблённая ёмкость превысит заданное значение. Для работы требуется датчик тока. 0 отключает этот сигнал тревоги."\r
    },\r
    "configurationAttitudeFrequencyHelp": {\r
        "message": "Для акро-полёта это значение можно снизить"\r
    },\r
    "sitlChannelMap": {\r
        "message": "Сопоставление каналов"\r
    },\r
    "language_ru": {\r
        "message": "Русский",\r
        "_comment": "Don't translate!"\r
    },\r
    "MissionPlannerOnlyOneLandWp": {\r
        "message": "Вы можете поставить только одну НАЗЕМНУЮ (Land) точку в миссии."\r
    },\r
    "gsTelemetryAltitude": {\r
        "message": "Высота"\r
    },\r
    "tabConfiguration": {\r
        "message": "Конфигурация"\r
    },\r
    "colorWhite": {\r
        "message": "белый"\r
    },\r
    "pidTuning_MatrixFilterTypeHelp": {\r
        "message": "Определяет тип матричного фильтра. Для большинства пользователей рекомендуется стандартный 2D-фильтр. Для коптеров размером 7&quot; и более может быть полезен 3D-фильтр."\r
    },\r
    "osdUnitGATip": {\r
        "message": "Использовать стандартные единицы авиации общего назначения (не СИ): морские мили, футы, узлы, градусы Цельсия."\r
    },\r
    "pidTuning_antigravityCutoff": {\r
        "message": "Частота среза антигравитации"\r
    },\r
    "portsButtonSave": {\r
        "message": "Сохранить и перезагрузить"\r
    },\r
    "ezTuneAxisRatioTips": {\r
        "message": "Описывает распределение веса/момента инерции вашего БПЛА. Чем длиннее рама (больше массы сосредоточено на передне-задней оси), тем большее значение соотношения осей требуется. Для идеальной X-образной рамы отношение составляет 100. Большинство современных рам попадают в диапазон 110–130. Значение по умолчанию 110 является хорошей отправной точкой."\r
    },\r
    "sitlEnableSimulatorHelp": {\r
        "message": "Если эта опция деактивирована, можно использовать только UART (MSP/Configurator). Полезно для настройки INAV без запуска симулятора."\r
    },\r
    "osdSwitchInd1": {\r
        "message": "Переключатель 2"\r
    },\r
    "osdGroupVTX": {\r
        "message": "VTX"\r
    },\r
    "axisAccelerationLimitRollPitch": {\r
        "message": "Ограничение ускорения крена/тангажа"\r
    },\r
    "adjustmentsFunction2": {\r
        "message": "Корректировка экспоненты RC"\r
    },\r
    "initialSetupBatteryVoltageValue": {\r
        "message": "$1 В"\r
    },\r
    "adjustmentsFunction41": {\r
        "message": "Регулировка D-коэффициента положения XY"\r
    },\r
    "osd_esc_temp_alarm_max": {\r
        "message": "Максимальная температура ECS"\r
    },\r
    "osdElement_EFFICIENCY_WH": {\r
        "message": "Эффективность (Вт·ч/км)"\r
    },\r
    "ezTuneDisclaimer": {\r
        "message": "<strong>Отказ от ответственности</strong>. Ez Tune — экспериментальная функция. Не гарантируется её работа на всех БПЛА. Не гарантируется работа со всеми типами рам. Не гарантируется работа со всеми пропеллерами. Все вычисления и результаты тюнинга могут быть изменены в будущих версиях INAV. Мы по-прежнему рекомендуем вам попробовать её и поделиться своим опытом в INAV Discord на канале <strong>#ez-tune</strong>"\r
    },\r
    "adjustmentsFunction44": {\r
        "message": "Регулировка D-коэффициента положения Z"\r
    },\r
    "MissionPlannerHeadSettingsCheck": {\r
        "message": "Курс задан некорректно: проверьте ещё раз! Принудительно выставлено значение по умолчанию -1!"\r
    },\r
    "osdGroupOSDCustomElements": {\r
        "message": "Пользовательские элементы OSD"\r
    },\r
    "BLOCKED_INVALID_SETTING": {\r
        "message": "Настройки проверены"\r
    },\r
    "firmwareFlasherWarningText": {\r
        "message": "Пожалуйста, <span style=\\"color: red\\">не</span> пытайтесь прошить оборудование, <strong>не предназначенное для INAV</strong> с помощью этого загрузчика.<br /><span style=\\"color: red\\">Не</span> отключайте полетный контроллер и не выключайте компьютер во время прошивки.<br /><br /><strong>Примечание:</strong> Загрузчик STM32 хранится в ПЗУ, его нельзя окирпичить.<br /><!--strong>Примечание: </strong><span style=\\"color: red\\">Автоматическое подключение</span> всегда отключено, пока вы используете программатор.<br / --><strong>Примечание: </strong>Убедитесь, что у вас есть резервная копия; некоторые обновления/понижения версии приведут к стиранию вашей конфигурации.<br /><strong>Примечание:</strong> Если у вас возникли проблемы во время прошивки, попробуйте сначала отсоединить все кабели от вашего ПК, попробуйте перезагрузиться, обновить Chrome, обновить драйверы.<br /><strong>Примечание:</strong> При прошивке плат с напрямую подключенными USB-разъемами (Matek H743-SLIM, Holybro Kakute и т. д.), убедитесь, что вы прочитали раздел «Прошивка USB» в руководстве INAV и установили правильное программное обеспечение и драйверы"\r
    },\r
    "auxiliaryMax": {\r
        "message": "Макс."\r
    },\r
    "configurationLaunchTimeout": {\r
        "message": "Тайм-аут запуска"\r
    },\r
    "navMaxAltitude": {\r
        "message": "Максимальная высота для навигации"\r
    },\r
    "configurationBatteryMaximum": {\r
        "message": "Максимальное напряжение ячейки"\r
    },\r
    "automaticTargetSelect": {\r
        "message": "Попытка автоматического выбора полётного контроллера"\r
    },\r
    "tabOSD": {\r
        "message": "OSD"\r
    },\r
    "missionFwLandHeading2": {\r
        "message": "Курс 2 (°):"\r
    },\r
    "serialrx_inverted": {\r
        "message": "Инвертированный последовательный порт (по сравнению с протоколом по умолчанию)"\r
    },\r
    "configurationVTXLowerPowerDisarm": {\r
        "message": "Использовать низкую мощность, когда аппарат не взведён"\r
    },\r
    "NoteCalibration": {\r
        "message": "Примечание: если IMU установлен под другим углом или на нижней стороне полётного контроллера, выполните шаги калибровки так, чтобы IMU, а не коптер, был направлен так, как показано на рисунках (иначе калибровка не сработает)."\r
    },\r
    "brakingBoostDisengageSpeed": {\r
        "message": "Скорость отключения усиления торможения"\r
    },\r
    "servos": {\r
        "message": "Сервоприводы"\r
    },\r
    "accNotchCutoff": {\r
        "message": "Частота среза режекторного фильтра акселерометра"\r
    },\r
    "adjustmentsFunction48": {\r
        "message": "Регулировка D-коэффициента скорости XY"\r
    },\r
    "missionUserActions": {\r
        "message": "Пользовательские действия:"\r
    },\r
    "LogicConditions": {\r
        "message": "Логические условия"\r
    },\r
    "osd_font_default": {\r
        "message": "По умолчанию"\r
    },\r
    "osd_dji_cn_alternating_duration": {\r
        "message": "Период отображения имени аппарата (в 0.1 сек)"\r
    },\r
    "auxiliaryMin": {\r
        "message": "Мин."\r
    },\r
    "accNotchHz": {\r
        "message": "Частота режекторного фильтра акселерометра"\r
    },\r
    "platformConfiguration": {\r
        "message": "Конфигурация платформы"\r
    },\r
    "gpsLat": {\r
        "message": "Широта:"\r
    },\r
    "dtermNotchCutoffHelp": {\r
        "message": "Определяет полосу фильтра. <br><br>Должна быть ниже частоты режекторного фильтра."\r
    },\r
    "osdClearLayout": {\r
        "message": "Расположение очищено"\r
    },\r
    "downloadUpdatesBtn": {\r
        "message": "Скачать новое приложение"\r
    },\r
    "portsFunction_SMARTPORT_MASTER": {\r
        "message": "SmartPort Master"\r
    },\r
    "osdElement_PLUS_CODE_HELP": {\r
        "message": "Plus Code кодируют широту и долготу в виде одного значения, которое можно ввести непосредственно в Google Maps. Он обеспечивает тот же уровень точности, что и широта и долгота, но при этом занимает меньше места на экране."\r
    },\r
    "failsafeRxMinUsecItem": {\r
        "message": "Минимальная длительность"\r
    },\r
    "failsafeProcedureItemSelect2": {\r
        "message": "Падение"\r
    },\r
    "adjustmentsFunction31": {\r
        "message": "Ручная регулировка скорости рыскания"\r
    },\r
    "osdElement_MAIN_BATT_CELL_VOLTAGE_HELP": {\r
        "message": "Показывает среднее напряжение ячеек основного аккумулятора"\r
    },\r
    "pidTuning_ProfileHead": {\r
        "message": "Профиль"\r
    },\r
    "adjustmentsFunction12": {\r
        "message": "Регулировка D-коэффициента тангажа"\r
    },\r
    "navManualClimbRate": {\r
        "message": "Макс. скорость в режиме удержания высоты"\r
    },\r
    "selectValidSerialPort": {\r
        "message": "<span style=\\"color: red\\">Пожалуйста, выберите корректный последовательный порт</span>'"\r
    },\r
    "osd_preview_title_drag": {\r
        "message": ""\r
    },\r
    "rthTrackBackDistanceHelp": {\r
        "message": "Расстояние, пройденное во время следования по обратному маршруту. Обычный RTH будет выполнен при превышении этого общего расстояния полёта [м]."\r
    },\r
    "firmwareFlasherOptionLabelSelectBoard": {\r
        "message": "Выберите полётный контроллер"\r
    },\r
    "osdElement_VEL_XY_PIDS": {\r
        "message": "PID: Скорость XY"\r
    },\r
    "magnetometerAxes": {\r
        "message": "XYZ (оси магнитометра)"\r
    },\r
    "fwLandFlarePitchHelp": {\r
        "message_en": "This pitch angle is held during the flare phase.",\r
        "message": "Этот угол тангажа удерживается во время фазы выравнивания."\r
    },\r
    "missionWpLat": {\r
        "message": "Широта:"\r
    },\r
    "pidTuning_d_boost_gyro_delta_lpf_hz": {\r
        "message": "ФНЧ гироскопа для D-Boost"\r
    },\r
    "armingCheckPass": {\r
        "message": "<div class=\\"checkspass\\"></div>"\r
    },\r
    "tabMixer": {\r
        "message": "Микшер"\r
    },\r
    "initialSetupButtonCalibrateAccel": {\r
        "message": "Калибровка акселерометра"\r
    },\r
    "configMigratedTo": {\r
        "message": "Конфигурация мигрирована в конфигуратор: $1"\r
    },\r
    "geozoneInclusive": {\r
        "message": "Границы - часть геозоны"\r
    },\r
    "buildInfoReceived": {\r
        "message": "Используемая прошивка выпущена: <strong>$1</strong>"\r
    },\r
    "copy": {\r
        "message": "Копировать"\r
    },\r
    "pidTuning_FW_TPATimeConstant": {\r
        "message": "Постоянная времени TPA для аппаратов с фиксированным крылом"\r
    },\r
    "gyroNotchHz1Help": {\r
        "message": "Должен быть настроен на гармоническую частоту пропеллера. Обычно равна <i>[частота двигателя] * [количество лопастей пропеллера]</i><br><br>Значение должно быть выше частоты среза.<br><br><i>0</i> отключает фильтр"\r
    },\r
    "osdElement_ONTIME_FLYTIME": {\r
        "message_en": "On Time / Fly Time",\r
        "message_inav": "Ontime/Flytime",\r
        "message": "Время работы / время полёта"\r
    },\r
    "tabAdjustments": {\r
        "message_en": "Adjustments",\r
        "message": "Корректировки в полёте"\r
    },\r
    "initialSetupBatteryPercentageValue": {\r
        "message": "$1 %"\r
    },\r
    "featureLED_STRIP": {\r
        "message": "Поддержка разноцветной LED ленты"\r
    },\r
    "osdLayoutInsertedIntoClipboard": {\r
        "message": "Расположение скопировано в буфер обмена"\r
    },\r
    "OK": {\r
        "message": "OK"\r
    },\r
    "wpTurnSmoothingHelp": {\r
        "message": "Сглаживать повороты во время миссий по путевым точках, переключаясь на барражирование при прохождении точки. Если установлено значение «ON», аппарат достигнет путевой точки во время поворота. Если установлено значение «ON-CUT», аппарат повернёт внутри путевой точки, не достигая её фактически (срезает угол)."\r
    },\r
    "gpsOptionsAssistnowToken": {\r
        "message": "Токен AssitNow"\r
    },\r
    "SafehomeMaxDistance": {\r
        "message": "Макс. расстояние (м):"\r
    },\r
    "missionMultiMissionNo": {\r
        "message": "Миссия №."\r
    },\r
    "setControlProfile": {\r
        "message": "Установлен профиль <strong style=\\"color: #37a8db\\">$1</strong>"\r
    },\r
    "initialSetupBatteryThresholdsValue": {\r
        "message": "$1"\r
    },\r
    "sensorStatusAccel": {\r
        "message": "Акселерометр"\r
    },\r
    "osdAlarmADSB_MAX_DISTANCE_WARNING": {\r
        "message": "Отображаемое расстояние в метрах до ADSB судна"\r
    },\r
    "pidTuning_RateDynamics_Weight": {\r
        "message": "Масса"\r
    },\r
    "auxiliaryAddRange": {\r
        "message": "Добавить диапазон"\r
    },\r
    "osdElement_RADAR": {\r
        "message": "Радар"\r
    },\r
    "featureTHR_VBAT_COMPTip": {\r
        "message": "Автоматически компенсировать падение напряжения при разряде аккумулятора, чтобы поддерживать постоянную тягу относительно газа"\r
    },\r
    "stm32Erase": {\r
        "message": "Очистка ..."\r
    },\r
    "cliLoadFromFileBtn": {\r
        "message": "Загрузить из файла"\r
    },\r
    "toggledRCs": {\r
        "message": "Переключение отображения нестабильных версий"\r
    },\r
    "wpRestartMissionHelp": {\r
        "message": "Определяет поведение при возобновлении миссии по путевым точкам, прерванной в процессе выполнения. START (Старт): Начать миссию с первой путевой точки. RESUME (Продолжить): Начать миссию с последней активной путевой точки. SWITCH (Переключить): Переключаться между режимами START и RESUME при каждом повторном выборе режима WP (Waypoint Mode). Режим SWITCH фактически позволяет возобновить полет с предыдущей путевой точки только один раз, после чего миссия будет начинаться с первой точки."\r
    },\r
    "ledStripFunctionChannelOption": {\r
        "message": "Канал"\r
    },\r
    "missionGezoneType": {\r
        "message": "Тип"\r
    },\r
    "globalFunctions": {\r
        "message": "Глобальные функции"\r
    },\r
    "osdElement_MESSAGES_HELP": {\r
        "message": "Показывает различные системные сообщения, такие как предупреждения, сбои оборудования и расширенные сведения о текущем режиме полёта (например, режимы AUTOTUNE и AUTOTRIM, а также этапы RTH)."\r
    },\r
    "pidTuning_rpm_gyro_min_hz": {\r
        "message": "Минимальная частота RPM-фильтра гироскопа"\r
    },\r
    "osdElement_LQ_UPLINK": {\r
        "message_en": "RX Uplink Quality %",\r
        "message": "Качество восходящего канала связи RX (%)"\r
    },\r
    "osdElement_FORMATION_FLIGHT": {\r
        "message": "Радар INAV"\r
    },\r
    "waitingForData": {\r
        "message": "Ожидание данных..."\r
    },\r
    "tabCalibration": {\r
        "message": "Калибровка"\r
    },\r
    "pidTuning_itermRelaxCutoff": {\r
        "message": "Частота среза ослабления I-составляющей"\r
    },\r
    "pidTuning_LevelI": {\r
        "message": "Частота отсечки ФНЧ (Гц)"\r
    },\r
    "colorDarkViolet": {\r
        "message": "тёмно-фиолетовый"\r
    },\r
    "noFirmwareSelectedToLoad": {\r
        "message": "<b>Не выбрана прошивка для загрузки</b>"\r
    },\r
    "cruiseManualThrottleLabel": {\r
        "message": "Разрешить ручное увеличение тяги"\r
    },\r
    "rthLinearDescentStartHelp": {\r
        "message": "Это расстояние от домашней точки, на котором начинается линейное снижение. Если установлено значение 0, линейное снижение начнётся немедленно."\r
    },\r
    "osd_right_sidebar_scroll": {\r
        "message": "Прокрутка правой панели"\r
    },\r
    "pidTuning_LevelHelp": {\r
        "message": "Приведённые ниже значения изменяют поведение режимов полёта ANGLE и HORIZON. Разные PID-регуляторы по-разному обрабатывают значения LEVEL. Пожалуйста, ознакомьтесь с документацией"\r
    },\r
    "pidTuning_MatrixFilterQFactorHelp": {\r
        "message": "Чем выше значение, тем выше избирательность матричного фильтра. Рекомендуются значения от 150 до 300."\r
    },\r
    "failsafeDelayHelp": {\r
        "message": "Время ожидания восстановления на этапе 1"\r
    },\r
    "servosMax": {\r
        "message": "Макс."\r
    },\r
    "osdGroupGForce": {\r
        "message": "Перегрузка"\r
    },\r
    "savedSuccessfully": {\r
        "message": " был успешно сохранен!"\r
    },\r
    "ledStripDirN": {\r
        "message": "С"\r
    },\r
    "configurationVoltageCurrentSensor": {\r
        "message": "Датчики напряжения и тока"\r
    },\r
    "osd_rssi_alarm": {\r
        "message": "RSSI (%)"\r
    },\r
    "adjustmentsFunction15": {\r
        "message": "Регулировка I-коэффициента крена"\r
    },\r
    "removeAllPointButtonSave": {\r
        "message": "Удалить все точки"\r
    },\r
    "mixerButtonSaveAndReboot": {\r
        "message": "Сохранить и перезагрузить"\r
    },\r
    "adjustmentsFunction7": {\r
        "message": "Регулировка I-коэффициентов крена и тангажа"\r
    },\r
    "cliEnter": {\r
        "message": "Обнаружен переход в режим командной строки"\r
    },\r
    "defaultContributingHead": {\r
        "message": "Содействие"\r
    },\r
    "missionTitleLoadEepromMission": {\r
        "message": "Загрузить миссию Eeprom"\r
    },\r
    "save": {\r
        "message": "Сохранить"\r
    },\r
    "osd_imu_temp_alarm_min": {\r
        "message": "Минимальная температура IMU"\r
    },\r
    "servoRefreshRate": {\r
        "message": "Частота обновления сервопривода"\r
    },\r
    "osdGroupCurrentMeter": {\r
        "message": "Датчик тока"\r
    },\r
    "mainHelpArmed": {\r
        "message": "Мотор запущен"\r
    },\r
    "minRthDistanceHelp": {\r
        "message": "Если БПЛА находится в пределах этого расстояния от домашней точки, он выполнит посадку вместо возврата домой с последующей посадкой"\r
    },\r
    "HOME_DISTANCE": {\r
        "message": "Расстояние до дома"\r
    },\r
    "disconnect": {\r
        "message": "Отключиться"\r
    },\r
    "mixerLoadAndApplyPresetRules": {\r
        "message": "Загрузить и применить"\r
    },\r
    "initialSetupSettingsRestored": {\r
        "message": "Восстановлены настройки <strong>по умолчанию</strong>"\r
    },\r
    "pidTuning_RatesAndExpo": {\r
        "message": "Расходы и экспонента"\r
    },\r
    "osd_hud_radar_range_max_help": {\r
        "message": "Летательные аппараты, расположенные дальше указанного расстояния, не будут отображаться в HUD."\r
    },\r
    "ledStripWiringClearAllControl": {\r
        "message": "Очистить все линии"\r
    },\r
    "featureMOTOR_STOP": {\r
        "message": "Останавливать моторы при малой тяге"\r
    },\r
    "motor_direction_inverted": {\r
        "message_en": "Normal motor direction / Props-in configuration",\r
        "message_inav": "Нормальное направление двигателя / Реквизит В конфигурации",\r
        "message": "Нормальное направление вращения моторов / Props-in конфигурация"\r
    },\r
    "pidTuning_ITermMechanics": {\r
        "message": "Механика I-составляющей"\r
    },\r
    "featureSONAR": {\r
        "message": "Сонар"\r
    },\r
    "portsHelp": {\r
        "message": "<strong>Примечание:</strong> не все комбинации настроек валидны. Когда прошивка полётного контроллера обнаружит это, конфигурация последовательного порта будет сброшена."\r
    },\r
    "osdElement_TRIP_DIST": {\r
        "message": "Пройденное расстояние"\r
    },\r
    "MissionPlannerJump3SettingsCheck": {\r
        "message": "Настройки JUMP некорректны: невозможно совершить переход к точке интереса (POI)!\\nПроизводится принудительный переход к путевой точке 1!"\r
    },\r
    "sitlResetDemoModeData": {\r
        "message": "Сбросить демо режим"\r
    },\r
    "osd_rssi_dbm_alarm": {\r
        "message": "Предупреждение об уровне RSSI (дБм)"\r
    },\r
    "sensorStatusGPSShort": {\r
        "message": "GPS",\r
        "description": "Текст для иконок датчиков вверху. Сделайте его кратким."\r
    },\r
    "featureCHANNEL_FORWARDING": {\r
        "message": "Перенаправление aux каналов на сервовыходы"\r
    },\r
    "maxDiveAngle": {\r
        "message": "Макс. угол тангажа при снижении при навигации"\r
    },\r
    "pidTuning_ManualYawRate": {\r
        "message": "Ручная скорость рыскания"\r
    },\r
    "configurationHeadtrackerPanRatio": {\r
        "message": "Коэффициент движения поворота трекера головы"\r
    },\r
    "dterm_lpf2_hz": {\r
        "message": "Частота среза ФНЧ D-составляющей, Этап 2"\r
    },\r
    "no_waypoints_to_save": {\r
        "message": "Нет путевых точек для сохранения!"\r
    },\r
    "loiterRadius": {\r
        "message": "Радиус ожидания"\r
    },\r
    "tabFiltering": {\r
        "message": "Фильтрация"\r
    },\r
    "pidTuning_rpmFilters": {\r
        "message": "Фильтры гироскопа по оборотам моторов"\r
    },\r
    "NONE": {\r
        "message": "Ничего"\r
    },\r
    "BLACKBOX_FEATURE_RC_COMMAND": {\r
        "message": "Команды пульта"\r
    },\r
    "defaultContributingText": {\r
        "message": "Помочь сделать INAV ещё лучше можно разными способами, в том числе:<br /><ul><li>отвечая на вопросы других пользователей на форумах и в IRC</li><li>добавляя код для прошивки и конфигуратора - новые функции, исправления, улучшения</li><li>тестируя <a href=\\"https://github.com/iNavFlight/inav/pulls\\" target=\\"_blank\\">новые функции/исправления</a> и предоставляя обратную связь</li><li>помогая с <a href=\\"https://github.com/iNavFlight/inav/issues\\" target=\\"_blank\\">задачами и комментируя запросы на дополнительные функции</a>.</li></ul>"\r
    },\r
    "mixerWizardModalTitle": {\r
        "message": "Мастер микшера квадрокоптера"\r
    },\r
    "MagZText": {\r
        "message": "Z0"\r
    },\r
    "powerConfiguration": {\r
        "message": "Настройки оценки заряда батареи"\r
    },\r
    "gsTelemetryVoltageShort": {\r
        "message": "V батареи"\r
    },\r
    "osdElement_SWITCH_INDICATOR_3": {\r
        "message": "Индикатор переключателя 4"\r
    },\r
    "osdPanServoOffcentreWarning": {\r
        "message": "Предупреждение о смещении от центра"\r
    },\r
    "connect": {\r
        "message": "Подключиться"\r
    },\r
    "pidTuning_dtermLpfCutoffFrequency": {\r
        "message": "Частота среза ФНЧ D-составляющей"\r
    },\r
    "configuration3dNeutral": {\r
        "message": "Реверсивные моторы, нейтраль"\r
    },\r
    "SafehomeLegend": {\r
        "message": "Легенда: "\r
    },\r
    "wpTrackingAccuracyHelp": {\r
        "message": "Мертвая зона отслеживания (Tracking deadband) — это допустимое отклонение (в метрах), с которым аппарат следует по маршруту путевых точек. Более низкие значения обеспечивают более точное следование маршруту, но приводят к увеличению числа корректировок. Значение 2 является хорошей отправной точкой. [0–10]"\r
    },\r
    "sensorBatteryProfile1": {\r
        "message": "Профиль батареи 1"\r
    },\r
    "osd_gforce_axis_alarm_max": {\r
        "message": "Макс. значение по оси перегрузки"\r
    },\r
    "statusbar_usage_download": {\r
        "message": "D: $1%"\r
    },\r
    "pidTuning_PIDgains": {\r
        "message": "Коэффициенты PID"\r
    },\r
    "accZero": {\r
        "message": "0 акселерометра"\r
    },\r
    "mixerWizardInfo": {\r
        "message": "<ol><li>Уберите пропеллеры</li><li>Подключите батарею и используйте вкладку «Моторы» для проверки всех моторов.</li><li>Обратите внимание на положение каждого мотора (мотор №1 — слева вверху и т. д.)</li><li>Заполните таблицу ниже</li></ol>"\r
    },\r
    "OpflowCalText": {\r
        "message": "После нажатия кнопки у вас есть 30 секунд, чтобы держа модель в воздухе наклонять её в стороны, не перемещая по горизонтали. Обратите внимание, что датчик оптического потока должен постоянно наблюдать за поверхностью."\r
    },\r
    "configurationBatteryCurrent": {\r
        "message": "Ток батареи"\r
    },\r
    "ledStripThrottleText": {\r
        "message": "Тяга"\r
    },\r
    "dataflashButtonErase": {\r
        "message": "Стереть флэш-память"\r
    },\r
    "receiverChannelMap": {\r
        "message": "Карта каналов"\r
    },\r
    "editPointButtonRemove": {\r
        "message": "Удалить"\r
    },\r
    "configurationLaunchMaxAltitude": {\r
        "message": "Максимальная высота"\r
    },\r
    "DEFAULT": {\r
        "message": "По умолчанию"\r
    },\r
    "configurationGPSUseGalileo": {\r
        "message": "GPS использует спутники Galileo (EU)"\r
    },\r
    "BLACKBOX_FEATURE_GYRO_RAW": {\r
        "message": "Необработанные данные гироскопа (без фильтрации)"\r
    },\r
    "failsafeFeaturesHelpNew": {\r
        "message": "Failsafe проходит в 2 этапа. <strong>Этап 1</strong> наступает, если в канале появляются импульсы с недопустимой длительностью, либо, когда приёмник сообщает о режиме failsafe, либо при полном отсутствии сигнала с приёмника. На этом этапе <span style=\\"color: red\\">все каналы</span> на короткое время устанавливаются в fallback значения для возможности восстановления. Если сигнал не восстанавливается в течение указанного времени, <span style=\\"color: red\\">и если аппарат взведён</span>, то наступает <strong>Этап 2</strong>. Каналы по-прежнему будут принимать fallback значения, если эти значения не перекрываются процедурой Этапа 2.<br /><strong>Примечание:</strong> перед переходом на этап 1 fallback значения также могу применяться только для отдельных AUX-каналов, имеющим ошибочные импульсы."\r
    },\r
    "osd_video_show_guides": {\r
        "message": "Показывать направляющие предпросмотра"\r
    },\r
    "configurationLaunchMotorDelayHelp": {\r
        "message": "Задержка между обнаружением запуска и началом последовательности запуска и увеличением тяги. По умолчанию: 500 [0-5000]"\r
    },\r
    "portsFunction_GPS": {\r
        "message": "GPS"\r
    },\r
    "pidTuning_SelectNewDefaults": {\r
        "message": "Выбор новых значений по умолчанию"\r
    },\r
    "configurationVoltageSourceHelp": {\r
        "message": "Необработанное напряжение — это напряжение, считываемое непосредственно с аккумулятора. Компенсированное напряжение — это расчётное напряжение, при котором батарея должна находиться без нагрузки (имитирует идеальную батарею и устраняет ложные срабатывания, вызванные высокими нагрузками)"\r
    },\r
    "defaultsDialogInfo2": {\r
        "message": "Избегайте бездумного восстановления всей конфигурации PID и фильтров из предыдущей версии INAV. Наилучший результат может быть достигнут путём повторной настройки, начиная со значений по умолчанию!"\r
    },\r
    "sitlEnterName": {\r
        "message": "(Имя профиля)"\r
    },\r
    "missionDefaultElevationHead": {\r
        "message": "Профиль высот"\r
    },\r
    "ledStripModesOrientationTitle": {\r
        "message": "Ориентация и цвет светодиодов"\r
    },\r
    "adjustmentsGroupMisc": {\r
        "message": "Разное"\r
    },\r
    "landMaxAltVspdHelp": {\r
        "message": "Если включена автоматическая посадка, после возврата домой дрон начнёт снижаться с заданной скоростью, пока не достигнет <strong>высоты замедления.</strong>"\r
    },\r
    "sensorsAccelSelect": {\r
        "message": "Акселерометр"\r
    },\r
    "featureDYNAMIC_FILTERS": {\r
        "message": "Динамические фильтры гироскопа"\r
    },\r
    "adjustmentsFunction38": {\r
        "message": "Регулировка D-коэффициента уровня"\r
    },\r
    "rthTwoStageHelp": {\r
        "message": "Функция поэтапного RTH при включенном режиме «Сначала набор высоты». Установите высоту первого этапа набора высоты на 0, чтобы использовать классический одноступенчатый RTH."\r
    },\r
    "cliConfirmSnippetBtn": {\r
        "message": "Выполнить"\r
    },\r
    "loadEepromMissionButton": {\r
        "message": "Загрузить миссию Eeprom"\r
    },\r
    "adjustmentsColumnUsingSlot": {\r
        "message_en": "using slot",\r
        "message": "используя слот"\r
    },\r
    "osd_esc_temp_alarm_min": {\r
        "message": "Минимальная температура ECS"\r
    },\r
    "configurationNoBand": {\r
        "message": "Отсутствует"\r
    },\r
    "sensorsTemperature4": {\r
        "message": "Температура 4, °C"\r
    },\r
    "missionElevation": {\r
        "message": "Высота над уровнем моря (м):"\r
    },\r
    "osdGroupPIDs": {\r
        "message": "Настраиваемые RC-значения"\r
    },\r
    "osdElement_POS_XY_PIDS": {\r
        "message": "PID: Позиция XY"\r
    },\r
    "BLACKBOX_FEATURE_SERVOS": {\r
        "message": "Вывод сервоприводов"\r
    },\r
    "osdUnitMetric": {\r
        "message": "Метрические единицы"\r
    },\r
    "gpsFix3D": {\r
        "message": "<span class=\\"fix3d\\">3D</span>"\r
    },\r
    "brakingSpeedThreshold": {\r
        "message": "Мин. порог скорости"\r
    },\r
    "osdGroupGVars": {\r
        "message": "Глобальные переменные"\r
    },\r
    "osdElement_PLIMIT_ACTIVE_POWER_LIMIT": {\r
        "message": "Действующее ограничение мощности"\r
    },\r
    "osd_camera_fov_v": {\r
        "message": "Верт. угол обзора камеры"\r
    },\r
    "RX_PWM": {\r
        "message": "Вход PWM приёмника (один провод на канал)"\r
    },\r
    "featureSOFTSERIAL": {\r
        "message": "Включить последовательные порты на базе ЦП"\r
    },\r
    "wpLoadBootHelp": {\r
        "message": "Если эта функция включена, миссии по путевым точкам, сохранённые в EEPROM, будут автоматически загружены после запуска системы."\r
    },\r
    "firmwareFlasherShowDevelopmentReleases": {\r
        "message": "Показать нестабильные выпуски"\r
    },\r
    "pidTuning_Rates_Pitch": {\r
        "message": "Тангаж (°/c)"\r
    },\r
    "initialSetupThrottleHead": {\r
        "message": "Настройки тяги"\r
    },\r
    "configurationLaunchIdleDelay": {\r
        "message": "Задержка холостого хода"\r
    },\r
    "loadedSuccessfully": {\r
        "message": " был успешно загружен!"\r
    },\r
    "throttleIdleAnalogInfo": {\r
        "message": "Для аналоговых протоколов мощность холостого хода можно снизить ниже 10%, если двигатели работают плавно, без заиканий. Если дрон раскачивается после сброса тяги, попробуйте увеличить мощность IDLE, чтобы устранить это поведение."\r
    },\r
    "sitlPortHelp": {\r
        "message": "Номер порта интерфейса симулятора. Примечание. Порт RealFlight фиксирован и не может быть изменён."\r
    },\r
    "mixerNotLoaded": {\r
        "message": "Микшер не загружен.<br />Нажмите <b>«Загрузить и применить»</b> или <b>«Загрузить микшер»</b>, чтобы использовать выбранный микшер.<br />Или нажмите <b>«Обновить микшер»</b> чтобы использовать текущий микшер."\r
    },\r
    "blackboxFields": {\r
        "message": "Поля чёрного ящика"\r
    },\r
    "firmwareFlasherReleaseFile": {\r
        "message": "Файл прошивки:"\r
    },\r
    "MissionPlannerJump2SettingsCheck": {\r
        "message": "Настройки JUMP некорректны: количество повторов не должно превышать 10!\\nПроверьте их ещё раз! Производится принудительная установка количества повторов равным 0!"\r
    },\r
    "defaultWelcomeHead2": {\r
        "message": "Партнёры INAV"\r
    },\r
    "axisYaw": {\r
        "message": "Рыскание"\r
    },\r
    "sdcardNote": {\r
        "message": "Журнал (логи) полёта может быть записан на подключенную к полётному контроллеру SD-карту."\r
    },\r
    "configurationMagDeclination": {\r
        "message": "Склонение магнитометра [°]"\r
    },\r
    "connectionBleError": {\r
        "message": "Ошибка при открытии BLE-устройства: $1"\r
    },\r
    "statusbar_cpu_load": {\r
        "message": "Загрузка ЦПУ: $1%"\r
    },\r
    "positionEstimatorConfigurationDisclaimer": {\r
        "message": "Эти значения следует менять очень осторожно. В большинстве случаев нет необходимости их менять. Только для продвинутых пользователей!"\r
    },\r
    "rthAltitude": {\r
        "message": "Высота возврата домой"\r
    },\r
    "manualEnablingTemplate": {\r
        "message": "Для включения через CLI, используйте команду <strong>feature {name}</strong>"\r
    },\r
    "idlePower": {\r
        "message": "Потребление на холостом ходу"\r
    },\r
    "pidTuning_d_boost_max_at_acceleration": {\r
        "message": "Максимальное усиление D-составляющей при ускорении [°/с²]"\r
    },\r
    "osd_camera_uptilt_help": {\r
        "message": "Установите угол наклона камеры FPV в градусах: положительный — вверх, отрицательный — вниз относительно горизонтали. Используется для корректного отображения элементов HUD и AHI (при включении с помощью osd_ahi_camera_uptilt_comp=ON)."\r
    },\r
    "pidTuning_tpaMechanics": {\r
        "message": "Ослабление PID-регулятора по тяге"\r
    },\r
    "ezTuneRatePreviewExpo": {\r
        "message": "Экспонента"\r
    },\r
    "sitlInavOutput": {\r
        "message": "INAV выход"\r
    },\r
    "confirm_delete_point_with_options": {\r
        "message": "Вы действительно хотите удалить эту путевую точку, содержащую негеографические опции JUMP/SET_HEAD/RTH?\\nЕсли да, то прикреплённые негеографические параметры также будут удалены!"\r
    },\r
    "gsTelemetrySpeed": {\r
        "message": "Скорость"\r
    },\r
    "geozoneRadius": {\r
        "message": "Радиус (см):"\r
    },\r
    "gyroLpfCutoffFrequencyHelp": {\r
        "message": "Программный фильтр для удаления механических вибраций из сигнала гироскопа. Значение представляет собой частоту среза (Гц). Для больших аппаратов с большими пропеллерами установите меньшее значение. Слишком высокое значение может привести к перегреву двигателя и ESC."\r
    },\r
    "BLACKBOX_FEATURE_NAV_PID": {\r
        "message": "Навигационный PID"\r
    },\r
    "posholdMaxBankAngleHelp": {\r
        "message": "Максимальный угол крена в навигационных режимах. Ограничен максимальным углом крена на вкладке «PID настройки»."\r
    },\r
    "missionDefaultPointAlt": {\r
        "message": "Высота (см): "\r
    },\r
    "functionFlags": {\r
        "message": "Флаги"\r
    },\r
    "adjustmentsColumnIsInRange": {\r
        "message": "находится в диапазоне"\r
    },\r
    "firmwareFlasherRemoteFirmwareLoaded": {\r
        "message": "<span style=\\"color: #37a8db\\">Прошивка загружена из сети и готова для загрузки</span>"\r
    },\r
    "accCalibrationProcessing": {\r
        "message": "Обработка..."\r
    },\r
    "configurationVTXLowPowerDisarmValue_1": {\r
        "message": "Всегда"\r
    },\r
    "RX_NONE": {\r
        "message": "Нет приёмника"\r
    },\r
    "firmwareFlasherStatus": {\r
        "message": "Статус:"\r
    },\r
    "colorCyan": {\r
        "message": "бирюзовый"\r
    },\r
    "osdElement_YAW_PIDS": {\r
        "message": "PID'ы рыскания"\r
    },\r
    "configurationI2cSpeedHelp": {\r
        "message": "Скорость I2C следует поддерживать на максимально возможном уровне, при котором работают все подключенные устройства. Значение по умолчанию 400 кГц является безопасным, и рекомендуется переключиться на 800 кГц в случае мультироторов."\r
    },\r
    "userControlMode": {\r
        "message": "Режим пользовательского управления"\r
    },\r
    "SafehomeSelected": {\r
        "message": ""\r
    },\r
    "osd_main_voltage_decimals": {\r
        "message": "Точность напряжения"\r
    },\r
    "firmwareVariantNotSupported": {\r
        "message": "Этот вариант прошивки <span style=\\"color: red\\">не поддерживается</span>. Пожалуйста, обновите прошивку INAV. Используйте CLI для резервного копирования перед прошивкой. Процедура резервного копирования/восстановления CLI описана в документации."\r
    },\r
    "fwLandFlareAltHelp": {\r
        "message_en": "At this altitude (measured from the altitude of the landing point) the last phase of landing is executed.",\r
        "message": "На этой высоте (измеряемой относительно высоты точки приземления) выполняется заключительная фаза посадки."\r
    },\r
    "rthAbortThreshold": {\r
        "message": "Порог прерывания RTH"\r
    },\r
    "osdElement_GVAR_2": {\r
        "message": "Глобальная переменная 2"\r
    },\r
    "pidTuning_Manual_Rates": {\r
        "message": "Ручные расходы"\r
    },\r
    "initialSetupAttitude": {\r
        "message": "$1 °"\r
    },\r
    "portsFunction_RX_SERIAL": {\r
        "message": "Последовательный приёмник"\r
    },\r
    "advancedTuningSave": {\r
        "message": "Сохранить и перезагрузить"\r
    },\r
    "stm32RebootingToBootloaderFailed": {\r
        "message": "Перезапуск в режим загрузчика: ОШИБКА"\r
    },\r
    "pidTuning_d_boost_gyro_delta_lpf_hz_help": {\r
        "message": "Должна быть установлено по частоте колебаний от потока пропеллера. 5-дюймовые коптеры лучше всего работают на частоте около 80 Гц, 7-дюймовые — на частоте около 50 Гц"\r
    },\r
    "initialSetupOpflowCalibEnded": {\r
        "message": "Калибровка оптического потока <span style=\\"color: #37a8db\\">завершена</span>"\r
    },\r
    "gpsStatHead": {\r
        "message": "Статистика"\r
    },\r
    "adjustmentsExample2": {\r
        "message": "Используйте слот 2 и 3-х позиционный переключатель на CH8, чтобы включить выбор профиля скорости с помощью того же 3-х позиционного переключателя на том же канале."\r
    },\r
    "rthSafeHomeHelp": {\r
        "message": "Используется для контроля того, когда будет использоваться функция безопасного дома. Возможные значения: OFF, RTH и RTH_FS. Дополнительную информацию см. в документации «Safehome»."\r
    },\r
    "gyroNotchCutoff1Help": {\r
        "message": "Определяет полосу режекторного фильтра. <br><br>Должна быть ниже частоты режекторного фильтра."\r
    },\r
    "missionGeozoneLoad": {\r
        "message": "Загрузка геозон из Eeprom"\r
    },\r
    "rthClimbIgnoreEmergency": {\r
        "message": "Набор высоты независимо от состояния датчиков положения"\r
    },\r
    "firmwareFlasherReleaseStatus": {\r
        "message": "Состояние:"\r
    },\r
    "calibrationHead2": {\r
        "message": "Значения акселерометра"\r
    },\r
    "uploadedCharacters": {\r
        "message": "Загружено $1 символов"\r
    },\r
    "ledStripH": {\r
        "message": "H"\r
    },\r
    "osdElement_IMU_TEMPERATURE_HELP": {\r
        "message": "Температура IMU"\r
    },\r
    "adjustmentsSave": {\r
        "message": "Сохранить"\r
    },\r
    "osd_camera_uptilt": {\r
        "message": "Угол наклона камеры"\r
    },\r
    "rthAltControlMode": {\r
        "message": "Режим высоты RTH"\r
    },\r
    "ledStripModeColorsModeGPSNoLock": {\r
        "message": "GPS: местоположение не определено"\r
    },\r
    "dfu_connect_message": {\r
        "message": "Пожалуйста, используйте \\"Программатор\\" для доступа к DFU устройств"\r
    },\r
    "auxiliaryButtonSave": {\r
        "message": "Сохранить"\r
    },\r
    "initialSetupBatteryFullValue": {\r
        "message": "$1"\r
    },\r
    "firmwareFlasherReleaseName": {\r
        "message": "Имя/Версия:"\r
    },\r
    "configurationLaunchMaxAngle": {\r
        "message": "Максимальный угол броска"\r
    },\r
    "options_receive_app_notifications": {\r
        "message": "Получать <strong>уведомления</strong> о новой версии приложения"\r
    },\r
    "ledStripModeColorsModeBaro": {\r
        "message": "Барометр"\r
    },\r
    "osdGroupTemperature": {\r
        "message": "Температура"\r
    },\r
    "functionEnabled": {\r
        "message": "Включено"\r
    },\r
    "rthTwoStage": {\r
        "message": "Метод набора высоты на первом этапе"\r
    },\r
    "initialSetupBatteryFull": {\r
        "message": "Батарея полностью заряжена"\r
    },\r
    "ledStripModeColorsModeGPSNoSats": {\r
        "message": "GPS: нет спутников"\r
    },\r
    "geozoneShape": {\r
        "message": "Форма"\r
    },\r
    "ledStripOverlayTitle": {\r
        "message": "Наложение"\r
    },\r
    "defaultWelcomeText2": {\r
        "message": "INAV поддерживается большим сообществом пользователей, разработчиков и компаний. Вот краткий список: <a href=\\"http://www.mateksys.com/\\" target=\\"_blank\\">Mateksys</a>, <a href=\\"https://www.speedybee.com/\\" target=\\"_blank\\">SpeedyBee</a>, <a href=\\"https://geprc.com/\\" target=\\"_blank\\">GEPRC</a>. "\r
    },\r
    "gpsBaud": {\r
        "message": "Скорость передачи"\r
    },\r
    "configurationBatteryMultiwiiCurrent": {\r
        "message": "Включить поддержку вывода тока для устаревших Multiwii MSP"\r
    },\r
    "no_waypoints_to_load": {\r
        "message": "Нет путевых точек для загрузки!"\r
    },\r
    "pidTuning_antigravityAccelerator": {\r
        "message": "Ускоритель антигравитации"\r
    },\r
    "adjustmentsFunction22": {\r
        "message": "Выбор профиля коэффициентов скорости"\r
    },\r
    "stm32GlobalErase": {\r
        "message": "Выполняется полное стирание чипа ..."\r
    },\r
    "mixerWizardMotorIndex": {\r
        "message": "Индекс мотора"\r
    },\r
    "initialSetupMinimum": {\r
        "message": "Минимум:"\r
    },\r
    "motor_direction_inverted_hint": {\r
        "message": "Включите, если направление вращения моторов инвертировано, а пропеллеры установлены в противоположном направлении."\r
    },\r
    "geozoneInvalidLon": {\r
        "message": "Некорректная долгота"\r
    },\r
    "w_z_gps_v": {\r
        "message": "Коэффициент доверия GPS для вертикальной скорости"\r
    },\r
    "sensorsTemperaturesSelect": {\r
        "message": "Температуры"\r
    },\r
    "osd_dist_alarm": {\r
        "message": "Расстояние до дома"\r
    },\r
    "pidTuning_itermBankAngleFreezeHelp": {\r
        "message": "Блокировать I-составляющую рыскания, когда самолёт наклонен более чем на заданное количество градусов. Это помогает рулю направления не противодействовать повороту. Значение 0 отключает эту функцию. Применяется только к самолётам с фиксированным крылом"\r
    },\r
    "sitlDelete": {\r
        "message": "Удалить"\r
    },\r
    "osdElement_RC_SOURCE": {\r
        "message": "Источник RC"\r
    },\r
    "tzOffsetHelp": {\r
        "message": "Смещение часового пояса от UTC. Оно применяется к времени GPS для регистрации и отметки времени в журналах Blackbox. (По умолчанию = 0 минут)"\r
    },\r
    "endSendPoint": {\r
        "message": "Конец отправки точек"\r
    },\r
    "ezTuneAggressivenessTips": {\r
        "message": "Определяет, насколько быстро ваш БПЛА будет реагировать на быстрые движения стиков. Более высокая агрессивность приводит к более резким маневрам. Это не влияет на стабилизацию, только на ощущение стиков. Это эквивалент FF-составляющей."\r
    },\r
    "loggingButtonLogFile": {\r
        "message": "Выберите лог-файл"\r
    },\r
    "adjustmentsFunction6": {\r
        "message": "Регулировка P-коэффициентов крена и тангажа"\r
    },\r
    "initialSetupModel": {\r
        "message": "Модель: $1"\r
    },\r
    "osdGroupAttitude": {\r
        "message": "Ориентация"\r
    },\r
    "adjustmentsGroupRates": {\r
        "message": "Скорость и экспонента"\r
    },\r
    "colorLimeGreen": {\r
        "message": "салатовый"\r
    },\r
    "defaultWelcomeHead": {\r
        "message": "Аппаратная часть"\r
    },\r
    "adjustmentsFunction27": {\r
        "message": "Ручная регулировка RC-экспоненты рыскания"\r
    },\r
    "escProtocolNotAdvised": {\r
        "message": "Этот протокол ESC не рекомендован. Используйте на свой риск."\r
    },\r
    "serialrx_frSkyPitchRollLabel": {\r
        "message": "Использовать сенсоры крена и тангажа в телеметрии"\r
    },\r
    "serialrx_frSkyPitchRollHelp": {\r
        "message": "Это передаёт телеметрические данные об углах тангажа и крена вместо стандартных данных с сырых акселерометров. Эту опцию следует <strong>включить</strong>, если вы используете LUA-скрипты для телеметрической панели в INAV, OpenTX/EdgeTX или ETHOS."\r
    },\r
    "serialrx_frSkyFuelUnitLabel": {\r
        "message": "Единицы измерения расхода топлива (SmartPort)"\r
    },\r
    "serialrx_frSkyFuelUnitHelp": {\r
        "message": "Выберите данные, которые вы хотите отправлять на сенсор телеметрии, отвечающий за <strong>«топливо»<strong> (расход/заряд)."\r
    },\r
    "configurationFrSkyOptions": {\r
        "message": "Опции FrSky"\r
    },\r
    "configurationFrSkyOptions_HELP": {\r
        "message": "Эти опции предоставляют быстрый доступ к настройке телеметрических датчиков SmartPort для работы с LUA-скриптами телеметрии в OpenTX/EdgeTX и ETHOS. Обратите внимание: если вы используете протокол SBUS, вам потребуется настроить телеметрию SmartPort на отдельном последовательном порту."\r
    },\r
    "portsMSPWarning": {\r
        "message": "<strong>Внимание:</strong><p>Настройка протокола MSP более чем на двух портах UART может вызвать проблемы со связью через USB. Рекомендуется отключить MSP на тех портах, где он не используется.</p>"\r
    },\r
    "osd_custom_element_settings_icons_HELP": {\r
        "message": "Номера иконок можно найти, нажав на кнопку справки."\r
    },\r
    "osdElement_VERTICAL_SPEED_INDICATOR": {\r
        "message": "Индикатор вертикальной скорости"\r
    },\r
    "osdElement_VERTICAL_SPEED_INDICATOR_HELP": {\r
        "message": "Отображает вертикальную скорость в виде числа"\r
    },\r
    "osdPanServoRangeDecadegrees": {\r
        "message": "Общий угол поворота сервопривода панорамирования"\r
    },\r
    "osdPanServoRangeDecadegrees_HELP": {\r
        "message": "Диапазон поворота сервопривода панорамирования в градусах. Сервопривод с углом поворота в 180° обычно требует установки значения 180 для этого параметра. Чтобы инвертировать направление движения, задайте отрицательное значение."\r
    },\r
    "mixer_control_profile_linking": {\r
        "message": "Профиль управления будет использовать тот же индекс, что и индекс профиля микшера"\r
    },\r
    "mixer_control_profile_linking_hint": {\r
        "message": "mixer_control_profile_linking: Включите эту опцию в обоих профилях микшера, если вы хотите, чтобы переключение профиля управления осуществлялось при переключении профиля микшера. (Рекомендуется для конфигураций VTOL или смешанных платформ)"\r
    },\r
    "tabJavaScriptProgramming": {\r
        "message": "Программирование (JavaScript)"\r
    },\r
    "javascriptTranspile": {\r
        "message": "Транспилировать (преобразовать) для INAV"\r
    },\r
    "javascriptLoad": {\r
        "message": "Загрузить из FC"\r
    },\r
    "javascriptSave": {\r
        "message": "Сохранить в FC"\r
    },\r
    "javascriptClear": {\r
        "message": "Очистить редактор"\r
    },\r
    "options_disable3dAcceleration": {\r
        "message": "Отключить 3D-ускорение, если 3D-модели не отображаются. Для применения настроек требуется перезапуск приложения."\r
    },\r
    "javascriptProgrammingDescription": {\r
        "message": "Используйте JavaScript-код для управления вашим летательным аппаратом. Транспилер преобразует ваш код в «Логические условия» прошивки INAV."\r
    },\r
    "javascriptBetaWarning": {\r
        "message": "<strong>Пишите на JavaScript — получайте логические условия INAV!</strong> Используйте привычный синтаксис JavaScript с полной поддержкой автодополнения и проверки ошибок. <strong>На данный момент функция находится в режиме бета-тестирования. Не используйте её для задач, критически важных для безопасности полетов!</strong>"\r
    },\r
    "javascriptEditorTitle": {\r
        "message": "Редактор JavaScript (Ctrl+Shift+V для вставки; чтобы переименовать переменную, щёлкните по ней правой кнопкой мыши)"\r
    },\r
    "javascriptLoadExample": {\r
        "message": "Загрузить пример:"\r
    },\r
    "javascriptSelectExample": {\r
        "message": "-- Выбрать пример --"\r
    },\r
    "javascriptOutputTitle": {\r
        "message": "Результат: Логические условия"\r
    },\r
    "javascriptLcCount": {\r
        "message": "$1 / $2 логических условий"\r
    },\r
    "javascriptApiReference": {\r
        "message": "Справочник API и примеры"\r
    },\r
    "javascriptQuickReference": {\r
        "message": "Краткий справочник"\r
    },\r
    "javascriptFlightParameters": {\r
        "message": "Параметры полёта (только для чтения)"\r
    },\r
    "javascriptRcChannels": {\r
        "message": "RC-каналы"\r
    },\r
    "javascriptOverrides": {\r
        "message": "Переопределения (запись)"\r
    },\r
    "javascriptGlobalVariables": {\r
        "message": "Глобальные переменные"\r
    },\r
    "javascriptCompleteExample": {\r
        "message": "Готовый пример"\r
    },\r
    "javascriptOptimizationsApplied": {\r
        "message": "Применены оптимизации:"\r
    }\r
}\r
`;export{n as default};
