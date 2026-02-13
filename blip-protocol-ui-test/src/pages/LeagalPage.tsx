import Cookies from "@/components/Cookies";
import Gdpr from "@/components/Gdpr";
import Privacy from "@/components/Privecy";
import TermsService from "@/components/TermsService";
import { useParams, useNavigate } from "react-router-dom";



const tabs = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "cookies", label: "Cookies Policy" },
  { id: "gdpr", label: "GDPR" },
];

export default function LegalPage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (tab) {
      case "privacy":
        return <Privacy />;
      case "terms":
        return <TermsService />;
      case "cookies":
        return <Cookies />;
      case "gdpr":
        return <Gdpr />;
      default:
        return <Privacy />;
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-16">
      
      {/* Tabs */}
      

      {/* Content */}
      <div>
        {renderContent()}

        <div className="flex flex-wrap justify-center my-4 gap-3 mb-10">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => navigate(`/legal/${t.id}`)}
            className={`
              px-5 py-2 rounded-full text-sm transition-all
              ${tab === t.id
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/20"
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      </div>

     

    </div>
  );
}
