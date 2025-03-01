const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function postarCapitulo() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Faça login primeiro!");
    window.location.href = "login.html";
    return;
  }

  // Puxa do BD p/ ver se é admin ou autor
  let { data: dbUser, error } = await supabase
    .from("users")
    .select("role, status, id")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !dbUser) {
    alert("Usuário não encontrado no BD!");
    window.location.href = "login.html";
    return;
  }

  // Somente admin ou autor APROVADO
  if (dbUser.role !== "admin" && !(dbUser.role === "autor" && dbUser.status === "aprovado")) {
    alert("Apenas ADMIN ou AUTOR APROVADO podem postar!");
    return;
  }

  const titulo = document.getElementById("titulo").value;
  const conteudo = document.getElementById("conteudo").value;
  const tipo = document.getElementById("tipo").value;

  if (!titulo || !conteudo) {
    alert("Preencha título e conteúdo!");
    return;
  }

  let { error: err2 } = await supabase
    .from("chapters")
    .insert([
      {
        title: titulo,
        content: conteudo,
        tipo,
        author_id: dbUser.id,
        status: "aprovado", 
        likes: 0
      }
    ]);

  if (err2) {
    alert("Erro ao publicar: " + err2.message);
  } else {
    alert("Capítulo publicado com sucesso!");
    window.location.reload();
  }
}