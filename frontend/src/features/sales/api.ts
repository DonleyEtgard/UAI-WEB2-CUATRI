import * as salesService from "../../services/sales.service";
import type {
  Sale,
  SaleItem,
  Currency,
  SaleStatus,
  SaleItemInput,
  CreateSaleData,
  TicketInfo,
} from "./types";

// Re-export types for convenience within the feature
export type { Sale, SaleItem, Currency, SaleStatus, SaleItemInput, CreateSaleData, TicketInfo };

// Re-export service functions as feature API actions
export const fetchSales = salesService.getSales;

export const createSaleAction = salesService.createSale;

export const fetchSaleItems = salesService.getSaleItems;

export const fetchSaleItemById = salesService.getSaleItemById;

export const fetchItemsBySale = salesService.getItemsBySale;

export const deleteSaleItemAction = salesService.deleteSaleItem;

export const fetchTicket = salesService.getTicket;

export const sendTicketWhatsAppAction = salesService.sendTicketWhatsApp;

export const sendTicketTelegramAction = salesService.sendTicketTelegram;