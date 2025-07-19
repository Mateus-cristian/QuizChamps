import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
} from "@react-email/components";

type Props = {
  name: string;
  confirmUrl: string;
};

function ConfirmationEmail({ name, confirmUrl }: Props) {
  return (
    <Html>
      <Head />
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4" }}
      >
        <Container
          style={{
            padding: "32px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
          }}
        >
          <Text>Olá {name},</Text>
          <Text>Confirme seu e-mail clicando no botão abaixo:</Text>
          <Button
            href={confirmUrl}
            style={{
              backgroundColor: "#ff6600",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "4px",
              marginTop: "12px",
              display: "inline-block",
            }}
          >
            Confirmar E-mail
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

export { ConfirmationEmail };
