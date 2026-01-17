import { useEffect, useState } from "react";
import TeamCard from "@/websiteComponent/common/home/TeamCard";
import teambg from "@/assets/teambg.png";
import { getTeams } from "@/websiteComponent/api/teams.api";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";

function Team() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTeams()
      .then((res) => {
        const sortedTeams = res.data.teams.sort(
          (a, b) => a.index - b.index
        );
        setTeams(sortedTeams);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SimpleHeroBanner
        background={teambg}
        title="Our Team"
        subtitle="Finchley Central"
      />

      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto">

          {loading && (
            <div className="text-center py-20">Loading...</div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 sm:gap-y-14 md:gap-y-16 lg:gap-y-24">
              {teams.map((member, index) => (
                <TeamCard
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                 description={member.description}
                  index={index}
                />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default Team;
