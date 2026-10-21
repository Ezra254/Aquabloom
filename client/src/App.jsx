import { About } from './components/About';
import { Contact } from './components/Contact';
import { FieldMedia } from './components/FieldMedia';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Impact } from './components/Impact';
import { Navbar } from './components/Navbar';
import { Services } from './components/Services';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <FieldMedia />
        <Impact />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
