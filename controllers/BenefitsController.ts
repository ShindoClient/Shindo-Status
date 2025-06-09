export const ALL_BENEFITS = [
  'Tag básica',
  'Tag especial no Discord',
  'Tag especial no jogo',
  'Funções administrativas',
  'Acesso a ferramentas exclusivas',
  'Acesso a eventos exclusivos',
  'Suporte prioritário',
  'Suporte dedicado',
  'Acesso ao servidor Discord',
  'Participação em eventos regulares',
  'Suporte da comunidade',
  'Capas exclusivas',
  'Capas customizadas',
];

export const BENEFIT_GROUPS = [
  ['Suporte prioritário', 'Suporte dedicado', 'Suporte da comunidade'],
  ['Capas exclusivas', 'Capas customizadas'],
];

export function getDisplayBenefits(label: string): string[] {
  switch (label) {
    case 'Staff':
      return [
        'Tag especial no Discord',
        'Tag especial no jogo',
        'Funções administrativas',
        'Acesso a ferramentas exclusivas',
        'Capas exclusivas',
        'Capas customizadas',
      ];
    case 'Diamond':
      return [
        'Tag especial no Discord',
        'Tag especial no jogo',
        'Acesso a eventos exclusivos',
        'Suporte prioritário',
        'Capas exclusivas',
        'Capas customizadas',
      ];
    case 'Gold':
      return [
        'Tag especial no Discord',
        'Tag especial no jogo',
        'Acesso a eventos exclusivos',
        'Suporte dedicado',
        'Capas exclusivas', // Capas customizadas NÃO entra aqui para aparecer X mark
      ];
    case 'Membro':
      return [
        'Tag básica',
        'Acesso ao servidor Discord',
        'Participação em eventos regulares',
        'Suporte da comunidade',
        // Não inclui 'Capas exclusivas' nem 'Capas customizadas' para aparecer X mark
      ];
    default:
      return [];
  }
}