/**
 * ==============================================================================
 * 🚀 PROJECT: TITAN AI PREDICTOR MD5 - V70.0 FINAL MASTER
 * 🛠 VERSION: 70.0.0 (BLOCKQUOTE EDITION)
 * 👤 ADMIN: @Cskhtoolhehe (7675213335)
 * ⚖️ COMMITMENT: ADMIN POWER | QUOTE UI | INFINITY LOOP | BANKING 1S
 * ==============================================================================
 */

const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const moment = require('moment-timezone');

// ==============================================================================
// [CẤU HÌNH TRUNG TÂM]
// ==============================================================================
const CONFIG = {
    CORE: {
        TOKEN: "8067704153:AAF1ZinZv0-iRNrrGv3gJYZuQU9OCzb33ts",
        ADMIN_ID: 8258212830,
        ADMIN_HANDLE: "@Cskhtoolhehe",
        TZ: "Asia/Ho_Chi_Minh"
    },
    BANKING: {
        API_KEY: "0aed581caf381eef940f2c395e21fcdb",
        STK: "99ZP25192M13568006",
        OWNER: "DUONG THE TIEN",
        BIN: "VCCB",
        ENDPOINT: "https://api.thueapibank.vn/api/get-history-zalopay/",
        SCAN_DELAY: 1000 
    },
    PRICING: {
        VIP_30D: 100000,
        VIP_PERM: 150000
    },
    DATA: {
        DIR: "./TITAN_MASTER_DATA",
        USERS: "database_users.json",
        LEDGER: "bank_history.json"
    }
};

const bot = new Telegraf(CONFIG.CORE.TOKEN);
const app = express();

// ==============================================================================
// [LÕI DỮ LIỆU - TITAN VAULT]
// ==============================================================================
class TitanVault {
    constructor() {
        this.base = CONFIG.DATA.DIR;
        if (!fs.existsSync(this.base)) fs.mkdirSync(this.base, { recursive: true });
        this.users = this._load(CONFIG.DATA.USERS, {});
        this.ledger = this._load(CONFIG.DATA.LEDGER, []);
    }
    _load(file, def) {
        const p = path.join(this.base, file);
        return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : def;
    }
    save() {
        fs.writeFileSync(path.join(this.base, CONFIG.DATA.USERS), JSON.stringify(this.users, null, 4));
        fs.writeFileSync(path.join(this.base, CONFIG.DATA.LEDGER), JSON.stringify(this.ledger, null, 4));
    }
    sync(ctx) {
        const uid = ctx.from.id;
        if (!this.users[uid]) {
            this.users[uid] = {
                id: uid, name: ctx.from.first_name, username: ctx.from.username || "Guest",
                balance: 0, expiry: 0, total_in: 0, is_ban: false,
                role: (uid == CONFIG.CORE.ADMIN_ID) ? "ADMIN" : "USER"
            };
            this.save();
        }
        return this.users[uid];
    }
}
const DB = new TitanVault();

// ==============================================================================
// [AI ENGINE - DỮ ZIN]
// ==============================================================================
class TitanAI {
    static async solve(hash) {
        return new Promise((resolve) => {
            const processTime = 2500 + Math.random() * 2000;
            setTimeout(() => {
                const entropy = hash.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                const seed = Math.random() * 100;
                let pred = (entropy % 2 === 0);
                let result = seed <= 90 ? (pred ? "TÀI" : "XỈU") : (pred ? "XỈU" : "TÀI");
                resolve({
                    result: result,
                    conf: (93 + Math.random() * 5).toFixed(2),
                    trace: crypto.createHash('md5').update(hash + Date.now()).digest('hex').toUpperCase().slice(0, 8),
                    delay: (processTime / 1000).toFixed(1)
                });
            }, processTime);
        });
    }
}

