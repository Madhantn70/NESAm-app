import image_8f3d0ac004495d3c0e7e72449327bab98eabdec9 from 'figma:asset/8f3d0ac004495d3c0e7e72449327bab98eabdec9.png'
import image_6115bab1a13fa7e95ff2da33f995fe73c04d61c6 from 'figma:asset/6115bab1a13fa7e95ff2da33f995fe73c04d61c6.png'
import nesamLogo from '@/imports/NESAm-logo.svg'
import irttaaLogo from '@/imports/IRTTAA-logo.svg'

export function Header() {
  return (
    <header className="w-full bg-white border-b border-border shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* NESAm Logo - Left */}
          <img 
            src={image_6115bab1a13fa7e95ff2da33f995fe73c04d61c6} 
            alt="NESAm" 
            className="h-12 w-auto object-contain"
          />
          
          {/* IRTT Alumni Association Logo - Right */}
          <img 
            src={image_8f3d0ac004495d3c0e7e72449327bab98eabdec9} 
            alt="IRTT Alumni Association" 
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
}