<template>
  <div :class="$style.profileContent">
    <div class="container">
      <div :class="$style.layout">
        <!-- Sidebar -->
        <aside :class="$style.sidebar">
          <div :class="$style.card">
            <h3 :class="$style.cardTitle">Sobre</h3>
            <p :class="$style.bio">{{ profile.bio }}</p>
          </div>

          <div :class="$style.card">
            <h3 :class="$style.cardTitle">Contato</h3>
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

          <div v-if="profile.social" :class="$style.card">
            <h3 :class="$style.cardTitle">Redes Sociais</h3>
            <div :class="$style.socialList">
              <a v-if="profile.social.linkedin" :href="profile.social.linkedin" target="_blank" :class="$style.socialLink">
                LinkedIn
              </a>
              <a v-if="profile.social.github" :href="profile.social.github" target="_blank" :class="$style.socialLink">
                GitHub
              </a>
              <a v-if="profile.social.twitter" :href="profile.social.twitter" target="_blank" :class="$style.socialLink">
                Twitter
              </a>
              <a v-if="profile.social.instagram" :href="profile.social.instagram" target="_blank" :class="$style.socialLink">
                Instagram
              </a>
              <a v-if="profile.social.behance" :href="profile.social.behance" target="_blank" :class="$style.socialLink">
                Behance
              </a>
              <a v-if="profile.social.dribbble" :href="profile.social.dribbble" target="_blank" :class="$style.socialLink">
                Dribbble
              </a>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main :class="$style.main">
          <!-- Artigos -->
          <section v-if="profile.articles && profile.articles.length > 0" :class="$style.section">
            <h2 :class="$style.sectionTitle">Artigos</h2>
            <div :class="$style.grid">
              <article v-for="article in profile.articles" :key="article.id" :class="$style.articleCard">
                <div :class="$style.articleHeader">
                  <h3 :class="$style.articleTitle">{{ article.title }}</h3>
                  <span :class="$style.readTime">{{ article.readTime }}</span>
                </div>
                <p :class="$style.articleDescription">{{ article.description }}</p>
                <div :class="$style.articleFooter">
                  <span :class="$style.date">{{ formatDate(article.date) }}</span>
                  <a href="#" :class="$style.readMore">Ler mais →</a>
                </div>
              </article>
            </div>
          </section>

          <!-- Projetos -->
          <section v-if="profile.projects && profile.projects.length > 0" :class="$style.section">
            <h2 :class="$style.sectionTitle">Projetos</h2>
            <div :class="$style.grid">
              <article v-for="project in profile.projects" :key="project.id" :class="$style.projectCard">
                <div :class="$style.projectHeader">
                  <h3 :class="$style.projectTitle">{{ project.title }}</h3>
                  <span :class="[$style.status, project.status === 'Concluído' ? $style.statusCompleted : $style.statusOngoing]">
                    {{ project.status }}
                  </span>
                </div>
                <p :class="$style.projectDescription">{{ project.description }}</p>
                <div :class="$style.projectFooter">
                  <span :class="$style.year">{{ project.year }}</span>
                  <a v-if="project.link" :href="project.link" target="_blank" :class="$style.projectLink">
                    Ver projeto →
                  </a>
                </div>
              </article>
            </div>
          </section>

          <!-- Eventos -->
          <section v-if="profile.events && profile.events.length > 0" :class="$style.section">
            <h2 :class="$style.sectionTitle">Eventos</h2>
            <div :class="$style.grid">
              <article v-for="event in profile.events" :key="event.id" :class="$style.eventCard">
                <h3 :class="$style.eventTitle">{{ event.title }}</h3>
                <p :class="$style.eventDescription">{{ event.description }}</p>
                <div :class="$style.eventFooter">
                  <span :class="$style.eventDate">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{ formatDate(event.date) }}
                  </span>
                  <span :class="$style.eventLocation">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ event.location }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  year: string;
  link?: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
}

interface Profile {
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
  articles?: Article[];
  projects?: Project[];
  events?: Event[];
}

interface Props {
  profile: Profile;
}

defineProps<Props>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};
</script>

<style module>
.profileContent {
  padding: var(--spacing-2xl) 0 var(--spacing-4xl);
}

.layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-3xl);
  align-items: start;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: sticky;
  top: var(--spacing-xl);
}

.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.cardTitle {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.bio {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
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
  word-break: break-all;
}

.contactItem:hover {
  color: var(--primary);
}

.contactItem svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.socialList {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.socialLink {
  color: var(--primary);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast);
  padding: var(--spacing-xs) 0;
}

.socialLink:hover {
  color: var(--primary-dark);
}

/* Main Content */
.main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.sectionTitle {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 3px solid var(--primary);
  display: inline-block;
}

.grid {
  display: grid;
  gap: var(--spacing-lg);
}

/* Article Cards */
.articleCard {
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition: all var(--transition-base);
}

.articleCard:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.articleHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.articleTitle {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.readTime {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  white-space: nowrap;
}

.articleDescription {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-md) 0;
}

.articleFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border);
}

.date {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.readMore {
  font-size: var(--text-sm);
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.readMore:hover {
  color: var(--primary-dark);
}

/* Project Cards */
.projectCard {
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition: all var(--transition-base);
}

.projectCard:hover {
  border-color: var(--secondary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.projectHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.projectTitle {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.status {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  white-space: nowrap;
}

.statusCompleted {
  background-color: #d1fae5;
  color: #065f46;
}

.statusOngoing {
  background-color: #dbeafe;
  color: #1e40af;
}

.projectDescription {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-md) 0;
}

.projectFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border);
}

.year {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.projectLink {
  font-size: var(--text-sm);
  color: var(--secondary);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.projectLink:hover {
  color: var(--secondary-dark);
}

/* Event Cards */
.eventCard {
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition: all var(--transition-base);
}

.eventCard:hover {
  border-left-color: var(--accent-dark);
  box-shadow: var(--shadow-lg);
  transform: translateX(4px);
}

.eventTitle {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.eventDescription {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-md) 0;
}

.eventFooter {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.eventDate,
.eventLocation {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.eventDate svg,
.eventLocation svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .profileContent {
    padding: var(--spacing-xl) 0 var(--spacing-3xl);
  }

  .sectionTitle {
    font-size: var(--text-2xl);
  }

  .articleCard,
  .projectCard,
  .eventCard {
    padding: var(--spacing-lg);
  }

  .articleHeader,
  .projectHeader {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