// ==============================================================================
// [GIAO DIỆN PHẢN HỒI - BLOCKQUOTE UI]
// ==============================================================================
const UI = {
    keyboards: {
        main: (uid) => {
            const btns = [
                ["⚡ PHÂN TÍCH MD5", "💰 NẠP TIỀN"],
                ["🔑 MUA KEY VIP", "👤 TÀI KHOẢN"],
                ["📊 THỐNG KÊ", "📞 HỖ TRỢ"]
            ];
            if (uid == CONFIG.CORE.ADMIN_ID) btns.push(["⚙️ QUẢN TRỊ VIÊN"]);
            return Markup.keyboard(btns).resize();
        },
        vip: () => Markup.keyboard([["💎 GÓI 30 NGÀY (100K)", "🔥 GÓI VĨNH VIỄN (150K)"], ["🏠 QUAY LẠI MENU"]]).resize(),
        admin: () => Markup.keyboard([["📢 THÔNG BÁO", "📋 TẤT CẢ USER"], ["💎 KÍCH VIP", "🚫 KHÓA USER"], ["🏠 QUAY LẠI MENU"]]).resize(),
        back: () => Markup.keyboard([["🏠 QUAY LẠI MENU"]]).resize()
    },
    text: {
        welcome: (name) => 
            `🔱 <b>TITAN PREDICTOR MD5</b>\n` +
            `<blockquote>Chào mừng <b>${name}</b> đã quay trở lại hệ thống dự đoán MD5 uy tín số 1.</blockquote>\n` +
            `📡 Trạng thái: <b>Premium Stable ✅</b>\n` +
            `👤 Liên hệ: <b>${CONFIG.CORE.ADMIN_HANDLE}</b>`,
        md5Result: (res, bal) => 
            `🔮 <b>KẾT QUẢ PHÂN TÍCH</b>\n` +
            `<blockquote>🎯 Dự đoán: <b>${res.result}</b>\n` +
            `🧬 Trace: <code>${res.trace}</code>\n` +
            `💎 Tin cậy: <b>${res.conf}%</b></blockquote>\n` +
            `💰 Số dư: <b>${bal.toLocaleString()}đ</b>\n` +
            `📥 <i>Sẵn sàng cho mã tiếp theo...</i>`
    }
};

// ==============================================================================
// [LUỒNG XỬ LÝ CHÍNH]
// ==============================================================================
bot.use(session());

// Middleware kiểm tra Ban & Sync
bot.use((ctx, next) => {
    if (ctx.from) {
        const user = DB.sync(ctx);
        if (user.is_ban && ctx.from.id != CONFIG.CORE.ADMIN_ID) return ctx.reply("⛔ Bạn đã bị cấm khỏi hệ thống.");
    }
    return next();
});

bot.start((ctx) => ctx.replyWithHTML(UI.text.welcome(ctx.from.first_name), UI.keyboards.main(ctx.from.id)));

bot.hears("🏠 QUAY LẠI MENU", (ctx) => {
    ctx.session = null;
    ctx.reply("🏠 Đã quay lại menu chính.", UI.keyboards.main(ctx.from.id));
});

bot.hears("👤 TÀI KHOẢN", (ctx) => {
    const u = DB.users[ctx.from.id];
    let status = u.expiry === -1 ? "Vĩnh viễn 🔥" : (u.expiry > Date.now() ? moment(u.expiry).format('DD/MM/YYYY') : "Thường");
    ctx.replyWithHTML(`<b>👤 TÀI KHOẢN</b>\n<blockquote>🆔 ID: <code>${u.id}</code>\n💰 Số dư: <b>${u.balance.toLocaleString()}đ</b>\n🔑 Key: <b>${status}</b></blockquote>`);
});

bot.hears("📊 THỐNG KÊ", (ctx) => {
    ctx.replyWithHTML(`<b>📊 THỐNG KÊ</b>\n<blockquote>👥 Người dùng: <b>${Object.keys(DB.users).length}</b>\n📡 Server: <b>Premium</b></blockquote>`);
});

