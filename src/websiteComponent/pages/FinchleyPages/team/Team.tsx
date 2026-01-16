
import team1 from "@/assets/team1.png";
import team2 from "@/assets/team2.png";
import team3 from "@/assets/team3.png";
import team4 from "@/assets/team4.png";
import team5 from "@/assets/team5.png";
import team6 from "@/assets/team6.png";
import team7 from "@/assets/team7.png";
import team8 from "@/assets/team8.png";
import team9 from "@/assets/team9.png";
import team10 from "@/assets/team10.png";
import team11 from "@/assets/team11.png";
import team12 from "@/assets/team12.png";
import team13 from "@/assets/team13.png";
import team14 from "@/assets/team14.png";
import team15 from "@/assets/team15.png";
import team16 from "@/assets/team16.png";
import team17 from "@/assets/team17.png";
import team18 from "@/assets/team18.png";
import team19 from "@/assets/team19.png";
import team20 from "@/assets/team20.png";

import teamBg from "@/assets/teambg.png";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import TeamCard from "@/websiteComponent/common/home/TeamCard";

const team = [
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team1,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team2,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team3,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team4,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team5,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team6,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team7,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team8,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team9,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team10,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team11,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team12,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team13,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team14,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team15,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team16,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team17,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team18,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team19,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team20,
  },
];

function Team() {
    return (
        <>
         <SimpleHeroBanner
        background={teamBg}
        title="Our Team"
        subtitle="Finchley Central"
      />
        <section className="pt-12 lg:pt-[110px]">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 sm:gap-y-14 md:gap-y-16 lg:gap-y-24">
                    {team.map((member , index) => (
                        <TeamCard key={member.name} {...member} index={index} />
                    ))}
                </div>
            </div>
        </section>
        </>
    )
}

export default Team
