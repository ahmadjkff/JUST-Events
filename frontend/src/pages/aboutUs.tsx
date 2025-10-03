// import React from "react";
// import "../styles/AboutUs.css";
// import Logo from "../assets/Logo.png";
// import AnasImg from "../assets/Anas.jpg";
// import AhmadImg from "../assets/Ahmad.png";
// import OmarImg from "../assets/Omar.png";
// import EliasImg from "../assets/Elias.png";
// import DrHasanImg from "../assets/Dr-Hasan.jpg";

// const AboutUs: React.FC = () => {
//     return (
//         <div className="about-us-page">
//             <main className="about-us-main">
//                 <section className="about-us-section">
//                     <h1>About Us</h1>
//                     <img src={Logo} alt="About Us" className="about-us-image" />
//                     <p>
//                         JUST Events is a digital platform designed to centralize and streamline the management of student activities at Jordan University of Science and Technology (JUST). The system provides a modern alternative to traditional methods of promoting and managing events, which often rely on fragmented channels such as printed posters or social media groups. By bringing everything together in one place, JUST Events makes it easier for students and organizers to stay connected and engaged.
//                     </p>
//                     <p>
//                         The platform allows students to browse upcoming events, register for activities, volunteer, provide feedback, and even download participation certificates directly from the system. Event organizers benefit from efficient registration tracking, feedback collection, and communication with participants. With an intuitive design and user-friendly interface, JUST Events ensures that both students and staff can manage event participation seamlessly.
//                     </p>
//                 </section>

//                 <section className="team-section">
//                     <h2>Meet Our Team</h2>
//                     <div className="team-members">
//                         <div className="team-member">
//                             <img src={AnasImg} alt="Team Member 1" className="team-member-image" />
//                             <h3>Anas K Amoorah</h3>
//                             <p>Student ID: 151438</p>
//                             <p>Email: <a href="mailto:ana@example.com">akamoorah21@cit.just.edu.jo</a></p>
//                         </div>
//                         <div className="team-member">
//                             <img src={AhmadImg} alt="Team Member 2" className="team-member-image" />
//                             <h3>Ahmad J Alfakori</h3>
//                             <p>Student ID: 161867</p>
//                             <p>Email: <a href="mailto:omar@example.com">Ahmad@example.com</a></p>
//                         </div>
//                         <div className="team-member">
//                             <img src={OmarImg} alt="Team Member 3" className="team-member-image" />
//                             <h3>Omar M Alsaleh</h3>
//                             <p>Student ID: 160800</p>
//                             <p>Email: <a href="mailto:layla@example.com">omalsaleh22@cit.just.edu.jo</a></p>
//                         </div>
//                         <div className="team-member">
//                             <img src={EliasImg} alt="Team Member 4" className="team-member-image" />
//                             <h3>Elias A Alqadi</h3>
//                             <p>Student ID: 154506</p>
//                             <p>Email: <a href="mailto:yousef@example.com">eaalqadi21@cit.just.edu.jo</a></p>
//                         </div>
//                     </div>
//                     <br />
//                     <div className="team-members">
//                         <div className="team-member">
//                             <img src={DrHasanImg} alt="Team Member 4" className="team-member-image" />
//                             <h3>Dr.Hasan K Albzoor</h3>
//                             <p>Team Supervisor</p>
//                             <p>Email: <a href="mailto:yousef@example.com">hkalbzoor@just.edu.jo</a></p>
//                         </div>
//                     </div>
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default AboutUs;

import type React from "react";
import anasImg from "../assets/Anas.jpg";
import ahmadImg from "../assets/Ahmad.png";
import omarImg from "../assets/Omar.png";
import eliasImg from "../assets/Elias.png";
import hasanImg from "../assets/Dr-Hasan.jpg";
import logo from "../assets/JUST-Events AboutUs Logo.jpg";
const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent">
            About Us
          </h1>
          <div className="mb-8 flex justify-center">
            <img
              src={logo}
              alt="About Us"
              className="h-48 w-48 rounded-2xl object-contain shadow-lg transition-shadow duration-300 hover:shadow-xl"
            />
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-lg leading-relaxed text-gray-700">
              JUST Events is a digital platform designed to centralize and
              streamline the management of student activities at Jordan
              University of Science and Technology (JUST). The system provides a
              modern alternative to traditional methods of promoting and
              managing events, which often rely on fragmented channels such as
              printed posters or social media groups. By bringing everything
              together in one place, JUST Events makes it easier for students
              and organizers to stay connected and engaged.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              The platform allows students to browse upcoming events, register
              for activities, volunteer, provide feedback, and even download
              participation certificates directly from the system. Event
              organizers benefit from efficient registration tracking, feedback
              collection, and communication with participants. With an intuitive
              design and user-friendly interface, JUST Events ensures that both
              students and staff can manage event participation seamlessly.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-center text-4xl font-bold text-transparent">
            Meet Our Team
          </h2>
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-center">
                <img
                  src={anasImg}
                  alt="Team Member 1"
                  className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-blue-100 transition-all duration-300 hover:ring-blue-200"
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  Anas K Amoorah
                </h3>
                <p className="mb-1 text-sm font-medium text-blue-600">
                  Student ID: 151438
                </p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:akamoorah21@cit.just.edu.jo"
                    className="text-blue-500 transition-colors duration-200 hover:text-blue-700"
                  >
                    akamoorah21@cit.just.edu.jo
                  </a>
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-center">
                <img
                  src={ahmadImg}
                  alt="Team Member 2"
                  className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-green-100 transition-all duration-300 hover:ring-green-200"
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  Ahmad J Alfakori
                </h3>
                <p className="mb-1 text-sm font-medium text-green-600">
                  Student ID: 161867
                </p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:Ahmad@example.com"
                    className="text-green-500 transition-colors duration-200 hover:text-green-700"
                  >
                    Ahmad@example.com
                  </a>
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-center">
                <img
                  src={omarImg}
                  alt="Team Member 3"
                  className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-purple-100 transition-all duration-300 hover:ring-purple-200"
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  Omar M Alsaleh
                </h3>
                <p className="mb-1 text-sm font-medium text-purple-600">
                  Student ID: 160800
                </p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:omalsaleh22@cit.just.edu.jo"
                    className="text-purple-500 transition-colors duration-200 hover:text-purple-700"
                  >
                    omalsaleh22@cit.just.edu.jo
                  </a>
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-center">
                <img
                  src={eliasImg}
                  alt="Team Member 4"
                  className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-orange-100 transition-all duration-300 hover:ring-orange-200"
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  Elias A Alqadi
                </h3>
                <p className="mb-1 text-sm font-medium text-orange-600">
                  Student ID: 154506
                </p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:eaalqadi21@cit.just.edu.jo"
                    className="text-orange-500 transition-colors duration-200 hover:text-orange-700"
                  >
                    eaalqadi21@cit.just.edu.jo
                  </a>
                </p>
              </div>
            </div>
          </div>
          <br />
          <div className="flex justify-center">
            <div className="max-w-sm rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-center">
                <img
                  src={hasanImg}
                  alt="Team Supervisor"
                  className="mx-auto mb-4 h-28 w-28 rounded-full object-cover ring-4 ring-indigo-200 transition-all duration-300 hover:ring-indigo-300"
                />
                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  Dr.Hasan K Albzoor
                </h3>
                <p className="mb-2 text-lg font-semibold text-indigo-600">
                  Team Supervisor
                </p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
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
