import * as stockService from "../../services/stock.service";
import type { StockMovement, CreateStockMovement } from "./types";

export type { StockMovement, CreateStockMovement };

// Mapeo explícito de acciones de infraestructura hacia el dominio del feature
export const fetchStockMovements = stockService.getStockMovements;

export const fetchMovementsByProduct = stockService.getMovementsByProduct;

export const fetchStockMovementById = stockService.getStockMovementById;

export const createStockMovementAction = stockService.createStockMovement;

export const fetchStockSummary = stockService.getStockSummary;