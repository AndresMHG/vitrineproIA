<template>
  <div :class="$style.profileContent">
    <div :class="$style.container">
      <!-- Tabs Navigation -->
      <nav :class="$style.tabs">
        <button
          :class="[$style.tab, { [$style.activeTab]: activeTab === 'all' }]"
          @click="activeTab = 'all'"
        >
          Todos
        </button>
        <button
          v-if="articles.length > 0"
          :class="[$style.tab, { [$style.activeTab]: activeTab === 'articles' }]"
          @click="activeTab = 'articles'"
        >
          Artigos <span :class="$style.count">{{articles.length}}</span>
        </button>
        <button
          v-if="projects.length > 0"
          :class="[$style.tab, { [$style.activeTab]: activeTab === 'projects' }]"
          @click="activeTab = 'projects'"
        >
          Projetos <span :class="$style.count">{{projects.length}}</span>
        </button>
        <button
          v-if="events.length > 0"
          :class="[$style.tab, { [$style.activeTab]: activeTab === 'events' }]"
          @click="activeTab = 'events'"
        >
          Eventos <span :class="$style.count">{{events.length}}</span>
        </button>
        <button
          :class="[$style.tab, { [$style.activeTab]: activeTab === 'about' }]"
          @click="activeTab = 'about'"
        >
          Sobre
        </button>
      </nav>

      <!-- Content Grid - Behance Style -->
      <div v-if="activeTab !== 'about'" :class="$style.grid">
        <!-- Articles -->
        <a
          v-for="article in filteredArticles"
          :key="`article-${article.id}`"
          :href="`/artigo/${article.id}`"
          :class="$style.gridItem"
        >
          <div :class="$style.imageWrapper">
            <img :src="article.coverImage" :alt="article.title" />
            <div :class="$style.overlay">
              <span :class="$style.category">Artigo</span>
            </div>
          </div>
          <div :class="$style.itemContent">
            <h3 :class="$style.itemTitle">{{ article.title }}</h3>
            <p :class="$style.itemDescription">{{ article.description }}</p>
            <div :class="$style.itemMeta">
              <span>{{ formatDate(article.date) }}</span>
              <span class="separator">•</span>
              <span>{{ article.readTime }}</span>
            </div>
          </div>
        </a>

        <!-- Projects -->
        <a
          v-for="project in filteredProjects"
          :key="`project-${project.id}`"
          :href="`/projeto/${project.id}`"
          :class="$style.gridItem"
        >
          <div :class="$style.imageWrapper">
            <img :src="project.coverImage" :alt="project.title" />
            <div :class="$style.overlay">
              <span :class="$style.category">Projeto</span>
            </div>
          </div>
          <div :class="$style.itemContent">
            <h3 :class="$style.itemTitle">{{ project.title }}</h3>
            <p :class="$style.itemDescription">{{ project.description }}</p>
            <div :class="$style.itemMeta">
              <span :class="[$style.status, project.status === 'Concluído' ? $style.completed : $style.ongoing]">
                {{ project.status }}
              </span>
              <span class="separator">•</span>
              <span>{{ project.year }}</span>
            </div>
          </div>
        </a>

        <!-- Events -->
        <a
          v-for="event in filteredEvents"
          :key="`event-${event.id}`"
          :href="`/evento/${event.id}`"
          :class="$style.gridItem"
        >
          <div :class="$style.imageWrapper">
            <img :src="event.coverImage" :alt="event.title" />
            <div :class="$style.overlay">
              <span :class="[$style.category, $style.eventCategory]">Evento</span>
            </div>
          </div>
          <div :class="$style.itemContent">
            <h3 :class="$style.itemTitle">{{ event.title }}</h3>
            <p :class="$style.itemDescription">{{ event.description }}</p>
            <div :class="$style.itemMeta">
              <span>{{ formatDate(event.date) }}</span>
              <span class="separator">•</span>
              <span>{{ event.location }}</span>
            </div>
          </div>
        </a>
      </div>

      <!-- About Tab -->
      <div v-else :class="$style.aboutSection">
        <div :class="$style.aboutGrid">
          <div :class="$style.aboutCard">
            <h2>Sobre</h2>
            <p :class="$style.bio">{{ profile.bio }}</p>
          </div>

          <div :class="$style.aboutCard">
            <h3>Contato</h3>
            <div :class="$style.contactList">
              <a :href="`mailto:${profile.email}`" :class="$style.contactItem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                {{ profile.email }}
              </a>
              <a v-if="profile.phone" :href="`tel:${profile.phone}`" :class="$style.contactItem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                {{ profile.phone }}
              </a>
            </div>
          </div>

          <div v-if="profile.social" :class="$style.aboutCard">
            <h3>Redes Sociais</h3>
            <div :class="$style.socialGrid">
              <a v-if="profile.social.linkedin" :href="profile.social.linkedin" target="_blank" :class="$style.socialButton">
                LinkedIn
              </a>
              <a v-if="profile.social.github" :href="profile.social.github" target="_blank" :class="$style.socialButton">
                GitHub
              </a>
              <a v-if="profile.social.twitter" :href="profile.social.twitter" target="_blank" :class="$style.socialButton">
                Twitter
              </a>
              <a v-if="profile.social.instagram" :href="profile.social.instagram" target="_blank" :class="$style.socialButton">
                Instagram
              </a>
              <a v-if="profile.social.behance" :href="profile.social.behance" target="_blank" :class="$style.socialButton">
                Behance
              </a>
              <a v-if="profile.social.dribbble" :href="profile.social.dribbble" target="_blank" :class="$style.socialButton">
                Dribbble
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import articlesData from '../data/articles.json';
import projectsData from '../data/projects.json';
import eventsData from '../data/events.json';

