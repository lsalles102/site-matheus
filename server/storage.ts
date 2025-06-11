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
    let query = supabase
      .from('appointments')
      .select('*');

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.brand) {
      query = query.eq('device_brand', filters.brand);
    }

    if (filters.date) {
      query = query.eq('appointment_date', filters.date);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Map snake_case back to camelCase for all appointments
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      email: item.email,
      appointmentDate: item.appointment_date,
      appointmentTime: item.appointment_time,
      deviceBrand: item.device_brand,
      deviceModel: item.device_model,
      serviceType: item.service_type,
      serviceLocation: item.service_location,
      address: item.address,
      status: item.status,
      whatsappSent: item.whatsapp_sent,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment | undefined> {
    // Map camelCase to snake_case for update
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.appointmentDate !== undefined) updateData.appointment_date = data.appointmentDate;
    if (data.appointmentTime !== undefined) updateData.appointment_time = data.appointmentTime;
    if (data.deviceBrand !== undefined) updateData.device_brand = data.deviceBrand;
    if (data.deviceModel !== undefined) updateData.device_model = data.deviceModel;
    if (data.serviceType !== undefined) updateData.service_type = data.serviceType;
    if (data.serviceLocation !== undefined) updateData.service_location = data.serviceLocation;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.status !== undefined) updateData.status = data.status;
    
    updateData.updated_at = new Date().toISOString();

    const { data: result, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map snake_case back to camelCase
    return {
      id: result.id,
      name: result.name,
      phone: result.phone,
      email: result.email,
      appointmentDate: result.appointment_date,
      appointmentTime: result.appointment_time,
      deviceBrand: result.device_brand,
      deviceModel: result.device_model,
      serviceType: result.service_type,
      serviceLocation: result.service_location,
      address: result.address,
      status: result.status,
      whatsappSent: result.whatsapp_sent,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  }

  async markWhatsAppSent(id: number): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ whatsapp_sent: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  }

  // Admin operations
  async createAdminUser(adminData: { username: string; password: string }): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        username: adminData.username,
        password_hash: hashedPassword,
        role: 'admin'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async validateAdminLogin(username: string, password: string): Promise<AdminUser | null> {
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !admin) {
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    
    return isValid ? admin : null;
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data || undefined;
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