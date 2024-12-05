import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, FormControl, FormControlLabel, RadioGroup, Radio, Select, MenuItem, SelectChangeEvent, Button, CircularProgress } from "@mui/material";
import { useDataContext } from "../../../context/DataContext";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface ProfessionalExperienceProps {
  onComplete: (isComplete: boolean) => void;
}

const ProfessionalExperience: React.FC<ProfessionalExperienceProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [formData, setFormData] = useState({
    state_school_experience: candidato.state_school_experience || "",
    state_school_experience_ratio: candidato.state_school_experience_ratio || "none",
    private_school_experience: candidato.private_school_experience || "",
    private_school_experience_ratio: candidato.private_school_experience_ratio || "none",
    high_school_experience: candidato.high_school_experience || "",
    high_school_experience_ratio: candidato.high_school_experience_ratio || "none",
    elementary_school_experience: candidato.elementary_school_experience || "",
    elementary_school_experience_ratio: candidato.elementary_school_experience_ratio || "none",
    training_area: candidato.training_area || "",
    training_extra_courses: candidato.training_extra_courses || "",
    training: candidato.training || "",
    degree_doc: candidato.degree_doc || "",
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    degree_doc: candidato.degree_doc ? candidato.degree_doc : null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateCandidate({
      ...formData,
      degree_doc: files.degree_doc,
    });
    const isComplete =
      formData.training_area !== "" &&
      formData.training_extra_courses !== "" &&
      formData.training !== "" &&
      files.degree_doc !== null &&
      (
        (formData.state_school_experience_ratio === "none" || formData.state_school_experience !== "") &&
        (formData.private_school_experience_ratio === "none" || formData.private_school_experience !== "") &&
        (formData.high_school_experience_ratio === "none" || formData.high_school_experience !== "") &&
        (formData.elementary_school_experience_ratio === "none" || formData.elementary_school_experience !== "")
      );
    onComplete(isComplete);
  }, [formData, files, updateCandidate, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown };
    if (name) {
      if (typeof value === 'string' && value.length > 150 && name.includes("experience")) {
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value as string }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    if (event.target.files && event.target.files[0]) {
      setLoading(true);
      setTimeout(() => {
        // Simulate loading time for file upload
        if (event.target.files && event.target.files[0]) {
          setFiles({ ...files, [name]: event.target.files[0] });
        }
        setLoading(false);
      }, 1000);
    }
  };

  const handleRemoveFile = (name: string) => {
    setFiles({ ...files, [name]: null });
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
        Experiências Profissionais
      </Typography>
      
      <Typography variant="body1" sx={{ color: '#000000', mt: 2, fontWeight: "bold" }}>Duração da experiência na rede pública</Typography>
      <RadioGroup
        row
        name="state_school_experience_ratio"
        value={formData.state_school_experience_ratio}
        onChange={handleChange}
      >
        <FormControlLabel value="1_3" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="1-3 anos" />
        <FormControlLabel value="4_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="4-8 anos" />
        <FormControlLabel value="plus_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Mais de 8 anos" />
        <FormControlLabel value="none" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Não possui" />
      </RadioGroup>

      <TextField
        label="Descreva sua experiência na rede pública (max 150 caracteres)"
        name="state_school_experience"
        value={formData.state_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        disabled={formData.state_school_experience_ratio === "none"}
        slotProps={{ htmlInput: { maxLength: 150 } }}
        sx={{ width: "100%" }}
      />
      <Typography variant="body1" sx={{ color: '#000000', mt: 2, fontWeight: "bold" }}>Duração da experiência na rede privada</Typography>
      <RadioGroup
        row
        name="private_school_experience_ratio"
        value={formData.private_school_experience_ratio}
        onChange={handleChange}
      >
        <FormControlLabel value="1_3" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="1-3 anos" />
        <FormControlLabel value="4_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="4-8 anos" />
        <FormControlLabel value="plus_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Mais de 8 anos" />
        <FormControlLabel value="none" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Não possui" />
      </RadioGroup>
      
      <TextField
        label="Descreva sua experiência na rede privada (max 150 caracteres)"
        name="private_school_experience"
        value={formData.private_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        disabled={formData.private_school_experience_ratio === "none"}
        slotProps={{ htmlInput: { maxLength: 150 } }}
        sx={{ width: "100%" }}
      />
      
      <Typography variant="body1" sx={{ color: '#000000', mt: 2, fontWeight: "bold" }}>Duração da experiência no ensino médio</Typography>
      <RadioGroup
        row
        name="high_school_experience_ratio"
        value={formData.high_school_experience_ratio}
        onChange={handleChange}
      >
        <FormControlLabel value="1_3" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="1-3 anos" />
        <FormControlLabel value="4_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="4-8 anos" />
        <FormControlLabel value="plus_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Mais de 8 anos" />
        <FormControlLabel value="none" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Não possui" />
      </RadioGroup>
      <TextField
        label="Descreva sua experiência no ensino médio (max 150 caracteres)"
        name="high_school_experience"
        value={formData.high_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        disabled={formData.high_school_experience_ratio === "none"}
        slotProps={{ htmlInput: { maxLength: 150 } }}
        sx={{ width: "100%" }}
      />
      
      <Typography variant="body1" sx={{ color: '#000000', mt: 2, fontWeight: "bold" }}>Duração da experiência no ensino fundamental</Typography>
      <RadioGroup
        row
        name="elementary_school_experience_ratio"
        value={formData.elementary_school_experience_ratio}
        onChange={handleChange}
      >
        <FormControlLabel value="1_3" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="1-3 anos" />
        <FormControlLabel value="4_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="4-8 anos" />
        <FormControlLabel value="plus_8" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Mais de 8 anos" />
        <FormControlLabel value="none" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Não possui" />
      </RadioGroup>
      <TextField
        label="Descreva sua experiência no ensino fundamental (max 150 caracteres)"
        name="elementary_school_experience"
        value={formData.elementary_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        disabled={formData.elementary_school_experience_ratio === "none"}
        slotProps={{ htmlInput: { maxLength: 150 } }}
        sx={{ width: "100%" }}
      />
      <TextField
        label="Área de formação"
        name="training_area"
        value={formData.training_area}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 150 } }}
        sx={{ width: "100%" }}
      />
      <TextField
        label="Cursos extras de formação"
        name="training_extra_courses"
        value={formData.training_extra_courses}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 150 } }}
        sx={{ width: "100%" }}
      />
      <FormControl fullWidth margin="dense">
        <Typography variant="body1" gutterBottom>Nível de formação</Typography>
        <Select
          name="training"
          value={formData.training}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="">--------</MenuItem>
          <MenuItem value="superior_completo">Superior Completo</MenuItem>
          <MenuItem value="mestrado">Mestrado</MenuItem>
          <MenuItem value="doutorado">Doutorado</MenuItem>
          <MenuItem value="especializacao">Especialização</MenuItem>
        </Select>
      </FormControl>
      <Box mt={4}>
        <Typography variant="body1" sx={{ fontWeight: "bold", mt: 4 }}>Documento de formação</Typography>
        {loading ? (
          <CircularProgress sx={{ color: '#FF7F00', mt: 2 }} />
        ) : (
          <>
            {files.degree_doc ? (
              <Box display={"flex"} flexDirection={"row"} gap={3}>
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
                  onClick={() => handleRemoveFile("degree_doc")}
                >
                  Remover documento de formação
                </Button>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FF7F00" }}>Arquivo enviado:</Typography>
                  <Typography variant="body2" sx={{ mb: 2, wordWrap: "break-word", maxWidth: 300 }}>{files.degree_doc.name}</Typography>
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
                Adicionar documento de formação
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => handleFileChange(e, "degree_doc")}
                />
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProfessionalExperience;
