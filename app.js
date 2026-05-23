/* Final Demand Letter SPA — Thunder Cloud */

const STORAGE_KEY = 'thunder_demand_letters_v1';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const COMPANIES = {
  cloud: {
    label: 'Thunder Cloud',
    name_th: 'บริษัท ธันเดอร์คลาวด์ จำกัด',
    name_en: 'THUNDER CLOUD CO., LTD.',
    juristic_id: '0105568121078',
    address: 'เลขที่ 23 ซ.พัฒนาการ 69 ประเวศ กทม. 10250',
    phone: '098-018-9384',
    email: 'legal@thundercloud.co.th',
    line: '@thundercloud',
    bank_name: 'บจก. ธันเดอร์คลาวด์',
    default_bank_account: '',
    default_ref_prefix: 'TC',
    logo: 'logo.png?v=9',
    stamp_th: 'THUNDER CLOUD',
    business_desc: 'เช่าโทรศัพท์มือถือ',
    contract_prefix: 'GW-XXXX',
    period_label: 'งวด',
    rate_row_label: 'ค่าเช่าตามสัญญา',
    overdue_row_label: 'ยอดค่าเช่าค้างชำระ',
    penalty_per_day: 50,
    penalty_row_label: 'ค่าชดเชย ข้อ 13 (50 บ./วัน)',
    show_total_periods: false,
    criminal_html: `ความผิดฐาน "ฉ้อโกง" <span class="law-tag">ป.อาญา ม. 341</span> โทษจำคุกสูงสุด 3 ปี<br>
                ความผิดฐาน "ยักยอกทรัพย์" <span class="law-tag">ป.อาญา ม. 352</span> โทษจำคุกสูงสุด 3 ปี และ/หรือปรับ`,
    policy_html: '',
  },
  fin: {
    label: 'Tunder Fin',
    name_th: 'บริษัท ทันเด้อ ฟิน จำกัด',
    name_en: 'TUNDER FIN CO., LTD.',
    juristic_id: '0105568109868',
    address: 'เลขที่ 23 ประเวศ เขตประเวศ กรุงเทพมหานคร 10250',
    phone: '080-078-0804',
    email: 'gr289514@gmail.com',
    line: '@tunderfin',
    bank_name: 'บจก.ทันเด้อ ฟิน',
    default_bank_account: '215-3-35333-9',
    default_ref_prefix: 'TF',
    logo: 'logo-fin.png?v=9',
    stamp_th: 'TUNDER FIN',
    business_desc: 'เช่าซื้อโทรศัพท์มือถือ',
    contract_prefix: 'TDL-XXXXXXX',
    period_label: 'งวด',
    rate_row_label: 'ค่างวดตามสัญญา',
    overdue_row_label: 'ยอดค่างวดค้างชำระ',
    penalty_per_day: 50,
    penalty_row_label: 'ค่าปรับเกินกำหนด (50 บ./วัน)',
    show_total_periods: true,
    criminal_html: `ความผิดฐาน "ยักยอกทรัพย์เช่าซื้อ" <span class="law-tag">ป.อาญา ม. 356</span> โทษจำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 6,000 บาท หรือทั้งจำทั้งปรับ`,
    policy_html: '',
  },
};

const DEFAULT_CUSTOMERS = [
  {
    id: 'sample',
    company: 'cloud',
    contract_type: '10day',
    ref_no: 'TC-LEGAL/2569/______',
    letter_date: '',
    customer_name: 'ตัวอย่าง · กดปุ่ม + เพิ่มลูกค้า เพื่อสร้างใหม่',
    id_card: '_-____-_____-__-_',
    address: '_________________________________',
    phone: '___-___-____',
    contract_no: 'GW-XXXX',
    contract_date: '__ _________ 2569',
    model: 'iPhone',
    spec: '___ GB / สี___',
    imei: '__________',
    total_price: '_____ บาท  (ระยะเวลาเช่า __ เดือน)',
    rate_unit: 'ราย 10 วัน',
    rate: '_____ บาท / รอบ 10 วัน',
    total_periods: '',
    overdue_periods: '',
    overdue_amount: '',
    compensation_days: '',
    total_due: '',
    discounted_amount: '',
    bank_account: '',
  },
];

