import { 
  users,
  subscriptionPlans,
  userSubscriptions,
  maintenanceTickets,
  activityLogs,
  type User,
  type InsertUser,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type UserSubscription,
  type InsertUserSubscription,
  type MaintenanceTicket,
  type InsertMaintenanceTicket,
  type ActivityLog,
  type InsertActivityLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Subscription Plans
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: string, updates: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  deleteSubscriptionPlan(id: string): Promise<boolean>;
  
  // User Subscriptions
  getAllUserSubscriptions(): Promise<(UserSubscription & { user: User; plan: SubscriptionPlan })[]>;
  getUserSubscriptions(userId: string): Promise<(UserSubscription & { plan: SubscriptionPlan })[]>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: string, updates: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined>;
  deleteUserSubscription(id: string): Promise<boolean>;
  
  // Maintenance Tickets
  getAllMaintenanceTickets(): Promise<(MaintenanceTicket & { assignedToUser: User | null })[]>;
  getMaintenanceTicket(id: string): Promise<(MaintenanceTicket & { assignedToUser: User | null }) | undefined>;
  createMaintenanceTicket(ticket: InsertMaintenanceTicket): Promise<MaintenanceTicket>;
  updateMaintenanceTicket(id: string, updates: Partial<InsertMaintenanceTicket>): Promise<MaintenanceTicket | undefined>;
  deleteMaintenanceTicket(id: string): Promise<boolean>;
  
  // Activity Logs
  getRecentActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  clearActivityLogs(): Promise<boolean>;
  
  // Analytics
  getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      updatedAt: new Date()
    }).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Subscription Plans
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).orderBy(desc(subscriptionPlans.createdAt));
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan || undefined;
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db.insert(subscriptionPlans).values({
      ...insertPlan,
      updatedAt: new Date()
    }).returning();
    return plan;
  }

  async updateSubscriptionPlan(id: string, updates: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.update(subscriptionPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return plan || undefined;
  }

  async deleteSubscriptionPlan(id: string): Promise<boolean> {
    const result = await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // User Subscriptions
  async getAllUserSubscriptions(): Promise<(UserSubscription & { user: User; plan: SubscriptionPlan })[]> {
    return await db.select()
      .from(userSubscriptions)
      .leftJoin(users, eq(userSubscriptions.userId, users.id))
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .orderBy(desc(userSubscriptions.createdAt))
      .then(results => results.map(result => ({
        ...result.user_subscriptions,
        user: result.users!,
        plan: result.subscription_plans!
      })));
  }

  async getUserSubscriptions(userId: string): Promise<(UserSubscription & { plan: SubscriptionPlan })[]> {
    return await db.select()
      .from(userSubscriptions)
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(desc(userSubscriptions.createdAt))
      .then(results => results.map(result => ({
        ...result.user_subscriptions,
        plan: result.subscription_plans!
      })));
  }

  async createUserSubscription(insertSubscription: InsertUserSubscription): Promise<UserSubscription> {
    const [subscription] = await db.insert(userSubscriptions).values({
      ...insertSubscription,
      updatedAt: new Date()
    }).returning();
    return subscription;
  }

  async updateUserSubscription(id: string, updates: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined> {
    const [subscription] = await db.update(userSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSubscriptions.id, id))
      .returning();
    return subscription || undefined;
  }

  async deleteUserSubscription(id: string): Promise<boolean> {
    const result = await db.delete(userSubscriptions).where(eq(userSubscriptions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Maintenance Tickets
  async getAllMaintenanceTickets(): Promise<(MaintenanceTicket & { assignedToUser: User | null })[]> {
    return await db.select()
      .from(maintenanceTickets)
      .leftJoin(users, eq(maintenanceTickets.assignedToUserId, users.id))
      .orderBy(desc(maintenanceTickets.createdAt))
      .then(results => results.map(result => ({
        ...result.maintenance_tickets,
        assignedToUser: result.users || null
      })));
  }

  async getMaintenanceTicket(id: string): Promise<(MaintenanceTicket & { assignedToUser: User | null }) | undefined> {
    const [result] = await db.select()
      .from(maintenanceTickets)
      .leftJoin(users, eq(maintenanceTickets.assignedToUserId, users.id))
      .where(eq(maintenanceTickets.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.maintenance_tickets,
      assignedToUser: result.users || null
    };
  }

  async createMaintenanceTicket(insertTicket: InsertMaintenanceTicket): Promise<MaintenanceTicket> {
    const [ticket] = await db.insert(maintenanceTickets).values({
      ...insertTicket,
      updatedAt: new Date()
    }).returning();
    return ticket;
  }

  async updateMaintenanceTicket(id: string, updates: Partial<InsertMaintenanceTicket>): Promise<MaintenanceTicket | undefined> {
    const [ticket] = await db.update(maintenanceTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(maintenanceTickets.id, id))
      .returning();
    return ticket || undefined;
  }

  async deleteMaintenanceTicket(id: string): Promise<boolean> {
    const result = await db.delete(maintenanceTickets).where(eq(maintenanceTickets.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Activity Logs
  async getRecentActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db.insert(activityLogs).values(insertLog).returning();
    return log;
  }

  async clearActivityLogs(): Promise<boolean> {
    const result = await db.delete(activityLogs);
    return (result.rowCount ?? 0) >= 0;
  }

  // Analytics
  async getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
  }> {
    const [userStats] = await db.select({
      totalUsers: count(),
      activeUsers: sql<number>`count(*) filter (where ${users.status} = 'Active')`
    }).from(users);

    const [subscriptionStats] = await db.select({
      totalSubscriptions: count(),
      activeSubscriptions: sql<number>`count(*) filter (where ${userSubscriptions.status} = 'Active')`
    }).from(userSubscriptions);

    const [ticketStats] = await db.select({
      openTickets: sql<number>`count(*) filter (where ${maintenanceTickets.status} = 'Open')`,
      inProgressTickets: sql<number>`count(*) filter (where ${maintenanceTickets.status} = 'In Progress')`,
      resolvedTickets: sql<number>`count(*) filter (where ${maintenanceTickets.status} = 'Resolved')`
    }).from(maintenanceTickets);

    return {
      totalUsers: userStats.totalUsers,
      activeUsers: userStats.activeUsers,
      totalSubscriptions: subscriptionStats.totalSubscriptions,
      activeSubscriptions: subscriptionStats.activeSubscriptions,
      openTickets: ticketStats.openTickets,
      inProgressTickets: ticketStats.inProgressTickets,
      resolvedTickets: ticketStats.resolvedTickets
    };
  }
}

export const storage = new DatabaseStorage();
