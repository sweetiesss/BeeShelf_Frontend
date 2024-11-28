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
        },
      },
    },
  });

export default i18n;
