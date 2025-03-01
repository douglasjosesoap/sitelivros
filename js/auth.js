const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para cadastrar novos usuários
async function cadastrar() {
    const username = document.getElementById("newUser").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPass").value;
    const role = document.getElementById("userRole").value;
    const prologo = document.getElementById("prologo").value;

    if (!username || !email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    let status = role === "autor" ? "pendente" : "aprovado";

    let { error } = await supabase.from("users").insert([
        { username, email, password, role, status, prologo }
    ]);

    if (error) {
        alert("Erro ao cadastrar: " + error.message);
    } else {
        alert("Cadastro realizado! Se você for autor, aguarde aprovação do admin.");
        window.location.href = "login.html";
    }
}

// Função para realizar login
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !user) {
        alert("Usuário não encontrado ou erro ao buscar no banco!");
        return;
    }

    if (user.password !== password) {
        alert("Senha incorreta!");
        return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else if (user.role === "autor") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "index.html";
    }
}

// Função para logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// Adicionando eventos aos botões para garantir que as funções sejam chamadas corretamente
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