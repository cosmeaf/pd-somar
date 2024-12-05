import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Divider } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";
import { useDataContext } from "../../../context/DataContext";

interface SchoolUnit {
  id: number;
  name: string;
  municipality: string;
}

interface MunicipalityGroup {
  municipality: string;
  units: SchoolUnit[];
}

interface JobApplication {
  job_position: number | null;
  school_units: number[];
  work_shifts: string[];
}

interface JobsItemProps {
  jobApplication: JobApplication;
  jobPosition: { id: number | null; title: string };
  onComplete: (isComplete: boolean) => void;
}

const JobsItem: React.FC<JobsItemProps> = ({
  jobApplication,
  jobPosition,
  onComplete,
}) => {
  const { candidato, updateCandidate } = useDataContext();
  const [schoolUnits, setSchoolUnits] = useState<SchoolUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<
    string[]
  >([]);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [vagaTitle, setVagaTitle] = useState<string>("");

  useEffect(() => {
    const fetchSchoolUnits = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL as string;
        const response = await axios.get(`${API_URL}/school-units/`);
        if (Array.isArray(response.data)) {
          setSchoolUnits(response.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch school units");
      } finally {
        setLoading(false);
      }
    };

    const fetchJobPosition = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL as string;
        const response = await axios.get(
          `${API_URL}/job-positions/${jobPosition.id}`
        );
        if (response.data && response.data.title) {
          setVagaTitle(response.data.title);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch job position");
      }
    };

    fetchSchoolUnits();
    fetchJobPosition();
  }, []);

  useEffect(() => {
    if (jobApplication.school_units.length > 0) {
      const municipalitiesFromUnits = Array.from(
        new Set(
          jobApplication.school_units
            .map((unitId) => {
              const unit = schoolUnits.find((unit) => unit.id === unitId);
              return unit ? unit.municipality : null;
            })
            .filter((municipality) => municipality !== null)
        )
      );
      setSelectedMunicipalities((prevMunicipalities) => {
        const newMunicipalities = Array.from(
          new Set([...prevMunicipalities, ...municipalitiesFromUnits])
        );
        return newMunicipalities;
      });
      setSelectedUnits(jobApplication.school_units);
      setSelectedShifts(jobApplication.work_shifts);
    }
  }, [jobApplication, schoolUnits]);

  const updateJobApplication = () => {
    updateCandidate({
      job_applications: candidato.job_applications.map(
        (jobApp: JobApplication) =>
          jobApp.job_position === jobApplication.job_position
            ? {
                ...jobApp,
                school_units: selectedUnits,
                work_shifts: selectedShifts,
              }
            : jobApp
      ),
    });
  };

  useEffect(() => {
    updateJobApplication();
    onComplete(selectedUnits.length > 0 && selectedShifts.length > 0);
  }, [selectedUnits, selectedShifts]);

  const handleMunicipalityChange = (municipality: string) => {
    setSelectedMunicipalities((prev) => {
      const newSelectedMunicipalities = prev.includes(municipality)
        ? prev.filter((m) => m !== municipality)
        : [...prev, municipality];
      return newSelectedMunicipalities;
    });
  };

  const handleUnitChange = (unitId: number) => {
    setSelectedUnits((prev) => {
      const updatedUnits = prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId];

      // Garantir que os municípios não sejam desmarcados automaticamente
      const updatedMunicipalities = [...selectedMunicipalities];
      schoolUnits.forEach((unit) => {
        if (
          updatedUnits.includes(unit.id) &&
          !updatedMunicipalities.includes(unit.municipality)
        ) {
          updatedMunicipalities.push(unit.municipality);
        }
      });

      setSelectedMunicipalities(updatedMunicipalities);

      return updatedUnits;
    });
  };

  const handleShiftChange = (shift: string) => {
    setSelectedShifts((prev) => {
      const updatedShifts = prev.includes(shift)
        ? prev.filter((s) => s !== shift)
        : [...prev, shift];
      return updatedShifts;
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const municipalities = Array.from(
    new Set(schoolUnits.map((unit) => unit.municipality))
  );

  const groupedUnits: MunicipalityGroup[] = municipalities.map(
    (municipality) => ({
      municipality,
      units: schoolUnits.filter((unit) => unit.municipality === municipality),
    })
  );

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
        Informações da Vaga - {vagaTitle}
      </Typography>
      <FormGroup>
        {municipalities.map((municipality) => (
          <FormControlLabel
            key={municipality}
            control={
              <Checkbox
                sx={{ color: "#FF7F00", "&.Mui-checked": { color: "#FF7F00" } }}
                checked={selectedMunicipalities.includes(municipality)}
                onChange={() => handleMunicipalityChange(municipality)}
              />
            }
            label={municipality}
          />
        ))}
      </FormGroup>

      {groupedUnits.map(
        (group) =>
          selectedMunicipalities.includes(group.municipality) && (
            <Box
              key={group.municipality}
              mt={2}
              sx={{
                maxHeight: { xs: "none", md: 300 },
                overflowY: { xs: "visible", md: "auto" },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#FF5310", fontWeight: "bold" }}
              >
                Unidades Escolares - {group.municipality}
              </Typography>
              <FormGroup>
                {group.units.map((unit) => (
                  <FormControlLabel
                    key={unit.id}
                    control={
                      <Checkbox
                        sx={{
                          color: "#FF7F00",
                          "&.Mui-checked": { color: "#FF7F00" },
                        }}
                        checked={selectedUnits.includes(unit.id)}
                        onChange={() => handleUnitChange(unit.id)}
                      />
                    }
                    label={unit.name}
                  />
                ))}
              </FormGroup>
              {group.units.length > 0 &&
                selectedUnits.filter((id) =>
                  group.units.some((unit) => unit.id === id)
                ).length === 0 && (
                  <Alert
                    severity="error"
                    sx={{ mt: 1, color: "red", fontWeight: "bold" }}
                  >
                    Selecione ao menos uma unidade escolar para o município{" "}
                    {group.municipality}
                  </Alert>
                )}
            </Box>
          )
      )}

      {selectedMunicipalities.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" gutterBottom>
            Turno de trabalho
          </Typography>
          <FormGroup>
            {["Manhã", "Tarde", "Noite", "Integral"].map((shift) => {
              const valueMap: { [key: string]: string } = {
                Manhã: "morning",
                Tarde: "afternoon",
                Noite: "night",
                Integral: "integral",
              };
              const shiftValue = valueMap[shift];
              return (
                <FormControlLabel
                  key={shiftValue}
                  control={
                    <Checkbox
                      sx={{
                        color: "#FF7F00",
                        "&.Mui-checked": { color: "#FF7F00" },
                      }}
                      checked={selectedShifts.includes(shiftValue)}
                      onChange={() => handleShiftChange(shiftValue)}
                    />
                  }
                  label={shift}
                />
              );
            })}
          </FormGroup>
          {selectedShifts.length === 0 && (
            <Alert
              severity="error"
              sx={{ mt: 1, color: "red", fontWeight: "bold" }}
            >
              Selecione ao menos um turno de trabalho
            </Alert>
          )}
         
        </>
      )}
    </Box>
  );
};

export default JobsItem;
