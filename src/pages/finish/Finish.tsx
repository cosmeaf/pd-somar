import {
  Box,
  CardMedia,
  CssBaseline,
  Divider,
  Typography,
} from "@mui/material";
import ipgc_logo from "../../assets/ipgc_logo.svg";
import { useDataContext } from "../../context/DataContext";

export default function Finish() {
  const { candidato } = useDataContext();

  if (!candidato?.full_name) {
    window.location.href = './';
    return null;
  }
  return (
    <>
      <CssBaseline />
      {/* Reseta estilos padrão para garantir que o Box cubra a tela inteira */}
      <Box
        sx={{
          bgcolor: "#E7E7E7",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          padding: { xs: 2, md: 10 }, // Padding menor para dispositivos móveis e maior para telas grandes
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "#ffffff",
            height: { xs: "95vh", md: "90vh" }, // Altura flexível: mais alta no mobile
            width: { xs: "90vw", md: "40vw" }, // Largura flexível: quase toda tela no mobile e menor em telas grandes
            borderRadius: "10px",
          }}
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          padding={{ xs: 2, md: 4 }} // Padding menor para mobile e maior para desktops
        >
          {/* Exibindo o logo */}
          <CardMedia
            component="img"
            image={ipgc_logo}
            alt="Logo IPGC"
            sx={{
              height: "auto",
              width: { xs: "40%", md: "20%" }, // Logo maior no mobile
              marginBottom: 2,
            }}
          />
          {/* Título de Boas-vindas */}
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", md: "2rem" }, // Tamanho de fonte ajustável para mobile e desktop
            }}
            variant="h5"
          >
            OBRIGADO(A)!
          </Typography>
         

         

          <Divider
            sx={{
              borderColor: "#D9D9D9",
              borderWidth: 2,
              width: { xs: "80%", md: "50%" },
              margin: "5px auto",
              borderRadius: 2,
            }}
          />

          {/* Segundo Texto: Para que serve esse formulário? */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "20vh", md: "25vh" },
              overflowY: "auto",
              marginTop: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                marginBottom: 1,
                color: "#828282",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              lorem ipsum dolor sit amet
            </Typography>
            <Typography
              sx={{
                color: "#444444",
                fontSize: { xs: "0.75rem", md: "0.875rem" },
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse in urna eu dui gravida iaculis. Duis rhoncus urna quis
              purus posuere, nec iaculis felis ornare. Sed turpis mauris,
              ultricies vitae sem eu, commodo lacinia leo.
            </Typography>
          </Box>


          
        </Box>
      </Box>
    </>
  );
}
