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

/* ==== Poe Chatbox: client-only (OpenAI-compatible, key round-robin) ==== */
(() => {
  // ⚠️ 依需求：前端直放 API Keys（每則訊息輪替一把）
  const POE_KEYS = [
    "9hLM5-II9L1VFhLGjiKwhQCTUaqCWL1uE4a3m3CLp9M",
    "OcIKAOi4JZvbGqhdP3fXaa2sogZC0gGVqX2UnNBm3nA",
    "JhBjdcTazfgP_je1vh1iPNqLgSGLUT1YLJW58Ns7Tck",
    "kz0OAgf-I-QPpK7f3ES4sZEjCpf6eYrX_0rb3eUwlb8",
    "DqaCjSGNArfWK2JoElgTNzJLZp0iVa5_wBbljrrpH1Q",
  ];
  let keyIndex = 0;
  const nextKey = () => {
    const k = POE_KEYS[keyIndex % POE_KEYS.length];
    keyIndex++;
    return k;
  };

  // 載入 widget CSS（沿用原本）
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'ta-widget.css';
  document.head.appendChild(link);

  // DOM
  const root = document.createElement('div');
  root.id = 'ta-root';
  root.innerHTML = `
    <button id="ta-open" aria-label="Open assistant">💬</button>
    <div id="ta-window" role="dialog" aria-label="Assistant">
      <div class="ta-header">
        <div class="ta-title">
          <img src="images/T0nyAI_logo.png" alt="T0nyAI"/>
          <span>T0nyAI Assistant</span>
        </div>
        <button id="ta-close" aria-label="Close">✕</button>
      </div>
      <div class="ta-body">
        <div id="ta-log" class="ta-log" role="log" aria-live="polite">
          <div class="ta-msg ta-bot">Tony AI Bot here. Ask me anything about Tony’s achievements. 🙂🙂！</div>
        </div>
      </div>
      <form id="ta-form" class="ta-input">
        <input id="ta-text" type="text" placeholder="輸入訊息…" autocomplete="off" required />
        <button type="submit" class="cta-button">送出</button>
      </form>
    </div>
  `;
  document.body.appendChild(root);

  const openBtn  = document.getElementById('ta-open');
  const winEl    = document.getElementById('ta-window');
  const closeBtn = document.getElementById('ta-close');
  const form     = document.getElementById('ta-form');
  const input    = document.getElementById('ta-text');
  const log      = document.getElementById('ta-log');

  const open = () => { winEl.style.display = 'flex'; input.focus(); toBottom(); };
  const close = () => { winEl.style.display = 'none'; };
  openBtn.addEventListener('click', () => (winEl.style.display === 'flex' ? close() : open()));
  closeBtn.addEventListener('click', close);

  function toBottom(){ requestAnimationFrame(()=>{ log.scrollTop = log.scrollHeight; }); }
  function addMsg(text, who='bot'){
    const d = document.createElement('div');
    d.className = `ta-msg ${who === 'me' ? 'ta-me' : 'ta-bot'}`;
    d.textContent = text;
    log.appendChild(d);
    toBottom();
    return d;
  }

  // 以 Poe 的 OpenAI 相容端點請求
  async function askPoe(userText, history=[]){
    const body = {
      model: "TonyBuddy_0001", // 你已訓練好的 Poe Bot
      messages: [
        // 可依需求加入 system 指令；這裡直接讓 Bot 依 Poe 設定運作
        ...history.slice(-12),               // 保留最近對話
        { role: "user", content: userText }
      ]
    };

    const r = await fetch("https://api.poe.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${nextKey()}`, // 每題換一把 key
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      throw new Error(`${r.status} ${await r.text().catch(()=> '')}`);
    }
    const data = await r.json();
    // OpenAI 相容格式：choices[0].message.content
    return data?.choices?.[0]?.message?.content ?? "(無回覆內容)";
  }

  const history = [];
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const t = input.value.trim();
    if (!t) return;
    addMsg(t, 'me'); history.push({ role:'user', content:t }); input.value=''; input.focus();

    const thinking = addMsg('Thinking...');
    try{
      const reply = await askPoe(t, history);
      thinking.remove(); addMsg(reply, 'bot'); history.push({ role:'assistant', content:reply });
    }catch(err){
      thinking.remove();
      // 仍保留原本錯誤提示樣式
      const msg = (String(err).toLowerCase().includes('cors') || String(err).includes('csp'))
        ? '瀏覽器攔截了連線（CORS/CSP）。'
        : `抱歉，服務暫時無法連線：${err.message||err}`;
      addMsg(msg,'bot');
      console.error('[TA][Poe]', err);
    }
  });
})();

  