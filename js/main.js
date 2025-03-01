const SUPABASE_URL = "https://xjbhlpravirbhmvoornj.supabase.co";
const SUPABASE_ANON_KEY = "SEU_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(https://xjbhlpravirbhmvoornj.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmhscHJhdmlyYmhtdm9vcm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDIxOTcsImV4cCI6MjA1NjM3ODE5N30.MJI87j7DNXymETt-wh_mpEEhW1LVtHC6G4-hsoaHa5w);

document.addEventListener("DOMContentLoaded", async function () {
    const conteudo = document.getElementById("conteudo");

    // Buscar capítulos do Supabase
    let { data: capitulos, error } = await supabase.from("chapters").select("*");

    if (error) {
        console.error("Erro ao carregar capítulos:", error);
        return;
    }

    capitulos.forEach(cap => {
        let div = document.createElement("div");
        div.classList.add("capitulo");
        div.innerHTML = `<h3>${cap.title}</h3><p>${cap.content}</p>`;
        conteudo.appendChild(div);
    });
});