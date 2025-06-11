import { 
  type User, 
  type UpsertUser, 
  type Appointment, 
  type InsertAppointment,
  type AdminUser,
  type InsertAdminUser
} from "@shared/schema";
import { supabase } from "./db";
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
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
    
    return data || [];
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment | undefined> {
    const { data: result, error } = await supabase
      .from('appointments')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return result;
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