import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDataContext } from "../../../context/DataContext";

interface AddressProps {
  onComplete: (isComplete: boolean) => void;
}

const Address: React.FC<AddressProps> = ({ onComplete }) => {
  const { candidato, updateCandidate } = useDataContext();
  const [cep, setCep] = useState(candidato.address?.cep || "");
  const [address, setAddress] = useState({
    city: candidato.address?.municipality || "",
    street: candidato.address?.street || "",
    neighborhood: candidato.address?.neighborhood || "",
    number: candidato.address?.number || "",
    complement: candidato.address?.complement || "",
  });

  useEffect(() => {
    if (
      address.city &&
      address.street &&
      address.neighborhood &&
      address.number &&
      cep
    ) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [address, cep, onComplete]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCep(value);

    if (value.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${value}/json/`)
        .then((response) => {
          if (!response.data.erro) {
            setAddress((prev) => ({
              ...prev,
              city: response.data.localidade,
              street: response.data.logradouro,
              neighborhood: response.data.bairro,
            }));
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP: ", error);
        });
    }
  };
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    updateCandidate({
      address: {
        id: candidato.address?.id || null,
        municipality: address.city,
        cep,
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
      },
    });
  }, [address, cep, updateCandidate]);

  return (
    <>
      <Box
        sx={{
          maxHeight: { xs: "none", md: 500 },
          overflowY: { xs: "visible", md: "auto" },
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
          Endereço
        </Typography>

        <TextField
          fullWidth
          label="CEP"
          name="cep"
          value={cep}
          onChange={handleCepChange}
          margin="dense"
          required
          size="small"
        />
        <TextField
          fullWidth
          label="Cidade"
          name="city"
          value={address.city}
          onChange={handleChange}
          margin="dense"
          required
          size="small"
        />
        <TextField
          fullWidth
          label="Logradouro"
          name="street"
          value={address.street}
          onChange={handleChange}
          margin="dense"
          required
          size="small"
        />
        <Box display={{ xs: "block", md: "flex" }} gap={2}>
          <TextField
            type="number"
            fullWidth
            label="Número"
            name="number"
            value={address.number}
            onChange={handleChange}
            margin="dense"
            required
            size="small"
            sx={{ appearance: "textfield", MozAppearance: "textfield" }}
          />
          <TextField
            fullWidth
            label="Complemento"
            name="complement"
            value={address.complement}
            onChange={handleChange}
            margin="dense"
            size="small"
          />
        </Box>
        <TextField
          fullWidth
          label="Bairro"
          name="neighborhood"
          value={address.neighborhood}
          onChange={handleChange}
          margin="dense"
          size="small"
        />
      </Box>
    </>
  );
};

export default Address;
