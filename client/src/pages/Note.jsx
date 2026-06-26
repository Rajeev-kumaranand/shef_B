import { useNoteContent } from '../hooks/useApi.js';
import FadeUp from '../components/animation/FadeUp.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Note.module.css';
import ceoImg from '../assets/babar-mia-logo.png';


export default function Note() {
  const { data: content, loading } = useNoteContent();

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--surface-primary)' }} />;

  const quoteText = content?.quote || "For us wellness is not aspirational—it is foundational.";
  
  const ceo = content?.ceo || {
    name: "BABAR MIA",
    title: "FOUNDER & CHIEF EXECUTIVE",
    bio: "A second generation entrepreneur, a self taught interior designer who predominantly started with making bespoke furniture and after a couple years of fair success and failure started construction and designing bespoke interior spaces."
  };

  const cpo = content?.cpo || {
    name: "Dr. SHASHANK KHARABANDA",
    title: "Co – FOUNDER & CHIEF PRODUCT OFFICER",
    bio: "Dr. Shashank Kharabanda is a distinguished medical professional with a robust foundation in medicine; he transitioned into wellness industry, aiming to bridge the gap between healthcare and wellness. Dr. Kharabanda combines medical expertise with aesthetic artistry for personalized care. He pioneered the use of advanced technologies like FUE hair transplants in India. He has received awards including the “He Came, He Saw, He Changed the Game” honor. His philosophy emphasizes holistic well-being and empowering clients with confidence. He is recognized as a visionary in the wellness and aesthetic industry. Dr. Kharabanda continues to innovate and inspire through quality, science-backed treatments. At shef&B he steers the nutrition development where he leads product strategy, R&D, product pipeline and innovation across the brand’s nutrition portfolio. With a strong foundation in science and applied nutrition, he brings a rigorous, evidence-led approach to product development. He oversees ingredient selection, formulation integrity, and quality standards, ensuring each product aligns with global best practices and evolving consumer expectations."
  };

  const company = content?.company || "shef&B is an Indian origin Nutrition Supplement company headquatered in Mumbai. We are a modern wellness company dedicated to making daily nutrition simple, accessible, and enjoyable. In today’s fast-paced world, maintaining a balanced diet and consistent nutrient intake can be challenging; shef&B bridges this gap by offering premium, science-backed nutritional supplements designed for everyday use. We are a science-backed daily nutrition brand created for people who want to take care of their health without confusion, complexity, or exaggerated claims. We develop clean, thoughtfully formulated supplements that support everyday nutritional needs — from energy and immunity to overall vitality. Every product is built around transparency, quality ingredients, and formulations that are easy to understand and easy to follow. The problem we set out to solve is simple: the supplement space is crowded, confusing, and often overpromising. shef&B cuts through that noise by offering clear, honest nutrition designed to fit seamlessly into real lives. Our approach is grounded in science, guided by restraint, and focused on consistency — because wellness isn’t about extremes, it’s about showing up every day.";

  return (
    <div className={styles.notePage}>
      <SEOManager pageKey="note" />
      
      <div className={styles.noteContainer}>
         <div className={styles.contentWrapper}>
            <div className={styles.leftContent}>
               <FadeUp>
                 <h1 className={styles.mainQuote}>{quoteText}</h1>
               </FadeUp>
               
               <FadeUp delay={0.2}>
                 <div className={styles.personBlock}>
                   <p className={styles.bioText}>{ceo.bio}</p>
                   <div className={styles.signatureInfo}>
                     {/* <h3 className={styles.personName}>{ceo.name}</h3> */}
                     <div className={styles.logo} ><img src={ceoImg} alt="" /></div>
                     <p className={styles.personTitle}>- {ceo.title}</p>
                   </div>
                 </div>
               </FadeUp>

               <FadeUp delay={0.4}>
                 <div className={styles.personBlock2}>
                   <p className={styles.bioText2}>{cpo.bio}</p>
                   <div className={styles.signatureInfo}>
                     <h3 className={styles.personName}>{cpo.name}</h3>
                     <p className={styles.personTitle}>- {cpo.title}</p>
                   </div>
                 </div>
               </FadeUp>
            </div>
         </div>
      </div>
      
      <div className={styles.companySection}>
        <div className={styles.narrowContainer}>
          <FadeUp delay={0.6}>
            <p className={styles.companyText}>{company}</p>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
