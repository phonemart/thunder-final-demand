# Thunder Cloud · Final Demand Letter

ระบบสร้างหนังสือทวงถามหนี้ครั้งสุดท้าย สำหรับบริษัท ธันเดอร์คลาวด์ จำกัด

🔗 **Live:** https://phonemart.github.io/thunder-final-demand/

---

## ฟีเจอร์
- จัดการลูกค้าหลายรายในที่เดียว (sidebar ซ้าย)
- ฟอร์มแก้ไขข้อมูลแบบ live preview
- ส่งออกเป็น PDF (ผ่าน browser print → Save as PDF)
- บันทึกอัตโนมัติใน `localStorage` ของเบราว์เซอร์
- สำรอง / นำเข้าข้อมูลเป็น JSON
- กรอบแดง "ยอดค้างชำระ + ข้อเสนอปรับลดถ้าชำระใน 7 วัน"

---

## การใช้งาน
1. เปิดเว็บ
2. กด **+ เพิ่มลูกค้า** → กรอกข้อมูล (ฟอร์มอยู่กลางหน้า)
3. ดู preview สด ๆ ทางขวา
4. กด **🖨️ พิมพ์ / PDF** → ใน Print dialog เลือก **Margins: None** → **Save as PDF**

> 💡 **Tip:** ปุ่ม "✓ ปิดแก้ไข" จะซ่อนฟอร์ม เห็นแต่ตัวจดหมาย เหมาะตอนตรวจก่อนพิมพ์

---

## โครงสร้างไฟล์

```
html/
├── index.html          ← shell ของ SPA + ปุ่ม toolbar
├── app.js              ← logic ทั้งหมด (state, render, save/load, print)
├── styles.css          ← CSS ทั้งหมด (sidebar / preview / print rules)
├── logo.png            ← โลโก้ Thunder Cloud
└── README.md
```

### สถาปัตยกรรม
- **Pure HTML/CSS/JS** — ไม่มี backend, ไม่มี build step
- ข้อมูลเก็บใน `localStorage` key: `thunder_demand_letters_v1`
- State global ใน `app.js`:
  ```js
  state = { customers: [...], currentId: '...' }
  ```

---

## รายการ Field ในฟอร์ม (data model)

| Key | คำอธิบาย |
|---|---|
| `contract_type` | `10day` / `monthly` |
| `ref_no` | เลขที่หนังสือ (เช่น `TC-LEGAL/2569/001`) |
| `letter_date` | วันที่ออกหนังสือ |
| `customer_name` | ชื่อ–สกุล ลูกค้า |
| `id_card` | เลขบัตรประชาชน |
| `address` | ที่อยู่ตามสัญญา |
| `phone` | เบอร์โทร |
| `contract_no` | เลขที่สัญญา |
| `contract_date` | วันที่ทำสัญญา |
| `model` | ยี่ห้อ / รุ่น |
| `spec` | ความจุ / สี |
| `imei` | Serial / IMEI |
| `total_price` | ราคารวมตามสัญญา + ระยะเวลาเช่า |
| `rate_unit` | หน่วยค่าเช่า (ราย 10 วัน / รายเดือน) |
| `rate` | อัตราค่าเช่า |
| `overdue_periods` | งวดที่ค้างชำระ |
| `overdue_amount` | ยอดค่าเช่าค้างชำระ (บาท) |
| `compensation_days` | จำนวนวันค่าชดเชย (ข้อ 13, 100 บ./วัน) |
| `total_due` | **ยอดรวมที่ต้องชำระทั้งสิ้น** |
| `discounted_amount` | **ยอดปรับลดถ้าชำระใน 7 วัน** |
| `bank_account` | เลขบัญชี ธ.กสิกรไทย |

---

## วิธีแก้ไข / เพิ่มฟีเจอร์

### เพิ่ม field ใหม่ (3 จุด)
1. **`DEFAULT_CUSTOMERS`** (บรรทัด ~10) — เพิ่ม key ใหม่ + ค่าเริ่มต้น
2. **`addCustomer()`** (บรรทัด ~108) — เพิ่ม key เดียวกัน
3. **`renderEditPanel()`** (บรรทัด ~160) — เพิ่ม `<div class="field"><input data-fld="<key>">`
4. **`renderPreview()`** (บรรทัด ~301) — เพิ่มที่ HTML ของจดหมาย

### แก้ layout จดหมาย
- HTML structure อยู่ใน `renderPreview()` ของ `app.js`
- CSS อยู่ใน `styles.css` — มี `@media print` แยกเฉพาะตอนพิมพ์ (ดู section ล่างสุด)

### Cache busting
หลังแก้ CSS/JS — bump version ใน `index.html` และ `app.js`:
```html
<link rel="stylesheet" href="styles.css?v=N">
<script src="app.js?v=N"></script>
```
และในรูปโลโก้ทุกจุด: `logo.png?v=N`

---

## Deploy (GitHub Pages)

```bash
cd /Users/ggez/Downloads/จดหมายทวงหนี้/html
git add .
git commit -m "ข้อความ commit"
git push origin main
```

GitHub Pages ใช้เวลา build ~1-2 นาที → เปิด https://phonemart.github.io/thunder-final-demand/

---

## Stack
HTML / CSS / JS ล้วน — ไม่มี backend, ข้อมูลเก็บใน `localStorage` ของผู้ใช้แต่ละคน
