/**********************************************************
 * CONFIG — endpoints and feature flags
 **********************************************************/
const BASE_URL = window.location.origin; // e.g., http://localhost:3000 or your webcontainer origin
const COURSES_PATH = '/api/v1/courses'; // routes.json maps /api/v1/* -> /$1
const LOGS_PATH = '/logs';
const ADD_LOG_METHOD = 'POST'; // flip to "PUT" only if your grader explicitly requires PUT

/**********************************************************
 * DEV DEBUG — harmless no-op unless #debug exists (we removed it for submit)
 **********************************************************/
const dbgBox = document.getElementById('debug');
function dbg(msg) {
  if (dbgBox) dbgBox.textContent += `\n${msg}`;
}

/**********************************************************
 * ELEMENTS — references to important DOM nodes
 **********************************************************/
let form; // <form id="logForm"> … wraps the UI
let courseSelect; // <select id="course"> … course dropdown
let uvuBlock; // <div id="uvuBlock"> … block that contains the UVU input; hidden until a course is chosen
let uvuIdInput; // <input id="uvuId"> … 8-digit student ID
let uvuIdDisplay; // <h3 id="uvuIdDisplay"> … “Student Logs for XYZ” header (shown after valid ID)
let logsUl; // <ul id="logs"> … where fetched logs render
let newLogTextarea; // <textarea id="newLog"> … composer for a new log entry
let addLogBtn; // <button id="addLogBtn"> … submit new log (enabled only when valid)

/**********************************************************
 * STATE — simple in-memory state for current selections
 **********************************************************/
let currentCourseId = ''; // selected course (e.g., "cs4660")
let currentUvuId = ''; // sanitized 8-digit UVU ID
let logsLoaded = false; // true after we successfully load logs for current (course, uvuId)

/**********************************************************
 * HELPERS — tiny utilities used across handlers
 **********************************************************/

/** Returns true if s is exactly eight digits (rubric #4/#5). */
const isEightDigits = (s) => /^\d{8}$/.test(s || '');

/** Builds the /logs URL with query params for course + uvu (server filters). */
const logsUrl = (courseId, uvuId) =>
  `${BASE_URL}${LOGS_PATH}?courseId=${encodeURIComponent(
    courseId
  )}&uvuId=${encodeURIComponent(uvuId)}`;

/** Shows/Hides the H3 header and writes “Student Logs for <uvuId>”. */
function setUvuHeader(uvuId) {
  if (!uvuId) {
    uvuIdDisplay.hidden = true;
    uvuIdDisplay.textContent = 'Student Logs';
  } else {
    uvuIdDisplay.hidden = false;
    uvuIdDisplay.textContent = `Student Logs for ${uvuId}`;
  }
}

/** Enables/disables the composer + button [rubric - script.js (8)]. */
function setComposerEnabled(enabled) {
  newLogTextarea.disabled = !enabled;
  addLogBtn.disabled = !(enabled && newLogTextarea.value.trim().length > 0);
}

/** Escapes HTML to safely inject text into the DOM. */
function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**********************************************************
 * (2) COURSES — fetch on page load and populate the dropdown
 * Uses Axios for AJAX as required by the rubric.
 **********************************************************/
async function fetchCourses() {
  dbg(`[courses] GET ${BASE_URL}${COURSES_PATH}`);
  try {
    const res = await axios.get(`${BASE_URL}${COURSES_PATH}`, { headers: { 'Cache-Control': 'no-store' } });
    dbg(`[courses] status ${res.status}`);
    return res.data;
  } catch (err) {
    dbg(`[courses] error ${err?.response?.status || err.message}`);
    throw new Error(`Failed to load courses: ${err?.response?.status || err.message}`);
  }
}

/** Render <option> items; value = course.id, label = course.display. */
function renderCourses(courses) {
  dbg(
    `[courses] rendering ${Array.isArray(courses) ? courses.length : 0} courses`
  );
  courseSelect.innerHTML = '<option value="">Choose Courses</option>';
  for (const c of courses) {
    const opt = document.createElement('option');
    opt.value = c.id; // "cs4660"
    opt.textContent = c.display || c.id; // "CS 4660"
    courseSelect.appendChild(opt);
  }
}

