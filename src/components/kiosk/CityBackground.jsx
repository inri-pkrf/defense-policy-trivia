import { motion } from 'framer-motion';
import { BuildingWithLights, Car, Cloud, Person, Tree, Bus, Bird, BusStop, Mitgonit, ChildWithBackpack } from './shared/Figures';

export default function CityBackground() {
  return (
    <div dir="ltr" className="absolute inset-0 overflow-hidden">
      {/* Animated gradient sky */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(180deg, #C8E4FF 0%, #EAF5FF 40%, #F5FAFF 100%)',
            'linear-gradient(180deg, #B8D8FF 0%, #E0F0FF 40%, #F0F8FF 100%)',
            'linear-gradient(180deg, #C8E4FF 0%, #EAF5FF 40%, #F5FAFF 100%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Clouds - drifting across full width, spread across upper screen */}
      <motion.div className="absolute top-2" animate={{ x: ['-250px', '110vw'] }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}>
        <Cloud scale={2.5} />
      </motion.div>
      <motion.div className="absolute top-16" animate={{ x: ['-250px', '110vw'] }} transition={{ duration: 55, repeat: Infinity, ease: 'linear', delay: 8 }}>
        <Cloud scale={2.0} />
      </motion.div>
      <motion.div className="absolute top-8" animate={{ x: ['110vw', '-250px'] }} transition={{ duration: 50, repeat: Infinity, ease: 'linear', delay: 3 }}>
        <Cloud scale={1.8} />
      </motion.div>
      <motion.div className="absolute top-28" animate={{ x: ['-250px', '110vw'] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear', delay: 15 }}>
        <Cloud scale={2.3} />
      </motion.div>
      <motion.div className="absolute top-40" animate={{ x: ['110vw', '-250px'] }} transition={{ duration: 48, repeat: Infinity, ease: 'linear', delay: 20 }}>
        <Cloud scale={1.5} />
      </motion.div>
      <motion.div className="absolute top-4" animate={{ x: ['-250px', '110vw'] }} transition={{ duration: 65, repeat: Infinity, ease: 'linear', delay: 25 }}>
        <Cloud scale={1.9} />
      </motion.div>
      <motion.div className="absolute top-52" animate={{ x: ['110vw', '-250px'] }} transition={{ duration: 58, repeat: Infinity, ease: 'linear', delay: 12 }}>
        <Cloud scale={1.6} />
      </motion.div>
      <motion.div className="absolute top-72" animate={{ x: ['-250px', '110vw'] }} transition={{ duration: 52, repeat: Infinity, ease: 'linear', delay: 30 }}>
        <Cloud scale={1.4} />
      </motion.div>
      <motion.div className="absolute top-20" animate={{ x: ['110vw', '-250px'] }} transition={{ duration: 62, repeat: Infinity, ease: 'linear', delay: 6 }}>
        <Cloud scale={2.1} />
      </motion.div>
      <motion.div className="absolute top-44" animate={{ x: ['-250px', '110vw'] }} transition={{ duration: 54, repeat: Infinity, ease: 'linear', delay: 18 }}>
        <Cloud scale={1.3} />
      </motion.div>
      <motion.div className="absolute top-32" animate={{ x: ['110vw', '-250px'] }} transition={{ duration: 57, repeat: Infinity, ease: 'linear', delay: 32 }}>
        <Cloud scale={2.2} />
      </motion.div>
      <motion.div className="absolute top-64" animate={{ x: ['-250px', '110vw'] }} transition={{ duration: 63, repeat: Infinity, ease: 'linear', delay: 4 }}>
        <Cloud scale={1.5} />
      </motion.div>

      {/* Birds - flying across full width, spread across upper screen */}
      <motion.div className="absolute top-6" animate={{ x: ['-120px', '110vw'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: 2 }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={1.2} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-24" animate={{ x: ['-120px', '110vw'] }} transition={{ duration: 35, repeat: Infinity, ease: 'linear', delay: 12 }}>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={0.9} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-12" animate={{ x: ['110vw', '-120px'] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear', delay: 5 }}>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={1.0} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-48" animate={{ x: ['-120px', '110vw'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear', delay: 18 }}>
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={0.8} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-36" animate={{ x: ['110vw', '-120px'] }} transition={{ duration: 38, repeat: Infinity, ease: 'linear', delay: 22 }}>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={1.1} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-56" animate={{ x: ['-120px', '110vw'] }} transition={{ duration: 42, repeat: Infinity, ease: 'linear', delay: 28 }}>
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={0.95} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-16" animate={{ x: ['110vw', '-120px'] }} transition={{ duration: 36, repeat: Infinity, ease: 'linear', delay: 15 }}>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={0.85} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-64" animate={{ x: ['-120px', '110vw'] }} transition={{ duration: 44, repeat: Infinity, ease: 'linear', delay: 8 }}>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <Bird scale={1.05} />
        </motion.div>
      </motion.div>

      {/* Ground strip - taller for richer base */}
      <div className="absolute bottom-0 w-full h-20" style={{ background: 'linear-gradient(180deg, #D5DDE5 0%, #B8C5D0 100%)' }} />

      {/* Buildings - much taller and wider */}
      <div className="absolute bottom-20 w-full flex items-end justify-center gap-1 px-2">
        <BuildingWithLights width={75} height={180} color="#9BC1DE" seed={1} />
        <BuildingWithLights width={95} height={270} color="#7BA7CC" seed={2} />
        <BuildingWithLights width={85} height={220} color="#6B95C0" seed={3} />
        <BuildingWithLights width={110} height={320} color="#5A87B0" seed={4} />
        <BuildingWithLights width={80} height={200} color="#9BC1DE" seed={5} />
        <BuildingWithLights width={100} height={295} color="#7BA7CC" seed={6} />
        <BuildingWithLights width={90} height={255} color="#6B95C0" seed={7} />
        <BuildingWithLights width={75} height={190} color="#8FB8DD" seed={8} />
        <BuildingWithLights width={85} height={240} color="#7BA7CC" seed={9} />
        <BuildingWithLights width={70} height={160} color="#9BC1DE" seed={10} />
      </div>

      {/* Trees with gentle swaying - bigger */}
      <motion.div className="absolute bottom-20 left-[3%]" animate={{ rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: 'bottom center' }}>
        <Tree scale={1.7} />
      </motion.div>
      <motion.div className="absolute bottom-20 left-[19%]" animate={{ rotate: [1, -1, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: 'bottom center' }}>
        <Tree scale={1.3} />
      </motion.div>
      <motion.div className="absolute bottom-20 right-[21%]" animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: 'bottom center' }}>
        <Tree scale={1.5} />
      </motion.div>
      <motion.div className="absolute bottom-20 right-[4%]" animate={{ rotate: [1, -1.5, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: 'bottom center' }}>
        <Tree scale={1.4} />
      </motion.div>

      {/* Bus stop - bigger */}
      <div className="absolute bottom-20 left-[8%]"><BusStop scale={1.3} /></div>

      {/* Mitgonit - bigger */}
      <div className="absolute bottom-20 right-[10%]"><Mitgonit scale={1.3} /></div>

      {/* Cars - bigger via scale wrapper */}
      <motion.div className="absolute bottom-24 right-0" animate={{ x: ['100vw', '-250px'] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
        <div style={{ transform: 'scale(1.5)', transformOrigin: 'bottom right' }}>
          <Car color="#E74C3C" />
        </div>
      </motion.div>
      <motion.div className="absolute bottom-24 right-0" animate={{ x: ['100vw', '-250px'] }} transition={{ duration: 16, repeat: Infinity, ease: 'linear', delay: 5 }}>
        <div style={{ transform: 'scale(1.5)', transformOrigin: 'bottom right' }}>
          <Car color="#3498DB" />
        </div>
      </motion.div>

      {/* Bus - bigger via scale wrapper */}
      <motion.div className="absolute bottom-[82px] right-0" animate={{ x: ['100vw', '-300px'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear', delay: 9 }}>
        <div style={{ transform: 'scale(1.5)', transformOrigin: 'bottom right' }}>
          <Bus color="#F39C12" />
        </div>
      </motion.div>

      {/* Pedestrians - bigger */}
      <motion.div className="absolute bottom-24 left-[15%]" animate={{ x: [0, 100, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}>
        <Person pose="walking" shirt="#E74C3C" size={1.1} />
      </motion.div>
      <motion.div className="absolute bottom-24 right-[18%]" animate={{ x: [0, -80, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}>
        <Person pose="walking" shirt="#32C96A" size={1.0} />
      </motion.div>

      {/* Children with backpacks - bigger */}
      <motion.div className="absolute bottom-24 left-[30%]" animate={{ x: [0, 60, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <ChildWithBackpack scale={1.1} shirt="#9B59B6" />
      </motion.div>
      <motion.div className="absolute bottom-24 right-[30%]" animate={{ x: [0, -50, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
        <ChildWithBackpack scale={1.0} shirt="#E67E22" />
      </motion.div>
    </div>
  );
}