
import React from "react";
import "../styles/AboutUs.css";
import Logo from "../assets/Logo.png";
import AnasImg from "../assets/Anas.jpg";
import AhmadImg from "../assets/Ahmad.png";
import OmarImg from "../assets/Omar.png";
import EliasImg from "../assets/Elias.png";
import DrHasanImg from "../assets/Dr-Hasan.jpg";

const AboutUs: React.FC = () => {
    return (
        <div className="about-us-page">
            <main className="about-us-main">
                <section className="about-us-section">
                    <h1>About Us</h1>
                    <img src={Logo} alt="About Us" className="about-us-image" />
                    <p>
                        JUST Events is a digital platform designed to centralize and streamline the management of student activities at Jordan University of Science and Technology (JUST). The system provides a modern alternative to traditional methods of promoting and managing events, which often rely on fragmented channels such as printed posters or social media groups. By bringing everything together in one place, JUST Events makes it easier for students and organizers to stay connected and engaged.
                    </p>
                    <p>
                        The platform allows students to browse upcoming events, register for activities, volunteer, provide feedback, and even download participation certificates directly from the system. Event organizers benefit from efficient registration tracking, feedback collection, and communication with participants. With an intuitive design and user-friendly interface, JUST Events ensures that both students and staff can manage event participation seamlessly.
                    </p>
                </section>

                <section className="team-section">
                    <h2>Meet Our Team</h2>
                    <div className="team-members">
                        <div className="team-member">
                            <img src={AnasImg} alt="Team Member 1" className="team-member-image" />
                            <h3>Anas K Amoorah</h3>
                            <p>Student ID: 151438</p>
                            <p>Email: <a href="mailto:ana@example.com">akamoorah21@cit.just.edu.jo</a></p>
                        </div>
                        <div className="team-member">
                            <img src={AhmadImg} alt="Team Member 2" className="team-member-image" />
                            <h3>Ahmad J Alfakori</h3>
                            <p>Student ID: 161867</p>
                            <p>Email: <a href="mailto:omar@example.com">Ahmad@example.com</a></p>
                        </div>
                        <div className="team-member">
                            <img src={OmarImg} alt="Team Member 3" className="team-member-image" />
                            <h3>Omar M Alsaleh</h3>
                            <p>Student ID: 160800</p>
                            <p>Email: <a href="mailto:layla@example.com">omalsaleh22@cit.just.edu.jo</a></p>
                        </div>
                        <div className="team-member">
                            <img src={EliasImg} alt="Team Member 4" className="team-member-image" />
                            <h3>Elias A Alqadi</h3>
                            <p>Student ID: 154506</p>
                            <p>Email: <a href="mailto:yousef@example.com">eaalqadi21@cit.just.edu.jo</a></p>
                        </div>
                    </div>
                    <br />
                    <div className="team-members">
                        <div className="team-member">
                            <img src={DrHasanImg} alt="Team Member 4" className="team-member-image" />
                            <h3>Dr.Hasan K Albzoor</h3>
                            <p>Team Supervisor</p>
                            <p>Email: <a href="mailto:yousef@example.com">hkalbzoor@just.edu.jo</a></p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutUs;
