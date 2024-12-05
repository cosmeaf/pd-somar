import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useDataContext } from "../../../context/DataContext";

interface Job {
  id: number;
  title: string;
}

interface JobsProps {
  onComplete: (isComplete: boolean) => void;
}

const Jobs: React.FC<JobsProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<number[]>(
    candidato.job_applications.map((jobApp) => jobApp.job_position).filter((jobId): jobId is number => jobId !== null) || []
  );

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

  useEffect(() => {
    // Atualizar no contexto assim que houver alteração em selectedJobs
    const jobApplications = selectedJobs.map((jobId) => ({
      job_position: jobId,
      school_units: [], // Atualizar posteriormente conforme preenchido pelo usuário
      teaching_experience: null,
      work_shifts: [],
    }));
    updateCandidate({ job_applications: jobApplications });

    // Liberar próxima etapa se ao menos um job for selecionado
    onComplete(selectedJobs.length > 0);
  }, [selectedJobs, updateCandidate, onComplete]);

  const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedJobs(event.target.value as number[]);
  };

  const handleCheckboxChange = (jobId: number) => {
    setSelectedJobs((prevSelected) =>
      prevSelected.includes(jobId)
        ? prevSelected.filter((id) => id !== jobId)
        : [...prevSelected, jobId]
    );
  };

  const handleRemoveJob = (jobId: number) => {
    setSelectedJobs((prevSelected) =>
      prevSelected.filter((id) => id !== jobId)
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

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
        Vagas
      </Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="jobs-select-label">Vagas Selecionadas</InputLabel>
        <Select
          sx={{ maxWidth: 500 }}
          labelId="jobs-select-label"
          multiple
          value={selectedJobs}
          onChange={handleSelectChange}
          label="Vagas Selecionadas"
          renderValue={(selected) => {
            const selectedTitles = (selected as number[]).map(
              (jobId) => jobs.find((job) => job.id === jobId)?.title
            );
            return selectedTitles.length > 2
              ? `${selectedTitles.slice(0, 2).join(", ")} + ${
                  selectedTitles.length - 2
                } more`
              : selectedTitles.join(", ");
          }}
        >
          {jobs.map((job) => (
            <MenuItem
              key={job.id}
              value={job.id}
              onClick={() => handleCheckboxChange(job.id)}
              sx={{ '@media (max-width:600px)': { fontSize: 14 }, textWrap: "wrap"  }}

            >
              <Checkbox
                checked={selectedJobs.includes(job.id)}
                sx={{
                  color: "#FF5310",
                  "&.Mui-checked": {
                    color: "#FF5310",
                  },
                }}
              />
              {job.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        mt={4}
        sx={{ maxHeight: 300, overflowY: "auto", position: "relative" }}
      >
        <Typography
          variant="h5"
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          Vagas Selecionadas
        </Typography>
        <List>
          {selectedJobs.map((jobId) => {
            const job = jobs.find((j) => j.id === jobId);
            return job ? (
              <ListItem
                key={job.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveJob(job.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              >
                {job.title}
              </ListItem>
            ) : null;
          })}
        </List>
      </Box>
    </Box>
  );
};

export default Jobs;
