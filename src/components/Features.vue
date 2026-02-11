<template>
  <section id="recursos" :class="$style.features">
    <div class="container">
      <div :class="$style.header">
        <h2 :class="$style.title">Recursos Profissionais Completos</h2>
        <p :class="$style.subtitle">
          Tudo que você precisa para criar um portfólio profissional impressionante
        </p>
      </div>

      <div :class="$style.grid">
        <div v-for="feature in features" :key="feature.id" :class="$style.card">
          <div :class="$style.icon" v-html="feature.icon"></div>
          <h3 :class="$style.cardTitle">{{ feature.title }}</h3>
          <p :class="$style.cardDescription">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Portfólio Profissional',
    description: 'Mostre suas habilidades, experiências e conquistas de forma organizada e profissional.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 7h-9M14 17H5m14-7a3 3 0 11-6 0 3 3 0 016 0zM9 17a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>`
  },
  {
    id: 2,
    title: 'Artigos & Eventos',
    description: 'Publique conteúdo relevante e divulgue seus eventos para aumentar sua visibilidade.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
    </svg>`
  },
  {
    id: 3,
    title: 'Serviços & Casos',
    description: 'Apresente seus serviços oferecidos e mostre casos de sucesso e resultados obtidos.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>`
  },
  {
    id: 4,
    title: 'Visibilidade',
    description: 'Seja encontrado por clientes e oportunidades através do seu perfil público otimizado.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
    </svg>`
  }
];
</script>

<style module>
.features {
  padding: var(--spacing-4xl) 0;
  background-color: var(--bg-primary);
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}

.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.icon svg {
  width: 28px;
  height: 28px;
}

.cardTitle {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.cardDescription {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .features {
    padding: var(--spacing-3xl) 0;
  }

  .title {
    font-size: var(--text-3xl);
  }

  .subtitle {
    font-size: var(--text-lg);
  }

  .grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .card {
    padding: var(--spacing-xl);
  }
}
</style>
