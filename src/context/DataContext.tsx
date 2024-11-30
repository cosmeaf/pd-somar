// Imports
import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface Candidato {
  id: number;
  cpf: string;
  rg: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  id_doc: File | null;
  state_school_experience: string;
  private_school_experience: string;
  high_school_experience: string;
  elementary_school_experience: string;
  training_area: string;
  training_extra_courses: string;
  training: string;
  pos_lato_especializacao: File | null;
  pos_stricto_mestrado: File | null;
  pos_stricto_doutorado: File | null;
  mec_certified: boolean;
  continuous_training: boolean;
  continuous_training_doc: File | null;
  observations: string;
  job_applications: JobApplication[];
  address: Address;
}

interface JobApplication {
  job_position: number | null;
  school_units: number[];
  work_shifts: string[];
}

interface Address {
  id: number | null;
  municipality: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
}

interface LGPD {
  id: number;
  full_name: string;
  email: string;
  consent_for_data_processing: boolean;
  consent_for_marketing: boolean;
  consent_for_third_party_sharing: boolean;
  data_retention_period: number;
}

interface DataContextType {
  candidato: Candidato;
  addresses: Address[];
  lgpd: LGPD;
  updateCandidate: (updatedCandidate: Partial<Candidato>) => void;
  updateLGPD: (updatedLGPD: Partial<LGPD>) => void;
}

// Candidato (exemplo inicial)
const defaultCandidate: Candidato = {
  id: 1,
  cpf: "",
  rg: "",
  full_name: "",
  email: "",
  phone: "",
  birth_date: "",
  id_doc: null,
  state_school_experience: "",
  private_school_experience: "",
  high_school_experience: "",
  elementary_school_experience: "",
  training_area: "",
  training_extra_courses: "",
  training: "",
  pos_lato_especializacao: null,
  pos_stricto_mestrado: null,
  pos_stricto_doutorado: null,
  mec_certified: false,
  continuous_training: false,
  continuous_training_doc: null,
  observations: "",
  job_applications: [
    {
      job_position: null,
      school_units: [],
      work_shifts: [],
    },
  ],
  address: {
    id: null,
    municipality: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
  },
};

// Address (exemplo inicial)
const addresses: Address[] = [
  {
    id: null,
    municipality: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
  },
];

// LGPD (exemplo inicial)
const defaultLGPD: LGPD = {
  id: 1,
  full_name: "",
  email: "",
  consent_for_data_processing: false,
  consent_for_marketing: false,
  consent_for_third_party_sharing: false,
  data_retention_period: 0,
};

// Criar o contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Criar o provider do contexto
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [candidate, setCandidate] = useState<Candidato>(defaultCandidate);
  const [lgpd, setLGPD] = useState<LGPD>(defaultLGPD);

  const updateCandidate = (updatedCandidate: Partial<Candidato>) => {
    setCandidate((prev) => ({ ...prev, ...updatedCandidate }));
  };

  const updateLGPD = (updatedLGPD: Partial<LGPD>) => {
    setLGPD((prev) => ({ ...prev, ...updatedLGPD }));
  };

  return (
    <DataContext.Provider
      value={{
        candidato: candidate,
        addresses,
        lgpd,
        updateCandidate,
        updateLGPD,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Criar um hook para acessar o contexto
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

export default DataContext;
