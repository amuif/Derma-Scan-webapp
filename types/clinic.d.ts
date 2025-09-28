export interface Status {
  approved: "APPROVED";
  pending: "PENDING";
}
export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  specialties: string[];
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClinic {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  specialties: string[];
  status: string;
}

export interface UpdateClinic {
  name?: string;
  address?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  specialties?: string[];
  status?: string;
}

export interface CreateClinicPayload extends CreateClinic {
  token: string;
}

export interface UpdateClinicPayload extends UpdateClinic {
  id: string;
  token: string;
}
