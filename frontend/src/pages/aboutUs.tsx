import type React from "react";
import { useTranslation } from "react-i18next"; 
import anasImg from "../assets/Anas.jpg";
import ahmadImg from "../assets/Ahmad.png";
import omarImg from "../assets/Omar.png";
import eliasImg from "../assets/Elias.png";
import hasanImg from "../assets/Dr-Hasan.jpg";
import logo from "../assets/JUST-Events AboutUs Logo.jpg";

const AboutUs: React.FC = () => {
  const { t } = useTranslation(); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Title Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent">
            {t("aboutUs")}
          </h1>
          <div className="mb-8 flex justify-center">
            <img
              src={logo}
              alt={t("aboutUs")}
              className="h-48 w-48 rounded-2xl object-contain shadow-lg transition-shadow duration-300 hover:shadow-xl"
            />
          </div>

          {/* Description */}
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-lg leading-relaxed text-gray-700">
              {t("aboutParagraph1")}
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              {t("aboutParagraph2")}
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-center text-4xl font-bold text-transparent">
            {t("meetTeam")}
          </h2>

          {/* Team Members */}
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                img: anasImg,
                name: "Anas K Amoorah",
                id: "151438",
                color: "blue",
                email: "akamoorah21@cit.just.edu.jo",
              },
              {
                img: ahmadImg,
                name: "Ahmad J Alfakori",
                id: "161867",
                color: "green",
                email: "Ahmad@example.com",
              },
              {
                img: omarImg,
                name: "Omar M Alsaleh",
                id: "160800",
                color: "purple",
                email: "omalsaleh22@cit.just.edu.jo",
              },
              {
                img: eliasImg,
                name: "Elias A Alqadi",
                id: "154506",
                color: "orange",
                email: "eaalqadi21@cit.just.edu.jo",
              },
            ].map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className={`mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-${member.color}-100 transition-all duration-300 hover:ring-${member.color}-200`}
                  />
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p
                    className={`mb-1 text-sm font-medium text-${member.color}-600`}
                  >
                    {t("studentId")}: {member.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("email")}:{" "}
                    <a
                      href={`mailto:${member.email}`}
                      className={`text-${member.color}-500 transition-colors duration-200 hover:text-${member.color}-700`}
                    >
                      {member.email}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Supervisor */}
          <div className="flex justify-center">
            <div className="max-w-sm rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-center">
                <img
                  src={hasanImg}
                  alt={t("teamSupervisor")}
                  className="mx-auto mb-4 h-28 w-28 rounded-full object-cover ring-4 ring-indigo-200 transition-all duration-300 hover:ring-indigo-300"
                />
                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  Dr.Hasan K Albzoor
                </h3>
                <p className="mb-2 text-lg font-semibold text-indigo-600">
                  {t("teamSupervisor")}
                </p>
                <p className="text-sm text-gray-600">
                  {t("email")}:{" "}
                  <a
                    href="mailto:hkalbzoor@just.edu.jo"
                    className="text-indigo-500 transition-colors duration-200 hover:text-indigo-700"
                  >
                    hkalbzoor@just.edu.jo
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
