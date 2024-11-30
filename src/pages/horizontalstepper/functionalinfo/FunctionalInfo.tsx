import React, { useState, useEffect } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Button, LinearProgress } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDataContext } from "../../../context/DataContext";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface FunctionalInfoProps {
  onComplete: (isComplete: boolean) => void;
}

const FunctionalInfo: React.FC<FunctionalInfoProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [hasExperience, setHasExperience] = useState<string>(candidato.continuous_training ? "sim" : "nao");
  const [, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<File | null | undefined>(candidato.continuous_training_doc ? candidato.continuous_training_doc : null);
  const [uploading, setUploading] = useState(false);
  const [observations, setObservations] = useState<string>(candidato.observations || "");

  useEffect(() => {
    updateCandidate({
      continuous_training: hasExperience === "sim",
      continuous_training_doc: fileName ? fileName : undefined,
      observations,
    });

    onComplete(hasExperience === "nao" || (hasExperience === "sim" && !!fileName));
  }, [hasExperience, fileName, observations, updateCandidate, onComplete]);

  const handleExperienceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasExperience(event.target.value);
    setFile(null);
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
      setFile(selectedFile);
      setFileName(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName(undefined);
  };

  return (
    <Box>
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
                <Typography variant="body2">{fileName.name}</Typography>
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
