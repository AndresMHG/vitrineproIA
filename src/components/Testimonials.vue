<template>
  <section id="exemplos" :class="$style.testimonials">
    <div class="container">
      <div :class="$style.header">
        <h2 :class="$style.title">Profissionais que Confiam no VitrinePro</h2>
        <p :class="$style.subtitle">
          Veja como profissionais de diversas áreas estão usando a plataforma
        </p>
      </div>

      <div :class="$style.carousel">
        <button
          :class="$style.navButton"
          @click="previous"
          aria-label="Anterior"
          :disabled="currentIndex === 0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div :class="$style.cardsContainer">
          <div
            :class="$style.cardsWrapper"
            :style="{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }"
          >
            <div
              v-for="testimonial in testimonials"
              :key="testimonial.id"
              :class="$style.card"
            >
              <div :class="$style.avatar">
                <span :class="$style.avatarText">{{ testimonial.initials }}</span>
              </div>
              <h3 :class="$style.name">{{ testimonial.name }}</h3>
              <p :class="$style.profession">{{ testimonial.profession }}</p>
              <p :class="$style.description">{{ testimonial.description }}</p>
              <a :href="`/perfil/${testimonial.slug}`" :class="$style.link">Ver Perfil →</a>
            </div>
          </div>
        </div>

        <button
          :class="$style.navButton"
          @click="next"
          aria-label="Próximo"
          :disabled="currentIndex >= testimonials.length - visibleCards"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div :class="$style.dots">
        <button
          v-for="(_, index) in Math.ceil(testimonials.length / visibleCards)"
          :key="index"
          :class="[$style.dot, { [$style.activeDot]: currentIndex === index }]"
          @click="goToSlide(index)"
          :aria-label="`Ir para slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Testimonial {
  id: number;
  name: string;
  profession: string;
  description: string;
  initials: string;
  slug: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Dra. Maria Silva',
    profession: 'Advogada Criminalista',
    description: 'Com o VitrinePro consegui organizar meu portfólio e aumentar minha visibilidade. Recebi mais contatos de clientes em potencial.',
    initials: 'MS',
    slug: 'maria-silva'
  },
  {
    id: 2,
    name: 'Dr. João Santos',
    profession: 'Médico Cardiologista',
    description: 'Plataforma excelente para divulgar meus artigos científicos e eventos. Muito profissional e fácil de usar.',
    initials: 'JS',
    slug: 'joao-santos'
  },
  {
    id: 3,
    name: 'Ana Costa',
    profession: 'Desenvolvedora Full Stack',
    description: 'Consegui mostrar todos os meus projetos e habilidades em um único lugar. O perfil ficou muito profissional.',
    initials: 'AC',
    slug: 'ana-costa'
  },
  {
    id: 4,
    name: 'Carlos Mendes',
    profession: 'Designer UX/UI',
    description: 'Interface intuitiva e resultado final impressionante. Recomendo para todos os profissionais.',
    initials: 'CM',
    slug: 'carlos-mendes'
  }
];

const currentIndex = ref(0);
const visibleCards = ref(3);

const updateVisibleCards = () => {
  if (window.innerWidth < 640) {
    visibleCards.value = 1;
  } else if (window.innerWidth < 1024) {
    visibleCards.value = 2;
  } else {
    visibleCards.value = 3;
  }
};

const next = () => {
  if (currentIndex.value < testimonials.length - visibleCards.value) {
    currentIndex.value++;
  }
};

const previous = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

onMounted(() => {
  updateVisibleCards();
  window.addEventListener('resize', updateVisibleCards);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCards);
});
</script>

<style module>
.testimonials {
  padding: var(--spacing-4xl) 0;
  background-color: var(--bg-primary);
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
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

.carousel {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.navButton {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--bg-primary);
  border: 2px solid var(--border);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.navButton:hover:not(:disabled) {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
}

.navButton:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.navButton svg {
  width: 24px;
  height: 24px;
}

.cardsContainer {
  flex: 1;
  overflow: hidden;
}

.cardsWrapper {
  display: flex;
  transition: transform var(--transition-slow);
  gap: var(--spacing-lg);
}

.card {
  flex: 0 0 calc(33.333% - var(--spacing-lg));
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
}

.card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
}

.avatarText {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: white;
}

.name {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.profession {
  font-size: var(--text-base);
  color: var(--primary);
  font-weight: 500;
  margin: 0;
}

.description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
  flex-grow: 1;
}

.link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--transition-fast);
  margin-top: var(--spacing-sm);
}

.link:hover {
  color: var(--primary-dark);
}

.dots {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--border);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.dot:hover {
  background-color: var(--primary-light);
}

.activeDot {
  background-color: var(--primary);
  width: 32px;
  border-radius: var(--radius-full);
}

/* Responsive */
@media (max-width: 1024px) {
  .card {
    flex: 0 0 calc(50% - var(--spacing-lg));
  }

  .navButton {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 640px) {
  .testimonials {
    padding: var(--spacing-3xl) 0;
  }

  .title {
    font-size: var(--text-3xl);
  }

  .subtitle {
    font-size: var(--text-lg);
  }

  .carousel {
    gap: var(--spacing-sm);
  }

  .card {
    flex: 0 0 100%;
  }

  .navButton {
    display: none;
  }
}
</style>
