INSERT OR IGNORE INTO users (username, password_hash, fullname) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ผู้ดูแลระบบ'),
('teacher1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'อาจารย์สมศักดิ์'),
('teacher2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'อาจารย์วิไล');

INSERT OR IGNORE INTO courses (course_code, course_name, description) VALUES 
('CS101', 'การเขียนโปรแกรมเบื้องต้น', 'เรียนรู้พื้นฐานการเขียนโปรแกรมด้วย Python'),
('CS102', 'โครงสร้างข้อมูลและอัลกอริทึม', 'ศึกษาโครงสร้างข้อมูลและอัลกอริทึมพื้นฐาน'),
('CS201', 'การออกแบบฐานข้อมูล', 'การออกแบบและจัดการฐานข้อมูลเชิงสัมพันธ์'),
('CS202', 'เครือข่ายคอมพิวเตอร์', 'หลักการและการจัดการเครือข่ายคอมพิวเตอร์'),
('CS301', 'วิศวกรรมซอฟต์แวร์', 'การพัฒนาซอฟต์แวร์อย่างเป็นระบบ'),
('CS302', 'การพัฒนาเว็บแอปพลิเคชัน', 'การสร้างเว็บแอปพลิเคชันด้วย React และ Node.js'),
('CS401', 'ปัญญาประดิษฐ์', 'หลักการและการประยุกต์ใช้ปัญญาประดิษฐ์'),
('CS402', 'การรักษาความปลอดภัยไซเบอร์', 'หลักการและเทคนิคการรักษาความปลอดภัยทางไซเบอร์');

INSERT OR IGNORE INTO students (student_id, fullname, email) VALUES 
('STD001', 'สมชาย ใจดี', 'somchai@email.com'),
('STD002', 'สมหญิง รักเรียน', 'somying@email.com'),
('STD003', 'วิชัย ขยัน', 'wichai@email.com'),
('STD004', 'มาลี สวยงาม', 'malee@email.com'),
('STD005', 'ปิติ เก่งกาจ', 'piti@email.com'),
('STD006', 'นิรันดร์ มั่นคง', 'niran@email.com'),
('STD007', 'สุดา เฉลียวฉลาด', 'suda@email.com'),
('STD008', 'ธนา รวยเงิน', 'thana@email.com'),
('STD009', 'อรุณ ตื่นเช้า', 'arun@email.com'),
('STD010', 'พิมพ์ใจ ใสสะอาด', 'pimjai@email.com');

INSERT OR IGNORE INTO course_enrollments (student_id, course_id) VALUES 
('STD001', 1), ('STD002', 1), ('STD003', 1), ('STD004', 1), ('STD005', 1),
('STD001', 2), ('STD002', 2), ('STD006', 2), ('STD007', 2),
('STD003', 3), ('STD004', 3), ('STD005', 3), ('STD008', 3), ('STD009', 3),
('STD006', 4), ('STD007', 4), ('STD008', 4), ('STD010', 4),
('STD001', 5), ('STD009', 5), ('STD010', 5),
('STD002', 6), ('STD003', 6), ('STD007', 6), ('STD008', 6),
('STD004', 7), ('STD005', 7), ('STD009', 7),
('STD006', 8), ('STD010', 8);

INSERT OR IGNORE INTO attendance_events (student_id, course_id, event_type, status, date, timestamp) VALUES 
('STD001', 1, 'clock_in', 'present', date('now'), datetime('now', '-2 hours')),
('STD002', 1, 'clock_in', 'present', date('now'), datetime('now', '-2 hours', '+5 minutes')),
('STD003', 1, 'clock_in', 'late', date('now'), datetime('now', '-2 hours', '+15 minutes')),
('STD004', 1, 'clock_in', 'present', date('now'), datetime('now', '-2 hours', '+2 minutes')),
('STD001', 2, 'clock_in', 'present', date('now', '-1 day'), datetime('now', '-1 day', '+10 hours')),
('STD002', 2, 'clock_in', 'present', date('now', '-1 day'), datetime('now', '-1 day', '+10 hours', '+3 minutes')),
('STD006', 2, 'clock_in', 'late', date('now', '-1 day'), datetime('now', '-1 day', '+10 hours', '+20 minutes')),
('STD003', 3, 'clock_in', 'present', date('now'), datetime('now', '-4 hours')),
('STD004', 3, 'clock_in', 'present', date('now'), datetime('now', '-4 hours', '+1 minute')),
('STD005', 3, 'clock_in', 'present', date('now'), datetime('now', '-4 hours', '+7 minutes')),
('STD001', 5, 'clock_in', 'present', date('now', '-1 day'), datetime('now', '-1 day', '+14 hours')),
('STD009', 5, 'clock_in', 'present', date('now', '-1 day'), datetime('now', '-1 day', '+14 hours', '+5 minutes'));