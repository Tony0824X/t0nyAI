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
    // ⚠️ 仍是前端硬編 API Key（正式站建議改走後端）
    const KEY = "sk-ad3d36b49f9a4b56a3e630abafe8f94f";
    if (!KEY) return;
  
    // 載入外部 CSS（符合常見 CSP：style-src 'self'）
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'ta-widget.css';  // 確認放置路徑
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
            <div class="ta-msg ta-bot">嗨，我係 T0nyAI 小助手 🙂🙂！</div>
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
  
    async function askDeepSeek(userText, history=[]){
      const payload = {
        model: 'deepseek-chat',
        messages: [
          { role:'system', content:'Your Name is T0nyAI. You are a helpful AI assistant of T0nyAI website. 一律使用繁體中文與簡潔回應。' },
          ...history.slice(-12),
          { role:'user', content:userText }
        ],
        temperature: 0.7, stream: false
      };
      const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method:'POST',
        headers:{ 'Authorization':`Bearer ${KEY}`, 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error(`${r.status} ${await r.text().catch(()=> '')}`);
      const data = await r.json();
      return data?.choices?.[0]?.message?.content ?? '(無回覆內容)';
    }
  
    const history = [];
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const t = input.value.trim();
      if (!t) return;
      addMsg(t, 'me'); history.push({ role:'user', content:t }); input.value=''; input.focus();
  
      const thinking = addMsg('思考中…');
      try{
        const reply = await askDeepSeek(t, history);
        thinking.remove(); addMsg(reply, 'bot'); history.push({ role:'assistant', content:reply });
      }catch(err){
        thinking.remove();
        const msg = (String(err).toLowerCase().includes('cors') || String(err).includes('csp'))
          ? '瀏覽器攔截了連線（CORS/CSP）。'
          : `抱歉，服務暫時無法連線：${err.message||err}`;
        addMsg(msg,'bot');
        console.error('[TA]', err);
      }
    });
  })();
  
  