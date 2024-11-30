import React, { useState, useEffect } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Checkbox, FormGroup, Button, CircularProgress } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDataContext } from "../../../context/DataContext";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface MecProps {
  onComplete: (isComplete: boolean) => void;
}

const Mec: React.FC<MecProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [certificadoMEC, setCertificadoMEC] = useState<string>(candidato.mec_certified === true ? "sim" : (candidato.mec_certified === false ? "nao" : ""));
  const [comprovacao, setComprovacao] = useState<{ [key: string]: boolean }>({
    especializacao: !!candidato.pos_lato_especializacao,
    mestrado: !!candidato.pos_stricto_mestrado,
    doutorado: !!candidato.pos_stricto_doutorado,
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    especializacao: candidato.pos_lato_especializacao ? candidato.pos_lato_especializacao : null,
    mestrado: candidato.pos_stricto_mestrado ? candidato.pos_stricto_mestrado : null,
    doutorado: candidato.pos_stricto_doutorado ? candidato.pos_stricto_doutorado : null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateCandidate({
      mec_certified: certificadoMEC === "sim" ? true : (certificadoMEC === "nao" ? false : undefined),
      pos_lato_especializacao: files.especializacao,
      pos_stricto_mestrado: files.mestrado,
      pos_stricto_doutorado: files.doutorado,
    });

    if (
      certificadoMEC === "nao" ||
      (certificadoMEC === "sim" &&
        (comprovacao.especializacao || comprovacao.mestrado || comprovacao.doutorado) &&
        (!comprovacao.especializacao || files.especializacao) &&
        (!comprovacao.mestrado || files.mestrado) &&
        (!comprovacao.doutorado || files.doutorado))
    ) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [certificadoMEC, comprovacao, files, updateCandidate, onComplete]);

  const handleCertificadoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCertificadoMEC(event.target.value);
  };

  const handleComprovacaoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComprovacao({ ...comprovacao, [event.target.name]: event.target.checked });
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
        padding: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#FF0000",
          fontWeight: "bold",
          textAlign: "left",
          fontSize: { xs: 24, md: 30 },
        }}
      >
        Experiências MEC
      </Typography>

      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ color: '#000', mt: 2 }}>Você possui certificado registrado pelo MEC na área de atuação?</Typography>
        <RadioGroup
          aria-label="certificadoMEC"
          name="certificadoMEC"
          value={certificadoMEC}
          onChange={handleCertificadoChange}
          sx={{ marginLeft: 2 }}
        >
          <FormControlLabel value="sim" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Sim" />
          <FormControlLabel value="nao" control={<Radio sx={{ color: "#FF7F00", '&.Mui-checked': { color: '#FF7F00' } }} />} label="Não" />
        </RadioGroup>
      </FormControl>

      {certificadoMEC === "sim" && (
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ color: '#000000', mt: 2, fontWeight: "bold" }}>Quais?</Typography>
          <FormGroup sx={{ marginLeft: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={comprovacao.especializacao} onChange={handleComprovacaoChange} name="especializacao" sx={{ color: '#FF7F00', '&.Mui-checked': { color: '#FF7F00' } }} />}
              label="Pós-graduação Lato Sensu Especialização"
            />
            <FormControlLabel
              control={<Checkbox checked={comprovacao.mestrado} onChange={handleComprovacaoChange} name="mestrado" sx={{ color: '#FF7F00', '&.Mui-checked': { color: '#FF7F00' } }} />}
              label="Pós-graduação Stricto Sensu Mestrado"
            />
            <FormControlLabel
              control={<Checkbox checked={comprovacao.doutorado} onChange={handleComprovacaoChange} name="doutorado" sx={{ color: '#FF7F00', '&.Mui-checked': { color: '#FF7F00' } }} />}
              label="Pós-graduação Stricto Sensu Doutorado"
            />
          </FormGroup>
        </FormControl>
      )}

      {certificadoMEC === "sim" && (
        <Box mt={4}>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 4 }}>Documentos de comprovação</Typography>
          {loading ? (
            <CircularProgress sx={{ color: '#FF7F00', mt: 2 }} />
          ) : (
            <>
              {comprovacao.especializacao && (
                <Box
                  sx={{
                    textAlign: "left",
                    mt: 2,
                  }}
                >
                  {files.especializacao ? (
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
                        onClick={() => handleRemoveFile("especializacao")}
                      >
                        Remover documento de Especialização
                      </Button>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FF7F00" }}>Arquivo enviado:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{files.especializacao.name}</Typography>
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
                      Adicionar documento de Especialização
                      <input
                        type="file"
                        accept="application/pdf"
                        hidden
                        onChange={(e) => handleFileChange(e, "especializacao")}
                      />
                    </Button>
                  )}
                </Box>
              )}
              {comprovacao.mestrado && (
                <Box
                  sx={{
                    textAlign: "left",
                    mt: 2,
                  }}
                >
                  {files.mestrado ? (
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
                        onClick={() => handleRemoveFile("mestrado")}
                      >
                        Remover documento de Mestrado
                      </Button>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FF7F00" }}>Arquivo enviado:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{files.mestrado.name}</Typography>
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
                      Adicionar documento de Mestrado
                      <input
                        type="file"
                        accept="application/pdf"
                        hidden
                        onChange={(e) => handleFileChange(e, "mestrado")}
                      />
                    </Button>
                  )}
                </Box>
              )}
              {comprovacao.doutorado && (
                <Box
                  sx={{
                    textAlign: "left",
                    mt: 2,
                  }}
                >
                  {files.doutorado ? (
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
                        onClick={() => handleRemoveFile("doutorado")}
                      >
                        Remover documento de Doutorado
                      </Button>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FF7F00" }}>Arquivo enviado:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{files.doutorado.name}</Typography>
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
                      Adicionar documento de Doutorado
                      <input
                        type="file"
                        accept="application/pdf"
                        hidden
                        onChange={(e) => handleFileChange(e, "doutorado")}
                      />
                    </Button>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Mec;
