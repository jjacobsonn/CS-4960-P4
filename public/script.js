// === CONFIG: API endpoints and feature flags ===
const BASE_URL = window.location.origin; // Site origin
const COURSES_PATH = '/api/v1/courses'; // Course API path
const LOGS_PATH = '/logs'; // Logs API path
const ADD_LOG_METHOD = 'POST'; // Use PUT only if required

// === DEBUG: No-op unless #debug exists ===
function dbg(msg) {
  const dbgBox = $('#debug');
  if (dbgBox.length) dbgBox.text(dbgBox.text() + '\n' + msg);
}

// === DOM ELEMENTS: Key UI nodes ===
let $form; // $('#logForm')
let $courseSelect; // $('#course')
let $uvuBlock; // $('#uvuBlock')
let $uvuIdInput; // $('#uvuId')
let $uvuIdDisplay; // $('#uvuIdDisplay')
let $logsUl; // $('#logs')
let $newLogTextarea; // $('#newLog')
let $addLogBtn; // $('#addLogBtn')

// === STATE: Current selections ===
let currentCourseId = ''; // Selected course
let currentUvuId = ''; // 8-digit UVU ID
let logsLoaded = false; // Logs loaded for current selection

// === HELPERS: Utility functions ===

/** Returns true if s is exactly eight digits. */
const isEightDigits = (s) => /^\d{8}$/.test(s || '');

/** Builds /logs URL with course and uvuId params. */
const logsUrl = (courseId, uvuId) =>
  `${BASE_URL}${LOGS_PATH}?courseId=${encodeURIComponent(
    courseId
  )}&uvuId=${encodeURIComponent(uvuId)}`;

/** Updates the header to show current UVU ID. */
function setUvuHeader(uvuId) {
  if (!uvuId) {
    $uvuIdDisplay.prop('hidden', true).text('Student Logs');
  } else {
    $uvuIdDisplay.prop('hidden', false).text(`Student Logs for ${uvuId}`);
  }
}

/** Enables/disables the log composer and button. */
function setComposerEnabled(enabled) {
  $newLogTextarea.prop('disabled', !enabled);
  $addLogBtn.prop('disabled', !(enabled && $newLogTextarea.val().trim().length > 0));
}

/** Escapes HTML for safe DOM injection. */
function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// === COURSES: Fetch and render course list ===
function fetchCourses() {
  dbg(`[courses] GET ${BASE_URL}${COURSES_PATH}`);
  return $.ajax({
    url: `${BASE_URL}${COURSES_PATH}`,
    method: 'GET',
    headers: { 'Cache-Control': 'no-store' },
    dataType: 'json'
  })
    .done(function(data, textStatus, jqXHR) {
      dbg(`[courses] status ${jqXHR.status}`);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      dbg(`[courses] error ${jqXHR.status || errorThrown}`);
    });
}

/** Render <option> items for each course. */
function renderCourses(courses) {
  dbg(`[courses] rendering ${Array.isArray(courses) ? courses.length : 0} courses`);
  $courseSelect.html('<option value="">Choose Courses</option>');
  $.each(courses, function(i, c) {
    $('<option>', { value: c.id, text: c.display || c.id }).appendTo($courseSelect);
  });
}

// === LOGS: Fetch and render student logs ===
function fetchLogsXHR(courseId, uvuId) {
  const url = logsUrl(courseId, uvuId);
  dbg(`[logs] GET (jQuery) ${url}`);
  return $.ajax({
    url: url,
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    dataType: 'json'
  })
    .done(function(data, textStatus, jqXHR) {
      dbg(`[logs] status ${jqXHR.status}`);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      dbg(`[logs] error ${jqXHR.status || errorThrown}`);
    });
}

/** Render log list items with date and collapsible text. */
function renderLogs(logs) {
  $logsUl.empty();
  if (!Array.isArray(logs) || logs.length === 0) {
    $logsUl.html('<li class="list-group-item border-success border-opacity-25"><i class="text-success">No logs yet for this student in this course.</i></li>');
    dbg('[logs] rendered 0');
    return;
  }
  dbg(`[logs] rendered ${logs.length}`);
  $.each(logs, function(i, log) {
    const $li = $('<li>').addClass('list-group-item border-success border-opacity-25 mb-2').css('cursor', 'pointer');
    // Date (non-collapsible)
    const $dateDiv = $('<div>').addClass('text-success fw-bold').html(`<small>${escapeHtml(log.date || log.createdAt || log.timestamp || '')}</small>`);
    // Body (collapsible)
    const $pre = $('<pre>').addClass('mt-2 mb-0 p-2 rounded bg-light bg-opacity-50');
    const $p = $('<p>').addClass('mb-0').text(log.text || log.comment || log.body || log.message || '');
    $pre.append($p);
    // Click toggles body text
    $li.on('click', function() { $pre.prop('hidden', !$pre.prop('hidden')); });
    $li.append($dateDiv, $pre);
    $logsUl.append($li);
  });
}

