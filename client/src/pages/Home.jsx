import { useHomeContent } from '../hooks/useApi.js';
import { slidesData } from '../data/slidesData.js';
import HeroSection from '../components/home/HeroSection.jsx';
import StorySection from '../components/home/StorySection.jsx';
import VisionSection from '../components/home/VisionSection.jsx';
import FounderSection from '../components/home/FounderSection.jsx';
import ExperienceSection from '../components/home/ExperienceSection.jsx';
import GallerySection from '../components/home/GallerySection.jsx';
import JourneySection from '../components/home/JourneySection.jsx';
import ContactSection from '../components/home/ContactSection.jsx';
import SEOManager from '../components/common/SEOManager.jsx';

export default function Home() {
  const { data: content, loading: contentLoading } = useHomeContent();
  const loading = contentLoading;

  return (
    <div style={{ marginTop: '-80px' }}>
      <SEOManager pageKey="home" />
      <HeroSection content={content?.hero} slidesData={slidesData} loading={loading} />
      <StorySection content={content?.story} loading={loading} />
      <VisionSection content={content?.vision} slidesData={slidesData} loading={loading} />
      <FounderSection content={content?.founder} slidesData={slidesData} loading={loading} />
      <ExperienceSection content={content?.experience} slidesData={slidesData} loading={loading} />
      <GallerySection content={content?.gallery} slidesData={slidesData} loading={loading} />
      <JourneySection content={content?.journey} loading={loading} />
      <ContactSection content={content?.contact} loading={loading} />
    </div>
  );
}
