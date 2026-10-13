const LOGO_COLLAGE = 'https://media.base44.com/images/public/6a58903ef53c14813718cf0c/99e9ff32c_collageLogo.png';
const LOGO_PAKAR = 'https://media.base44.com/images/public/6a58903ef53c14813718cf0c/99f592ea4_pakarLogo.png';

export default function Logos() {
  return (
    <div className="flex items-center gap-2">
      <img
        src={LOGO_COLLAGE}
        alt="המכללה הלאומית לאיתנות ישראלית"
        style={{ height: '44px', objectFit: 'contain' }}
      />
      <img
        src={LOGO_PAKAR}
        alt="פיקוד העורף"
        style={{ height: '44px', objectFit: 'contain' }}
      />
    </div>
  );
}