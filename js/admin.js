const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para validar login do admin
async function loginAdmin() {
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPass").value;

    let { data: user, error } = await supabase
        .from("users")
        .select("id, username, email, password, role")
        .eq("email", email)
        .single();

    if (error || !user) {
        alert("Usuário não encontrado!");
        return;
    }

    if (user.password !== password) {
        alert("Senha incorreta!");
        return;
    }

    if (user.role !== "admin") {
        alert("Acesso negado! Apenas administradores podem acessar.");
        return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    alert("Login bem-sucedido! Redirecionando...");
    window.location.href = "admin.html";
}

// Função para verificar se o usuário é admin ao acessar o painel
async function verificarAdmin() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Você precisa estar logado!");
        window.location.href = "admin-login.html";
        return;
    }

    let { data: adminUser, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .single();

    if (error || !adminUser || adminUser.role !== "admin") {
        alert("Acesso negado! Apenas administradores podem acessar.");
        window.location.href = "admin-login.html";
    }
}

// Verifica permissão ao carregar a página
document.addEventListener("DOMContentLoaded", verificarAdmin);