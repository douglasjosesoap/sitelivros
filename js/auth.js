const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cadastrar() {
    const username = document.getElementById("newUser").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPass").value;
    const role = document.getElementById("userRole").value;
    const prologo = document.getElementById("prologo").value;

    let status = role === "autor" ? "pendente" : "aprovado"; 

    let { error } = await supabase.from("users").insert([
        { username, email, password, role, status, prologo }
    ]);

    if (!error) {
        alert("Cadastro realizado! Se você for autor, aguarde aprovação do admin.");
        window.location.href = "login.html";
    } else {
        alert("Erro ao cadastrar: " + error.message);
    }
}