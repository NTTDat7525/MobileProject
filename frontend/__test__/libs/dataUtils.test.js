import {
  getAvailableTables,
  isTimeOverlapping,
  isValidBookingTime,
  isValidBookingDate,
  formatDateForDisplay,
  formatTimeForDisplay,
  calculateBookingDuration,
  countAvailableTableCapacity,
  isValidGuestCount,
  formatCurrency,
  calculateDeposit,
  groupBookingsByStatus,
  canCancelBooking,
} from '../../libs/dataUtils';

describe('Data Utility Functions', () => {

  describe('getAvailableTables', () => {
    const mockTables = [
      { id: 1, number: 'A1', capacity: 2 },
      { id: 2, number: 'A2', capacity: 4 },
      { id: 3, number: 'A3', capacity: 6 },
    ];

    const mockBookings = [
      {
        id: 1,
        tableId: 1,
        bookingDate: '2024-01-15T00:00:00',
        bookingTime: '18:30',
        endTime: '20:00',
      },
    ];

    test('should return all tables when no bookings exist', () => {
      const available = getAvailableTables(mockTables, [], '2024-01-15', '19:00');
      expect(available).toEqual(mockTables);
    });

    test('should exclude booked tables at requested time', () => {
      const available = getAvailableTables(mockTables, mockBookings, '2024-01-15', '18:30');
      expect(available).toHaveLength(2);
      expect(available.map(t => t.id)).not.toContain(1);
    });

    test('should include table when booking time does not overlap', () => {
      const available = getAvailableTables(mockTables, mockBookings, '2024-01-15', '20:30');
      expect(available).toHaveLength(3);
    });

    test('should handle null/undefined bookings gracefully', () => {
      const available1 = getAvailableTables(mockTables, null, '2024-01-15', '19:00');
      const available2 = getAvailableTables(mockTables, undefined, '2024-01-15', '19:00');
      expect(available1).toEqual(mockTables);
      expect(available2).toEqual(mockTables);
    });

    test('should return empty array for invalid tables', () => {
      const available = getAvailableTables(null, mockBookings, '2024-01-15', '19:00');
      expect(available).toEqual([]);
    });
  });

  // ===============================
  // Time Validation Tests
  // ===============================

  describe('isTimeOverlapping', () => {
    test('should return true when time falls within booking period', () => {
      expect(isTimeOverlapping('18:45', '18:00', '20:00')).toBe(true);
    });

    test('should return true when time equals start time', () => {
      expect(isTimeOverlapping('18:00', '18:00', '20:00')).toBe(true);
    });

    test('should return false when time is before booking', () => {
      expect(isTimeOverlapping('17:30', '18:00', '20:00')).toBe(false);
    });

    test('should return false when time is after or at booking end', () => {
      expect(isTimeOverlapping('20:00', '18:00', '20:00')).toBe(false);
      expect(isTimeOverlapping('20:30', '18:00', '20:00')).toBe(false);
    });

    test('should handle 24-hour format correctly', () => {
      expect(isTimeOverlapping('23:30', '23:00', '24:00')).toBe(true);
    });

    test('should return false for null/undefined inputs', () => {
      expect(isTimeOverlapping(null, '18:00', '20:00')).toBe(false);
      expect(isTimeOverlapping('18:30', null, '20:00')).toBe(false);
    });
  });

  describe('isValidBookingTime', () => {
    test('should return true for time within default hours (09:00 - 23:00)', () => {
      expect(isValidBookingTime('18:00')).toBe(true);
      expect(isValidBookingTime('09:00')).toBe(true);
      expect(isValidBookingTime('22:59')).toBe(true);
    });

    test('should return false for time before opening', () => {
      expect(isValidBookingTime('08:59')).toBe(false);
    });

    test('should return false for time at or after closing', () => {
      expect(isValidBookingTime('23:00')).toBe(false);
    });

    test('should respect custom opening/closing hours', () => {
      expect(isValidBookingTime('12:00', '11:00', '15:00')).toBe(true);
      expect(isValidBookingTime('10:59', '11:00', '15:00')).toBe(false);
      expect(isValidBookingTime('15:00', '11:00', '15:00')).toBe(false);
    });

    test('should return false for null time', () => {
      expect(isValidBookingTime(null)).toBe(false);
    });
  });

  describe('isValidBookingDate', () => {
    test('should return true for today', () => {
      // Use local date format to avoid timezone issues
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      expect(isValidBookingDate(todayStr)).toBe(true);
    });

    test('should return true for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const tomorrowStr = `${year}-${month}-${day}`;
      expect(isValidBookingDate(tomorrowStr)).toBe(true);
    });

    test('should return false for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, '0');
      const day = String(yesterday.getDate()).padStart(2, '0');
      const yesterdayStr = `${year}-${month}-${day}`;
      expect(isValidBookingDate(yesterdayStr)).toBe(false);
    });

    test('should return false for null/undefined date', () => {
      expect(isValidBookingDate(null)).toBe(false);
      expect(isValidBookingDate(undefined)).toBe(false);
    });
  });

  // ===============================
  // Date/Time Formatting Tests
  // ===============================

  describe('formatDateForDisplay', () => {
    test('should format date correctly', () => {
      const formatted = formatDateForDisplay('2024-01-15');
      expect(formatted).toMatch(/Mon.*Jan.*15.*2024/);
    });

    test('should handle Date objects', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDateForDisplay(date);
      expect(formatted).toMatch(/Jan.*15.*2024/);
    });

    test('should return empty string for null/undefined', () => {
      expect(formatDateForDisplay(null)).toBe('');
      expect(formatDateForDisplay(undefined)).toBe('');
    });
  });

  describe('formatTimeForDisplay', () => {
    test('should convert 24-hour to 12-hour AM format', () => {
      expect(formatTimeForDisplay('09:30')).toBe('9:30 AM');
      expect(formatTimeForDisplay('08:45')).toBe('8:45 AM');
    });

    test('should convert 24-hour to 12-hour PM format', () => {
      expect(formatTimeForDisplay('14:30')).toBe('2:30 PM');
      expect(formatTimeForDisplay('18:00')).toBe('6:00 PM');
    });

    test('should handle midnight correctly', () => {
      expect(formatTimeForDisplay('00:15')).toBe('12:15 AM');
    });

    test('should pad minutes with leading zero', () => {
      expect(formatTimeForDisplay('14:05')).toBe('2:05 PM');
      expect(formatTimeForDisplay('09:05')).toBe('9:05 AM');
    });

    test('should return empty string for null/undefined', () => {
      expect(formatTimeForDisplay(null)).toBe('');
      expect(formatTimeForDisplay(undefined)).toBe('');
    });
  });

  // ===============================
  // Duration & Guest Count Tests
  // ===============================

  describe('calculateBookingDuration', () => {
    test('should calculate correct duration in hours', () => {
      expect(calculateBookingDuration('14:00', '16:00')).toBe(2);
      expect(calculateBookingDuration('18:30', '20:00')).toBe(1.5);
    });

    test('should return 0 for null/undefined times', () => {
      expect(calculateBookingDuration(null, '20:00')).toBe(0);
      expect(calculateBookingDuration('18:00', null)).toBe(0);
    });
  });

  describe('countAvailableTableCapacity', () => {
    const tables = [
      { id: 1, capacity: 2 },
      { id: 2, capacity: 4 },
      { id: 3, capacity: 6 },
      { id: 4, capacity: 8 },
    ];

    test('should count tables with sufficient capacity', () => {
      expect(countAvailableTableCapacity(tables, 4)).toBe(3); // Tables 2, 3, 4
      expect(countAvailableTableCapacity(tables, 6)).toBe(2); // Tables 3, 4
      expect(countAvailableTableCapacity(tables, 8)).toBe(1); // Table 4
    });

    test('should return 0 for invalid capacity', () => {
      expect(countAvailableTableCapacity(tables, 0)).toBe(0);
      expect(countAvailableTableCapacity(tables, -1)).toBe(0);
    });

    test('should return 0 for null/undefined tables', () => {
      expect(countAvailableTableCapacity(null, 4)).toBe(0);
      expect(countAvailableTableCapacity(undefined, 4)).toBe(0);
    });
  });

  describe('isValidGuestCount', () => {
    test('should return true for valid guest count (default range 1-20)', () => {
      expect(isValidGuestCount(1)).toBe(true);
      expect(isValidGuestCount(10)).toBe(true);
      expect(isValidGuestCount(20)).toBe(true);
    });

    test('should return false for out-of-range guest count', () => {
      expect(isValidGuestCount(0)).toBe(false);
      expect(isValidGuestCount(21)).toBe(false);
      expect(isValidGuestCount(-5)).toBe(false);
    });

    test('should respect custom min/max range', () => {
      expect(isValidGuestCount(2, 2, 6)).toBe(true);
      expect(isValidGuestCount(8, 2, 6)).toBe(false);
    });

    test('should handle string numbers', () => {
      expect(isValidGuestCount('5')).toBe(true);
      expect(isValidGuestCount('25')).toBe(false);
    });

    test('should return false for non-numeric values', () => {
      expect(isValidGuestCount('abc')).toBe(false);
      expect(isValidGuestCount(null)).toBe(false);
    });
  });

  // ===============================
  // Currency & Amount Tests
  // ===============================

  describe('formatCurrency', () => {
    test('should format currency with thousand separators', () => {
      expect(formatCurrency(1000000)).toBe('1,000,000 VND');
      expect(formatCurrency(2500000)).toBe('2,500,000 VND');
      expect(formatCurrency(500)).toBe('500 VND');
    });

    test('should support custom currency code', () => {
      expect(formatCurrency(1000000, 'USD')).toBe('1,000,000 USD');
    });

    test('should return empty string for invalid input', () => {
      expect(formatCurrency(null)).toBe('');
      expect(formatCurrency('abc')).toBe('');
      expect(formatCurrency(NaN)).toBe('');
    });
  });

  describe('calculateDeposit', () => {
    test('should calculate 20% deposit correctly', () => {
      expect(calculateDeposit(1000000)).toBe(200000);
      expect(calculateDeposit(2500000)).toBe(500000);
    });

    test('should round up to nearest integer', () => {
      expect(calculateDeposit(1000001)).toBe(200001);
      expect(calculateDeposit(999999)).toBe(200000);
    });

    test('should return 0 for invalid amounts', () => {
      expect(calculateDeposit(0)).toBe(0);
      expect(calculateDeposit(-1000)).toBe(0);
      expect(calculateDeposit(null)).toBe(0);
    });
  });

  // ===============================
  // Booking Status Tests
  // ===============================

  describe('groupBookingsByStatus', () => {
    const bookings = [
      { id: 1, status: 'confirmed' },
      { id: 2, status: 'pending' },
      { id: 3, status: 'confirmed' },
      { id: 4, status: 'cancelled' },
    ];

    test('should group bookings by status correctly', () => {
      const grouped = groupBookingsByStatus(bookings);
      expect(grouped.confirmed).toHaveLength(2);
      expect(grouped.pending).toHaveLength(1);
      expect(grouped.cancelled).toHaveLength(1);
    });

    test('should handle bookings without status field', () => {
      const bookings = [{ id: 1 }, { id: 2, status: 'confirmed' }];
      const grouped = groupBookingsByStatus(bookings);
      expect(grouped.pending).toHaveLength(1);
      expect(grouped.confirmed).toHaveLength(1);
    });

    test('should return empty object for null/undefined bookings', () => {
      expect(groupBookingsByStatus(null)).toEqual({});
      expect(groupBookingsByStatus(undefined)).toEqual({});
    });
  });

  describe('canCancelBooking', () => {
    test('should allow cancellation for future bookings with non-cancelled status', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const booking = {
        bookingDate: futureDate,
        status: 'confirmed',
      };
      expect(canCancelBooking(booking)).toBe(true);
    });

    test('should not allow cancellation for past bookings', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const booking = {
        bookingDate: pastDate,
        status: 'confirmed',
      };
      expect(canCancelBooking(booking)).toBe(false);
    });

    test('should not allow cancellation for already cancelled bookings', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const booking = {
        bookingDate: futureDate,
        status: 'cancelled',
      };
      expect(canCancelBooking(booking)).toBe(false);
    });

    test('should return false for null booking', () => {
      expect(canCancelBooking(null)).toBe(false);
      expect(canCancelBooking(undefined)).toBe(false);
    });
  });
});
