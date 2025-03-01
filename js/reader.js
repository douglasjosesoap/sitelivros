async function carregarRanking() {
    let { data: livros, error } = await supabase
        .from("chapters")
        .select("id, title, likes")
        .order("likes", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Erro ao carregar ranking:", error);
        return;
    }

    const ranking = document.getElementById("ranking");
    ranking.innerHTML = ""; 

    livros.forEach(livro => {
        let div = document.createElement("div");
        div.innerHTML = `<h3>${livro.title} - ${livro.likes} 👍</h3>`;
        ranking.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", carregarRanking);