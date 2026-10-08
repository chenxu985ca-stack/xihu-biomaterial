export function validateContactForm(form) {
  const errors = {};
  if (!form.name || form.name.trim().length < 2) errors.name = '请输入您的姓名';
  if (!form.phone || !/^(?:1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/.test(form.phone.trim())) errors.phone = '请输入有效的电话号码';
  if (!form.message || form.message.trim().length < 5) errors.message = '请简要描述您的需求（至少5个字）';
  return errors;
}

export async function saveContactForm(data, client) {
  if (Object.keys(validateContactForm(data)).length) {
    return { success: false, error: '请检查姓名、电话和需求描述。' };
  }
  if (!client) {
    return { success: false, error: '在线咨询暂不可用，请直接致电联系我们。' };
  }
  try {
    const { error } = await client.from('contact_submissions').insert({
      name: data.name.trim(),
      company: data.company?.trim() || null,
      phone: data.phone.trim(),
      interest: data.interest?.trim() || null,
      message: data.message.trim(),
    });
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: '提交失败，请稍后重试或直接致电联系我们。' };
  }
}
