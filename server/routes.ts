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

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Booking endpoints
  app.post('/api/bookings', async (req, res) => {
    try {
      // Validate the request body
      const validatedData = bookingFormSchema.parse(req.body);
      
      // Generate a unique booking reference (will be added by storage layer)
      const bookingReference = `HWW-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
      
      // Create the booking
      const booking = await storage.createBooking(validatedData);
      
      // Prepare and send employee notification email
      const employeeEmailData = prepareEmployeeEmailNotification(booking);
      await sendEmailNotification(employeeEmailData);
      
      // Prepare and send customer confirmation email
      const customerEmailData = prepareCustomerEmailConfirmation(booking);
      await sendEmailNotification(customerEmailData);
      
      // Log booking for tracking purposes
      console.log(`New booking (${bookingReference}) created for ${booking.firstName} ${booking.lastName}`);
      console.log(`Vehicle: ${booking.vehicleType}, Service: ${booking.mainService}`);
      console.log(`Appointment: ${booking.appointmentDate} at ${booking.appointmentTime}`);
      console.log(`Location: ${booking.location}`);
      
      // Return the created booking
      return res.status(201).json({
        message: 'Booking created successfully',
        booking
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: 'Validation error',
          errors: validationError.message
        });
      }
      
      // Handle other errors
      console.error('Error creating booking:', error);
      return res.status(500).json({
        message: 'An error occurred while creating the booking'
      });
    }
  });

  // Get all bookings
  app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      return res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({
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

      return res.status(200).json(booking);
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

  const httpServer = createServer(app);

  return httpServer;
}
