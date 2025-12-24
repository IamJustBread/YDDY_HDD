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
    const historyTableBody = document.getElementById('historyTableBody');
    const emptyTableMessage = document.getElementById('emptyTableMessage');
    const clearTableButton = document.getElementById('clearTableButton');
    const exportTableButton = document.getElementById('exportTableButton');
    const highlightRecentButton = document.getElementById('highlightRecentButton');

    function initApp() {
        initMap();
        loadContentTypes();
        updateCalculateButtonState();
        renderHistoryTable();
        setupEventListeners();
    }

    //Leaflet
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

        L.imageOverlay('static/map.jpg', bounds).addTo(map);

        map.on('click', function(e) {
            if (marker) {
                marker.setLatLng(e.latlng);
            } else {
                marker = L.marker(e.latlng).addTo(map);
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

    // Проверка наличия данных
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

    // Функция расчета
    function calculateExplosion() {
        if (!isRequiredInfoPresent()) {
            alert('Пожалуйста, заполните все необходимые данные перед расчетом.');
            return;
        }
        const trotylResult = calculateTrotylEquivalent();
        if (!trotylResult) return;
        const { trotylEquivalentValue, trotylEquivalentInPounds, weightInGrams } = trotylResult;
        trotylEquivalentInput.value = `${trotylEquivalentValue} oz (${trotylEquivalentInPounds} lb)`;

        // Расчет радиуса зоны эвакуации
        const trotylInKg = (trotylEquivalentValue * 28.3495) / 1000; // Конвертация в кг
        const evacuationRadiusMeters = (150 * Math.pow(trotylInKg, 1/6) * 3.28084) / 11.28;
        displayZonesOnMap(evacuationRadiusMeters);

        // Добавление записи в историю
        addToHistory({
            substanceName: contentTypeSelect.options[contentTypeSelect.selectedIndex].text,
            weight: weightInGrams,
            trotylEquivalent: trotylEquivalentValue,
            evacuationRadius: evacuationRadiusMeters,
            date: new Date().toLocaleString('ru-RU')
        });
        renderHistoryTable();
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
        const metersToInches = 0.39;
        const convertedHeight = dimensionUnit === 'inch' ? height / metersToInches : height;
        const convertedWidth = dimensionUnit === 'inch' ? width / metersToInches : width;
        const convertedDepth = dimensionUnit === 'inch' ? depth / metersToInches : depth;
        const volumeCm3 = convertedHeight * convertedWidth * convertedDepth;
        const calculatedWeight = volumeCm3 * density;
        const weightInGrams = weightUnitSelect.value === 'oz' ? weight * 28.3495 : weight;
        const finalWeight = weight ? weightInGrams : calculatedWeight;
        const trotylEquivalentValue = (tntEquivalent * finalWeight) / 28.3495;
        const trotylEquivalentInPounds = trotylEquivalentValue / 16;

        return {
            trotylEquivalentValue: trotylEquivalentValue.toFixed(2),
            trotylEquivalentInPounds: trotylEquivalentInPounds.toFixed(2),
            weightInGrams: finalWeight.toFixed(2)
        };
    }

    // Зоны на карте
    function displayZonesOnMap(evacuationRadius) {
        if (!marker) return;
        const markerLatLng = marker.getLatLng();
        if (evacuationCircle) map.removeLayer(evacuationCircle);
        if (radioCircle) map.removeLayer(radioCircle);

        // Создание круга зоны эвакуации
        evacuationCircle = L.circle(markerLatLng, {
            color: 'red',
            fillColor: '#e74c3c',
            fillOpacity: 0.5,
            radius: evacuationRadius
        }).addTo(map);
        evacuationCircle.bindTooltip(
            `Зона эвакуации: ${(evacuationRadius * 11.28).toFixed(2)} ft`,
            { permanent: true, direction: 'right' }
        );

        // Создание круга зоны радиомолчания
        if (radioZoneCheckbox.checked) {
            radioCircle = L.circle(markerLatLng, {
                color: 'yellow',
                fillColor: '#f1c40f',
                fillOpacity: 0.5,
                radius: RADIO_ZONE_RADIUS
            }).addTo(map);
            radioCircle.bindTooltip(
                'Зона радиомолчания',
                { permanent: true, direction: 'left' }
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

    // История
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
        if (calculationHistory.length === 0) {
            emptyTableMessage.style.display = 'block';
            return;
        }
        emptyTableMessage.style.display = 'none';

        //Заполнение таблицы
        calculationHistory.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.substanceName}</td>
                <td>${parseFloat(item.weight).toFixed(2)}</td>
                <td>${parseFloat(item.trotylEquivalent).toFixed(2)}</td>
                <td>${parseFloat(item.evacuationRadius).toFixed(2)}</td>
                <td>${item.date}</td>
                <td>
                    <button class="action-btn delete-btn" data-id="${item.id}">Удалить</button>
                </td>
            `;

            row.addEventListener('click', function(e) {
                if (!e.target.classList.contains('delete-btn')) {
                    row.classList.toggle('selected');
                }
            });
            historyTableBody.appendChild(row);
        });

        // Обработчики для кнопок удаления
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
    }

    function clearHistory() {
        if (calculationHistory.length === 0 || !confirm('Вы уверены, что хотите очистить всю историю расчетов?')) {
            return;
        }
        calculationHistory = [];
        localStorage.removeItem('explosionHistory');
        renderHistoryTable();
    }

    function exportToCSV() {
        if (calculationHistory.length === 0) {
            alert('Нет данных для экспорта.');
            return;
        }
        const headers = ['№', 'Тип вещества', 'Вес (г)', 'Тротил. экв. (oz)', 'Радиус эвакуации (м)', 'Дата расчета'];
        const csvRows = [headers.join(',')];
        calculationHistory.forEach((item, index) => {
            const row = [
                index + 1,
                `"${item.substanceName}"`,
                item.weight,
                item.trotylEquivalent,
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
        link.setAttribute('download', 'расчеты_взрывотехника.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    //Подсветка последних 5 рассчётов
    function highlightRecentCalculations() {
        document.querySelectorAll('.history-table tbody tr').forEach(row => {
            row.classList.remove('highlighted');
        });
        const rows = document.querySelectorAll('.history-table tbody tr');
        const count = Math.min(5, rows.length);

        for (let i = 0; i < count; i++) {
            rows[i].classList.add('highlighted');
        }
        setTimeout(() => {
            document.querySelectorAll('.history-table tbody tr').forEach(row => {
                row.classList.remove('highlighted');
            });
        }, 5000);
    }

    function setupEventListeners() {
        contentTypeSelect.addEventListener('change', function() {
            updateCalculateButtonState();
            updateTrotylEquivalentDisplay();
        });

        // Обработчики для расширения инпутов при вводе
        const expandableInputs = document.querySelectorAll('.input-expandable');
        expandableInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateDimensionConversion();
                updateWeightConversion();
                updateCalculateButtonState();
            });
            input.addEventListener('focus', function() {
                this.style.flexGrow = '2';
            });
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.flexGrow = '1';
                }
            });
        });

        // Остальные обработчики
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
        calculateButton.addEventListener('click', calculateExplosion);
        clearTableButton.addEventListener('click', clearHistory);
        exportTableButton.addEventListener('click', exportToCSV);
        highlightRecentButton.addEventListener('click', highlightRecentCalculations);

        // Обработка изменения ориентации экрана
        window.addEventListener('resize', function() {
            if (map) {
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            }
        });

        // Инициализация при загрузке
        window.addEventListener('load', function() {
            if (map) {
                setTimeout(() => {
                    map.invalidateSize();
                }, 300);
            }
        });
    }

    initApp();
});