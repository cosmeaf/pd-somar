import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  CardMedia,
  Divider,
} from "@mui/material";
import { useDataContext } from "../../context/DataContext";
import ipgc_logo from "../../assets/ipgc_logo.svg";
import PostForm from "../../api/PostForm";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from 'axios';

const ConfirmationPage: React.FC = () => {
  const { candidato } = useDataContext();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [vagaTitle, setVagaTitle] = useState<string>("");

  useEffect(() => {
    const fetchJobPositions = async () => {
      if (candidato.job_applications && candidato.job_applications.length > 0) {
        try {
          const API_URL = import.meta.env.VITE_API_URL as string;
          const response = await axios.get(`${API_URL}/job-positions/${candidato.job_applications[0].job_position}`);
          if (response.data && response.data.title) {
            setVagaTitle(response.data.title);
          }
        } catch (err) {
          console.error("Failed to fetch job position");
        }
      }
    };
    fetchJobPositions();
  }, [candidato.job_applications]);

  if (!candidato?.full_name) {
    window.location.href = './';
    return null;
  }

  return (
    <Box
      sx={{
        overflowY: "auto",
        height: "100vh",
        bgcolor: "#F5F5F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          bgcolor: "#ffffff",
          height: { xs: "95vh", md: "90vh" },
          width: { xs: "95vw", md: "40vw" },
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          padding: { xs: 3, md: 5 },
          mb: { xs: 2, md: 2 },
        }}
      >
        <CardMedia
          component="img"
          image={ipgc_logo}
          alt="Logo IPGC"
          sx={{
            height: "auto",
            width: "auto",
            marginBottom: 4,
            alignSelf: "center",
          }}
        />
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CheckCircleOutlineIcon sx={{ color: "#FF5310", fontSize: 36 }} />
          <Typography
            sx={{ fontWeight: "bold", fontSize: 28, fontFamily: 'Inter', color: "#333" }}
          >
            Quase Tudo Pronto!
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "#666", marginBottom: 3 }}>
          Antes de enviar, confira se todas as suas informações estão corretas.
        </Typography>
        
        <Divider
          sx={{
            borderColor: "#D9D9D9",
            borderWidth: 1,
            width: "100%",
            marginBottom: 3,
          }}
        />
        <Box>
          {candidato.job_applications && candidato.job_applications.length > 0 && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#444", fontSize: 22, marginBottom: 2 }}
              >
                Vagas Pretendidas
              </Typography>
              {candidato.job_applications.map((application, index) => (
                <Box key={index} mt={2}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#444", fontSize: 18, marginBottom: 1 }}
                  >
                    {vagaTitle || `Inscrição de Trabalho ${index + 1}`}
                  </Typography>
                  
                  {application.school_units && application.school_units.length > 0 && (
                    <Typography variant="body1" sx={{ color: "#555" }}>
                      Unidades Escolares: {application.school_units.join(", ")}
                    </Typography>
                  )}
                  {application.work_shifts && application.work_shifts.length > 0 && (
                    <Typography variant="body1" sx={{ color: "#555" }}>
                      Turnos de Trabalho: {application.work_shifts.join(", ")}
                    </Typography>
                  )}
                </Box>
              ))}
            </>
          )}

          {candidato.full_name && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#444", fontSize: 22, marginTop: 4, marginBottom: 2 }}
              >
                Dados Pessoais
              </Typography>
              {[
                candidato.full_name ? { label: "Nome Completo", value: candidato.full_name } : null,
                candidato.cpf ? { label: "CPF", value: candidato.cpf } : null,
                candidato.email ? { label: "E-mail", value: candidato.email } : null,
                candidato.rg ? { label: "RG", value: candidato.rg } : null,
                candidato.phone ? { label: "Telefone", value: candidato.phone } : null,
                candidato.birth_date ? { label: "Data de Nascimento", value: candidato.birth_date } : null,
              ].filter(info => info !== null).map((info, index) => (
                <Typography key={index} variant="body1" sx={{ color: "#555" }}>
                  {info.label}: {info.value}
                </Typography>
              ))}
            </>
          )}

          {candidato.address && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#444", fontSize: 22, marginTop: 4, marginBottom: 2 }}
              >
                Endereço
              </Typography>
              {[
                candidato.address?.cep ? { label: "CEP", value: candidato.address?.cep } : null,
                candidato.address?.municipality ? { label: "Município", value: candidato.address?.municipality } : null,
                candidato.address?.street ? { label: "Rua", value: candidato.address?.street } : null,
                candidato.address?.number ? { label: "Número", value: candidato.address?.number?.toString() } : null,
                candidato.address?.complement ? { label: "Complemento", value: candidato.address?.complement } : null,
                candidato.address?.neighborhood ? { label: "Bairro", value: candidato.address?.neighborhood } : null,
              ].filter(info => info !== null).map((addressInfo, index) => (
                <Typography key={index} variant="body1" sx={{ color: "#555" }}>
                  {addressInfo.label}: {addressInfo.value}
                </Typography>
              ))}
            </>
          )}

          {(candidato.pos_lato_especializacao || candidato.pos_stricto_mestrado || candidato.pos_stricto_doutorado || candidato.id_doc || candidato.continuous_training || candidato.continuous_training_doc || candidato.state_school_experience || candidato.private_school_experience || candidato.high_school_experience || candidato.elementary_school_experience || candidato.training_area || candidato.training_extra_courses || candidato.training) && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#444", fontSize: 22, marginTop: 4, marginBottom: 2 }}
              >
                Informações Funcionais
              </Typography>
              {[
                candidato.pos_lato_especializacao ? { label: "Pós Lato Especialização", value: candidato.pos_lato_especializacao } : null,
                candidato.state_school_experience ? { label: "Experiência na Rede Estadual", value: candidato.state_school_experience } : null,
                candidato.private_school_experience ? { label: "Experiência na Rede Privada", value: candidato.private_school_experience } : null,
                candidato.high_school_experience ? { label: "Experiência no Ensino Médio", value: candidato.high_school_experience } : null,
                candidato.elementary_school_experience ? { label: "Experiência no Ensino Fundamental", value: candidato.elementary_school_experience } : null,
                candidato.training_area ? { label: "Área de Formação", value: candidato.training_area } : null,
                candidato.training_extra_courses ? { label: "Cursos Extras de Formação", value: candidato.training_extra_courses } : null,
                candidato.training ? { label: "Nível de Formação", value: candidato.training } : null,
                candidato.pos_stricto_mestrado ? { label: "Pós Stricto Mestrado", value: candidato.pos_stricto_mestrado } : null,
                candidato.pos_stricto_doutorado ? { label: "Pós Stricto Doutorado", value: candidato.pos_stricto_doutorado } : null,
                candidato.id_doc ? { label: "ID Documento", value: candidato.id_doc } : null,
                { label: "Formação Contínua", value: candidato.continuous_training ? "Sim" : "Não" },
                candidato.continuous_training_doc ? { label: "Documento Formação Contínua", value: candidato.continuous_training_doc } : null,
              ].filter(info => info !== null).map((info, index) => (
                <Typography key={index} variant="body1" sx={{ color: "#555" }}>
                  {info.label}: {info.value instanceof File ? info.value.name : info.value}
                </Typography>
              ))}
            </>
          )}

          {candidato.observations && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#444", fontSize: 22, marginTop: 4, marginBottom: 2 }}
              >
                Observações
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                Observações: {candidato.observations}
              </Typography>
            </>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                sx={{
                  color: "#FF7F00",
                  "&.Mui-checked": { color: "#FF7F00" },
                }}
              />
            }
            label="Eu li e confirmo todas as informações acima."
            sx={{ mt: 4 }}
          />

        </Box>
        {isConfirmed && <PostForm />}
      </Box>
    </Box>
  );
};

export default ConfirmationPage;
