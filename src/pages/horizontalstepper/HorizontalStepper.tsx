/* eslint-disable no-fallthrough */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import ipgc_logo from "../../assets/ipgc_logo.svg";
import background from "../../assets/background.jpeg";

import Address from "./address/Address";
import FunctionalInfo from "./functionalinfo/FunctionalInfo";
import InitialData from "./initialdata/InitialData";
import Jobs from "./jobs/Jobs";
import JobsItem from "./jobs/JobsItem";
import Mec from "./mec/Mec";
import ProfessionalExperience from "./professionalexperience/ProfessionalExperience";
import { CssBaseline } from "@mui/material";
import { useDataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";

const steps = [
  "Dados Iniciais",
  "Trabalhos",
  "Detalhes dos Trabalhos",
  "Experiências Profissionais",
  "Endereço",
  "MEC",
  "Informações Funcionais",
];

const HorizontalStepper: React.FC = () => {
  const { candidato } = useDataContext();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeJobStep, setActiveJobStep] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  useEffect(() => {
    if (activeStep === steps.length) {
      navigate("/confirm");
    }
  }, [activeStep, navigate]);

  const handleNext = () => {
    if (activeStep === 2 && activeJobStep < candidato.job_applications.length - 1) {
      setActiveJobStep((prevActiveJobStep) => prevActiveJobStep + 1);
    } else if (activeStep < steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 2 && activeJobStep > 0) {
      setActiveJobStep((prevActiveJobStep) => prevActiveJobStep - 1);
    } else if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStepCompletion = (stepIndex: number, isComplete: boolean) => {
    setIsStepComplete((prev) => {
      const updatedSteps = [...prev];
      updatedSteps[stepIndex] = isComplete;
      return updatedSteps;
    });
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <InitialData
            onComplete={(isComplete) => handleStepCompletion(stepIndex, isComplete)}
          />
        );
      case 1:
        return (
          <Jobs
            onComplete={(isComplete) => handleStepCompletion(stepIndex, isComplete)}
          />
        );
      case 2:
        return candidato.job_applications.length > 0 ? (
          <JobsItem
            key={candidato.job_applications[activeJobStep].job_position}
            jobApplication={{ ...candidato.job_applications[activeJobStep] }}
            jobPosition={{
              id: candidato.job_applications[activeJobStep].job_position,
              title: `Vaga ${activeJobStep + 1}`,
            }}
            onComplete={(isComplete) => handleStepCompletion(stepIndex, isComplete)}
          />
        ) : (
          <Typography variant="body1">Nenhuma vaga selecionada</Typography>
        );
      case 3:
        return (
          <ProfessionalExperience
            onComplete={(isComplete) => handleStepCompletion(stepIndex, isComplete)}
          />
        );
      case 4:
        return (
          <Address
            onComplete={(isComplete) => handleStepCompletion(stepIndex, isComplete)}
          />
        );
      case 5:
        return (
          <Mec
            onComplete={(isComplete) => handleStepCompletion(stepIndex, isComplete)}
          />
        );
      case 6:
        return (
          <FunctionalInfo
            onComplete={(isComplete) => handleStepCompletion(stepIndex, isComplete)}
          />
        );

      default:
        return "Etapa desconhecida";
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100%",
          bgcolor: "#F5F5F5",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Lado Esquerdo: Informação com Fundo */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            position: "relative",
            backgroundImage: `linear-gradient(to top, #FF5310, rgba(255, 255, 255, 0)), url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: { xs: 2, md: 5 },
          }}
        >
          {/* Sobreposição com conteúdo */}
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.85)",
              borderRadius: "10px",
              padding: { xs: 2, md: 4 },
              maxWidth: "90%",
              margin: "auto",
              marginTop: { xs: 3, md: 10 },
            }}
          >
            <CardMedia
              component="img"
              image={ipgc_logo}
              alt="Logo IPGC"
              sx={{
                height: "auto",
                width: "100px",
                marginBottom: 2,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              Quem somos
            </Typography>
            <Typography variant="body1">
              Somos pioneiros no formato e execução de projetos inovadores.
              Nossa história começou em 2008, em Divinópolis, centro-oeste de
              Minas Gerais, com o Movimento Integral da Cidade - Mov Cidade.
              Nosso objetivo era discutir pautas públicas, em especial as de
              saúde. <br />
              <br />
              Anos depois, evoluímos para o Instituto de Planejamento e Gestão
              de Cidades e, em 2017, na busca por um novo horizonte para a
              infraestrutura das cidades, migramos para a capital mineira.
              <br />
              <br />
              Em maio de 2022, fomos reconhecidos pela ONU como modelo de
              sucesso no planejamento e gestão de projetos de parcerias com o
              setor privado.
            </Typography>
          </Box>
        </Box>

        {/* Lado Direito: Formulário */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: { xs: 2, md: 5 },
            bgcolor: "#ffffff",
          }}
        >
          <Box>
            {/* Progresso Linear */}
            <Typography variant="body1" sx={{ color: "#B2B2B2" }}>
              {`${activeStep + 1}/${steps.length}`}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((activeStep + 1) / steps.length) * 100}
              sx={{
                height: 4,
                width: "150px",
                borderRadius: 5,
                bgcolor: "#D9D9D9",
                top: 16,
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#FF5310",
                },
              }}
            />
            {/* Conteúdo do Formulário */}
            <Box sx={{ marginTop: 4 }}>{getStepContent(activeStep)}</Box>
          </Box>

          {/* Botões de Navegação */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 && activeJobStep === 0}
              sx={{
                color: "#FF5310",
                borderColor: "#FF5310",
                "&:hover": {
                  borderColor: "#FF4500",
                  color: "#FF4500",
                },
              }}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepComplete[activeStep]}
              sx={{
                bgcolor: "#FF5310",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#FF4500",
                },
              }}
            >
              {activeStep === steps.length - 1 ? "Confirmar" : "Próximo"}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HorizontalStepper;
