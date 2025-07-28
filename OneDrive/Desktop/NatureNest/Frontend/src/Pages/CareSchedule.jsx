import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarReminders from './CalendarReminders';

function CareSchedule() {
  const [reminders, setReminders] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherReminder, setWeatherReminder] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const fetchWeather = async () => {
    try {
      console.log('🌤️ Starting weather fetch...');
      setWeatherLoading(true);
      setWeatherError(null);
      
      // Check API key
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.error('❌ OpenWeather API key not found in environment variables');
        setWeatherError('Weather API key not configured');
        setWeatherReminder(null);
        return;
      }
      console.log('✅ API key found');

      // Check geolocation support
      if (!navigator.geolocation) {
        console.error('❌ Geolocation not supported by this browser');
        setWeatherError('Geolocation not supported');
        setWeatherReminder(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('✅ Geolocation success:', { latitude, longitude });

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            console.log('🌐 Making API call...');

            const res = await axios.get(url);
            const data = res.data;
            
            console.log('✅ Weather API response received');
            console.log('📊 Full response:', data);

            // Validate response structure
            if (!data || !data.weather || !data.weather[0] || !data.main) {
              console.error('❌ Invalid API response structure');
              setWeatherError('Invalid weather data received');
              setWeatherReminder(null);
              return;
            }

            const main = data.weather[0].main;
            const description = data.weather[0].description;
            const temp = data.main.temp;
            const humidity = data.main.humidity;

            console.log('🌤️ Weather details:', { 
              main, 
              description, 
              temp: `${temp}°C`, 
              humidity: `${humidity}%`
            });

            const today = new Date().toISOString().split("T")[0];

            // Enhanced weather condition logic
            if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') {
              const reminder = {
                title: `${description} expected – skip watering!`,
                date: today,
                type: "weather",
                _id: "weather-rain",
                condition: "rain",
                temperature: temp,
                humidity: humidity
              };
              console.log('🌧️ Rain reminder created:', reminder);
              setWeatherReminder(reminder);
              
            } else if (temp > 30) {
              const reminder = {
                title: `Hot day (${temp}°C) – water your plants early and provide shade!`,
                date: today,
                type: "weather",
                _id: "weather-heat",
                condition: "sunny",
                temperature: temp,
                humidity: humidity
              };
              console.log('☀️ Heat reminder created:', reminder);
              setWeatherReminder(reminder);
              
            } else if (temp < 5) {
              const reminder = {
                title: `Cold day (${temp}°C) – protect plants from frost!`,
                date: today,
                type: "weather",
                _id: "weather-cold",
                condition: "cloudy",
                temperature: temp,
                humidity: humidity
              };
              console.log('🥶 Cold reminder created:', reminder);
              setWeatherReminder(reminder);
              
            } else if (humidity < 30) {
              const reminder = {
                title: `Low humidity (${humidity}%) – consider misting your plants!`,
                date: today,
                type: "weather",
                _id: "weather-dry",
                condition: "sunny",
                temperature: temp,
                humidity: humidity
              };
              console.log('🏜️ Dry air reminder created:', reminder);
              setWeatherReminder(reminder);
              
            } else {
              console.log('ℹ️ Normal weather conditions, no special reminder needed');
              setWeatherReminder(null);
            }

          } catch (apiError) {
            console.error('❌ Weather API error:', {
              message: apiError.message,
              response: apiError.response?.data,
              status: apiError.response?.status
            });
            
            setWeatherError(`Weather API error: ${apiError.response?.data?.message || apiError.message}`);
            
            // Set error reminder
            setWeatherReminder({
              title: "Weather service unavailable",
              date: new Date().toISOString().split("T")[0],
              type: "weather",
              _id: "weather-error",
              condition: "error"
            });
          }
        },
        (geoError) => {
          console.error('❌ Geolocation error:', {
            code: geoError.code,
            message: geoError.message
          });
          
          let errorMessage = 'Location access denied';
          switch(geoError.code) {
            case 1:
              errorMessage = 'Location access denied by user';
              break;
            case 2:
              errorMessage = 'Location information unavailable';
              break;
            case 3:
              errorMessage = 'Location request timeout';
              break;
          }
          
          setWeatherError(errorMessage);
          
          // Set location error reminder
          setWeatherReminder({
            title: "Unable to get location for weather updates",
            date: new Date().toISOString().split("T")[0],
            type: "weather",
            _id: "weather-location-error",
            condition: "error"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 300000 // 5 minutes
        }
      );

    } catch (err) {
      console.error("❌ Weather fetch failed:", err.message);
      setWeatherError(`Weather fetch failed: ${err.message}`);
      setWeatherReminder(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchReminders = async (monthDate = new Date()) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No auth token found');
        return;
      }

      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      const dayStartUTC = new Date(Date.UTC(startOfMonth.getFullYear(), startOfMonth.getMonth(), startOfMonth.getDate(), 0, 0, 0));
      const dayEndUTC = new Date(Date.UTC(endOfMonth.getFullYear(), endOfMonth.getMonth(), endOfMonth.getDate() + 1, 0, 0, 0));

      console.log('📅 Fetching reminders for month:', {
        start: dayStartUTC.toISOString(),
        end: dayEndUTC.toISOString()
      });

      const res = await axios.get(
        `http://localhost:5000/api/reminders?start=${dayStartUTC.toISOString()}&end=${dayEndUTC.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Reminders fetched:', res.data.length);
      setReminders(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch reminders:', err.message);
      setReminders([]);
    }
  };

  const onDateSelect = (date) => {
    console.log('📅 Date selected:', date);
    setSelectedDate(date);
  };

  const onActiveStartDateChange = ({ activeStartDate }) => {
    console.log('📅 Month changed:', activeStartDate);
    setCurrentMonth(activeStartDate);
    fetchReminders(activeStartDate);
  };

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No auth token found');
        return;
      }

      console.log('📋 Fetching care schedules...');
      const res = await axios.get('http://localhost:5000/api/careschedule', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Schedules fetched:', res.data.length);
      setSchedules(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch care schedules:', err.message);
      setSchedules([]);
    }
  };

  useEffect(() => {
    console.log('🚀 CareSchedule component mounted');
    fetchReminders(currentMonth);
    fetchSchedules();
    fetchWeather();
  }, []);

  // Monitor weather reminder changes
  useEffect(() => {
    console.log('🔄 Weather reminder state updated:', weatherReminder);
  }, [weatherReminder]);

  const handleMarkAsDone = async (scheduleId, type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      console.log(`🔄 Marking ${type} as done for schedule:`, scheduleId);

      let endpoint = '';
      if (type === 'watering') endpoint = 'watered';
      else if (type === 'pruning') endpoint = 'pruned';
      else if (type === 'fertilizing') endpoint = 'fertilized';

      await axios.put(`http://localhost:5000/api/careschedule/${endpoint}/${scheduleId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(`✅ ${type} marked successfully`);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} marked successfully!`);

      // Refresh data
      fetchSchedules();
      fetchReminders(currentMonth);
    } catch (err) {
      console.error(`❌ Failed to mark as ${type}:`, err.message);
      alert(`Failed to mark as ${type}: ${err.response?.data?.message || err.message}`);
    }
  };

  // Combine normal + weather reminder
  const combinedReminders = weatherReminder
    ? [...reminders, weatherReminder]
    : reminders;

  console.log("📊 Combined reminders:", combinedReminders);

  return (
    <div className="care-schedule-container">
      <div className="schedule-left">
        <h2>Your Plant Care Schedule & Reminders</h2>
        
        {/* Weather Status */}
        <div className="weather-status" style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: weatherError ? '#fee' : weatherLoading ? '#fef' : '#efe',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          {weatherLoading && <p>🌤️ Loading weather data...</p>}
          {weatherError && <p>⚠️ Weather: {weatherError}</p>}
          {!weatherLoading && !weatherError && weatherReminder && (
            <p>🌤️ Weather alert: {weatherReminder.title}</p>
          )}
          {!weatherLoading && !weatherError && !weatherReminder && (
            <p>🌤️ Weather conditions normal</p>
          )}
        </div>

        <div className="calendar-right">
          <CalendarReminders
            reminders={combinedReminders}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            onActiveStartDateChange={onActiveStartDateChange}
          />
        </div>
      </div>

      {schedules.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>No care schedules found. Add some plants to get started!</p>
        </div>
      ) : (
        schedules.map(schedule => (
          <div key={schedule._id} className="schedule-card" style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            marginBottom: '15px',
            borderRadius: '8px',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>
              {schedule.plantId?.name || 'Unnamed Plant'}
            </h3>
            <div style={{ marginBottom: '10px' }}>
              <p><strong>Next Watering:</strong> {schedule.nextWateringDate ? new Date(schedule.nextWateringDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Next Pruning:</strong> {schedule.nextPruningDate ? new Date(schedule.nextPruningDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Next Fertilizing:</strong> {schedule.nextFertilizingDate ? new Date(schedule.nextFertilizingDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="schedule-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleMarkAsDone(schedule._id, 'watering')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mark as Watered
              </button>
              <button 
                onClick={() => handleMarkAsDone(schedule._id, 'pruning')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mark as Pruned
              </button>
              <button 
                onClick={() => handleMarkAsDone(schedule._id, 'fertilizing')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mark as Fertilized
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CareSchedule;