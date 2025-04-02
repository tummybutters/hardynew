import { GoogleAuth } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';
import { storage } from './storage';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Booking } from '@shared/schema';

// Get current file path for ES modules (replacement for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Sheet ID
const SPREADSHEET_ID = '1QzR1-WiCTq9H5k-zA2PoJuSiXhAVp0JhxQy_Nq_9wGs';
const CREDENTIALS_PATH = path.join(__dirname, '..', 'service-account-credentials.json');

/**
 * Gets an authenticated Google Sheets client
 */
async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
  try {
    // Check if credentials file exists
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('Google credentials file not found at:', CREDENTIALS_PATH);
      throw new Error('Service account credentials file not found');
    }

    // Create auth client
    const auth = new GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Return configured sheets client
    return google.sheets({
      version: 'v4',
      auth
    });
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw error;
  }
}

/**
 * Maps a booking object to a row format for Google Sheets
 */
function mapBookingToRow(booking: Booking): any[] {
  // Format timestamp
  const timestamp = booking.createdAt 
    ? new Date(booking.createdAt).toLocaleString() 
    : new Date().toLocaleString();
  
  // Map the booking object fields to match your Google Sheet columns
  return [
    timestamp,
    `${booking.firstName} ${booking.lastName}`,
    booking.email,
    booking.phone,
    booking.location,
    booking.vehicleType,
    booking.conditionNotes || '',
    booking.serviceCategory,
    booking.mainService,
    booking.addOns || '',
    booking.appointmentDate,
    booking.appointmentTime,
    booking.totalPrice,
    booking.bookingReference || '',
    booking.status || 'pending',
    '', // Notes/Tags (empty by default)
  ];
}

/**
 * Syncs all bookings to Google Sheets
 */
export async function syncBookingsToGoogleSheets(): Promise<boolean> {
  try {
    // Get all bookings from storage
    const bookings = await storage.getBookings();
    console.log(`Syncing ${bookings.length} bookings to Google Sheets...`);

    // Get sheets client
    const sheets = await getGoogleSheetsClient();

    // Map bookings to rows
    const rows = bookings.map(mapBookingToRow);

    // Add header row if needed - we'll keep the existing headers in the sheet
    const headerRow = [
      'Timestamp',
      'Customer Name',
      'Email',
      'Phone',
      'Address',
      'Vehicle Type',
      'Vehicle Condition',
      'Service Category',
      'Service Package',
      'Add-Ons',
      'Appointment Date',
      'Appointment Time',
      'Total Price',
      'Booking Reference',
      'Status',
      'Notes'
    ];

    // First clear existing values
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2:Q100', // Adjust the range based on your expected data size
    });

    // Update values in the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2', // Start at row 2 (after headers)
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });

    console.log('Successfully synced bookings to Google Sheets');
    return true;
  } catch (error) {
    console.error('Error syncing bookings to Google Sheets:', error);
    return false;
  }
}

/**
 * Syncs a single booking to Google Sheets (appends to the end)
 */
export async function syncSingleBookingToGoogleSheets(booking: Booking): Promise<boolean> {
  try {
    console.log(`Syncing single booking to Google Sheets: ${booking.bookingReference}`);

    // Get sheets client
    const sheets = await getGoogleSheetsClient();

    // Map booking to row
    const row = mapBookingToRow(booking);

    // Append the booking to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2', // Start at row 2 (after headers)
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    console.log('Successfully added booking to Google Sheets');
    return true;
  } catch (error) {
    console.error('Error adding booking to Google Sheets:', error);
    return false;
  }
}