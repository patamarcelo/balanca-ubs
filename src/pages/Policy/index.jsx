import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const PolicyPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			width="100%"
			height="100%"
			display="flex"
			justifyContent="center"
			sx={{
				overflow: "auto",
				height: "100%",
				backgroundColor: colors.blueAccent[900],
				padding: "50px"
			}}
		>
			<Box width={"50%"} textAlign={"justify"}>
				<Typography variant="h3">
					<p style={{ textAlign: "center" }}>
						<b>
							Política de Privacidade do Aplicativo Empresarial
							Interno
						</b>
					</p>
					Esta Política de Privacidade descreve como o aplicativo
					empresarial interno coleta, utiliza e compartilha
					informações quando você utiliza nosso aplicativo.
					<p>
						<b>Informações que Coletamos</b>
					</p>
					<p>
						Quando você utiliza o aplicativo empresarial interno,
						podemos coletar as seguintes informações:
					</p>
					<ol>
						<li>
							<b>Informações de Identificação Pessoal: </b>
							Podemos coletar seu nome, endereço de e-mail, número
							de telefone e outras informações de contato que você
							fornecer voluntariamente ao se registrar no
							aplicativo.
						</li>
						<li>
							<b>Informações de Uso: </b>
							Podemos coletar informações sobre como você utiliza
							o aplicativo, incluindo as ações que você realiza
							dentro do aplicativo e os recursos que você utiliza.
						</li>
						<li>
							<b>Informações de Dispositivo: </b>
							Podemos coletar informações sobre o dispositivo
							móvel que você utiliza para acessar o aplicativo,
							incluindo o modelo do dispositivo, o sistema
							operacional, identificadores exclusivos do
							dispositivo e informações de rede.
						</li>
					</ol>
					<p>
						<b>Como Utilizamos Suas Informações</b>
					</p>
					<p>
						Utilizamos as informações coletadas para os seguintes
						propósitos:
					</p>
					<ol>
						<li>
							Fornecer e manter o aplicativo empresarial interno;
						</li>
						<li>
							Personalizar sua experiência dentro do aplicativo;
						</li>
						<li>
							Enviar notificações importantes relacionadas ao uso
							do aplicativo;
						</li>
						<li>
							Realizar análises para melhorar e otimizar o
							desempenho do aplicativo;
						</li>
						<li>
							Cumprir com obrigações legais e regulatórias
							aplicáveis.
						</li>
					</ol>
					<p>
						<b>Compartilhamento de Informações</b>
					</p>
					<p>
						Não compartilhamos suas informações pessoais com
						terceiros, exceto nas seguintes circunstâncias:
					</p>
					<ol>
						<li>
							Com prestadores de serviços que nos auxiliam na
							operação e manutenção do aplicativo;
						</li>
						<li>
							Quando exigido por lei ou para cumprir com processos
							legais.
						</li>
					</ol>
					<p>
						<b>Segurança das Informações</b>
					</p>
					<p>
						Valorizamos a segurança de suas informações pessoais e
						implementamos medidas técnicas e organizacionais para
						proteger essas informações contra acesso não autorizado,
						divulgação, alteração ou destruição.
					</p>
					<p>
						<b>Retenção de Dados</b>
					</p>
					<p>
						Retemos suas informações pessoais pelo tempo necessário
						para cumprir com os propósitos descritos nesta Política
						de Privacidade, a menos que uma retenção mais longa seja
						exigida ou permitida por lei.
					</p>
					<p>
						<b>Seus Direitos de Privacidade</b>
					</p>
					<p>
						Você tem o direito de acessar, corrigir, atualizar ou
						excluir suas informações pessoais. Você também pode
						optar por sair de certas comunicações que enviamos. Para
						exercer esses direitos, entre em contato conosco
						utilizando as informações fornecidas no final desta
						Política de Privacidade.
					</p>
					<p>
						<b>Alterações a Esta Política de Privacidade</b>
					</p>
					<p>
						Podemos atualizar esta Política de Privacidade de tempos
						em tempos. Se fizermos alterações significativas, iremos
						notificá-lo enviando uma notificação ou publicando a
						versão atualizada da Política de Privacidade no
						aplicativo. Encorajamos você a revisar periodicamente
						esta Política de Privacidade para se manter informado
						sobre como protegemos suas informações.
					</p>
					<p>
						<b>Contato</b>
					</p>
					<p>
						Se você tiver alguma dúvida ou preocupação sobre nossa
						Política de Privacidade ou sobre nossas práticas de
						privacidade, entre em contato conosco pelo seguinte
						endereço de e-mail: <b>patamarcelo@gmail.com</b>
					</p>
					<p>
						<b>Data de Vigência</b>
					</p>
					Esta Política de Privacidade entra em vigor a partir de:{" "}
					<b>01/03/2024</b>
				</Typography>
			</Box>
		</Box>
	);
};

export default PolicyPage;
