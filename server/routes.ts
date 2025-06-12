import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAppointmentSchema, adminLoginSchema } from "@shared/schema";
import { z } from "zod";
import { WhatsAppService } from "./whatsappService";


interface AuthenticatedRequest extends Request {
  session: Request['session'] & { adminId?: number };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes - disabled when not in Replit environment
  app.get('/api/auth/user', async (req: any, res) => {
    if (!process.env.REPL_ID) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!req.isAuthenticated() || !req.user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Check availability endpoint
  app.get("/api/appointments/check-availability", async (req, res) => {
    try {
      const { date, time } = req.query;
      
      if (!date || !time) {
        return res.status(400).json({ 
          message: "Data e horário são obrigatórios",
          available: false
        });
      }
      
      const isAvailable = await storage.checkAvailability(date as string, time as string);
      res.json({ available: isAvailable });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ 
        message: "Erro ao verificar disponibilidade",
        available: false
      });
    }
  });

  // Public booking endpoint
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Verificar disponibilidade antes de criar agendamento
      const isAvailable = await storage.checkAvailability(
        validatedData.appointmentDate, 
        validatedData.appointmentTime
      );
      
      if (!isAvailable) {
        return res.status(409).json({ 
          message: "Este horário já está ocupado. Por favor, escolha outro horário.",
          available: false
        });
      }
      
      const appointment = await storage.createAppointment(validatedData);
      
      // Gerar link do WhatsApp com mensagem de confirmação
      const serviceText = appointment.serviceType === 'basica' ? 'Manutenção Básica' : 'Manutenção Premium';
      const whatsappResult = await WhatsAppService.sendConfirmationMessage({
        customerPhone: appointment.phone,
        customerName: appointment.name,
        service: serviceText,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime,
        brand: appointment.deviceBrand
      });
      
      if (whatsappResult.success) {
        await storage.markWhatsAppSent(appointment.id);
        console.log(`WhatsApp link gerado: ${whatsappResult.whatsappLink}`);
      }
      
      res.json({ 
        success: true, 
        appointment,
        whatsappLink: whatsappResult.whatsappLink,
        message: "Agendamento criado com sucesso! Link do WhatsApp gerado para confirmação."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  });

  // Admin authentication middleware
  const requireAdminAuth = (req: AuthenticatedRequest, res: Response, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ message: "Acesso negado. Faça login como administrador." });
    }
    next();
  };

  // Admin login
  app.post("/api/admin/login", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      const admin = await storage.validateAdminLogin(validatedData.username, validatedData.password);
      
      if (!admin) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      req.session.adminId = admin.id;
      res.json({ 
        success: true, 
        message: "Login realizado com sucesso",
        admin: { id: admin.id, username: admin.username, role: admin.role }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req: AuthenticatedRequest, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ message: "Erro ao fazer logout" });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Logout realizado com sucesso" });
      });
    } else {
      res.json({ success: true, message: "Logout realizado com sucesso" });
    }
  });

  // Check admin authentication status
  app.get("/api/admin/me", async (req: AuthenticatedRequest, res) => {
    if (!req.session.adminId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    try {
      const admin = await storage.getAdminUser(req.session.adminId);
      if (!admin) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "Usuário admin não encontrado" });
      }

      res.json({ 
        admin: { id: admin.id, username: admin.username, role: admin.role }
      });
    } catch (error) {
      console.error("Error fetching admin user:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin routes (protected)
  app.get("/api/admin/appointments", requireAdminAuth, async (req, res) => {
    try {
      const { search, brand, date, status } = req.query;
      const appointments = await storage.getAppointments({
        search: search as string,
        brand: brand as string,
        date: date as string,
        status: status as string,
      });
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.put("/api/admin/appointments/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const appointment = await storage.updateAppointment(id, updateData);
      
      if (!appointment) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/admin/appointments/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAppointment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      
      res.json({ success: true, message: "Agendamento excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  app.get("/api/admin/appointments/export", requireAdminAuth, async (req, res) => {
    try {
      const appointments = await storage.getAppointments({});
      
      // Create CSV content
      const csvHeader = "Nome,Telefone,Email,Data,Horário,Marca,Modelo,Serviço,Status,Criado em\n";
      const csvRows = appointments.map(apt => 
        `"${apt.name}","${apt.phone}","${apt.email}","${apt.appointmentDate}","${apt.appointmentTime}","${apt.deviceBrand}","${apt.deviceModel}","${apt.serviceType}","${apt.status}","${apt.createdAt}"`
      ).join("\n");
      
      const csv = csvHeader + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="agendamentos.csv"');
      res.send(csv);
    } catch (error) {
      console.error("Error exporting appointments:", error);
      res.status(500).json({ message: "Failed to export appointments" });
    }
  });

  // Create initial admin user (for setup only)
  app.post("/api/admin/create", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username e password são obrigatórios" });
      }
      
      const admin = await storage.createAdminUser({ username, password });
      res.json({ 
        success: true, 
        message: "Usuário admin criado com sucesso",
        admin: { id: admin.id, username: admin.username, role: admin.role }
      });
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ message: "Erro ao criar usuário admin" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
