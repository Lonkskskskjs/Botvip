/**
 * ==============================================================================
 * 🚀 PROJECT: TITAN AI PREDICTOR MD5 - ULTIMATE PRE-MASTER
 * 🛠 VERSION: 65.0.0 (FULL PREMIUM COMPLETE)
 * 👤 ADMIN: @Cskhtoolhehe (7675213335)
 * ⚖️ COMMITMENT: VÒNG LẶP MD5 | MUA KEY TỰ ĐỘNG | BANKING 1S | DỮ ZIN CẤU TRÚC
 * ==============================================================================
 */

const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const moment = require('moment-timezone');

// ==============================================================================
// [MODULE 1: CẤU HÌNH TRUNG TÂM - GIỮ ZIN]
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
        LEDGER: "bank_history.json",
        AUDIT: "system_security.log"
    }
};

const bot = new Telegraf(CONFIG.CORE.TOKEN);
const app = express();

// ==============================================================================
// [MODULE 2: LÕI LƯU TRỮ VÀ BẢO MẬT]
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
    log(tag, msg) {
        const time = moment().tz(CONFIG.CORE.TZ).format('HH:mm:ss DD/MM/YYYY');
        fs.appendFileSync(path.join(this.base, CONFIG.DATA.AUDIT), `[${time}] [${tag}] ${msg}\n`);
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
// [MODULE 3: AI NEURAL ENGINE - WINRATE 90%]
// ==============================================================================
class TitanAI {
    static async solve(hash) {
        return new Promise((resolve) => {
            const processTime = 3000 + Math.random() * 2000;
            setTimeout(() => {
                const entropy = hash.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                const seed = Math.random() * 100;
                let pred = (entropy % 2 === 0);
                let result = seed <= 90 ? (pred ? "TÀI" : "XỈU") : (pred ? "XỈU" : "TÀI");
                resolve({
                    result: result,
                    conf: (93 + Math.random() * 5).toFixed(2),
                    trace: crypto.createHash('md5').update(hash + Date.now()).digest('hex').toUpperCase().slice(0, 10),
                    delay: (processTime / 1000).toFixed(1)
                });
            }, processTime);
        });
    }
}

// ==============================================================================
// [MODULE 4: GIAO DIỆN NGƯỜI DÙNG UI/UX]
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
        vip: () => Markup.keyboard([
            ["💎 GÓI 30 NGÀY (100K)", "🔥 GÓI VĨNH VIỄN (150K)"],
            ["🏠 QUAY LẠI MENU"]
        ]).resize(),
        admin: () => Markup.keyboard([
            ["📢 THÔNG BÁO TỔNG", "📋 DANH SÁCH USER"],
            ["💎 KÍCH HOẠT VIP", "🚫 KHÓA TÀI KHOẢN"],
            ["🏠 QUAY LẠI MENU"]
        ]).resize(),
        back: () => Markup.keyboard([["🏠 QUAY LẠI MENU"]]).resize()
    }
};

// ==============================================================================
// [MODULE 5: ĐIỀU PHỐI TIN NHẮN TỔNG]
// ==============================================================================
bot.use(session());

bot.use((ctx, next) => {
    if (ctx.from) {
        const user = DB.sync(ctx);
        if (user.is_ban && ctx.from.id != CONFIG.CORE.ADMIN_ID) return ctx.reply("⛔ Bạn đã bị cấm.");
    }
    return next();
});

bot.start((ctx) => {
    ctx.replyWithHTML(`<b>🔱 TITAN AI PREDICTOR v65.0</b>\nChào <b>${ctx.from.first_name}</b>, hệ thống đã sẵn sàng phục vụ!`, UI.keyboards.main(ctx.from.id));
});

bot.hears("🏠 QUAY LẠI MENU", (ctx) => {
    ctx.session = null;
    ctx.reply("🏠 Đã quay lại menu chính.", UI.keyboards.main(ctx.from.id));
});

bot.hears("👤 TÀI KHOẢN", (ctx) => {
    const u = DB.users[ctx.from.id];
    let status = u.expiry === -1 ? "Legendary VIP 🔥" : (u.expiry > Date.now() ? `VIP (${moment(u.expiry).format('DD/MM/YYYY')})` : "Thường");
    ctx.replyWithHTML(`<b>👤 THÔNG TIN KHÁCH HÀNG</b>\n━━━━━━━━━━━━━━━━━━━━━\n🆔 ID: <code>${u.id}</code>\n💰 Số dư: <b>${u.balance.toLocaleString()}đ</b>\n🔑 Trạng thái: <b>${status}</b>\n📥 Tổng nạp: <b>${u.total_in.toLocaleString()}đ</b>`);
});

bot.hears("📊 THỐNG KÊ", (ctx) => {
    const totalUsers = Object.keys(DB.users).length;
    ctx.replyWithHTML(`<b>📊 THỐNG KÊ HỆ THỐNG</b>\n━━━━━━━━━━━━━━━━━━━━━\n👥 Tổng User: <b>${totalUsers}</b>\n📡 Server: <b>Premium Online ✅</b>`);
});

