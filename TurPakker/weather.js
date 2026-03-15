// weather.js - Yr.no weather integration

const Weather = {
  API_BASE: 'https://api.met.no/weatherapi/locationforecast/2.0/compact',
  USER_AGENT: 'TurPakker/1.0 (https://github.com/janthemanheier/JanInc)',
  cache: {},

  /**
   * Fetch weather forecast for coordinates
   */
  async getForecast(lat, lon) {
    const cacheKey = `${lat},${lon}`;
    const cached = this.cache[cacheKey];
    if (cached && (Date.now() - cached.time) < 3600000) {
      return cached.data;
    }

    try {
      const url = `${this.API_BASE}?lat=${lat}&lon=${lon}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
        }
      });

      if (!response.ok) {
        throw new Error(`Yr.no API error: ${response.status}`);
      }

      const data = await response.json();
      this.cache[cacheKey] = { data, time: Date.now() };
      return data;
    } catch (e) {
      console.error('Weather fetch error:', e);
      return null;
    }
  },

  /**
   * Get forecast for specific dates
   */
  async getForecastForDates(lat, lon, startDate, endDate) {
    const forecast = await this.getForecast(lat, lon);
    if (!forecast || !forecast.properties || !forecast.properties.timeseries) {
      return null;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const timeseries = forecast.properties.timeseries;
    const filtered = timeseries.filter(entry => {
      const time = new Date(entry.time);
      return time >= start && time <= end;
    });

    if (filtered.length === 0) {
      // If dates are beyond forecast range, use latest available data
      return this._summarizeTimeseries(timeseries.slice(0, 24));
    }

    return this._summarizeTimeseries(filtered);
  },

  /**
   * Summarize timeseries data into daily forecasts
   */
  _summarizeTimeseries(timeseries) {
    const days = {};

    for (const entry of timeseries) {
      const date = entry.time.split('T')[0];
      const details = entry.data.instant.details;
      const next = entry.data.next_6_hours || entry.data.next_1_hours;

      if (!days[date]) {
        days[date] = {
          date,
          temps: [],
          winds: [],
          conditions: [],
          precipitation: 0,
        };
      }

      days[date].temps.push(details.air_temperature);
      days[date].winds.push(details.wind_speed);

      if (next && next.summary) {
        days[date].conditions.push(next.summary.symbol_code);
      }
      if (next && next.details && next.details.precipitation_amount) {
        days[date].precipitation += next.details.precipitation_amount;
      }
    }

    const result = [];
    for (const [date, data] of Object.entries(days)) {
      const minTemp = Math.min(...data.temps);
      const maxTemp = Math.max(...data.temps);
      const avgWind = data.winds.reduce((a, b) => a + b, 0) / data.winds.length;
      const maxWind = Math.max(...data.winds);

      // Most common condition
      const condCounts = {};
      data.conditions.forEach(c => { condCounts[c] = (condCounts[c] || 0) + 1; });
      const mainCondition = Object.entries(condCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

      result.push({
        date,
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        avgWind: Math.round(avgWind * 10) / 10,
        maxWind: Math.round(maxWind * 10) / 10,
        condition: mainCondition,
        precipitation: Math.round(data.precipitation * 10) / 10,
      });
    }

    return result;
  },

  /**
   * Get overall weather summary for packing suggestions
   */
  getWeatherSummary(dailyForecasts) {
    if (!dailyForecasts || dailyForecasts.length === 0) return null;

    const allTemps = dailyForecasts.flatMap(d => [d.minTemp, d.maxTemp]);
    const allWinds = dailyForecasts.map(d => d.maxWind);
    const allConditions = dailyForecasts.map(d => d.condition);

    return {
      temperature: Math.min(...allTemps),
      maxTemp: Math.max(...allTemps),
      wind: Math.max(...allWinds),
      condition: allConditions.join(','),
      days: dailyForecasts,
    };
  },

  /**
   * Get weather icon for condition code
   */
  getWeatherIcon(symbolCode) {
    if (!symbolCode) return '\u2601\uFE0F';
    const code = symbolCode.split('_')[0];
    const icons = {
      clearsky: '\u2600\uFE0F',
      fair: '\uD83C\uDF24\uFE0F',
      partlycloudy: '\u26C5',
      cloudy: '\u2601\uFE0F',
      fog: '\uD83C\uDF2B\uFE0F',
      rain: '\uD83C\uDF27\uFE0F',
      lightrain: '\uD83C\uDF26\uFE0F',
      heavyrain: '\uD83C\uDF27\uFE0F',
      sleet: '\uD83C\uDF28\uFE0F',
      snow: '\uD83C\uDF28\uFE0F',
      lightsnow: '\u2744\uFE0F',
      heavysnow: '\uD83C\uDF28\uFE0F',
      snowshowers: '\uD83C\uDF28\uFE0F',
      lightsnowshowers: '\u2744\uFE0F',
      heavysnowshowers: '\uD83C\uDF28\uFE0F',
      rainshowers: '\uD83C\uDF26\uFE0F',
      lightrainshowers: '\uD83C\uDF26\uFE0F',
      heavyrainshowers: '\uD83C\uDF27\uFE0F',
      sleetshowers: '\uD83C\uDF28\uFE0F',
    };
    return icons[code] || '\u2601\uFE0F';
  },

  /**
   * Get condition description in Norwegian
   */
  getConditionText(symbolCode) {
    if (!symbolCode) return 'Ukjent';
    const code = symbolCode.split('_')[0];
    const texts = {
      clearsky: 'Klart',
      fair: 'Lettskyet',
      partlycloudy: 'Delvis skyet',
      cloudy: 'Skyet',
      fog: 'T\u00E5ke',
      rain: 'Regn',
      lightrain: 'Lett regn',
      heavyrain: 'Kraftig regn',
      sleet: 'Sludd',
      snow: 'Sn\u00F8',
      lightsnow: 'Lett sn\u00F8',
      heavysnow: 'Kraftig sn\u00F8fall',
      snowshowers: 'Sn\u00F8byger',
      lightsnowshowers: 'Lette sn\u00F8byger',
      heavysnowshowers: 'Kraftige sn\u00F8byger',
      rainshowers: 'Regnbyger',
      lightrainshowers: 'Lette regnbyger',
      heavyrainshowers: 'Kraftige regnbyger',
      sleetshowers: 'Sluddbyger',
    };
    return texts[code] || symbolCode;
  },

  /**
   * Format date in Norwegian style
   */
  formatDate(dateStr) {
    const days = ['S\u00F8n', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'L\u00F8r'];
    const months = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    const d = new Date(dateStr + 'T12:00:00');
    return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]}`;
  }
};
