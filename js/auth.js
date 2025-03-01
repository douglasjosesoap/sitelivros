const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * UPLOAD DE PDF NO SUPABASE STORAGE
 * Supabase → Storage → Criar Bucket "prologos" (público ou protegido)
 * Retorna a URL do PDF salvo
 */
async function uploadPDF(file) {
  const fileName = `${Date.now()}_${file.name}`;
  let { data, error } = await supabase.storage
    .from("prologos") // bucket name
    .upload(fileName, file, {
      contentType: "application/pdf"
    });

  if (error) {
    console.error("Erro ao fazer upload do PDF:", error.message);
    return null;
  }

  // Gerar URL pública do PDF (se o bucket for público)
  const { publicURL } = supabase.storage
    .from("prologos")
    .getPublicUrl(fileName);

  return publicURL;
}

/**
 * CADASTRO DE USUÁRIO (Autor ou Leitor)
 * - Se for autor → status = 'pendente' e faz upload do PDF prólogo
 */
async function cadastrar() {
  const username = document.getElementById("newUser").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPass").value;
  const role = document.getElementById("userRole").value;
  const fileInput = document.getElementById("prologoPDF");
  let pdfURL = "";

  if (!username || !email || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  // Se for autor, obrigar upload de PDF
  if (role === "autor") {
    if (!fileInput.files[0]) {
      alert("Envie o arquivo PDF do prólogo.");
      return;
    }
    // Faz upload do PDF para o Supabase Storage
    pdfURL = await uploadPDF(fileInput.files[0]);
    if (!pdfURL) {
      alert("Erro ao enviar o PDF. Tente novamente.");
      return;
    }
  }

  // Autores ficam pendentes até o admin aprovar
  let status = role === "autor" ? "pendente" : "aprovado";

  // Insere o usuário no BD
  let { error } = await supabase.from("users").insert([
    {
      username,
      email,
      password,
      role,
      status,
      prologo: pdfURL // link do PDF salvo
    }
  ]);

  if (error) {
    alert("Erro ao cadastrar: " + error.message);
  } else {
    alert("Cadastro realizado! Se você for autor, aguarde aprovação do admin.");
    window.location.href = "login.html";
  }
}

/**
 * LOGIN COM USERNAME OU EMAIL
 * - Precisamos buscar no BD usando OR (Supabase: .or('username.eq.xyz,email.eq=xyz')
 * - Comparação de senhas é didática (pois no BD está crypt). Em produção seria no backend.
 */
async function login() {
  const input = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!input || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  // Tentar buscar por username = input
  let { data: userByUsername, error: errUser } = await supabase
    .from("users")
    .select("*")
    .eq("username", input)
    .maybeSingle();

  // Se não achou, tenta buscar por email = input
  if (!userByUsername && !errUser) {
    let { data: userByEmail, error: errEmail } = await supabase
      .from("users")
      .select("*")
      .eq("email", input)
      .maybeSingle();

    userByUsername = userByEmail; // userByUsername vira userByEmail
    errUser = errEmail;           // idem
  }

  if (errUser || !userByUsername) {
    alert("Usuário não encontrado ou erro ao buscar no banco!");
    return;
  }

  // Comparação de senha didática (sem real bcrypt)
  if (userByUsername.password !== password) {
    alert("Senha incorreta!");
    return;
  }

  // Salva no localStorage
  localStorage.setItem("user", JSON.stringify(userByUsername));

  // Redireciona
  if (userByUsername.role === "admin") {
    window.location.href = "admin.html";
  } else if (userByUsername.role === "autor") {
    // Autor também pode postar
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

/** DESLOGAR */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

/** Eventos para botoes */
document.addEventListener("DOMContentLoaded", function () {
  const registerButton = document.getElementById("registerButton");
  if (registerButton) {
    registerButton.addEventListener("click", cadastrar);
  }

  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", login);
  }
});