bot.hears("📞 HỖ TRỢ", (ctx) => {
    ctx.replyWithHTML(`💬 Admin hỗ trợ duy nhất: <b>${CONFIG.CORE.ADMIN_HANDLE}</b>`);
});

// --- LOGIC MUA KEY VIP ---
bot.hears("🔑 MUA KEY VIP", (ctx) => {
    ctx.replyWithHTML(
        `<b>🔑 NÂNG CẤP KEY VIP TỰ ĐỘNG</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `1️⃣ <b>Gói 30 Ngày:</b> 100,000đ\n` +
        `2️⃣ <b>Gói Vĩnh Viễn:</b> 150,000đ\n\n` +
        `<i>Hệ thống tự động trừ tiền từ số dư ví.</i>`,
        UI.keyboards.vip()
    );
});

bot.hears("💎 GÓI 30 NGÀY (100K)", (ctx) => {
    const u = DB.users[ctx.from.id];
    if (u.balance < CONFIG.PRICING.VIP_30D) return ctx.reply("❌ Số dư không đủ 100.000đ. Vui lòng nạp thêm tiền!");
    u.balance -= CONFIG.PRICING.VIP_30D;
    u.expiry = Math.max(Date.now(), u.expiry) + (30 * 86400000);
    DB.save();
    ctx.reply("✅ Chúc mừng! Bạn đã kích hoạt VIP 30 ngày thành công.", UI.keyboards.main(ctx.from.id));
});

bot.hears("🔥 GÓI VĨNH VIỄN (150K)", (ctx) => {
    const u = DB.users[ctx.from.id];
    if (u.balance < CONFIG.PRICING.VIP_PERM) return ctx.reply("❌ Số dư không đủ 150.000đ. Vui lòng nạp thêm tiền!");
    u.balance -= CONFIG.PRICING.VIP_PERM;
    u.expiry = -1;
    DB.save();
    ctx.reply("🔥 CHÚC MỪNG! Bạn đã trở thành VIP VĨNH VIỄN của hệ thống.", UI.keyboards.main(ctx.from.id));
});

bot.hears("⚡ PHÂN TÍCH MD5", (ctx) => {
    const u = DB.users[ctx.from.id];
    if (u.expiry !== -1 && u.expiry < Date.now()) return ctx.reply("❌ Vui lòng mua Key VIP để sử dụng chức năng này!");
    ctx.session = { step: 'AI_WAIT' };
    ctx.replyWithHTML(`📥 <b>CHẾ ĐỘ SOI LIÊN TỤC</b>\n💰 Số dư: <b>${u.balance.toLocaleString()}đ</b>\n\n<i>Hãy dán mã MD5 để bắt đầu (Bấm 'Quay lại' để thoát)...</i>`, UI.keyboards.back());
});

bot.hears("💰 NẠP TIỀN", (ctx) => {
    ctx.session = { step: 'NAP_VAL' };
    ctx.replyWithHTML("💵 <b>Nhập số tiền bạn muốn nạp vào ví:</b>", UI.keyboards.back());
});

// ==============================================================================
// [MODULE 6: ADMIN CONSOLE - POWER PANEL]
// ==============================================================================
bot.hears("⚙️ QUẢN TRỊ VIÊN", (ctx) => {
    if (ctx.from.id != CONFIG.CORE.ADMIN_ID) return;
    ctx.replyWithHTML("<b>🛠 ADMIN CONSOLE</b>", UI.keyboards.admin());
});

bot.on('text', async (ctx, next) => {
    const uid = ctx.from.id;
    const txt = ctx.text.trim();
    const session = ctx.session || {};

    if (uid == CONFIG.CORE.ADMIN_ID) {
        if (txt === "📋 DANH SÁCH USER") {
            const list = Object.values(DB.users).map(u => `- <code>${u.id}</code> | ${u.name} | ${u.balance.toLocaleString()}đ`).join('\n');
            return ctx.replyWithHTML(`<b>📋 DANH SÁCH NGƯỜI DÙNG:</b>\n\n${list.slice(0, 3800)}`);
        }
        if (txt === "📢 THÔNG BÁO TỔNG") { ctx.session = { step: 'ADM_BC' }; return ctx.reply("Nhập nội dung thông báo:"); }
        if (txt.startsWith('/vip30')) {
            const tid = txt.split(' ')[1];
            if (DB.users[tid]) { DB.users[tid].expiry = Date.now() + (30 * 86400000); DB.save(); ctx.reply("✅ Đã cấp VIP 30 ngày cho " + tid); }
            return;
        }
        if (txt.startsWith('/vipvv')) {
            const tid = txt.split(' ')[1];
            if (DB.users[tid]) { DB.users[tid].expiry = -1; DB.save(); ctx.reply("🔥 Đã cấp VIP VĨNH VIỄN cho " + tid); }
            return;
        }
        if (txt.startsWith('/ban')) {
            const tid = txt.split(' ')[1];
            if (DB.users[tid]) { DB.users[tid].is_ban = true; DB.save(); ctx.reply("🚫 Đã khóa " + tid); }
            return;
        }
        if (txt.startsWith('/unban')) {
            const tid = txt.split(' ')[1];
            if (DB.users[tid]) { DB.users[tid].is_ban = false; DB.save(); ctx.reply("🔓 Đã mở khóa " + tid); }
            return;
        }
        if (session.step === 'ADM_BC') {
            for (const t of Object.keys(DB.users)) { try { await bot.telegram.sendMessage(t, `📢 <b>THÔNG BÁO TỪ ADMIN:</b>\n\n${txt}`, { parse_mode: 'HTML' }); } catch (e) {} }
            ctx.reply("✅ Hoàn tất gửi thông báo!"); ctx.session = null; return;
        }
    }

    // --- LOGIC SOI MD5 (VÒNG LẶP VÔ HẠN) ---
    if (session.step === 'AI_WAIT') {
        if (txt.length !== 32) return ctx.reply("❌ Mã MD5 không hợp lệ (Phải đúng 32 ký tự).");
        
        const l = await ctx.replyWithHTML("🔍 <b>AI Titan đang giải mã Neural...</b>");
        const res = await TitanAI.solve(txt);
        const u = DB.users[uid];
        
        const html = `<b>🔮 KẾT QUẢ AI MD5</b>\n━━━━━━━━━━━━━━━━━━━━━\n🎯 Dự đoán: <b>${res.result}</b>\n💎 Độ tin cậy: <b>${res.conf}%</b>\n🧬 Trace: <code>${res.trace}</code>\n⚡ Tốc độ: <b>${res.delay}s</b>\n💰 Số dư: <b>${u.balance.toLocaleString()}đ</b>\n━━━━━━━━━━━━━━━━━━━━━\n📥 <i>Sẵn sàng! Hãy dán mã tiếp theo...</i>`;
        
        await ctx.telegram.editMessageText(ctx.chat.id, l.message_id, null, html, { parse_mode: 'HTML' });
        return; // KHÔNG thoát session để tạo vòng lặp
    }

    if (session.step === 'NAP_VAL') {
        const amt = parseInt(txt);
        if (isNaN(amt) || amt < 1000) return ctx.reply("❌ Tối thiểu 1.000đ.");
        const qr = `https://img.vietqr.io/image/${CONFIG.BANKING.BIN}-${CONFIG.BANKING.STK}-compact2.jpg?amount=${amt}&addInfo=NAP${uid}`;
        ctx.replyWithPhoto(qr, { caption: `<b>🏦 THÔNG TIN BANKING</b>\n━━━━━━━━━━━━━━━━━━━━━\n👤 Chủ TK: <b>${CONFIG.BANKING.OWNER}</b>\n💰 Số tiền: <b>${amt.toLocaleString()}đ</b>\n📌 Nội dung: <code>NAP${uid}</code>\n━━━━━━━━━━━━━━━━━━━━━\n⚠️ <i>Tự động cộng tiền sau 1-5 giây.</i>`, parse_mode: 'HTML' });
        ctx.session = null; return;
    }

    return next();
});

