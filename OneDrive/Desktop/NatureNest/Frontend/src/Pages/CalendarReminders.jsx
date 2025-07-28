import React, { useEffect, useState, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTint, FaCut, FaLeaf, FaExclamationTriangle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Weather icons
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiSnow,
  WiFog,
  WiThunderstorm,
} from 'react-icons/wi';

function CalendarReminders({ reminders = [], selectedDate, onDateSelect, onActiveStartDateChange }) {
  const [dailyReminders, setDailyReminders] = useState([]);
  const shownMonthlyToastRef = useRef({});
  const shownDateToastRef = useRef('');

  // Normalize only for UI filtering, no mutation of original data
  const normalizeDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // yyyy-mm-dd string
  };

  const getMonthKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  };

  useEffect(() => {
    console.log('📅 CalendarReminders - Processing reminders:', { 
      totalReminders: reminders.length, 
      selectedDate: selectedDate?.toISOString(),
      reminders: reminders.map(r => ({ type: r.type, date: r.date, title: r.title }))
    });

    if (!reminders || reminders.length === 0 || !selectedDate) {
      setDailyReminders([]);
      return;
    }

    const selectedKey = normalizeDate(selectedDate);
    console.log('🔍 Looking for reminders on:', selectedKey);
    
    // Filter reminders by normalized date string
    const filtered = reminders.filter(reminder => {
      const reminderDate = normalizeDate(reminder.date);
      const matches = reminderDate === selectedKey;
      console.log(`  Reminder ${reminder.type} (${reminderDate}) matches: ${matches}`);
      return matches;
    });

    console.log('📋 Filtered reminders for selected date:', filtered);

    // Remove duplicates by composite key: date-type-plantId
    const uniqueReminders = filtered.filter((reminder, index, self) => {
      const key = `${normalizeDate(reminder.date)}-${reminder.type}-${reminder.plantId || reminder._id}`;
      return self.findIndex(r => {
        const rKey = `${normalizeDate(r.date)}-${r.type}-${r.plantId || r._id}`;
        return rKey === key;
      }) === index;
    });

    console.log('✅ Unique reminders for selected date:', uniqueReminders);
    setDailyReminders(uniqueReminders);

    // Show toast once per day selection
    if (uniqueReminders.length > 0 && shownDateToastRef.current !== selectedKey) {
      toast.info(`You have ${uniqueReminders.length} reminder(s) on ${selectedDate.toDateString()}`);
      shownDateToastRef.current = selectedKey;
    }
  }, [reminders, selectedDate]);

  const handleMonthChange = ({ activeStartDate }) => {
    const key = getMonthKey(activeStartDate);
    console.log('📅 Month changed to:', activeStartDate, 'Key:', key);

    if (onActiveStartDateChange) {
      onActiveStartDateChange({ activeStartDate });
    }

    if (!shownMonthlyToastRef.current[key] && reminders.length > 0) {
      const monthReminders = reminders.filter((r) => {
        const rDate = new Date(r.date);
        return (
          rDate.getMonth() === activeStartDate.getMonth() &&
          rDate.getFullYear() === activeStartDate.getFullYear()
        );
      });

      console.log('📊 Reminders in this month:', monthReminders.length);

      if (monthReminders.length > 0) {
        toast.info(`You have ${monthReminders.length} reminder(s) in this month.`);
        shownMonthlyToastRef.current[key] = true;
      }
    }
  };

  // Weather icon mapping based on condition string
  const renderWeatherIcon = (condition = '') => {
    console.log('🌤️ Rendering weather icon for condition:', condition);
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <WiDaySunny style={{ color: '#f9c10b' }} />;
      case 'rain':
      case 'raining':
        return <WiRain style={{ color: '#0077be' }} />;
      case 'cloudy':
        return <WiCloudy style={{ color: '#999999' }} />;
      case 'snow':
        return <WiSnow style={{ color: '#00bfff' }} />;
      case 'fog':
        return <WiFog style={{ color: '#cccccc' }} />;
      case 'thunderstorm':
        return <WiThunderstorm style={{ color: '#ff8800' }} />;
      case 'error':
        return <FaExclamationTriangle style={{ color: '#ff0000' }} />;
      default:
        return <WiCloudy style={{ color: 'gray' }} />;
    }
  };

  const renderIcon = (reminder) => {
    const { type, condition } = reminder;
    console.log('🎨 Rendering icon for:', { type, condition });

    switch (type) {
      case 'watering':
        return <FaTint style={{ color: 'blue' }} />;
      case 'pruning':
        return <FaCut style={{ color: 'green' }} />;
      case 'fertilizing':
        return <FaLeaf style={{ color: 'orange' }} />;
      case 'weather':
        return renderWeatherIcon(condition);
      default:
        return <FaExclamationTriangle style={{ color: 'gray' }} />;
    }
  };

  return (
    <div className="calendar-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <Calendar
        onChange={onDateSelect}
        value={selectedDate}
        onActiveStartDateChange={handleMonthChange}
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;

          const dayReminders = reminders.filter(
            (reminder) => normalizeDate(reminder.date) === normalizeDate(date)
          );

          if (dayReminders.length === 0) return null;

          const iconsToRender = [];

          // Add icons for each type of reminder
          if (dayReminders.some(r => r.type === 'watering')) {
            iconsToRender.push(<FaTint key="w" style={{ color: 'blue', fontSize: 12 }} />);
          }
          if (dayReminders.some(r => r.type === 'pruning')) {
            iconsToRender.push(<FaCut key="p" style={{ color: 'green', fontSize: 12 }} />);
          }
          if (dayReminders.some(r => r.type === 'fertilizing')) {
            iconsToRender.push(<FaLeaf key="f" style={{ color: 'orange', fontSize: 12 }} />);
          }
          if (dayReminders.some(r => r.type === 'weather')) {
            const weatherReminder = dayReminders.find(r => r.type === 'weather');
            iconsToRender.push(
              <span key="weather" style={{ fontSize: 14 }}>
                {renderWeatherIcon(weatherReminder.condition)}
              </span>
            );
          }

          return (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2px', 
              marginTop: 2,
              flexWrap: 'wrap'
            }}>
              {iconsToRender}
            </div>
          );
        }}
      />

      <div style={{ marginTop: '20px' }}>
        <h3 className="reminder-heading" style={{ 
          marginBottom: '15px',
          color: '#333',
          borderBottom: '2px solid #eee',
          paddingBottom: '5px'
        }}>
          Reminders for {selectedDate?.toDateString() || '...'}:
        </h3>

        {dailyReminders.length === 0 ? (
          <p style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            No reminders for this day.
          </p>
        ) : (
          <ul className="reminder-list" style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0
          }}>
            {dailyReminders.map((reminder) => (
              <li key={reminder._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: '#f9f9f9',
                borderRadius: '6px',
                border: '1px solid #eee'
              }}>
                <div style={{ fontSize: '18px' }}>
                  {renderIcon(reminder)}
                </div>
                <span style={{ flex: 1 }}>
                  <strong style={{ 
                    textTransform: 'capitalize',
                    color: '#333'
                  }}>
                    {reminder.type}
                  </strong>
                  {reminder.type === 'weather' && reminder.condition ? (
                    <span style={{ color: '#666' }}> ({reminder.condition})</span>
                  ) : ''} - <span style={{ color: '#555' }}>{reminder.title}</span>
                  {reminder.temperature && (
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                      🌡️ {reminder.temperature}°C {reminder.humidity && `• 💧 ${reminder.humidity}%`}
                    </div>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CalendarReminders;
