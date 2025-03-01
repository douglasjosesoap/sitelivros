// Exemplo de Ranking no "reader.html"
// Exibe o top 5 com mais likes

async function carregarRanking() {
    const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
    let { data: lista, error } = await supabase
      .from("chapters")
      .select("title, likes")
      .order("likes", { ascending: false })
      .limit(5);
  
    if (error) {
      console.error("Erro no ranking:", error);
      return;
    }
  
    const ranking = document.getElementById("ranking");
    if (!ranking) return;
  
    ranking.innerHTML = "";
    lista.forEach(item => {
      let div = document.createElement("div");
      div.innerHTML = `<strong>${item.title}</strong> - Likes: ${item.likes || 0}`;
      ranking.appendChild(div);
    });
  }
  
  document.addEventListener("DOMContentLoaded", carregarRanking);
  
  /** 
   * Exemplo de leitor de páginas 
   * Se quiser exibir imagens do mangá, ajusta aqui 
   */
  const paginas = [
    "assets/manga1_pag1.jpg",
    "assets/manga1_pag2.jpg"
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