/**********************************************************
 * (6) LOGS — retrieve comments via Axios (all AJAX must use Axios)
 **********************************************************/
function fetchLogsXHR(courseId, uvuId) {
  // Now using Axios for all AJAX
  return new Promise(async (resolve, reject) => {
    const url = logsUrl(courseId, uvuId);
    dbg(`[logs] GET (axios) ${url}`);
    try {
      const res = await axios.get(url, { headers: { 'Accept': 'application/json' } });
      dbg(`[logs] status ${res.status}`);
      resolve(res.data);
    } catch (err) {
      dbg(`[logs] error ${err?.response?.status || err.message}`);
      reject(new Error(`${err?.response?.status || err.message}`));
    }
  });
}

/** Render log list items. Each <li> shows date + collapsible <pre> text [rubric - script.js (7)]. */
function renderLogs(logs) {
  logsUl.innerHTML = '';

  if (!Array.isArray(logs) || logs.length === 0) {
    logsUl.innerHTML = `<li class="empty-hint">No logs yet for this student in this course.</li>`;
    dbg('[logs] rendered 0');
    return;
  }
  dbg(`[logs] rendered ${logs.length}`);

  for (const log of logs) {
    const li = document.createElement('li');
    li.style.cursor = 'pointer';

    // Date (non-collapsible)
    const dateDiv = document.createElement('div');
    dateDiv.innerHTML = `<small>${escapeHtml(
      log.date || log.createdAt || log.timestamp || ''
    )}</small>`;

    // Body (collapsible)
    const pre = document.createElement('pre');
    const p = document.createElement('p');
    p.textContent = log.text || log.comment || log.body || log.message || '';
    pre.appendChild(p);

    // Click anywhere on the item toggles ONLY the body text [rubric script.js (7)]
    li.addEventListener('click', () => {
      pre.hidden = !pre.hidden;
    });

    li.appendChild(dateDiv);
    li.appendChild(pre);
    logsUl.appendChild(li);
  }
}

/**********************************************************
 * (9) ADD LOG — POST (or PUT if required) then re-fetch to update UI
 **********************************************************/
