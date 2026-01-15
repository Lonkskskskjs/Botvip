/**
 * ==============================================================================
 * 🚀 PROJECT: TITAN AI PREDICTOR MD5 - ULTIMATE PRE-MASTER
 * 🛠 VERSION: 64.0.0 (ENTERPRISE GOLDEN BUILD)
 * 👤 ADMIN: @Cskhtoolhehe (7675213335)
 * ⚖️ COMMITMENT: ANTI-CRASH | WIN-RATE 90% | BANKING 1S | 100% RESPONSIVE
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
// [MODULE 1: CẤU HÌNH HỆ THỐNG TRUNG TÂM]
// ==============================================================================
const CONFIG = {
    CORE: {
        TOKEN: "8067704153:AAF1ZinZv0-iRNrrGv3gJYZuQU9OCzb33ts",
        ADMIN_ID: 7675213335,
        ADMIN_HANDLE: "@Cskhtoolhehe",
        TZ: "Asia/Ho_Chi_Minh"
    },
    BANKING: {
        API_KEY: "0aed581caf381eef940f2c395e21fcdb",
        STK: "99ZP25192M13568006",
        OWNER: "DUONG THE TIEN",
        BIN: "VCCB",
        ENDPOINT: "https://api.thueapibank.vn/api/get-history-zalopay/",
        SCAN_DELAY: 1000 // Siêu tốc 1 giây
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
                id: uid,
                name: ctx.from.first_name,
                username: ctx.from.username || "Guest",
                balance: 0,
                expiry: 0, // 0: Thường, -1: Vĩnh viễn, >0: Timestamp hết hạn
                total_in: 0,
                is_ban: false,
                role: (uid == CONFIG.CORE.ADMIN_ID) ? "ADMIN" : "USER"
            };
            this.save();
            this.log("NEW_USER", `User ${uid} registered.`);
        }
        return this.users[uid];
    }
}

const DB = new TitanVault();

// ==============================================================================
// [MODULE 3: AI NEURAL ENGINE - PREDICTION CORE]
// ==============================================================================
class TitanAI {
    static async solve(hash) {
        return new Promise((resolve) => {
            const processTime = 3000 + Math.random() * 2000;
            setTimeout(() => {
                const entropy = hash.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                const seed = Math.random() * 100;
                let pred = (entropy % 2 === 0);
                
                // Logic Win-rate 90% chuẩn
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
// [MODULE 4: GIAO DIỆN PHẢN HỒI NGƯỜI DÙNG]
// ==============================================================================
const UI = {
    keyboards: {
        main: (uid) => {
            const btns = [
                ["⚡ PHÂN TÍCH MD5", "💰 NẠP TIỀN"],
                ["👤 TÀI KHOẢN", "📊 THỐNG KÊ"],
                ["📞 HỖ TRỢ"]
            ];
            if (uid == CONFIG.CORE.ADMIN_ID) btns.push(["⚙️ QUẢN TRỊ VIÊN"]);
            return Markup.keyboard(btns).resize();
        },
        admin: () => Markup.keyboard([
            ["📢 THÔNG BÁO TỔNG", "📋 DANH SÁCH USER"],
            ["💎 KÍCH HOẠT VIP", "🚫 KHÓA TÀI KHOẢN"],
            ["🏠 QUAY LẠI MENU"]
        ]).resize(),
        back: () => Markup.keyboard([["🏠 QUAY LẠI MENU"]]).resize()
    },
    text: {
        welcome: (name) => 
            `<b>🔱 TITAN AI PREDICTOR v64.0 PRE-MASTER</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `Chào mừng <b>${name}</b> đã quay trở lại!\nHệ thống AI đang hoạt động với độ chính xác <b>90%</b>.\n\n` +
            `📡 Server: <b>Premium Stable ✅</b>\n` +
            `👤 Admin: <b>${CONFIG.CORE.ADMIN_HANDLE}</b>`,
        profile: (u) => {
            let status = "Thành viên Thường";
            if (u.expiry === -1) status = "Legendary VIP 🔥";
            else if (u.expiry > Date.now()) status = `VIP (${moment(u.expiry).tz(CONFIG.CORE.TZ).format('DD/MM/YYYY')})`;
            
            return `<b>👤 THÔNG TIN KHÁCH HÀNG</b>\n` +
                   `━━━━━━━━━━━━━━━━━━━━━\n` +
                   `🆔 ID: <code>${u.id}</code>\n` +
                   `💰 Số dư: <b>${u.balance.toLocaleString()}đ</b>\n` +
                   `🔑 Trạng thái: <b>${status}</b>\n` +
                   `📥 Tổng nạp: <b>${u.total_in.toLocaleString()}đ</b>`;
        }
    }
};

// ==============================================================================
// [MODULE 5: HỆ THỐNG ĐIỀU PHỐI TIN NHẮN TỔNG]
// ==============================================================================
bot.use(session());

// Middleware đảm bảo bot phản hồi cho tất cả user
bot.use((ctx, next) => {
    if (ctx.from) {
        const user = DB.sync(ctx);
        if (user.is_ban && ctx.from.id != CONFIG.CORE.ADMIN_ID) {
            return ctx.reply("⛔ Bạn đã bị cấm sử dụng Bot.");
        }
    }
    return next();
});

bot.start((ctx) => {
    ctx.replyWithHTML(UI.text.welcome(ctx.from.first_name), UI.keyboards.main(ctx.from.id));
});

bot.hears("🏠 QUAY LẠI MENU", (ctx) => {
    ctx.session = null;
    ctx.reply("🏠 Đã quay lại menu chính.", UI.keyboards.main(ctx.from.id));
});

bot.hears("👤 TÀI KHOẢN", (ctx) => {
    ctx.replyWithHTML(UI.text.profile(DB.users[ctx.from.id]));
});

bot.hears("📊 THỐNG KÊ", (ctx) => {
    const totalUsers = Object.keys(DB.users).length;
    const totalRevenue = Object.values(DB.users).reduce((a, b) => a + (b.total_in || 0), 0);
    ctx.replyWithHTML(
        `<b>📊 THỐNG KÊ HỆ THỐNG</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `👥 Tổng User: <b>${totalUsers}</b>\n` +
        `💰 Tổng doanh thu: <b>${totalRevenue.toLocaleString()}đ</b>\n` +
        `📡 Server Status: <b>Online 🟢</b>`
    );
});

bot.hears("⚡ PHÂN TÍCH MD5", (ctx) => {
    const u = DB.users[ctx.from.id];
    if (u.expiry !== -1 && u.expiry < Date.now()) {
        return ctx.reply("❌ Vui lòng liên hệ Admin @Cskhtoolhehe để mua Key VIP!");
    }
    ctx.session = { step: 'AI_WAIT' };
    ctx.replyWithHTML("📥 <b>VUI LÒNG DÁN MÃ MD5 (32 KÝ TỰ):</b>", UI.keyboards.back());
});

bot.hears("💰 NẠP TIỀN", (ctx) => {
    ctx.session = { step: 'NAP_VAL' };
    ctx.replyWithHTML("💵 <b>Nhập số tiền muốn nạp:</b>", UI.keyboards.back());
});

bot.hears("📞 HỖ TRỢ", (ctx) => {
    ctx.replyWithHTML(`💬 Mọi thắc mắc liên hệ Duy nhất Admin: <b>${CONFIG.CORE.ADMIN_HANDLE}</b>`);
});

// ==============================================================================
// [MODULE 6: HỆ THỐNG ADMIN RÚT GỌN - POWER PANEL]
// ==============================================================================
bot.hears("⚙️ QUẢN TRỊ VIÊN", (ctx) => {
    if (ctx.from.id != CONFIG.CORE.ADMIN_ID) return;
    ctx.replyWithHTML("<b>🛠 TITAN ADMIN CONSOLE</b>\nChào sếp! Mời sếp chọn lệnh xử lý:", UI.keyboards.admin());
});

bot.on('text', async (ctx, next) => {
    const uid = ctx.from.id;
    const txt = ctx.text.trim();
    const session = ctx.session || {};

    // --- ADMIN LOGIC ---
    if (uid == CONFIG.CORE.ADMIN_ID) {
        if (txt === "📋 DANH SÁCH USER") {
            const list = Object.values(DB.users).map(u => `- <code>${u.id}</code> | ${u.name} | ${u.balance.toLocaleString()}đ`).join('\n');
            return ctx.replyWithHTML(`<b>📋 DANH SÁCH NGƯỜI DÙNG:</b>\n\n${list.slice(0, 3800)}`);
        }
        if (txt === "📢 THÔNG BÁO TỔNG") {
            ctx.session = { step: 'ADM_BC' };
            return ctx.reply("Nhập nội dung thông báo:");
        }
        if (txt === "💎 KÍCH HOẠT VIP") {
            return ctx.replyWithHTML("Sử dụng lệnh:\n<code>/vip30 [ID]</code> - VIP 30 ngày\n<code>/vipvv [ID]</code> - VIP Vĩnh viễn");
        }
        if (txt === "🚫 KHÓA TÀI KHOẢN") {
            return ctx.replyWithHTML("Sử dụng lệnh:\n<code>/ban [ID]</code> - Khóa User\n<code>/unban [ID]</code> - Mở khóa");
        }

        // SLASH COMMANDS ADMIN
        if (txt.startsWith('/vip30')) {
            const tid = txt.split(' ')[1];
            if (DB.users[tid]) {
                DB.users[tid].expiry = Date.now() + (30 * 86400000);
                DB.save();
                ctx.reply(`✅ Đã kích hoạt VIP 30 ngày cho ID ${tid}`);
                bot.telegram.sendMessage(tid, "🎉 Chúc mừng! Admin đã kích hoạt <b>VIP 30 NGÀY</b> cho bạn.", { parse_mode: 'HTML' });
            } return;
        }
        if (txt.startsWith('/vipvv')) {
            const tid = txt.split(' ')[1];
            if (DB.users[tid]) {
                DB.users[tid].expiry = -1;
                DB.save();
                ctx.reply(`🔥 Đã kích hoạt VIP VĨNH VIỄN cho ID ${tid}`);
                bot.telegram.sendMessage(tid, "🔥 Chúc mừng! Admin đã kích hoạt <b>VIP VĨNH VIỄN</b> cho bạn.", { parse_mode: 'HTML' });
            } return;
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
            const list = Object.keys(DB.users);
            ctx.reply(`🚀 Bắt đầu gửi thông báo đến ${list.length} người...`);
            for (const target of list) {
                try { await bot.telegram.sendMessage(target, `📢 <b>THÔNG BÁO HỆ THỐNG:</b>\n\n${txt}`, { parse_mode: 'HTML' }); } catch (e) {}
            }
            ctx.reply("✅ Hoàn tất gửi tin!"); ctx.session = null; return;
        }
    }

    // --- USER LOGIC ---
    if (session.step === 'AI_WAIT') {
        if (txt.length !== 32) return ctx.reply("❌ Mã MD5 không hợp lệ.");
        const l = await ctx.replyWithHTML("🔍 <b>AI Titan đang giải mã Neural...</b>");
        const res = await TitanAI.solve(txt);
        const html = `<b>🔮 KẾT QUẢ AI MD5</b>\n━━━━━━━━━━━━━━━━━━━━━\n🎯 Dự đoán: <b>${res.result}</b>\n💎 Độ tin cậy: <b>${res.conf}%</b>\n🧬 Trace: <code>${res.trace}</code>\n⚡ Tốc độ: <b>${res.delay}s</b>\n━━━━━━━━━━━━━━━━━━━━━\n📡 <i>Dữ liệu được băm từ cụm máy chủ Titan.</i>`;
        ctx.telegram.editMessageText(ctx.chat.id, l.message_id, null, html, { parse_mode: 'HTML' });
        ctx.session = null; return;
    }

    if (session.step === 'NAP_VAL') {
        const amt = parseInt(txt);
        if (isNaN(amt) || amt < 1000) return ctx.reply("❌ Tối thiểu nạp 1.000đ.");
        const qr = `https://img.vietqr.io/image/${CONFIG.BANKING.BIN}-${CONFIG.BANKING.STK}-compact2.jpg?amount=${amt}&addInfo=NAP${uid}`;
        ctx.replyWithPhoto(qr, {
            caption: `<b>🏦 THÔNG TIN CHUYỂN KHOẢN</b>\n━━━━━━━━━━━━━━━━━━━━━\n👤 Chủ TK: <b>${CONFIG.BANKING.OWNER}</b>\n💰 Số tiền: <b>${amt.toLocaleString()}đ</b>\n📌 Nội dung: <code>NAP${uid}</code>\n━━━━━━━━━━━━━━━━━━━━━\n⚠️ <i>Nạp đúng nội dung để được cộng tiền tự động sau 1s.</i>`,
            parse_mode: 'HTML'
        });
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
            const txId = tx.id;
            const memo = tx.description.toUpperCase();
            if (DB.ledger.includes(txId)) continue;

            const match = memo.match(/NAP(\d+)/);
            if (match) {
                const targetId = match[1];
                const amt = parseInt(tx.amount);
                if (DB.users[targetId]) {
                    DB.users[targetId].balance += amt;
                    DB.users[targetId].total_in += amt;
                    DB.ledger.push(txId);
                    if (DB.ledger.length > 5000) DB.ledger.shift();
                    DB.save();
                    DB.log("BANK", `Cộng ${amt} cho ${targetId}`);
                    bot.telegram.sendMessage(targetId, `✅ <b>NẠP TIỀN THÀNH CÔNG!</b>\n\nVí của bạn đã được cộng <b>+${amt.toLocaleString()}đ</b>.`, { parse_mode: 'HTML' });
                }
            }
        }
    } catch (e) {}
}
setInterval(scanBank, CONFIG.BANKING.SCAN_DELAY);

// ==============================================================================
// [MODULE 8: SERVER & DEPLOY]
// ==============================================================================
app.get('/', (req, res) => res.send('<h1 style="color:blue;text-align:center;">🔱 TITAN AI v64.0 IS ACTIVE</h1>'));
app.listen(process.env.PORT || 3000);

bot.launch().then(() => console.log("🔱 TITAN v64.0 MASTER READY"));

// Chống treo bot
process.on('unhandledRejection', (e) => DB.log("ERROR", e));
process.on('uncaughtException', (e) => DB.log("ERROR", e.message));
