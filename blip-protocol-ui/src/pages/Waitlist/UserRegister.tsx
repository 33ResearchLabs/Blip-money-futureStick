import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Register from "./Register";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

export default function UserRegister() {
  return (
    <>
      <SEO
        title="Create Account | Blip Money"
        description="Create your Blip Money account. Get early access to fast, secure, and borderless crypto payments. Earn bonus points on signup."
        canonical="https://blip.money/register"
      />
      <HreflangTags path="/register" />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden">
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-24">
          <AuthPageLayout
            badge="Get Started"
            heading="Create Account"
            description="Join Blip Money and start earning rewards"
            variant="user"
          >
            <Register embedded />
          </AuthPageLayout>
        </main>
      </div>
    </>
  );
}
