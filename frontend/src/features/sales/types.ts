import type {
  Sale as ServiceSale,
  SaleItem as ServiceSaleItem,
  Currency as ServiceCurrency,
  SaleStatus as ServiceSaleStatus,
  SaleItemInput as ServiceSaleItemInput,
  CreateSaleData as ServiceCreateSaleData,
  TicketInfo as ServiceTicketInfo,
} from "../../services/sales.service";

export type Sale = ServiceSale;
export type SaleItem = ServiceSaleItem;
export type Currency = ServiceCurrency;
export type SaleStatus = ServiceSaleStatus;
export type SaleItemInput = ServiceSaleItemInput;
export type CreateSaleData = ServiceCreateSaleData;
export type TicketInfo = ServiceTicketInfo;