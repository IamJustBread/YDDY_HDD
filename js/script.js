document.addEventListener('DOMContentLoaded', function () {
    // ===== Константы =====
    const RADIO_ZONE_RADIUS = 13.25;          // радиус зоны радиомолчания (м, игровая шкала)
    const CM_PER_INCH = 2.54;
    const GRAMS_PER_OUNCE = 28.3495;
    const M_TO_FEET = 3.28084;
    const GAME_SCALE = 11.28;                 // 1 ед. на оверлее карты ≈ 11.28 фт

    // ===== Состояние =====
    let map;
    let marker;
    let evacuationCircle;
    let radioCircle;
    let calculationHistory = JSON.parse(localStorage.getItem('explosionHistory')) || [];

    // ===== DOM =====
    const contentTypeSelect = document.getElementById('contentType');
    const substanceInfo = document.getElementById('substanceInfo');
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
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const munitionSearch = document.getElementById('munitionSearch');
    const munitionFilters = document.getElementById('munitionFilters');
    const munitionsGrid = document.getElementById('munitionsGrid');
    const munitionsEmpty = document.getElementById('munitionsEmpty');
    const munitionsCount = document.getElementById('munitionsCount');

    let activeMunitionCategory = 'all';

    // ===== Инициализация =====
    function initApp() {
        initMap();
        loadContentTypes();
        updateCalculateButtonState();
        renderHistoryTable();
        renderMunitionFilters();
        renderMunitions();
        setupEventListeners();
        setupBootstrapComponents();
        initTheme();
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            enableDarkTheme();
        } else {
            enableLightTheme();
        }
    }

    function enableDarkTheme() {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'bi bi-sun-fill';
        themeToggle.title = 'Переключить на светлую тему';
        localStorage.setItem('theme', 'dark');
    }

    function enableLightTheme() {
        document.body.classList.remove('dark-theme');
        themeIcon.className = 'bi bi-moon-fill';
        themeToggle.title = 'Переключить на тёмную тему';
        localStorage.setItem('theme', 'light');
    }

    function toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            enableLightTheme();
        } else {
            enableDarkTheme();
        }
    }

    function setupBootstrapComponents() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function (el) {
            return new bootstrap.Tooltip(el);
        });
        window.addEventListener('resize', function () {
            if (map) {
                setTimeout(() => map.invalidateSize(), 100);
            }
        });
    }

    function initMap() {
        const southWest = L.latLng(51.49, -0.14);
        const northEast = L.latLng(51.52, -0.10);
        const bounds = L.latLngBounds(southWest, northEast);

        map = L.map('map', {
            center: [51.505, -0.12],
            zoom: 17,
            minZoom: 16,
            maxZoom: 20,
            maxBounds: bounds,
            doubleClickZoom: false,
        });

        L.imageOverlay('assets/images/map.webp', bounds).addTo(map);

        map.on('click', function (e) {
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

    // ===== Загрузка списка веществ =====
    function loadContentTypes() {
        contentTypeSelect.innerHTML = '<option value="">Выберите тип вещества</option>';
        // Сортируем по тротиловому эквиваленту от меньшего к большему — так удобнее искать.
        const sorted = [...explosivesData].sort((a, b) => a.tnt_equivalent - b.tnt_equivalent);
        sorted.forEach(explosive => {
            const option = document.createElement('option');
            option.value = explosive.id;
            option.textContent = `${explosive.substance_name} — TNT ×${explosive.tnt_equivalent.toFixed(2)}`;
            contentTypeSelect.appendChild(option);
        });
    }

    function getSelectedSubstance() {
        const id = parseInt(contentTypeSelect.value, 10);
        if (!id) return null;
        return explosivesData.find(e => e.id === id) || null;
    }

    function updateSubstanceInfo() {
        if (!substanceInfo) return;
        const s = getSelectedSubstance();
        if (!s) {
            substanceInfo.innerHTML = '';
            substanceInfo.classList.add('d-none');
            return;
        }
        const categoryLabel = explosiveCategoryLabels[s.category] || s.category;
        const stateLabel = explosiveStateLabels[s.state] || s.state;
        substanceInfo.classList.remove('d-none');
        substanceInfo.innerHTML = `
            <div class="bp-spec">
                <span class="bp-spec-row">
                    <span class="badge">${categoryLabel}</span>
                    <span class="badge">${stateLabel}</span>
                </span>
                <span class="bp-spec-row">
                    <span>FORMULA</span>
                    <span class="fw-semibold">${s.formula}</span>
                </span>
                <span class="bp-spec-row">
                    <span>DENSITY</span>
                    <span class="fw-semibold">${s.density.toFixed(2)} г/см³</span>
                </span>
                <span class="bp-spec-row">
                    <span>VOD</span>
                    <span class="fw-semibold">${s.detonation_force.toFixed(0)} м/с</span>
                </span>
            </div>`;
    }

    // ===== Валидация формы =====
    function isRequiredInfoPresent() {
        const hasSubstance = !!contentTypeSelect.value;
        const hasWeight = parseFloat(weightInput.value) > 0;
        const hasDimensions =
            parseFloat(heightInput.value) > 0 &&
            parseFloat(widthInput.value) > 0 &&
            parseFloat(depthInput.value) > 0;
        const hasMarker = !!marker;
        return hasSubstance && (hasWeight || hasDimensions) && hasMarker;
    }

    function updateCalculateButtonState() {
        calculateButton.disabled = !isRequiredInfoPresent();
    }

    // ===== Основной расчёт =====
    function calculateExplosion() {
        if (!isRequiredInfoPresent()) {
            showAlert('Пожалуйста, заполните все необходимые данные перед расчётом.', 'warning');
            return;
        }
        const result = calculateTrotylEquivalent();
        if (!result) {
            showAlert('Ошибка расчёта. Проверьте введённые данные.', 'danger');
            return;
        }
        const { trotylOunces, trotylPounds, weightGrams } = result;
        trotylEquivalentInput.value = `${trotylOunces.toFixed(2)} oz (${trotylPounds.toFixed(2)} lb)`;

        // R = 150 · W^(1/6) — масштабированный для РП радиус.
        const trotylKg = (trotylOunces * GRAMS_PER_OUNCE) / 1000;
        const evacuationFeet = 150 * Math.pow(trotylKg, 1 / 6) * M_TO_FEET;
        const evacuationMapUnits = evacuationFeet / GAME_SCALE;

        displayZonesOnMap(evacuationMapUnits, evacuationFeet);

        const substance = getSelectedSubstance();
        addToHistory({
            substanceName: substance ? substance.substance_name : '—',
            formula: substance ? substance.formula : '',
            category: substance ? substance.category : '',
            weight: weightGrams,
            trotylEquivalent: trotylOunces,
            evacuationRadius: evacuationMapUnits,
            evacuationFeet: evacuationFeet,
            date: new Date().toLocaleString('ru-RU')
        });
        renderHistoryTable();
        showAlert('Расчёт выполнен. Зоны безопасности отображены на карте.', 'success');
    }

    function calculateTrotylEquivalent() {
        const substance = getSelectedSubstance();
        if (!substance) return null;

        const weight = parseFloat(weightInput.value) || 0;
        const height = parseFloat(heightInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const depth = parseFloat(depthInput.value) || 0;

        if (!weight && (!height || !width || !depth)) return null;

        // Размеры приводим к сантиметрам — плотность хранится в г/см³.
        const dimUnit = dimensionUnitSelect.value;
        const toCm = (v) => (dimUnit === 'inch' ? v * CM_PER_INCH : v);
        const volumeCm3 = toCm(height) * toCm(width) * toCm(depth);
        const calculatedWeightGrams = volumeCm3 * substance.density;

        // Вес приводим к граммам.
        const weightGramsRaw = weightUnitSelect.value === 'oz'
            ? weight * GRAMS_PER_OUNCE
            : weight;

        const finalGrams = weight > 0 ? weightGramsRaw : calculatedWeightGrams;
        const trotylGrams = substance.tnt_equivalent * finalGrams;
        const trotylOunces = trotylGrams / GRAMS_PER_OUNCE;
        const trotylPounds = trotylOunces / 16;

        return {
            trotylOunces,
            trotylPounds,
            weightGrams: finalGrams
        };
    }

    // ===== Карта =====
    function displayZonesOnMap(evacuationRadius, evacuationFeet) {
        if (!marker) return;
        const center = marker.getLatLng();

        if (evacuationCircle) map.removeLayer(evacuationCircle);
        if (radioCircle) map.removeLayer(radioCircle);

        evacuationCircle = L.circle(center, {
            color: '#dc3545',
            fillColor: '#dc3545',
            fillOpacity: 0.3,
            radius: evacuationRadius
        }).addTo(map);

        // Для повторного перерисовывания (при переключении радиозоны) сохраняем
        // исходное значение в футах прямо на слое.
        if (typeof evacuationFeet === 'number') {
            evacuationCircle._evacuationFeet = evacuationFeet;
        }
        const feetForTooltip = evacuationCircle._evacuationFeet || (evacuationRadius * GAME_SCALE);
        evacuationCircle.bindTooltip(
            `Зона эвакуации: ${feetForTooltip.toFixed(2)} ft`,
            { permanent: true, direction: 'right', className: 'fw-bold' }
        );

        if (radioZoneCheckbox.checked) {
            radioCircle = L.circle(center, {
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

    // ===== Конверсия единиц для подсказок =====
    function updateDimensionConversion() {
        const dimUnit = dimensionUnitSelect.value;
        const h = parseFloat(heightInput.value) || 0;
        const w = parseFloat(widthInput.value) || 0;
        const d = parseFloat(depthInput.value) || 0;

        let text;
        if (dimUnit === 'sm') {
            const fmt = (v) => (v / CM_PER_INCH).toFixed(2);
            text = `(${fmt(h)} in × ${fmt(w)} in × ${fmt(d)} in)`;
        } else {
            const fmt = (v) => (v * CM_PER_INCH).toFixed(2);
            text = `(${fmt(h)} см × ${fmt(w)} см × ${fmt(d)} см)`;
        }
        dimensionConversion.textContent = text;
        updateCalculateButtonState();
        updateTrotylEquivalentDisplay();
    }

    function updateWeightConversion() {
        const unit = weightUnitSelect.value;
        const v = parseFloat(weightInput.value) || 0;
        let text;
        if (unit === 'gram') {
            text = `(${(v / GRAMS_PER_OUNCE).toFixed(2)} oz)`;
        } else {
            text = `(${(v * GRAMS_PER_OUNCE).toFixed(2)} г)`;
        }
        weightConversion.textContent = text;
        updateCalculateButtonState();
        updateTrotylEquivalentDisplay();
    }

    function updateTrotylEquivalentDisplay() {
        const result = calculateTrotylEquivalent();
        if (result) {
            trotylEquivalentInput.value =
                `${result.trotylOunces.toFixed(2)} oz (${result.trotylPounds.toFixed(2)} lb)`;
        } else {
            trotylEquivalentInput.value = '';
        }
    }

    // ===== История =====
    function addToHistory(calculation) {
        calculationHistory.unshift({ id: Date.now(), ...calculation });
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

        const searchTerm = tableSearch.value.toLowerCase();
        const filtered = calculationHistory.filter(item =>
            (item.substanceName || '').toLowerCase().includes(searchTerm) ||
            (item.date || '').toLowerCase().includes(searchTerm)
        );

        filtered.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'bp-fade-in';
            row.innerHTML = `
                <td class="fw-bold">${index + 1}</td>
                <td>${escapeHtml(item.substanceName)}</td>
                <td>${Number(item.weight).toFixed(2)}</td>
                <td class="fw-bold text-primary">${Number(item.trotylEquivalent).toFixed(2)}</td>
                <td class="fw-bold text-danger">${Number(item.evacuationRadius).toFixed(2)}</td>
                <td><small class="text-muted">${escapeHtml(item.date)}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.id}" title="Удалить">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            row.addEventListener('click', function (e) {
                if (!e.target.closest('.delete-btn')) {
                    this.classList.toggle('is-selected');
                }
            });
            historyTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const id = parseInt(this.getAttribute('data-id'), 10);
                removeFromHistory(id);
            });
        });
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ===== Справочник боеприпасов =====
    function renderMunitionFilters() {
        if (!munitionFilters) return;
        const categories = ['all', ...Object.keys(munitionsCategoryLabels)];
        munitionFilters.innerHTML = categories.map(cat => {
            const label = cat === 'all' ? 'Все' : munitionsCategoryLabels[cat];
            const count = cat === 'all'
                ? munitionsData.length
                : munitionsData.filter(m => m.category === cat).length;
            const active = cat === activeMunitionCategory ? ' is-active' : '';
            return `<button type="button" class="bp-chip${active}" data-cat="${cat}">
                        <span>${escapeHtml(label)}</span>
                        <span class="bp-chip-count">${count}</span>
                    </button>`;
        }).join('');
        munitionFilters.querySelectorAll('.bp-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                activeMunitionCategory = chip.getAttribute('data-cat');
                renderMunitionFilters();
                renderMunitions();
            });
        });
    }

    function munitionMatches(m, q) {
        if (!q) return true;
        const hay = [
            m.name, m.full_name, m.filler_note, m.origin,
            munitionsCategoryLabels[m.category] || ''
        ].join(' ').toLowerCase();
        return hay.includes(q);
    }

    function formatMass(g) {
        if (g >= 1000) return `${(g / 1000).toFixed(g >= 10000 ? 0 : 2)} кг`;
        return `${g} г`;
    }

    function renderMunitions() {
        if (!munitionsGrid) return;
        const q = (munitionSearch?.value || '').trim().toLowerCase();
        const filtered = munitionsData.filter(m =>
            (activeMunitionCategory === 'all' || m.category === activeMunitionCategory) &&
            munitionMatches(m, q)
        );

        munitionsCount.textContent = filtered.length;

        if (filtered.length === 0) {
            munitionsGrid.innerHTML = '';
            munitionsEmpty.style.display = 'block';
            return;
        }
        munitionsEmpty.style.display = 'none';

        munitionsGrid.innerHTML = filtered.map((m, idx) => {
            const explosive = explosivesData.find(e => e.id === m.explosive_id);
            const explosiveName = explosive ? explosive.substance_name : '—';
            const tntEq = explosive
                ? ((explosive.tnt_equivalent * m.filler_grams)).toFixed(0)
                : '—';
            const tag = `M${String(idx + 1).padStart(2, '0')}`;
            const eff = m.effective_m
                ? `<div class="bp-mun-row"><span>R эфф.</span><span class="fw-semibold">${m.effective_m} м</span></div>`
                : '';
            const delay = m.delay_sec
                ? `<div class="bp-mun-row"><span>Задержка</span><span class="fw-semibold">${m.delay_sec} с</span></div>`
                : '';
            return `
                <article class="bp-mun-card">
                    <header class="bp-mun-head">
                        <span class="bp-mun-tag">${tag}</span>
                        <div class="bp-mun-title-wrap">
                            <h3 class="bp-mun-title">${escapeHtml(m.name)}</h3>
                            <span class="bp-mun-sub">${escapeHtml(m.full_name)}</span>
                        </div>
                    </header>
                    <div class="bp-mun-meta">
                        <span class="badge">${escapeHtml(munitionsCategoryLabels[m.category] || m.category)}</span>
                        <span class="badge">${escapeHtml(m.origin || '—')}</span>
                    </div>
                    <div class="bp-mun-body">
                        <div class="bp-mun-row"><span>ВВ</span><span class="fw-semibold">${escapeHtml(m.filler_note || explosiveName)}</span></div>
                        <div class="bp-mun-row"><span>Масса ВВ</span><span class="fw-semibold">${formatMass(m.filler_grams)}</span></div>
                        <div class="bp-mun-row"><span>Масса итого</span><span class="fw-semibold">${formatMass(m.total_grams)}</span></div>
                        <div class="bp-mun-row"><span>TNT экв.</span><span class="fw-semibold">${formatMass(Number(tntEq))}</span></div>
                        ${eff}
                        ${delay}
                    </div>
                    <p class="bp-mun-note">${escapeHtml(m.note || '')}</p>
                    <footer class="bp-mun-foot">
                        <button type="button" class="bp-btn bp-btn-primary bp-mun-use" data-id="${m.id}">
                            <span class="bp-btn-bracket">[</span>
                            В расчёт
                            <span class="bp-btn-bracket">]</span>
                        </button>
                    </footer>
                </article>`;
        }).join('');

        munitionsGrid.querySelectorAll('.bp-mun-use').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                applyMunition(id);
            });
        });
    }

    function applyMunition(munitionId) {
        const m = munitionsData.find(x => x.id === munitionId);
        if (!m) return;
        const explosive = explosivesData.find(e => e.id === m.explosive_id);
        if (!explosive) {
            showAlert('Не найдено вещество для этого боеприпаса.', 'warning');
            return;
        }
        contentTypeSelect.value = String(explosive.id);
        weightUnitSelect.value = 'gram';
        weightInput.value = m.filler_grams;
        heightInput.value = '';
        widthInput.value = '';
        depthInput.value = '';
        dimensionConversion.textContent = '';

        updateSubstanceInfo();
        updateWeightConversion();
        updateCalculateButtonState();
        updateTrotylEquivalentDisplay();

        document.getElementById('calculator')
            .scrollIntoView({ behavior: 'smooth', block: 'start' });

        showAlert(`Параметры «${m.name}» подставлены в калькулятор. Поставьте маркер на карту и нажмите «Рассчитать».`, 'success');
    }

    function removeFromHistory(id) {
        calculationHistory = calculationHistory.filter(item => item.id !== id);
        localStorage.setItem('explosionHistory', JSON.stringify(calculationHistory));
        renderHistoryTable();
        showAlert('Запись удалена из истории', 'info');
    }

    function clearHistory() {
        if (calculationHistory.length === 0) return;
        if (confirm('Вы уверены, что хотите очистить всю историю расчётов?')) {
            calculationHistory = [];
            localStorage.removeItem('explosionHistory');
            renderHistoryTable();
            showAlert('История расчётов очищена', 'info');
        }
    }

    // ===== Экспорт CSV =====
    function csvEscape(value) {
        const s = String(value ?? '');
        if (/[",\n;]/.test(s)) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    }

    function exportToCSV() {
        if (calculationHistory.length === 0) {
            showAlert('Нет данных для экспорта', 'warning');
            return;
        }
        const headers = [
            '№', 'Тип вещества', 'Формула', 'Категория',
            'Вес (г)', 'Тротил. экв. (oz)', 'Радиус эвакуации (карта)',
            'Радиус эвакуации (ft)', 'Дата расчёта'
        ];
        const rows = [headers.map(csvEscape).join(',')];
        calculationHistory.forEach((item, index) => {
            rows.push([
                index + 1,
                item.substanceName,
                item.formula || '',
                explosiveCategoryLabels[item.category] || item.category || '',
                Number(item.weight).toFixed(2),
                Number(item.trotylEquivalent).toFixed(2),
                Number(item.evacuationRadius).toFixed(2),
                item.evacuationFeet != null ? Number(item.evacuationFeet).toFixed(2) : '',
                item.date
            ].map(csvEscape).join(','));
        });
        // BOM, чтобы Excel корректно понимал UTF-8.
        const csvContent = '﻿' + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `расчёты_взрывотехника_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showAlert('Данные экспортированы в CSV', 'success');
    }

    function highlightRecentCalculations() {
        const rows = document.querySelectorAll('#historyTableBody tr');
        rows.forEach(row => row.classList.remove('is-highlighted'));
        const count = Math.min(5, rows.length);
        for (let i = 0; i < count; i++) {
            rows[i].classList.add('is-highlighted');
        }
        setTimeout(() => {
            document.querySelectorAll('#historyTableBody tr').forEach(row => {
                row.classList.remove('is-highlighted');
            });
        }, 5000);
    }

    // ===== Сброс формы =====
    function clearForm() {
        contentTypeSelect.value = '';
        heightInput.value = '';
        widthInput.value = '';
        depthInput.value = '';
        weightInput.value = '';
        trotylEquivalentInput.value = '';
        dimensionUnitSelect.value = 'sm';
        weightUnitSelect.value = 'gram';
        dimensionConversion.textContent = '';
        weightConversion.textContent = '';
        radioZoneCheckbox.checked = true;

        if (evacuationCircle) { map.removeLayer(evacuationCircle); evacuationCircle = null; }
        if (radioCircle) { map.removeLayer(radioCircle); radioCircle = null; }
        if (marker) { map.removeLayer(marker); marker = null; }

        updateSubstanceInfo();
        updateCalculateButtonState();
        updateTrotylEquivalentDisplay();
        showAlert('Форма очищена', 'info');
    }

    // ===== Уведомления =====
    function showAlert(message, type) {
        const existing = document.querySelector('.alert-dismissible');
        if (existing) existing.remove();

        const isError = type === 'danger' || type === 'warning';
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alert.style.zIndex = '1050';
        // role=alert / aria-live="assertive" — для предупреждений и ошибок,
        // role=status / aria-live="polite" — для информационных сообщений.
        alert.setAttribute('role', isError ? 'alert' : 'status');
        alert.setAttribute('aria-live', isError ? 'assertive' : 'polite');
        alert.setAttribute('aria-atomic', 'true');
        alert.innerHTML = `
            ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
        }, 5000);
    }

    // ===== Слушатели =====
    function setupEventListeners() {
        contentTypeSelect.addEventListener('change', function () {
            updateSubstanceInfo();
            updateCalculateButtonState();
            updateTrotylEquivalentDisplay();
        });

        [heightInput, widthInput, depthInput].forEach(el =>
            el.addEventListener('input', updateDimensionConversion));
        dimensionUnitSelect.addEventListener('change', updateDimensionConversion);

        weightInput.addEventListener('input', updateWeightConversion);
        weightUnitSelect.addEventListener('change', updateWeightConversion);

        radioZoneCheckbox.addEventListener('change', function () {
            if (evacuationCircle && marker) {
                displayZonesOnMap(evacuationCircle.getRadius(), evacuationCircle._evacuationFeet);
            }
        });

        calculateButton.addEventListener('click', calculateExplosion);
        clearFormButton.addEventListener('click', clearForm);
        themeToggle.addEventListener('click', toggleTheme);

        clearTableButton.addEventListener('click', clearHistory);
        exportTableButton.addEventListener('click', exportToCSV);
        highlightRecentButton.addEventListener('click', highlightRecentCalculations);
        tableSearch.addEventListener('input', renderHistoryTable);

        if (munitionSearch) {
            munitionSearch.addEventListener('input', renderMunitions);
        }

        document.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && isRequiredInfoPresent()) {
                calculateExplosion();
            }
        });
    }

    initApp();
});
