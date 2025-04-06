import { users, type User, type InsertUser, bookings, type Booking, type InsertBooking } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// The storage interface remains the same to ensure compatibility with existing code
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
}

/**
 * Memory Storage implementation - used for development and testing
 * Keeps data in memory (JavaScript Map objects)
 * Data is lost when server restarts
 */
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookingsStore: Map<number, Booking>;
  currentUserId: number;
  currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.bookingsStore = new Map();
    this.currentUserId = 1;
    this.currentBookingId = 1;
    
    // Add sample test bookings
    this.addTestBooking();
  }
  
  // Helper method to add test booking data
  private addTestBooking() {
    // First test booking - pending
    const testBooking1: Booking = {
      id: this.currentBookingId++,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      location: "123 Main St, Davis, CA 95616",
      vehicleType: "SUV",
      serviceCategory: "Premium",
      mainService: "Luxury Detail",
      addOns: "Interior Sanitization",
      totalPrice: "249.99",
      totalDuration: "180",
      appointmentDate: "2025-04-15",
      appointmentTime: "10:00 AM",
      conditionNotes: "Minor scratches on driver side door",
      createdAt: new Date(),
      status: "pending",
      bookingReference: `HWW-${Date.now().toString().slice(-6)}-001`
    };
    
    // Second test booking - confirmed
    const testBooking2: Booking = {
      id: this.currentBookingId++,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      location: "456 Oak Ave, Irvine, CA 92617",
      vehicleType: "Sedan",
      serviceCategory: "Basic",
      mainService: "Express Detail",
      addOns: "Tire Shine",
      totalPrice: "149.99",
      totalDuration: "90",
      appointmentDate: "2025-04-10",
      appointmentTime: "2:30 PM",
      conditionNotes: "Pet hair throughout interior",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      status: "confirmed",
      bookingReference: `HWW-${Date.now().toString().slice(-6)}-002`
    };
    
    this.bookingsStore.set(testBooking1.id, testBooking1);
    this.bookingsStore.set(testBooking2.id, testBooking2);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const now = new Date();
    
    // Generate a booking reference if not provided
    const bookingReference = insertBooking.bookingReference || 
      `HWW-${now.getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    // Handle null values for optional fields
    const addOns = insertBooking.addOns || null;
    const conditionNotes = insertBooking.conditionNotes || null;
    
    const booking: Booking = { 
      ...insertBooking,
      addOns,
      conditionNotes, 
      id, 
      createdAt: now, 
      status: "pending",
      bookingReference
    };
    
    this.bookingsStore.set(id, booking);
    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookingsStore.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookingsStore.get(id);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookingsStore.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookingsStore.set(id, updatedBooking);
    return updatedBooking;
  }
}

/**
 * Database Storage implementation - used for production
 * Stores data persistently in PostgreSQL database
 * Implements the same interface as MemStorage for easy swapping
 */
export class DatabaseStorage implements IStorage {
  /**
   * Get a user by ID
   */
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  /**
   * Create a new user
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  /**
   * Create a new booking with retry capability for better reliability
   */
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const now = new Date();
    
    // Generate a booking reference if not provided
    const bookingReference = insertBooking.bookingReference || 
      `HWW-${now.getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    // Maximum number of retries before giving up
    const MAX_RETRIES = 3;
    // Delay between retries in milliseconds, increasing with each retry
    let delay = 500;
    let lastError;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[storage] Creating booking attempt ${attempt}/${MAX_RETRIES}`);
        
        // Attempt to insert the booking into the database
        const [booking] = await db
          .insert(bookings)
          .values({
            ...insertBooking,
            status: "pending",
            bookingReference,
            createdAt: now
          })
          .returning();
          
        console.log(`[storage] Successfully created booking on attempt ${attempt}`);
        return booking;
      } catch (error) {
        lastError = error;
        console.error(`[storage] Error creating booking (attempt ${attempt}/${MAX_RETRIES}):`, error);
        
        // Check if this is a connection error that might resolve with a retry
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isConnectionError = 
          errorMessage.includes('ECONNREFUSED') || 
          errorMessage.includes('timeout') || 
          errorMessage.includes('connection') ||
          errorMessage.includes('network');
          
        // Only retry for connection-related errors
        if (isConnectionError && attempt < MAX_RETRIES) {
          console.log(`[storage] Connection issue detected, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          // Exponential backoff - increase delay for next retry
          delay = Math.min(delay * 1.5, 3000);
        } else if (!isConnectionError) {
          // If not a connection error, don't retry
          console.error(`[storage] Non-connection error, not retrying:`, errorMessage);
          break;
        }
      }
    }
    
    // If we got here, all retries failed
    console.error(`[storage] All ${MAX_RETRIES} attempts to create booking failed`);
    throw lastError;
  }

  /**
   * Get all bookings
   */
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(bookings.id);
  }

  /**
   * Get a booking by ID
   */
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  /**
   * Update a booking's status
   */
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    
    return updatedBooking || undefined;
  }
}

// Use DatabaseStorage for production (persistent storage)
export const storage = new DatabaseStorage();
