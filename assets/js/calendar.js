/* ==========================================================================
   Queenreal's Beauty Stop — calendar.js
   A real, functional month calendar + time-of-day picker for requesting an
   appointment. This is a scheduling PREFERENCE tool, not a live booking
   system: there is no backend confirming real-time availability, so the
   selected date/time is written into the enquiry form's hidden "preferred"
   field, which is then sent via the existing mailto enquiry flow for the
   business to confirm manually. No availability or payment is implied.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.getElementById('apptCalendar');
  if (!root) return;

  var hiddenInput = document.getElementById('preferred');
  var summaryEl = root.querySelector('.cal-summary');
  var monthLabel = root.querySelector('.cal-month-label');
  var grid = root.querySelector('.cal-grid');
  var prevBtn = root.querySelector('.cal-prev');
  var nextBtn = root.querySelector('.cal-next');
  var slotButtons = root.querySelectorAll('.cal-slot');

  var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();
  var selectedDate = null;
  var selectedSlot = null;

  function formatSelectedDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function updateHiddenField() {
    if (!hiddenInput) return;
    if (selectedDate && selectedSlot) {
      hiddenInput.value = formatSelectedDate(selectedDate) + ' — ' + selectedSlot;
    } else if (selectedDate) {
      hiddenInput.value = formatSelectedDate(selectedDate);
    } else {
      hiddenInput.value = '';
    }
  }

  function updateSummary() {
    if (!summaryEl) return;
    if (selectedDate && selectedSlot) {
      summaryEl.textContent = 'Requesting: ' + formatSelectedDate(selectedDate) + ', ' + selectedSlot;
      summaryEl.classList.add('is-active');
    } else if (selectedDate) {
      summaryEl.textContent = formatSelectedDate(selectedDate) + ' — now pick a time of day below';
      summaryEl.classList.add('is-active');
    } else {
      summaryEl.textContent = 'Select a date to request your preferred appointment time';
      summaryEl.classList.remove('is-active');
    }
  }

  function renderGrid() {
    monthLabel.textContent = MONTH_NAMES[viewMonth] + ' ' + viewYear;
    grid.innerHTML = '';

    DAY_LABELS.forEach(function (d) {
      var cell = document.createElement('span');
      cell.className = 'cal-weekday';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    var firstOfMonth = new Date(viewYear, viewMonth, 1);
    var startOffset = firstOfMonth.getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (var i = 0; i < startOffset; i++) {
      var blank = document.createElement('span');
      blank.className = 'cal-day cal-day--empty';
      grid.appendChild(blank);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var date = new Date(viewYear, viewMonth, day);
      date.setHours(0, 0, 0, 0);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = String(day);

      var isPast = date < today;
      if (isPast) {
        btn.disabled = true;
        btn.classList.add('is-disabled');
      } else {
        btn.addEventListener('click', function (d, el) {
          return function () {
            selectedDate = d;
            grid.querySelectorAll('.cal-day.is-selected').forEach(function (n) { n.classList.remove('is-selected'); });
            el.classList.add('is-selected');
            updateSummary();
            updateHiddenField();
          };
        }(date, btn));
      }

      if (date.getTime() === today.getTime()) btn.classList.add('is-today');
      if (selectedDate && date.getTime() === selectedDate.getTime()) btn.classList.add('is-selected');

      grid.appendChild(btn);
    }

    prevBtn.disabled = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
  }

  prevBtn.addEventListener('click', function () {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderGrid();
  });
  nextBtn.addEventListener('click', function () {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderGrid();
  });

  slotButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectedSlot = btn.getAttribute('data-slot');
      slotButtons.forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      updateSummary();
      updateHiddenField();
    });
  });

  renderGrid();
  updateSummary();
})();
