const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async function () {
  const conteudo = document.getElementById("conteudo");
  const ranking = document.getElementById("ranking");

  // 1) Carregar últimos capítulos
  let { data: capitulos, error } = await supabase
    .from("chapters")
    .select("*")
    .order("id", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erro ao carregar capítulos:", error);
    return;
  }

  if (capitulos.length === 0) {
    conteudo.innerHTML = "<p>Nenhum capítulo publicado ainda.</p>";
  } else {
    capitulos.forEach(cap => {
      let div = document.createElement("div");
      div.classList.add("capitulo");
      div.innerHTML = `<h3>${cap.title} (${cap.tipo})</h3><p>${cap.content}</p>`;
      conteudo.appendChild(div);
    });
  }

  // 2) Carregar ranking de likes
  let { data: top, error: rankError } = await supabase
    .from("chapters")
    .select("title, likes")
    .order("likes", { ascending: false })
    .limit(5);

  if (rankError) {
    console.error("Erro ao carregar ranking:", rankError);
    return;
  }

  if (ranking) {
    if (top.length === 0) {
      ranking.innerHTML = "<p>Nenhum capítulo curtido ainda.</p>";
    } else {
      top.forEach(item => {
        let div = document.createElement("div");
        div.innerHTML = `<strong>${item.title}</strong> - Likes: ${item.likes || 0}`;
        ranking.appendChild(div);
      });
    }
  }
});