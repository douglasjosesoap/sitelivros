const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Verifica se existe algum user. Se não houver, o primeiro cadastro vira admin. */
async function isFirstUser() {
  let { data, error } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Erro ao checar usuários:", error);
    return false;
  }

  // Se length=0 => não existe user => primeiro
  return data.length === 0;
}

/** Upload de PDF no Storage (bucket "prologos") */
async function uploadPDF(pdfFile) {
  const fileName = `prologos/${Date.now()}_${pdfFile.name}`;

  let { error } = await supabase.storage
    .from("prologos")
    .upload(fileName, pdfFile, {
      contentType: "application/pdf"
    });

  if (error) {
    console.error("Erro ao fazer upload do PDF:", error.message);
    return null;
  }

  // Gerar URL pública (assumindo que o bucket é público)
  const { publicURL } = supabase.storage
    .from("prologos")
    .getPublicUrl(fileName);

  return publicURL;
}

/** CADASTRAR */
async function cadastrar() {
  const username = document.getElementById("newUser").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPass").value;
  let role = document.getElementById("userRole").value;
  const fileInput = document.getElementById("prologoPDF");

  if (!username || !email || !password) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  // Se for o primeiro user, forçar admin
  const first = await isFirstUser();
  if (first) {
    role = "admin";
    alert("Nenhum usuário no banco. Você será ADMIN!");
  }

  // Se autor => status=pendente, senão=aprovado
  let status = "aprovado";
  if (role === "autor") {
    status = "pendente";
  }

  // Upload do PDF se for autor
  let pdfURL = "";
  if (role === "autor") {
    if (!fileInput.files[0]) {
      alert("Envie um PDF do prólogo!");
      return;
    }
    let uploaded = await uploadPDF(fileInput.files[0]);
    if (!uploaded) {
      alert("Falha ao enviar PDF!");
      return;
    }
    pdfURL = uploaded;
  }

  // Insere no Supabase (senha sem criptografia!)
  let { error } = await supabase.from("users").insert([
    {
      username,
      email,
      password,
      role,
      status,
      prologo: pdfURL
    }
  ]);

  if (error) {
    alert("Erro ao cadastrar: " + error.message);
  } else {
    alert("Cadastro realizado!");
    window.location.href = "login.html";
  }
}

/** LOGIN - Username ou Email */
async function login() {
  const userInput = document.getElementById("email").value; // username ou email
  const password = document.getElementById("password").value;

  if (!userInput || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  // Tenta buscar por username
  let { data: userByUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", userInput)
    .maybeSingle();

  // Se não achou => tenta email
  if (!userByUser && !error) {
    let { data: userByEmail, error: err2 } = await supabase
      .from("users")
      .select("*")
      .eq("email", userInput)
      .maybeSingle();

    userByUser = userByEmail;
    error = err2;
  }

  if (error) {
    alert("Erro ao buscar usuário: " + error.message);
    return;
  }
  if (!userByUser) {
    alert("Usuário não encontrado!");
    return;
  }

  // Comparação de senha (texto puro)
  if (userByUser.password !== password) {
    alert("Senha incorreta!");
    return;
  }

  // Salva user no localStorage
  localStorage.setItem("user", JSON.stringify(userByUser));

  // Redireciona
  if (userByUser.role === "admin" || userByUser.role === "autor") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

/** LOGOUT */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

/** Listeners */
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