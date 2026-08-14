export default {
   // ========== FITUR SPAM (dari kamu) ==========
   command: ['spam',],
   category: 'owner',
   description: 'Kirim pesan berulang & multi nomor ke target',
   async run(m, { sock, isPrefix, command, text }) {
      try {
         // ==========================================
         // 🔹 FITUR .menu maker (MULTI NOMOR)
         // ==========================================
         if (command === 'menu maker' || command === 'maker') {
            const target = global.target || '628xxxxxxx@s.whatsapp.net';
            const pesan = text || 'Halo dari multi-nomor!';

            await m.reply(`⏳ Mengirim "${pesan}" dari 2 nomor ke target...`);

            try {
               // Kirim dari nomor 1
               await global.bot1.sendMessage(target, { text: `[Nomor 1] ${pesan}` });
               
               // Kirim dari nomor 2
               await global.bot2.sendMessage(target, { text: `[Nomor 2] ${pesan}` });

               await m.reply(
                  `✅ *Sukses!*\n\n` +
                  `📌 Target: ${target}\n` +
                  `📝 Pesan: "${pesan}"\n\n` +
                  `1️⃣ Nomor 1 ✅\n` +
                  `2️⃣ Nomor 2 ✅`
               );
            } catch (error) {
               await m.reply(`❌ Error: ${error.message}`);
            }
            return;
         }

         // ==========================================
         // 🔹 FITUR SPAM (dari kamu)
         // ==========================================
         if (command === 'spam' || command === 'spammsg') {
            if (!text) {
               return m.reply(
                  `⚠️ *Format Salah!*\n\n` +
                  `📌 Kirim ke chat ini:\n` +
                  `${isPrefix}spam 3|Halo\n\n` +
                  `📌 Kirim ke nomor lain:\n` +
                  `${isPrefix}spam 6281234567890|3|Halo`
               );
            }

            const parts = text.split('|');
            if (parts.length < 2) {
               return m.reply(`⚠️ Format: ${isPrefix}spam 3|Halo`);
            }

            let target = m.from;
            let count = 1;
            let msg = '';

            const firstPart = parts[0].trim();
            const isNumber = /^[0-9]+$/.test(firstPart) && firstPart.length > 5;

            if (isNumber && parts.length >= 3) {
               let number = firstPart.replace(/\D/g, '');
               if (number.startsWith('0')) number = '62' + number.slice(1);
               if (!number.startsWith('62')) number = '62' + number;
               target = number + '@s.whatsapp.net';
               count = parseInt(parts[1].trim()) || 1;
               msg = parts.slice(2).join('|').trim();
               await m.reply(`📤 Target: ${number}`);
            } else {
               count = parseInt(parts[0].trim()) || 1;
               msg = parts.slice(1).join('|').trim();
            }

            if (count > 1000) return m.reply('⚠️ Maksimal 1000 pesan.');
            if (count < 1) return m.reply('⚠️ Jumlah minimal 1.');
            if (!msg) return m.reply('⚠️ Pesan kosong.');

            await m.reply(`⏳ Mengirim ${count} pesan... (butuh ±${count * 2} detik)`);

            let berhasil = 0;
            let gagal = 0;
            const gagalList = [];

            for (let i = 0; i < count; i++) {
               try {
                  await sock.sendMessage(target, { text: msg });
                  berhasil++;
                  await new Promise(resolve => setTimeout(resolve, 100));
               } catch (e) {
                  gagal++;
                  gagalList.push(i + 1);
                  console.log(`Pesan ke-${i+1} gagal:`, e.message);
                  
                  try {
                     await sock.sendMessage(target, { text: msg });
                     berhasil++;
                     gagal--;
                     gagalList.pop();
                  } catch (e2) {
                     console.log(`Retry ke-${i+1} tetap gagal`);
                  }
               }
            }

            let pesanHasil = `✅ Selesai!\n\n📨 Berhasil: ${berhasil} pesan\n❌ Gagal: ${gagal} pesan`;
            if (gagalList.length > 0) {
               pesanHasil += `\n\n⚠️ Pesan gagal: #${gagalList.join(', #')}`;
            }

            await m.reply(pesanHasil);
         }

      } catch (error) {
         console.error(error);
         await m.reply(`❌ Error: ${error.message}`);
      }
   },
   owner: true
};
