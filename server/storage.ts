import { 
  type User, 
  type UpsertUser, 
  type Appointment, 
  type InsertAppointment,
  type AdminUser,
  type InsertAdminUser,
  users,
  appointments,
  adminUsers
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Admin operations
  createAdminUser(adminData: { username: string; password: string }): Promise<AdminUser>;
  validateAdminLogin(username: string, password: string): Promise<AdminUser | null>;
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  
  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(filters: {
    search?: string;
    brand?: string;
    date?: string;
    status?: string;
  }): Promise<Appointment[]>;
  updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  markWhatsAppSent(id: number): Promise<void>;
  checkAvailability(date: string, time: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const result = await db.insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: userData
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    try {
      const result = await db.insert(appointments)
        .values({
          ...appointment,
          status: 'confirmado'
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async getAppointments(filters: {
    search?: string;
    brand?: string;
    date?: string;
    status?: string;
  }): Promise<Appointment[]> {
    try {
      let whereConditions = [];

      // Apply filters
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(
          or(
            like(appointments.name, searchTerm),
            like(appointments.phone, searchTerm),
            like(appointments.email, searchTerm)
          )
        );
      }

      if (filters.brand) {
        whereConditions.push(eq(appointments.deviceBrand, filters.brand));
      }

      if (filters.date) {
        whereConditions.push(eq(appointments.appointmentDate, filters.date));
      }

      if (filters.status) {
        whereConditions.push(eq(appointments.status, filters.status));
      }

      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const result = await db
        .select()
        .from(appointments)
        .where(whereClause)
        .orderBy(desc(appointments.createdAt));

      return result;
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment | undefined> {
    try {
      const result = await db
        .update(appointments)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(appointments.id, id))
        .returning();
      
      return result[0] || undefined;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  async deleteAppointment(id: number): Promise<boolean> {
    try {
      await db.delete(appointments).where(eq(appointments.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  async markWhatsAppSent(id: number): Promise<void> {
    try {
      await db
        .update(appointments)
        .set({ whatsappSent: new Date() })
        .where(eq(appointments.id, id));
    } catch (error) {
      console.error('Error marking WhatsApp sent:', error);
      throw error;
    }
  }

  async checkAvailability(date: string, time: string): Promise<boolean> {
    try {
      const existingAppointments = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.appointmentDate, date),
            eq(appointments.appointmentTime, time),
            eq(appointments.status, "confirmado")
          )
        );
      
      // Se não há agendamentos no mesmo horário, está disponível
      return existingAppointments.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  // Admin operations
  async createAdminUser(adminData: { username: string; password: string }): Promise<AdminUser> {
    try {
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      
      const result = await db.insert(adminUsers)
        .values({
          username: adminData.username,
          passwordHash: hashedPassword,
          role: 'admin'
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  async validateAdminLogin(username: string, password: string): Promise<AdminUser | null> {
    try {
      const result = await db.select()
        .from(adminUsers)
        .where(eq(adminUsers.username, username))
        .limit(1);
      
      const admin = result[0];
      if (!admin) {
        return null;
      }

      const isValid = await bcrypt.compare(password, admin.passwordHash);
      
      return isValid ? admin : null;
    } catch (error) {
      console.error('Error validating admin login:', error);
      return null;
    }
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    try {
      const result = await db.select()
        .from(adminUsers)
        .where(eq(adminUsers.id, id))
        .limit(1);
      
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting admin user:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();

// Note: Supabase table names use snake_case, so we need to map between camelCase and snake_case
// The field mappings are:
// appointmentDate -> appointment_date
// appointmentTime -> appointment_time
// deviceBrand -> device_brand
// deviceModel -> device_model
// serviceType -> service_type
// whatsappSent -> whatsapp_sent
// createdAt -> created_at
// updatedAt -> updated_at
// passwordHash -> password_hash