# Pré-requisitos
* Ter instalado o Node.Js versão 22.11.0;
* Ter instalado o npm versão 10.9.0;
* Ter instalado o Vite versão 7.0.4;
* Estar com a porta 5180 livre;

# Instruções
* Abra o terminal (prompt de comando) na pasta raíz do projeto;
* Execute o comando npm install;
* Após a instalação das dependências, execute o comando npm run dev;
* Abra o navegador no link mostrado pelo terminal (http://localhost:5180/);

## Observação:
O backend do projeto (https://github.com/AmintasNeto/AtendimentosClinicosBackend) deve estar sendo executado na porta 5013.

## Informações sobre os Status das consultas
As consultas apresentarão um dos 5 status a seguir:
* Cancelada: A consulta foi cancelada pelo médico.
* Em aberto: A consulta tem data e hora posterior a data e hora atual, ela não foi cancelada e não tem nenhum paciente associado a consulta.
* Agendada: A consulta tem data e hora posterior a data e hora atual, ela não foi cancelada e tem um paciente associado a consulta.
* Expirada: A data e hora da consulta já passou, ela não foi cancelada e não tem nenhum paciente associado a consulta.
* Finalizada: A data e hora da consulta já passou, ela não foi cancelada e tem um paciente associado a consulta.

Apenas as consultas com status Em Aberto ou Agendada podem ser modificadas ou canceladas, as demais apenas podem ser visualizadas.