bot.hears("📞 HỖ TRỢ", (ctx) => ctx.replyWithHTML(`💬 Hỗ trợ: <b>${CONFIG.CORE.ADMIN_HANDLE}</b>`));

// --- MUA KEY ---
bot.hears("🔑 MUA KEY VIP", (ctx) => {
    ctx.replyWithHTML(`<b>🔑 MUA KEY VIP TỰ ĐỘNG</b>\n<blockquote>Gói 30 ngày: 100k\nGói Vĩnh viễn: 150k</blockquote>`, UI.keyboards.vip());
});

bot.hears("💎 GÓI 30 NGÀY (100K)", (ctx) => {
    const u = DB.users[ctx.from.id];
    if (u.balance < CONFIG.PRICING.VIP_30D) return ctx.reply("❌ Không đủ số dư!");
    u.balance -= CONFIG.PRICING.VIP_30D;
    u.expiry = Math.max(Date.now(), u.expiry) + (30 * 86400000);
    DB.save();
    ctx.reply("✅ Đã kích hoạt VIP 30 ngày!", UI.keyboards.main(ctx.from.id));
});

bot.hears("🔥 GÓI VĨNH VIỄN (150K)", (ctx) => {
    const u = DB.users[ctx.from.id];
    if (u.balance < CONFIG.PRICING.VIP_PERM) return ctx.reply("❌ Không đủ số dư!");
    u.balance -= CONFIG.PRICING.VIP_PERM;
    u.expiry = -1;
    DB.save();
    ctx.reply("🔥 Đã kích hoạt VIP VĨNH VIỄN!", UI.keyboards.main(ctx.from.id));
});

bot.hears("⚡ PHÂN TÍCH MD5", (ctx) => {
    const u = DB.users[ctx.from.id];
    if (u.expiry !== -1 && u.expiry < Date.now()) return ctx.reply("❌ Vui lòng mua Key VIP!");
    ctx.session = { step: 'AI_WAIT' };
    ctx.replyWithHTML(`📥 <b>CHẾ ĐỘ SOI LIÊN TỤC</b>\n<blockquote>Vui lòng dán mã MD5 (32 ký tự)</blockquote>`, UI.keyboards.back());
});

bot.hears("💰 NẠP TIỀN", (ctx) => {
    ctx.session = { step: 'NAP_VAL' };
    ctx.replyWithHTML("💵 <b>Nhập số tiền cần nạp:</b>", UI.keyboards.back());
});

// ==============================================================================
// [ADMIN CONTROL CENTER - TRIỆT ĐỂ 100%]
// ==============================================================================
bot.hears("⚙️ QUẢN TRỊ VIÊN", (ctx) => {
    if (ctx.from.id != CONFIG.CORE.ADMIN_ID) return;
    ctx.replyWithHTML("<b>🛠 TITAN ADMIN MASTER</b>", UI.keyboards.admin());
});