let state = {
  customers: [],
  currentId: null,
};

// ==================== STORAGE ====================
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state.customers = JSON.parse(raw);
  } catch (e) {}
  if (!state.customers || state.customers.length === 0) {
    state.customers = DEFAULT_CUSTOMERS.map((c) => ({ ...c }));
    save();
  }
  if (!state.currentId && state.customers.length > 0) {
    state.currentId = state.customers[0].id;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customers));
}

function uid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                     'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
function todayThai() {
  const d = new Date();
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}
function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
function formatThaiDate(s) {
  if (!s) return '';
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s; // not ISO — return as-is (legacy text)
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const d = parseInt(m[3], 10);
  return `${d} ${THAI_MONTHS[mo]} ${y + 543}`;
}
function thaiBeYear() {
  return new Date().getFullYear() + 543;
}
function genRefNo(company) {
  const co = COMPANIES[company] || COMPANIES.cloud;
  const prefix = co.default_ref_prefix || 'TC';
  const count = state.customers.filter(x => (x.company || 'cloud') === company).length + 1;
  const num = String(count).padStart(3, '0');
  return `${prefix}-LEGAL/${thaiBeYear()}/${num}`;
}
function isDefaultRefNo(s) {
  return /^(TC|TF)-LEGAL\/\d+\//.test(s || '');
}

function getCurrent() {
  return state.customers.find((c) => c.id === state.currentId);
}

// ==================== CUSTOMER LIST ====================
function renderList() {
  const list = $('#customerList');
  if (state.customers.length === 0) {
    list.innerHTML = `
      <div class="list-head">
        <div class="lbl">ลูกค้า · 0 ราย</div>
        <button class="btn-add" onclick="addCustomer()">+ เพิ่มลูกค้า</button>
      </div>
      <div class="empty">
        ยังไม่มีลูกค้า<br>กด "+ เพิ่มลูกค้า" เพื่อเริ่มต้น
      </div>`;
    return;
  }

  list.innerHTML = `
    <div class="list-head">
      <div class="lbl">ลูกค้า · ${state.customers.length} ราย</div>
      <button class="btn-add" onclick="addCustomer()">+ เพิ่มลูกค้า</button>
    </div>
    ${state.customers
      .map(
        (c) => {
          const co = COMPANIES[c.company] || COMPANIES.cloud;
          return `
      <div class="cust-card ${c.id === state.currentId ? 'active' : ''}"
           onclick="selectCustomer('${c.id}')">
        <span class="badge">${c.contract_type === 'monthly' ? 'รายเดือน' : 'ราย 10 วัน'}</span>
        <span class="badge co-${escapeAttr(c.company || 'cloud')}">${escapeHtml(co.label)}</span>
        <div class="name">${escapeHtml(c.customer_name || '(ไม่ได้ระบุชื่อ)')}</div>
        <div class="meta">
          <b>${escapeHtml(c.contract_no || '—')}</b>
          <span>${escapeHtml(c.model || '—')}</span>
        </div>
        <button class="delete" onclick="event.stopPropagation(); deleteCustomer('${c.id}')">ลบ</button>
      </div>`;
        }
      )
      .join('')}
  `;
}

function selectCustomer(id) {
  state.currentId = id;
  renderAll();
}