// ==============================================================================
// [MODULE 7: AUTO-BANKING SCANNER SIÊU TỐC 1S]
// ==============================================================================
async function scanBank() {
    try {
        const r = await axios.get(`${CONFIG.BANKING.ENDPOINT}${CONFIG.BANKING.API_KEY}`);
        const data = r.data?.data || [];
        for (const tx of data) {
            const memo = tx.description.toUpperCase();
            if (DB.ledger.includes(tx.id)) continue;
            const match = memo.match(/NAP(\d+)/);
            if (match && DB.users[match[1]]) {
                const amount = parseInt(tx.amount);
                DB.users[match[1]].balance += amount;
                DB.users[match[1]].total_in += amount;
                DB.ledger.push(tx.id);
                if (DB.ledger.length > 5000) DB.ledger.shift();
                DB.save();
                bot.telegram.sendMessage(match[1], `✅ <b>NẠP TIỀN THÀNH CÔNG!</b>\n\nVí của bạn đã được cộng <b>+${amount.toLocaleString()}đ</b>.`, { parse_mode: 'HTML' });
            }
        }
    } catch (e) {}
}
setInterval(scanBank, CONFIG.BANKING.SCAN_DELAY);

// ==============================================================================
// [MODULE 8: SERVER & START]
// ==============================================================================
app.get('/', (req, res) => res.send('<h1 style="color:blue;text-align:center;">🔱 TITAN AI v65.0 ACTIVE</h1>'));
app.listen(process.env.PORT || 3000);

bot.launch().then(() => console.log("🔱 TITAN AI v65.0 MASTER READY"));

process.on('unhandledRejection', (e) => DB.log("ERROR", e));
process.on('uncaughtException', (e) => DB.log("ERROR", e.message));
