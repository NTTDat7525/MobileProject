/**
 * Utility functions for data processing
 */

/**
 * Calculates available tables based on current bookings
 * @param {Array} allTables - All tables in the restaurant
 * @param {Array} bookings - Current bookings
 * @param {string} date - Target booking date (YYYY-MM-DD)
 * @param {string} time - Target booking time (HH:mm)
 * @returns {Array} Available tables
 */
export const getAvailableTables = (allTables, bookings, date, time) => {
  if (!allTables || !Array.isArray(allTables)) return [];
  if (!bookings || !Array.isArray(bookings)) return allTables;

  const bookedTableIds = bookings
    .filter(booking => {
      const bookingDate = booking.bookingDate?.split('T')[0]; // Extract date part
      const bookingStartTime = booking.bookingTime?.slice(0, 5); // HH:mm
      const bookingEndTime = booking.endTime?.slice(0, 5);

      return (
        bookingDate === date &&
        isTimeOverlapping(time, bookingStartTime, bookingEndTime)
      );
    })
    .map(booking => booking.tableId);

  return allTables.filter(table => !bookedTableIds.includes(table.id));
};

/**
 * Checks if two time slots overlap
 * @param {string} requestedTime - Time in HH:mm format
 * @param {string} startTime - Existing booking start time (HH:mm)
 * @param {string} endTime - Existing booking end time (HH:mm)
 * @returns {boolean} True if times overlap
 */
export const isTimeOverlapping = (requestedTime, startTime, endTime) => {
  if (!requestedTime || !startTime || !endTime) return false;

  const [reqH, reqM] = requestedTime.split(':').map(Number);
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const reqMinutes = reqH * 60 + reqM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return reqMinutes >= startMinutes && reqMinutes < endMinutes;
};

/**
 * Validates booking time is within restaurant hours
 * @param {string} time - Time in HH:mm format
 * @param {string} openingTime - Restaurant opening time (HH:mm)
 * @param {string} closingTime - Restaurant closing time (HH:mm)
 * @returns {boolean} True if time is valid
 */
export const isValidBookingTime = (time, openingTime = '09:00', closingTime = '23:00') => {
  if (!time) return false;

  const [h, m] = time.split(':').map(Number);
  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);

  const timeMinutes = h * 60 + m;
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return timeMinutes >= openMinutes && timeMinutes < closeMinutes;
};

/**
 * Checks if booking date is in the future
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {boolean} True if date is today or in the future
 */
export const isValidBookingDate = (date) => {
  if (!date) return false;

  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return bookingDate >= today;
};

/**
 * Formats date for display (e.g., "Mon, Jan 15, 2024")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';

  const d = new Date(date);
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };

  return d.toLocaleDateString('en-US', options);
};

/**
 * Formats time for display (e.g., "2:30 PM")
 * @param {string} time - Time in HH:mm format
 * @returns {string} Formatted time string
 */
export const formatTimeForDisplay = (time) => {
  if (!time) return '';

  const [h, m] = time.split(':').map(Number);
  const hours = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const period = h >= 12 ? 'PM' : 'AM';

  return `${hours}:${m.toString().padStart(2, '0')} ${period}`;
};

/**
 * Calculates booking duration in hours
 * @param {string} startTime - Start time in HH:mm format
 * @param {string} endTime - End time in HH:mm format
 * @returns {number} Duration in hours
 */
export const calculateBookingDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return (endMinutes - startMinutes) / 60;
};

/**
 * Counts empty tables based on capacity
 * @param {Array} tables - Array of table objects
 * @param {number} requiredCapacity - Minimum guest count needed
 * @returns {number} Count of tables with sufficient capacity
 */
export const countAvailableTableCapacity = (tables, requiredCapacity) => {
  if (!tables || !Array.isArray(tables)) return 0;
  if (requiredCapacity <= 0) return 0;

  return tables.filter(table => table.capacity >= requiredCapacity).length;
};

/**
 * Validates guest count
 * @param {number} guestCount - Number of guests
 * @param {number} minGuests - Minimum allowed (default: 1)
 * @param {number} maxGuests - Maximum allowed (default: 20)
 * @returns {boolean} True if guest count is valid
 */
export const isValidGuestCount = (guestCount, minGuests = 1, maxGuests = 20) => {
  const count = Number(guestCount);
  return !isNaN(count) && count >= minGuests && count <= maxGuests;
};

/**
 * Formats currency (e.g., "2,500,000 VND")
 * @param {number} amount - Amount in VND
 * @param {string} currency - Currency code (default: 'VND')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'VND') => {
  if (typeof amount !== 'number' || isNaN(amount)) return '';

  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formatted} ${currency}`;
};

/**
 * Calculates 20% deposit amount
 * @param {number} totalAmount - Total booking cost
 * @returns {number} Deposit amount (20% of total)
 */
export const calculateDeposit = (totalAmount) => {
  if (typeof totalAmount !== 'number' || totalAmount <= 0) return 0;
  return Math.ceil(totalAmount * 0.2);
};

/**
 * Groups bookings by status
 * @param {Array} bookings - Array of booking objects
 * @returns {Object} Bookings grouped by status
 */
export const groupBookingsByStatus = (bookings) => {
  if (!bookings || !Array.isArray(bookings)) return {};

  return bookings.reduce((acc, booking) => {
    const status = booking.status || 'pending';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(booking);
    return acc;
  }, {});
};

/**
 * Checks if booking can be cancelled
 * Bookings can only be cancelled if they're in the future and status is not "cancelled"
 * @param {Object} booking - Booking object
 * @returns {boolean} True if booking can be cancelled
 */
export const canCancelBooking = (booking) => {
  if (!booking) return false;

  const bookingDate = new Date(booking.bookingDate);
  const now = new Date();

  return booking.status !== 'cancelled' && bookingDate > now;
};