function addCustomer() {
  const company = 'cloud';
  const c = {
    id: uid(),
    company,
    contract_type: '10day',
    ref_no: genRefNo(company),
    letter_date: todayISO(),
    customer_name: '',
    id_card: '',
    address: '',
    phone: '',
    contract_no: '',
    contract_date: '',
    model: 'iPhone ',
    spec: '',
    imei: '',
    total_price: '',
    rate_unit: 'ราย 10 วัน',
    rate: '',
    total_periods: '',
    overdue_periods: '',
    overdue_amount: '',
    compensation_days: '',
    total_due: '',
    discounted_amount: '',
    bank_account: '',
  };
  state.customers.push(c);
  state.currentId = c.id;
  save();
  renderAll();
  setTimeout(() => $('#fld_customer_name')?.focus(), 50);
}

function deleteCustomer(id) {
  if (!confirm('ลบลูกค้ารายนี้?')) return;
  state.customers = state.customers.filter((c) => c.id !== id);
  if (state.currentId === id) {
    state.currentId = state.customers[0]?.id || null;
  }
  save();
  renderAll();
}

function duplicateCustomer() {
  const cur = getCurrent();
  if (!cur) return;
  const copy = { ...cur, id: uid(), customer_name: cur.customer_name + ' (สำเนา)' };
  state.customers.push(copy);
  state.currentId = copy.id;
  save();
  renderAll();
}

