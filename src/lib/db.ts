import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
// src/lib/db.ts
export type Campaign = {
  id: number;
  title: string;
  description: string;
  priceArs: number;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  createdAt: string;
  sentAt?: string;
};

export type Contact = {
  id: number;
  campaignId: number;
  name: string;
  phone: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  error?: string;
};

// Base de datos en memoria (para desarrollo)
export const db = {
  campaigns: [] as Campaign[],
  contacts: [] as Contact[],

  // IDs autoincrementales
  _campaignId: 1,
  _contactId: 1,

  // Helper para crear campaña
  createCampaign(data: Omit<Campaign, 'id' | 'status' | 'createdAt'>) {
    const campaign: Campaign = {
      ...data,
      id: this._campaignId++,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    this.campaigns.push(campaign);
    return campaign;
  },

  // Helper para agregar contacto
  addContact(campaignId: number, data: { name: string; phone: string }) {
    const contact: Contact = {
      id: this._contactId++,
      campaignId,
      name: data.name,
      phone: data.phone,
      status: 'pending',
    };
    this.contacts.push(contact);
    return contact;
  },
};