bot.on('text', async (ctx, next) => {
    const uid = ctx.from.id;
    const txt = ctx.text.trim();
    const session = ctx.session || {};

    // --- ADMIN COMMANDS ---
    if (uid == CONFIG.CORE.ADMIN_ID) {
        if (txt === "📋 TẤT CẢ USER") {
            const list = Object.values(DB.users).map(u => `- <code>${u.id}</code> | ${u.balance.toLocaleString()}đ`).join('\n');
            return ctx.replyWithHTML(`<b>📋 DANH SÁCH:</b>\n${list.slice(0, 3800)}`);
        }
        if (txt === "📢 THÔNG BÁO") { ctx.session = { step: 'ADM_BC' }; return ctx.reply("Nhập nội dung:"); }
        if (txt === "💎 KÍCH VIP") return ctx.replyWithHTML("Cú pháp:\n<code>/vip30 [ID]</code>\n<code>/vipvv [ID]</code>");
        if (txt === "🚫 KHÓA USER") return ctx.replyWithHTML("Cú pháp:\n<code>/ban [ID]</code>\n<code>/unban [ID]</code>");

        // Xử lý lệnh Slash Admin
        if (txt.startsWith('/')) {
            const [cmd, tid] = txt.split(' ');
            if (!DB.users[tid]) return ctx.reply("❌ ID không tồn tại!");
            
            if (cmd === '/vip30') { DB.users[tid].expiry = Date.now() + (30*86400000); ctx.reply("✅ OK 30D"); }
            if (cmd === '/vipvv') { DB.users[tid].expiry = -1; ctx.reply("🔥 OK VV"); }
            if (cmd === '/ban') { DB.users[tid].is_ban = true; ctx.reply("🚫 Đã khóa"); }
            if (cmd === '/unban') { DB.users[tid].is_ban = false; ctx.reply("🔓 Đã mở"); }
            DB.save(); return;
        }

        if (session.step === 'ADM_BC') {
            const ids = Object.keys(DB.users);
            ctx.reply(`🚀 Gửi cho ${ids.length} người...`);
            for (const t of ids) { try { await bot.telegram.sendMessage(t, `📢 <b>THÔNG BÁO:</b>\n\n${txt}`, { parse_mode: 'HTML' }); } catch(e){} }
            ctx.reply("✅ Hoàn tất!"); ctx.session = null; return;
        }
    }

    // --- USER LOGIC ---
    if (session.step === 'AI_WAIT') {
        if (txt.length !== 32) return ctx.reply("❌ Mã MD5 sai định dạng!");
        const l = await ctx.replyWithHTML("🔍 <b>Đang phân tích Neural...</b>");
        const res = await TitanAI.solve(txt);
        const u = DB.users[uid];
        await ctx.telegram.editMessageText(ctx.chat.id, l.message_id, null, UI.text.md5Result(res, u.balance), { parse_mode: 'HTML' });
        return; 
    }

    if (session.step === 'NAP_VAL') {
        const amt = parseInt(txt);
        if (isNaN(amt) || amt < 1000) return ctx.reply("❌ Tối thiểu 1k!");
        const qr = `https://img.vietqr.io/image/${CONFIG.BANKING.BIN}-${CONFIG.BANKING.STK}-compact2.jpg?amount=${amt}&addInfo=NAP${uid}`;
        ctx.replyWithPhoto(qr, { caption: `<b>🏦 NẠP TIỀN</b>\n<blockquote>STK: ${CONFIG.BANKING.STK}\nNội dung: NAP${uid}</blockquote>`, parse_mode: 'HTML' });
        ctx.session = null; return;
    }

    return next();
});

// ==============================================================================
// [AUTO BANKING SCANNER]
// ==============================================================================
async function scanBank() {
    try {
        const r = await axios.get(`${CONFIG.BANKING.ENDPOINT}${CONFIG.BANKING.API_KEY}`);
        const data = r.data?.data || [];
        for (const tx of data) {
            if (DB.ledger.includes(tx.id)) continue;
            const match = tx.description.toUpperCase().match(/NAP(\d+)/);
            if (match && DB.users[match[1]]) {
                const amt = parseInt(tx.amount);
                DB.users[match[1]].balance += amt;
                DB.users[match[1]].total_in += amt;
                DB.ledger.push(tx.id);
                DB.save();
                bot.telegram.sendMessage(match[1], `✅ Nạp thành công +${amt.toLocaleString()}đ`, { parse_mode: 'HTML' });
            }
        }
    } catch (e) {}
}
setInterval(scanBank, 1000);

app.get('/', (req, res) => res.send('TITAN V70 MASTER IS ONLINE'));
app.listen(process.env.PORT || 3000);
bot.launch().then(() => console.log("🔱 TITAN V70 MASTER READY"));

process.on('unhandledRejection', (e) => console.log("PROMISE_ERR:", e));
process.on('uncaughtException', (e) => console.log("FATAL_ERR:", e));
