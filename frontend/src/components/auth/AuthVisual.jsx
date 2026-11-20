import { motion } from "framer-motion";
import { Headphones, Music2, Radio, Users } from "lucide-react";
import Equalizer from "./Equalizer";

const albums = [
  {
    title: "Midnight City",
    artist: "M83",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=85",
    className: "auth-album auth-album--one",
  },
  {
    title: "Electric Feel",
    artist: "MGMT",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=85",
    className: "auth-album auth-album--two",
  },
  {
    title: "Night Drive",
    artist: "Chromatics",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=85",
    className: "auth-album auth-album--three",
  },
];

export default function AuthVisual() {
  return (
    <section className="auth-visual" aria-label="AURA listening lounge">
      <div className="auth-visual-orb auth-visual-orb--pink" aria-hidden="true" />
      <div className="auth-visual-orb auth-visual-orb--cyan" aria-hidden="true" />
      <div className="auth-visual-top">
        <div className="auth-brand" aria-label="AURA">
          <div className="auth-brand-mark">
            <Music2 size={20} strokeWidth={2.3} />
          </div>
          <span className="auth-brand-name">AURA</span>
        </div>
        <span className="auth-tagline">Music hits different together.</span>
      </div>

      <div className="auth-art-stage">
        {albums.map((album, index) => (
          <motion.div
            key={album.title}
            className={`auth-album-wrap ${album.className}`}
            animate={{ y: [0, index % 2 ? -13 : 11, 0], rotate: [0, index % 2 ? 2 : -2, 0] }}
            transition={{ duration: 6 + index * 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
          >
            <div className="auth-album">
              <img src={album.image} alt="" />
              <div className="auth-album-shade" />
              <div className="auth-album-info">
                <strong>{album.title}</strong>
                <span>{album.artist}</span>
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div
          className="auth-live-pill"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="auth-live-dot" />
          <span>Live room</span>
          <Equalizer compact />
        </motion.div>
        <motion.div
          className="auth-listener auth-listener--one"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="auth-avatar auth-avatar--pink">M</span>
          <span>23 listening now</span>
        </motion.div>
      </div>

      <div className="auth-visual-copy">
        <p className="auth-eyebrow"><Radio size={13} /> Social listening, reimagined</p>
        <h1>
          Your music.<br /><span>Your people.</span><br />Your frequency.
        </h1>
        <p className="auth-description">
          Create a room, press play, and turn up the connection with people who get it.
        </p>
        <div className="auth-social-proof">
          <div className="auth-proof-avatars" aria-hidden="true">
            <span className="auth-avatar auth-avatar--cyan">J</span>
            <span className="auth-avatar auth-avatar--pink">S</span>
            <span className="auth-avatar auth-avatar--violet">K</span>
            <span className="auth-avatar auth-avatar--more">+</span>
          </div>
          <span><Users size={14} /> Find your people in the room</span>
        </div>
      </div>
      <div className="auth-visual-footer"><Headphones size={14} /> Made for the moments between songs</div>
    </section>
  );
}
