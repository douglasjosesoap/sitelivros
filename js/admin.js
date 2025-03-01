const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para verificar se o usuário tem permissão de admin
function verificarAdmin() {
    const admin = JSON.parse(localStorage.getItem("admin"));
    
    if (!admin || admin.username !== "admin") {
        alert("Acesso negado! Faça login como administrador.");
        window.location.href = "admin-login.html";
    }
}

// Função de login do administrador
async function loginAdmin() {
    const username = document.getElementById("adminUser").value;
    const password = document.getElementById("adminPass").value;

    if (username === "admin" && password === "CBfdouglas20@") {
        localStorage.setItem("admin", JSON.stringify({ username: "admin" }));
        alert("Login bem-sucedido! Redirecionando para o painel...");
        window.location.href = "admin.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// Função para postar capítulos (somente administradores)
async function postarCapitulo() {
    const titulo = document.getElementById("titulo").value;
    const conteudo = document.getElementById("conteudo").value;
    const tipo = document.getElementById("tipo").value;

    // Verifica se o admin está logado antes de permitir postagem
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!admin) {
        alert("Você precisa estar logado como administrador para postar!");
        window.location.href = "admin-login.html";
        return;
    }

    let { error } = await supabase.from("chapters").insert([
        { title: titulo, content: conteudo, tipo, status: "aprovado" }
    ]);

    if (error) {
        alert("Erro ao publicar: " + error.message);
    } else {
        alert("Capítulo publicado com sucesso!");
        window.location.reload();
    }
}