interface Profile {
  slug: string;
  bio: string;
  email: string;
  phone?: string;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    behance?: string;
    dribbble?: string;
  };
}

interface Props {
  profile: Profile;
}

const props = defineProps<Props>();

const activeTab = ref('all');

// Filter content by author
const articles = computed(() =>
  articlesData.articles.filter(a => a.authorSlug === props.profile.slug)
);

const projects = computed(() =>
  projectsData.projects.filter(p => p.authorSlug === props.profile.slug)
);

const events = computed(() =>
  eventsData.events.filter(e => e.authorSlug === props.profile.slug)
);

// Filtered content based on active tab
const filteredArticles = computed(() =>
  activeTab.value === 'all' || activeTab.value === 'articles' ? articles.value : []
);

const filteredProjects = computed(() =>
  activeTab.value === 'all' || activeTab.value === 'projects' ? projects.value : []
);

const filteredEvents = computed(() =>
  activeTab.value === 'all' || activeTab.value === 'events' ? events.value : []
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>

<style module>
.profileContent {
  padding: 0 0 var(--spacing-4xl);
  background-color: #fafafa;
  min-height: 60vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-2xl);
}

/* Tabs */
.tabs {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-2xl) 0;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: var(--spacing-3xl);
  overflow-x: auto;
}

.tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-lg);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tab:hover {
  color: var(--primary);
  background-color: rgba(37, 99, 235, 0.05);
}

.activeTab {
  color: var(--primary);
  background-color: rgba(37, 99, 235, 0.1);
}

.count {
  font-size: var(--text-xs);
  background-color: rgba(37, 99, 235, 0.2);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

/* Grid - Behance Style */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-2xl);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gridItem {
  background-color: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  text-decoration: none;
  transition: all var(--transition-base);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.gridItem:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.imageWrapper {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background-color: var(--bg-dark);
}

.imageWrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gridItem:hover .imageWrapper img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-lg);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.gridItem:hover .overlay {
  opacity: 1;
}

.category {
  font-size: var(--text-xs);
  font-weight: 700;
  color: white;
  background-color: var(--primary);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.eventCategory {
  background-color: var(--accent);
}

.itemContent {
  padding: var(--spacing-lg);
}

.itemTitle {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--leading-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.itemDescription {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-md) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.itemMeta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.itemMeta :global(.separator) {
  color: var(--border);
}

.status {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.completed {
  background-color: #d1fae5;
  color: #065f46;
}

.ongoing {
  background-color: #dbeafe;
  color: #1e40af;
}

/* About Section */
.aboutSection {
  animation: fadeIn 0.4s ease-out;
}

.aboutGrid {
  display: grid;
  gap: var(--spacing-lg);
  max-width: 800px;
}

.aboutCard {
  background-color: white;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.aboutCard h2 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.aboutCard h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.bio {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin: 0;
}

.contactList {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.contactItem {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
  padding: var(--spacing-xs) 0;
}

.contactItem:hover {
  color: var(--primary);
}

.contactItem svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.socialGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-sm);
}

.socialButton {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  color: var(--primary);
  font-size: var(--text-sm);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.socialButton:hover {
  background-color: var(--primary);
  color: white;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-lg);
  }

  .grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .imageWrapper {
    height: 220px;
  }

  .tabs {
    padding: var(--spacing-lg) 0;
  }

  .socialGrid {
    grid-template-columns: 1fr;
  }
}
</style>
