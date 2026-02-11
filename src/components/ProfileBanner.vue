<template>
  <div :class="$style.banner">
    <div :class="$style.bannerImage" :style="{ backgroundImage: `url(${profile.banner})` }">
      <div :class="$style.overlay"></div>
    </div>
    <div class="container">
      <div :class="$style.profileHeader">
        <div :class="$style.avatar">
          <span :class="$style.avatarText">{{ profile.avatar }}</span>
        </div>
        <div :class="$style.info">
          <h1 :class="$style.name">{{ profile.name }}</h1>
          <p :class="$style.profession">{{ profile.profession }}</p>
          <div :class="$style.meta">
            <span :class="$style.location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ profile.city }}
            </span>
          </div>
        </div>
        <div :class="$style.actions">
          <a :href="`mailto:${profile.email}`" :class="$style.contactButton" class="btn btn-primary">
            Entrar em Contato
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Profile {
  slug: string;
  name: string;
  profession: string;
  city: string;
  email: string;
  banner: string;
  avatar: string;
}

interface Props {
  profile: Profile;
}

defineProps<Props>();
</script>

<style module>
.banner {
  position: relative;
  background-color: var(--bg-dark);
  margin-bottom: var(--spacing-3xl);
}

.bannerImage {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
}

.profileHeader {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  margin-top: -80px;
}

.avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border: 6px solid var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-xl);
  z-index: 2;
}

.avatarText {
  font-size: var(--text-5xl);
  font-weight: 700;
  color: white;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-top: var(--spacing-lg);
}

.name {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  margin: 0;
}

.profession {
  font-size: var(--text-xl);
  color: var(--primary);
  font-weight: 600;
  margin: 0;
}

.meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xs);
}

.location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--text-base);
}

.location svg {
  width: 18px;
  height: 18px;
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
}

.contactButton {
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .bannerImage {
    height: 200px;
  }

  .profileHeader {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -60px;
    padding-bottom: var(--spacing-lg);
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .avatarText {
    font-size: var(--text-4xl);
  }

  .info {
    align-items: center;
    padding-top: 0;
  }

  .name {
    font-size: var(--text-3xl);
  }

  .profession {
    font-size: var(--text-lg);
  }

  .meta {
    justify-content: center;
  }

  .actions {
    width: 100%;
    padding-top: 0;
  }

  .contactButton {
    width: 100%;
  }
}
</style>
