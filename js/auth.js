const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função de login para Admin e Usuários normais
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Busca usuário no banco pelo email
    let { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);

    if (error || users.length === 0) {
        alert("Usuário não encontrado!");
        return;
    }

    const user = users[0];

    // Verifica a senha (OBS: Supabase não tem verificação de senha nativa via API pública, isso precisaria ser ajustado com autenticação real)
    if (user.password !== password) {
        alert("Senha incorreta!");
        return;
    }

    // Salva usuário na sessão
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "index.html";
    }
}