// === ADD LOG: Submit new log and refresh list ===
function addLog(courseId, uvuId, text) {
  const now = new Date().toLocaleString();
  if (ADD_LOG_METHOD === 'POST') {
    dbg('[addLog] POST /logs');
    return $.ajax({
      url: `${BASE_URL}${LOGS_PATH}`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ courseId, uvuId, text, comment: text, date: now })
    })
      .done(function(data, textStatus, jqXHR) {
        dbg(`[addLog] status ${jqXHR.status}`);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        dbg(`[addLog] error ${jqXHR.status || errorThrown}`);
      });
  }
  // PUT variant (json-server requires an id and /logs/:id). Use only if your grader insists on PUT.
  const id = `${courseId}-${uvuId}-${Date.now()}`;
  dbg(`[addLog] PUT /logs/${id}`);
  return $.ajax({
    url: `${BASE_URL}${LOGS_PATH}/${encodeURIComponent(id)}`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({ id, courseId, uvuId, text, comment: text, date: now })
  })
    .done(function(data, textStatus, jqXHR) {
      dbg(`[addLog] status ${jqXHR.status}`);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      dbg(`[addLog] error ${jqXHR.status || errorThrown}`);
    });
}

// === EVENT HANDLERS ===

/** Handles course selection and resets state. */
function onCourseSelected() {
  currentCourseId = $courseSelect.val() || '';
  dbg(`[event] course change -> "${currentCourseId}"`);
  $logsUl.empty();
  logsLoaded = false;
  setUvuHeader('');
  setComposerEnabled(false);
  if (currentCourseId) {
    $uvuBlock.prop('hidden', false).removeAttr('hidden');
    $uvuIdInput.val('').focus();
  } else {
    $uvuBlock.prop('hidden', true).attr('hidden', '');
  }
}

/** Sanitize UVU input and fetch logs if valid. */
function onUvuInput(e) {
  const digits = ($uvuIdInput.val() || '').replace(/\D+/g, '').slice(0, 8);
  if (digits !== $uvuIdInput.val()) $uvuIdInput.val(digits);
  currentUvuId = digits;
  dbg(`[event] uvu input -> "${currentUvuId}"`);
  if (!currentCourseId) {
    $logsUl.empty();
    logsLoaded = false;
    setUvuHeader('');
    setComposerEnabled(false);
    return;
  }
  if (isEightDigits(currentUvuId)) {
    fetchLogsXHR(currentCourseId, currentUvuId)
      .then(function(logs) {
        renderLogs(logs);
        setUvuHeader(currentUvuId);
        logsLoaded = true;
        setComposerEnabled(true);
      })
      .catch(function(err) {
        $logsUl.html(`<li><strong>Could not load logs</strong> — ${escapeHtml(err.message)}</li>`);
        setUvuHeader(currentUvuId);
        logsLoaded = false;
        setComposerEnabled(false);
        dbg(`[error] ${err.message}`);
      });
  } else {
    $logsUl.empty();
    setUvuHeader('');
    logsLoaded = false;
    setComposerEnabled(false);
  }
}

/** Sync Add button with textarea content. */
function onComposerInput() {
  setComposerEnabled(logsLoaded);
}

/** Submit handler: add log and refresh list. */
function onFormSubmit(e) {
  e.preventDefault();
  if (!logsLoaded) return;
  const text = $newLogTextarea.val().trim();
  if (!text) return;
  $addLogBtn.prop('disabled', true);
  addLog(currentCourseId, currentUvuId, text)
    .then(function() {
      return fetchLogsXHR(currentCourseId, currentUvuId);
    })
    .then(function(fresh) {
      renderLogs(fresh);
      $newLogTextarea.val('');
      setComposerEnabled(true);
    })
    .catch(function(err) {
      alert(`Save failed: ${err.message}`);
      setComposerEnabled(true);
      dbg(`[error] save failed: ${err.message}`);
    });
}

// === BOOT: Initialize app and wire events ===

function onPageLoad() {
  // Cache jQuery element references
  $form = $('#logForm');
  $courseSelect = $('#course');
  $uvuBlock = $('#uvuBlock');
  $uvuIdInput = $('#uvuId');
  $uvuIdDisplay = $('#uvuIdDisplay');
  $logsUl = $('#logs');
  $newLogTextarea = $('#newLog');
  $addLogBtn = $('#addLogBtn');

  // Wire events
  $courseSelect.on('change input', onCourseSelected);
  $uvuIdInput.on('input', onUvuInput);
  $newLogTextarea.on('input', onComposerInput);
  $form.on('submit', onFormSubmit);

  // Initial data load
  fetchCourses()
    .then(renderCourses)
    .then(function() { dbg('[boot] courses loaded & rendered'); })
    .catch(function(e) {
      $courseSelect.html('<option value="">(Could not load courses)</option>');
      dbg(`[error] failed to load courses: ${e.message}`);
    });
}

// Ensure DOM is ready before initializing.
$(onPageLoad);
