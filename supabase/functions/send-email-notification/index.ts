/**
 * Supabase Edge Function — 收到新表单提交时通过 Resend 发送邮件通知。
 *
 * 部署:
 *   supabase functions deploy send-email-notification --no-verify-jwt
 *
 * 环境变量 (Supabase Dashboard → Edge Functions → 选中该函数 → Settings):
 *   RESEND_API_KEY   — Resend API Key
 *   NOTIFY_EMAIL     — 接收通知的邮箱 (默认 chenxu985ca@gmail.com)
 */

import { Resend } from 'npm:resend@4';

const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL') || 'chenxu985ca@gmail.com';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

Deno.serve(async (req) => {
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

  // 降级模式：未配置 API Key 时仅打印日志
  if (!RESEND_API_KEY) {
    console.log('⚠️  RESEND_API_KEY 未配置，仅打印日志');
    console.log(`📬 ${name} | ${company || '个人'} | ${phone}`);
    return new Response(JSON.stringify({ success: true, logged: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: '西湖巴尔官网 <onboarding@resend.dev>',
    to: NOTIFY_EMAIL,
    subject: `【官网咨询】${name} — ${company || '个人'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1A1D20; border-bottom: 2px solid #0052CC; padding-bottom: 12px;">📬 新的商务咨询</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 12px; color: #6B737D; width: 60px;">姓名</td>
            <td style="padding: 10px 12px; color: #1A1D20; font-weight: 600;">${name}</td>
          </tr>
          <tr style="background: #F5F5F5;">
            <td style="padding: 10px 12px; color: #6B737D;">单位</td>
            <td style="padding: 10px 12px; color: #1A1D20; font-weight: 600;">${company || '未填写'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #6B737D;">电话</td>
            <td style="padding: 10px 12px; color: #1A1D20; font-weight: 600;"><a href="tel:${phone}" style="color: #0052CC;">${phone}</a></td>
          </tr>
          <tr style="background: #F5F5F5;">
            <td style="padding: 10px 12px; color: #6B737D; vertical-align: top;">需求</td>
            <td style="padding: 10px 12px; color: #1A1D20;">${message}</td>
          </tr>
        </table>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px; text-align: center;">
          来自 西湖巴尔官网 (xihubiomaterial.vercel.app)
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('邮件发送失败:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('✅ 邮件已发送:', data?.id);
  return new Response(JSON.stringify({ success: true, emailId: data?.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