// ==================== EDIT FORM ====================
function renderEditPanel() {
  const c = getCurrent();
  const panel = $('#editPanel');
  if (!c) {
    panel.classList.add('hidden');
    return;
  }
  panel.classList.remove('hidden');

  const v = (k) => escapeAttr(c[k] || '');

  const companyVal = c.company || 'cloud';
  panel.innerHTML = `
    <div class="edit-section">
      <h3>บริษัทผู้ออกหนังสือ</h3>
    </div>
    <div class="field wide-2">
      <label>บริษัท</label>
      <select data-fld="company">
        ${Object.entries(COMPANIES).map(([k, co]) =>
          `<option value="${k}" ${companyVal === k ? 'selected' : ''}>${escapeHtml(co.name_th)} (${escapeHtml(co.label)})</option>`
        ).join('')}
      </select>
    </div>

    <div class="edit-section">
      <h3>ประเภทสัญญา & เลขที่หนังสือ</h3>
    </div>
    <div class="field">
      <label>ประเภทสัญญา</label>
      <select data-fld="contract_type">
        <option value="10day" ${c.contract_type === '10day' ? 'selected' : ''}>ราย 10 วัน</option>
        <option value="monthly" ${c.contract_type === 'monthly' ? 'selected' : ''}>รายเดือน</option>
      </select>
    </div>
    <div class="field">
      <label>เลขที่หนังสือ</label>
      <input data-fld="ref_no" value="${v('ref_no')}">
    </div>
    <div class="field">
      <label>วันที่ออกหนังสือ <span class="hint">(แสดงเป็น พ.ศ. ในจดหมาย)</span></label>
      <input type="date" data-fld="letter_date" value="${v('letter_date')}">
    </div>

    <div class="edit-section">
      <h3>ข้อมูลลูกค้า</h3>
    </div>
    <div class="field wide-2">
      <label>ชื่อ–สกุล ลูกค้า</label>
      <input id="fld_customer_name" data-fld="customer_name" value="${v('customer_name')}" placeholder="เช่น อาภรณ์ จ่าทอง">
    </div>
    <div class="field">
      <label>เบอร์โทรศัพท์</label>
      <input data-fld="phone" value="${v('phone')}">
    </div>
    <div class="field">
      <label>เลขประจำตัวประชาชน</label>
      <input data-fld="id_card" value="${v('id_card')}">
    </div>
    <div class="field wide-2">
      <label>ที่อยู่ตามสัญญา</label>
      <textarea data-fld="address" rows="2">${escapeText(c.address)}</textarea>
    </div>

    <div class="edit-section">
      <h3>ข้อมูลสัญญา</h3>
    </div>
    <div class="field">
      <label>เลขที่สัญญา</label>
      <input data-fld="contract_no" value="${v('contract_no')}">
    </div>
    <div class="field wide-2">
      <label>วันที่ทำสัญญา</label>
      <input data-fld="contract_date" value="${v('contract_date')}" placeholder="เช่น 3 พฤษภาคม 2569">
    </div>

    <div class="edit-section">
      <h3>ทรัพย์สินตามสัญญา</h3>
    </div>
    <div class="field">
      <label>ยี่ห้อ / รุ่น</label>
      <input data-fld="model" value="${v('model')}">
    </div>
    <div class="field">
      <label>ความจุ / สี</label>
      <input data-fld="spec" value="${v('spec')}">
    </div>
    <div class="field">
      <label>Serial / IMEI</label>
      <input data-fld="imei" value="${v('imei')}">
    </div>
    <div class="field wide">
      <label>ราคารวม + ระยะเวลาเช่า</label>
      <input data-fld="total_price" value="${v('total_price')}" placeholder="เช่น 18,000 บาท (ระยะเวลาเช่า 12 เดือน)">
    </div>

    <div class="edit-section">
      <h3>ค่าเช่า / ค่างวด</h3>
    </div>
    <div class="field">
      <label>หน่วย</label>
      <input data-fld="rate_unit" value="${v('rate_unit')}" placeholder="ราย 10 วัน / รายเดือน">
    </div>
    <div class="field">
      <label>อัตรา</label>
      <input data-fld="rate" value="${v('rate')}" placeholder="เช่น 2,230 บาท / งวด">
    </div>
    <div class="field">
      <label>จำนวนงวดทั้งหมด <span class="hint">(เฉพาะ Fin)</span></label>
      <input data-fld="total_periods" value="${v('total_periods')}" placeholder="เช่น 10">
    </div>

    <div class="edit-section">
      <h3>ยอดค้างชำระ</h3>
      <span class="hint">เว้นว่างไว้ถ้าจะเขียนมือลงในหนังสือ</span>
    </div>
    <div class="field">
      <label>งวดที่ค้างชำระ</label>
      <input data-fld="overdue_periods" value="${v('overdue_periods')}" placeholder="เช่น 3">
    </div>
    <div class="field">
      <label>ยอดค่าเช่าค้าง (บาท)</label>
      <input data-fld="overdue_amount" value="${v('overdue_amount')}" placeholder="เช่น 5,400">
    </div>
    <div class="field">
      <label>จำนวนวัน × ${COMPANIES[companyVal].penalty_per_day} บ./วัน</label>
      <input data-fld="compensation_days" value="${v('compensation_days')}" placeholder="เช่น 12">
    </div>
    <div class="field wide">
      <label>ยอดรวมที่ต้องชำระทั้งสิ้น (บาท)</label>
      <input data-fld="total_due" value="${v('total_due')}" placeholder="เช่น 6,600">
    </div>
    <div class="field wide">
      <label>ยอดปรับลด (ถ้าชำระภายใน 7 วัน) (บาท)</label>
      <input data-fld="discounted_amount" value="${v('discounted_amount')}" placeholder="เช่น 5,000">
    </div>

    <div class="edit-section">
      <h3>ช่องทางชำระเงิน</h3>
    </div>
    <div class="field wide">
      <label>เลขบัญชี ธ.กสิกรไทย ${COMPANIES[companyVal].default_bank_account ? `<span class="hint">(เว้นว่าง = ใช้ ${COMPANIES[companyVal].default_bank_account})</span>` : ''}</label>
      <input data-fld="bank_account" value="${v('bank_account')}" placeholder="${COMPANIES[companyVal].default_bank_account || 'เช่น 123-4-56789-0'}">
    </div>
  `;

  panel.querySelectorAll('[data-fld]').forEach((el) => {
    el.addEventListener('input', () => updateField(el));
    el.addEventListener('change', () => updateField(el));
  });
}

function updateField(el) {
  const c = getCurrent();
  if (!c) return;
  c[el.dataset.fld] = el.value;
  if (el.dataset.fld === 'company' && isDefaultRefNo(c.ref_no)) {
    c.ref_no = genRefNo(c.company);
  }
  save();
  renderPreview();
  renderList();
  if (el.dataset.fld === 'company') renderEditPanel();
}

