import { getDatabase } from '../lib/server/db.js';
import { getTimes } from 'suncalc';

// The snow1g point endpoint takes the park coordinates in the URL (longitude 14.20, latitude 60.95).
const WEATHER_URL =
  'https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/14.20/lat/60.95/data.json';
const TIME_ZONE = 'Europe/Stockholm';
const PARK_LATITUDE = 60.95;
const PARK_LONGITUDE = 14.2;

// snow1g returns timeSeries entries with `time` and flat `data` fields; 9999 marks missing values.
/**
 * @typedef {{
 *   air_temperature?: number,
 *   wind_speed?: number,
 *   precipitation_amount_mean?: number,
 *   symbol_code?: number
 * }} ForecastData
 * @typedef {{ time: string, data: ForecastData }} ForecastTimeStep
 * @typedef {{ time: string, label: string, temperature: number | null, symbolCode: number | null }} ForecastHour
 * @typedef {{ date: string, label: string, min: number | null, max: number | null, symbolCode: number | null }} ForecastDay
 */

/** @param {Date} date */
function dateKeyInStockholm(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${values.year}-${values.month}-${values.day}`;
}

/** @param {string} dateKey @param {number} days */
function addDays(dateKey, days) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().slice(0, 10);
}

/** @param {Date} date */
function hourInStockholm(date) {
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    hourCycle: 'h23'
  }).format(date);

  return Number(hour);
}

/** @param {ForecastData} data @param {keyof ForecastData} name */
function dataValue(data, name) {
  const value = data[name];

  return typeof value === 'number' && Number.isFinite(value) && value !== 9999 ? value : null;
}

/** @param {ForecastData} data */
function symbolValue(data) {
  const value = dataValue(data, 'symbol_code');

  return value !== null && Number.isInteger(value) && value >= 1 && value <= 27 ? value : null;
}

/** @param {Date} date */
function isNightAt(date) {
  const { sunrise, sunset } = getTimes(date, PARK_LATITUDE, PARK_LONGITUDE);
  // SMHI's symbol_code describes conditions but not whether the forecast hour is day or night.
  return sunrise instanceof Date && sunset instanceof Date
    ? date < sunrise || date > sunset
    : true;
}

/** @param {Date} date */
function sunMarkerLabel(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/** @param {ForecastTimeStep[]} timeSeries */
function buildForecast(timeSeries) {
  const now = new Date();
  const today = dateKeyInStockholm(now);
  /** @type {ForecastDay[]} */
  const days = Array.from({ length: 4 }, (_, index) => {
    const date = addDays(today, index);

    return {
      date,
      label:
        index === 0
          ? 'Today'
          : new Intl.DateTimeFormat('en-GB', {
              timeZone: 'UTC',
              weekday: 'short'
            }).format(new Date(`${date}T12:00:00Z`)),
      min: null,
      max: null,
      symbolCode: null
    };
  });
  const daysByDate = new Map(days.map((day) => [day.date, day]));
  /** @type {Array<{ timestamp: Date, temperature: number | null, symbolCode: number | null }>} */
  const todaySteps = [];
  /** @type {Array<{ timestamp: Date, temperature: number | null, symbolCode: number | null }>} */
  const forecastSteps = [];
  /** @type {Map<string, Array<{ timestamp: Date, temperature: number | null, symbolCode: number | null }>>} */
  const stepsByDate = new Map(days.map((day) => [day.date, []]));

  for (const timeStep of timeSeries) {
    // snow1g uses `time` and a flat `data` object rather than `validTime` and `parameters`.
    // Its symbol_code values (1-27) use SMHI's existing weather-symbol codes.
    if (typeof timeStep?.time !== 'string' || !timeStep.data || typeof timeStep.data !== 'object') {
      continue;
    }

    const forecastTime = new Date(timeStep.time);
    if (Number.isNaN(forecastTime.getTime())) continue;

    const date = dateKeyInStockholm(forecastTime);
    const day = daysByDate.get(date);
    if (!day) continue;

    const temperature = dataValue(timeStep.data, 'air_temperature');
    const symbolCode = symbolValue(timeStep.data);
    const steps = stepsByDate.get(date);
    const step = { timestamp: forecastTime, temperature, symbolCode };
    forecastSteps.push(step);
    steps?.push(step);
    if (date === today) todaySteps.push(step);

    if (temperature !== null) {
      day.min = day.min === null ? temperature : Math.min(day.min, temperature);
      day.max = day.max === null ? temperature : Math.max(day.max, temperature);
    }
  }

  for (const day of days) {
    const steps = stepsByDate.get(day.date) ?? [];
    const middayStep = steps.reduce((closest, step) => {
      return Math.abs(hourInStockholm(step.timestamp) - 12) <
        Math.abs(hourInStockholm(closest.timestamp) - 12)
        ? step
        : closest;
    }, steps[0]);
    day.symbolCode = middayStep?.symbolCode ?? steps.find((step) => step.symbolCode !== null)?.symbolCode ?? null;
  }

  if (!todaySteps.some((step) => step.temperature !== null) && !days.some((day) => day.max !== null)) {
    return null;
  }

  forecastSteps.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const currentStep = forecastSteps.reduce((closest, step) => {
    if (step.temperature === null) return closest;
    if (!closest || closest.temperature === null) return step;
    return Math.abs(step.timestamp.getTime() - now.getTime()) <
      Math.abs(closest.timestamp.getTime() - now.getTime())
      ? step
      : closest;
  }, /** @type {typeof todaySteps[number] | null} */ (null));

  const upcomingSteps = forecastSteps
    .filter(
      (step) =>
        step.timestamp.getTime() > now.getTime() &&
        step.timestamp.getTime() <= now.getTime() + 24 * 60 * 60 * 1000
    )
    .map((step) => ({
      time: step.timestamp.toISOString(),
      label: new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE,
        hour: '2-digit',
        minute: '2-digit'
      }).format(step.timestamp),
      temperature: step.temperature === null ? null : Math.round(step.temperature),
      symbolCode: step.symbolCode,
      isNight: isNightAt(step.timestamp)
    }));
  /** @type {Array<
   *   { type: 'hour', time: string, label: string, temperature: number | null, symbolCode: number | null, isNight: boolean } |
   *   { type: 'sunrise', time: string, label: string } |
   *   { type: 'sunset', time: string, label: string }
   * >} */
  const timeline = upcomingSteps.map((step) => ({ ...step, type: 'hour' }));
  const timelineStart = now.getTime();
  const timelineEnd = timelineStart + 24 * 60 * 60 * 1000;

  for (let offset = 0; offset <= 1; offset += 1) {
    const dateKey = addDays(today, offset);
    const { sunrise, sunset } = getTimes(
      new Date(`${dateKey}T12:00:00Z`),
      PARK_LATITUDE,
      PARK_LONGITUDE
    );

    const sunEvents = /** @type {Array<
     *   { type: 'sunrise', event: Date | null } |
     *   { type: 'sunset', event: Date | null }
     * >} */ ([
      { type: 'sunrise', event: sunrise instanceof Date ? sunrise : null },
      { type: 'sunset', event: sunset instanceof Date ? sunset : null }
    ]);

    for (const { type, event } of sunEvents) {
      if (!event || event.getTime() <= timelineStart || event.getTime() > timelineEnd) continue;

      timeline.push({
        type,
        time: event.toISOString(),
        label: `${type === 'sunrise' ? 'Sunrise' : 'Sunset'} ${sunMarkerLabel(event)}`
      });
    }
  }
  timeline.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return {
    current: currentStep && currentStep.temperature !== null
      ? {
          temperature: Math.round(currentStep.temperature),
          symbolCode: currentStep.symbolCode,
          isNight: isNightAt(currentStep.timestamp)
        }
      : null,
    timeline,
    days: days.slice(1).map(({ date, label, min, max, symbolCode }) => ({
      date,
      label,
      min: min === null ? null : Math.round(min),
      max: max === null ? null : Math.round(max),
      symbolCode
    }))
  };
}

// Read the trails on the server so database details stay private.
export async function load({ fetch }) {
  const sql = getDatabase();
  const [posts, weather] = await Promise.all([
    sql`
      SELECT slug, title, summary, body, created_at
      FROM posts
      WHERE type = 'trail'
      ORDER BY created_at DESC
    `,
    loadWeather(fetch)
  ]);

  return { posts, weather };
}

/** @param {typeof globalThis.fetch} fetch */
async function loadWeather(fetch) {
  let response;
  try {
    response = await fetch(WEATHER_URL, { signal: AbortSignal.timeout(8000) });
  } catch (error) {
    console.error('Unable to fetch the SMHI park forecast:', error);
    return null;
  }

  if (!response.ok) {
    console.error(`SMHI forecast request failed with HTTP ${response.status}.`);
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error('Unable to read the SMHI forecast response as JSON:', error);
    return null;
  }

  if (!Array.isArray(data?.timeSeries)) {
    console.error('SMHI forecast response did not contain a timeSeries array.');
    return null;
  }

  const forecast = buildForecast(data.timeSeries);
  if (!forecast) {
    console.error('SMHI forecast response contained no usable values for the next four days.');
  }

  return forecast;
}
