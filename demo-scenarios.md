**Tổng Quan Phân Công**

| Scenario | Role  | Nghiệp vụ chính                                                 | Người demo |
| -------- | ----- | --------------------------------------------------------------- | ---------- |
| 1        | User  | Khởi tạo hồ sơ nghiệp vụ và đính kèm tài liệu                   | Member 1   |
| 2        | User  | Cập nhật tài liệu, upload version mới, kiểm tra lịch sử         | Member 2   |
| 3        | User  | Điều chỉnh Business Object, gỡ liên kết, xoá attachment         | Member 3   |
| 4        | Admin | Giám sát hệ thống, khôi phục attachment đã xoá, liên kết lại BO | Member 4   |
| 5        | Admin | Quản trị user, role, cấu hình rule upload                       | Member 5   |

**Scenario 1: User tạo hồ sơ nghiệp vụ hoàn chỉnh**

Role: `User`

Mục tiêu: mô phỏng nhân viên tạo một Business Object mới, upload tài liệu liên quan, rồi liên kết tài liệu đó vào hồ sơ nghiệp vụ.

Base flow:

1. Vào Launchpad với role User.
2. Mở Business Objects.
3. Tạo BO mới, ví dụ: `Purchase Contract 2026`.
4. Vào danh sách Attachments.
5. Tạo Attachment mới bằng file local hoặc Google Drive.
6. Link Attachment vừa tạo vào BO.
7. Mở BO Detail để xác nhận attachment đã được liên kết.
8. Mở Attachment Detail để xem thông tin file, preview/download nếu có.

Bao quát: Launchpad user, BO create, attachment create/upload, link BO-Attachment, detail view, preview/download.

**Scenario 2: User cập nhật tài liệu và quản lý version**

Role: `User`

Mục tiêu: mô phỏng khi tài liệu nghiệp vụ thay đổi, user upload version mới và kiểm tra lịch sử thay đổi.

Base flow:

1. Mở Attachment đã tạo ở Scenario 1.
2. Xem current version hiện tại.
3. Upload version mới, ví dụ: `contract_v2.pdf`. (Nếu S1 upload từ Local thì S2 nên upload từ Drive và ngược lại)
4. Kiểm tra version list.
5. Mở Version Detail.
6. Set version mới thành current version nếu cần.
7. Xem Audit History để chứng minh hệ thống ghi nhận thay đổi.
8. Quay lại BO Detail để xác nhận BO vẫn đang giữ attachment đúng.

Bao quát: attachment detail, upload version, version detail, set current version, audit history, BO-linked attachment continuity.

**Scenario 3: User chỉnh sửa BO, gỡ liên kết và xoá attachment**

Role: `User`

Mục tiêu: mô phỏng nghiệp vụ cleanup khi hồ sơ thay đổi hoặc tài liệu không còn hợp lệ.

Base flow:

1. Mở BO đã tạo.
2. Edit thông tin BO, ví dụ đổi description/status/name.
3. Xem danh sách attachment đang liên kết.
4. Unlink attachment khỏi BO.
5. Kiểm tra BO Detail không còn attachment đó.
6. Sang Attachment Detail hoặc Attachment List.
7. Xoá attachment.
8. Xác nhận attachment biến mất khỏi danh sách active.
9. Có thể mở Audit History trước khi xoá hoặc sau khi thao tác để nhấn mạnh traceability.

Bao quát: BO edit, linked attachments, unlink, attachment delete, audit trail.

**Scenario 4: Admin giám sát và phục hồi dữ liệu bị xoá**

Role: `Admin`

Mục tiêu: mô phỏng admin xử lý tình huống user xoá nhầm tài liệu quan trọng.

Base flow:

1. Đăng nhập bằng Admin.
2. Vào Launchpad, thấy thêm khu vực admin.
3. Mở Dashboard để xem overview hệ thống.
4. Vào Deleted Attachments.
5. Tìm attachment đã bị xoá ở Scenario 3.
6. Restore attachment.
7. Quay lại Attachment List để xác nhận attachment đã active lại.
8. Mở BO liên quan.
9. Link lại attachment đã restore vào BO.
10. Kiểm tra BO Detail và Attachment Detail.

Bao quát: admin-only navigation, dashboard, deleted attachments, restore, relink BO-Attachment.

**Scenario 5: Admin quản trị user, role và cấu hình upload**

Role: `Admin`

Mục tiêu: mô phỏng quản trị vận hành hệ thống: cấp quyền người dùng và kiểm soát rule upload tài liệu.

Base flow:

1. Vào Dashboard/Admin Layout.
2. Mở User Management.
3. Tạo một auth user mới hoặc kiểm tra danh sách user hiện tại.
4. Gán/kiểm tra role `USER` hoặc `ADMIN`.
5. Thử tình huống self-delete bị chặn nếu có thể demo nhanh.
6. Mở Configuration Files.
7. Xem cấu hình rule upload hiện tại, ví dụ extension/mime/max size.
8. Tạo hoặc sửa một config rule.
9. Enable/disable config rule.
10. Quay lại attachment upload để nói rõ rule này ảnh hưởng tới việc upload file như thế nào.

Bao quát: admin user list, create/delete auth user, role management, config files, enable/disable config, upload validation policy.
