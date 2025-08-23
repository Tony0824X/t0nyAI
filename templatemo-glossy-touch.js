let currentPage = 'home';

        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
                    link.classList.add('active');
                }
            });
            
            currentPage = pageId;
            
            // Move footer to the active page
            const footer = document.getElementById('footer');
            const activePage = document.getElementById(pageId);
            activePage.appendChild(footer);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Initialize footer position
        window.addEventListener('DOMContentLoaded', () => {
            const footer = document.getElementById('footer');
            const homePage = document.getElementById('home');
            homePage.appendChild(footer);
        });

        // Add interactive parallax effect to background shapes
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const xPos = (x - 0.5) * speed * 20;
                const yPos = (y - 0.5) * speed * 20;
                shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });

        // Add scroll-based animations
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.bg-shapes');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });

        // Add click ripple effect to glass elements
        document.querySelectorAll('.glass').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('div');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Form submission handling
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create success message
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(46, 204, 113, 0.9);
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                backdrop-filter: blur(20px);
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            `;
            successMsg.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            
            document.body.appendChild(successMsg);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
            
            // Reset form
            this.reset();
        });

        // Add fade in animation
        const fadeStyle = document.createElement('style');
        fadeStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(fadeStyle);

/* ==== DeepSeek Chatbox: client-only (no proxy, Shadow DOM) ==== */
(() => {
    // ⚠️ 前端硬編金鑰會外洩，僅供實驗用
    const DEEPSEEK_API_KEY = "sk-ad3d36b49f9a4b56a3e630abafe8f94f";
    if (!DEEPSEEK_API_KEY) { console.warn("[TonyAI Chat] 缺少金鑰"); return; }
  
    // 1) 建立 Shadow DOM 容器（樣式完全與頁面隔離）
    const host = document.createElement("div");
    host.id = "ds-chat-root-host";
    host.style.position = "fixed";
    host.style.right = "20px";
    host.style.bottom = "20px";
    host.style.zIndex = "9999";
    const shadow = host.attachShadow({ mode: "open" });
    document.body.appendChild(host);
  
    // 2) Shadow 內樣式（玻璃擬態 + Grid 三段式 + 獨立捲動）
    const style = document.createElement("style");
    style.textContent = `
      :host{ all: initial; } /* 防止外部繼承 */
      *, *::before, *::after { box-sizing: border-box; }
  
      .launcher{
        width:56px; height:56px; border:none; border-radius:50%; cursor:pointer;
        font-size:24px; line-height:56px; text-align:center;
        background:rgba(255,255,255,.25); color:#111;
        backdrop-filter: blur(12px);
        box-shadow:0 10px 30px rgba(0,0,0,.25);
        transition: transform .2s, box-shadow .2s;
      }
      .launcher:hover{ transform:translateY(-2px); box-shadow:0 14px 36px rgba(0,0,0,.28); }
  
      .window{
        position:fixed; /* 直接固定在視窗，不受任何父層影響 */
        right:20px; bottom:86px;
        width:min(380px, 90vw); height:520px;
        display:none;
        border-radius:18px; overflow:hidden;
        background: linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.12));
        backdrop-filter: blur(20px);
        box-shadow:0 18px 50px rgba(0,0,0,.28);
  
        display:grid;
        grid-template-rows: auto 1fr auto; /* header / messages / footer */
        contain: layout paint style;       /* 降低外部重排風險 */
      }
  
      .header{
        display:flex; align-items:center; justify-content:space-between;
        padding:12px 14px;
        border-bottom:1px solid rgba(255,255,255,.25);
      }
      .title{
        display:flex; gap:10px; align-items:center; font-weight:700;
      }
      .title img{ width:28px; height:28px; object-fit:contain; }
      .close{ border:none; background:transparent; font-size:18px; cursor:pointer; color:#222; }
  
      .messages{
        padding:14px;
        overflow-y:auto;          /* 只在中段捲動 */
        display:flex; flex-direction:column; gap:10px;
  
        scrollbar-gutter: stable both-edges; /* 預留捲軸空間避免跳動 */
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }
      .messages::-webkit-scrollbar{ width:10px }
      .messages::-webkit-scrollbar-thumb{ background:rgba(255,255,255,.35); border-radius:8px }
      .messages::-webkit-scrollbar-track{ background:transparent }
  
      .msg{
        max-width:85%; width:fit-content;
        padding:10px 12px; border-radius:14px;
        word-break:break-word; white-space:pre-wrap;
        border:1px solid rgba(255,255,255,.35);
        background: rgba(255,255,255,.28);
      }
      .me  { align-self:flex-end; background:rgba(46,204,113,.18); border-color:rgba(46,204,113,.35); }
  
      .footer{
        display:flex; gap:8px; padding:12px 12px 16px;
        border-top:1px solid rgba(255,255,255,.25);
        background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.18));
      }
      .input{
        flex:1;
        border:1px solid rgba(255,255,255,.45);
        border-radius:12px;
        padding:10px 12px;
        background:rgba(255,255,255,.4);
        outline:none;
        margin-bottom:2px; /* 你指定的 2px 空隙 */
        font: inherit;
      }
      .input::placeholder{ color:rgba(0,0,0,.5) }
      .send{
        border:none; border-radius:14px; padding:10px 18px; cursor:pointer;
        background:rgba(255,255,255,.25); color:#fff; font-weight:700;
        outline:1px solid rgba(255,255,255,.6);
        backdrop-filter: blur(8px);
      }
  
      /* 允許使用者拖拉改高度（固定右下角，不會飄） */
      .window{ resize: vertical; min-height:360px; max-height:92vh; }
    `;
    shadow.appendChild(style);
  
    // 3) Shadow 內 DOM
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <button class="launcher" id="openBtn" aria-label="Open chat">💬</button>
  
      <div class="window" id="chatWin" role="dialog" aria-label="TonyAI Chat">
        <div class="header">
          <div class="title">
            <img src="images/T0nyAI_logo.png" alt="T0nyAI"/>
            <span>TonyAI's Chat</span>
          </div>
          <button class="close" id="closeBtn" aria-label="Close">✕</button>
        </div>
  
        <!-- 使用 role="log" 讓讀屏器以正確順序播報聊天內容 -->
        <div class="messages" id="log" role="log" aria-live="polite">
          <div class="msg">嗨，我係 T0nyAI 小助手 🙂🙂！</div>
        </div>
  
        <form class="footer" id="chatForm">
          <input class="input" id="text" type="text"
                 placeholder="輸入訊息 ..." autocomplete="off" required />
          <button class="send" type="submit">送出</button>
        </form>
      </div>
    `;
    shadow.appendChild(wrap);
  
    // 4) 行為
    const openBtn  = shadow.getElementById("openBtn");
    const closeBtn = shadow.getElementById("closeBtn");
    const chatWin  = shadow.getElementById("chatWin");
    const form     = shadow.getElementById("chatForm");
    const input    = shadow.getElementById("text");
    const log      = shadow.getElementById("log");
  
    const open = () => { chatWin.style.display = "grid"; input.focus(); scrollBottom(); };
    const close= () => { chatWin.style.display = "none"; };
    openBtn.addEventListener("click", () => (chatWin.style.display === "grid" ? close() : open()));
    closeBtn.addEventListener("click", close);
  
    function scrollBottom(){ requestAnimationFrame(()=>{ log.scrollTop = log.scrollHeight; }); }
    function addMessage(text, me=false){
      const div = document.createElement("div");
      div.className = `msg${me ? " me": ""}`;
      div.textContent = text;
      log.appendChild(div);
      scrollBottom();
      return div;
    }
  
    // Enter 送出；Shift+Enter 換行（常見聊天操作）
    input.addEventListener("keydown", (e)=>{
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    });
  
    // DeepSeek API（OpenAI 相容）
    async function askDeepSeek(userText, history=[]){
      const trimmed = history.slice(-12);
      const payload = {
        model: "deepseek-chat",
        messages: [
          { role:"system", content:"Your Name is T0nyAI. You are a helpful AI assistant of T0nyAI website. 一律使用繁體中文與簡潔回應。" },
          ...trimmed,
          { role:"user", content:userText }
        ],
        temperature: 0.7,
        stream: false
      };
      const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method:"POST",
        headers:{ "Authorization":`Bearer ${DEEPSEEK_API_KEY}`, "Content-Type":"application/json" },
        body: JSON.stringify(payload)
      });
      if (!resp.ok){
        let t = ""; try { t = await resp.text(); } catch {}
        throw new Error(`DeepSeek API error (${resp.status}) ${t}`);
      }
      const data = await resp.json();
      return data?.choices?.[0]?.message?.content ?? "(無回覆內容)";
    }
  
    const history = [];
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
  
      addMessage(text, true);
      history.push({ role:"user", content:text });
      input.value = ""; input.focus();
  
      const thinking = addMessage("思考中…");
      try{
        const reply = await askDeepSeek(text, history);
        thinking.remove();
        addMessage(reply);
        history.push({ role:"assistant", content:reply });
      }catch(err){
        thinking.remove();
        console.error(err);
        const maybeCORS = (err.message||"").toLowerCase().includes("cors");
        addMessage(maybeCORS
          ? "被瀏覽器 CORS 擋下（純前端無代理常見）。"
          : `抱歉，服務暫時無法連線：${err.message}`);
      }
    });
  })();
  
  