// ==================== PREVIEW ====================
function renderPreview() {
  const c = getCurrent();
  const preview = $('#previewArea');
  if (!c) {
    preview.innerHTML = `
      <div class="empty-main">
        <h2>ยังไม่มีลูกค้าที่เลือก</h2>
        <p>เลือกลูกค้าจากรายการด้านซ้าย หรือกด "+ เพิ่มลูกค้า"</p>
      </div>`;
    return;
  }

  const overdueAmt = c.overdue_amount
    ? formatBaht(c.overdue_amount)
    : '<span class="placeholder">__________</span>';
  const overduePer = c.overdue_periods
    ? `<b>${escapeHtml(c.overdue_periods)}</b>`
    : '<span class="placeholder">__________</span>';
  const compDays = c.compensation_days
    ? `<b>${escapeHtml(c.compensation_days)}</b>`
    : '<span class="placeholder">__</span>';
  const totalDue = c.total_due
    ? `${formatBaht(c.total_due)}`
    : '<span class="placeholder">_______________</span>';
  const discounted = c.discounted_amount
    ? `${formatBaht(c.discounted_amount)}`
    : '<span class="placeholder">_______________</span>';
  const co = COMPANIES[c.company] || COMPANIES.cloud;
  const bankAccValue = c.bank_account || co.default_bank_account || '';
  const bankAcc = bankAccValue
    ? `<span style="letter-spacing:1px">${escapeHtml(bankAccValue)}</span>`
    : '<span style="letter-spacing:1px">____-____-____</span>';
  const compTotal = c.compensation_days
    ? formatBaht(parseFloat(c.compensation_days) * co.penalty_per_day)
    : '<span class="placeholder">__________</span>';

  preview.innerHTML = `
    <div class="page" id="letterPage">
      <div class="banner">
        <div class="banner-row">
          <div>
            <div class="banner-title">หนังสือทวงถามหนี้ครั้งสุดท้าย</div>
            <div class="banner-sub">Final Demand Letter <b>·</b> ดำเนินคดีตามกฎหมายภายใน 7 วัน</div>
          </div>
          <div class="banner-meta">
            เลขที่ &nbsp; <b>${escapeHtml(c.ref_no || '—')}</b><br>
            วันที่ &nbsp; <b>${escapeHtml(formatThaiDate(c.letter_date) || '—')}</b>
          </div>
        </div>
      </div>
      <div class="banner-strip">
        <span>ฟ้องคดีแพ่ง</span>
        <span>คดีอาญา</span>
        <span>เครดิตบูโร</span>
        <span>ครอบครองทรัพย์</span>
        <span>นายจ้าง / ผู้ค้ำ</span>
      </div>

      <div class="content">
        <div class="company">
          <div class="logo"><img src="${escapeAttr(co.logo)}" alt="${escapeAttr(co.label)}"></div>
          <div class="name">
            <h2>${escapeHtml(co.name_th)}</h2>
            <div class="en">${escapeHtml(co.name_en)}  ·  เลขนิติบุคคล ${escapeHtml(co.juristic_id)}</div>
          </div>
          <div class="contact">
            <b>สำนักงานใหญ่</b> &nbsp;${escapeHtml(co.address)}<br>
            โทร. ${escapeHtml(co.phone)} &nbsp;|&nbsp; ${escapeHtml(co.email)}<br>
            Line Official: ${escapeHtml(co.line)}
          </div>
        </div>

        <div class="recipient">
          <div class="greet">เรียน คุณ <span class="nm">${escapeHtml(c.customer_name || '__________________')}</span></div>
          <div class="label-note">ลูกค้าผู้ทำสัญญา${escapeHtml(co.business_desc)}กับ${escapeHtml(co.name_th)}</div>
          <div class="lbl">เลขประจำตัวประชาชน</div>
          <div class="val">${escapeHtml(c.id_card || '—')}</div>
          <div class="lbl">ที่อยู่ตามสัญญา</div>
          <div class="val">${escapeHtml(c.address || '—')}</div>
          <div class="lbl">เบอร์โทรศัพท์</div>
          <div class="val">${escapeHtml(c.phone || '—')}</div>
        </div>

        <div class="subject">
          <div class="lbl">เรื่อง</div>
          <h3>หนังสือทวงถามหนี้ครั้งสุดท้าย และแจ้งดำเนินคดีอาญา-แพ่ง</h3>
        </div>

        <p class="intro">
          ตามที่ท่านได้ทำสัญญา${escapeHtml(co.business_desc)}กับ <b>${escapeHtml(co.name_th)}</b>
          เลขที่สัญญา <span class="pill">${escapeHtml(c.contract_no || co.contract_prefix)}</span>
          ลงวันที่ <b>${escapeHtml(c.contract_date || '__ ____ 2569')}</b>
          โดยบริษัทได้ส่งมอบทรัพย์สินตามสัญญาให้แก่ท่านเรียบร้อยแล้ว ดังรายละเอียดต่อไปนี้
        </p>

        <div class="section-title">รายละเอียดทรัพย์สินตามสัญญา</div>
        <table class="detail">
          <tr><td class="k">ยี่ห้อ / รุ่น</td><td class="v">${escapeHtml(c.model || '—')}</td></tr>
          <tr><td class="k">ความจุ / สี</td><td class="v">${escapeHtml(c.spec || '—')}</td></tr>
          <tr><td class="k">Serial Number / IMEI</td><td class="v">${escapeHtml(c.imei || '—')}</td></tr>
          <tr><td class="k">ราคารวมตามสัญญา</td><td class="v">${escapeHtml(c.total_price || '—')}</td></tr>
        </table>

        <div class="section-title">ยอดหนี้ที่ค้างชำระ</div>
        <table class="detail">
          <tr><td class="k">${escapeHtml(co.rate_row_label)} (${escapeHtml(c.rate_unit || '—')})</td><td class="v">${escapeHtml(c.rate || '—')}</td></tr>
          <tr><td class="k">งวดที่ค้างชำระ</td><td class="v">${overduePer} งวด</td></tr>
          <tr><td class="k">${escapeHtml(co.overdue_row_label)}</td><td class="v">${overdueAmt} บาท</td></tr>
          <tr><td class="k">${escapeHtml(co.penalty_row_label)}</td><td class="v">${co.penalty_per_day} × ${compDays} วัน  =  ${compTotal} บาท</td></tr>
        </table>

        <div class="total">
          <div class="total-row">
            <span class="total-label">ยอดค้างชำระทั้งหมด</span>
            <span class="eq">=</span>
            <span class="amount">${totalDue}<span class="baht">บาท</span></span>
          </div>
          <div class="promo">
            หากติดต่อเข้ามาภายใน <b>7 วัน</b> เพื่อชำระยอด
            ทางร้านยินดีปรับลดให้เหลือเพียง
            <span class="promo-amount">${discounted}<span class="baht">บาท</span></span>
          </div>
          <div class="note">* ไม่รวมดอกเบี้ย ค่าทนายความ และค่าใช้จ่ายในการดำเนินคดี</div>
        </div>

        ${co.policy_html || ''}

        <p class="bridge">
          บริษัทได้ติดตามทวงถามท่านหลายครั้งแล้ว แต่ท่านยังคงเพิกเฉย มิได้ติดต่อชำระหนี้
          หรือส่งคืนทรัพย์สิน บริษัทจึงมีหนังสือฉบับนี้ <b>ทวงถามครั้งสุดท้าย</b>
        </p>

        <div class="warning">
          <div class="icon">⚠️</div>
          <div class="text">
            <div class="h">แจ้งให้ทราบ</div>
            <div class="body">หากมิได้ชำระหนี้ภายใน <b>7 วัน</b> นับจากวันที่ได้รับหนังสือนี้</div>
            <div class="sub">บริษัทจะดำเนินการตามกฎหมายทันที โดยไม่ต้องบอกกล่าวอีก</div>
          </div>
        </div>

        <div class="actions-list">
          <div class="action">
            <div class="num">1</div>
            <div>
              <h4>ฟ้องคดีแพ่ง</h4>
              <p>เรียกร้องเงินต้น ค่าเช่าค้างชำระ ค่าชดเชย ดอกเบี้ย ค่าทนายความ และค่าธรรมเนียมศาล</p>
            </div>
          </div>
          <div class="action">
            <div class="num">2</div>
            <div>
              <h4>แจ้งความดำเนินคดีอาญา</h4>
              <p>
                ${co.criminal_html}
              </p>
            </div>
          </div>
          <div class="action">
            <div class="num">3</div>
            <div>
              <h4>ส่งข้อมูลเข้าระบบเครดิตบูโร (NCB)</h4>
              <p>ส่งผลต่อการขอสินเชื่อทุกประเภทในอนาคต ทั้งบ้าน รถ และบัตรเครดิต</p>
            </div>
          </div>
          <div class="action">
            <div class="num">4</div>
            <div>
              <h4>ติดตามทรัพย์สินคืนตามสัญญา</h4>
              <p>ใช้สิทธิตามสัญญา ข้อ 14 เข้าครอบครองทรัพย์สินคืน และใช้ระบบควบคุมระยะไกล (MDM) ล็อกการใช้งานเครื่อง</p>
            </div>
          </div>
          <div class="action">
            <div class="num">5</div>
            <div>
              <h4>ติดต่อนายจ้าง / ผู้ค้ำประกัน</h4>
              <p>ตามที่ระบุไว้ในสัญญา เพื่อขอความร่วมมือชำระหนี้</p>
            </div>
          </div>
        </div>

        <div class="payment">
          <h4>💳 ช่องทางชำระเงิน</h4>
          <ul>
            <li><b>ธนาคารกสิกรไทย</b> &nbsp; เลขบัญชี ${bankAcc} &nbsp; ชื่อบัญชี ${escapeHtml(co.bank_name)}</li>
            <li><b>Line Official:</b> ${escapeHtml(co.line)} &nbsp; • &nbsp; <b>โทรศัพท์:</b> ${escapeHtml(co.phone)}</li>
          </ul>
          <div class="note">กรุณาแจ้งหลักฐานการโอนพร้อมเลขที่สัญญาทาง Line Official</div>
        </div>

        <div class="signature">
          <div class="stamp">
            <span class="ring"></span>
            <img src="${escapeAttr(co.logo)}" alt="">
            <b>${escapeHtml(co.stamp_th)}</b>
            <span>CO., LTD.</span>
          </div>
          <div class="sign">
            <div class="nice">ขอแสดงความนับถือ</div>
            <div class="line">&nbsp;</div>
            <div>(ลงชื่อ) ________________________</div>
            <div class="role">ผู้จัดการฝ่ายกฎหมายและเร่งรัดหนี้สิน</div>
            <div class="role-en">Legal &amp; Collections Manager</div>
            <div class="corp">${escapeHtml(co.name_th)}</div>
          </div>
        </div>

        <div class="fnote">
          <b>หมายเหตุ</b>
          <ul>
            <li>หนังสือฉบับนี้จัดส่งทางไปรษณีย์ลงทะเบียนตอบรับ (ใบตอบรับเป็นหลักฐานการส่ง)</li>
            <li>สำเนาส่งผ่าน Line Official / Email ตามที่อยู่ที่ท่านแจ้งไว้</li>
            <li>หากเลยกำหนด 7 วัน บริษัทจะดำเนินการตามกฎหมายทันที โดยไม่ต้องบอกกล่าวอีก</li>
          </ul>
        </div>

        <div class="bottom-strip">
          <span>FINAL DEMAND</span>
          <span>กำหนด 7 วัน</span>
          <span>ดำเนินคดีตามกฎหมายทันทีเมื่อพ้นกำหนด</span>
        </div>
      </div>
    </div>
  `;
}

