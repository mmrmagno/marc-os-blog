import React from 'react';
import '../styles/About.css';

const About = () => {
  const projects = [
    {
      name: 'Gradify',
      description: 'A full-stack application designed for schools to manage student grades efficiently. Gradify simplifies administrative grade tasks.',
      github: null
    },
    {
      name: 'RustGuard',
      description: 'A command-line WireGuard VPN client built in Rust.',
      github: 'https://github.com/mmrmagno/rustguard'
    },
    {
      name: 'Quick-CLI',
      description: 'A Rust-powered CLI tool that streamlines the management of QuickEMU virtual machines, reducing routine overhead and simplifying system maintenance.',
      github: 'https://github.com/mmrmagno/quick-cli'
    },
    {
      name: 'McNator',
      description: 'A Python-based Discord bot that logs Minecraft server activity directly to Discord.',
      github: 'https://github.com/mmrmagno/mcnator'
    },
    {
      name: 'Valart',
      description: 'A modern, Valorant-themed website for creating, sharing, and exploring ASCII art.',
      github: 'https://github.com/mmrmagno/valart'
    },
    {
      name: 'VMS',
      description: 'VMS is a modern web-based visitor management system built with FastAPI and PostgreSQL. It provides an efficient way to track visitors, manage check-ins/check-outs, and maintain a secure log of all visits.',
      github: 'https://github.com/mmrmagno/vms'
    }
  ];

  return (
    <div className="about">
      <section className="bio-section">
        <h1>About Me</h1>
        <div className="bio-content">
          <p>Hello, my name is Marcos Magno Biriba Ribeiro, though I usually go by Marcos Magno (or Marc). My family names reflect my heritage: Ribeiro is my father's surname, and Biriba comes from my mother's side. Born on January 18, 2005, in São Paulo, Brazil, I've always been surrounded by the energy and diversity of one of the world's largest cities.</p>
          
          <p>My interests are as varied as they are passionate. I love playing guitar, engaging in sports, and spending quality time with friends, family, and my girlfriend. While I cherish moments of creativity and activity, I also appreciate calm, relaxed environments over noisy, crowded parties. I even humorously remark about disliking sleep, after all, if you reach the age of 90, you might spend 30 years asleep!</p>

	   <p>My first spark for technology, however, ignited between the ages of 8 and 13, I taught myself to build an automatic door in Minecraft using command blocks. By detecting players within a set radius, the door would open, and I even customized it to recognize only my in-game name, creating a “private” entrance accessible solely to me.</p>
          
          <p>Over the years, I've navigated challenges that have significantly shaped who I am today. In 2018, I moved from Brazil to Budapest, Hungary, arriving with little knowledge of Hungarian and only basic English. Through relentless effort, I transformed my language skills, and now I speak English fluently with a touch of Hungarian. Then, in 2020, I embraced yet another challenge by moving to Switzerland. Here, I'm diligently working to master German, a language essential for both my professional growth and everyday life.</p>
          
          <p>My journey into technology began with my apprenticeship on August 2nd 2021. Inspired by my dad's career, I delved into software development, deepening my understanding of computer hardware, network systems, and innovative solutions. This passion led me to develop several projects:</p>
        </div>
      </section>

      <section className="projects-section">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                  View on GitHub
                </a>
              )}
            </div>
          ))}
        </div>
        
        <div className="closing-statement">
          <p>I believe that perseverance is the key to overcoming any obstacle—whether it's learning a new language, adapting to a new country, or diving into complex technical challenges. My journey is one of continuous growth and unwavering determination.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
