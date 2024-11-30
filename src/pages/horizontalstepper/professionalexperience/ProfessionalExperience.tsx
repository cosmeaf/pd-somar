import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useDataContext } from "../../../context/DataContext";

interface ProfessionalExperienceProps {
  onComplete: (isComplete: boolean) => void;
}

const ProfessionalExperience: React.FC<ProfessionalExperienceProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [formData, setFormData] = useState({
    state_school_experience: candidato.state_school_experience || "",
    private_school_experience: candidato.private_school_experience || "",
    high_school_experience: candidato.high_school_experience || "",
    elementary_school_experience: candidato.elementary_school_experience || "",
    training_area: candidato.training_area || "",
    training_extra_courses: candidato.training_extra_courses || "",
    training: candidato.training || "",
  });

  useEffect(() => {
    updateCandidate(formData);
    const isComplete = Object.values(formData).every((value) => value !== "");
    onComplete(isComplete);
  }, [formData, updateCandidate, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as HTMLInputElement | { name?: string; value: unknown };
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value as string }));
    }
  };

  return (
    <>
   
    <Box sx={{height:{xs: "65vh" },  overflowY: 'auto', margin: '0 auto', padding: 2 }}>
    <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#FF0000",
          fontWeight: "bold",
          textAlign: "left",
          fontSize: 24,
        }}
      >
        Experiências Profissionais
      </Typography>
      
      <TextField
        label="Experiência na rede publica (max 200 caracteres)"
        name="state_school_experience"
        value={formData.state_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 200 } }}
        sx={{ width: "100%" }}
      />
      <TextField
        label="Experiência na rede privada (max 200 caracteres)"
        name="private_school_experience"
        value={formData.private_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 200 } }}
        sx={{ width: "100%" }}
      />
      <TextField
        label="Experiência no ensino médio (max 200 caracteres)"
        name="high_school_experience"
        value={formData.high_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 200 } }}
        sx={{ width: "100%" }}
      />
      <TextField
        label="Experiência no ensino fundamental (max 200 caracteres)"
        name="elementary_school_experience"
        value={formData.elementary_school_experience}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 200 } }}
        sx={{ width: "100%" }}
      />
      <TextField
        label="Área de formação"
        name="training_area"
        value={formData.training_area}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 200 } }}
        sx={{ width: "100%" }}
      />
      <TextField
        label="Cursos extras de formação"
        name="training_extra_courses"
        value={formData.training_extra_courses}
        onChange={handleChange}
        margin="dense"
        required
        slotProps={{ htmlInput: { maxLength: 200 } }}
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
    </Box>
    </>
  );
};

export default ProfessionalExperience;
