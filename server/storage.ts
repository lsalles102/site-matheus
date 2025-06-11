import { 
  users, 
  appointments,
  adminUsers,
  type User, 
  type UpsertUser, 
  type Appointment, 
  type InsertAppointment,
  type AdminUser,
  type InsertAdminUser
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, or, desc } from "drizzle-orm";
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
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return result;
  }

  async getAppointments(filters: {
    search?: string;
    brand?: string;
    date?: string;
    status?: string;
  }): Promise<Appointment[]> {
    let query = db.select().from(appointments);
    
    const conditions = [];
    
    if (filters.search) {
      conditions.push(
        or(
          ilike(appointments.name, `%${filters.search}%`),
          ilike(appointments.phone, `%${filters.search}%`),
          ilike(appointments.email, `%${filters.search}%`)
        )
      );
    }
    
    if (filters.brand) {
      conditions.push(eq(appointments.deviceBrand, filters.brand));
    }
    
    if (filters.date) {
      conditions.push(eq(appointments.appointmentDate, filters.date));
    }
    
    if (filters.status) {
      conditions.push(eq(appointments.status, filters.status));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const results = await query.orderBy(desc(appointments.createdAt));
    return results;
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment | undefined> {
    const [result] = await db
      .update(appointments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return result;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db
      .delete(appointments)
      .where(eq(appointments.id, id));
    return (result.rowCount || 0) > 0;
  }

  async markWhatsAppSent(id: number): Promise<void> {
    await db
      .update(appointments)
      .set({ whatsappSent: new Date() })
      .where(eq(appointments.id, id));
  }

  // Admin operations
  async createAdminUser(adminData: { username: string; password: string }): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    const [result] = await db
      .insert(adminUsers)
      .values({
        username: adminData.username,
        passwordHash: hashedPassword,
      })
      .returning();
    return result;
  }

  async validateAdminLogin(username: string, password: string): Promise<AdminUser | null> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    
    if (!admin) {
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    return isValid ? admin : null;
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id));
    return admin;
  }
}

export const storage = new DatabaseStorage();