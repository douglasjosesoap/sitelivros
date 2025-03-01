const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verifica se o usuário logado é admin ou autor APROVADO
async function verificarPermissao() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Você precisa estar logado!");
    window.location.href = "login.html";
    return;
  }

  // Puxa do BD para ver se status continua aprovado
  let { data: dbUser, error } = await supabase
    .from("users")
    .select("role, status")
    .eq("email", user.email)
    .single();

  if (error || !dbUser) {
    alert("Erro ao verificar usuário!");
    window.location.href = "login.html";
    return;
  }

  // Admin ou autor + status aprovado
  if (dbUser.role !== "admin" && dbUser.role !== "autor") {
    alert("Apenas administradores ou autores podem acessar este painel!");
    window.location.href = "login.html";
    return;
  }
  if (dbUser.status !== "aprovado" && dbUser.role === "autor") {
    alert("Seu status ainda não foi aprovado pelo admin!");
    window.location.href = "index.html";
    return;
  }
}

// Postar capítulo
async function postarCapitulo() {
  const titulo = document.getElementById("titulo").value;
  const conteudo = document.getElementById("conteudo").value;
  const tipo = document.getElementById("tipo").value;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Você precisa estar logado!");
    window.location.href = "login.html";
    return;
  }

  // Verifica se está no BD e se está aprovado
  let { data: dbUser, error } = await supabase
    .from("users")
    .select("id, role, status")
    .eq("email", user.email)
    .single();

  if (error || !dbUser) {
    alert("Erro ao verificar seus dados. Tente logar novamente!");
    window.location.href = "login.html";
    return;
  }

  if (
    dbUser.role !== "admin" &&
    !(dbUser.role === "autor" && dbUser.status === "aprovado")
  ) {
    alert("Você não tem permissão para postar!");
    return;
  }

  let { error: postError } = await supabase.from("chapters").insert([
    {
      title: titulo,
      content: conteudo,
      tipo,
      author_id: dbUser.id,
      status: "aprovado",
      likes: 0
    }
  ]);

  if (postError) {
    alert("Erro ao publicar: " + postError.message);
  } else {
    alert("Capítulo publicado com sucesso!");
    window.location.reload();
  }
}

// Verifica permissão ao carregar a página
document.addEventListener("DOMContentLoaded", verificarPermissao);