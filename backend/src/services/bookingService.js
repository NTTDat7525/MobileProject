import * as bookingQuery from '../db/queries/bookingQuery.js';

export const createBooking = async (userId, tableId, bookingTime, numberOfPeople) => {
    return bookingQuery.createBooking(userId, tableId, bookingTime, numberOfPeople);
};

export const getBookingsByUserId = async (userId) => {
    return bookingQuery.getBookingsByUserId(userId);
};

export const getAllBookings = async () => {
    return bookingQuery.getAllBookings();
};

export const updateBookingStatus = async (bookingId, status) => {
    return bookingQuery.updateBookingStatus(bookingId, status);
};