// logger.js - Simple logging utility for FiFuFa backend
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Get current date for filename
const getDateString = () => {
  return new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

// Get current timestamp for log entries
const getTimestamp = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

// Write log to file
const writeLog = (level, message, isError = false) => {
  const timestamp = getTimestamp();
  const dateString = getDateString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  // Choose log file based on type
  const filename = isError ? `error-${dateString}.log` : `app-${dateString}.log`;
  const filepath = path.join(logsDir, filename);
  
  // Append to file
  fs.appendFileSync(filepath, logMessage);
  
  // Also log to console (keep existing behavior)
  if (isError) {
    console.error(logMessage.trim());
  } else {
    console.log(logMessage.trim());
  }
};

// Logger functions
export const logger = {
  info: (message) => writeLog('INFO', message),
  error: (message) => writeLog('ERROR', message, true),
  warn: (message) => writeLog('WARN', message),
  success: (message) => writeLog('SUCCESS', message)
};