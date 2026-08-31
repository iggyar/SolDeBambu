import {Star} from 'lucide-react';

export function Estrellas({cantidad = 5, tamano = 14}: {cantidad?: number; tamano?: number}) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${cantidad} de 5 estrellas`}>
      {Array.from({length: 5}, (_, i) => (
        <Star
          key={i}
          size={tamano}
          strokeWidth={0}
          className={i < cantidad ? 'fill-[#F2A93B]' : 'fill-bruma-3/30'}
        />
      ))}
    </div>
  );
}
