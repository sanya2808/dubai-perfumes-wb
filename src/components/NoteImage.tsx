import roseImg from '@/assets/notes/rose.png';
import oudImg from '@/assets/notes/oud.png';
import amberImg from '@/assets/notes/amber.png';
import jasmineImg from '@/assets/notes/jasmine.png';
import citrusImg from '@/assets/notes/citrus.png';
import sandalwoodImg from '@/assets/notes/sandalwood.png';
import muskImg from '@/assets/notes/musk.png';
import vanillaImg from '@/assets/notes/vanilla.png';
import saffronImg from '@/assets/notes/saffron.png';
import leatherImg from '@/assets/notes/leather.png';
import incenseImg from '@/assets/notes/incense.png';
import pepperImg from '@/assets/notes/pepper.png';
import lavenderImg from '@/assets/notes/lavender.png';
import cedarImg from '@/assets/notes/cedar.png';
import fruitImg from '@/assets/notes/fruit.png';
import spiceImg from '@/assets/notes/spice.png';

const noteImageMap: Record<string, string> = {
  rose: roseImg, 'dark rose': roseImg, gardenia: jasmineImg, tuberose: jasmineImg,
  jasmine: jasmineImg, 'jasmine sambac': jasmineImg, 'floral musk': jasmineImg, kewda: jasmineImg,
  oud: oudImg, 'smoky oud': oudImg, birch: oudImg,
  amber: amberImg, amberwood: amberImg, benzoin: amberImg, 'fir resin': amberImg, ambroxan: amberImg, honey: amberImg, cocoa: amberImg, 'tonka bean': amberImg,
  lemon: citrusImg, bergamot: citrusImg, neroli: citrusImg, orange: citrusImg,
  sandalwood: sandalwoodImg, 'creamy wood': sandalwoodImg,
  musk: muskImg, 'white musk': muskImg, 'powdery musk': muskImg, moss: muskImg, oakmoss: muskImg,
  vanilla: vanillaImg,
  saffron: saffronImg,
  leather: leatherImg,
  incense: incenseImg,
  pepper: pepperImg,
  lavender: lavenderImg, geranium: lavenderImg, violet: lavenderImg,
  cedar: cedarImg,
  pineapple: fruitImg, raspberry: fruitImg, almond: fruitImg, apple: fruitImg, peach: fruitImg, coffee: fruitImg,
  cardamom: spiceImg, ginger: spiceImg, nutmeg: spiceImg, mint: spiceImg, patchouli: spiceImg, cinnamon: spiceImg,
};

export const getNoteImage = (note: string): string => {
  const lower = note.toLowerCase();
  if (noteImageMap[lower]) return noteImageMap[lower];
  for (const [key, img] of Object.entries(noteImageMap)) {
    if (lower.includes(key)) return img;
  }
  return amberImg; // fallback
};

interface NoteImageProps {
  note: string;
  size?: number;
}

const NoteImage = ({ note, size = 24 }: NoteImageProps) => (
  <div
    className="rounded-full overflow-hidden flex-shrink-0"
    style={{
      width: size,
      height: size,
      border: '1.5px solid rgba(198,169,107,0.5)',
      boxShadow: '0 0 6px rgba(198,169,107,0.15)',
    }}
  >
    <img
      src={getNoteImage(note)}
      alt={note}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </div>
);

export default NoteImage;
