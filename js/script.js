document.addEventListener('DOMContentLoaded', function() {
    let map;
    let marker;
    let evacuationCircle;
    let radioCircle;
    let calculationHistory = JSON.parse(localStorage.getItem('explosionHistory')) || [];
    const RADIO_ZONE_RADIUS = 13.25;
    const contentTypeSelect = document.getElementById('contentType');
    const heightInput = document.getElementById('height');
    const widthInput = document.getElementById('width');
    const depthInput = document.getElementById('depth');
    const dimensionUnitSelect = document.getElementById('dimensionUnit');
    const dimensionConversion = document.getElementById('dimensionConversion');
    const weightInput = document.getElementById('weight');
    const weightUnitSelect = document.getElementById('weightUnit');
    const weightConversion = document.getElementById('weightConversion');
    const trotylEquivalentInput = document.getElementById('trotylEquivalent');
    const radioZoneCheckbox = document.getElementById('radioZone');
    const calculateButton = document.getElementById('calculateButton');
    const clearFormButton = document.getElementById('clearFormButton');
    const historyTableBody = document.getElementById('historyTableBody');
    const historyCount = document.getElementById('historyCount');
    const emptyTableMessage = document.getElementById('emptyTableMessage');
    const clearTableButton = document.getElementById('clearTableButton');
    const exportTableButton = document.getElementById('exportTableButton');
    const highlightRecentButton = document.getElementById('highlightRecentButton');
    const tableSearch = document.getElementById('tableSearch');

    // Инициализация приложения
    function initApp() {
        initMap();
        loadContentTypes();
        updateCalculateButtonState();
        renderHistoryTable();
        setupEventListeners();
        setupBootstrapComponents();
    }

    // Настройка компонентов Bootstrap
    function setupBootstrapComponents() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        window.addEventListener('resize', function() {
            if (map) {
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            }
        });
    }

    // Инициализация карты Leaflet
    function initMap() {
        const southWest = L.latLng(51.49, -0.14);
        const northEast = L.latLng(51.52, -0.1);
        const bounds = L.latLngBounds(southWest, northEast);

        map = L.map('map', {
            center: [51.505, -0.12],
            zoom: 17,
            minZoom: 16,
            maxZoom: 20,
            maxBounds: bounds,
            doubleClickZoom: false,
        });

        // Добавление фонового изображения карты
        L.imageOverlay('assets/images/map.webp', bounds).addTo(map);

        // Обработчик клика по карте для установки маркера
        map.on('click', function(e) {
            if (marker) {
                marker.setLatLng(e.latlng);
            } else {
                marker = L.marker(e.latlng, {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: '<i class="bi bi-geo-alt-fill text-danger fs-4"></i>',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32]
                    })
                }).addTo(map);
            }
            updateCalculateButtonState();
        });
    }

    // Загрузка типов веществ
    function loadContentTypes() {
        contentTypeSelect.innerHTML = '<option value="">Выберите тип вещества</option>';
        explosivesData.forEach(explosive => {
            const option = document.createElement('option');
            option.value = explosive.id;
            option.textContent = explosive.substance_name;
            option.setAttribute('data-density', explosive.density);
            option.setAttribute('data-tnt-equivalent', explosive.tnt_equivalent);
            contentTypeSelect.appendChild(option);
        });
    }

    // Проверка данных для расчета
    function isRequiredInfoPresent() {
        const selectedSubstanceId = contentTypeSelect.value;
        const hasWeight = parseFloat(weightInput.value) > 0;
        const hasDimensions = parseFloat(heightInput.value) > 0 &&
            parseFloat(widthInput.value) > 0 &&
            parseFloat(depthInput.value) > 0;
        const hasMarker = marker !== undefined;
        return selectedSubstanceId && (hasWeight || hasDimensions) && hasMarker;
    }

    function updateCalculateButtonState() {
        calculateButton.disabled = !isRequiredInfoPresent();
    }

    // Ррасчет
    function calculateExplosion() {
        if (!isRequiredInfoPresent()) {
            showAlert('Пожалуйста, заполните все необходимые данные перед расчетом.', 'warning');
            return;
        }
        const trotylResult = calculateTrotylEquivalent();
        if (!trotylResult) {
            showAlert('Ошибка расчета. Проверьте введенные данные.', 'danger');
            return;
        }
        const { trotylEquivalentValue, trotylEquivalentInPounds, weightInGrams } = trotylResult;
        trotylEquivalentInput.value = `${trotylEquivalentValue} oz (${trotylEquivalentInPounds} lb)`;
        const trotylInKg = (trotylEquivalentValue * 28.3495) / 1000;
        const evacuationRadiusMeters = (150 * Math.pow(trotylInKg, 1/6) * 3.28084) / 11.28;
        displayZonesOnMap(evacuationRadiusMeters);

        // Добавление в историю
        addToHistory({
            substanceName: contentTypeSelect.options[contentTypeSelect.selectedIndex].text,
            weight: weightInGrams,
            trotylEquivalent: trotylEquivalentValue,
            evacuationRadius: evacuationRadiusMeters,
            date: new Date().toLocaleString('ru-RU')
        });
        renderHistoryTable();
        showAlert('Расчет успешно выполнен! Зоны безопасности отображены на карте.', 'success');
    }

    // Расчет тротилового эквивалента
    function calculateTrotylEquivalent() {
        const selectedSubstance = contentTypeSelect.value;
        const weight = parseFloat(weightInput.value) || 0;
        const height = parseFloat(heightInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const depth = parseFloat(depthInput.value) || 0;
        const dimensionUnit = dimensionUnitSelect.value;
        const selectedOption = contentTypeSelect.options[contentTypeSelect.selectedIndex];
        if (!selectedSubstance || (!weight && (!height || !width || !depth))) {
            return null;
        }
        const density = parseFloat(selectedOption.getAttribute('data-density')) || 0;
        const tntEquivalent = parseFloat(selectedOption.getAttribute('data-tnt-equivalent')) || 0;
        // Конвертация размеров
        const metersToInches = 0.39;
        const convertedHeight = dimensionUnit === 'inch' ? height / metersToInches : height;
        const convertedWidth = dimensionUnit === 'inch' ? width / metersToInches : width;
        const convertedDepth = dimensionUnit === 'inch' ? depth / metersToInches : depth;
        // Расчет объема
        const volumeCm3 = convertedHeight * convertedWidth * convertedDepth;
        const calculatedWeight = volumeCm3 * density;
        // Конвертация веса
        const weightInGrams = weightUnitSelect.value === 'oz' ? weight * 28.3495 : weight;
        const finalWeight = weight ? weightInGrams : calculatedWeight;
        // Расчет тротилового эквивалента
        const trotylEquivalentValue = (tntEquivalent * finalWeight) / 28.3495;
        const trotylEquivalentInPounds = trotylEquivalentValue / 16;
        return {
            trotylEquivalentValue: trotylEquivalentValue.toFixed(2),
            trotylEquivalentInPounds: trotylEquivalentInPounds.toFixed(2),
            weightInGrams: finalWeight.toFixed(2)
        };
    }

    // Отображение зон на карте
    function displayZonesOnMap(evacuationRadius) {
        if (!marker) return;
        const markerLatLng = marker.getLatLng();
        if (evacuationCircle) map.removeLayer(evacuationCircle);
        if (radioCircle) map.removeLayer(radioCircle);

        // Создание круга зоны эвакуации
        evacuationCircle = L.circle(markerLatLng, {
            color: '#dc3545',
            fillColor: '#dc3545',
            fillOpacity: 0.3,
            radius: evacuationRadius
        }).addTo(map);
        evacuationCircle.bindTooltip(
            `Зона эвакуации: ${(evacuationRadius * 11.28).toFixed(2)} ft`,
            { permanent: true, direction: 'right', className: 'fw-bold' }
        );

        // Создание круга зоны радиомолчания
        if (radioZoneCheckbox.checked) {
            radioCircle = L.circle(markerLatLng, {
                color: '#ffc107',
                fillColor: '#ffc107',
                fillOpacity: 0.3,
                radius: RADIO_ZONE_RADIUS
            }).addTo(map);
            radioCircle.bindTooltip(
                'Зона радиомолчания',
                { permanent: true, direction: 'left', className: 'fw-bold' }
            );
        }
    }


    function updateDimensionConversion() {
        const metersToFeet = 0.393701;
        const dimensionUnit = dimensionUnitSelect.value;
        const height = parseFloat(heightInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const depth = parseFloat(depthInput.value) || 0;
        let convertedHeight = height;
        let convertedWidth = width;
        let convertedDepth = depth;
        if (dimensionUnit === 'sm') {
            convertedHeight = (height * metersToFeet).toFixed(2);
            convertedWidth = (width * metersToFeet).toFixed(2);
            convertedDepth = (depth * metersToFeet).toFixed(2);
        }
        dimensionConversion.textContent = `(${convertedHeight} inch × ${convertedWidth} inch × ${convertedDepth} inch)`;
        updateCalculateButtonState();
        updateTrotylEquivalentDisplay();
    }

    function updateWeightConversion() {
        const kgToPound = 28.3495;
        const weightUnit = weightUnitSelect.value;
        const weight = parseFloat(weightInput.value) || 0;

        let convertedWeight = weight;

        if (weightUnit === 'gram') {
            convertedWeight = (weight / kgToPound).toFixed(2);
        }

        weightConversion.textContent = `(${convertedWeight} oz)`;
        updateCalculateButtonState();
        updateTrotylEquivalentDisplay();
    }

    function updateTrotylEquivalentDisplay() {
        const trotylResult = calculateTrotylEquivalent();

        if (trotylResult) {
            const { trotylEquivalentValue, trotylEquivalentInPounds } = trotylResult;
            trotylEquivalentInput.value = `${trotylEquivalentValue} oz (${trotylEquivalentInPounds} lb)`;
        } else {
            trotylEquivalentInput.value = '';
        }
    }

    // Работа с историей расчетов
    function addToHistory(calculation) {
        calculationHistory.unshift({
            id: Date.now(),
            ...calculation
        });
        if (calculationHistory.length > 50) {
            calculationHistory = calculationHistory.slice(0, 50);
        }
        localStorage.setItem('explosionHistory', JSON.stringify(calculationHistory));
    }

    function renderHistoryTable() {
        historyTableBody.innerHTML = '';
        historyCount.textContent = calculationHistory.length;
        if (calculationHistory.length === 0) {
            emptyTableMessage.style.display = 'block';
            return;
        }
        emptyTableMessage.style.display = 'none';

        // Поисковая фильтрация
        const searchTerm = tableSearch.value.toLowerCase();
        const filteredHistory = calculationHistory.filter(item =>
            item.substanceName.toLowerCase().includes(searchTerm) ||
            item.date.toLowerCase().includes(searchTerm)
        );
        filteredHistory.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            row.innerHTML = `
                <td class="fw-bold">${index + 1}</td>
                <td>${item.substanceName}</td>
                <td>${parseFloat(item.weight).toFixed(2)}</td>
                <td class="fw-bold text-primary">${parseFloat(item.trotylEquivalent).toFixed(2)}</td>
                <td class="fw-bold text-danger">${parseFloat(item.evacuationRadius).toFixed(2)}</td>
                <td><small class="text-muted">${item.date}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.id}" title="Удалить">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            row.addEventListener('click', function(e) {
                if (!e.target.closest('.delete-btn')) {
                    this.classList.toggle('selected-row');
                }
            });
            historyTableBody.appendChild(row);
        });

        // Добавление обработчиков для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.getAttribute('data-id'));
                removeFromHistory(id);
            });
        });
    }

    function removeFromHistory(id) {
        calculationHistory = calculationHistory.filter(item => item.id !== id);
        localStorage.setItem('explosionHistory', JSON.stringify(calculationHistory));
        renderHistoryTable();
        showAlert('Запись удалена из истории', 'info');
    }

    function clearHistory() {
        if (calculationHistory.length === 0) return;

        if (confirm('Вы уверены, что хотите очистить всю историю расчетов?')) {
            calculationHistory = [];
            localStorage.removeItem('explosionHistory');
            renderHistoryTable();
            showAlert('История расчетов очищена', 'info');
        }
    }

    // Экспорт в CSV
    function exportToCSV() {
        if (calculationHistory.length === 0) {
            showAlert('Нет данных для экспорта', 'warning');
            return;
        }
        const headers = ['№', 'Тип вещества', 'Вес (г)', 'Тротил. экв. (oz)', 'Радиус эвакуации (м)', 'Дата расчета'];
        const csvRows = [headers.join(',')];
        calculationHistory.forEach((item, index) => {
            const row = [
                index + 1,
                `"${item.substanceName}"`,
                item.weight,
                item.troтиlEquivalent,
                item.evacuationRadius,
                `"${item.date}"`
            ];
            csvRows.push(row.join(','));
        });
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `расчеты_взрывотехника_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showAlert('Данные экспортированы в CSV файл', 'success');
    }

    // Подсветка последних записей
    function highlightRecentCalculations() {
        document.querySelectorAll('.historyTableBody tr').forEach(row => {
            row.classList.remove('highlighted-row');
        });
        const rows = document.querySelectorAll('#historyTableBody tr');
        const count = Math.min(5, rows.length);
        for (let i = 0; i < count; i++) {
            rows[i].classList.add('highlighted-row');
        }
        // Автоматическое снятие подсветки через 5 секунд
        setTimeout(() => {
            document.querySelectorAll('#historyTableBody tr').forEach(row => {
                row.classList.remove('highlighted-row');
            });
        }, 5000);
    }

    // Сброс формы
    function clearForm() {
        contentTypeSelect.value = '';
        heightInput.value = '';
        widthInput.value = '';
        depthInput.value = '';
        weightInput.value = '';
        trotylEquivalentInput.value = '';
        radioZoneCheckbox.checked = true;
        if (evacuationCircle) map.removeLayer(evacuationCircle);
        if (radioCircle) map.removeLayer(radioCircle);
        if (marker) map.removeLayer(marker);
        marker = undefined;
        updateCalculateButtonState();
        updateTrotylEquivalentDisplay();
        showAlert('Форма очищена', 'info');
    }

    // Показать уведомление
    function showAlert(message, type) {
        const existingAlert = document.querySelector('.alert-dismissible');
        if (existingAlert) {
            existingAlert.remove();
        }
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alert.style.zIndex = '1050';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Основные элементы формы
        contentTypeSelect.addEventListener('change', function() {
            updateCalculateButtonState();
            updateTrotylEquivalentDisplay();
        });
        heightInput.addEventListener('input', updateDimensionConversion);
        widthInput.addEventListener('input', updateDimensionConversion);
        depthInput.addEventListener('input', updateDimensionConversion);
        dimensionUnitSelect.addEventListener('change', updateDimensionConversion);
        weightInput.addEventListener('input', updateWeightConversion);
        weightUnitSelect.addEventListener('change', updateWeightConversion);
        radioZoneCheckbox.addEventListener('change', function() {
            if (evacuationCircle && marker) {
                displayZonesOnMap(evacuationCircle.getRadius());
            }
        });

        // Кнопки
        calculateButton.addEventListener('click', calculateExplosion);
        clearFormButton.addEventListener('click', clearForm);

        // Управление таблицей
        clearTableButton.addEventListener('click', clearHistory);
        exportTableButton.addEventListener('click', exportToCSV);
        highlightRecentButton.addEventListener('click', highlightRecentCalculations);
        tableSearch.addEventListener('input', renderHistoryTable);
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && isRequiredInfoPresent()) {
                calculateExplosion();
            }
        });
    }

    // Запуск приложения
    initApp();
});