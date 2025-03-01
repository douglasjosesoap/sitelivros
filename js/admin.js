async function postarCapitulo() {
    const titulo = document.getElementById("titulo").value;
    const conteudo = document.getElementById("conteudo").value;
    const tipo = document.getElementById("tipo").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "autor") {
        alert("Apenas autores podem publicar!");
        return;
    }

    let { error } = await supabase.from("chapters").insert([
        { title: titulo, content: conteudo, author_id: user.id, tipo, status: "pendente" }
    ]);

    if (!error) {
        alert("Seu capítulo foi enviado para aprovação do admin.");
    } else {
        alert("Erro ao publicar: " + error.message);
    }
}