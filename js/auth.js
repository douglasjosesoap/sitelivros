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

    if (error) {
        alert("Erro ao cadastrar: " + error.message);
    } else {
        alert("Cadastro realizado! Se você for autor, aguarde aprovação do admin.");
        window.location.href = "login.html";
    }
}