import SignIn from "../../component/guest/SignIn";

export default function LoginAndSignInPage() {
  return (
    <div className="flex h-full min-h-[100vh] w-full justify-between items-center">
      <div className="bg-blue-500 w-[25vw] h-full">bg</div>
      <div className="w-[75vw]">
        <SignIn />
      </div>
    </div>
  );
}
