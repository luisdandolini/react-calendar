import { Box, Button, Container, TextField } from "@mui/material"
import { useState } from "react"
import { IUser, sigInEndpoint } from "../backend/backend";

interface ILoginScreenProps {
  onSignIn: (user: IUser) => void;
}

export function LoginScreen(props: ILoginScreenProps) {

  const [email, setEmail] = useState("danilo@email.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sigInEndpoint(email, password).then((user) => {
      props.onSignIn(user);
    }, () => {
      setError("E-mail não encontrado ou senha incorreta!");
    })
  }

  return(
    <Container maxWidth="sm">
      <h1>Agenda React</h1>

      <p style={{ marginTop: '1rem' }}>Digite e-mail e senha para entrar no sistema. Para testar, use o e-mail danilo@email.com e a senha 1234.</p>

      <form onSubmit={signIn}>
        <TextField 
          margin="normal"
          label="E-mail"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value) }
        />

        <TextField 
          type="password"
          margin="normal"
          label="Senha"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div style={{
          color: 'red',
          marginTop: '1rem'
        }}>{ error }</div>}

        <Box>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            style={{ marginTop: '1rem' }}
          >Entrar</Button>
        </Box>
      </form>
    </Container>
  )
}