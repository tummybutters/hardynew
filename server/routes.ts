import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { bookingFormSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  prepareEmployeeEmailNotification, 
  prepareCustomerEmailConfirmation, 
  sendEmailNotification 
} from "./emailService";
import { 
  syncBookingsToGoogleSheets, 
  addBookingToGoogleSheets, 
  checkGoogleSheetsCredentials,
  addContactToGoogleSheets 
} from "./googleSheetsSync";

// Type for enhanced booking data
interface EnhancedBookingData {
  reference?: string;
  status?: string;
  timestamp?: string;
  location?: string;
  coordinates?: [number, number];
  vehicleType?: string;
  vehicleTypeName?: string;
  vehicleCondition?: string;
  serviceCategory?: string;
  serviceCategoryName?: string;
  mainService?: string;
  mainServiceName?: string;
  mainServicePrice?: string;
  mainServiceDuration?: string;
  addOns?: string;
  addOnDetailsList?: Array<{id: string; name?: string; price?: string}>;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentTimeFormatted?: string;
  totalPrice?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  submittedFrom?: string;
  userAgent?: string;
  [key: string]: any; // Allow for additional properties
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Booking endpoints
  app.post('/api/bookings', async (req, res) => {
    try {
      // Extract the comprehensive tracking data if it exists
      const { bookingData, ...formData } = req.body;
      
      // Log the incoming request data for debugging
      console.log('Received booking request:');
      console.log('Form data keys:', Object.keys(formData));
      
      // Validate the core booking data
      try {
        const validatedData = bookingFormSchema.parse(formData);
        
        // Try to create the booking
        try {
          // Create the booking - potential database error point
          const booking = await storage.createBooking(validatedData);
          
          // Log comprehensive data if available
          if (bookingData) {
            console.log('===== COMPREHENSIVE BOOKING DATA =====');
            console.log(JSON.stringify(bookingData, null, 2));
            console.log('=====================================');
          }
          
          // Prepare and send employee notification email with the enhanced data
          const employeeEmailData = prepareEmployeeEmailNotification(booking);
          // If we have comprehensive data, add it to the email for the employees
          if (bookingData) {
            employeeEmailData.enhancedData = bookingData as EnhancedBookingData;
          }
          await sendEmailNotification(employeeEmailData);
          
          // Prepare and send customer confirmation email (without the enhanced data)
          const customerEmailData = prepareCustomerEmailConfirmation(booking);
          await sendEmailNotification(customerEmailData);
          
          // Log basic booking info
          console.log(`New booking (${booking.bookingReference}) created for ${booking.firstName} ${booking.lastName}`);
          console.log(`Vehicle: ${booking.vehicleType}, Service: ${booking.mainService}`);
          console.log(`Appointment: ${booking.appointmentDate} at ${booking.appointmentTime}`);
          console.log(`Location: ${booking.location}`);
          
          // Sync the booking with Google Sheets (don't await, do this in the background)
          addBookingToGoogleSheets(booking)
            .then(success => {
              if (success) {
                console.log(`Booking ${booking.id} successfully added to Google Sheets`);
              } else {
                console.warn(`Failed to add booking ${booking.id} to Google Sheets`);
              }
            })
            .catch(error => {
              console.error(`Error syncing booking ${booking.id} to Google Sheets:`, error);
            });
          
          // Return the created booking
          return res.status(201).json({
            message: 'Booking created successfully',
            booking
          });
        } catch (dbError) {
          // Specific handling for database errors
          console.error('Database error while creating booking:', dbError);
          
          // Check for common PostgreSQL error types
          const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
          
          if (errorMessage.includes('ECONNREFUSED')) {
            console.error('Database connection refused. Check that PostgreSQL is running.');
            return res.status(503).json({
              message: 'Database temporarily unavailable. Please try again later.',
              error: 'connection_refused'
            });
          } else if (errorMessage.includes('timeout')) {
            console.error('Database connection timeout. The database might be overloaded.');
            return res.status(503).json({
              message: 'Database temporarily unavailable. Please try again later.',
              error: 'connection_timeout'
            });
          } else {
            // Generic database error
            return res.status(500).json({
              message: 'A database error occurred while saving your booking.',
              error: 'database_error'
            });
          }
        }
      } catch (validationError) {
        // Detailed validation error handling
        if (validationError instanceof ZodError) {
          console.error('Validation error details:', validationError.errors);
          const formattedError = fromZodError(validationError);
          return res.status(400).json({
            message: 'Validation error',
            errors: formattedError.message
          });
        }
        throw validationError; // Re-throw if it's not a ZodError
      }
    } catch (error) {
      // Log detailed error information
      console.error('Error creating booking:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // More user-friendly error message
      return res.status(500).json({
        message: 'An error occurred while creating the booking. Please try again later.'
      });
    }
  });

  // Get all bookings
  app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      return res.status(200).json({
        success: true,
        bookings: bookings
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching bookings'
      });
    }
  });

  // Get a single booking
  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          message: 'Invalid booking ID'
        });
      }

      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      return res.status(200).json({
        success: true,
        booking
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      return res.status(500).json({
        message: 'An error occurred while fetching the booking'
      });
    }
  });

  // Update booking status
  app.patch('/api/bookings/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          message: 'Invalid booking ID'
        });
      }

      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({
          message: 'Invalid status'
        });
      }

      const booking = await storage.updateBookingStatus(id, status);
      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      return res.status(200).json({
        message: 'Booking status updated successfully',
        booking
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      return res.status(500).json({
        message: 'An error occurred while updating the booking status'
      });
    }
  });
  
  // Endpoint to manually sync all bookings to Google Sheets
  app.post('/api/sync-bookings-to-sheets', async (req, res) => {
    try {
      const result = await syncBookingsToGoogleSheets();
      if (result) {
        return res.status(200).json({
          success: true,
          message: 'All bookings successfully synced to Google Sheets'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to sync bookings to Google Sheets'
        });
      }
    } catch (error: any) {
      console.error('Error syncing bookings to Google Sheets:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error syncing bookings to Google Sheets'
      });
    }
  });
  
  // Contact form endpoint (with Google Sheets integration)
  app.post('/api/subscribe', async (req, res) => {
    try {
      const { email, firstName, lastName, phone, subject, message } = req.body;
      
      if (!email || !firstName) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          message: 'Email and name are required'
        });
      }
      
      // Store the contact form submission locally
      const contactSubmission = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        email,
        firstName,
        lastName: lastName || '',
        phone: phone || '',
        subject: subject || '',
        message: message || ''
      };
      
      console.log('Contact form submission received:', contactSubmission);
      
      // Add the contact submission to Google Sheets (don't await, do this in background)
      addContactToGoogleSheets(contactSubmission)
        .then(success => {
          if (success) {
            console.log(`Contact submission successfully added to Google Sheets`);
          } else {
            console.warn(`Failed to add contact submission to Google Sheets`);
          }
        })
        .catch(error => {
          console.error(`Error adding contact submission to Google Sheets:`, error);
        });
      
      return res.status(200).json({
        success: true,
        message: 'Your message has been received successfully',
        contactSubmission
      });
    } catch (error: any) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({
        error: 'Failed to process your request',
        message: error.message || 'An unexpected error occurred'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
