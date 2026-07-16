# AN / ATELIER — 3D Art Gallery

Website bán và trưng bày tranh tương tác với trải nghiệm 3D, cuộn chuyển tác phẩm,
xem toàn màn hình và giỏ hàng demo.

## Điểm nổi bật

- Three.js/WebGL qua React Three Fiber và Drei
- Kéo, vuốt hoặc rê chuột để xoay khung tranh
- Chuyển sản phẩm theo cuộn trang với Lenis
- Giao diện responsive cho máy tính và điện thoại
- Ảnh tĩnh dự phòng nếu thiết bị không hỗ trợ WebGL
- Tự động build và deploy bằng GitHub Pages

## Chạy trên máy

Yêu cầu Node.js 22 trở lên.

```bash
npm install
npm run dev
```

Kiểm tra source:

```bash
npm run lint
npm run build:pages
```

## Cấu trúc chính

- `app/page.tsx`: giao diện, dữ liệu tranh và tương tác
- `app/globals.css`: toàn bộ thiết kế responsive và animation
- `public/artworks/`: ảnh tác phẩm gốc
- `.github/workflows/deploy-pages.yml`: quy trình GitHub Pages

Giá bán và thông tin liên hệ trong giao diện hiện là dữ liệu minh họa.
