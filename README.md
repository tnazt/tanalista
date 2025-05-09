# Tá na Lista

**Tá na Lista** é um aplicativo PWA gratuito para ajudar qualquer pessoa — de jovens a idosos — a organizar listas de compras de forma simples, rápida e intuitiva. Funciona diretamente no navegador e pode ser instalado como app no celular, com suporte completo a uso offline.

---

## Funcionalidades

- Criar e excluir listas personalizadas
- Adicionar itens por digitação ou por voz (com reconhecimento de fala)
- Ajustar quantidades com botões de + e −
- Tela de modo compras (guia) com check de itens
- Itens riscados são mantidos mesmo após fechar o app
- Botão para desmarcar todos os itens marcados
- Funciona totalmente offline após o primeiro uso (PWA)
- Compatível com qualquer dispositivo moderno
- Interface leve, acessível e responsiva
- Ícones modernos com Lucide (carregados localmente)

---

## Como usar

1. Crie uma nova lista com um nome personalizado
2. Adicione itens digitando ou utilizando o botão de voz
3. Ajuste as quantidades com os botões de + e −
4. Use o ícone de carrinho para abrir o **modo compras**
5. Marque os itens comprados. Eles vão para o fim da lista
6. Clique em “Desmarcar todos” para reiniciar a lista

---

## Instalação

- Acesse o app no navegador
- Clique em “Adicionar à tela inicial” ou “Instalar app”
- Após instalado, o app funcionará 100% offline

---

## Como testar

1. Acesse: [https://tnazt.github.io/tanalista](https://tnazt.github.io/tanalista)
2. Instale como app (via navegador)
3. Teste funcionalidades com e sem internet

---

## Como rodar localmente

```bash
git clone https://github.com/tnazt/tanalista
cd tanalista
npx http-server .
```

---

## Estrutura de arquivos

- `index.html` – tela inicial com suas listas
- `lista.html` – edição e gerenciamento dos itens
- `guia.html` – modo compras, com check visual
- `app.js` – lógica e interações do app
- `style.css` – estilos visuais
- `service-worker.js` – funcionamento offline (PWA)
- `manifest.json` – configurações do PWA
- `/lib/lucide/` – ícones SVG usados localmente

---

## Tecnologias utilizadas

- HTML, CSS e JavaScript puro
- PWA (Progressive Web App) com Service Worker
- Web Speech API (entrada por voz)
- Lucide Icons (versão local, sem CDN)
- Armazenamento local via `localStorage`

---

## Próximas melhorias

- Leitura de listas via imagem (OCR)
- Compartilhamento de listas entre usuários
- Sincronização opcional em nuvem

---

## Feito por

Desenvolvido com <3 por Thiago Nazato.

---

## Licença

Este projeto está sob a licença MIT.