// ==================== TOOLBAR ====================
function renderToolbar() {
  const c = getCurrent();
  const tb = $('#toolbar');
  if (!c) {
    tb.style.display = 'none';
    return;
  }
  tb.style.display = 'flex';
  $('#breadcrumb').innerHTML = `
    Final Demand · <b>${escapeHtml(c.customer_name || 'ลูกค้าใหม่')}</b>
    &nbsp;<span style="color:#aaa">·</span>&nbsp; ${escapeHtml(c.contract_no || '—')}
  `;
}

function toggleEdit() {
  $('#editPanel').classList.toggle('hidden');
  const btn = $('#btnEdit');
  if (btn) {
    btn.textContent = $('#editPanel').classList.contains('hidden')
      ? '✏️ แก้ไข'
      : '✓ ปิดแก้ไข';
  }
}

function showPrintTip() {
  if (sessionStorage.getItem('thunder_print_tip_seen')) return;
  const tip = document.createElement('div');
  tip.className = 'print-tip';
  tip.innerHTML = `
    <button class="close" onclick="this.parentElement.remove()">×</button>
    <h4>💡 ก่อนพิมพ์</h4>
    <div>
      เพื่อให้จดหมายไม่ขาด แนะนำตั้งค่าใน Print dialog:<br>
      • <b>Margins</b> &rarr; <kbd>None</kbd> หรือ <kbd>Minimum</kbd><br>
      • <b>Destination</b> &rarr; <kbd>Save as PDF</kbd> ถ้าต้องการไฟล์<br>
      • <b>Background graphics</b> &rarr; เปิด (ถ้ามี)
    </div>
  `;
  document.body.appendChild(tip);
  sessionStorage.setItem('thunder_print_tip_seen', '1');
  setTimeout(() => tip.remove(), 8000);
}

