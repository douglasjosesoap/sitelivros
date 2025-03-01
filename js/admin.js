const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para verificar se o usuário tem permissão de admin antes de acessar o painel
async function verificarAdmin() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    // Verifica no Supabase se o usuário logado é admin
    let { data: adminUser, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .single();

    if (error || !adminUser || adminUser.role !== "admin") {
        alert("Acesso negado! Apenas administradores podem entrar.");
        window.location.href = "login.html";
    }
}

// Verifica a permissão de admin ao carregar a página
document.addEventListener("DOMContentLoaded", verificarAdmin);

// Função para postar capítulos (somente administradores)
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

    // Verifica se o usuário ainda tem permissão de admin
    let { data: adminUser, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .single();

    if (error || !adminUser || adminUser.role !== "admin") {
        alert("Apenas administradores podem postar!");
        window.location.href = "login.html";
        return;
    }

    // Enviar os dados para o Supabase
    let { error: postError } = await supabase.from("chapters").insert([
        { title: titulo, content: conteudo, tipo, status: "aprovado" }
    ]);

    if (postError) {
        alert("Erro ao publicar: " + postError.message);
    } else {
        alert("Capítulo publicado com sucesso!");
        window.location.reload();
    }
}