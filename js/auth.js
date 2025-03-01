const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Busca usuário no banco pelo email
    let { data: users, error } = await supabase
        .from("users")
        .select("id, username, email, password, role")
        .eq("email", email)
        .single();

    if (error || !users) {
        alert("Usuário não encontrado ou erro ao buscar no banco!");
        console.error("Erro:", error);
        return;
    }

    // Verifica se a senha digitada corresponde à senha no banco
    if (users.password !== password) {
        alert("Senha incorreta!");
        return;
    }

    // Salva o usuário no localStorage para manter a sessão ativa
    localStorage.setItem("user", JSON.stringify(users));

    // Redirecionamento baseado no tipo de usuário
    if (users.role === "admin") {
        alert("Login como administrador bem-sucedido!");
        window.location.href = "admin.html";
    } else {
        alert("Login bem-sucedido! Redirecionando...");
        window.location.href = "index.html";
    }
}

// Adicionando um evento para garantir que o botão funcione
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", login);
    }
});