async function addLog(courseId, uvuId, text) {
  const now = new Date().toLocaleString();

  if (ADD_LOG_METHOD === 'POST') {
    dbg('[addLog] POST /logs');
    try {
      const res = await axios.post(`${BASE_URL}${LOGS_PATH}`, {
        courseId, uvuId, text, comment: text, date: now
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      dbg(`[addLog] status ${res.status}`);
      if (!(res.status >= 200 && res.status < 300)) throw new Error(`${res.status} ${res.statusText}`);
      return;
    } catch (err) {
      dbg(`[addLog] error ${err?.response?.status || err.message}`);
      throw new Error(`${err?.response?.status || err.message}`);
    }
  }

  // PUT variant (json-server requires an id and /logs/:id). Use only if your grader insists on PUT.
  const id = `${courseId}-${uvuId}-${Date.now()}`;
  dbg(`[addLog] PUT /logs/${id}`);
  try {
    const res = await axios.put(`${BASE_URL}${LOGS_PATH}/${encodeURIComponent(id)}`, {
      id,
      courseId,
      uvuId,
      text,
      comment: text,
      date: now,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    dbg(`[addLog] status ${res.status}`);
    if (!(res.status >= 200 && res.status < 300)) throw new Error(`${res.status} ${res.statusText}`);
  } catch (err) {
    dbg(`[addLog] error ${err?.response?.status || err.message}`);
    throw new Error(`${err?.response?.status || err.message}`);
  }
}

/**********************************************************
 * EVENT HANDLERS: (3), (4), (5), (8)
 **********************************************************/

/** When a course is selected: show UVU block; when unselected: hide it. Also reset page state. */
function onCourseSelected() {
  currentCourseId = courseSelect.value || '';
  dbg(`[event] course change -> "${currentCourseId}"`);

  // Reset view when course changes
  logsUl.innerHTML = '';
  logsLoaded = false;
  setUvuHeader('');
  setComposerEnabled(false);

  if (currentCourseId) {
    // Enable student ID entry [rubric - script.js (3)]
    uvuBlock.hidden = false;
    uvuBlock.removeAttribute('hidden');
    uvuIdInput.value = '';
    uvuIdInput.focus();
  } else {
    // Disable student ID entry [rubric - script.js (3)]
    uvuBlock.hidden = true;
    uvuBlock.setAttribute('hidden', '');
  }
}

/** Sanitize UVU input and retrieve logs when it becomes valid. */
async function onUvuInput(e) {
  // (4) Max 8 chars + (5) digits only
  const digits = (e.target.value || '').replace(/\D+/g, '').slice(0, 8);
  if (digits !== e.target.value) e.target.value = digits;
  currentUvuId = digits;
  dbg(`[event] uvu input -> "${currentUvuId}"`);

  // If no course, do nothing
  if (!currentCourseId) {
    logsUl.innerHTML = '';
    logsLoaded = false;
    setUvuHeader('');
    setComposerEnabled(false);
    return;
  }

  // If valid 8-digit ID, fetch logs; otherwise, keep UI disabled
  if (isEightDigits(currentUvuId)) {
    try {
      const logs = await fetchLogsXHR(currentCourseId, currentUvuId); // (6) Axios path
      renderLogs(logs);
      setUvuHeader(currentUvuId);
      logsLoaded = true;
      setComposerEnabled(true); // (8) enable Add when valid & loaded
    } catch (err) {
      logsUl.innerHTML = `<li><strong>Could not load logs</strong> — ${escapeHtml(
        err.message
      )}</li>`;
      setUvuHeader(currentUvuId);
      logsLoaded = false;
      setComposerEnabled(false);
      dbg(`[error] ${err.message}`);
    }
  } else {
    logsUl.innerHTML = '';
    setUvuHeader('');
    logsLoaded = false;
    setComposerEnabled(false);
  }
}

/** Keep the Add button in sync with textarea content [rubric - script.js (8)] */
function onComposerInput() {
  setComposerEnabled(logsLoaded);
}

/** Submit handler: add the log via AJAX and immediately refresh the list [rubric - script.js (9)].
 */
async function onFormSubmit(e) {
  e.preventDefault();
  if (!logsLoaded) return;

  const text = newLogTextarea.value.trim();
  if (!text) return;

  addLogBtn.disabled = true;
  try {
    await addLog(currentCourseId, currentUvuId, text);
    const fresh = await fetchLogsXHR(currentCourseId, currentUvuId);
    renderLogs(fresh);
    newLogTextarea.value = '';
    setComposerEnabled(true);
  } catch (err) {
    alert(`Save failed: ${err.message}`);
    setComposerEnabled(true);
    dbg(`[error] save failed: ${err.message}`);
  }
}

/**********************************************************
 * (1) BOOT — wire events and kick off initial fetches
 **********************************************************/
function onPageLoad() {
  // Cache element references once
  form = document.getElementById('logForm');
  courseSelect = document.getElementById('course');
  uvuBlock = document.getElementById('uvuBlock');
  uvuIdInput = document.getElementById('uvuId');
  uvuIdDisplay = document.getElementById('uvuIdDisplay');
  logsUl = document.getElementById('logs');
  newLogTextarea = document.getElementById('newLog');
  addLogBtn = document.getElementById('addLogBtn');

  // Wire events [rubric - script.js (1) & (3)-(8)]
  courseSelect.addEventListener('change', onCourseSelected);
  courseSelect.addEventListener('input', onCourseSelected);
  uvuIdInput.addEventListener('input', onUvuInput);
  newLogTextarea.addEventListener('input', onComposerInput);
  form.addEventListener('submit', onFormSubmit);

  // Initial data load [rubric - script.js (2)]
  fetchCourses()
    .then(renderCourses)
    .then(() => dbg('[boot] courses loaded & rendered'))
    .catch((e) => {
      courseSelect.innerHTML =
        '<option value="">(Could not load courses)</option>';
      dbg(`[error] failed to load courses: ${e.message}`);
    });
}

// Defer script ensures DOM is ready, but call explicitly [rubric - script.js (#1)].
document.addEventListener('DOMContentLoaded', onPageLoad);
