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

    let { data: validUser, error } = await supabase
        .from("users")
        .select("role, status")
        .eq("email", user.email)
        .single();

    if (error || !validUser || (validUser.role !== "admin" && validUser.role !== "autor") || validUser.status !== "aprovado") {
        alert("Apenas administradores e autores aprovados podem postar!");
        return;
    }

    let { error: postError } = await supabase.from("chapters").insert([
        { title: titulo, content: conteudo, tipo, author_id: user.id, status: "aprovado" }
    ]);

    if (postError) {
        alert("Erro ao publicar: " + postError.message);
    } else {
        alert("Capítulo publicado com sucesso!");
        window.location.reload();
    }
}