import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Box,
  Typography,
  InputLabel,
  Button,
  LinearProgress,
} from "@mui/material";
import { useDataContext } from "../../../context/DataContext";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";

interface FunctionalInfoProps {
  onComplete: (isComplete: boolean) => void;
}

const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf.charAt(10));
};

const validatePhone = (phone: string) => {
  phone = phone.replace(/[^\d]+/g, "");
  return phone.length === 11;
};

const validateBirthDate = (birth_date: string) => {
  return /^\d{2}[-\/.]\d{2}[-\/.]\d{4}$/.test(birth_date);
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const InitialData: React.FC<FunctionalInfoProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [formData, setFormData] = useState<{
    full_name: string;
    cpf: string;
    rg: string;
    email: string;
    phone: string;
    birth_date: string;
    id_doc: string | null;
  }>({
    full_name: "",
    cpf: "",
    rg: "",
    email: "",
    phone: "",
    birth_date: "",
    id_doc: null,
  });
  const [, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (candidato) {
      setFormData((prev) => ({
        ...prev,
        full_name: candidato.full_name || "",
        cpf: candidato.cpf || "",
        rg: candidato.rg || "",
        email: candidato.email || "",
        phone: candidato.phone || "",
        birth_date: candidato.birth_date || "",
        id_doc: candidato.id_doc ? candidato.id_doc.name : "",
      }));
    }
  }, [candidato]);

  useEffect(() => {
    const isComplete =
      formData.full_name &&
      formData.cpf &&
      formData.rg &&
      formData.email &&
      formData.phone &&
      formData.birth_date &&
      formData.id_doc &&
      !Object.values(errors).some((error) => error !== "");
    onComplete(!!isComplete);
  }, [formData, errors, onComplete]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let error = "";
      let updatedValue = value;
  
      if (name === "cpf") {
        const formattedCPF = value.replace(/[^\d]+/g, "");
        if (!validateCPF(formattedCPF)) {
          error = "CPF inválido";
        } else {
          try {
            const API_URL = import.meta.env.VITE_API_URL as string; // Obter URL da API do ambiente
            const response = await axios.get(`${API_URL}/candidates/cpf/${formattedCPF}`);
  
            if (response.status === 200 && response.data) {
              error = "CPF já cadastrado";
            } else {
              updatedValue = formattedCPF.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                "$1.$2.$3-$4"
              );
            }
          } catch (err: any) {
           
          }
        }
      }
  
      if (name === "phone") {
        const formattedPhone = value.replace(/[^\d]+/g, "");
        if (!validatePhone(formattedPhone)) {
          error = "Telefone inválido, formato esperado: (99) 99999-9999";
        } else {
          updatedValue = formattedPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
      }
  
      if (name === "birth_date") {
        const formattedDate = value.replace(/[^\d]/g, "");
        if (formattedDate.length === 8) {
          const day = parseInt(formattedDate.substring(0, 2), 10);
          const month = parseInt(formattedDate.substring(2, 4), 10);
          const year = parseInt(formattedDate.substring(4), 10);
  
          if (
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= new Date(year, month, 0).getDate()
          ) {
            updatedValue = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
          } else {
            error = "Data de nascimento inválida. Verifique o formato: DD/MM/AAAA";
          }
        } else {
          error = "Data de nascimento incompleta. Formato esperado: DD/MM/AAAA";
        }
  
        if (!error && !validateBirthDate(updatedValue)) {
          error = "Data de nascimento inválida. Verifique os valores inseridos.";
        }
      }
  
      if (name === "email") {
        if (!validateEmail(value)) {
          error = "Email inválido. Verifique o formato.";
        }
      }
  
      setErrors((prev) => ({ ...prev, [name]: error }));
      setFormData((prev) => ({ ...prev, [name]: updatedValue }));
      if (!error) {
        updateCandidate({ [name]: updatedValue });
      }
    },
    [updateCandidate]
  );
  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setUploading(true);
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploading(false);
      setFile(selectedFile);
      setFormData((prev) => {
        const updatedFormData = { ...prev, id_doc: selectedFile.name };
        updateCandidate({ id_doc: selectedFile });
        return updatedFormData;
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFormData((prev) => ({ ...prev, id_doc: null }));
    updateCandidate({ id_doc: null });
  };

  return (
    <Box
    sx={{
      maxHeight: { xs: "none", md: 500 },
      overflowY: { xs: "visible", md: "auto" },
      padding: { xs: 2, md: 0 },
    }}
  >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#FF0000",
          fontWeight: "bold",
          textAlign: "left",
          fontSize: 30,
        }}
      >
        Dados Pessoais
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ fontSize: 12 }}>
        Preencher com letra maiúscula. Não abrevie.
      </Typography>
      <TextField
        fullWidth
        label="Nome completo"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="dense"
        required
        size="small"
        autoComplete="off"
        error={!!errors.full_name}
        helperText={errors.full_name}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="dense"
        required
        size="small"
        autoComplete="off"
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        fullWidth
        label="CPF (formato: 999.999.999-99)"
        name="cpf"
        value={formData.cpf}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="dense"
        required
        size="small"
        autoComplete="off"
        error={!!errors.cpf}
        helperText={errors.cpf}
      />
      <TextField
        fullWidth
        label="RG (formato: XX-99.999.999)"
        name="rg"
        value={formData.rg}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="dense"
        required
        size="small"
        autoComplete="off"
        error={!!errors.rg}
        helperText={errors.rg}
      />
      <TextField
        fullWidth
        label="Telefone (formato: (99) 99999-9999)"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="dense"
        required
        size="small"
        autoComplete="off"
        error={!!errors.phone}
        helperText={errors.phone}
      />
      <TextField
        fullWidth
        label="Data de Nascimento (formato: DD/MM/AAAA)"
        name="birth_date"
        value={formData.birth_date}
        onChange={handleChange}
        onBlur={handleBlur}
        margin="dense"
        required
        size="small"
        autoComplete="off"
        error={!!errors.birth_date}
        helperText={errors.birth_date}
      />
      <Box mt={2}>
        <InputLabel sx={{ fontSize: 14, fontWeight: "bold" }}>
          Carteira de identidade (frente e verso)
        </InputLabel>
        <Typography variant="body2" sx={{ fontSize: 12 }}>
          O arquivo deve ser inserido em formato PDF, é aceito o envio de 1 (um)
          arquivo.
        </Typography>
        {formData.id_doc ? (
          <Box display={"flex"} flexDirection={"row"} gap={3}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<RemoveCircleOutlineIcon />}
              sx={{
                color: "red",
                borderColor: "red",
                mb: 2,
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                  borderColor: "red",
                },
              }}
              onClick={handleRemoveFile}
            >
              Remover documento
            </Button>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#FF7F00" }}
              >
                Arquivo enviado:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {formData.id_doc}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{
              color: "#B2B2B2",
              borderColor: "#EDEDED",
              "&:hover": {
                backgroundColor: "#FF7F00",
                color: "#FFFFFF",
                borderColor: "#FF7F00",
              },
            }}
          >
            Adicionar documento
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        )}
        {uploading && <LinearProgress sx={{ mt: 2 }} />}
      </Box>
    </Box>
  );
};

export default InitialData;
