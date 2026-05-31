/**
 * Supabase Edge Function — 收到新表单提交时发送邮件通知。
 *
 * 部署:
 *   supabase functions deploy send-email-notification --no-verify-jwt
 *
 * 环境变量 (在 Supabase Dashboard → Functions 中设置):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL
 *
 * 如果你用 Resend，也可以用它的 SDK 替代 SMTP。
 */

// 用 Resend SDK 发送（推荐，免费额度每月 100 封）
// npm install resend (在 function 目录下)
// import { Resend } from 'npm:resend';

// 用 SMTP 发送（通用方案）
// import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL') || 'info@xihubiom.com';

Deno.serve(async (req) => {
  // 仅接受 POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const record = body.record || body;
  const { name, company, phone, message } = record;

  // ====== 方案 A: 使用 Resend（推荐） ======
  //
  // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  // const { error } = await resend.emails.send({
  //   from: '西湖巴尔官网 <noreply@xihubiom.com>',
  //   to: NOTIFY_EMAIL,
  //   subject: `【官网咨询】${name} - ${company || '个人'}`,
  //   replyTo: phone + '@phone.placeholder', // 没有邮箱时用其他方式
  //   html: `
  //     <h2>新的商务咨询</h2>
  //     <table>
  //       <tr><td><strong>姓名:</strong></td><td>${name}</td></tr>
  //       <tr><td><strong>单位:</strong></td><td>${company || '未填写'}</td></tr>
  //       <tr><td><strong>电话:</strong></td><td>${phone}</td></tr>
  //       <tr><td><strong>需求:</strong></td><td>${message}</td></tr>
  //     </table>
  //   `,
  // });
  //
  // if (error) {
  //   console.error('邮件发送失败:', error);
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
  //
  // return new Response(JSON.stringify({ success: true }));

  // ====== 方案 B: 仅打印（调试用，后续替换为 Resend/SMTP） ======
  console.log('='.repeat(50));
  console.log('📬 新的商务咨询');
  console.log('='.repeat(50));
  console.log(`姓名: ${name}`);
  console.log(`单位: ${company || '未填写'}`);
  console.log(`电话: ${phone}`);
  console.log(`需求: ${message}`);
  console.log(`通知邮箱: ${NOTIFY_EMAIL}`);
  console.log('='.repeat(50));

  return new Response(JSON.stringify({ success: true, logged: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
