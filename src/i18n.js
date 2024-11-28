import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
function getCurrentLang() {
  return localStorage.getItem("i18nextLng") || "en";
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          languageLabel: "English",
          aboutHeader: "Speedy, fast and easy manage your products.",
          aboutDescription:
            "Beeshelf provides a comprehensive solution for efficiently managing and consigning goods. With a user-friendly and easy-to-use interface, users can track the status of their orders in real-time.",
          aboutBenefit01: "User-friendly interface",
          aboutBenefit02: "Provides reliable warehouses",
          aboutBenefit03: "Easily manage orders",
          aboutBenefit04: "Easily register for consignment",
          Getstarted: "Get started",
          Viewpreview: "View preview",
          SCROLLTOEXPLORE: "SCROLL TO EXPLORE",
          About: "About",
          Service: "Service",
          Feature: "Feature",
          Customers: "Customers",
          Contact: "Contact",
          SignIn: "Sign In",
          SignUp: "Sign Up",
          Trustedbybusinesses: "Trusted by businesses",
          Agiledeliveryteam: "Agile delivery team",
          Happycustomer: "Happy customer",
          Overallrating: "Overall rating",
          Whychooseus: "Why choose us",
          Getthebestpackageforyourbusiness:
            "Get the best package for your business",
          servicesDesciption:
            "We work systematically to integrate corporate responsibility in our core business and make our expertise available for the benefits of the societies where we operate",
          servicesBenefit01:
            "Website and application that are easy to use and easy for users to understand",
          servicesBenefit02:
            "We have application to support shipper and clients to track their orders",
          servicesBenefit03:
            "Perfect for large sites or agencies that manage many clients, warehouse, inventory, products",
        },
      },
      vi: {
        translation: {
          languageLabel: "Tiếng Việt",
          aboutHeader:
            "Nhanh chóng, tiện lợi và dễ dàng quản lý sản phẩm của bạn.",
          aboutDescription:
            "Beeshelf cung cấp giải pháp toàn diện để quản lý và ký gửi hàng hóa một cách hiệu quả. Với giao diện thân thiện, dễ sử dụng, người dùng có thể quản lý được trạng thái đơn hàng bằng thời gian thật.",
          aboutBenefit01: "Giao diện dễ dùng",
          aboutBenefit02: "Cung cấp các kho hàng uy tín",
          aboutBenefit03: "Dễ dàng quản lý đơn hàng",
          aboutBenefit04: "Dễ dàng đăng ký ký gửi",
          Getstarted: "Bắt đầu",
          Viewpreview: "Xem trước",
          SCROLLTOEXPLORE: "CUỘN ĐỂ KHÁM PHÁ",
          About: "Giới thiệu",
          Service: "Dịch vụ",
          Feature: "Tính năng",
          Customers: "Khách hàng",
          Contact: "Liên hệ",
          SignIn: "Đăng nhập",
          SignUp: "Đăng ký",
          Trustedbybusinesses: "Doanh nghiệp tin tưởng sử dụng",
          Agiledeliveryteam: "Đội ngũ shipper nhanh nhẹn",
          Happycustomer: "Khách hàng hài lòng",
          Overallrating: "Đánh giá tổng thể",
          Ourservice: "Our service",
          Ourservice: "Dịch vụ của chúng tôi",
          Whychooseus: "Tại sao chọn chúng tôi",
          Getthebestpackageforyourbusiness:
            "Nhận gói tốt nhất cho doanh nghiệp của bạn",
          servicesDesciption:
            "Chúng tôi làm việc có hệ thống để tích hợp trách nhiệm doanh nghiệp vào hoạt động kinh doanh cốt lõi và chia sẻ chuyên môn của mình nhằm mang lại lợi ích cho các cộng đồng nơi chúng tôi hoạt động",

          servicesBenefit01:
            "Website và ứng dụng dễ sử dụng và dễ hiểu đối với người dùng",
          servicesBenefit02:
            "Chúng tôi có ứng dụng hỗ trợ shipper và khách hàng theo dõi đơn hàng của họ",
          servicesBenefit03:
            "Hoàn hảo cho các trang web lớn hoặc các đại lý quản lý nhiều khách hàng, kho bãi, hàng tồn kho, và sản phẩm",
        },
      },
      ja: {
        translation: {
          languageLabel: "日本語",
          aboutHeader: "迅速で簡単、そして手軽に製品を管理しましょう。",
          aboutDescription:
            "Beeshelf は、効率的に商品を管理および委託するための包括的なソリューションを提供します。使いやすく親しみやすいインターフェースにより、ユーザーはリアルタイムで注文状況を追跡することができます。",
          aboutBenefit01: "使いやすいインターフェース",
          aboutBenefit02: "信頼できる倉庫を提供",
          aboutBenefit03: "注文を簡単に管理",
          aboutBenefit04: "簡単に委託登録",
          Getstarted: "始める",
          Viewpreview: "プレビューを見る",
          SCROLLTOEXPLORE: "スクロールして探索",
          About: "概要",
          Service: "サービス",
          Feature: "特徴",
          Customers: "お客様",
          Contact: "お問い合わせ",
          SignIn: "ログイン",
          SignUp: "登録",
          Trustedbybusinesses: "企業からの信頼を得ています",
          Agiledeliveryteam: "機敏な配達チーム",
          Happycustomer: "満足したお客様",
          Overallrating: "総合評価",
          Ourservice: "私たちのサービス",
          Whychooseus: "なぜ私たちを選ぶのか",
          Getthebestpackageforyourbusiness:
            "最適なパッケージを手に入れましょうあなたのビジネス",
          servicesDesciption:
            "私たちは、コアビジネスに企業責任を体系的に統合し、私たちが活動する地域社会の利益のために専門知識を提供するよう努めています",

          servicesBenefit01:
            "使いやすく、ユーザーにとってわかりやすいウェブサイトとアプリケーション",
          servicesBenefit02:
            "配達員と顧客が注文を追跡できるアプリケーションを提供しています",
          servicesBenefit03:
            "多くの顧客、倉庫、在庫、製品を管理する大規模なサイトや代理店に最適です",
        },
      },
    },
  });

export default i18n;