function exportPDF() {
  $('#editPanel').classList.add('hidden');
  showPrintTip();
  setTimeout(() => window.print(), 250);
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(state.customers, null, 2)],
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thunder-customers-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'application/json';
  inp.onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const arr = JSON.parse(ev.target.result);
        if (!Array.isArray(arr)) throw new Error();
        if (confirm(`นำเข้า ${arr.length} ลูกค้า? (จะแทนที่ข้อมูลเดิม)`)) {
          state.customers = arr.map(c => ({ ...c, id: c.id || uid() }));
          state.currentId = state.customers[0]?.id || null;
          save();
          renderAll();
        }
      } catch (err) {
        alert('ไฟล์ไม่ถูกต้อง');
      }
    };
    reader.readAsText(f);
  };
  inp.click();
}

// ==================== UTIL ====================
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escapeAttr(s) {
  if (s == null) return '';
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escapeText(s) {
  if (s == null) return '';
  return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function formatBaht(n) {
  const num = parseFloat(String(n).replace(/,/g, ''));
  if (isNaN(num)) return escapeHtml(n);
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// ==================== INIT ====================
function renderAll() {
  renderList();
  renderToolbar();
  renderEditPanel();
  renderPreview();
}

window.addEventListener('DOMContentLoaded', () => {
  load();
  renderAll();

  $('#btnEdit')?.addEventListener('click', toggleEdit);
  $('#btnPrint')?.addEventListener('click', exportPDF);
  $('#btnDuplicate')?.addEventListener('click', duplicateCustomer);
  $('#btnExport')?.addEventListener('click', exportJSON);
  $('#btnImport')?.addEventListener('click', importJSON);

  // Keyboard: Cmd+P for print
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      e.preventDefault();
      exportPDF();
    }
  });
});

// expose globals (used by inline onclick)
window.selectCustomer = selectCustomer;
window.addCustomer = addCustomer;
window.deleteCustomer = deleteCustomer;
