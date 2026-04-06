export const localeMap = {
  pt: 'pt-PT',
  en: 'en-US',
  fr: 'fr-FR'
};

export const languageOptions = [
  { value: 'pt', labelKey: 'language.pt' },
  { value: 'en', labelKey: 'language.en' },
  { value: 'fr', labelKey: 'language.fr' }
];

const translations = {
  pt: {
    app: {
      title: 'Luz do Dia',
      tagline: 'Observatório de luz para fotografia, meteo e terreno.'
    },
    language: {
      label: 'Idioma',
      pt: 'Português',
      en: 'Inglês',
      fr: 'Francês'
    },
    common: {
      live: 'Live',
      simulated: 'Simulado',
      offline: 'Offline',
      online: 'Online',
      estimated: 'Estimado',
      hours: 'h',
      minutes: 'min',
      score: 'Score',
      today: 'Hoje',
      tomorrow: 'Amanhã'
    },
    utility: {
      locating: 'A localizar',
      updated: 'Actualizado {time}',
      quickSimulation: 'Scene Lab',
      offlineReady: 'Offline pronto',
      cacheHint: 'Últimos dados guardados localmente.'
    },
    briefing: {
      title: 'Briefing Agora',
      score: 'Oportunidade',
      phase: 'Fase',
      state: 'Leitura',
      nextWindow: 'Melhor janela',
      cta: 'Acção',
      stateLine: '{weather} • luz {light}% • suavidade {softness}%',
      decisionNow: 'As condições estão fortes para {goal}.',
      decisionNext: 'A janela principal chega em {delta} ({window}).',
      decisionWeak: 'Não há janela forte nas próximas 12h. Mantém a leitura em observação.',
      windowWeak: 'Sem janela forte nas próximas 12h'
    },
    goals: {
      golden: {
        label: 'Golden',
        hint: 'Cor quente, transições suaves e céu com volume.'
      },
      portrait: {
        label: 'Retrato',
        hint: 'Pele limpa, contraste controlado e luz estável.'
      },
      landscape: {
        label: 'Paisagem',
        hint: 'Drama no céu, alcance tonal e direcção solar útil.'
      },
      long: {
        label: 'Longa Exposição',
        hint: 'Baixa luz, estabilidade e movimento com controlo.'
      },
      astro: {
        label: 'Nocturna / Astro',
        hint: 'Escuridão, pouca lua, poucas nuvens e baixa turbulência.'
      }
    },
    phase: {
      night: 'Noite',
      blueHour: 'Blue hour',
      goldenHour: 'Golden hour',
      morning: 'Manhã',
      solarPeak: 'Pico solar',
      afternoon: 'Tarde'
    },
    cta: {
      goNow: 'Sai agora',
      packNow: 'Prepara kit',
      scout: 'Vai reconhecer o local',
      wait: 'Espera pela próxima janela',
      tripod: 'Leva tripé e remoto',
      watchSky: 'Segue a evolução do céu'
    },
    timeline: {
      title: 'Timeline 12h',
      subtitle: 'Curva de oportunidade para o objetivo activo nas próximas 12 horas.',
      bestWindow: 'Melhor janela',
      noWindow: 'Sem pico forte',
      markers: {
        now: 'Agora',
        sunrise: 'Sunrise',
        sunset: 'Sunset'
      }
    },
    solar: {
      title: 'Painel Solar',
      subtitle: 'Arco do dia, fases úteis e comparação curta com amanhã.',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      noon: 'Solar noon',
      duration: 'Duração',
      tomorrow: 'Amanhã',
      daylightDelta: 'Diferença',
      windows: 'Janelas úteis',
      goldenAM: 'Golden AM',
      goldenPM: 'Golden PM',
      blueAM: 'Blue AM',
      bluePM: 'Blue PM'
    },
    metrics: {
      title: 'Métricas Pro',
      subtitle: 'Leitura rápida do carácter da luz e do risco técnico.',
      softness: 'Suavidade',
      softnessHint: 'Pele, gradientes, neblina e difusão.',
      hardLight: 'Luz dura',
      hardLightHint: 'Bordo, contraste e agressividade solar.',
      skyDrama: 'Drama do céu',
      skyDramaHint: 'Textura, volume e interesse direccional.',
      trend: 'Tendência',
      trendHint: 'Próximas 2 horas para o objetivo activo.',
      tripod: 'Risco de tripé',
      tripodHint: 'Margem de obturação e estabilidade.',
      rising: 'A subir',
      stable: 'Estável',
      falling: 'A cair'
    },
    alerts: {
      title: 'Centro de Alertas',
      subtitle: 'Regras locais por objetivo, threshold e tempo de antecedência.',
      master: 'Motor',
      active: 'Activo',
      inactive: 'Inactivo',
      permission: 'Permissão',
      unsupported: 'Este browser não suporta notificações.',
      requestPermission: 'Pedir permissão',
      presets: 'Presets',
      goalRule: 'Regra principal',
      goal: 'Objetivo',
      threshold: 'Threshold',
      lead: 'Antecedência',
      sunsetReminder: 'Aviso antes do sunset',
      sunsetLead: 'Minutos antes',
      lowLight: 'Aviso de luz fraca',
      lowLightThreshold: 'Limiar de luz',
      manualHint: 'Alertas não disparam quando a app está em Scene Lab.',
      notification: {
        goalTitle: 'Janela a chegar',
        goalBody: '{goal}: melhor janela em {lead}. Pico {score}.',
        sunsetTitle: 'Sunset a aproximar-se',
        sunsetBody: 'Faltam {lead} para o sunset.',
        lowLightTitle: 'A luz está a cair',
        lowLightBody: 'Luminosidade em {light}%. Pode ser tempo de rever o setup.'
      }
    },
    scene: {
      title: 'Scene Lab',
      subtitle: 'Simula hora local, nuvens e weather code. Tudo marcado como estimado.',
      live: 'Tempo real',
      simulated: 'Simulação',
      time: 'Hora',
      clouds: 'Nuvens',
      weather: 'Weather code',
      backToLive: 'Voltar ao live',
      estimated: 'Simulado: leitura estimada, não observada.'
    },
    insights: {
      title: 'Insights',
      astro: 'Astro Lite',
      todayTomorrow: 'Hoje vs Amanhã',
      setup: 'Packing / Setup',
      technical: 'Detalhes técnicos',
      moonPhase: 'Fase lunar',
      illumination: 'Iluminação lunar',
      darkness: 'Escuridão útil',
      todayPeak: 'Melhor hoje',
      tomorrowPeak: 'Melhor amanhã',
      daylightDelta: 'Variação de dia',
      sunshineBias: 'Bias de sol útil',
      tomorrowWeather: 'Amanhã',
      tomorrowTemperature: 'Temperatura',
      packing: 'Levar',
      settings: 'Setup',
      temperature: 'Temp.',
      feelsLike: 'Sensação',
      wind: 'Vento',
      precip: 'Chuva provável',
      weatherCode: 'Código',
      coordinates: 'Coordenadas',
      noTomorrow: 'Sem dados suficientes para comparar amanhã.'
    },
    weather: {
      clear: 'Céu limpo',
      mostlyClear: 'Maiormente limpo',
      partlyCloudy: 'Parcialmente nublado',
      overcast: 'Nublado',
      fog: 'Nevoeiro',
      drizzle: 'Chuvisco',
      lightRain: 'Chuva leve',
      moderateRain: 'Chuva moderada',
      heavyRain: 'Chuva forte',
      lightSnow: 'Neve leve',
      heavySnow: 'Neve forte',
      thunder: 'Trovoada'
    },
    moon: {
      newMoon: 'Lua nova',
      waxingCrescent: 'Lua crescente',
      firstQuarter: 'Quarto crescente',
      waxingGibbous: 'Quase cheia',
      fullMoon: 'Lua cheia',
      waningGibbous: 'Quase cheia minguante',
      lastQuarter: 'Quarto minguante',
      waningCrescent: 'Lua minguante'
    },
    score: {
      excellent: 'Excelente',
      strong: 'Forte',
      usable: 'Usável',
      marginal: 'Marginal',
      poor: 'Fraco'
    },
    hints: {
      tripod: 'Tripé sólido',
      remote: 'Disparo remoto ou temporizador',
      ndFilter: 'Filtro ND',
      rainCover: 'Protecção de chuva',
      microfiber: 'Pano microfibra',
      polarizer: 'Polarizador',
      diffuser: 'Difusor',
      reflector: 'Reflector pequeno',
      headlamp: 'Frontal com luz vermelha',
      warmLayers: 'Camada extra',
      battery: 'Bateria extra',
      bagWeight: 'Peso para o tripé'
    },
    setup: {
      protectHighlights: 'Protege highlights: começa em -0.3 a -1 EV.',
      wideOpen: 'Abre entre f/1.8 e f/2.8 se precisares de margem.',
      lowIso: 'Mantém ISO baixo e deixa a luz definir o ritmo.',
      stabilizeShot: 'Estabiliza, respira e revê micro-movimento.',
      shadeOrBacklight: 'Procura sombra aberta ou usa contra-luz controlada.',
      bracketFrames: 'Considera bracketing para segurar o céu.',
      slowShutter: 'Trabalha com obturação lenta e atraso no disparo.',
      manualFocusInfinity: 'Foco manual em infinito com confirmação no ecrã.'
    }
  },
  en: {
    app: {
      title: 'Daylight',
      tagline: 'Light observatory for photography, weather, and field work.'
    },
    language: {
      label: 'Language',
      pt: 'Portuguese',
      en: 'English',
      fr: 'French'
    },
    common: {
      live: 'Live',
      simulated: 'Simulated',
      offline: 'Offline',
      online: 'Online',
      estimated: 'Estimated',
      hours: 'h',
      minutes: 'min',
      score: 'Score',
      today: 'Today',
      tomorrow: 'Tomorrow'
    },
    utility: {
      locating: 'Locating',
      updated: 'Updated {time}',
      quickSimulation: 'Scene Lab',
      offlineReady: 'Offline ready',
      cacheHint: 'Last successful data kept locally.'
    },
    briefing: {
      title: 'Now Briefing',
      score: 'Opportunity',
      phase: 'Phase',
      state: 'Read',
      nextWindow: 'Best window',
      cta: 'Action',
      stateLine: '{weather} • light {light}% • softness {softness}%',
      decisionNow: 'Conditions are strong for {goal}.',
      decisionNext: 'Primary window lands in {delta} ({window}).',
      decisionWeak: 'No strong window in the next 12 hours. Keep tracking the read.',
      windowWeak: 'No strong window in the next 12h'
    },
    goals: {
      golden: {
        label: 'Golden',
        hint: 'Warm colour, smooth roll-off, and layered sky.'
      },
      portrait: {
        label: 'Portrait',
        hint: 'Clean skin, controlled contrast, and stable light.'
      },
      landscape: {
        label: 'Landscape',
        hint: 'Sky drama, tonal range, and useful solar direction.'
      },
      long: {
        label: 'Long Exposure',
        hint: 'Low light, stability, and movement with control.'
      },
      astro: {
        label: 'Night / Astro',
        hint: 'Dark sky, low moon, low cloud, and calm air.'
      }
    },
    phase: {
      night: 'Night',
      blueHour: 'Blue hour',
      goldenHour: 'Golden hour',
      morning: 'Morning',
      solarPeak: 'Solar peak',
      afternoon: 'Afternoon'
    },
    cta: {
      goNow: 'Move now',
      packNow: 'Pack the kit',
      scout: 'Scout the scene',
      wait: 'Wait for the next window',
      tripod: 'Bring tripod and remote',
      watchSky: 'Track the sky'
    },
    timeline: {
      title: '12h Timeline',
      subtitle: 'Opportunity curve for the active goal across the next 12 hours.',
      bestWindow: 'Best window',
      noWindow: 'No strong peak',
      markers: {
        now: 'Now',
        sunrise: 'Sunrise',
        sunset: 'Sunset'
      }
    },
    solar: {
      title: 'Solar Panel',
      subtitle: 'Day arc, useful phase windows, and a short look at tomorrow.',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      noon: 'Solar noon',
      duration: 'Duration',
      tomorrow: 'Tomorrow',
      daylightDelta: 'Delta',
      windows: 'Useful windows',
      goldenAM: 'Golden AM',
      goldenPM: 'Golden PM',
      blueAM: 'Blue AM',
      bluePM: 'Blue PM'
    },
    metrics: {
      title: 'Pro Metrics',
      subtitle: 'Fast read on light character and technical risk.',
      softness: 'Softness',
      softnessHint: 'Skin, gradients, haze, and diffusion.',
      hardLight: 'Hard light',
      hardLightHint: 'Edges, contrast, and solar bite.',
      skyDrama: 'Sky drama',
      skyDramaHint: 'Texture, volume, and directional interest.',
      trend: 'Trend',
      trendHint: 'Next 2 hours for the active goal.',
      tripod: 'Tripod risk',
      tripodHint: 'Shutter margin and stability risk.',
      rising: 'Rising',
      stable: 'Stable',
      falling: 'Falling'
    },
    alerts: {
      title: 'Alerts Center',
      subtitle: 'Local rules by goal, threshold, and lead time.',
      master: 'Engine',
      active: 'Active',
      inactive: 'Inactive',
      permission: 'Permission',
      unsupported: 'This browser does not support notifications.',
      requestPermission: 'Request permission',
      presets: 'Presets',
      goalRule: 'Primary rule',
      goal: 'Goal',
      threshold: 'Threshold',
      lead: 'Lead time',
      sunsetReminder: 'Warn before sunset',
      sunsetLead: 'Minutes before',
      lowLight: 'Low light warning',
      lowLightThreshold: 'Light threshold',
      manualHint: 'Alerts do not fire while the app is in Scene Lab.',
      notification: {
        goalTitle: 'Window incoming',
        goalBody: '{goal}: best window in {lead}. Peak {score}.',
        sunsetTitle: 'Sunset is approaching',
        sunsetBody: '{lead} until sunset.',
        lowLightTitle: 'Light is dropping',
        lowLightBody: 'Ambient light is now {light}%. Re-check your setup.'
      }
    },
    scene: {
      title: 'Scene Lab',
      subtitle: 'Simulate local time, clouds, and weather code. Always marked as estimated.',
      live: 'Live',
      simulated: 'Simulation',
      time: 'Time',
      clouds: 'Clouds',
      weather: 'Weather code',
      backToLive: 'Back to live',
      estimated: 'Simulated: this read is estimated, not observed.'
    },
    insights: {
      title: 'Insights',
      astro: 'Astro Lite',
      todayTomorrow: 'Today vs Tomorrow',
      setup: 'Packing / Setup',
      technical: 'Technical details',
      moonPhase: 'Moon phase',
      illumination: 'Moon illumination',
      darkness: 'Useful darkness',
      todayPeak: 'Best today',
      tomorrowPeak: 'Best tomorrow',
      daylightDelta: 'Daylight delta',
      sunshineBias: 'Usable sun bias',
      tomorrowWeather: 'Tomorrow',
      tomorrowTemperature: 'Temperature',
      packing: 'Pack',
      settings: 'Setup',
      temperature: 'Temp.',
      feelsLike: 'Feels like',
      wind: 'Wind',
      precip: 'Rain chance',
      weatherCode: 'Code',
      coordinates: 'Coordinates',
      noTomorrow: 'Not enough data to compare tomorrow yet.'
    },
    weather: {
      clear: 'Clear sky',
      mostlyClear: 'Mostly clear',
      partlyCloudy: 'Partly cloudy',
      overcast: 'Overcast',
      fog: 'Fog',
      drizzle: 'Drizzle',
      lightRain: 'Light rain',
      moderateRain: 'Moderate rain',
      heavyRain: 'Heavy rain',
      lightSnow: 'Light snow',
      heavySnow: 'Heavy snow',
      thunder: 'Thunderstorm'
    },
    moon: {
      newMoon: 'New moon',
      waxingCrescent: 'Waxing crescent',
      firstQuarter: 'First quarter',
      waxingGibbous: 'Waxing gibbous',
      fullMoon: 'Full moon',
      waningGibbous: 'Waning gibbous',
      lastQuarter: 'Last quarter',
      waningCrescent: 'Waning crescent'
    },
    score: {
      excellent: 'Excellent',
      strong: 'Strong',
      usable: 'Usable',
      marginal: 'Marginal',
      poor: 'Weak'
    },
    hints: {
      tripod: 'Solid tripod',
      remote: 'Remote trigger or self timer',
      ndFilter: 'ND filter',
      rainCover: 'Rain cover',
      microfiber: 'Microfiber cloth',
      polarizer: 'Polariser',
      diffuser: 'Diffuser',
      reflector: 'Small reflector',
      headlamp: 'Headlamp with red mode',
      warmLayers: 'Warm layer',
      battery: 'Spare battery',
      bagWeight: 'Tripod bag weight'
    },
    setup: {
      protectHighlights: 'Protect highlights: start around -0.3 to -1 EV.',
      wideOpen: 'Open up to f/1.8-f/2.8 when you need margin.',
      lowIso: 'Keep ISO low and let the light set the pace.',
      stabilizeShot: 'Stabilise, breathe, and check micro-shake.',
      shadeOrBacklight: 'Look for open shade or controlled backlight.',
      bracketFrames: 'Consider bracketing to hold the sky.',
      slowShutter: 'Work with a slow shutter and delayed release.',
      manualFocusInfinity: 'Set manual focus near infinity and confirm on screen.'
    }
  },
  fr: {
    app: {
      title: 'Lumière du Jour',
      tagline: 'Observatoire de lumière pour photo, météo et terrain.'
    },
    language: {
      label: 'Langue',
      pt: 'Portugais',
      en: 'Anglais',
      fr: 'Français'
    },
    common: {
      live: 'Live',
      simulated: 'Simulé',
      offline: 'Hors ligne',
      online: 'En ligne',
      estimated: 'Estimé',
      hours: 'h',
      minutes: 'min',
      score: 'Score',
      today: 'Aujourd’hui',
      tomorrow: 'Demain'
    },
    utility: {
      locating: 'Localisation',
      updated: 'Mis à jour {time}',
      quickSimulation: 'Scene Lab',
      offlineReady: 'Offline prêt',
      cacheHint: 'Dernières données conservées localement.'
    },
    briefing: {
      title: 'Briefing Maintenant',
      score: 'Opportunité',
      phase: 'Phase',
      state: 'Lecture',
      nextWindow: 'Meilleure fenêtre',
      cta: 'Action',
      stateLine: '{weather} • lumière {light}% • douceur {softness}%',
      decisionNow: 'Les conditions sont fortes pour {goal}.',
      decisionNext: 'La fenêtre principale arrive dans {delta} ({window}).',
      decisionWeak: 'Pas de fenêtre forte dans les 12 prochaines heures. Continue la lecture.',
      windowWeak: 'Pas de pic fort sur 12h'
    },
    goals: {
      golden: {
        label: 'Golden',
        hint: 'Couleur chaude, dégradés doux et ciel structuré.'
      },
      portrait: {
        label: 'Portrait',
        hint: 'Peau propre, contraste maîtrisé et lumière stable.'
      },
      landscape: {
        label: 'Paysage',
        hint: 'Ciel dramatique, latitude tonale et direction solaire utile.'
      },
      long: {
        label: 'Pose Longue',
        hint: 'Faible lumière, stabilité et mouvement maîtrisé.'
      },
      astro: {
        label: 'Nuit / Astro',
        hint: 'Ciel sombre, lune faible, peu de nuages et air calme.'
      }
    },
    phase: {
      night: 'Nuit',
      blueHour: 'Heure bleue',
      goldenHour: 'Golden hour',
      morning: 'Matin',
      solarPeak: 'Pic solaire',
      afternoon: 'Après-midi'
    },
    cta: {
      goNow: 'Bouge maintenant',
      packNow: 'Prépare le kit',
      scout: 'Repère la scène',
      wait: 'Attends la prochaine fenêtre',
      tripod: 'Prends trépied et télécommande',
      watchSky: 'Surveille le ciel'
    },
    timeline: {
      title: 'Timeline 12h',
      subtitle: 'Courbe d’opportunité pour l’objectif actif sur les 12 prochaines heures.',
      bestWindow: 'Meilleure fenêtre',
      noWindow: 'Pas de pic fort',
      markers: {
        now: 'Maintenant',
        sunrise: 'Lever',
        sunset: 'Coucher'
      }
    },
    solar: {
      title: 'Panneau Solaire',
      subtitle: 'Arc du jour, fenêtres utiles et regard court vers demain.',
      sunrise: 'Lever',
      sunset: 'Coucher',
      noon: 'Midi solaire',
      duration: 'Durée',
      tomorrow: 'Demain',
      daylightDelta: 'Écart',
      windows: 'Fenêtres utiles',
      goldenAM: 'Golden AM',
      goldenPM: 'Golden PM',
      blueAM: 'Blue AM',
      bluePM: 'Blue PM'
    },
    metrics: {
      title: 'Mesures Pro',
      subtitle: 'Lecture rapide du caractère de la lumière et du risque technique.',
      softness: 'Douceur',
      softnessHint: 'Peau, dégradés, brume et diffusion.',
      hardLight: 'Lumière dure',
      hardLightHint: 'Bords, contraste et morsure solaire.',
      skyDrama: 'Drame du ciel',
      skyDramaHint: 'Texture, volume et intérêt directionnel.',
      trend: 'Tendance',
      trendHint: 'Les 2 prochaines heures pour l’objectif actif.',
      tripod: 'Risque trépied',
      tripodHint: 'Marge de vitesse et stabilité.',
      rising: 'En hausse',
      stable: 'Stable',
      falling: 'En baisse'
    },
    alerts: {
      title: 'Centre d’Alertes',
      subtitle: 'Règles locales par objectif, seuil et anticipation.',
      master: 'Moteur',
      active: 'Actif',
      inactive: 'Inactif',
      permission: 'Permission',
      unsupported: 'Ce navigateur ne supporte pas les notifications.',
      requestPermission: 'Demander la permission',
      presets: 'Presets',
      goalRule: 'Règle principale',
      goal: 'Objectif',
      threshold: 'Seuil',
      lead: 'Anticipation',
      sunsetReminder: 'Alerte avant coucher',
      sunsetLead: 'Minutes avant',
      lowLight: 'Alerte basse lumière',
      lowLightThreshold: 'Seuil de lumière',
      manualHint: 'Les alertes ne se déclenchent pas pendant Scene Lab.',
      notification: {
        goalTitle: 'Fenêtre imminente',
        goalBody: '{goal} : meilleure fenêtre dans {lead}. Pic {score}.',
        sunsetTitle: 'Coucher proche',
        sunsetBody: '{lead} avant le coucher.',
        lowLightTitle: 'La lumière baisse',
        lowLightBody: 'La lumière ambiante est à {light}%. Vérifie le setup.'
      }
    },
    scene: {
      title: 'Scene Lab',
      subtitle: 'Simule heure locale, nuages et weather code. Toujours marqué comme estimé.',
      live: 'Live',
      simulated: 'Simulation',
      time: 'Heure',
      clouds: 'Nuages',
      weather: 'Weather code',
      backToLive: 'Retour au live',
      estimated: 'Simulé : lecture estimée, non observée.'
    },
    insights: {
      title: 'Insights',
      astro: 'Astro Lite',
      todayTomorrow: 'Aujourd’hui vs Demain',
      setup: 'Packing / Setup',
      technical: 'Détails techniques',
      moonPhase: 'Phase lunaire',
      illumination: 'Éclairage lunaire',
      darkness: 'Obscurité utile',
      todayPeak: 'Meilleur aujourd’hui',
      tomorrowPeak: 'Meilleur demain',
      daylightDelta: 'Variation du jour',
      sunshineBias: 'Biais de soleil utile',
      tomorrowWeather: 'Demain',
      tomorrowTemperature: 'Température',
      packing: 'Emporter',
      settings: 'Setup',
      temperature: 'Temp.',
      feelsLike: 'Ressenti',
      wind: 'Vent',
      precip: 'Pluie probable',
      weatherCode: 'Code',
      coordinates: 'Coordonnées',
      noTomorrow: 'Pas assez de données pour comparer demain.'
    },
    weather: {
      clear: 'Ciel clair',
      mostlyClear: 'Plutôt dégagé',
      partlyCloudy: 'Partiellement nuageux',
      overcast: 'Couvert',
      fog: 'Brouillard',
      drizzle: 'Bruine',
      lightRain: 'Pluie légère',
      moderateRain: 'Pluie modérée',
      heavyRain: 'Pluie forte',
      lightSnow: 'Neige légère',
      heavySnow: 'Neige forte',
      thunder: 'Orage'
    },
    moon: {
      newMoon: 'Nouvelle lune',
      waxingCrescent: 'Premier croissant',
      firstQuarter: 'Premier quartier',
      waxingGibbous: 'Gibbeuse croissante',
      fullMoon: 'Pleine lune',
      waningGibbous: 'Gibbeuse décroissante',
      lastQuarter: 'Dernier quartier',
      waningCrescent: 'Dernier croissant'
    },
    score: {
      excellent: 'Excellent',
      strong: 'Fort',
      usable: 'Utilisable',
      marginal: 'Limite',
      poor: 'Faible'
    },
    hints: {
      tripod: 'Trépied solide',
      remote: 'Déclencheur ou retardateur',
      ndFilter: 'Filtre ND',
      rainCover: 'Protection pluie',
      microfiber: 'Chiffon microfibre',
      polarizer: 'Polariseur',
      diffuser: 'Diffuseur',
      reflector: 'Petit réflecteur',
      headlamp: 'Lampe frontale rouge',
      warmLayers: 'Couche chaude',
      battery: 'Batterie de secours',
      bagWeight: 'Poids pour le trépied'
    },
    setup: {
      protectHighlights: 'Protège les hautes lumières : commence vers -0.3 à -1 EV.',
      wideOpen: 'Ouvre vers f/1.8-f/2.8 si tu as besoin de marge.',
      lowIso: 'Garde un ISO bas et laisse la lumière rythmer.',
      stabilizeShot: 'Stabilise, respire et vérifie les micro-vibrations.',
      shadeOrBacklight: 'Cherche une ombre ouverte ou un contre-jour contrôlé.',
      bracketFrames: 'Pense au bracketing pour tenir le ciel.',
      slowShutter: 'Travaille avec une vitesse lente et un déclenchement différé.',
      manualFocusInfinity: 'Passe en mise au point manuelle près de l’infini et confirme à l’écran.'
    }
  }
};

function getValueFromPath(source, path) {
  return path.split('.').reduce((current, part) => (current && current[part] !== undefined ? current[part] : undefined), source);
}

function interpolate(value, variables) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\{(\w+)\}/g, (_, key) => (variables[key] !== undefined ? variables[key] : `{${key}}`));
}

export function createTranslator(lang) {
  const activePack = translations[lang] || translations.pt;

  return function translate(path, variables = {}) {
    const direct = getValueFromPath(activePack, path);
    const fallback = getValueFromPath(translations.pt, path);
    return interpolate(direct !== undefined ? direct : fallback !== undefined ? fallback : path, variables);
  };
}