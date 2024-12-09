import React, { useState, useEffect } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Button, LinearProgress, TextField } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDataContext } from "../../../context/DataContext";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface FunctionalInfoProps {
  onComplete: (isComplete: boolean) => void;
}

const FunctionalInfo: React.FC<FunctionalInfoProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [hasExperience, setHasExperience] = useState<string>(candidato.continuous_training ? "sim" : "nao");
  const [fileName, setFileName] = useState<File | null | undefined>(candidato.continuous_training_doc ? candidato.continuous_training_doc : null);
  const [uploading, setUploading] = useState(false);
  const [observations, setObservations] = useState<string>(candidato.observations || "");
  const [technologicalLevel, setTechnologicalLevel] = useState<string>(candidato.technological_level || "");
  const [classesPerWeek, setClassesPerWeek] = useState<string>(candidato.classes_per_week || "");

  useEffect(() => {
    updateCandidate({
      continuous_training: hasExperience === "sim",
      continuous_training_doc: fileName ? fileName : undefined,
      observations,
      technological_level: technologicalLevel,
      classes_per_week: classesPerWeek,
    });

    onComplete(
      (technologicalLevel !== "" && classesPerWeek !== "") &&
      hasExperience === "nao" ||
      (technologicalLevel !== "" && classesPerWeek !== "") && (hasExperience === "sim" && !!fileName) 
 
    );
  }, [hasExperience, fileName, observations, technologicalLevel, classesPerWeek, updateCandidate, onComplete]);

  const handleExperienceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasExperience(event.target.value);
    setFileName(undefined);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        alert("Apenas arquivos PDF são permitidos.");
        return;
      }
      setUploading(true);
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploading(false);
      setFileName(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFileName(undefined);
  };

  const handleTechnologicalLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTechnologicalLevel(event.target.value);
  };

  const handleClassesPerWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9]*$/.test(value)) {
      setClassesPerWeek(value);
    }
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
        Informações Funcionais Adicionais
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
        Você possui experiência em formação continuada de professores?
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "#444444", marginBottom: -1 }}>
        PNAIC, Pacto Nacional pelo Fortalecimento do Ensino Médio, PIP, Projeto Desenvolvimento das Aprendizagens, REANP, entre outros.
      </Typography>
      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <RadioGroup
          aria-label="experiencia"
          name="experiencia"
          value={hasExperience}
          onChange={handleExperienceChange}
        >
          <FormControlLabel value="sim" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Sim" />
          <FormControlLabel value="nao" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Não" />
        </RadioGroup>
      </FormControl>

      {hasExperience === "sim" && (
        <Box mt={4}>
          <Typography variant="body1" sx={{ mt: 4, fontWeight: "bold" }}>
            Anexar documento de experiência em formação continuada de professores
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            O arquivo deve ser inserido em formato PDF, é aceito o envio de 1 (um) arquivo.
          </Typography>
          {fileName ? (
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<RemoveCircleOutlineIcon />}
                sx={{
                  color: "red",
                  borderColor: "red",
                  mb: 2,
                  '&:hover': {
                    backgroundColor: "red",
                    color: "white",
                    borderColor: "red",
                  },
                }}
                onClick={handleRemoveFile}
              >
                Remover arquivo
              </Button>
              <Box display={"flex"} gap={1}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: "bold", color: "#FF7F00" }}>Arquivo enviado:</Typography>
                <Typography variant="body2" sx={{ mb: 2, wordWrap: "break-word", maxWidth: 300 }}>{fileName.name}</Typography>
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
                '&:hover': {
                  backgroundColor: "#FF7F00",
                  color: "#FFFFFF",
                  borderColor: "#FF7F00",
                },
              }}
            >
              Adicionar arquivo
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
      )}

      <Box mt={4}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Nível tecnológico
        </Typography>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <RadioGroup
            aria-label="nivel_tecnologico"
            name="technological_level"
            value={technologicalLevel}
            onChange={handleTechnologicalLevelChange}
          >
            <FormControlLabel value="muito_baixo" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Muito Baixo" />
            <FormControlLabel value="baixo" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Baixo" />
            <FormControlLabel value="medio" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Médio" />
            <FormControlLabel value="alto" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Alto" />
            <FormControlLabel value="muito_alto" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Muito Alto" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box mt={4}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Quantas aulas por semana você tem disponibilidade durante a semana?
        </Typography>
        <TextField
          type="text"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          name="classes_per_week"
          value={classesPerWeek}
          onChange={handleClassesPerWeekChange}
          fullWidth
          margin="dense"
        />
      </Box>
      <Box mt={4}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Observações (opcional)
        </Typography>
        <textarea
          rows={4}
          style={{ width: '100%', marginTop: '8px', padding: '8px', borderColor: '#cccccc', borderRadius: '4px' }}
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default FunctionalInfo;
