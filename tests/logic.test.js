import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeSiteSettings, defaultSettings } from '../src/data/mergeSiteSettings.js';
import { validateContactForm, saveContactForm } from '../src/lib/contactForm.js';

const validForm = { name: ' 张医生 ', company: ' 诊所 ', phone: ' 13800138000 ', message: ' 希望咨询产品报价 ', interest: '' };

test('partial settings do not require a siteConfig row', () => {
  const result = mergeSiteSettings({ aboutContent: { heading: '新标题' } });
  assert.equal(result.aboutContent.heading, '新标题');
  assert.equal(result.siteConfig.companyName, defaultSettings.siteConfig.companyName);
});

test('partial nested form labels retain other defaults', () => {
  const result = mergeSiteSettings({ contactContent: { formFields: { name: { label: '称呼' } } } });
  assert.equal(result.contactContent.formFields.name.label, '称呼');
  assert.equal(result.contactContent.formFields.name.placeholder, defaultSettings.contactContent.formFields.name.placeholder);
  assert.deepEqual(result.contactContent.formFields.phone, defaultSettings.contactContent.formFields.phone);
  assert.notEqual(defaultSettings.contactContent.formFields.name.label, '称呼');
});

test('empty arrays are intentional; null sections use defaults', () => {
  const result = mergeSiteSettings({ siteConfig: null, aboutContent: { history: [] } });
  assert.deepEqual(result.aboutContent.history, []);
  assert.deepEqual(result.siteConfig, defaultSettings.siteConfig);
});

test('contact validation accepts trimmed mobile and landline numbers', () => {
  assert.deepEqual(validateContactForm(validForm), {});
  assert.deepEqual(validateContactForm({ ...validForm, phone: '0571-88096997' }), {});
  for (const phone of ['abc13800138000', '13800138000abc', '123']) {
    assert.ok(validateContactForm({ ...validForm, phone }).phone);
  }
  assert.ok(validateContactForm({ ...validForm, name: ' ', message: '短' }).name);
  assert.ok(validateContactForm({ ...validForm, message: '短' }).message);
});

test('missing database does not report successful submission', async () => {
  assert.equal((await saveContactForm(validForm, null)).success, false);
});

test('database receives trimmed fields and optional fields as null', async () => {
  let inserted;
  const client = { from(table) {
    assert.equal(table, 'contact_submissions');
    return { async insert(row) { inserted = row; return { error: null }; } };
  } };
  assert.equal((await saveContactForm(validForm, client)).success, true);
  assert.deepEqual(inserted, { name: '张医生', company: '诊所', phone: '13800138000', interest: null, message: '希望咨询产品报价' });
});

test('database errors and thrown network errors do not report success', async () => {
  for (const insert of [async () => ({ error: new Error('RLS') }), async () => { throw new Error('offline'); }]) {
    const result = await saveContactForm(validForm, { from: () => ({ insert }) });
    assert.equal(result.success, false);
    assert.ok(result.error);
  }
});

test('invalid contact data never reaches the database', async () => {
  const client = { from() { assert.fail('should not write invalid form'); } };
  assert.equal((await saveContactForm({ ...validForm, phone: 'invalid' }, client)).success, false);
});
