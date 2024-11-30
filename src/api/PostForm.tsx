import axios from "axios";
import { Button } from "@mui/material";
import { useDataContext } from "../context/DataContext";
import { useEffect, useState } from "react";

const PostForm: React.FC = () => {
  const { candidato, updateCandidate } = useDataContext();
  const [, setJobs] = useState<any[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL as string;
        const response = await axios.get(`${API_URL}/job-positions`);
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handlePost = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL as string;

      if (!candidato || !candidato.address) {
        throw new Error("Dados do candidato ou endereço estão ausentes.");
      }

      const addressResponse = await axios.post(`${API_URL}/addresses/`, {
        municipality: candidato.address.municipality,
        cep: candidato.address.cep,
        street: candidato.address.street,
        number: candidato.address.number,
        complement: candidato.address.complement,
        neighborhood: candidato.address.neighborhood,
      });

      const addressData = addressResponse.data;
      updateCandidate({ address: addressData });
      const addressId = addressData.id;

      if (!candidato.full_name || !candidato.cpf || !candidato.rg) {
        throw new Error("Dados obrigatórios do candidato estão ausentes.");
      }

      const formData = new FormData();
      formData.append("full_name", candidato.full_name);
      formData.append("cpf", candidato.cpf.replace(/\D/g, "").slice(0, 11));
      formData.append("rg", candidato.rg);
      formData.append("phone", candidato.phone);
      formData.append("email", candidato.email);
      formData.append(
        "birth_date",
        candidato.birth_date
            ? candidato.birth_date.split("/").reverse().join("-") // Transforma DD/MM/YYYY em YYYY-MM-DD
            : ""
    );
    
    
    
      
      formData.append("mec_certified", String(candidato.mec_certified));
      formData.append("continuous_training", String(candidato.continuous_training));
      formData.append("observations", candidato.observations || "");
      formData.append("address", String(addressId));
      formData.append("state_school_experience", candidato.state_school_experience);
      formData.append("private_school_experience", candidato.private_school_experience);
      formData.append("high_school_experience", candidato.high_school_experience);
      formData.append("elementary_school_experience", candidato.elementary_school_experience);
      formData.append("training_area", candidato.training_area);
      formData.append("training_extra_courses", candidato.training_extra_courses);
      formData.append("training", candidato.training);

      if (candidato.id_doc instanceof File) {
        formData.append("id_doc", candidato.id_doc, candidato.id_doc.name);
      }
      if (candidato.continuous_training_doc instanceof File) {
        formData.append(
          "continuous_training_doc",
          candidato.continuous_training_doc,
          candidato.continuous_training_doc.name
        );
      }
      if (candidato.pos_lato_especializacao instanceof File) {
        formData.append(
          "pos_lato_especializacao",
          candidato.pos_lato_especializacao,
          candidato.pos_lato_especializacao.name
        );
      }
      if (candidato.pos_stricto_mestrado instanceof File) {
        formData.append(
          "pos_stricto_mestrado",
          candidato.pos_stricto_mestrado,
          candidato.pos_stricto_mestrado.name
        );
      }
      if (candidato.pos_stricto_doutorado instanceof File) {
        formData.append(
          "pos_stricto_doutorado",
          candidato.pos_stricto_doutorado,
          candidato.pos_stricto_doutorado.name
        );
      }

      const candidateResponse = await axios.post(`${API_URL}/candidates/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const candidateData = candidateResponse.data;
      console.log("Candidato criado com sucesso", candidateData);

      for (const job of candidato.job_applications) {
        const jobApplicationData = {
          job_position: job.job_position,
          school_units: job.school_units,
          work_shifts: job.work_shifts.map((shift) => shift.toLowerCase()),
          candidate: candidateData.id,
        };

        await axios.post(`${API_URL}/job-applications/`, jobApplicationData);
      }

      window.location.href = "/finish";
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          console.error("Erro ao criar candidato:", error.response.data.detail);
          alert(`Erro: ${error.response.data.detail}`);
        } else if (error.response?.data?.message) {
          console.error("Erro ao criar candidato:", error.response.data.message);
          alert(`Erro: ${error.response.data.message}`);
        } else if (error.response?.data?.non_field_errors) {
          console.error("Erro ao criar candidato:", error.response.data.non_field_errors);
          alert(`Erro: ${error.response.data.non_field_errors}`);
        } else {
          console.error("Erro ao criar candidato:", error.response?.data || error.message);
          alert(`Erro: ${error.response?.data || error.message}`);
        }
      } else {
        console.error("Erro inesperado:", error);
        alert(`Erro inesperado: ${error.message}`);
      }
    }
  };

  console.log(candidato);

  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: "#FF5310",
        color: "#fff",
        "&:hover": {
          bgcolor: "#FF4500",
        },
      }}
      onClick={handlePost}
    >
      Confirmar Dados
    </Button>
  );
};

export default PostForm;
