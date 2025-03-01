const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Ranking para exibir no reader.html (caso queira)
document.addEventListener("DOMContentLoaded", async function () {
  const ranking = document.getElementById("ranking");
  if (!ranking) return;

  let { data: top, error } = await supabase
    .from("chapters")
    .select("title, likes")
    .order("likes", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erro ao carregar ranking:", error);
    return;
  }

  if (top.length === 0) {
    ranking.innerHTML = "<p>Ninguém curtiu ainda.</p>";
  } else {
    top.forEach(item => {
      let div = document.createElement("div");
      div.innerHTML = `<strong>${item.title}</strong> - Likes: ${item.likes}`;
      ranking.appendChild(div);
    });
  }
});

// Exemplo de "leitor" de imagens
const paginas = [
  "assets/manga1_pag1.jpg",
  "assets/manga1_pag2.jpg",
  "assets/manga1_pag3.jpg"
];
let paginaAtual = 0;
const imgElemento = document.getElementById("pagina-atual");

function atualizarPagina() {
  if (imgElemento) {
    imgElemento.src = paginas[paginaAtual];
  }
}

function paginaAnterior() {
  if (paginaAtual > 0) {
    paginaAtual--;
    atualizarPagina();
  }
}

function proximaPagina() {
  if (paginaAtual < paginas.length - 1) {
    paginaAtual++;
    atualizarPagina();
  }
}

document.addEventListener("DOMContentLoaded", atualizarPagina);