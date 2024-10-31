import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import { Warehouse } from "@phosphor-icons/react";
function getCurrentLang() {
  return localStorage.getItem("i18nextLng") || "en";
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          AddProduct: "Add Product",
          AddtoInventory: "Add to Inventory",
          AllLocation: "All Location",
          Apply: "Apply",
          Barcode: "Barcode",
          Brand: "Brand",
          Category: "Category",
          Dashboard: "Dashboard",
          Delete: "Delete",
          DisplayName: "Display Name",
          DownloadExcelTemplate: "Download Excel Template",
          English: "English",
          ExportExcel: "Export Excel",
          ExportExcelSelectedProducts: "Export Excel Selected Products",
          Filters: "Filters",
          Group: "Group",
          Help: " Help",
          ImportAllProducts: "Import All Products",
          ImportExcel: "Import Excel",
          ImportSelectedProducts: "Import Selected Products",
          INSTOCK: "IN STOCK",
          Japanese: "Japanese",
          Light: "Light",
          Location: "Location",
          Logout: " Log Out",
          Name: "Name",
          Notification: " Notification",
          Order: "Order",
          OUTSTOCK: "OUT STOCK",
          OVERVIEW: "OVERVIEW",
          Price: "Price",
          Product: "Product",
          ProductReserved: "Product Reserved",
          ProductTemplateName: "product_template_file",
          Products: "Products",
          QuickSearch: "Quick Search",
          Reset: "Reset",
          Settings: "Settings",
          Size: "Size",
          Skutotal: "Sku total",
          SKU: "SKU",
          Status: "Status",
          Stock: "Stock",
          StockIssue: "Stock Issue",
          Tags: "Tags",
          Totalproducts: "Total products",
          Update: "Update",
          Vendor: "Vendor",
          Vietnamese: "VietNamese",
          Warehouse: "Warehouse",
          WarehouseSize: "Warehouse Size",
          Weight:"Weight"
        },
      },
      vi: {
        translation: {
          AddProduct: "Thêm sản phẩm",
          AddtoInventory: "Thêm vào kho",
          AllLocation: "Tất cả vị trí",
          Apply: "Áp dụng",
          Barcode: "Mã vạch",
          Brand: "Thương hiệu",
          Category: "Danh mục",
          Dashboard: "Thống kê",
          Delete: "Xóa",
          DisplayName: "Tên hiển thị",
          DownloadExcelTemplate: "Tải xuống mẫu Excel",
          English: "Tiếng Anh",
          ExportExcel: "Xuất Excel",
          ExportExcelSelectedProducts: "Xuất Excel các sản phẩm đã chọn",
          Filters: "Bộ lọc",
          Group: "Nhóm",
          Help: "Trợ giúp",
          ImportAllProducts: "Nhập tất cả sản phẩm",
          ImportExcel: "Nhập Excel",
          ImportSelectedProducts: "Nhập các sản phẩm đã chọn",
          INSTOCK: "Còn hàng",
          Japanese: "Tiếng Nhật",
          Light: "Sáng",
          Location: "Vị trí",
          Logout: "Đăng xuất",
          Name: "Tên",
          Notification: "Thông báo",
          Order: "Đơn hàng",
          OUTSTOCK: "Hết hàng",
          OVERVIEW: "TỔNG QUAN",
          Price: "Giá",
          Product: "Sản phẩm",
          ProductReserved: "Sản phẩm đã đặt trước",
          ProductTemplateName: "tep_mau_san_pham",
          Products: "Sản phẩm",
          QuickSearch: "Tìm kiếm nhanh",
          Reset: "Đặt lại",
          Settings: "Cài đặt",
          Size: "Kích thước",
          Skutotal: "Tổng Sku",
          SKU: "Mã sản phẩm",
          Status: "Trạng thái",
          Stock: "Tồn kho",
          StockIssue: "Vấn đề tồn kho",
          Tags: "Thẻ",
          Totalproducts: "Tổng sản phẩm",
          Update: "Cập nhật",
          Vendor: "Nhà cung cấp",
          Vietnamese: "Tiếng Việt",
          Warehouse: "Kho hàng",
          WarehouseSize: "Kích thước kho",
          Weight:"Trọng lượng",
        },
      },
      ja: {
        translation: {
          AddProduct: "製品を追加",
          AddtoInventory: "在庫に追加",
          AllLocation: "すべての場所",
          Apply: "適用",
          Barcode: "バーコード",
          Brand: "ブランド",
          Category: "カテゴリ",
          Dashboard: "統計学",
          Delete: "削除",
          DisplayName: "表示名",
          DownloadExcelTemplate: "エクセルテンプレートをダウンロード",
          English: "英語",
          ExportExcel: "エクセルをエクスポート",
          ExportExcelSelectedProducts: "選択した製品をExcelでエクスポート",
          Filters: "フィルター",
          Group: "グループ",
          Help: "ヘルプ",
          ImportAllProducts: "すべての製品をインポート",
          ImportExcel: "エクセルをインポート",
          ImportSelectedProducts: "選択した製品をインポート",
          INSTOCK: "在庫あり",
          Japanese: "日本語",
          Light: "ライト",
          Location: "場所",
          Logout: "ログアウト",
          Name: "名前",
          Notification: "通知",
          Order: "注文",
          OUTSTOCK: "在庫切れ",
          OVERVIEW: "概要",
          Price: "価格",
          Product: "製品",
          ProductReserved: "予約済み製品",
          ProductTemplateName: "製品テンプレートファイル",
          Products: "製品",
          QuickSearch: "クイック検索",
          Reset: "リセット",
          Settings: "設定",
          Size: "サイズ",
          Skutotal: "総SKU",
          SKU: "SKU",
          Status: "ステータス",
          Stock: "在庫",
          StockIssue: "在庫問題",
          Tags: "タグ",
          Totalproducts: "総製品",
          Update: "更新",
          Vendor: "ベンダー",
          Vietnamese: "ベトナム語",
          Warehouse: "倉庫",
          WarehouseSize: "倉庫サイズ",
          Weight:"重量"
        },
      },
    },
  });

export default i18n;
