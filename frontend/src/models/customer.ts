export interface Customer {
  
  
  id?: string;

  personalInfo: PersonalInfo;

  contactInfo: ContactInfo;

  address?: Address;

  // 💰 deuda actual
  debt?: number;

  // 📅 historial de pagos
  payments?: Payment[];

  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
}

export interface Address {
  street?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

// 💳 pagos
export interface Payment {
  amount: number;
  date: string;
}